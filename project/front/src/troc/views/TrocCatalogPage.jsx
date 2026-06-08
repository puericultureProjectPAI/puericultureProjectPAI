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
              <h2 className="text-[13px] font-bold leading-none">
                Articles disponibles à l'échange
              </h2>

              <p className="mt-[5px] text-[9px] leading-none text-[#7C7A8A]">
                {loading ? "…" : `${products.length} articles`}
              </p>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 px-4 md:px-6 pt-[14px] pb-4">
          {loading && (
            <p className="col-span-2 text-center text-[9px] text-[#7C7A8A]">
              Chargement…
            </p>
          )}

          {error && (
            <p className="col-span-2 text-center text-[9px] text-red-500">
              {error}
            </p>
          )}

          {!loading && !error && products.length === 0 && (
            <p className="col-span-2 text-center text-[9px] text-[#7C7A8A]">
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
                className={`h-[170px] rounded-[6px] bg-white p-[5px] shadow-[0_1px_4px_rgba(0,0,0,0.10)] cursor-pointer`}
              >
                <img
                  src={
                    product.images[0]
                      ? product.images[0].imageUrl
                      : fallbackImage(product.category)
                  }
                  alt={product.postTitle}
                  className="h-[95px] w-full rounded-[5px] object-cover"
                />

                <div className="mt-[4px] flex justify-center gap-[4px]">
                  <span className="rounded-full border border-[#040037] px-[7px] text-[7px] leading-[10px]">
                    Location
                  </span>

                  <span className="rounded-full border border-[#040037] px-[7px] text-[7px] leading-[10px]">
                    Troc
                  </span>
                </div>

                <h3 className="mt-[5px] truncate text-[8px] leading-none">
                  {product.postTitle}
                </h3>

                <p className="mt-[2px] truncate text-[7px] leading-none text-[#7C7A8A]">
                  {product.category} · {product.condition}
                </p>

                <p className="mt-[3px] text-[9px] font-bold leading-none">
                  {product.estimatedPrice}
                </p>
              </article>
            ))}
        </section>

        <section className="px-4 md:px-6 pt-[12px]">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-[13px] font-bold leading-none">
                Nos recommandations
              </h2>

              <p className="mt-[5px] text-[9px] leading-none text-[#7C7A8A]">
                {loading ? "…" : `${products.length} articles`}
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
