import { useEffect } from "react";
import { useNavigate } from "react-router";
import useTroc from "../hooks/useTroc";

const fallbackImage = (category) =>
  `https://placehold.co/400x300?text=${encodeURIComponent(category)}`;

export default function CatalogPage() {
  const navigate = useNavigate();

  const { error, loading, getProductsTroc, products } = useTroc();

  useEffect(() => {
    getProductsTroc();
  }, []);

  return (
    <div className="relative flex flex-col overflow-hidden bg-white text-[#040037]">
      <main className="flex-1">
        <section className="px-4 md:px-6 pt-[12px]">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-[18px] font-bold leading-tight">
                Articles disponibles à l'échange
              </h2>

              <p className="mt-[5px] text-[13px] leading-none text-[#7C7A8A]">
                {loading ? "…" : `${products.length} articles`}
              </p>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 px-4 md:px-6 pt-[14px] pb-4">
          {loading && (
            <p className="col-span-2 text-center text-[13px] text-[#7C7A8A]">
              Chargement…
            </p>
          )}

          {error && (
            <p className="col-span-2 text-center text-[13px] text-red-500">
              {error}
            </p>
          )}

          {!loading && !error && products.length === 0 && (
            <p className="col-span-2 text-center text-[13px] text-[#7C7A8A]">
              Aucun article disponible.
            </p>
          )}

          {!loading &&
            !error &&
            products.map((product) => (
              <article
                key={product.id}
                onClick={() => {
                  navigate(`/troc/products/${product.id}`);
                }}
                className={`h-[220px] rounded-[6px] bg-white p-[8px] shadow-[0_1px_4px_rgba(0,0,0,0.10)] cursor-pointer`}
              >
                <img
                  src={
                    product.images[0]
                      ? product.images[0].imageUrl
                      : fallbackImage(product.category)
                  }
                  alt={product.postTitle}
                  className="h-[120px] w-full rounded-[5px] object-cover"
                />

                <div className="mt-[6px] flex justify-center">
                  <span className="rounded-full border border-[#040037] px-[9px] text-[12px] leading-[18px]">
                    Troc
                  </span>
                </div>

                <h3 className="mt-[7px] truncate text-[14px] leading-tight">
                  {product.postTitle}
                </h3>

                <p className="mt-[3px] truncate text-[12px] leading-tight text-[#7C7A8A]">
                  {product.category} · {product.condition}
                </p>

                <p className="mt-[4px] text-[14px] font-bold leading-tight">
                  {product.estimatedPrice}
                </p>
              </article>
            ))}
        </section>

        <section className="px-4 md:px-6 pt-[12px]">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-[18px] font-bold leading-tight">
                Nos recommandations
              </h2>

              <p className="mt-[5px] text-[13px] leading-none text-[#7C7A8A]">
                {loading ? "…" : `${products.length} articles`}
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
