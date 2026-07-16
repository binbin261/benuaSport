"use client";

import { useState, useEffect } from "react";
import { useCart } from "./CartProvider";
import { rupiah } from "@/lib/format";

export function CartDrawer() {
  const { lines, isOpen, closeCart, updateQty, removeLine, subtotal, clearCart } = useCart();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [voucherCode, setVoucherCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [voucherMessage, setVoucherMessage] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{ ok: boolean; message: string; orderId?: string } | null>(null);

  useEffect(() => {
    if (result?.ok && lines.length > 0) {
      setResult(null);
      setName("");
      setPhone("");
      setVoucherCode("");
      setDiscount(0);
      setVoucherMessage(null);
    }
  }, [lines, result]);

  useEffect(() => {
    if (!isOpen) {
      setResult(null);
      setDiscount(0);
      setVoucherMessage(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const total = Math.max(0, subtotal - discount);

  async function applyVoucher() {
    setVoucherMessage(null);
    if (!voucherCode.trim()) return;
    try {
      const res = await fetch("/api/vouchers/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: voucherCode, amount: subtotal }),
      });
      const data = await res.json();
      if (!data.ok) {
        setDiscount(0);
        setVoucherMessage(data.message || "Kode voucher tidak valid.");
        return;
      }
      setDiscount(data.discount);
      setVoucherMessage(`Voucher diterapkan: -${rupiah(data.discount)}`);
    } catch {
      setVoucherMessage("Gagal menghubungi server. Coba lagi.");
    }
  }

  async function submitOrder() {
    setResult(null);
    if (!name.trim() || !phone.trim() || lines.length === 0) {
      setResult({ ok: false, message: "Lengkapi nama, nomor WhatsApp, dan pastikan keranjang tidak kosong." });
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: name,
          phone,
          items: lines.map((l) => ({ productId: l.productId, qty: l.qty })),
          voucherCode: voucherCode.trim() || null,
        }),
      });
      const data = await res.json();
      if (!data.ok) {
        setResult({ ok: false, message: data.message || "Gagal membuat pesanan." });
        return;
      }
      setResult({ ok: true, message: "Pesanan berhasil dibuat!", orderId: data.orderId });
      clearCart();
    } catch {
      setResult({ ok: false, message: "Tidak bisa menghubungi server. Coba lagi." });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <div className="cart-overlay" onClick={closeCart} />
      <div className="cart-drawer">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <h3 style={{ margin: 0 }}>Keranjang</h3>
          <button className="btn btn-ghost btn-sm" onClick={closeCart}>Tutup</button>
        </div>

        {result?.ok ? (
          <div className="empty-state">
            <p style={{ color: "var(--accent)", fontWeight: 700 }}>{result.message}</p>
            <p className="mono">Order ID: {result.orderId}</p>
            <p className="hint">Simpan Order ID ini untuk melacak status pesanan kamu di halaman Lacak Pesanan.</p>
          </div>
        ) : lines.length === 0 ? (
          <div className="empty-state">Keranjang kamu masih kosong.</div>
        ) : (
          <>
            {lines.map((l) => (
              <div className="cart-line" key={l.productId}>
                <span className="ico">{l.icon}</span>
                <div className="info">
                  <b>{l.name}</b>
                  <span className="hint">{rupiah(l.price)} {l.preorder && "· Pre-Order"}</span>
                </div>
                <div className="qty-control">
                  <button onClick={() => updateQty(l.productId, l.qty - 1)}>−</button>
                  <span>{l.qty}</span>
                  <button onClick={() => updateQty(l.productId, l.qty + 1)}>+</button>
                </div>
                <button className="btn-ghost btn-sm btn" onClick={() => removeLine(l.productId)}>✕</button>
              </div>
            ))}

            <div style={{ marginTop: 20 }}>
              <div className="field">
                <label>Kode Promo</label>
                <div style={{ display: "flex", gap: 8 }}>
                  <input value={voucherCode} onChange={(e) => setVoucherCode(e.target.value)} placeholder="Contoh: BENUA10" />
                  <button className="btn btn-secondary btn-sm" onClick={applyVoucher} type="button">Terapkan</button>
                </div>
                {voucherMessage && <p className={discount > 0 ? "hint" : "hint error"} style={{ marginTop: 8 }}>{voucherMessage}</p>}
              </div>

              <div className="field">
                <label>Nama Lengkap</label>
                <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Nama kamu" />
              </div>
              <div className="field">
                <label>Nomor WhatsApp</label>
                <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="08xxxxxxxxxx" />
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", margin: "16px 0", fontSize: 14 }}>
                <span className="muted">Subtotal</span>
                <span>{rupiah(subtotal)}</span>
              </div>
              {discount > 0 && (
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16, fontSize: 14 }}>
                  <span className="muted">Diskon</span>
                  <span>-{rupiah(discount)}</span>
                </div>
              )}
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20, fontSize: 17, fontWeight: 700 }}>
                <span>Total</span>
                <span className="mono" style={{ color: "var(--accent)" }}>{rupiah(total)}</span>
              </div>

              {result && !result.ok && <p className="hint error" style={{ marginBottom: 12 }}>{result.message}</p>}

              <button className="btn btn-primary btn-block" onClick={submitOrder} disabled={submitting}>
                {submitting ? "Memproses..." : "Buat Pesanan"}
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
}
