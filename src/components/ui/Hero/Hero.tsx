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
          <h1
            id="hero-title"
            className="text-3xl font-black sm:text-4xl lg:text-5xl text-white mb-5 leading-tight tracking-tight drop-shadow-sm"
          >
            Belanja Kebutuhan Harian Lebih{" "}
            <span className="text-span">Mudah & Cepat</span>
          </h1>

          <p className="text-slate-200 text-base sm:text-lg mb-8 leading-relaxed">
            Temukan ribuan barang berkualitas mulai dari gadget, kecantikan,
            hingga kebutuhan rumah dengan harga terbaik dan garansi resmi.
          </p>

          <a
            href="#katalog"
            className="inline-flex items-center justify-center px-7 py-3.5 rounded-xl bg-button hover:bg-orange-600 text-white font-semibold shadow-lg shadow-button/30 transition-all transform hover:-translate-y-0.5 cursor-pointer"
          >
            Mulai Belanja Sekarang
          </a>
        </header>
      </div>
    </section>
  );
};

export default Hero;
