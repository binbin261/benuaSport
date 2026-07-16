import { adminDb } from "@/lib/firebase/admin";
import type { Product, Testimonial, Faq } from "@/lib/types";
import { CatalogSection } from "@/components/CatalogSection";

export const dynamic = "force-dynamic";


async function getHomeData() {
  const [productsSnap, testimonialsSnap, faqsSnap] = await Promise.all([
    adminDb.collection("products").get(),
    adminDb.collection("testimonials").get(),
    adminDb.collection("faqs").orderBy("order").limit(3).get(),
  ]);

  const products = productsSnap.docs.map((d) => ({ id: d.id, ...JSON.parse(JSON.stringify(d.data())) })) as Product[];
  const testimonials = testimonialsSnap.docs.map((d) => JSON.parse(JSON.stringify(d.data())) as Testimonial);
  const faqs = faqsSnap.docs.map((d) => JSON.parse(JSON.stringify(d.data())) as Faq);

  return { products, testimonials, faqs };
}

export default async function HomePage() {
  const { products, testimonials, faqs } = await getHomeData();
  const preorderCount = products.filter((p) => p.preorder).length;
  const totalSold = products.reduce((sum, p) => sum + (p.sold || 0), 0);

  return (
    <main>
      {/* HERO */}
      <section className="hero">
        <div className="wrap">
          <div>
            <span className="bib">TOKO OLAHRAGA READY STOCK &amp; PRE-ORDER</span>
            <h1>
              Gaskeun performa <span>tanpa kompromi</span>
            </h1>
            <p className="lead">
              Belanja perlengkapan olahraga favoritmu — dari sepatu lari sampai raket badminton edisi terbatas.
              Ready Stock dikirim cepat, Pre-Order dipantau transparan dari DP sampai barang sampai.
            </p>
            <div className="hero-ctas">
              <a href="#katalog" className="btn btn-primary">Belanja Sekarang</a>
              <a href="#preorder" className="btn btn-ghost">Cara Kerja Pre-Order</a>
            </div>
            <div className="hero-stats">
              <div className="stat"><b>{products.length}+</b><span>Produk Aktif</span></div>
              <div className="stat"><b>{preorderCount}</b><span>Batch Pre-Order</span></div>
              <div className="stat"><b>{totalSold.toLocaleString("id-ID")}+</b><span>Item Terjual</span></div>
            </div>
          </div>
          <div className="hero-visual">
            <div className="bib-card c1">
              <span className="ribbon">HOT</span>
              <span className="num">01</span>
              <span className="label">Sepatu Lari Aero X1</span>
            </div>
            <div className="bib-card c2">
              <span className="num">02</span>
              <span className="label">Jersey Match Day Home</span>
            </div>
            <div className="bib-card c3">
              <span className="num">03</span>
              <span className="label">Raket Carbon Pro</span>
            </div>
          </div>
        </div>
      </section>

      {/* KATALOG */}
      <section id="katalog" className="wrap">
        <div className="section-head">
          <div>
            <span className="eyebrow">Katalog</span>
            <h2>Semua Perlengkapan Olahraga</h2>
          </div>
          <p className="muted" style={{ maxWidth: 360 }}>
            Filter berdasarkan kategori favoritmu, lengkap dengan status Ready Stock atau Pre-Order.
          </p>
        </div>
        <CatalogSection products={products} />
      </section>

      {/* PREORDER STRIP */}
      <section id="preorder" className="preorder-strip">
        <div className="wrap strip-grid">
          <div>
            <span className="eyebrow" style={{ color: "var(--accent)", fontFamily: "JetBrains Mono", fontSize: 12.5, letterSpacing: 1.5 }}>
              CARA KERJA
            </span>
            <h2 style={{ margin: "10px 0 0" }}>Sistem Pre-Order yang Transparan</h2>
            <div className="steps">
              <div className="step">
                <span className="n">1</span>
                <div><h4>Bayar DP 30%</h4><p>Kunci slot batch terbatas dengan membayar uang muka minimum 30% dari harga produk.</p></div>
              </div>
              <div className="step">
                <span className="n">2</span>
                <div><h4>Pantau Prosesnya</h4><p>Cek status pesanan kapan saja lewat halaman Lacak Pesanan menggunakan Order ID atau nomor WhatsApp.</p></div>
              </div>
              <div className="step">
                <span className="n">3</span>
                <div><h4>Lunasi &amp; Terima Barang</h4><p>Kami hubungi kamu lewat WhatsApp untuk pelunasan mendekati estimasi kedatangan, lalu barang dikirim.</p></div>
              </div>
            </div>
          </div>
          <div className="countdown-card">
            <span className="eyebrow">BATCH PRE-ORDER AKTIF</span>
            <h3 style={{ margin: "10px 0 20px" }}>Cek estimasi kedatangan tiap produk</h3>
            <p className="muted" style={{ fontSize: 13.5, lineHeight: 1.7 }}>
              Setiap kartu produk Pre-Order menampilkan estimasi kedatangan dan besaran DP secara langsung,
              supaya kamu bisa merencanakan pembayaran pelunasan tanpa kejutan.
            </p>
            <a href="#katalog" className="btn btn-primary btn-block" style={{ marginTop: 18 }}>Lihat Produk Pre-Order</a>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="wrap">
        <div className="section-head">
          <div>
            <span className="eyebrow">Testimoni</span>
            <h2>Dipercaya Ribuan Atlet &amp; Penggiat Olahraga</h2>
          </div>
        </div>
        <div className="testimonial-grid">
          {testimonials.map((t, i) => (
            <div className="testimonial-card" key={i}>
              <div className="stars">{"★".repeat(t.stars)}{"☆".repeat(5 - t.stars)}</div>
              <p>&ldquo;{t.quote}&rdquo;</p>
              <div className="who"><b>{t.name}</b><span>{t.role}</span></div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ PREVIEW */}
      <section className="wrap">
        <div className="section-head">
          <div>
            <span className="eyebrow">FAQ</span>
            <h2>Pertanyaan yang Sering Ditanyakan</h2>
          </div>
          <a href="/tentang" className="btn btn-ghost">Lihat Semua FAQ</a>
        </div>
        <div>
          {faqs.map((f, i) => (
            <details className="faq-item" key={i}>
              <summary>{f.question}</summary>
              <p>{f.answer}</p>
            </details>
          ))}
        </div>
      </section>
    </main>
  );
}
