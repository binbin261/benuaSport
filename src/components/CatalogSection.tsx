"use client";

import { useMemo, useState } from "react";
import type { Product } from "@/lib/types";
import { ProductCard } from "./ProductCard";

export function CatalogSection({ products }: { products: Product[] }) {
  const categories = useMemo(() => ["Semua", ...Array.from(new Set(products.map((p) => p.category)))], [products]);
  const [active, setActive] = useState("Semua");

  const filtered = active === "Semua" ? products : products.filter((p) => p.category === active);

  return (
    <>
      <div className="pill-filters">
        {categories.map((c) => (
          <button key={c} className={`pill-filter ${active === c ? "active" : ""}`} onClick={() => setActive(c)}>
            {c}
          </button>
        ))}
      </div>
      <div className="grid">
        {filtered.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </>
  );
}
