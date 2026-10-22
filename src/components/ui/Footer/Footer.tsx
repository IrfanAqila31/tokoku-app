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
