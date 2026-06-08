import { useState, useEffect } from "react";
import { useParams, useSearchParams } from "react-router";
import { apiClient } from "../../common/utils/apiClient";
import Header from "../../common/views/Header";
import NavBar from "../../common/views/NavBar";
import LeasingBackHeader from "../components/LeasingBackHeader";
import LeasingBookingSection from "../components/LeasingBookingSection";
import LeasingReviewsSection from "../components/LeasingReviewsSection";
import "../leasing.css";

const fallbackImage = (title) =>
  `https://placehold.co/260x200?text=${encodeURIComponent(title || "Produit")}`;

const getDateInFrance = (daysFromToday = 0) => {
  const date = new Date(
    new Date().toLocaleString("en-US", { timeZone: "Europe/Paris" }),
  );
  date.setDate(date.getDate() + daysFromToday);
  return date.toISOString().split("T")[0];
};

const getMinimumRentalStartDateFrance = () => getDateInFrance(3);

const getDateInOneMonthFrance = (startDate) => {
  const date = new Date(
    startDate ??
      new Date().toLocaleString("en-US", { timeZone: "Europe/Paris" }),
  );
  date.setMonth(date.getMonth() + 1);
  return date.toISOString().split("T")[0];
};

const getConditionColor = (condition) => {
  const normalized = condition
    ?.normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

  if (normalized === "etat correct") return "text-[#CF4B01]";
  if (normalized === "use") return "text-[#E91C2E]";
  if (normalized === "tres bon etat") return "text-[#2E7D32]";
  return "";
};

function formatAgeRange(minMonths, maxMonths) {
  if (minMonths == null && maxMonths == null) return null;
  const fmt = (m) => {
    if (m === 0) return "0";
    const y = Math.floor(m / 12);
    const r = m % 12;
    if (r === 0) return `${y} ans`;
    return `${y} ans ${r} mois`;
  };
  return `${fmt(minMonths ?? 0)} - ${fmt(maxMonths ?? 0)}`;
}

export default function LeasingProductDetailView() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const minRentalStartDate = getMinimumRentalStartDateFrance();
  const initialStartDate = searchParams.get("startDate") || minRentalStartDate;
  const initialEndDate =
    searchParams.get("endDate") || getDateInOneMonthFrance(initialStartDate);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    apiClient
      .get(`/public/leasing/articles/${id}`)
      .then((res) => setProduct(res.data))
      .catch(() => setError("Impossible de charger le produit."))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <main className="flex h-screen w-full items-center justify-center bg-white text-[#040037]">
        <p className="text-[16px] text-[#7C7A8A]">Chargement…</p>
      </main>
    );
  }

  if (error || !product) {
    return (
      <main className="flex h-screen w-full items-center justify-center bg-white text-[#040037]">
        <p className="text-[16px] text-red-500">
          {error || "Produit introuvable."}
        </p>
      </main>
    );
  }

  const images =
    product.imageUrls?.length > 0
      ? product.imageUrls
      : [fallbackImage(product.postTitle)];

  const priceDisplay =
    product.pricePerMonth != null
      ? Number(product.pricePerMonth).toLocaleString("fr-FR", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }) + " €"
      : null;

  const ageRange = formatAgeRange(product.minAgeMonths, product.maxAgeMonths);

  const details = [
    {
      label: "Etat",
      value: product.condition,
      valueClassName: getConditionColor(product.condition),
    },
    { label: "Marque", value: product.brand },
    { label: "Dimension", value: product.dimensions },
    { label: "Tranche d'âge", value: ageRange },
    {
      label: "Poids max",
      value: product.maxWeightKg != null ? `${product.maxWeightKg} kg` : null,
    },
  ].filter((d) => d.value);

  const shareButton = (
    <button
      aria-label="Partager"
      onClick={() => {
        if (navigator.share) {
          navigator.share({
            title: product.postTitle,
            url: window.location.href,
          });
        } else {
          navigator.clipboard.writeText(window.location.href);
        }
      }}
      className="p-[2px]"
    >
      <span className="material-symbols-rounded text-[20px]">ios_share</span>
    </button>
  );

  return (
    <div className="flex h-[100dvh] w-full flex-col overflow-hidden bg-white text-[#040037]">
      <Header />
      <LeasingBackHeader rightElement={shareButton} />

      <main className="flex-1 overflow-y-auto">
        {/* Image carousel — full width on mobile, fixed height on desktop */}
        <section>
          <img
            src={images[currentImage]}
            alt={product.postTitle}
            className="h-[200px] md:h-[280px] w-full object-cover"
            onError={(e) => {
              e.currentTarget.src = fallbackImage(product.postTitle);
            }}
          />
          {images.length > 1 && (
            <div className="flex justify-center gap-[4px] pt-[8px]">
              {images.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentImage(i)}
                  className={`h-[6px] w-[6px] rounded-full transition-colors ${
                    i === currentImage ? "bg-[#040037]" : "bg-[#040037]/30"
                  }`}
                />
              ))}
            </div>
          )}
          {images.length === 1 && <div className="pt-[8px]" />}
        </section>

        {/* Content — vertical layout on mobile and desktop */}
        <div className="w-full px-[14px] md:px-6 md:pt-4">
          <section className="pb-[12px]">
            {/* Badge */}
            <div className="mb-[6px] flex justify-end">
              <span className="rounded-full border border-[#040037] px-[9px] py-[2px] text-[12px]">
                Location
              </span>
            </div>

            {/* Title + Price */}
            <div className="mb-[10px] flex items-baseline justify-between">
              <h1 className="text-[22px] font-bold leading-tight">
                {product.postTitle}
              </h1>
              {priceDisplay && (
                <span className="ml-[8px] whitespace-nowrap text-[18px] font-bold">
                  {priceDisplay}
                </span>
              )}
            </div>

            {/* Description */}
            {product.description && (
              <div className="mb-[12px] mt-[10px]">
                <p className="mb-[4px] text-[16px] font-semibold">
                  Description
                </p>
                <p className="rounded-[4px] border border-[#E6E6E6] p-[10px] text-[15px] leading-[1.45]">
                  {product.description}
                </p>
              </div>
            )}

            {/* Details */}
            {details.length > 0 && (
              <div className="mb-[16px] flex flex-col gap-[6px]">
                {details.map(({ label, value, valueClassName }) => (
                  <div key={label} className="flex gap-[8px] text-[15px]">
                    <span className="min-w-[112px] font-bold">{label}</span>
                    <span className={valueClassName}>{value}</span>
                  </div>
                ))}
              </div>
            )}
          </section>

          <section>
            <LeasingBookingSection
              leasingId={id}
              productTitle={product.postTitle}
              pricePerMonth={product.pricePerMonth}
              pricePerDay={product.pricePerDay}
              firstImageUrl={images[0]}
              initialStartDate={initialStartDate}
              initialEndDate={initialEndDate}
              minStartDate={minRentalStartDate}
            />
          </section>
        </div>

        {/* Reviews — full width below both columns */}
        <section className="px-[14px] md:px-6 pb-[24px]">
          <LeasingReviewsSection leasingId={id} />
        </section>
      </main>
      <NavBar />
    </div>
  );
}
