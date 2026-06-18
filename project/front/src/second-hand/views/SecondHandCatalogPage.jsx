import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { apiClient } from "../../common/utils/apiClient";

const fallbackImage = (category) =>
  `https://placehold.co/400x300?text=${encodeURIComponent(category || "Produit")}`;

export default function SecondHandCatalogPage() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    apiClient
      .get("/public/second-hand/products")
      .then((res) => {
        console.log("Produits reçus:", res.data);
        setProducts(res.data || []);
      })
      .catch((err) => {
        console.error(
          "Erreur lors de la récupération des produits de seconde main",
          err,
        );
        setError("Impossible de charger les annonces de seconde main.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <div className="relative flex flex-col overflow-hidden bg-white text-[#040037] font-['Figtree',sans-serif]">
      <main className="flex-1">
        {/* Banner Section */}
        <section className="px-6 pt-4 pb-2">
          <div className="flex flex-col gap-1">
            <h2 className="text-xl font-bold leading-tight">
              Catalogue Seconde Main
            </h2>
            <p className="text-sm text-[#7C7A8A]">
              {loading
                ? "Chargement des articles..."
                : `${products.length} articles disponibles`}
            </p>
          </div>
        </section>

        {/* Products Grid */}
        <section className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 px-6 pt-3 pb-6">
          {loading && (
            <p className="col-span-full text-center text-sm text-[#7C7A8A] py-12">
              Chargement des meilleures offres...
            </p>
          )}

          {error && (
            <p className="col-span-full text-center text-sm text-red-500 py-12">
              {error}
            </p>
          )}

          {!loading && !error && products.length === 0 && (
            <p className="col-span-full text-center text-sm text-[#7C7A8A] py-12">
              Aucun article disponible pour le moment.
            </p>
          )}

          {!loading &&
            !error &&
            products.map((product) => (
              <article
                key={product.id}
                onClick={() => {
                  navigate(`/second-hand/products/${product.id}`);
                }}
                className="flex flex-col rounded-lg bg-white p-2 shadow-[0_1px_4px_rgba(0,0,0,0.08)] cursor-pointer transition-all hover:shadow-[0_4px_12px_rgba(0,0,0,0.12)] active:scale-[0.98] border border-gray-100"
              >
                <div className="relative w-full aspect-[4/3] rounded-md overflow-hidden bg-gray-50">
                  <img
                    src={product.imageUrl || fallbackImage(product.category)}
                    alt={product.title}
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = fallbackImage(product.category);
                    }}
                  />
                  <span className="absolute top-2 right-2 rounded-full bg-white/90 backdrop-blur-xs px-2 py-0.5 text-[10px] font-semibold tracking-wide border border-[#040037]/10">
                    Seconde main
                  </span>
                </div>

                <div className="mt-2.5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-sm font-semibold truncate text-[#040037]">
                      {product.title}
                    </h3>
                    <p className="mt-0.5 text-xs text-[#7C7A8A] truncate">
                      {product.category || "Catégorie non spécifiée"}
                    </p>
                  </div>

                  <div className="mt-3 flex items-baseline justify-between">
                    <span className="text-base font-bold text-[#040037]">
                      {product.price} €
                    </span>
                  </div>
                </div>
              </article>
            ))}
        </section>
      </main>
    </div>
  );
}
