export function rupiah(n: number): string {
  return "Rp" + Math.round(n).toLocaleString("id-ID");
}

export function statusLabel(status: string): string {
  const map: Record<string, string> = {
    diproses: "Diproses",
    dikirim: "Dikirim",
    selesai: "Selesai",
    dibatalkan: "Dibatalkan",
  };
  return map[status] ?? status;
}

export function formatDateTimeID(date: Date = new Date()): string {
  return date.toLocaleString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function generateOrderId(date: Date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  const rand = Math.floor(100 + Math.random() * 900);
  return `BS-${y}${m}${d}-${rand}`;
}
