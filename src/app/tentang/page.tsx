import { adminDb } from "@/lib/firebase/admin";
import type { Testimonial, Faq } from "@/lib/types";

export const dynamic = "force-dynamic";

async function getData() {
  const [testimonialsSnap, faqsSnap] = await Promise.all([
    adminDb.collection("testimonials").get(),
    adminDb.collection("faqs").orderBy("order").get(),
  ]);
  return {
    testimonials: testimonialsSnap.docs.map((d) => d.data()) as Testimonial[],
    faqs: faqsSnap.docs.map((d) => d.data()) as Faq[],
  };
}

export default async function TentangPage() {
  const { testimonials, faqs } = await getData();

  return (
    <main>
      <section className="wrap" style={{ paddingTop: 60 }}>
        <div className="section-head">
          <div>
            <span className="eyebrow">Tentang Kami</span>
            <h2>Benua Sport</h2>
          </div>
        </div>
        <p className="muted" style={{ maxWidth: 640, fontSize: 15, lineHeight: 1.8 }}>
          Benua Sport adalah toko olahraga online yang menggabungkan produk Ready Stock dengan sistem Pre-Order
          untuk batch terbatas. Kami percaya proses belanja — terutama Pre-Order — harus terasa transparan:
          kamu tahu persis berapa DP yang dibayar, kapan estimasi barang tiba, dan bisa memantau status
          pesanan kapan saja lewat halaman Lacak Pesanan.
        </p>
      </section>

      <section className="wrap">
        <div className="section-head">
          <div>
            <span className="eyebrow">Testimoni</span>
            <h2>Kata Mereka</h2>
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

      <section className="wrap" style={{ paddingBottom: 90 }}>
        <div className="section-head">
          <div>
            <span className="eyebrow">FAQ</span>
            <h2>Pertanyaan yang Sering Ditanyakan</h2>
          </div>
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
