import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase/admin";

export async function GET() {
  try {
    const snap = await adminDb.collection("faqs").orderBy("order").get();
    const faqs = snap.docs.map((d) => d.data());
    return NextResponse.json({ ok: true, faqs });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ ok: false, message: "Gagal mengambil FAQ." }, { status: 500 });
  }
}
