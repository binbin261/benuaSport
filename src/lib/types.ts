export type ProductCategory = "Lari" | "Sepak Bola" | "Basket" | "Raket" | "Gym";

export interface Product {
  id: string;
  name: string;
  category: ProductCategory | string;
  icon: string;
  description: string;
  price: number;
  oldPrice: number | null;
  preorder: boolean;
  eta?: string | null;
  stock: number;
  dp?: number | null; // 0.3 = DP 30%
  sold: number;
}

export type VoucherType = "percent" | "flat";

export interface Voucher {
  code: string;
  type: VoucherType;
  value: number;
  label: string;
  isActive: boolean;
}

export interface Testimonial {
  name: string;
  role: string;
  stars: number;
  quote: string;
}

export interface Faq {
  question: string;
  answer: string;
}

export type OrderStatus = "diproses" | "dikirim" | "selesai" | "dibatalkan";

export interface OrderItem {
  productId: string;
  productName: string;
  qty: number;
  price: number;
  preorder: boolean;
}

export interface OrderTimelineEntry {
  label: string;
  time: string;
  done: boolean;
}

export interface Order {
  id: string;
  customerName: string;
  phone: string;
  items: OrderItem[];
  voucherCode: string | null;
  total: number;
  paid: number;
  status: OrderStatus;
  timeline: OrderTimelineEntry[];
  createdAt: string;
}

export interface CartLine {
  productId: string;
  name: string;
  price: number;
  qty: number;
  preorder: boolean;
  icon: string;
}

export interface AppUser {
  uid: string;
  name: string;
  email: string | null;
  phone: string | null;
  isAdmin: boolean;
}