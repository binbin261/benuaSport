"use client";

import type { Product } from "@/lib/types";
import { rupiah } from "@/lib/format";
import { useCart } from "./CartProvider";

export function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart();

  return (
    <div className="card">
      <div className="card-media">
        <span className={`tag ${product.preorder ? "tag-preorder" : product.oldPrice ? "tag-sale" : "tag-ready"}`}>
          {product.preorder ? "Pre-Order" : product.oldPrice ? "Diskon" : "Ready Stock"}
        </span>
        <span>{product.icon}</span>
        <span className="stock">Stok {product.stock}</span>
      </div>
      <div className="card-body">
        <span className="cat">{product.category}</span>
        <h3>{product.name}</h3>
        <div className="price-row">
          <span className="price">{rupiah(product.price)}</span>
          {product.oldPrice && <span className="price-old">{rupiah(product.oldPrice)}</span>}
        </div>
        {product.preorder && product.eta && (
          <span className="eta">
            DP {Math.round((product.dp ?? 0.3) * 100)}% · Estimasi {product.eta}
          </span>
        )}
        <div className="card-actions">
          <button className="btn btn-primary btn-block btn-sm" onClick={() => addToCart(product)}>
            {product.preorder ? "Pre-Order Sekarang" : "Tambah ke Keranjang"}
          </button>
        </div>
      </div>
    </div>
  );
}
