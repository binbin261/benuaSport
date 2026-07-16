import { NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase/admin";

export async function GET() {
  try {
    const snap = await adminDb.collection("testimonials").get();
    const testimonials = snap.docs.map((d) => d.data());
    return NextResponse.json({ ok: true, testimonials });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ ok: false, message: "Gagal mengambil testimoni." }, { status: 500 });
  }
}
