import { Outlet, Link } from "react-router-dom";
import { ShoppingBag, ShoppingCart } from "lucide-react";

export default function MainLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans">
      {/* HEADER & NAV SEMANTIK */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <nav
          aria-label="Navigasi Utama"
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between"
        >
          {/* Logo / Brand */}
          <Link
            to="/"
            className="flex items-center gap-2 text-indigo-600 font-extrabold text-xl tracking-tight hover:opacity-90 transition-opacity"
          >
            <ShoppingBag className="w-6 h-6" />
            <span>Tokoku</span>
          </Link>

          {/* Navigation Items */}
          <div className="flex items-center gap-4">
            <Link
              to="/"
              className="text-sm font-medium text-slate-700 hover:text-indigo-600 transition-colors"
            >
              Katalog
            </Link>

            {/* Cart Link with Badge */}
            <Link
              to="/cart"
              className="relative p-2 text-slate-700 hover:text-indigo-600 transition-colors rounded-full hover:bg-slate-100"
              aria-label="Keranjang Belanja"
            >
              <ShoppingCart className="w-5 h-5" />
              {/* Badge placeholder (nanti akan dikoneksikan ke Zustand) */}
              <span className="absolute -top-1 -right-1 bg-indigo-600 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full shadow-sm">
                0
              </span>
            </Link>
          </div>
        </nav>
      </header>

      {/* KONTEN UTAMA */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>

      {/* FOOTER SEMANTIK */}
      <footer className="bg-white border-t border-slate-200 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-slate-500">
          <p>
            © {new Date().getFullYear()} Tokoku App. Dibuat dengan React 19,
            TypeScript & Tailwind CSS v4.
          </p>
        </div>
      </footer>
    </div>
  );
}
