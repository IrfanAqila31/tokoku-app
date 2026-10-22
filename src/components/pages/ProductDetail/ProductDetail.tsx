import { useParams, Link } from "react-router-dom";

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  return (
    <section aria-labelledby="detail-heading">
      <Link
        to="/"
        className="text-indigo-600 hover:underline text-sm mb-4 inline-block"
      >
        &larr; Kembali ke Katalog
      </Link>
      <h1 id="detail-heading" className="text-2xl font-bold text-slate-800">
        Detail Produk #{id}
      </h1>
    </section>
  );
};

export default ProductDetail;
