import { useState } from "react";
import { useNavigate } from "react-router";
import ongletFt from "../../assets/catalog/onglet-ft.png";
import ongletLeas from "../../assets/catalog/onglet-leas.png";
import ongletSec from "../../assets/catalog/onglet-sec.png";
import ongletTroc from "../../assets/catalog/onglet-troc.png";
import Header from "../../common/views/Header";
import Navbar from "../../common/views/NavBar";
import useCatalogFilters from "../hooks/useCatalogFilters";

const fallbackImage = (category) =>
  `https://placehold.co/400x300?text=${encodeURIComponent(category)}`;

const CATALOG_TABS = [
  {
    label: "Seconde main",
    image: ongletSec,
    labelPadding: "pb-[18px]",
    path: "/second-hand/catalog",
  },
  {
    label: "Échange",
    image: ongletTroc,
    labelPadding: "pb-[28px]",
    path: "/troc/catalog",
  },
  {
    label: "Location",
    image: ongletLeas,
    labelPadding: "pb-[28px]",
    path: "/leasing/catalog",
  },
  {
    label: "Forward trading",
    image: ongletFt,
    labelPadding: "pb-[18px]",
    path: "/forward/catalog",
  },
];

export default function CatalogPage() {
  const navigate = useNavigate();
  const [showFilters, setShowFilters] = useState(false);

  const {
    products,
    loading,
    error,
    cities,
    city,
    setCity,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    dateError,
    showNoResultModal,
    setShowNoResultModal,
    minRentalStartDate,
    handleSearch,
    handleResetFilters,
  } = useCatalogFilters();

  const openProduct = (product) => {
    const params = new URLSearchParams();

    if (startDate) {
      params.set("startDate", startDate);
    }

    if (endDate) {
      params.set("endDate", endDate);
    }

    const queryString = params.toString();

    navigate(
      `/leasing/products/${product.id}${queryString ? `?${queryString}` : ""}`,
    );
  };

  return (
    <div className="relative flex h-[100dvh] flex-col overflow-hidden bg-white font-['Figtree'] text-[#080036]">
      <Header />

      <main className="flex-1 overflow-y-auto bg-white pb-3">
        <section className="w-full overflow-x-auto hide-scrollbar">
          <div className="flex w-max gap-2 px-6 pb-4 pt-3">
            {CATALOG_TABS.map((tab) => (
              <button
                key={tab.label}
                type="button"
                onClick={() => navigate(tab.path)}
                className={`flex h-[190px] w-[84px] shrink-0 flex-col items-center justify-end overflow-hidden rounded-[9px] border border-black/[0.03] bg-cover bg-center px-1 ${tab.labelPadding} font-['Figtree'] shadow-[0_1px_2px_rgba(8,0,54,0.03)] transition-transform active:scale-[0.98]`}
                style={{ backgroundImage: `url(${tab.image})` }}
              >
                <span className="max-w-[76px] text-center text-[16px] font-normal leading-[20px] text-[#080036]">
                  {tab.label}
                </span>
              </button>
            ))}
          </div>
        </section>

        <section className="px-6 pb-1 pt-1">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-[20px] font-bold leading-[24px] text-[#080036]">
                Articles disponibles à la location
              </h1>

              <p className="mt-1 text-[14px] leading-[18px] text-[#7C7A8A]">
                {loading ? "…" : `${products.length} articles`}
              </p>
            </div>

            <button
              type="button"
              aria-expanded={showFilters}
              aria-label={
                showFilters ? "Masquer les filtres" : "Afficher les filtres"
              }
              onClick={() => setShowFilters((value) => !value)}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[#080036] transition hover:bg-[#F2F2F9]"
            >
              <span className="material-symbols-rounded text-[34px] leading-none">
                filter_alt
              </span>
            </button>
          </div>

          {showFilters && (
            <section className="mt-4 rounded-[10px] border border-[#D9D7E2] bg-white p-3 shadow-sm">
              <p className="text-[14px] font-medium">Ville de destination</p>

              <div className="mt-2 flex h-10 items-center gap-2 rounded-[8px] border border-[#A6A3B8] px-2">
                <span className="material-symbols-rounded text-[18px] text-[#7C7A8A]">
                  location_on
                </span>

                <select
                  value={city}
                  onChange={(event) => setCity(event.target.value)}
                  className="h-full min-w-0 flex-1 bg-white text-[14px] outline-none"
                >
                  <option value="">Toutes les villes</option>
                  {cities.map((availableCity) => (
                    <option key={availableCity} value={availableCity}>
                      {availableCity}
                    </option>
                  ))}
                </select>
              </div>

              <p className="mt-4 text-[14px] font-medium">Dates de location</p>

              <div className="mt-2 flex flex-col gap-2 md:flex-row">
                <div className="flex flex-1 items-center gap-2">
                  <span className="w-8 text-right text-[13px] font-bold">
                    du
                  </span>

                  <DateInput
                    value={startDate}
                    onChange={setStartDate}
                    hasError={Boolean(dateError)}
                    min={minRentalStartDate}
                  />
                </div>

                <div className="flex flex-1 items-center gap-2">
                  <span className="w-8 text-right text-[13px] font-bold">
                    au
                  </span>

                  <DateInput
                    value={endDate}
                    onChange={setEndDate}
                    hasError={Boolean(dateError)}
                    min={startDate || minRentalStartDate}
                  />
                </div>
              </div>

              {dateError && (
                <p className="mt-2 text-[12px] leading-4 text-red-500">
                  {dateError}
                </p>
              )}

              <div className="mt-3 flex flex-col gap-2 sm:flex-row">
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="h-10 flex-1 rounded-[8px] border border-[#080036] bg-white text-[14px] font-bold text-[#080036]"
                >
                  Réinitialiser
                </button>

                <button
                  type="button"
                  onClick={handleSearch}
                  className="h-10 flex-1 rounded-[8px] bg-[#080036] text-[14px] font-bold text-white"
                >
                  Rechercher
                </button>
              </div>
            </section>
          )}
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
                onClick={() => openProduct(product)}
                className={`overflow-hidden rounded-[9px] bg-white shadow-[0_1px_4px_rgba(0,0,0,0.10)] transition-transform active:scale-[0.99] ${
                  product.available
                    ? "cursor-pointer"
                    : "cursor-pointer opacity-50"
                }`}
              >
                <img
                  src={product.firstImageUrl || fallbackImage(product.category)}
                  alt={product.postTitle}
                  className="aspect-square w-full bg-[#F5F5F7] object-cover"
                />

                <div className="px-3 pb-4 pt-2">
                  <div className="flex justify-end">
                    <span className="rounded-[12px] border border-[#080036] px-3 py-1 text-[13px] leading-[18px] text-[#080036]">
                      {product.badgeLabel || "Location"}
                    </span>
                  </div>

                  <h2 className="mt-2 truncate text-[16px] font-normal leading-5 text-[#080036]">
                    {product.postTitle}
                  </h2>

                  <p className="mt-1 text-[16px] font-bold leading-5 text-[#080036]">
                    {product.available
                      ? `${product.pricePerMonth}€/mois`
                      : "Indisponible"}
                  </p>
                </div>
              </article>
            ))}
        </section>
      </main>

      <Navbar />

      {showNoResultModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#080036]/60 p-4 backdrop-blur-sm">
          <div className="relative flex w-[280px] max-w-full flex-col rounded-[8px] border border-[#E6E6E6] bg-white p-[18px] text-center shadow-2xl">
            <button
              type="button"
              onClick={() => setShowNoResultModal(false)}
              className="absolute right-[10px] top-[9px] text-[#7C7A8A] hover:text-[#080036]"
              aria-label="Fermer"
            >
              <span className="material-symbols-rounded text-[18px]">
                close
              </span>
            </button>

            <p className="mb-5 mt-6 text-[16px] font-bold text-[#080036]">
              Aucun article correspondant
            </p>

            <button
              type="button"
              onClick={() => setShowNoResultModal(false)}
              className="h-10 w-full rounded-[4px] bg-[#080036] text-[15px] font-bold text-white"
            >
              Retour
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function DateInput({ value, onChange, hasError, min }) {
  return (
    <div
      className={`flex h-10 flex-1 items-center justify-between rounded-[8px] border px-2 ${
        hasError ? "border-red-500" : "border-[#A6A3B8]"
      }`}
    >
      <input
        type="date"
        value={value}
        min={min}
        onChange={(event) => onChange(event.target.value)}
        className="w-full bg-transparent text-[13px] outline-none"
      />
    </div>
  );
}
