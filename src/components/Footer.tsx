import Link from "next/link";

export function Footer() {
  return (
    <footer>
      <div className="wrap">
        <div className="footer-grid">
          <div>
            <div className="logo" style={{ marginBottom: 12 }}>
              <span className="dot" />BENUA SPORT
            </div>
            <p className="muted" style={{ fontSize: 13.5, lineHeight: 1.7, maxWidth: 260 }}>
              Toko olahraga online dengan sistem Ready Stock &amp; Pre-Order yang transparan, dari DP sampai barang sampai di tangan kamu.
            </p>
          </div>
          <div>
            <h5>Belanja</h5>
            <ul>
              <li><Link href="/#katalog">Katalog Produk</Link></li>
              <li><Link href="/#preorder">Cara Pre-Order</Link></li>
              <li><Link href="/promo">Kode Promo</Link></li>
            </ul>
          </div>
          <div>
            <h5>Bantuan</h5>
            <ul>
              <li><Link href="/lacak-pesanan">Lacak Pesanan</Link></li>
              <li><Link href="/tentang">FAQ</Link></li>
              <li><Link href="/login">Masuk / Daftar</Link></li>
            </ul>
          </div>
          <div>
            <h5>Perusahaan</h5>
            <ul>
              <li><Link href="/tentang">Tentang Kami</Link></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2026 Benua Sport. Semua hak cipta dilindungi.</span>
          <span>Dibangun dengan Next.js, TypeScript &amp; Firebase.</span>
        </div>
      </div>
    </footer>
  );
}
