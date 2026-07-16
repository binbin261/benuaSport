import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase/admin";

export async function POST(req: Request) {
  try {
    const { code, amount } = await req.json();
    const docRef = adminDb.collection("vouchers").doc(String(code || "").toUpperCase());
    const snap = await docRef.get();

    if (!snap.exists || snap.data()?.isActive !== true) {
      return NextResponse.json({ ok: false, message: "Kode voucher tidak ditemukan." });
    }

    const voucher = snap.data()!;
    const amt = Number(amount) || 0;
    const discount = voucher.type === "percent" ? amt * (Number(voucher.value) / 100) : Math.min(Number(voucher.value), amt);

    return NextResponse.json({ ok: true, voucher, discount: Math.round(discount) });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ ok: false, message: "Gagal memeriksa voucher." }, { status: 500 });
  }
}
