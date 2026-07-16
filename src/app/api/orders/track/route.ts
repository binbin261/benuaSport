import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase/admin";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const q = (searchParams.get("q") || "").trim();
    if (!q) {
      return NextResponse.json({ ok: false, message: "Masukkan Order ID atau nomor WhatsApp." }, { status: 400 });
    }

    // Coba cocokkan sebagai Order ID langsung dulu (paling cepat, pakai doc id).
    const byId = await adminDb.collection("orders").doc(q.toUpperCase()).get();
    if (byId.exists) {
      return NextResponse.json({ ok: true, order: byId.data() });
    }

    // Kalau bukan, cocokkan berdasarkan nomor WhatsApp (cocok sebagian).
    const digits = q.replace(/\D/g, "");
    if (digits.length < 6) {
      return NextResponse.json({ ok: false, message: "Pesanan tidak ditemukan." });
    }

    const snap = await adminDb.collection("orders").orderBy("createdAt", "desc").get();
    const match = snap.docs.find((d) => (d.data().phone || "").replace(/\D/g, "").includes(digits));

    if (!match) {
      return NextResponse.json({ ok: false, message: "Pesanan tidak ditemukan." });
    }

    return NextResponse.json({ ok: true, order: match.data() });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ ok: false, message: "Gagal melacak pesanan." }, { status: 500 });
  }
}
