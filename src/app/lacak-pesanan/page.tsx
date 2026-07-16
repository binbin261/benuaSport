"use client";

import { useState } from "react";
import type { Order } from "@/lib/types";
import { rupiah, statusLabel } from "@/lib/format";

export default function LacakPesananPage() {
  const [query, setQuery] = useState("");
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    setError(null);
    setOrder(null);
    setSearched(true);
    try {
      const res = await fetch(`/api/orders/track?q=${encodeURIComponent(query.trim())}`);
      const data = await res.json();
      if (!data.ok) {
        setError(data.message || "Pesanan tidak ditemukan.");
        return;
      }
      setOrder(data.order);
    } catch {
      setError("Tidak bisa menghubungi server. Coba lagi.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="wrap" style={{ paddingTop: 60, paddingBottom: 80, minHeight: "60vh" }}>
      <div className="section-head">
        <div>
          <span className="eyebrow">Lacak Pesanan</span>
          <h2>Cek Status Pesanan Kamu</h2>
        </div>
      </div>

      <form onSubmit={handleSearch} style={{ maxWidth: 460, display: "flex", gap: 10, marginBottom: 40 }}>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Order ID (BS-...) atau nomor WhatsApp"
          style={{ flex: 1, background: "var(--bg-card)", border: "1px solid var(--line)", borderRadius: 10, padding: "13px 16px", color: "var(--text)", fontSize: 14 }}
        />
        <button className="btn btn-primary" disabled={loading}>{loading ? "Mencari..." : "Lacak"}</button>
      </form>

      {error && <p className="hint error" style={{ marginBottom: 30 }}>{error}</p>}

      {order && (
        <div className="table-card" style={{ padding: 28, maxWidth: 680 }}>
          <div className="admin-topline">
            <div>
              <span className="mono muted" style={{ fontSize: 12.5 }}>{order.id}</span>
              <h3 style={{ margin: "6px 0 0" }}>{order.customerName}</h3>
            </div>
            <span className={`status-pill status-${order.status}`}>{statusLabel(order.status)}</span>
          </div>

          <div style={{ marginBottom: 24 }}>
            {order.items.map((it, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid var(--line)", fontSize: 14 }}>
                <span>{it.productName} × {it.qty} {it.preorder && <span className="tag tag-preorder" style={{ marginLeft: 8 }}>Pre-Order</span>}</span>
                <span className="mono">{rupiah(it.price * it.qty)}</span>
              </div>
            ))}
            <div style={{ display: "flex", justifyContent: "space-between", paddingTop: 14, fontWeight: 700 }}>
              <span>Total</span>
              <span className="mono" style={{ color: "var(--accent)" }}>{rupiah(order.total)}</span>
            </div>
          </div>

          <h4 style={{ marginBottom: 16 }}>Riwayat Pesanan</h4>
          <div className="timeline">
            {order.timeline.map((t, i) => (
              <div className={`timeline-item ${t.done ? "done" : ""}`} key={i}>
                <span className="dot" />
                <div><b>{t.label}</b><span>{t.time}</span></div>
              </div>
            ))}
          </div>
        </div>
      )}

      {!order && !error && searched === false && (
        <p className="muted" style={{ fontSize: 13.5 }}>
          Masukkan Order ID (contoh: BS-20260701-114) atau nomor WhatsApp yang kamu daftarkan saat checkout.
        </p>
      )}
    </main>
  );
}
