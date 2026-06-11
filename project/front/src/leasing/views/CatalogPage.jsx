import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import Header from "../../common/views/Header";
import Navbar from "../../common/views/NavBar";
import useCatalogFilters from "../hooks/useCatalogFilters";
import ArrivalPackBanner from "../components/ArrivalPackBanner";

const fallbackImage = (category) =>
  `https://placehold.co/400x300?text=${encodeURIComponent(category)}`;

export default function CatalogPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const appliedCity = searchParams.get("city") || "";
  const appliedStartDate = searchParams.get("startDate") || "";
  const appliedEndDate = searchParams.get("endDate") || "";

  const hasParams = !!(appliedCity && appliedStartDate && appliedEndDate);
  const [showFilters, setShowFilters] = useState(!hasParams);

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

  const appliedFilters =
    appliedCity && appliedStartDate && appliedEndDate
      ? {
          city: appliedCity,
          startDate: appliedStartDate,
          endDate: appliedEndDate,
        }
      : null;

  return (
    <div className="relative flex h-[100dvh] flex-col overflow-hidden bg-white text-[#040037]">
      <Header />

      <main className="flex-1 overflow-y-auto">
        <section className="px-[24px] pt-[12px]">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-[18px] font-bold leading-tight">
                Articles disponibles à la location
              </h2>

              <p className="mt-[5px] text-[13px] leading-none text-[#7C7A8A]">
                {loading ? "…" : `${products.length} articles`}
              </p>
            </div>

            <button
              type="button"
              aria-label={
                showFilters ? "Masquer les filtres" : "Afficher les filtres"
              }
              onClick={() => setShowFilters((value) => !value)}
              className="flex h-[32px] w-[32px] items-center justify-center rounded-full text-[#040037] transition hover:bg-[#F2F2F9]"
            >
              <span className="material-symbols-rounded text-[20px]">
                filter_alt
              </span>
            </button>
          </div>

          {showFilters && (
            <section className="mt-[11px] rounded-[8px] border border-[#D9D7E2] bg-white px-[12px] py-[12px]">
              <p className="text-[14px] font-medium">Ville de destination</p>

              <div className="mt-[8px] flex h-[38px] items-center gap-[6px] rounded-[8px] border border-[#A6A3B8] px-[8px]">
                <span className="material-symbols-rounded text-[18px] text-[#7C7A8A]">
                  location_on
                </span>

                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="h-full flex-1 bg-white text-[14px] outline-none"
                >
                  <option value="">Toutes les villes</option>
                  {cities.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <p className="mt-[14px] text-[14px] font-medium">
                Dates de location
              </p>

              <div className="mt-[7px] flex flex-col md:flex-row md:gap-4">
                <div className="flex items-center gap-[6px] flex-1">
                  <span className="w-[36px] text-right text-[13px] font-bold">
                    - du
                  </span>

                  <DateInput
                    value={startDate}
                    onChange={setStartDate}
                    hasError={!!dateError}
                    min={minRentalStartDate}
                  />
                </div>

                <div className="flex items-center gap-[6px] flex-1 mt-[7px] md:mt-0">
                  <span className="w-[36px] text-right text-[13px] font-bold">
                    - au
                  </span>

                  <DateInput
                    value={endDate}
                    onChange={setEndDate}
                    hasError={!!dateError}
                    min={startDate || minRentalStartDate}
                  />
                </div>
              </div>

              {dateError && (
                <p className="mt-[8px] text-[12px] leading-[16px] text-red-500">
                  {dateError}
                </p>
              )}

              <div className="mt-[12px] flex flex-col gap-[8px]">
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="h-[40px] w-full rounded-[8px] border border-[#040037] bg-white text-[15px] font-bold text-[#040037]"
                >
                  Réinitialiser
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const ok = handleSearch();
                    if (ok) setShowFilters(false);
                  }}
                  className="h-[40px] w-full rounded-[8px] bg-[#040037] text-[15px] font-bold text-white"
                >
                  Rechercher
                </button>
              </div>
            </section>
          )}
        </section>

        {appliedFilters && (
          <ArrivalPackBanner
            city={appliedFilters.city}
            startDate={appliedFilters.startDate}
            endDate={appliedFilters.endDate}
          />
        )}

        <section className="grid grid-cols-2 gap-[20px] px-[24px] pb-4 pt-[14px] md:grid-cols-3 lg:grid-cols-4">
          {loading && (
            <p className="col-span-2 text-center text-[13px] text-[#7C7A8A]">
              Chargement…
            </p>
          )}

          {error && (
            <p className="col-span-2 text-center text-[13px] text-red-500">
              {error}
            </p>
          )}

          {!loading && !error && products.length === 0 && (
            <p className="col-span-2 text-center text-[13px] text-[#7C7A8A]">
              Aucun article disponible.
            </p>
          )}

          {!loading &&
            !error &&
            products.map((product) => (
              <article
                key={product.id}
                onClick={() => {
                  const params = new URLSearchParams();
                  if (startDate) params.set("startDate", startDate);
                  if (endDate) params.set("endDate", endDate);
                  const queryString = params.toString();
                  navigate(
                    `/leasing/products/${product.id}${
                      queryString ? `?${queryString}` : ""
                    }`,
                  );
                }}
                className={`min-h-[236px] rounded-[8px] bg-white p-[8px] pb-[16px] shadow-[0_1px_4px_rgba(0,0,0,0.10)] ${
                  product.available
                    ? "cursor-pointer"
                    : "cursor-pointer opacity-50"
                }`}
              >
                <img
                  src={product.firstImageUrl || fallbackImage(product.category)}
                  alt={product.postTitle}
                  className="h-[120px] w-full rounded-[5px] object-cover"
                />

                <div className="mt-[6px] flex justify-end">
                  <span className="rounded-[12px] border border-[#040037] px-[9px] text-[12px] leading-[18px]">
                    {product.badgeLabel || "Location"}
                  </span>
                </div>

                <h3 className="mt-[7px] truncate text-[14px] leading-tight">
                  {product.postTitle}
                </h3>

                <p className="mt-[3px] truncate text-[12px] leading-tight text-[#7C7A8A]">
                  {product.category} · {product.condition}
                </p>

                <p className="mt-[4px] text-[14px] font-bold leading-tight">
                  {product.available
                    ? `${product.pricePerMonth}€/mois`
                    : "Indisponible"}
                </p>
              </article>
            ))}
        </section>
      </main>

      <Navbar />

      {showNoResultModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#040037]/60 p-2 backdrop-blur-xs">
          <div className="relative flex w-[280px] max-w-[calc(100%-32px)] flex-col rounded-[8px] border border-[#E6E6E6] bg-white p-[18px] text-center shadow-2xl">
            <button
              type="button"
              onClick={() => setShowNoResultModal(false)}
              className="absolute right-[10px] top-[9px] text-[#7C7A8A] hover:text-[#040037]"
            >
              <span className="material-symbols-rounded text-[18px]">
                close
              </span>
            </button>

            <p className="mb-[20px] mt-[22px] text-[16px] font-bold text-[#040037]">
              Aucun article correspondant
            </p>

            <button
              type="button"
              onClick={() => setShowNoResultModal(false)}
              className="h-[40px] w-full rounded-[4px] bg-[#040037] text-[15px] font-bold text-white"
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
      className={`flex h-[38px] flex-1 items-center justify-between rounded-[8px] border px-[8px] ${
        hasError ? "border-red-500" : "border-[#A6A3B8]"
      }`}
    >
      <input
        type="date"
        value={value}
        min={min}
        onChange={(e) => onChange(e.target.value)}
        className="h-full w-full bg-transparent text-[13px] outline-none"
      />
    </div>
  );
}
