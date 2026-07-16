"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  type ConfirmationResult,
} from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "@/lib/firebase/client";

type Tab = "login" | "register";

export default function LoginPage() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("login");
  const [result, setResult] = useState<{ ok: boolean; message: string } | null>(null);
  const [busy, setBusy] = useState(false);

  // login fields
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // register fields
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPhone, setRegPhone] = useState("");
  const [regPassword, setRegPassword] = useState("");

  // WhatsApp / phone OTP flow (via Firebase Phone Authentication)
  const [waOpen, setWaOpen] = useState(false);
  const [waPhone, setWaPhone] = useState("");
  const [waOtp, setWaOtp] = useState("");
  const [confirmation, setConfirmation] = useState<ConfirmationResult | null>(null);

  function showResult(ok: boolean, message: string) {
    setResult({ ok, message });
  }

  async function upsertUserDoc(uid: string, data: Record<string, unknown>) {
    await setDoc(doc(db, "users", uid), { ...data, updatedAt: serverTimestamp() }, { merge: true });
  }

  async function submitLogin(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setResult(null);
    try {
      const cred = await signInWithEmailAndPassword(auth, loginEmail, loginPassword);
      showResult(true, `Berhasil masuk sebagai ${cred.user.displayName || cred.user.email}.`);
      router.push("/");
    } catch (err: any) {
      showResult(false, mapAuthError(err?.code));
    } finally {
      setBusy(false);
    }
  }

  async function submitRegister(e: React.FormEvent) {
    e.preventDefault();
    if (regPassword.length < 8) {
      showResult(false, "Kata sandi minimal 8 karakter.");
      return;
    }
    setBusy(true);
    setResult(null);
    try {
      const cred = await createUserWithEmailAndPassword(auth, regEmail, regPassword);
      await upsertUserDoc(cred.user.uid, {
        name: regName,
        email: regEmail,
        phone: regPhone,
        provider: "password",
        isAdmin: false,
        createdAt: serverTimestamp(),
      });
      showResult(true, `Akun berhasil dibuat. Selamat datang, ${regName}!`);
      router.push("/");
    } catch (err: any) {
      showResult(false, mapAuthError(err?.code));
    } finally {
      setBusy(false);
    }
  }

  async function loginWithGoogle() {
    setBusy(true);
    setResult(null);
    try {
      const cred = await signInWithPopup(auth, new GoogleAuthProvider());
      await upsertUserDoc(cred.user.uid, {
        name: cred.user.displayName,
        email: cred.user.email,
        provider: "google",
        isAdmin: false,
      });
      showResult(true, "Berhasil masuk dengan Google.");
      router.push("/");
    } catch (err: any) {
      showResult(false, mapAuthError(err?.code));
    } finally {
      setBusy(false);
    }
  }

  function openWhatsappFlow() {
    setWaOpen(true);
    setConfirmation(null);
    setResult(null);
  }

  async function requestOtp() {
    setBusy(true);
    setResult(null);
    try {
      // Catatan: sistem lama menyebut ini "OTP WhatsApp". Firebase tidak punya
      // kanal WhatsApp native, jadi di sini digantikan Firebase Phone
      // Authentication (OTP dikirim via SMS ke nomor yang sama).
      const verifier = new RecaptchaVerifier(auth, "recaptcha-container", { size: "invisible" });
      const formatted = waPhone.startsWith("+") ? waPhone : `+62${waPhone.replace(/^0/, "")}`;
      const confirmationResult = await signInWithPhoneNumber(auth, formatted, verifier);
      setConfirmation(confirmationResult);
    } catch (err: any) {
      showResult(false, mapAuthError(err?.code));
    } finally {
      setBusy(false);
    }
  }

  async function verifyOtp() {
    if (!confirmation) return;
    setBusy(true);
    setResult(null);
    try {
      const cred = await confirmation.confirm(waOtp);
      await upsertUserDoc(cred.user.uid, {
        name: cred.user.displayName || "Pengguna Benua Sport",
        phone: cred.user.phoneNumber,
        provider: "phone",
        isAdmin: false,
      });
      showResult(true, "Berhasil masuk dengan nomor WhatsApp.");
      router.push("/");
    } catch (err: any) {
      showResult(false, mapAuthError(err?.code));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="auth-shell">
      <div className="auth-card">
        <div style={{ textAlign: "center", marginBottom: 22 }}>
          <div className="logo" style={{ justifyContent: "center", marginBottom: 8 }}>
            <span className="dot" />BENUA SPORT
          </div>
          <p className="muted" style={{ fontSize: 13.5, margin: 0 }}>Masuk untuk memantau pesanan &amp; pre-order kamu.</p>
        </div>

        <div className="auth-switch">
          <button className={tab === "login" ? "active" : ""} onClick={() => { setTab("login"); setResult(null); setWaOpen(false); }}>Masuk</button>
          <button className={tab === "register" ? "active" : ""} onClick={() => { setTab("register"); setResult(null); setWaOpen(false); }}>Daftar Akun</button>
        </div>

        {tab === "login" ? (
          <form onSubmit={submitLogin}>
            <div className="field"><label>Email</label><input type="email" required value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} placeholder="nama@email.com" /></div>
            <div className="field"><label>Kata Sandi</label><input type="password" required value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} placeholder="Masukkan kata sandi" /></div>
            <button type="submit" className="btn btn-primary btn-block" disabled={busy}>Masuk ke Akun</button>
          </form>
        ) : (
          <form onSubmit={submitRegister}>
            <div className="field"><label>Nama Lengkap</label><input required value={regName} onChange={(e) => setRegName(e.target.value)} placeholder="Nama kamu" /></div>
            <div className="field"><label>Email</label><input type="email" required value={regEmail} onChange={(e) => setRegEmail(e.target.value)} placeholder="nama@email.com" /></div>
            <div className="field"><label>Nomor WhatsApp</label><input type="tel" required value={regPhone} onChange={(e) => setRegPhone(e.target.value)} placeholder="08xxxxxxxxxx" /></div>
            <div className="field"><label>Buat Kata Sandi</label><input type="password" required minLength={8} value={regPassword} onChange={(e) => setRegPassword(e.target.value)} placeholder="Minimal 8 karakter" /></div>
            <button type="submit" className="btn btn-primary btn-block" disabled={busy}>Buat Akun Baru</button>
          </form>
        )}

        <div className="auth-divider">atau lanjutkan dengan</div>
        <div style={{ display: "flex", gap: 10 }}>
          <button className="btn btn-ghost btn-block" type="button" onClick={loginWithGoogle} disabled={busy}>Google</button>
          <button className="btn btn-ghost btn-block" type="button" onClick={openWhatsappFlow}>WhatsApp</button>
        </div>

        {waOpen && (
          <div style={{ marginTop: 20, borderTop: "1px solid var(--line)", paddingTop: 20 }}>
            {!confirmation ? (
              <>
                <div className="field"><label>Nomor WhatsApp</label><input type="tel" value={waPhone} onChange={(e) => setWaPhone(e.target.value)} placeholder="08xxxxxxxxxx" /></div>
                <button className="btn btn-ghost btn-block" type="button" onClick={requestOtp} disabled={busy}>Kirim Kode OTP</button>
              </>
            ) : (
              <>
                <p className="hint" style={{ marginBottom: 10 }}>Kode OTP telah dikirim lewat SMS ke nomor kamu.</p>
                <div className="field"><label>Kode OTP (6 digit)</label><input maxLength={6} value={waOtp} onChange={(e) => setWaOtp(e.target.value)} placeholder="123456" /></div>
                <button className="btn btn-primary btn-block" type="button" onClick={verifyOtp} disabled={busy}>Verifikasi &amp; Masuk</button>
              </>
            )}
          </div>
        )}
        <div id="recaptcha-container" />

        {result && (
          <div style={{ marginTop: 18 }}>
            {result.ok ? (
              <div className="voucher-applied"><span>✓ {result.message}</span></div>
            ) : (
              <p className="hint error">{result.message}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function mapAuthError(code?: string): string {
  const map: Record<string, string> = {
    "auth/invalid-credential": "Email atau kata sandi salah.",
    "auth/user-not-found": "Akun tidak ditemukan. Silakan daftar terlebih dahulu.",
    "auth/wrong-password": "Email atau kata sandi salah.",
    "auth/email-already-in-use": "Email sudah terdaftar. Silakan masuk.",
    "auth/weak-password": "Kata sandi minimal 8 karakter.",
    "auth/invalid-phone-number": "Nomor WhatsApp tidak valid.",
    "auth/invalid-verification-code": "Kode OTP salah.",
    "auth/code-expired": "Kode OTP kedaluwarsa, minta kode baru.",
    "auth/popup-closed-by-user": "Proses masuk dengan Google dibatalkan.",
  };
  return map[code || ""] || "Terjadi kesalahan. Silakan coba lagi.";
}
