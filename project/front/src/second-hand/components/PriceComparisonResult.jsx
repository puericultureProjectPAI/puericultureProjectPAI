import ProductCard from "./ProductCard";
import { useNavigate } from "react-router-dom";

const PriceComparisonResult = ({ product, comparison, status }) => {
  const navigate = useNavigate();

  const handleRedirect = () => {
    navigate("/testredirect");
  };

  /**
   * LOADING
   */
  if (status === "LOADING") {
    return (
      <div className="mx-auto max-w-4xl animate-pulse p-4">
        <div className="mb-6 h-8 w-48 rounded bg-gray-200"></div>

        <div className="mb-8 h-32 w-full rounded-xl bg-gray-100"></div>

        <div className="grid grid-cols-2 gap-4">
          <div className="h-48 rounded-lg bg-gray-100"></div>
          <div className="h-48 rounded-lg bg-gray-100"></div>
        </div>
      </div>
    );
  }

  /**
   * ERROR
   */
  if (status === "ERROR" || !product || (status !== "LOADING" && !comparison)) {
    return (
      <div className="mx-auto max-w-md p-6 text-center">
        <h2 className="mb-4 text-xl font-bold text-gray-800">
          Produit introuvable
        </h2>

        <div className="mb-8 rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 p-6 italic text-gray-400">
          [UnknownProductForm - PUE-197]
        </div>

        <button
          onClick={handleRedirect}
          className="w-full rounded-full border-2 border-[#000033] py-3 font-bold text-[#000033] active:bg-gray-50"
        >
          Scanner à nouveau
        </button>
      </div>
    );
  }

  /**
   * Data sécurisée
   */
  const {
    listingsCount = 0,
    averageOccasionPrice = 0,
    savingsAmount = 0,
    savingsPercent = 0,
    lowSampleWarning = false,
  } = comparison;

  const hasListings = listingsCount > 0;

  return (
    <div className="mx-auto max-w-4xl p-4 pb-40">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#000033]">
          Articles disponibles
        </h1>

        <p className="text-sm font-medium text-gray-500">
          {hasListings
            ? `${listingsCount} articles correspondants à : ${product.name}`
            : `0 article correspondant à : ${product.name}`}
        </p>
      </div>

      {hasListings ? (
        <>
          {/* Bloc économie */}
          <div className="mb-8 overflow-hidden rounded-xl border border-green-200 bg-white shadow-sm">
            <div className="flex flex-col items-center justify-center p-6 md:flex-row md:justify-around">
              {/* Prix */}
              <div className="text-center">
                <p className="text-sm text-gray-400 line-through">
                  {product.newPrice}€
                </p>

                <p className="text-3xl font-black text-green-600">
                  {averageOccasionPrice}€
                </p>

                <p className="text-[10px] uppercase tracking-tight text-gray-400">
                  Prix moyen d'occasion
                </p>
              </div>

              {/* Divider */}
              <div className="mt-4 h-px w-12 bg-gray-100 md:mt-0 md:h-12 md:w-px"></div>

              {/* Économie */}
              <div className="mt-4 rounded-full border border-green-100 bg-green-50 px-6 py-2 text-center md:mt-0">
                <span className="text-lg font-bold text-green-700">
                  +{savingsAmount}€ économisés ({savingsPercent}%)
                </span>
              </div>
            </div>

            {lowSampleWarning && (
              <div className="border-t border-orange-100 bg-orange-50 py-1 text-center text-[11px] font-bold text-orange-600">
                Prix indicatif — peu d'annonces disponibles
              </div>
            )}
          </div>

          {/* Grid produits */}
          <div className="mb-8 grid grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((id) => (
              <ProductCard key={id} product={product} />
            ))}
          </div>

          {/* CTA secondaire */}
          <div className="mb-10 flex justify-center">
            <button
              onClick={handleRedirect}
              className="w-full max-w-xs rounded-lg bg-[#000033] py-3 text-sm font-bold text-white shadow-md active:scale-95"
            >
              Scanner à nouveau
            </button>
          </div>
        </>
      ) : (
        <div className="py-20 text-center">
          <p className="mb-8 text-lg font-medium text-gray-600">
            Aucun article disponible pour le moment...
          </p>

          <button
            onClick={handleRedirect}
            className="w-full max-w-xs rounded-lg bg-[#000033] py-3 text-sm font-bold text-white shadow-md"
          >
            Scanner à nouveau
          </button>
        </div>
      )}

      {/* Footer fixe */}
      <div className="fixed bottom-0 left-0 right-0 border-t bg-white/90 p-4 backdrop-blur-sm">
        <div className="mx-auto flex max-w-4xl flex-col gap-3">
          <button
            onClick={handleRedirect}
            className={`w-full rounded-full py-4 font-bold text-white shadow-lg transition-transform active:scale-95 ${
              hasListings ? "bg-[#000033]" : "bg-indigo-600"
            }`}
          >
            {hasListings
              ? `Voir les ${listingsCount} annonces`
              : "Créer une alerte prix"}
          </button>

          <div className="mt-2 flex items-center justify-around text-gray-400">
            {/* Navigation mobile */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PriceComparisonResult;
