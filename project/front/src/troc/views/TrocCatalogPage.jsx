import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../../common/security/AuthContext";
import TrocSuggestionList from "../components/TrocSuggestionList.jsx";
import useTroc from "../hooks/useTroc";
import CatalogTabs from "../../common/components/CatalogTabs.jsx";

const fallbackImage = (category) =>
  `https://placehold.co/400x300?text=${encodeURIComponent(category)}`;

const productImage = (product) =>
  product?.images?.[0]?.imageUrl ||
  product?.firstImageUrl ||
  fallbackImage(product?.category || "Article");

const formatPrice = (price) => {
  if (price === null || price === undefined || price === "") {
    return "Prix non renseigné";
  }

  return `${price}€`;
};

export default function CatalogPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const {
    error,
    fetchTrocSuggestions,
    getProductsTroc,
    loading,
    products,
    suggestionsError,
    suggestionsLoading,
    trocSuggestions,
  } = useTroc();

  useEffect(() => {
    const timeoutId = globalThis.setTimeout(() => {
      void getProductsTroc();
    }, 0);

    return () => globalThis.clearTimeout(timeoutId);
  }, []);

  useEffect(() => {
    const timeoutId = globalThis.setTimeout(() => {
      void fetchTrocSuggestions();
    }, 0);

    return () => globalThis.clearTimeout(timeoutId);
  }, [fetchTrocSuggestions]);

  const goToProductDetail = (product) => {
    if (product?.id) {
      navigate(`/troc/products/${product.id}`);
    }
  };

  const handlePropose = (product) => {
    if (!isAuthenticated) navigate("/connection");
    else navigate(`/troc/select-my-product/${product.id}`);
  };

  return (
    <div className="relative flex flex-col overflow-hidden bg-white font-['Figtree'] text-[#080036]">
      <main className="flex-1">
        <CatalogTabs />

        <section className="px-6 pt-1">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-[20px] font-bold leading-[24px]">
                Articles disponibles à l'échange
              </h1>

              <p className="mt-1 text-[14px] leading-[18px] text-[#7C7A8A]">
                {loading ? "…" : `${products.length} articles`}
              </p>
            </div>

            <button
              type="button"
              aria-label="Afficher les filtres"
              className="flex h-10 w-10 shrink-0 items-center justify-center text-[#080036]"
            >
              <svg
                aria-hidden="true"
                className="h-8 w-8"
                fill="none"
                viewBox="0 0 32 32"
              >
                <path
                  d="M5 6h22L19 16v9l-6 3V16L5 6Z"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2.7"
                />
              </svg>
            </button>
          </div>
        </section>

        <section className="grid grid-cols-2 gap-3 px-6 pb-5 pt-4 md:grid-cols-3 lg:grid-cols-4">
          {loading && (
            <p className="col-span-full py-6 text-center text-[13px] text-[#7C7A8A]">
              Chargement…
            </p>
          )}

          {error && (
            <p className="col-span-full py-6 text-center text-[13px] text-red-500">
              {error}
            </p>
          )}

          {!loading && !error && products.length === 0 && (
            <p className="col-span-full py-6 text-center text-[13px] text-[#7C7A8A]">
              Aucun article disponible.
            </p>
          )}

          {!loading &&
            !error &&
            products.map((product) => (
              <article
                key={product.id}
                className="cursor-pointer overflow-hidden rounded-[9px] bg-white shadow-[0_1px_4px_rgba(0,0,0,0.10)] transition-transform active:scale-[0.99]"
                onClick={() => goToProductDetail(product)}
              >
                <img
                  alt={product.postTitle}
                  className="aspect-square w-full bg-[#F5F5F7] object-cover"
                  src={productImage(product)}
                />

                <div className="px-3 pb-4 pt-2">
                  <div className="flex justify-end">
                    <span className="rounded-[12px] border border-[#080036] px-3 py-1 text-[13px] leading-[18px]">
                      Troc
                    </span>
                  </div>

                  <h2 className="mt-2 truncate text-[16px] font-normal leading-5">
                    {product.postTitle}
                  </h2>

                  <p className="mt-1 text-[16px] font-bold leading-5">
                    {formatPrice(product.estimatedPrice)}
                  </p>
                </div>
              </article>
            ))}
        </section>

        <section className="px-6 pb-8 pt-1">
          {suggestionsError && (
            <p className="mb-3 text-[13px] text-red-500">{suggestionsError}</p>
          )}

          <TrocSuggestionList
            loading={suggestionsLoading}
            onAccept={handlePropose}
            onRefresh={fetchTrocSuggestions}
            onViewDetails={goToProductDetail}
            suggestions={trocSuggestions}
          />
        </section>
      </main>
    </div>
  );
}
