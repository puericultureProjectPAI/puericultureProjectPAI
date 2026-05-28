import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { apiClient } from "../../common/utils/apiClient";
import "../leasing.css";
const fallbackImage = (category) =>
  `https://placehold.co/400x300?text=${encodeURIComponent(category)}`;

export default function CatalogPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    apiClient
      .get("/public/leasing/products")
      .then((res) => setProducts(res.data))
      .catch(() => setError("Impossible de charger les articles."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="mx-auto h-screen w-[260px] overflow-y-auto bg-white text-[#040037]">
      <header className="flex h-[39px] items-center justify-between bg-[#040037] px-[10px] text-white">
        <span className="text-[14px] font-bold tracking-widest">KIABI</span>

        <div className="flex items-center gap-[10px]">
          <span className="material-symbols-rounded text-[17px]">
            qr_code_scanner
          </span>

          <span className="material-symbols-rounded text-[17px]">favorite</span>
        </div>
      </header>

      <section className="px-[8px] pt-[10px]">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-[11px] font-bold leading-none">
              Articles disponibles à la location
            </h2>

            <p className="mt-[4px] text-[9px] leading-none text-[#7C7A8A]">
              {loading ? "…" : `${products.length} articles`}
            </p>
          </div>

          <span className="material-symbols-rounded text-[18px]">
            filter_alt
          </span>
        </div>
      </section>

      <section className="grid grid-cols-2 gap-x-[10px] gap-y-[8px] px-[14px] pt-[12px] pb-[70px]">
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
        {products.map((product) => (
          <article
            key={product.id}
            onClick={() =>
              product.available && navigate(`/leasing/products/${product.id}`)
            }
            className={`rounded-[6px] bg-white p-[5px] shadow-[0_1px_4px_rgba(0,0,0,0.10)]${
              product.available
                ? " cursor-pointer"
                : " opacity-50 pointer-events-none"
            }`}
          >
            <img
              src={product.firstImageUrl || fallbackImage(product.category)}
              alt={product.postTitle}
              className="h-[110px] w-full rounded-[5px] object-cover"
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

            <p className="mt-[2px] text-[7px] leading-none text-[#7C7A8A]">
              {product.category} · {product.condition}
            </p>

            <p className="mt-[3px] text-[9px] font-bold leading-none">
              {product.pricePerMonth}€/mois
            </p>
          </article>
        ))}
      </section>

      <nav className="fixed bottom-0 left-1/2 flex h-[42px] w-[260px] -translate-x-1/2 items-center justify-around border-t border-[#E6E6E6] bg-white">
        {[
          { icon: "home", label: "Accueil", active: true },
          { icon: "search", label: "Rechercher" },
          { icon: "add_circle", label: "Publier" },
          { icon: "mail", label: "Messages" },
          { icon: "person", label: "Profil" },
        ].map((item) => (
          <div
            key={item.label}
            className={`flex flex-col items-center justify-center gap-[2px] text-[7px] leading-none ${
              item.active ? "text-[#040037]" : "text-[#7C7A8A]"
            }`}
          >
            <span className="material-symbols-rounded text-[16px]">
              {item.icon}
            </span>

            <span>{item.label}</span>
          </div>
        ))}
      </nav>
    </main>
  );
}
