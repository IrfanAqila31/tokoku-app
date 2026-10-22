import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { ShoppingBag, ShoppingCart } from "lucide-react";

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

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isWhiteNav
          ? "bg-white/90 backdrop-blur-md shadow-xs border-b border-slate-200 text-slate-800"
          : "bg-transparent border-b border-transparent text-white"
      }`}
    >
      <nav
        aria-label="Navigasi Utama"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between"
      >
        <Link
          to="/"
          className={`flex items-center gap-2 font-extrabold text-xl tracking-tight transition-colors ${
            isWhiteNav
              ? "text-header hover:opacity-90"
              : "text-white hover:text-span"
          }`}
        >
          <ShoppingBag className="w-6 h-6" />
          <span>Tokoku</span>
        </Link>

        <div className="flex items-center gap-6">
          <Link
            to="/"
            className={`text-sm font-medium transition-colors ${
              isWhiteNav
                ? "text-slate-700 hover:text-span"
                : "text-white/90 hover:text-white"
            }`}
          >
            Katalog
          </Link>

          <Link
            to="/cart"
            className={`relative p-2 rounded-full transition-colors ${
              isWhiteNav
                ? "text-slate-700 hover:bg-slate-100 hover:text-span"
                : "text-white hover:bg-white/10"
            }`}
            aria-label="Keranjang Belanja"
          >
            <ShoppingCart className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 bg-span text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full shadow-sm">
              0
            </span>
          </Link>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
