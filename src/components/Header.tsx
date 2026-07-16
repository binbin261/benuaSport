"use client";

import Link from "next/link";
import { useCart } from "./CartProvider";
import { useAuth } from "./AuthProvider";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase/client";

export function Header() {
  const { totalItems, openCart, clearCart } = useCart();
  const { appUser } = useAuth();

  return (
    <>
      <div className="promo-bar">
        <b>BENUA10</b> diskon 10% untuk pengguna baru. <Link href="/promo">Lihat semua promo →</Link>
      </div>
      <header>
        <nav className="wrap">
          <Link href="/" className="logo">
            <span className="dot" />BENUA SPORT
          </Link>
          <div className="nav-links">
            <Link href="/#katalog">Katalog</Link>
            <Link href="/#preorder">Pre-Order</Link>
            <Link href="/promo">Promo</Link>
            <Link href="/lacak-pesanan">Lacak Pesanan</Link>
            <Link href="/tentang">Tentang &amp; FAQ</Link>
            {appUser?.isAdmin && <Link href="/admin">Admin</Link>}
          </div>
          <div className="nav-right">
            <button className="btn-ghost btn btn-sm" onClick={openCart} aria-label="Buka keranjang">
              🛒 Keranjang{totalItems > 0 ? ` (${totalItems})` : ""}
            </button>
            {appUser ? (
              <button className="nav-pill" onClick={() => { clearCart(); signOut(auth); }}>
                Keluar ({appUser.name.split(" ")[0]})
              </button>
            ) : (
              <Link href="/login" className="nav-pill">
                Masuk / Daftar
              </Link>
            )}
          </div>
        </nav>
      </header>
    </>
  );
}
