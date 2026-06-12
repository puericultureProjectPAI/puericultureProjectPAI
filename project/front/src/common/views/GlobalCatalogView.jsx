import { useNavigate } from "react-router";
import {
  useRecommendations,
  useQuartersProducts,
} from "../hooks/useGlobalCatalog";
import ongletSec from "../../assets/catalog/onglet-sec.png";
import ongletTroc from "../../assets/catalog/onglet-troc.png";
import ongletLeas from "../../assets/catalog/onglet-leas.png";
import ongletFt from "../../assets/catalog/onglet-ft.png";
import arrowRightIcon from "../../assets/icons/arrow-right-icon-brand-l.svg";
import ProductCard from "../components/ProductCard";

const QUARTERS = [
  { label: "0-3 mois", min: 0, max: 3 },
  { label: "3-6 mois", min: 3, max: 6 },
  { label: "6-9 mois", min: 6, max: 9 },
  { label: "9-12 mois", min: 9, max: 12 },
];

export default function GlobalCatalogView() {
  const navigate = useNavigate();

  // Utilisation de TanStack Query via le custom hook
  const { data: recommendations = [], isLoading: loadingRecs } =
    useRecommendations();
  const quartersQueries = useQuartersProducts(QUARTERS);

  return (
    <div className="flex flex-col h-full w-full bg-white font-['Figtree'] overflow-hidden">
      <div className="flex-1 overflow-y-auto pb-6">
        {/* Categories Horizontal List */}
        <div className="w-full overflow-x-auto hide-scrollbar">
          <div className="flex gap-3 px-6 py-4 w-max mx-auto">
            {[
              {
                label: "Seconde main",
                img: ongletSec,
                path: "/second-hand/catalog",
                pb: "pb-5",
              },
              {
                label: "Échange",
                img: ongletTroc,
                path: "/troc/catalog",
                pb: "pb-8",
              },
              {
                label: "Location",
                img: ongletLeas,
                path: "/leasing/catalog",
                pb: "pb-8",
              },
              {
                label: "Forward trading",
                img: ongletFt,
                path: "/forward/catalog",
                pb: "pb-5",
              },
            ].map((cat, idx) => (
              <div
                key={idx}
                onClick={() => navigate(cat.path)}
                className={`w-20 h-48 min-w-20 min-h-48 px-2 ${cat.pb} rounded-lg inline-flex flex-col justify-end items-center gap-2.5 overflow-hidden cursor-pointer transition-transform active:scale-95 bg-cover bg-center border border-gray-200`}
                style={{ backgroundImage: `url(${cat.img})` }}
              >
                <div className="w-full max-w-16 inline-flex justify-center items-center gap-2.5">
                  <div className="flex-1 text-center text-[#080036] text-base font-normal font-['Figtree'] leading-tight">
                    {cat.label}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

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
