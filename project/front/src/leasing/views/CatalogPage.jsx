import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { apiClient } from "../../common/utils/apiClient";

const fallbackImage = (category) =>
  `https://placehold.co/400x300?text=${encodeURIComponent(category)}`;

const getTodayFrance = () =>
  new Date(new Date().toLocaleString("en-US", { timeZone: "Europe/Paris" }))
    .toISOString()
    .split("T")[0];

export default function CatalogPage() {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [cities, setCities] = useState([]);
  const [city, setCity] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [dateError, setDateError] = useState("");
  const [showNoResultModal, setShowNoResultModal] = useState(false);

  useEffect(() => {
    apiClient
      .get("/public/leasing/products")
      .then((res) => setProducts(res.data))
      .catch(() => setError("Impossible de charger les articles."))
      .finally(() => setLoading(false));

    apiClient
      .get("/public/leasing/products/cities")
      .then((res) => {
        setCities(res.data);
        if (res.data.length > 0) setCity(res.data[0]);
      })
      .catch(() => setCities([]));
  }, []);

  const handleSearch = () => {
    const todayFrance = getTodayFrance();

    if (
      (startDate && startDate < todayFrance) ||
      (endDate && endDate < todayFrance)
    ) {
      setDateError(
        "Cette date est déjà passée — choisissez une date à partir d'aujourd'hui.",
      );
      return;
    }

    setDateError("");
    setLoading(true);

    const body = {};
    if (city) body.city = city;
    if (startDate) body.startDate = startDate;
    if (endDate) body.endDate = endDate;

    apiClient
      .post("/public/leasing/products/filter", body)
      .then((res) => {
        setProducts(res.data);
        if (res.data.length === 0) setShowNoResultModal(true);
      })
      .catch(() => setError("Erreur lors du filtrage."))
      .finally(() => setLoading(false));
  };

  return (
    <main className="relative mx-auto h-screen w-[320px] overflow-y-auto bg-white text-[#040037]">
      <header className="flex h-[48px] items-center justify-between bg-[#040037] px-[12px] text-white">
        <span className="text-[17px] font-bold tracking-widest">KIABI</span>

        <div className="flex items-center gap-[13px]">
          <span className="material-symbols-rounded text-[17px]">
            qr_code_scanner
          </span>
          <span className="material-symbols-rounded text-[18px]">favorite</span>
        </div>
      </header>

      <section className="px-[10px] pt-[12px]">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-[13px] font-bold leading-none">
              Articles disponibles à la location
            </h2>

            <p className="mt-[5px] text-[9px] leading-none text-[#7C7A8A]">
              {loading ? "…" : `${products.length} articles`}
            </p>
          </div>

          <span className="material-symbols-rounded text-[17px]">
            filter_alt
          </span>
        </div>

        <section className="mt-[11px] rounded-[4px] border border-[#D9D7E2] bg-white px-[9px] py-[10px]">
          <p className="text-[11px] font-medium">Ville de destination</p>

          <div className="mt-[8px] flex h-[31px] items-center gap-[6px] rounded-[5px] border border-[#A6A3B8] px-[8px]">
            <span className="material-symbols-rounded text-[14px] text-[#7C7A8A]">
              location_on
            </span>

            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="h-full flex-1 bg-white text-[10px] outline-none"
            >
              <option value="">Toutes les villes</option>
              {cities.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <p className="mt-[14px] text-[11px] font-medium">Dates de location</p>

          <div className="mt-[7px] flex items-center gap-[6px]">
            <span className="w-[28px] text-right text-[10px] font-bold">
              - du
            </span>

            <DateInput
              value={startDate}
              onChange={setStartDate}
              hasError={!!dateError}
            />
          </div>

          <div className="mt-[7px] flex items-center gap-[6px]">
            <span className="w-[28px] text-right text-[10px] font-bold">
              - au
            </span>

            <DateInput
              value={endDate}
              onChange={setEndDate}
              hasError={!!dateError}
            />
          </div>

          {dateError && (
            <p className="mt-[8px] text-[8px] leading-[11px] text-red-500">
              {dateError}
            </p>
          )}

          <button
            type="button"
            onClick={handleSearch}
            className="mt-[10px] h-[28px] w-full rounded-[4px] bg-[#040037] text-[9px] font-bold text-white"
          >
            Rechercher
          </button>
        </section>
      </section>

      <section className="grid grid-cols-2 gap-x-[12px] gap-y-[12px] px-[20px] pt-[14px] pb-[75px]">
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
              onClick={() =>
                product.available && navigate(`/leasing/products/${product.id}`)
              }
              className={`h-[170px] rounded-[6px] bg-white p-[5px] shadow-[0_1px_4px_rgba(0,0,0,0.10)] ${
                product.available
                  ? "cursor-pointer"
                  : "pointer-events-none opacity-50"
              }`}
            >
              <img
                src={product.firstImageUrl || fallbackImage(product.category)}
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
                {product.available
                  ? `${product.pricePerMonth / 100}€/mois`
                  : "Indisponible"}
              </p>
            </article>
          ))}
      </section>

      <BottomNav />

      {showNoResultModal && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-[#040037]/40">
          <div className="relative w-[180px] rounded-[4px] bg-white p-[16px] text-center shadow-lg">
            <button
              type="button"
              onClick={() => setShowNoResultModal(false)}
              className="absolute right-[8px] top-[7px]"
            >
              <span className="material-symbols-rounded text-[13px]">
                close
              </span>
            </button>

            <p className="mb-[18px] mt-[12px] text-[10px] text-[#7C7A8A]">
              Aucun article disponible pour ces critères.
            </p>

            <button
              type="button"
              onClick={() => setShowNoResultModal(false)}
              className="h-[28px] w-[95px] rounded-[4px] bg-[#040037] text-[9px] font-bold text-white"
            >
              Ok
            </button>
          </div>
        </div>
      )}
    </main>
  );
}

function DateInput({ value, onChange, hasError }) {
  return (
    <div
      className={`flex h-[28px] flex-1 items-center justify-between rounded-[4px] border px-[8px] ${
        hasError ? "border-red-500" : "border-[#A6A3B8]"
      }`}
    >
      <input
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-transparent text-[8px] outline-none"
      />
    </div>
  );
}

function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-1/2 flex h-[50px] w-[320px] -translate-x-1/2 items-center justify-around border-t border-[#E6E6E6] bg-white">
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
  );
}
