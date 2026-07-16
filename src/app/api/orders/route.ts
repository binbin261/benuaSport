import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase/admin";
import { generateOrderId, formatDateTimeID } from "@/lib/format";
import { FieldValue } from "firebase-admin/firestore";

interface IncomingItem {
  productId: string;
  qty: number;
}

export async function POST(req: Request) {
  try {
    const { customerName, phone, items, voucherCode } = (await req.json()) as {
      customerName?: string;
      phone?: string;
      items?: IncomingItem[];
      voucherCode?: string | null;
    };

    if (!customerName || !phone || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ ok: false, message: "Data pesanan tidak lengkap." }, { status: 400 });
    }

    // Ambil detail produk (snapshot harga & nama saat ini) di luar transaksi read.
    const resolvedItems: { productId: string; productName: string; qty: number; price: number; preorder: boolean }[] = [];
    let subtotal = 0;

    for (const it of items) {
      const qty = Math.max(1, Number(it.qty) || 1);
      const productSnap = await adminDb.collection("products").doc(it.productId).get();
      if (!productSnap.exists) continue;
      const product = productSnap.data()!;
      subtotal += Number(product.price) * qty;
      resolvedItems.push({
        productId: it.productId,
        productName: product.name,
        qty,
        price: product.price,
        preorder: !!product.preorder,
      });
    }

    if (resolvedItems.length === 0) {
      return NextResponse.json({ ok: false, message: "Produk pada pesanan tidak ditemukan." }, { status: 400 });
    }

    let total = subtotal;
    let appliedVoucherCode: string | null = null;

    if (voucherCode) {
      const vSnap = await adminDb.collection("vouchers").doc(String(voucherCode).toUpperCase()).get();
      if (vSnap.exists && vSnap.data()?.isActive) {
        const voucher = vSnap.data()!;
        const discount = voucher.type === "percent" ? subtotal * (Number(voucher.value) / 100) : Math.min(Number(voucher.value), subtotal);
        total -= discount;
        appliedVoucherCode = voucher.code;
      }
    }
    total = Math.max(0, Math.round(total));

    const orderId = generateOrderId();
    const now = new Date();

    await adminDb.collection("orders").doc(orderId).set({
      id: orderId,
      customerName,
      phone,
      items: resolvedItems,
      voucherCode: appliedVoucherCode,
      total,
      paid: 0,
      status: "diproses",
      timeline: [{ label: "Pesanan diterima", time: formatDateTimeID(now), done: true }],
      createdAt: FieldValue.serverTimestamp(),
      createdAtDisplay: formatDateTimeID(now),
    });

    return NextResponse.json({ ok: true, orderId, total });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ ok: false, message: "Gagal membuat pesanan." }, { status: 500 });
  }
}
