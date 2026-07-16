import { NextResponse } from "next/server";
import { adminDb, requireAdmin } from "@/lib/firebase/admin";

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const auth = await requireAdmin(req);
  if (!auth.ok) return NextResponse.json({ ok: false, message: auth.message }, { status: auth.status });

  try {
    const body = await req.json();
    const { name, category, price, stock, preorder, eta, icon } = body;

    await adminDb
      .collection("products")
      .doc(params.id)
      .update({
        ...(name !== undefined && { name }),
        ...(category !== undefined && { category }),
        ...(icon !== undefined && { icon }),
        ...(price !== undefined && { price: Number(price) }),
        ...(stock !== undefined && { stock: Number(stock) }),
        ...(preorder !== undefined && { preorder: !!preorder }),
        ...(eta !== undefined && { eta }),
      });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ ok: false, message: "Gagal memperbarui produk." }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const auth = await requireAdmin(req);
  if (!auth.ok) return NextResponse.json({ ok: false, message: auth.message }, { status: auth.status });

  try {
    await adminDb.collection("products").doc(params.id).delete();
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ ok: false, message: "Gagal menghapus produk." }, { status: 500 });
  }
}
