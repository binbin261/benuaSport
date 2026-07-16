import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase/admin";

export async function GET() {
  try {
    const snap = await adminDb.collection("products").get();
    const products = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    return NextResponse.json({ ok: true, products });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ ok: false, message: "Gagal mengambil data produk." }, { status: 500 });
  }
}
