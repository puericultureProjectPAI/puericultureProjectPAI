import { useEffect } from "react";
import { useNavigate } from "react-router";

import useSecondHandCatalog from "../hooks/useSecondHandCatalog";

const fallbackImage = (category) =>
  `https://placehold.co/400x300?text=${encodeURIComponent(
    category || "Produit",
  )}`;

export default function SecondHandCatalogPage() {
  const navigate = useNavigate();

  const { products, loading, error, fetchSecondHandProducts } =
    useSecondHandCatalog();

  useEffect(() => {
    fetchSecondHandProducts();
  }, []);

  return (
    <div className="relative flex flex-col overflow-hidden bg-white text-[#040037]">
      <main className="flex-1">
        {/* HEADER */}
        <section className="px-4 md:px-6 pt-[12px]">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-[18px] font-bold leading-tight">
                Articles de seconde main
              </h2>

              <p className="mt-[5px] text-[13px] leading-none text-[#7C7A8A]">
                {loading ? "..." : `${products.length} articles`}
              </p>
            </div>
          </div>
        </section>

        {/* GRID */}
        <section className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 px-4 md:px-6 pt-[14px] pb-4">
          {loading && (
            <p className="col-span-full text-center text-[13px] text-[#7C7A8A]">
              Chargement...
            </p>
          )}

          {error && (
            <p className="col-span-full text-center text-[13px] text-red-500">
              {error}
            </p>
          )}

          {!loading && !error && products.length === 0 && (
            <p className="col-span-full text-center text-[13px] text-[#7C7A8A]">
              Aucun article disponible.
            </p>
          )}

          {!loading &&
            !error &&
            products.map((product) => (
              <article
                key={product.id}
                onClick={() => navigate(`/second-hand/products/${product.id}`)}
                className="min-h-[240px] rounded-xl bg-white p-3 shadow-[0_1px_4px_rgba(0,0,0,0.10)] cursor-pointer flex flex-col justify-between gap-2 transition-transform active:scale-95"
              >
                {/* Image avec border-radius augmenté */}
                <img
                  src={product.imageUrl || fallbackImage(product.category)}
                  alt={product.title}
                  className="h-[120px] w-full rounded-lg object-cover"
                />

                <div className="flex justify-end mt-auto">
                  <span className="rounded-full border border-[#040037] px-3 py-0.5 text-[11px] font-medium tracking-wide">
                    Location
                  </span>
                </div>

                {/* Infos & Bouton alignés */}
                <div className="flex-1 flex flex-col justify-between gap-2">
                  <div>
                    <h3 className="text-[14px] font-medium leading-tight truncate">
                      {product.title}
                    </h3>
                    <p className="mt-[4px] text-[14px] font-bold leading-tight">
                      {product.price} €
                    </p>
                  </div>
                </div>
              </article>
            ))}
        </section>
      </main>
    </div>
  );
}
