import { NextResponse } from "next/server";
import { adminDb, requireAdmin } from "@/lib/firebase/admin";

export async function GET(req: Request) {
  const auth = await requireAdmin(req);
  if (!auth.ok) return NextResponse.json({ ok: false, message: auth.message }, { status: auth.status });

  try {
    const snap = await adminDb.collection("orders").orderBy("createdAt", "desc").get();
    const orders = snap.docs.map((d) => d.data());
    return NextResponse.json({ ok: true, orders });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ ok: false, message: "Gagal mengambil daftar pesanan." }, { status: 500 });
  }
}
