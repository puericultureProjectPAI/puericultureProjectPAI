import {
  useRecommendations,
  useQuartersProducts,
} from "../hooks/useGlobalCatalog";
import arrowRightIcon from "../../assets/icons/arrow-right-icon-brand-l.svg";
import ProductCard from "../components/ProductCard";
import CatalogTabs from "../components/CatalogTabs";

const QUARTERS = [
  { label: "0-3 mois", min: 0, max: 3 },
  { label: "3-6 mois", min: 3, max: 6 },
  { label: "6-9 mois", min: 6, max: 9 },
  { label: "9-12 mois", min: 9, max: 12 },
];

export default function GlobalCatalogView() {
  // Utilisation de TanStack Query via le custom hook
  const { data: recommendations = [], isLoading: loadingRecs } =
    useRecommendations();
  const quartersQueries = useQuartersProducts(QUARTERS);

  return (
    <div className="flex flex-col h-full w-full bg-white font-['Figtree'] overflow-hidden">
      <div className="flex-1 overflow-y-auto pb-6">
        {/* Categories Horizontal List */}
        <CatalogTabs />

        {/* Section: Nos recommandations */}
        <div className="flex flex-col gap-2 mt-2">
          <div className="flex justify-between items-center px-6">
            <h2 className="text-[#080036] text-xl font-bold">
              Nos recommandations
            </h2>
            <div className="flex justify-end items-center overflow-hidden">
              <img src={arrowRightIcon} alt="voir plus" className="w-4 h-8" />
            </div>
          </div>

          <div className="w-full overflow-x-auto hide-scrollbar">
            <div className="flex gap-4 px-6 pb-2 pt-1 w-max snap-x">
              {loadingRecs ? (
                <p className="text-sm text-gray-500 py-4">Chargement...</p>
              ) : recommendations.length === 0 ? (
                <p className="text-sm text-gray-500 py-4">
                  Pas de recommandation disponible
                </p>
              ) : (
                recommendations.map((p) => <ProductCard key={p.id} p={p} />)
              )}
            </div>
          </div>
        </div>

        {/* Sections par tranche d'âge */}
        {quartersQueries.map((query, idx) => {
          const quarter = QUARTERS[idx];
          const products = query.data?.products || [];
          return (
            <div
              key={idx}
              className={`flex flex-col gap-2 ${idx === 0 ? "mt-2" : "mt-6"}`}
            >
              <div className="flex justify-between items-center px-6">
                <h2 className="text-[#080036] text-xl font-bold">
                  Articles {quarter.label}
                </h2>
                <div className="flex justify-end items-center overflow-hidden">
                  <img
                    src={arrowRightIcon}
                    alt="voir plus"
                    className="w-4 h-8"
                  />
                </div>
              </div>

              <div className="w-full overflow-x-auto hide-scrollbar">
                <div className="flex gap-4 px-6 pb-2 pt-1 w-max snap-x">
                  {query.isLoading ? (
                    <p className="text-sm text-gray-500 py-4">Chargement...</p>
                  ) : products.length === 0 ? (
                    <p className="text-sm text-gray-500 py-4">
                      Aucun article disponible pour cette tranche d'âge.
                    </p>
                  ) : (
                    products.map((p) => <ProductCard key={p.id} p={p} />)
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
