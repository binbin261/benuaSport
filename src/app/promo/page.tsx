import { adminDb } from "@/lib/firebase/admin";
import type { Voucher } from "@/lib/types";

export const dynamic = "force-dynamic";

async function getVouchers() {
  const snap = await adminDb.collection("vouchers").where("isActive", "==", true).get();
  return snap.docs.map((d) => d.data()) as Voucher[];
}

export default async function PromoPage() {
  const vouchers = await getVouchers();

  return (
    <main className="wrap" style={{ paddingTop: 60, paddingBottom: 90, minHeight: "60vh" }}>
      <div className="section-head">
        <div>
          <span className="eyebrow">Promo</span>
          <h2>Kode Promo Aktif</h2>
        </div>
      </div>

      <div className="grid" style={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
        {vouchers.map((v) => (
          <div className="card" key={v.code} style={{ padding: 24 }}>
            <span className="tag tag-preorder" style={{ marginBottom: 14, width: "fit-content" }}>
              {v.type === "percent" ? `${v.value}% OFF` : `Rp${v.value.toLocaleString("id-ID")} OFF`}
            </span>
            <h3 className="mono" style={{ fontSize: 22, margin: "0 0 10px", color: "var(--accent)" }}>{v.code}</h3>
            <p className="muted" style={{ fontSize: 13.5, lineHeight: 1.6, margin: 0 }}>{v.label}</p>
          </div>
        ))}
        {vouchers.length === 0 && <p className="muted">Belum ada kode promo aktif saat ini.</p>}
      </div>
    </main>
  );
}
