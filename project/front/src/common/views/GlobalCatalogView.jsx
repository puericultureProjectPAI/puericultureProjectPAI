import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { apiClient } from "../../common/utils/apiClient";

const fallbackImage = (title) =>
  `https://placehold.co/400x300?text=${encodeURIComponent(title || "Produit")}`;

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
    <div className="flex flex-col h-full w-full bg-white font-['Figtree']">
      {/* Header section (Title & count) */}
      <div className="px-6 py-4 flex flex-col gap-1">
        <div className="grid grid-cols-4 gap-3 mb-4">
          {[
            {
              label: "Échange",
              img: "https://placehold.co/80x160?text=Echange",
              path: "/troc/catalog",
            },
            {
              label: "Location",
              img: "https://placehold.co/80x160?text=Location",
              path: "/leasing/catalog",
            },
            {
              label: "2nde Main",
              img: "https://placehold.co/80x160?text=2nde\nMain",
              path: "/second-hand/catalog",
            },
            {
              label: "Forward",
              img: "https://placehold.co/80x160?text=Forward",
              path: "/forward/catalog",
            },
          ].map((cat, idx) => (
            <div
              key={idx}
              onClick={() => navigate(cat.path)}
              className="flex flex-col items-center gap-1 cursor-pointer transition-transform active:scale-95"
            >
              <img
                src={cat.img}
                alt={cat.label}
                className="w-full aspect-[1/2] rounded-lg object-cover shadow-sm border border-gray-200"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Product Grid */}
      <div className="px-6 pb-6 grid grid-cols-2 gap-4">
        {loading ? (
          <div className="col-span-2 text-center text-sm text-gray-500 py-4">
            Chargement...
          </div>
        ) : products.length === 0 ? (
          <div className="col-span-2 text-center text-sm text-gray-500 py-4">
            Aucun article disponible.
          </div>
        ) : (
          products.map((p) => (
            <div
              key={p.id}
              className="bg-white rounded-lg shadow-sm pb-4 flex flex-col gap-2 overflow-hidden border border-gray-100 cursor-pointer transition-transform active:scale-95"
              onClick={() => navigate(`/leasing/products/${p.id}`)}
            >
              <div className="h-44 w-full bg-gray-100 overflow-hidden">
                <img
                  className="w-full h-full object-cover"
                  src={p.firstImageUrl || fallbackImage(p.postTitle)}
                  alt={p.postTitle}
                />
              </div>
              <div className="px-3 flex flex-col gap-1">
                <div className="flex justify-end">
                  <span className="px-3 py-1 rounded-xl border border-[#080036] text-[#080036] text-[10px] font-medium">
                    Location
                  </span>
                </div>
                <div className="text-center text-black text-sm font-normal truncate">
                  {p.postTitle}
                </div>
                <div className="text-center text-[#080036] text-sm font-bold">
                  {p.pricePerMonth}€/mois
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
