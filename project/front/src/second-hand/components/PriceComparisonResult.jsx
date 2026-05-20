import { useNavigate } from "react-router-dom";

const PriceComparisonResult = ({ product, comparison, status }) => {
  const navigate = useNavigate();

  // Fonction de navigation commune pour tes tests
  const handleRedirect = () => navigate("/testredirect");

  // --- ÉTAT LOADING : Skeleton Loader (Note Technique) ---
  if (status === "LOADING") {
    return (
      <div className="mx-auto max-w-4xl p-4 animate-pulse">
        <div className="mb-6 h-8 w-48 rounded bg-gray-200"></div>
        <div className="mb-8 h-32 w-full rounded-xl bg-gray-100"></div>
        <div className="grid grid-cols-2 gap-4">
          <div className="h-40 rounded-lg bg-gray-100"></div>
          <div className="h-40 rounded-lg bg-gray-100"></div>
        </div>
      </div>
    );
  }

  // --- ÉTAT ERROR 404 : Produit Introuvable (CA & PUE-197) ---
  if (status === "ERROR") {
    return (
      <div className="mx-auto max-w-md p-6 text-center">
        <h2 className="text-xl font-bold mb-4">Produit introuvable</h2>
        {/* Intégration du composant de saisie manuelle */}
        <div className="mb-8 p-6 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50 text-gray-400 italic">
          [UnknownProductForm - PUE-197]
        </div>
        <button
          onClick={handleRedirect}
          className="w-full rounded-full border-2 border-[#000033] py-3 font-bold text-[#000033]"
        >
          Scanner à nouveau
        </button>
      </div>
    );
  }

  // --- DONNÉES PRÉSENTES (Succès ou Vide) ---
  const {
    listingsCount,
    averageOccasionPrice,
    savingsAmount,
    savingsPercent,
    lowSampleWarning,
  } = comparison;
  const hasListings = listingsCount > 0;

  return (
    <div className="mx-auto max-w-4xl p-4 pb-32">
      {/* Header : Nom et Marque (CA) */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#000033]">
          Articles disponibles
        </h1>
        <p className="text-gray-500 font-medium">
          {product.brand} - {product.name}
        </p>
      </div>

      {hasListings ? (
        /* CAS 1 : Annonces disponibles */
        <>
          <div className="mb-8 overflow-hidden rounded-xl border border-green-200 bg-white shadow-sm">
            <div className="flex flex-col items-center justify-center p-6 md:flex-row md:justify-around">
              <div className="text-center">
                {/* Prix neuf barré (CA) */}
                <p className="text-sm text-gray-400 line-through">
                  {product.newPrice}€
                </p>
                {/* Prix moyen vert et gras (CA) */}
                <p className="text-3xl font-black text-green-600">
                  {averageOccasionPrice}€
                </p>
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-tighter">
                  Moyenne occasion
                </p>
              </div>

              <div className="mt-4 h-px w-12 bg-gray-100 md:mt-0 md:h-12 md:w-px"></div>

              {/* Économie mise en évidence (CA) */}
              <div className="mt-4 rounded-full bg-green-50 px-6 py-2 border border-green-100">
                <span className="text-lg font-bold text-green-700">
                  +{savingsAmount}€ économisés ({savingsPercent}%)
                </span>
              </div>
            </div>

            {/* Mention lowSampleWarning (CA) */}
            {lowSampleWarning && (
              <div className="bg-orange-50 py-1 text-center text-[11px] font-bold text-orange-600 border-t border-orange-100">
                Prix indicatif — peu d'annonces disponibles
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Emplacement pour les listings */}
            <div className="h-40 rounded-lg bg-gray-50 border border-gray-100"></div>
            <div className="h-40 rounded-lg bg-gray-50 border border-gray-100"></div>
          </div>
        </>
      ) : (
        /* CAS 2 : Aucune annonce (CA) */
        <div className="py-20 text-center">
          <p className="text-lg font-medium text-gray-600 px-6">
            Aucune annonce disponible pour cet article pour le moment.
          </p>
        </div>
      )}

      {/* --- NAVIGATION PERSISTANTE (CA & Redirection) --- */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/90 border-t backdrop-blur-sm">
        <div className="max-w-4xl mx-auto flex flex-col gap-3">
          <button
            onClick={handleRedirect}
            className={`w-full rounded-full py-4 font-bold text-white transition-transform active:scale-95 shadow-lg ${
              hasListings ? "bg-[#000033]" : "bg-indigo-600"
            }`}
          >
            {/* Remplacement dynamique du bouton (CA) */}
            {hasListings
              ? `Voir les ${listingsCount} annonces`
              : "Créer une alerte prix"}
          </button>

          <button
            onClick={handleRedirect}
            className="w-full rounded-full border-2 border-[#000033] py-3 font-bold text-[#000033]"
          >
            Scanner un autre produit
          </button>
        </div>
      </div>
    </div>
  );
};

export default PriceComparisonResult;
