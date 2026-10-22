# 📚 Dokumentasi & Penjelasan Lengkap Kode `src/` (Tokoku App)

Dokumen ini dibuat khusus untuk membedah **setiap baris kode** yang ada di dalam folder `src/`. Tujuannya adalah agar kamu memahami **apa maksud baris tersebut** dan **mengapa kita menggunakannya (best practice & alasannya)**.

---

## 📑 Daftar Isi File
1. [`src/main.tsx`](#1-srcmaintsx) — Entry Point Aplikasi
2. [`src/styles/global.css`](#2-srcstylesglobalcss) — Styling Global, `@theme`, & Ruang Warna OKLCH
3. [`src/App.tsx`](#3-srcapptsx) — Root Provider Component
4. [`src/services/queryClient.ts`](#4-srcservicesqueryclientts) — Konfigurasi React Query
5. [`src/types/product.ts`](#5-srctypesproductts) — Kontrak Data Produk
6. [`src/types/cart.ts`](#6-srctypescartts) — Kontrak Data Keranjang Belanja
7. [`src/types/index.ts`](#7-srctypesindexts) — Barrel Export Types
8. [`src/components/layout/MainLayout.tsx`](#8-srccomponentslayoutmainlayouttsx) — Layout Semantik & Kontainer Utama
9. [`src/components/ui/Navbar/`](#9-srccomponentsuinavbar) — Navbar Fixed, Dynamic Scroll & Route Awareness
10. [`src/components/ui/Footer/`](#10-srccomponentsuifooter) — Komponen Footer Semantik
11. [`src/components/ui/Hero/`](#11-srccomponentsuihero) — Full-Bleed Hero Banner & Overlay Image
12. [`src/components/pages/Home/`](#12-srccomponentspageshome) — Halaman Katalog Produk & Hirarki Heading
13. [`src/components/pages/ProductDetail/`](#13-srccomponentspagesproductdetail) — Halaman Detail Produk Dinamis
14. [`src/components/pages/Cart/`](#14-srccomponentspagescart) — Halaman Keranjang Belanja
15. [`src/routes/Route.tsx`](#15-srcroutesroutettsx) — Definisi Daftar Rute
16. [`src/routes/index.tsx`](#16-srcroutesindextsx) — Inisialisasi Router

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
  - **Maksud:** Mengimpor file CSS utama agar styling Tailwind dan variabel tema berlaku di seluruh aplikasi.
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
Pusat styling global, aktivasi Tailwind CSS v4, dan pendaftaran *Design Tokens* tema warna.

```css
1: @import "tailwindcss";
2: 
3: @theme {
4:   --color-header: oklch(20.8% 0.042 265.755);
5:   --color-paragraf: oklch(37.2% 0.044 257.287);
6:   --color-link: oklch(27.9% 0.041 260.031);
7:   --color-background: oklch(98.4% 0.003 247.858);
8:   --color-hover: oklch(44.6% 0.043 257.281);
9:   --color-button: oklch(57.7% 0.245 27.325);
10:  --color-span: oklch(63.7% 0.237 25.331);
11: }
```

### 🔍 Penjelasan Konsep & Alasan:
- **Baris 1 (`@import "tailwindcss";`):**
  - **Maksud:** Mengaktifkan seluruh engine Tailwind CSS v4.
  - **Alasan:** Di Tailwind v4, cukup satu baris ini bersama plugin `@tailwindcss/vite` untuk men-generate class utilitas secara instan tanpa butuh `tailwind.config.js`.
- **Baris 3–11 (`@theme { ... }`):**
  - **Maksud:** Fitur resmi Tailwind CSS v4 untuk mendefinisikan variabel tema kustom (*Design Tokens*).
  - **Alasan:** Saat kita menulis `--color-header`, Tailwind secara otomatis membuatkan utility classes:
    - `text-header` (warna teks)
    - `bg-header` (warna background)
    - `border-header` (warna border)
- **Format Warna `oklch(...)`:**
  - **Alasan:** `OKLCH` adalah standar ruang warna modern web masa depan. Berbeda dengan RGB/HEX, OKLCH memiliki *Perceptual Uniformity* — artinya kontras dan kecerahan warna terlihat konsisten di mata manusia pada berbagai layar monitor modern.

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
  - **Maksud:** Menyediakan wadah cache data server ke seluruh komponen anak.
  - **Alasan:** Komponen apa pun di dalam rute web bisa memanggil hook `useQuery` untuk mengambil data produk DummyJSON.
- **Baris 2 (`RouterProvider`):**
  - **Maksud:** Komponen yang merender tampilan sesuai path URL di browser.
- **Baris 8–10:**
  - **Maksud:** Membungkus `RouterProvider` di dalam `QueryClientProvider` sehingga seluruh halaman rute mendapatkan akses ke context React Query.

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
- **`staleTime: 1000 * 60 * 5` (5 menit):**
  - **Alasan:** Data produk dianggap masih "segar" selama 5 menit. Jika user berpindah ke `/cart` lalu kembali ke `/`, React Query tidak akan memanggil API lagi melainkan langsung mengambil dari cache memori instan.
- **`retry: 1`:**
  - **Alasan:** Jika request internet sempat gagal, coba ulangi 1 kali lagi secara otomatis sebelum menampilkan pesan error ke user.
- **`refetchOnWindowFocus: false`:**
  - **Alasan:** Mencegah request ulang berlebih setiap kali user klik jendela lain lalu kembali ke tab web kita.

---

## 5. `src/types/product.ts`
Kontrak data TypeScript (*blueprint*) untuk produk DummyJSON.

```typescript
export interface Review { ... }
export interface ProductDimensions { ... }
export interface Product {
  id: number;
  title: string;
  price: number;
  brand?: string; // Tanda tanya menandakan opsional
  ...
}
export interface ProductsResponse {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
}
```

### 🔍 Penjelasan Konsep & Alasan:
- **`brand?: string` (Opsional):**
  - **Alasan Kritis:** Beberapa kategori di DummyJSON (seperti sayuran/groceries) tidak memiliki merek. Tanda tanya (`?`) mencegah crash/error saat data produk tidak memiliki field `brand`.
- **`ProductsResponse`:**
  - **Alasan:** Endpoint daftar produk mengembalikan objek pembungkus dengan metadata pagination (`total`, `skip`, `limit`).

---

## 6. `src/types/cart.ts`
Kontrak data untuk item di dalam keranjang belanja.

```typescript
import type { Product } from "./product";

export interface CartItem {
  product: Product;
  quantity: number;
}
```

### 🔍 Penjelasan:
- **`import type { Product }`:**
  - **Alasan:** Menegaskan bahwa impor ini hanya tipe data kompilasi dan akan dihapus saat build (*zero runtime overhead*).
- **`CartItem`:**
  - **Alasan:** Menggabungkan data produk utuh (`product`) dengan jumlah barang yang dipesan (`quantity`).

---

## 7. `src/types/index.ts`
Pola *Barrel Export*.

```typescript
export * from "./product";
export * from "./cart";
```

### 🔍 Penjelasan:
- **Alasan:** Memungkinkan impor bersih di mana saja: `import { Product, CartItem } from '../../types'`.

---

## 8. `src/components/layout/MainLayout.tsx`
Kerangka utama halaman web yang membungkus navigasi atas, konten dinamis, dan footer.

```tsx
import { Outlet } from "react-router-dom";
import Navbar from "../ui/Navbar";
import Footer from "../ui/Footer";

export default function MainLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans">
      <Navbar />
      <main className="flex-1 w-full">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
```

### 🔍 Penjelasan Konsep & Alasan:
- **Dekopling Komponen (`<Navbar />` dan `<Footer />`):**
  - **Alasan:** Memisahkan navbar dan footer ke komponen mandiri membuat `MainLayout` bersih dan berfokus hanya pada penataan tata letak (*layout composition*).
- **`<main className="flex-1 w-full">` (Tanpa Padding Global):**
  - **Alasan Kritis:** Jika `<main>` diberi padding horizontal (`px-...`), maka section seperti **Hero Banner** tidak akan bisa membentang penuh 100% selebar layar (*full-bleed*). Dengan membuat `<main>` bersih `w-full`, setiap halaman atau section bebas menentukan lebarnya sendiri.
- **`<Outlet />`:**
  - **Maksud:** Tempat di mana komponen halaman aktif (Home, ProductDetail, Cart) akan dirender secara dinamis oleh router.

---

## 9. `src/components/ui/Navbar/`
Komponen navigasi pintar dengan deteksi scroll dinamis dan adaptasi rute (*route awareness*).

```tsx
const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  const isHome = location.pathname === "/";

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isWhiteNav = isScrolled || !isHome;
...
```

### 🔍 Penjelasan Konsep & Alasan:
- **`header className="fixed top-0 left-0 w-full z-50 ..."`:**
  - **Alasan `fixed`:** Membuat navbar selalu melayang di posisi paling atas layar saat user melakukan scroll.
  - **Alasan `left-0 w-full`:** Pada elemen berposisi `fixed`, browser menerapkan perilaku *shrink-to-fit* (mengecil sebesar konten). `w-full left-0` memaksa navbar kembali membentang 100% dari ujung kiri ke kanan layar.
- **`useState(false)` & `useEffect` (Scroll Event Listener):**
  - **Maksud:** Memantau pergerakan scroll layar browser. Jika `window.scrollY > 20`, navbar tahu bahwa user sudah mulai men-scroll ke bawah.
  - **`return () => window.removeEventListener(...)` (Cleanup Function):** Sangat penting di React! Membersihkan listener saat komponen di-*unmount* untuk mencegah kebocoran memori (*memory leak*).
- **`useLocation()` & `isWhiteNav = isScrolled || !isHome`:**
  - **Alasan Cerdas:** Efek transparan hanya kita inginkan di halaman depan (`/`) saat berada di atas Hero. Saat user pindah ke halaman lain (misalnya `/cart`), navbar secara otomatis menjadi putih solid agar teks menu tetap terlihat jelas.
- **`transition-all duration-300`:**
  - **Alasan:** Memberikan animasi pergantian warna yang mulus dan halus (*smooth transition*) saat user men-scroll.

---

## 10. `src/components/ui/Footer/`
Komponen penutup semantik.

```tsx
const Footer = () => {
  return (
    <footer className="bg-white border-t border-slate-200 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-slate-500">
        <p>
          © {new Date().getFullYear()} Tokoku App. Dibuat dengan React 19,
          TypeScript & Tailwind CSS v4.
        </p>
      </div>
    </footer>
  );
};
export default Footer;
```

### 🔍 Penjelasan:
- **`<footer>` Semantik:** Membantu struktur SEO dan aksesibilitas.
- **`{new Date().getFullYear()}`:** Otomatis menampilkan tahun saat ini tanpa perlu diedit manual setiap pergantian tahun.

---

## 11. `src/components/ui/Hero/`
Banner utama halaman depan yang membentang penuh (*Full-Bleed*).

```tsx
const Hero = () => {
  return (
    <section
      aria-labelledby="hero-title"
      className="relative w-full overflow-hidden min-h-170 flex items-center py-20 lg:py-28"
    >
      <img
        src="https://images.pexels.com/photos/4127628/pexels-photo-4127628.jpeg"
        alt="Latar belakang Tokoku"
        aria-hidden="true"
        className="absolute inset-0 w-full h-full object-cover object-[center_7%]"
      />

      <div
        aria-hidden="true"
        className="absolute inset-0 bg-linear-to-r from-slate-950/85 via-slate-950/60 to-slate-900/20"
      />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="max-w-xl">
          <h1 id="hero-title" className="text-3xl font-black sm:text-4xl lg:text-5xl text-white mb-5 leading-tight tracking-tight drop-shadow-sm">
            Belanja Kebutuhan Harian Lebih{" "}
            <span className="text-span">Mudah & Cepat</span>
          </h1>
          ...
          <a href="#katalog" className="inline-flex items-center justify-center px-7 py-3.5 rounded-xl bg-button ...">
            Mulai Belanja Sekarang
          </a>
        </header>
      </div>
    </section>
  );
};
```

### 🔍 Penjelasan Konsep & Alasan:
- **`className="relative w-full overflow-hidden min-h-170"`:**
  - **Alasan:** Menentukan tinggi vertikal banner hero yang megah dan proporsional.
- **`img className="absolute inset-0 w-full h-full object-cover object-[center_7%]"`:**
  - **`absolute inset-0` & `object-cover`:** Membuat foto memenuhi seluruh latar belakang tanpa distorsi.
  - **`object-[center_7%]`:** Mengatur titik fokus vertikal gambar. Dengan nilai 7%, gambar digeser turun sehingga objek bagian atas (topi model) terlihat jelas dan tidak terpotong.
- **Lapisan Gradasi Overlay (`bg-linear-to-r from-slate-950/85 ...`):**
  - **Alasan Kritis Aksesibilitas:** Memberikan lapisan gelap transparan di sisi kiri agar teks putih dan tombol oranye memiliki kontras yang sangat tinggi dan mudah dibaca oleh pengguna.
- **`aria-hidden="true"` pada Gambar & Overlay:**
  - **Alasan:** Menandai elemen dekoratif visual agar diabaikan oleh alat bantu tuna netra (*Screen Reader*).
- **`h1 id="hero-title"` & Tombol Anchor `href="#katalog"`:**
  - **Alasan:** Tag `<h1>` menjadi judul utama halaman. Tombol CTA mengarahkan browser untuk *smooth scroll* langsung ke bagian katalog produk di bawahnya.

---

## 12. `src/components/pages/Home/`
Halaman utama yang menggabungkan Hero Banner dengan katalog produk.

```tsx
import Hero from "../../ui/Hero";

const Home = () => {
  return (
    <>
      <Hero />
      <section id="katalog" aria-labelledby="home-heading" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 scroll-mt-20">
        <h2 id="home-heading" className="text-2xl font-bold text-header">
          Katalog Produk
        </h2>
        <p className="text-paragraf mt-1">
          Temukan produk pilihan terbaik untuk kebutuhanmu.
        </p>
      </section>
    </>
  );
};

export default Home;
```

### 🔍 Penjelasan Konsep & Alasan:
- **Hirarki Heading (`<h1>` vs `<h2>`):**
  - **Alasan SEO & Best Practice:** Dalam 1 halaman web, **hanya boleh ada satu tag `<h1>`** (yang sudah berada di dalam `Hero`). Oleh karena itu, judul bagian katalog di bawahnya menggunakan tag **`<h2>`**.
- **`id="katalog"` & `scroll-mt-20`:**
  - **Alasan:** Target scroll dari tombol Hero. Class `scroll-mt-20` (*scroll margin top*) memberi ruang atas 80px agar saat di-scroll, judul "Katalog Produk" tidak tertutup oleh navbar fixed.

---

## 13. `src/components/pages/ProductDetail/`
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
  - **Maksud:** Menangkap nilai dinamis dari URL browser (misal: `/product/15` -> variabel `id` berisi `"15"`).
- **Tombol Kembali (`<Link to="/">`):**
  - **Alasan:** Navigasi SPA cepat kembali ke beranda tanpa reload halaman.

---

## 14. `src/components/pages/Cart/`
Halaman keranjang belanja.

- Menggunakan komponen modular dan barrel export `index.tsx` yang seragam untuk menampung daftar belanjaan dari state global nanti.

---

## 15. `src/routes/Route.tsx`
Daftar konfigurasi rute aplikasi.

```tsx
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
  - **Alasan:** Memberikan *strict typing* dari React Router untuk memastikan struktur path dan elemen anak valid.
- **Pola Nested Routes (`children: [...]`):**
  - **Alasan:** Seluruh komponen di dalam `children` akan otomatis masuk ke dalam slot `<Outlet />` milik `MainLayout`.

---

## 16. `src/routes/index.tsx`
Pusat inisialisasi router.

```tsx
import { createBrowserRouter } from "react-router-dom";
import routes from "./Route";

export const router = createBrowserRouter(routes);
```

### 🔍 Penjelasan:
- **`createBrowserRouter(routes)`:**
  - **Alasan Memisahkan Konfigurasi:** Memisahkan data array rute (`Route.tsx`) dari instansiasi router (`index.tsx`) adalah prinsip *Separation of Concerns*, memudahkan pengujian dan pemeliharaan kode di masa depan.

---

🎯 **Ringkasan Progres:** Seluruh arsitektur dasar, styling modern Tailwind v4 (`@theme`), Hero Section interaktif, dan Navbar pintar dengan scroll-detection sudah selesai, rapi, dan terdokumentasi lengkap!
