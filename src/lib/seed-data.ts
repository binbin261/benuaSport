/**
 * Data awal untuk seeding Firestore.
 * Digunakan oleh scripts/seed.ts (npm run seed).
 */

export const seedProducts = [
  { name: "Sepatu Lari Aero X1", category: "Lari", icon: "👟", description: "Sepatu lari ringan dengan sol responsif dan bantalan empuk, cocok untuk lari jarak jauh maupun latihan harian.", price: 899000, oldPrice: null, preorder: true, eta: "4–5 minggu", stock: 24, dp: 0.3, sold: 132 },
  { name: "Jersey Match Day Home", category: "Sepak Bola", icon: "👕", description: "Jersey resmi tim kandang, bahan dry-fit anti lengket yang menyerap keringat dengan cepat saat pertandingan.", price: 349000, oldPrice: 429000, preorder: false, eta: null, stock: 58, dp: null, sold: 410 },
  { name: "Sepatu Basket HyperJump", category: "Basket", icon: "👟", description: "Sepatu basket dengan bantalan udara di tumit untuk daya pantul maksimal dan perlindungan pergelangan kaki.", price: 1249000, oldPrice: null, preorder: true, eta: "3–4 minggu", stock: 15, dp: 0.3, sold: 76 },
  { name: "Raket Badminton Carbon Pro", category: "Raket", icon: "🏸", description: "Rangka full carbon yang ringan namun kokoh, memberi ayunan cepat dan kontrol presisi untuk pemain kompetitif.", price: 675000, oldPrice: null, preorder: true, eta: "2–3 minggu", stock: 20, dp: 0.3, sold: 98 },
  { name: "Bola Voli Pro Match", category: "Gym", icon: "🏐", description: "Bola voli standar pertandingan dengan permukaan microfiber yang nyaman digenggam dan tahan lama.", price: 275000, oldPrice: 320000, preorder: false, eta: null, stock: 40, dp: null, sold: 150 },
  { name: "Dumbbell Set 10kg", category: "Gym", icon: "🏋️", description: "Sepasang dumbbell 10kg berlapis rubber anti licin, cocok untuk latihan kekuatan di rumah maupun gym.", price: 540000, oldPrice: null, preorder: false, eta: null, stock: 33, dp: null, sold: 88 },
  { name: "Jaket Training Windbreaker", category: "Lari", icon: "🧥", description: "Jaket anti angin dan air ringan, ideal dipakai pemanasan atau lari pagi saat cuaca dingin.", price: 459000, oldPrice: null, preorder: true, eta: "3 minggu", stock: 18, dp: 0.3, sold: 64 },
  { name: "Tas Olahraga Duffel 45L", category: "Gym", icon: "🎒", description: "Tas serbaguna berkapasitas besar dengan kompartemen sepatu terpisah, cocok untuk latihan atau perjalanan singkat.", price: 319000, oldPrice: 379000, preorder: false, eta: null, stock: 47, dp: null, sold: 203 },
  { name: "Jersey Basket Away", category: "Basket", icon: "🎽", description: "Jersey tandang dengan bahan mesh yang sirkulasi udaranya baik, nyaman dipakai sepanjang pertandingan.", price: 299000, oldPrice: null, preorder: false, eta: null, stock: 36, dp: null, sold: 171 },
  { name: "Bola Sepak Match Official", category: "Sepak Bola", icon: "⚽", description: "Bola sepak ukuran resmi 5 dengan jahitan tangan, dipakai untuk pertandingan maupun latihan tim.", price: 389000, oldPrice: null, preorder: true, eta: "2 minggu", stock: 22, dp: 0.3, sold: 59 },
  { name: "Matras Yoga Premium", category: "Gym", icon: "🧘", description: "Matras anti-slip tebal 6mm yang nyaman untuk yoga, pilates, maupun latihan lantai lainnya.", price: 229000, oldPrice: 259000, preorder: false, eta: null, stock: 52, dp: null, sold: 264 },
  { name: "Raket Tenis Meja Carbon", category: "Raket", icon: "🏓", description: "Raket tenis meja berlapis carbon dengan pegangan ergonomis untuk pukulan cepat dan akurat.", price: 389000, oldPrice: null, preorder: true, eta: "2–3 minggu", stock: 19, dp: 0.3, sold: 41 },
];

export const seedVouchers = [
  { code: "BENUA10", type: "percent", value: 10, label: "Diskon 10% untuk pengguna baru", isActive: true },
  { code: "PREORDER5", type: "flat", value: 50000, label: "Potongan Rp50.000 khusus item Pre-Order", isActive: true },
  { code: "GRATISONGKIR", type: "flat", value: 20000, label: "Potongan ongkos kirim Rp20.000", isActive: true },
];

export const seedTestimonials = [
  { name: "Bimo Aditya", role: "Pelari Maraton Amatir", stars: 5, quote: "Sepatu pre-order datang tepat sesuai estimasi, kualitasnya sama seperti foto. Prosesnya transparan banget dari DP sampai pelunasan." },
  { name: "Salsabila Putri", role: "Pemain Basket Kampus", stars: 5, quote: "Update status pesanan jelas, jadi nggak was-was nunggu barang pre-order. Admin juga responsif waktu saya tanya ukuran sepatu." },
  { name: "Yoga Pratama", role: "Pelatih Badminton", stars: 4, quote: "Belanja perlengkapan tim jadi lebih gampang, ada diskon buat pembelian dan sistem pre-order buat raket edisi terbatas." },
];

export const seedFaqs = [
  { question: "Apa bedanya produk Ready Stock dan Pre-Order?", answer: "Produk Ready Stock sudah tersedia di gudang dan dikirim dalam 1×24 jam setelah pembayaran lunas. Produk Pre-Order adalah batch terbatas yang baru diproses/dipesan ke supplier setelah kamu membayar DP, dengan estimasi waktu kedatangan yang tertera di setiap produk." },
  { question: "Berapa besar DP untuk Pre-Order dan kapan pelunasannya?", answer: "DP minimum untuk semua produk Pre-Order adalah 30% dari harga produk. Pelunasan sisa pembayaran dilakukan mendekati estimasi kedatangan barang, dan kamu akan dihubungi lewat WhatsApp untuk instruksi pelunasan." },
  { question: "Bagaimana cara melacak status pesanan saya?", answer: "Gunakan halaman Lacak Pesanan dan masukkan Order ID atau nomor WhatsApp yang kamu daftarkan saat checkout untuk melihat status dan riwayat perjalanan pesanan." },
  { question: "Apakah kode promo bisa digabung dengan Pre-Order?", answer: "Bisa. Kode seperti PREORDER5 memang dikhususkan untuk item Pre-Order, sedangkan kode umum seperti BENUA10 berlaku untuk seluruh jenis produk selama masih dalam masa berlaku." },
  { question: "Bagaimana jika Pre-Order batal atau terlambat dari estimasi?", answer: "Jika terjadi keterlambatan signifikan dari estimasi, kamu berhak memilih menunggu, mengganti dengan produk lain senilai, atau meminta pengembalian dana penuh atas DP yang sudah dibayarkan." },
];
