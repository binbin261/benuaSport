import { NextResponse } from "next/server";
import { adminDb, requireAdmin } from "@/lib/firebase/admin";
import { formatDateTimeID } from "@/lib/format";
import type { OrderStatus } from "@/lib/types";

const ALLOWED: OrderStatus[] = ["diproses", "dikirim", "selesai", "dibatalkan"];
const STEP_LABEL: Record<OrderStatus, string> = {
  diproses: "Pesanan diproses",
  dikirim: "Pesanan dikirim",
  selesai: "Pesanan selesai",
  dibatalkan: "Pesanan dibatalkan",
};

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const auth = await requireAdmin(req);
  if (!auth.ok) return NextResponse.json({ ok: false, message: auth.message }, { status: auth.status });

  try {
    const { status } = (await req.json()) as { status?: string };
    if (!status || !ALLOWED.includes(status as OrderStatus)) {
      return NextResponse.json({ ok: false, message: "Status tidak valid." }, { status: 400 });
    }

    const ref = adminDb.collection("orders").doc(params.id);
    const snap = await ref.get();
    if (!snap.exists) {
      return NextResponse.json({ ok: false, message: "Pesanan tidak ditemukan." }, { status: 404 });
    }

    const timeline = snap.data()?.timeline ?? [];
    timeline.push({ label: STEP_LABEL[status as OrderStatus], time: formatDateTimeID(), done: true });

    await ref.update({ status, timeline });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ ok: false, message: "Gagal mengubah status." }, { status: 500 });
  }
}
