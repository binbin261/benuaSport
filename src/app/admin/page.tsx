"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";
import { auth } from "@/lib/firebase/client";
import type { Order, Product, OrderStatus } from "@/lib/types";
import { rupiah, statusLabel } from "@/lib/format";

type Panel = "ringkasan" | "produk" | "pesanan" | "promo";
const STATUS_TABS: (OrderStatus | "Semua")[] = ["Semua", "diproses", "dikirim", "selesai", "dibatalkan"];

export default function AdminPage() {
  const { appUser, loading } = useAuth();
  const router = useRouter();
  const [panel, setPanel] = useState<Panel>("ringkasan");
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "Semua">("Semua");
  const [busy, setBusy] = useState(false);
  const [showProductForm, setShowProductForm] = useState(false);

  useEffect(() => {
    if (!loading && (!appUser || !appUser.isAdmin)) {
      router.push("/login");
    }
  }, [loading, appUser, router]);

  const authedFetch = useCallback(async (url: string, options: RequestInit = {}) => {
    const token = await auth.currentUser?.getIdToken();
    return fetch(url, {
      ...options,
      headers: { ...options.headers, Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    });
  }, []);

  const loadData = useCallback(async () => {
    const [pRes, oRes] = await Promise.all([fetch("/api/products"), authedFetch("/api/admin/orders")]);
    const pData = await pRes.json();
    const oData = await oRes.json();
    if (pData.ok) setProducts(pData.products);
    if (oData.ok) setOrders(oData.orders);
  }, [authedFetch]);

  useEffect(() => {
    if (appUser?.isAdmin) loadData();
  }, [appUser, loadData]);

  if (loading || !appUser?.isAdmin) {
    return <main className="wrap" style={{ padding: "80px 0" }}>Memeriksa akses admin...</main>;
  }

  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const topProducts = [...products].sort((a, b) => b.sold - a.sold).slice(0, 5);
  const filteredOrders = statusFilter === "Semua" ? orders : orders.filter((o) => o.status === statusFilter);

  async function updateOrderStatus(id: string, status: OrderStatus) {
    setBusy(true);
    try {
      await authedFetch(`/api/admin/orders/${id}/status`, { method: "PATCH", body: JSON.stringify({ status }) });
      await loadData();
    } finally {
      setBusy(false);
    }
  }

  async function deleteProduct(id: string) {
    if (!confirm("Hapus produk ini?")) return;
    setBusy(true);
    try {
      await authedFetch(`/api/admin/products/${id}`, { method: "DELETE" });
      await loadData();
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="wrap" style={{ paddingTop: 40, paddingBottom: 90, minHeight: "70vh" }}>
      <div className="tabs" style={{ marginBottom: 30 }}>
        {(["ringkasan", "produk", "pesanan", "promo"] as Panel[]).map((p) => (
          <button key={p} className={`tab ${panel === p ? "active" : ""}`} onClick={() => setPanel(p)}>
            {p[0].toUpperCase() + p.slice(1)}
          </button>
        ))}
      </div>

      {panel === "ringkasan" && (
        <section>
          <div className="admin-topline"><h1>Ringkasan Bisnis</h1></div>
          <div className="kpi-grid">
            <div className="kpi-card"><span>Total Produk</span><b>{products.length}</b></div>
            <div className="kpi-card"><span>Total Pesanan</span><b>{orders.length}</b></div>
            <div className="kpi-card"><span>Total Pendapatan</span><b style={{ fontSize: 20 }}>{rupiah(totalRevenue)}</b></div>
            <div className="kpi-card"><span>Produk Pre-Order</span><b>{products.filter((p) => p.preorder).length}</b></div>
          </div>
          <div className="table-card">
            <table className="data">
              <thead><tr><th>Produk Terlaris</th><th>Kategori</th><th>Terjual</th><th>Stok Tersisa</th></tr></thead>
              <tbody>
                {topProducts.map((p) => (
                  <tr key={p.id}><td>{p.icon} {p.name}</td><td>{p.category}</td><td>{p.sold}</td><td>{p.stock}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {panel === "produk" && (
        <section>
          <div className="admin-topline">
            <h1>Kelola Produk</h1>
            <button className="btn btn-primary btn-sm" onClick={() => setShowProductForm(true)}>+ Tambah Produk</button>
          </div>
          {showProductForm && (
            <ProductForm
              onClose={() => setShowProductForm(false)}
              onSaved={async () => { setShowProductForm(false); await loadData(); }}
              authedFetch={authedFetch}
            />
          )}
          <div className="table-card">
            <table className="data">
              <thead><tr><th>Produk</th><th>Kategori</th><th>Harga</th><th>Stok</th><th>Tipe</th><th></th></tr></thead>
              <tbody>
                {products.map((p) => (
                  <tr key={p.id}>
                    <td>{p.icon} {p.name}</td>
                    <td>{p.category}</td>
                    <td className="mono">{rupiah(p.price)}</td>
                    <td>{p.stock}</td>
                    <td>{p.preorder ? <span className="tag tag-preorder">Pre-Order</span> : <span className="tag tag-ready">Ready</span>}</td>
                    <td><button className="btn btn-ghost btn-sm" disabled={busy} onClick={() => deleteProduct(p.id)}>Hapus</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {panel === "pesanan" && (
        <section>
          <div className="admin-topline"><h1>Semua Pesanan</h1></div>
          <div className="tabs">
            {STATUS_TABS.map((s) => (
              <button key={s} className={`tab ${statusFilter === s ? "active" : ""}`} onClick={() => setStatusFilter(s)}>
                {s === "Semua" ? "Semua" : statusLabel(s)}
              </button>
            ))}
          </div>
          <div className="table-card">
            <table className="data">
              <thead><tr><th>Order ID</th><th>Pelanggan</th><th>Produk</th><th>Total</th><th>Status</th><th></th></tr></thead>
              <tbody>
                {filteredOrders.map((o) => (
                  <tr key={o.id}>
                    <td className="mono">{o.id}</td>
                    <td>{o.customerName}<br /><span className="hint">{o.phone}</span></td>
                    <td>{o.items.map((it) => it.productName).join(", ")}</td>
                    <td className="mono">{rupiah(o.total)}</td>
                    <td><span className={`status-pill status-${o.status}`}>{statusLabel(o.status)}</span></td>
                    <td>
                      <select
                        value={o.status}
                        disabled={busy}
                        onChange={(e) => updateOrderStatus(o.id, e.target.value as OrderStatus)}
                        style={{ background: "var(--bg-alt)", border: "1px solid var(--line)", color: "var(--text)", borderRadius: 8, padding: "6px 10px", fontSize: 12.5 }}
                      >
                        {(["diproses", "dikirim", "selesai", "dibatalkan"] as OrderStatus[]).map((s) => (
                          <option key={s} value={s}>{statusLabel(s)}</option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {panel === "promo" && (
        <section>
          <div className="admin-topline"><h1>Kode Promo</h1></div>
          <p className="muted" style={{ fontSize: 13.5 }}>
            Kelola kode promo langsung lewat Firestore Console pada koleksi <code className="mono">vouchers</code> —
            tiap dokumen memakai kode voucher sebagai ID (mis. <code className="mono">BENUA10</code>).
          </p>
        </section>
      )}
    </main>
  );
}

function ProductForm({
  onClose,
  onSaved,
  authedFetch,
}: {
  onClose: () => void;
  onSaved: () => void;
  authedFetch: (url: string, options?: RequestInit) => Promise<Response>;
}) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("Lari");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [icon, setIcon] = useState("🏷️");
  const [preorder, setPreorder] = useState(false);
  const [eta, setEta] = useState("");
  const [saving, setSaving] = useState(false);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      await authedFetch("/api/admin/products", {
        method: "POST",
        body: JSON.stringify({ name, category, price: Number(price), stock: Number(stock), icon, preorder, eta }),
      });
      onSaved();
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="table-card" style={{ padding: 22, marginBottom: 20 }}>
      <form onSubmit={save}>
        <div className="field"><label>Nama Produk</label><input required value={name} onChange={(e) => setName(e.target.value)} placeholder="Contoh: Sepatu Lari Terbaru" /></div>
        <div className="field">
          <label>Kategori</label>
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            {["Lari", "Sepak Bola", "Basket", "Raket", "Gym"].map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div className="field"><label>Ikon (emoji)</label><input value={icon} onChange={(e) => setIcon(e.target.value)} /></div>
        <div className="field"><label>Harga (Rp)</label><input type="number" required value={price} onChange={(e) => setPrice(e.target.value)} placeholder="Contoh: 499000" /></div>
        <div className="field"><label>Stok</label><input type="number" required value={stock} onChange={(e) => setStock(e.target.value)} placeholder="Contoh: 25" /></div>
        <label style={{ display: "flex", gap: 8, alignItems: "center", fontSize: 13, color: "var(--muted)", marginBottom: 16 }}>
          <input type="checkbox" style={{ width: "auto" }} checked={preorder} onChange={(e) => setPreorder(e.target.checked)} /> Produk Pre-Order
        </label>
        {preorder && (
          <div className="field"><label>Estimasi Pengiriman</label><input value={eta} onChange={(e) => setEta(e.target.value)} placeholder="Contoh: 3–4 minggu" /></div>
        )}
        <div style={{ display: "flex", gap: 10 }}>
          <button className="btn btn-primary" type="submit" disabled={saving}>{saving ? "Menyimpan..." : "Simpan Produk"}</button>
          <button className="btn btn-ghost" type="button" onClick={onClose}>Batal</button>
        </div>
      </form>
    </div>
  );
}
