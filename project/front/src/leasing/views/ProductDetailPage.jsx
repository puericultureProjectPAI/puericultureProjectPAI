import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { apiClient } from "../../common/utils/apiClient";
import NavBar from "../../common/views/NavBar";
import "../leasing.css";

const fallbackImage = (title) =>
  `https://placehold.co/260x200?text=${encodeURIComponent(title || "Produit")}`;

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

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentImage, setCurrentImage] = useState(0);
  const [inWishlist, setInWishlist] = useState(false);

  useEffect(() => {
    apiClient
      .get(`/public/leasing/articles/${id}`)
      .then((res) => setProduct(res.data))
      .catch(() => setError("Impossible de charger le produit."))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <main className="mx-auto flex h-screen w-[260px] items-center justify-center bg-white text-[#040037]">
        <p className="text-[11px] text-[#7C7A8A]">Chargement…</p>
      </main>
    );
  }

  if (error || !product) {
    return (
      <main className="mx-auto flex h-screen w-[260px] items-center justify-center bg-white text-[#040037]">
        <p className="text-[11px] text-red-500">
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
      ? (product.pricePerMonth / 100).toLocaleString("fr-FR", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }) + " €"
      : null;

  const ageRange = formatAgeRange(product.minAgeMonths, product.maxAgeMonths);

  const details = [
    { label: "Etat", value: product.condition, green: true },
    { label: "Marque", value: product.brand },
    { label: "Dimension", value: product.dimensions },
    { label: "Tranche d'âge", value: ageRange },
    {
      label: "Poids max",
      value: product.maxWeightKg != null ? `${product.maxWeightKg} kg` : null,
    },
  ].filter((d) => d.value);

  return (
    <main className="mx-auto h-screen w-[260px] overflow-y-auto bg-white text-[#040037]">
      {/* Header */}
      <header className="flex items-center justify-between px-[12px] py-[10px]">
        <button onClick={() => navigate(-1)} className="p-[2px]">
          <span className="material-symbols-rounded text-[20px]">
            arrow_back
          </span>
        </button>
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
          <span className="material-symbols-rounded text-[20px]">
            ios_share
          </span>
        </button>
      </header>

      {/* Image carousel */}
      <section>
        <img
          src={images[currentImage]}
          alt={product.postTitle}
          className="h-[200px] w-full object-cover"
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

      {/* Content */}
      <section className="px-[14px] pb-[80px]">
        {/* Badge */}
        <div className="mb-[6px] flex justify-end">
          <span className="rounded-full border border-[#040037] px-[8px] py-[2px] text-[8px]">
            Location
          </span>
        </div>

        {/* Title + Price */}
        <div className="mb-[10px] flex items-baseline justify-between">
          <h1 className="text-[16px] font-bold">{product.postTitle}</h1>
          {priceDisplay && (
            <span className="ml-[8px] whitespace-nowrap text-[14px] font-bold">
              {priceDisplay}
            </span>
          )}
        </div>

        {/* Description */}
        {product.description && (
          <div className="mb-[12px]">
            <p className="mb-[4px] text-[9px] font-semibold">Description</p>
            <p className="rounded-[4px] border border-[#E6E6E6] p-[8px] text-[8px] leading-[1.4]">
              {product.description}
            </p>
          </div>
        )}

        {/* Details */}
        {details.length > 0 && (
          <div className="mb-[16px] flex flex-col gap-[6px]">
            {details.map(({ label, value, green }) => (
              <div key={label} className="flex gap-[6px] text-[9px]">
                <span className="min-w-[80px] font-bold">{label}</span>
                <span className={green ? "text-[#2E7D32]" : ""}>{value}</span>
              </div>
            ))}
          </div>
        )}

        {/* Wishlist */}
        <button
          onClick={() => setInWishlist((v) => !v)}
          className="mb-[10px] flex w-full items-center justify-center gap-[6px] py-[8px] text-[10px]"
        >
          <span className="material-symbols-rounded text-[16px]">
            {inWishlist ? "favorite" : "favorite_border"}
          </span>
          Ajouter à ma wishlist
        </button>

        {/* CTA */}
        <button className="flex w-full items-center justify-center gap-[6px] rounded-[6px] bg-[#040037] py-[10px] text-[10px] font-medium text-white">
          <span className="material-symbols-rounded text-[14px]">send</span>
          Envoyer un message
        </button>
      </section>

      <NavBar />
    </main>
  );
}
