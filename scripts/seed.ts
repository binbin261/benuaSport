/**
 * Jalankan sekali untuk mengisi Firestore dengan data awal (produk, voucher,
 * testimoni, FAQ).
 *
 *   npm run seed
 *
 * Pastikan FIREBASE_SERVICE_ACCOUNT_KEY_BASE64 sudah diisi di .env.local
 * sebelum menjalankan script ini.
 */
import { config as loadEnv } from "dotenv";
import path from "node:path";
import { existsSync } from "node:fs";
import { cert, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { seedProducts, seedVouchers, seedTestimonials, seedFaqs } from "../src/lib/seed-data";

const envPath = path.resolve(process.cwd(), ".env.local");
loadEnv({ path: envPath });

async function main() {
  console.log("Membaca env dari:", envPath, existsSync(envPath) ? "(ditemukan)" : "(TIDAK DITEMUKAN)");
  if (!existsSync(envPath)) {
    throw new Error(
      `File .env.local tidak ditemukan di ${envPath}. Jalankan "npm run seed" dari folder root project.`
    );
  }

  const rawBase64 = process.env.FIREBASE_SERVICE_ACCOUNT_KEY_BASE64;
  if (!rawBase64) {
    throw new Error(
      "FIREBASE_SERVICE_ACCOUNT_KEY_BASE64 belum terbaca dari .env.local."
    );
  }

  const decoded = Buffer.from(rawBase64.trim(), "base64").toString("utf-8");
  const serviceAccount = JSON.parse(decoded);
  console.log("Service account terbaca untuk project:", serviceAccount.project_id);

  const app = initializeApp({ credential: cert(serviceAccount) });
  const db = getFirestore(app);

  try {
    console.log(`Mengisi koleksi 'products' (${seedProducts.length} item)...`);
    for (const product of seedProducts) {
      await db.collection("products").doc().set(product);
    }

    console.log(`Mengisi koleksi 'vouchers' (${seedVouchers.length} item)...`);
    for (const voucher of seedVouchers) {
      await db.collection("vouchers").doc(voucher.code).set(voucher);
    }

    console.log(`Mengisi koleksi 'testimonials' (${seedTestimonials.length} item)...`);
    for (const t of seedTestimonials) {
      await db.collection("testimonials").doc().set(t);
    }

    console.log(`Mengisi koleksi 'faqs' (${seedFaqs.length} item)...`);
    for (let i = 0; i < seedFaqs.length; i++) {
      await db.collection("faqs").doc().set({ ...seedFaqs[i], order: i });
    }
  } catch (err: any) {
    console.error("Detail error dari Firestore:", err?.message ?? err);
    throw new Error(
      "Gagal menulis data ke Firestore. Cek apakah Firestore Database sudah dibuat dan service account punya izin."
    );
  }

  console.log("✅ Selesai. Firestore sudah terisi data awal Benua Sport.");
}

main().catch((err) => {
  console.error("Gagal seeding:", err);
  process.exit(1);
});
