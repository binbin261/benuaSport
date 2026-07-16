import { NextResponse } from "next/server";
import { adminDb, requireAdmin } from "@/lib/firebase/admin";

export async function POST(req: Request) {
  const auth = await requireAdmin(req);
  if (!auth.ok) return NextResponse.json({ ok: false, message: auth.message }, { status: auth.status });

  try {
    const body = await req.json();
    const { name, category, price, stock, preorder, eta, icon } = body;

    if (!name || !category || !price || stock === undefined) {
      return NextResponse.json({ ok: false, message: "Data produk tidak lengkap." }, { status: 400 });
    }

    const ref = await adminDb.collection("products").add({
      name,
      category,
      icon: icon || "🏷️",
      price: Number(price),
      oldPrice: null,
      preorder: !!preorder,
      eta: preorder ? eta || null : null,
      dp: preorder ? 0.3 : null,
      stock: Number(stock),
      sold: 0,
    });

    return NextResponse.json({ ok: true, id: ref.id });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ ok: false, message: "Gagal menambah produk." }, { status: 500 });
  }
}
