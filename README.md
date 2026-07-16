# Benua Sport — Next.js + TypeScript + Firebase

Situs ini sudah ditulis ulang sepenuhnya dari versi lama (HTML statis + Express +
MySQL/JSON) menjadi aplikasi **Next.js 14 (App Router) + TypeScript**, dengan
**Firebase** sebagai backend: **Firestore** untuk database dan **Firebase
Authentication** untuk login (email/password, Google, dan nomor
WhatsApp/telepon via Firebase Phone Auth).

## Struktur Proyek

```
src/
  app/
    page.tsx                 → Beranda (hero, katalog, pre-order, testimoni, FAQ)
    login/page.tsx            → Masuk & Daftar Akun (Firebase Auth)
    lacak-pesanan/page.tsx     → Lacak status pesanan
    tentang/page.tsx           → Tentang Kami, testimoni, FAQ lengkap
    promo/page.tsx             → Daftar kode promo aktif
    admin/page.tsx             → Dashboard admin (produk, pesanan, ringkasan)
    api/                       → Route Handlers (API) yang bicara ke Firestore
      products/                 GET daftar produk
      vouchers/apply/            POST cek & hitung potongan voucher
      testimonials/               GET testimoni
      faqs/                        GET FAQ
      orders/                       POST buat pesanan baru
      orders/track/                 GET lacak pesanan (by Order ID / no. WA)
      admin/orders/                  GET semua pesanan (admin only)
      admin/orders/[id]/status/       PATCH ubah status pesanan (admin only)
      admin/products/                  POST tambah produk (admin only)
      admin/products/[id]/               PUT/DELETE ubah/hapus produk (admin only)
  components/                → Header, Footer, ProductCard, CartDrawer, dll.
  lib/
    firebase/client.ts        → Inisialisasi Firebase SDK untuk browser
    firebase/admin.ts         → Inisialisasi Firebase Admin SDK untuk server
    types.ts                  → Tipe TypeScript bersama (Product, Order, dll.)
    seed-data.ts               → Data awal (pemindahan dari data.js versi lama)
scripts/seed.ts              → Script untuk mengisi Firestore dengan data awal
firestore.rules              → Aturan keamanan Firestore
```

## 1. Buat Project Firebase

1. Buka https://console.firebase.google.com → **Add project**.
2. Aktifkan **Firestore Database** (mode production).
3. Aktifkan **Authentication** → tab **Sign-in method** → aktifkan:
   - **Email/Password**
   - **Google**
   - **Phone** (dipakai untuk menggantikan alur "OTP WhatsApp" lama — Firebase
     mengirim kode lewat SMS ke nomor yang sama, karena Firebase tidak
     memiliki kanal WhatsApp native).
4. Di **Project settings → General → Your apps**, tambahkan **Web app** lalu
   salin konfigurasinya ke `.env.local` (lihat langkah 3 di bawah).
5. Di **Project settings → Service accounts**, klik **Generate new private
   key** untuk kredensial Admin SDK.

## 2. Terapkan Firestore Rules

Salin isi `firestore.rules` ke **Firestore Database → Rules** di Firebase
Console, lalu **Publish**. (Atau pakai Firebase CLI: `firebase deploy --only firestore:rules`.)

## 3. Konfigurasi Environment

```bash
cp .env.local.example .env.local
```

Isi `NEXT_PUBLIC_FIREBASE_*` dari konfigurasi Web App (langkah 1.4), dan
`FIREBASE_SERVICE_ACCOUNT_KEY` dengan isi file JSON service account
(langkah 1.5) sebagai satu baris string.

## 4. Install & Isi Data Awal

```bash
npm install
npm run seed     # mengisi Firestore dengan produk, voucher, testimoni, FAQ awal
npm run dev       # jalankan di http://localhost:3000
```

## 5. Membuat Akun Admin

1. Daftar akun biasa lewat halaman `/login`.
2. Buka **Firestore Console → koleksi `users` → dokumen dengan UID kamu**.
3. Tambahkan/ubah field `isAdmin` menjadi `true`.
4. Login ulang → menu **Admin** akan muncul di navigasi, dan `/admin` bisa diakses.

## 6. Deploy

Cara termudah adalah men-deploy ke **Vercel** (dibuat oleh tim yang sama
dengan Next.js):

1. Push repo ini ke GitHub.
2. Buka https://vercel.com → **Add New → Project** → pilih repo.
3. Tambahkan environment variables yang sama seperti `.env.local` di
   pengaturan project Vercel.
4. Deploy.

## Catatan Migrasi dari Versi Lama

- Data produk/voucher/testimoni/FAQ yang dulu ada di `data.js` (dan skema
  `benua_sport_database.sql`) sekarang hidup di Firestore, diisi awal lewat
  `scripts/seed.ts`.
- Endpoint `/api/*` lama (Express + MySQL, di `server.js`) digantikan oleh
  Next.js Route Handlers di `src/app/api/*` yang membaca/menulis Firestore
  lewat Firebase Admin SDK.
- Autentikasi (email/password, Google OAuth, OTP WhatsApp) digantikan
  sepenuhnya oleh Firebase Authentication — tidak ada lagi hashing password
  manual (`bcryptjs`) atau JWT (`jsonwebtoken`) buatan sendiri.
- Cart/keranjang belanja disimpan di `localStorage` browser lewat React
  Context (`CartProvider`), lalu dikirim ke server saat checkout untuk
  dihitung ulang totalnya (harga tidak pernah dipercaya mentah-mentah dari
  client).
