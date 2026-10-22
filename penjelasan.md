# 📚 Dokumentasi & Penjelasan Lengkap Kode `src/` (Tokoku App)

Dokumen ini dibuat khusus untuk membedah **setiap baris kode** yang ada di dalam folder `src/`. Tujuannya adalah agar kamu memahami **apa maksud baris tersebut** dan **mengapa kita menggunakannya (best practice & alasannya)**.

---

## 📑 Daftar Isi File
1. [`src/main.tsx`](#1-srcmaintsx) — Entry Point Aplikasi
2. [`src/styles/global.css`](#2-srcstylesglobalcss) — Styling Global & Tailwind CSS v4
3. [`src/App.tsx`](#3-srcapptsx) — Root Provider Component
4. [`src/services/queryClient.ts`](#4-srcservicesqueryclientts) — Konfigurasi React Query
5. [`src/types/product.ts`](#5-srctypesproductts) — Kontrak Data Produk
6. [`src/types/cart.ts`](#6-srctypescartts) — Kontrak Data Keranjang Belanja
7. [`src/types/index.ts`](#7-srctypesindexts) — Barrel Export Types
8. [`src/components/layout/MainLayout.tsx`](#8-srccomponentslayoutmainlayouttsx) — Layout Semantik & Navigasi
9. [`src/components/pages/Home/`](#9-srccomponentspageshome) — Halaman Katalog Produk
10. [`src/components/pages/ProductDetail/`](#10-srccomponentspagesproductdetail) — Halaman Detail Produk
11. [`src/components/pages/Cart/`](#11-srccomponentspagescart) — Halaman Keranjang Belanja
12. [`src/routes/Route.tsx`](#12-srcroutesroutettsx) — Definisi Daftar Rute
13. [`src/routes/index.tsx`](#13-srcroutesindextsx) — Inisialisasi Router

---

## 1. `src/main.tsx`
File ini adalah **pintu gerbang pertama** saat aplikasi dijalankan oleh browser.

```tsx
1: import { StrictMode } from 'react'
2: import { createRoot } from 'react-dom/client'
3: import './styles/global.css'
4: import App from './App.tsx'
5: 
6: createRoot(document.getElementById('root')!).render(
7:   <StrictMode>
8:     <App />
9:   </StrictMode>,
10: )
```

### 🔍 Penjelasan Baris per Baris:
- **Baris 1 (`import { StrictMode } from 'react'`):**
  - **Maksud:** Mengimpor komponen pembantu dari React bernama `StrictMode`.
  - **Alasan:** `StrictMode` membantu mendeteksi potensi *bug*, penggunaan API yang sudah usang (*deprecated*), serta *side-effect* yang tidak sengaja terduplikasi selama tahap *development*.
- **Baris 2 (`import { createRoot } from 'react-dom/client'`):**
  - **Maksud:** Mengimpor fungsi pembuat root DOM React 18/19.
  - **Alasan:** Ini adalah cara resmi React modern untuk mengaitkan (*mount*) komponen React ke dalam elemen HTML nyata di browser.
- **Baris 3 (`import './styles/global.css'`):**
  - **Maksud:** Mengimpor file CSS utama agar styling Tailwind berlaku di seluruh halaman web.
  - **Alasan:** Diletakkan di `main.tsx` agar dieksekusi paling awal sebelum komponen apa pun dimuat.
- **Baris 4 (`import App from './App.tsx'`):**
  - **Maksud:** Mengimpor komponen induk utama aplikasi kita.
- **Baris 6 (`createRoot(document.getElementById('root')!).render(...)`):**
  - **Maksud:** Mencari elemen `<div id="root"></div>` di file `index.html`, lalu menyerahkan kendali tampilan elemen tersebut kepada React.
  - **Alasan tanda seru (`!`):** Ini adalah fitur TypeScript bernama *Non-null assertion operator*. Tanda ini memberi tahu TypeScript: *"Tenang, elemen `#root` pasti ada di `index.html`, jangan khawatir bernilai `null`"*.
- **Baris 7–9 (`<StrictMode><App /></StrictMode>`):**
  - **Maksud:** Menjalankan `App` di dalam pengawasan `StrictMode`.

---

## 2. `src/styles/global.css`
File CSS tunggal untuk seluruh proyek.

```css
1: @import "tailwindcss";
```

### 🔍 Penjelasan:
- **Baris 1 (`@import "tailwindcss";`):**
  - **Maksud:** Mengimpor seluruh kemampuan engine Tailwind CSS v4 ke dalam proyek.
  - **Alasan Mengapa Hanya 1 Baris:** Di Tailwind CSS versi 4, arsitekturnya sudah diperbarui total. Kita tidak lagi membutuhkan 3 direktif lama (`@tailwind base; @tailwind components; @tailwind utilities;`) atau file `tailwind.config.js`. Plugin `@tailwindcss/vite` membaca direktif ini dan secara otomatis men-generate class CSS yang kita gunakan secara instan.

---

## 3. `src/App.tsx`
Komponen *Root* yang membungkus seluruh aplikasi dengan penyedia layanan (*Providers*).

```tsx
1: import { QueryClientProvider } from "@tanstack/react-query";
2: import { RouterProvider } from "react-router-dom";
3: import { queryClient } from "./services/queryClient";
4: import { router } from "./routes";
5: 
6: const App = () => {
7:   return (
8:     <QueryClientProvider client={queryClient}>
9:       <RouterProvider router={router} />
10:     </QueryClientProvider>
11:   );
12: };
13: export default App;
```

### 🔍 Penjelasan Baris per Baris:
- **Baris 1 (`QueryClientProvider`):**
  - **Maksud:** Komponen pembungkus dari library `@tanstack/react-query`.
  - **Alasan:** Agar semua komponen di dalam aplikasi (misal HomePage, DetailPage) bisa menggunakan fungsi `useQuery` untuk mengambil data dan menikmati fitur caching otomatis.
- **Baris 2 (`RouterProvider`):**
  - **Maksud:** Komponen yang bertugas merender tampilan sesuai dengan URL halaman saat ini.
- **Baris 3–4:**
  - **Maksud:** Mengimpor konfigurasi queryClient dan router yang sudah kita buat terpisah.
  - **Alasan:** Memisahkan konfigurasi ke file tersendiri menjaga `App.tsx` tetap bersih dan fokus hanya pada *wiring* provider.
- **Baris 6–12:**
  - **Maksud:** Menyusun hierarki: `QueryClientProvider` membungkus `RouterProvider`.
  - **Alasan:** Halaman-halaman yang ada di dalam rute (`RouterProvider`) butuh akses ke context data React Query.
- **Baris 13 (`export default App`):**
  - **Maksud:** Mengekspor komponen agar bisa dipakai di `main.tsx`.

---

## 4. `src/services/queryClient.ts`
Pusat kontrol konfigurasi pengambilan dan penyimpanan data server (*caching*).

```typescript
1: import { QueryClient } from "@tanstack/react-query";
2: 
3: export const queryClient = new QueryClient({
4:   defaultOptions: {
5:     queries: {
6:       staleTime: 1000 * 60 * 5,
7:       retry: 1,
8:       refetchOnWindowFocus: false,
9:     },
10:   },
11: });
```

### 🔍 Penjelasan Baris per Baris:
- **Baris 1 (`import { QueryClient }`):**
  - **Maksud:** Mengimpor *class* QueryClient untuk membuat wadah cache data.
- **Baris 3–11:**
  - **`staleTime: 1000 * 60 * 5` (5 menit):**
    - **Alasan:** Menentukan berapa lama data yang diambil dianggap masih "segar". Sebelum 5 menit berlalu, jika user berpindah halaman lalu kembali lagi, React Query tidak akan memanggil API lagi melainkan langsung mengambil dari memori cache. Ini membuat web terasa sangat cepat dan menghemat kuota API.
  - **`retry: 1`:**
    - **Alasan:** Jika koneksi internet drop atau server error, React Query akan mencoba memanggil API 1 kali lagi secara otomatis sebelum menyerah dan menampilkan pesan error ke user.
  - **`refetchOnWindowFocus: false`:**
    - **Alasan:** Secara default, React Query akan fetch data baru setiap kali user klik jendela browser lain lalu balik lagi ke tab web kita. Mematikan ini (`false`) mencegah request yang berulang-ulang dan tidak perlu pada aplikasi e-commerce sederhana.

---

## 5. `src/types/product.ts`
Kontrak data TypeScript (*blueprint*) untuk produk DummyJSON.

```typescript
1: export interface Review {
2:   rating: number;
3:   comment: string;
4:   date: string;
5:   reviewerName: string;
6:   reviewerEmail: string;
7: }
...
15: export interface Product {
...
25:   brand?: string;
...
39: export interface ProductsResponse {
40:   products: Product[];
41:   total: number;
42:   skip: number;
43:   limit: number;
44: }
```

### 🔍 Penjelasan Konsep & Alasan:
- **`interface Review` & `interface ProductDimensions`:**
  - **Alasan:** Daripada menulis objek bertingkat yang panjang di dalam `Product`, memecahnya ke interface kecil membuat kode mudah dibaca, bisa diekspor, dan bisa dipakai ulang (misal untuk komponen ulasan produk nanti).
- **`interface Product`:**
  - **Maksud:** Mendefinisikan seluruh properti yang dimiliki oleh satu barang dagangan.
  - **`brand?: string` (tanda tanya):**
    - **Alasan Kritis:** Beberapa kategori di DummyJSON (seperti sayuran/groceries) tidak memiliki merek. Tanda tanya (`?`) menandakan bahwa properti ini opsional (bisa bernilai `string` atau `undefined`). Tanpa ini, TypeScript akan memunculkan error saat menerima produk tanpa brand.
- **`interface ProductsResponse`:**
  - **Alasan:** API `https://dummyjson.com/products` tidak langsung mengembalikan array produk mentah, melainkan dibungkus dalam objek yang memiliki `products`, `total`, `skip`, dan `limit` untuk keperluan paginasi.

---

## 6. `src/types/cart.ts`
Kontrak data untuk item di dalam keranjang belanja.

```typescript
1: import type { Product } from "./product";
2: 
3: export interface CartItem {
4:   product: Product;
5:   quantity: number;
6: }
```

### 🔍 Penjelasan:
- **Baris 1 (`import type { Product }`):**
  - **Alasan:** Menggunakan keyword `type` adalah *best practice* TypeScript. Ini menegaskan bahwa impor ini hanya digunakan untuk pengecekan tipe saat coding dan akan dihapus 100% oleh compiler saat aplikasi di-build, sehingga ukuran file JavaScript akhir lebih kecil.
- **Baris 3–6 (`CartItem`):**
  - **Maksud:** Sebuah item keranjang belanja terdiri dari **data produk lengkap** (`product`) ditambah **jumlah barang yang dibeli** (`quantity`).
  - **Alasan:** Pola komposisi ini menjaga data produk tetap utuh tanpa harus menduplikasi field nama, harga, dan gambar satu per satu.

---

## 7. `src/types/index.ts`
Pola *Barrel Export*.

```typescript
1: export * from "./product";
2: export * from "./cart";
```

### 🔍 Penjelasan:
- **Maksud:** Menyatukan seluruh tipe data dari berbagai file ke dalam satu pintu keluar.
- **Alasan:** Tanpa file ini, saat ingin mengimpor di komponen lain kita harus menulis:
  ```ts
  import { Product } from '../../types/product'
  import { CartItem } from '../../types/cart'
  ```
  Dengan barrel export, cukup satu baris bersih:
  ```ts
  import { Product, CartItem } from '../../types'
  ```

---

## 8. `src/components/layout/MainLayout.tsx`
Kerangka utama halaman web yang membungkus header, konten dinamis, dan footer.

```tsx
8:  <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
9:    <nav aria-label="Navigasi Utama" className="...">
...
14:     <Link to="/" className="...">
...
32:     <Link to="/cart" aria-label="Keranjang Belanja" className="...">
...
48: <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
49:   <Outlet />
50: </main>
...
53: <footer className="bg-white border-t border-slate-200 py-6">
```

### 🔍 Penjelasan Konsep & Alasan:
- **Semantic HTML (`<header>`, `<nav>`, `<main>`, `<footer>`):**
  - **Alasan:** Standar industri dan SEO. Membantu mesin pencari (Google) dan alat pembaca layar bagi penyandang disabilitas (*Screen Reader*) mengenali struktur web secara logis, bukan sekadar tumpukan tag `<div>`.
- **`aria-label="Navigasi Utama"` & `aria-label="Keranjang Belanja"`:**
  - **Alasan:** Aksesibilitas (a11y). Memberikan label suara bagi pengguna tuna netra saat kursor mereka berada di navigasi atau tombol keranjang.
- **`<Link to="...">` vs `<a href="...">`:**
  - **Alasan Kritis:** Tag `<a>` biasa akan me-refresh browser secara penuh (layar berkedip putih dan state memori terhapus). Komponen `<Link>` dari `react-router-dom` melakukan navigasi SPA (*Single Page Application*) secara instan tanpa reload browser.
- **`<Outlet />` di dalam `<main>`:**
  - **Maksud:** Slot tempat halaman anak diletakkan.
  - **Alasan:** Saat user di `/`, `<Outlet />` akan menampilkan `HomePage`. Saat user di `/cart`, `<Outlet />` otomatis berganti menjadi `CartPage`, sementara `<header>` dan `<footer>` tetap diam di posisinya tanpa perlu di-render ulang.
- **Tailwind Class `sticky top-0 bg-white/80 backdrop-blur-md`:**
  - **Alasan:** Membuat navbar menempel di atas saat layar di-scroll (*sticky*), dengan efek kaca buram modern (*glassmorphism*) yang elegan.

---

## 9. `src/components/pages/Home/`
Halaman katalog produk utama.

- **`Home.tsx`:**
  - Menggunakan tag semantik `<section aria-labelledby="home-heading">` dan `<h1>` sebagai judul utama halaman (bagus untuk struktur SEO).
- **`index.tsx`:**
  - Mengekspor `Home` agar komponen luar bisa mengimpor langsung dari foldernya: `import Home from '../components/pages/Home'`.

---

## 10. `src/components/pages/ProductDetail/`
Halaman detail untuk produk tertentu.

```tsx
const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  ...
  <Link to="/" className="..."> &larr; Kembali ke Katalog </Link>
  <h1>Detail Produk #{id}</h1>
}
```

### 🔍 Penjelasan:
- **`useParams<{ id: string }>()`:**
  - **Maksud:** Mengambil parameter dinamis dari URL browser.
  - **Alasan:** Jika user membuka `http://localhost:5173/product/5`, hook ini akan menangkap angka `5`. Tipe `<{ id: string }>` memastikan TypeScript tahu bahwa variabel `id` adalah bertipe `string`.
- **Tombol Kembali (`<Link to="/">`):**
  - **Alasan:** Memberikan pengalaman pengguna (*UX*) yang baik agar user bisa kembali ke katalog tanpa harus memencet tombol *back* browser.

---

## 11. `src/components/pages/Cart/`
Halaman keranjang belanja (placeholder yang siap menerima data belanja dari Zustand nanti).

- Memiliki file `Cart.tsx` dan re-export `index.tsx` untuk menjaga konsistensi arsitektur modular yang seragam dengan halaman lainnya.

---

## 12. `src/routes/Route.tsx`
Daftar konfigurasi rute aplikasi.

```tsx
import type { RouteObject } from "react-router-dom";
...
const routes: RouteObject[] = [
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "product/:id",
        element: <ProductDetail />,
      },
      {
        path: "cart",
        element: <Cart />,
      },
    ],
  },
];
export default routes;
```

### 🔍 Penjelasan Konsep & Alasan:
- **`RouteObject[]`:**
  - **Alasan:** Interface resmi dari `react-router-dom` yang memvalidasi bahwa array rute kita memiliki format yang sah (ada `path`, `element`, dan `children`).
- **`element: <MainLayout />` dengan `children: [...]` (Nested Routes):**
  - **Alasan Kritis:** Ini adalah teknik *Nested Routing*. Seluruh halaman yang ada di dalam array `children` akan otomatis dimasukkan ke dalam komponen `<Outlet />` milik `MainLayout`.
- **`index: true`:**
  - **Alasan:** Menandakan bahwa komponen `<Home />` adalah halaman utama (*default*) saat user mengunjungi path root (`/`).
- **`path: "product/:id"` (Dynamic Route):**
  - **Alasan:** Tanda titik dua (`:id`) menandakan nilai dinamis. Rute ini bisa menangani `/product/1`, `/product/99`, `/product/apapun`.

---

## 13. `src/routes/index.tsx`
Pusat inisialisasi router.

```tsx
import { createBrowserRouter } from "react-router-dom";
import routes from "./Route";

export const router = createBrowserRouter(routes);
```

### 🔍 Penjelasan:
- **`createBrowserRouter(routes)`:**
  - **Maksud:** Mengubah susunan array `routes` menjadi *instance* router aktif yang memakai History API modern dari browser.
  - **Alasan Memisahkan `Route.tsx` dan `index.tsx`:** Memisahkan data konfigurasi (`Route.tsx`) dari fungsi eksekusi router (`index.tsx`) adalah prinsip *Separation of Concerns*. Jika suatu saat kita ingin menambahkan middleware atau pengujian unit (*unit testing*), kodenya jauh lebih mudah diuji tanpa saling merusak.

---

🎯 **Ringkasan:** Seluruh baris kode yang sudah kita susun bersama memiliki alasan arsitektural yang kuat: **type-safe, ramah SEO (semantik), modular, dan teroptimasi untuk performa.**
