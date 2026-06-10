import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { apiClient } from "../../common/utils/apiClient";
import ongletSec from "../../assets/catalog/onglet-sec.png";
import ongletTroc from "../../assets/catalog/onglet-troc.png";
import ongletLeas from "../../assets/catalog/onglet-leas.png";
import ongletFt from "../../assets/catalog/onglet-ft.png";
import arrowRightIcon from "../../assets/icons/arrow-right-icon-brand-l.svg";
import ProductCard from "../components/ProductCard";

export default function GlobalCatalogView() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient
      .get("/public/leasing/products")
      .then((res) => setProducts(res.data))
      .catch((err) => console.error("Erreur chargement articles", err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="flex flex-col h-full w-full bg-white font-['Figtree'] overflow-hidden">
      <div className="flex-1 overflow-y-auto pb-6">
        {/* Categories Horizontal List */}
        <div className="w-full overflow-x-auto hide-scrollbar">
          <div className="flex gap-3 px-6 py-4 w-max">
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

        {/* Section 1: Nos recommandations */}
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
              {loading ? (
                <p className="text-sm text-gray-500 py-4">Chargement...</p>
              ) : products.length === 0 ? (
                <p className="text-sm text-gray-500 py-4">
                  Aucun article disponible.
                </p>
              ) : (
                products
                  .slice(0, Math.ceil(products.length / 2))
                  .map((p) => <ProductCard key={p.id} p={p} />)
              )}
            </div>
          </div>
        </div>

        {/* Section 2: Articles 3-6 mois */}
        <div className="flex flex-col gap-2 mt-6">
          <div className="flex justify-between items-center px-6">
            <h2 className="text-[#080036] text-xl font-bold">
              Articles 3-6 mois
            </h2>
            <div className="flex justify-end items-center overflow-hidden">
              <img src={arrowRightIcon} alt="voir plus" className="w-4 h-8" />
            </div>
          </div>

          <div className="w-full overflow-x-auto hide-scrollbar">
            <div className="flex gap-4 px-6 pb-2 pt-1 w-max snap-x">
              {loading ? (
                <p className="text-sm text-gray-500 py-4">Chargement...</p>
              ) : products.length === 0 ? (
                <p className="text-sm text-gray-500 py-4">
                  Aucun article disponible.
                </p>
              ) : (
                products
                  .slice(Math.ceil(products.length / 2))
                  .map((p) => <ProductCard key={p.id} p={p} />)
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
