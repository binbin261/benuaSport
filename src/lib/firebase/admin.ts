import { cert, getApps, initializeApp, type App } from "firebase-admin/app";
import { getFirestore, type Firestore } from "firebase-admin/firestore";
import { getAuth, type Auth } from "firebase-admin/auth";

/**
 * Inisialisasi Firebase Admin SDK (dipakai di API routes / server-side saja,
 * TIDAK pernah diimpor dari komponen client).
 *
 * FIREBASE_SERVICE_ACCOUNT_KEY_BASE64 harus berisi hasil encode Base64
 * dari file JSON service account Firebase (lihat .env.local.example).
 */
function createAdminApp(): App {
  if (getApps().length) return getApps()[0];

  const rawBase64 = process.env.FIREBASE_SERVICE_ACCOUNT_KEY_BASE64;
  if (!rawBase64) {
    throw new Error(
      "FIREBASE_SERVICE_ACCOUNT_KEY_BASE64 belum diatur di .env.local. Lihat .env.local.example untuk caranya."
    );
  }

  let serviceAccount;
  try {
    const decoded = Buffer.from(rawBase64.trim(), "base64").toString("utf-8");
    serviceAccount = JSON.parse(decoded);
  } catch (error) {
    console.error("Gagal melakukan parse FIREBASE_SERVICE_ACCOUNT_KEY_BASE64:", error);
    throw new Error(
      "Format Base64/JSON pada FIREBASE_SERVICE_ACCOUNT_KEY_BASE64 tidak valid. Pastikan kamu meng-encode seluruh isi file JSON service account tanpa modifikasi."
    );
  }

  return initializeApp({
    credential: cert(serviceAccount),
  });
}

const adminApp = createAdminApp();

export const adminDb: Firestore = getFirestore(adminApp);
export const adminAuth: Auth = getAuth(adminApp);

/**
 * Verifikasi token ID Firebase dari header Authorization: Bearer <token>
 * dan pastikan user tersebut admin (field isAdmin = true di koleksi users).
 */
export async function requireAdmin(req: Request) {
  const authHeader = req.headers.get("authorization") || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;
  if (!token) {
    return { ok: false as const, status: 401, message: "Token tidak ditemukan. Silakan masuk kembali." };
  }
  try {
    const decoded = await adminAuth.verifyIdToken(token);
    const userDoc = await adminDb.collection("users").doc(decoded.uid).get();
    const isAdmin = userDoc.exists && userDoc.data()?.isAdmin === true;
    if (!isAdmin) {
      return { ok: false as const, status: 403, message: "Akun kamu tidak memiliki akses admin." };
    }
    return { ok: true as const, uid: decoded.uid };
  } catch (err) {
    return { ok: false as const, status: 401, message: "Token tidak valid atau kedaluwarsa." };
  }
}