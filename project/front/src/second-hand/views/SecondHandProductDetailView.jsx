import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { apiClient } from "../../common/utils/apiClient";

const fallbackImage = (title) =>
  `https://placehold.co/400x300?text=${encodeURIComponent(title || "Produit")}`;

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

const getConditionColor = (condition) => {
  const normalized = condition
    ?.normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

  if (normalized === "etat correct") return "text-amber-600 font-semibold";
  if (normalized === "use") return "text-red-500 font-semibold";
  if (normalized === "tres bon etat" || normalized === "comme neuf")
    return "text-emerald-600 font-semibold";
  return "text-[#040037]";
};

export default function SecondHandProductDetailView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [contactSuccess, setContactSuccess] = useState(false);

  useEffect(() => {
    apiClient
      .get(`/public/second-hand/products/${id}`)
      .then((res) => setProduct(res.data))
      .catch((err) => {
        console.error("Erreur chargement annonce seconde main", err);
        setError("Impossible de charger le produit.");
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <main className="flex h-[80vh] w-full items-center justify-center bg-white text-[#040037]">
        <p className="text-base text-[#7C7A8A]">
          Recherche des détails de l'annonce...
        </p>
      </main>
    );
  }

  if (error || !product) {
    return (
      <main className="flex h-[80vh] w-full flex-col items-center justify-center bg-white text-[#040037] px-6">
        <p className="text-base text-red-500 font-semibold mb-4">
          {error || "Produit introuvable."}
        </p>
        <button
          onClick={() => navigate("/home")}
          className="px-6 py-2 rounded-full bg-[#040037] text-white text-sm font-bold"
        >
          Retour à l'accueil
        </button>
      </main>
    );
  }

  const images =
    product.imageUrls?.length > 0
      ? product.imageUrls
      : [fallbackImage(product.postTitle)];

  const ageRange = formatAgeRange(product.minAgeMonths, product.maxAgeMonths);

  const detailsList = [
    {
      label: "État de l'article",
      value: product.condition,
      valueClassName: getConditionColor(product.condition),
    },
    { label: "Marque", value: product.brand || "Non spécifiée" },
    { label: "Modèle", value: product.model },
    { label: "Tranche d'âge", value: ageRange },
    { label: "Dimensions", value: product.dimensions },
    {
      label: "Poids maximum",
      value: product.maxWeightKg != null ? `${product.maxWeightKg} kg` : null,
    },
    { label: "Norme de sécurité", value: product.securityStandard },
    { label: "Ville", value: product.city },
  ].filter((d) => d.value);

  const handleContactSeller = () => {
    setContactSuccess(true);
    setTimeout(() => setContactSuccess(false), 5000);
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-6 pb-24 font-['Figtree',sans-serif] text-[#040037]">
      {/* Back Button / Navigation Header */}
      <div className="mb-4 flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1 text-sm font-bold text-[#040037] hover:underline"
        >
          <span className="material-symbols-rounded text-lg">arrow_back</span>
          Retour
        </button>
        <span className="rounded-full bg-indigo-50 border border-indigo-200 px-3 py-1 text-xs font-bold text-indigo-700">
          Seconde main
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Column: Image Gallery */}
        <div className="flex flex-col gap-4">
          <div className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden bg-gray-50 border border-gray-100 shadow-sm">
            <img
              src={images[currentImageIndex]}
              alt={product.postTitle}
              className="h-full w-full object-cover"
              onError={(e) => {
                e.currentTarget.src = fallbackImage(product.postTitle);
              }}
            />
          </div>

          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto py-1">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentImageIndex(i)}
                  className={`relative h-16 w-20 shrink-0 rounded-lg overflow-hidden border-2 transition-all ${
                    i === currentImageIndex
                      ? "border-[#040037]"
                      : "border-transparent opacity-75"
                  }`}
                >
                  <img
                    src={img}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Title, Price, Description, Specs */}
        <div className="flex flex-col gap-6">
          {/* Header Info */}
          <div>
            <h1 className="text-2xl md:text-3xl font-bold leading-tight tracking-tight text-[#040037]">
              {product.postTitle}
            </h1>
            <p className="text-3xl font-extrabold text-[#040037] mt-3">
              {product.price} €
            </p>
          </div>

          {/* Description */}
          {product.description && (
            <div className="rounded-xl border border-gray-200/80 bg-white p-4 shadow-2xs">
              <h3 className="text-sm font-bold text-[#040037] mb-2 uppercase tracking-wide">
                Description
              </h3>
              <p className="text-sm leading-relaxed text-gray-700 whitespace-pre-line">
                {product.description}
              </p>
            </div>
          )}

          {/* Specifications Table */}
          <div className="rounded-xl border border-gray-200/80 bg-white p-4 shadow-2xs">
            <h3 className="text-sm font-bold text-[#040037] mb-3 uppercase tracking-wide">
              Caractéristiques
            </h3>
            <div className="flex flex-col gap-2.5">
              {detailsList.map(({ label, value, valueClassName }, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between border-b border-gray-100 pb-2 last:border-0 last:pb-0"
                >
                  <span className="text-xs font-bold text-[#040037]">
                    {label}
                  </span>
                  <span
                    className={`text-xs font-normal ${valueClassName || "text-[#7C7A8A]"}`}
                  >
                    {value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* CTA Action */}
          <div className="flex flex-col gap-3">
            <button
              onClick={handleContactSeller}
              className="w-full rounded-full bg-[#040037] py-4 text-center text-sm font-bold text-white shadow-md transition-all hover:bg-[#040037]/90 active:scale-95 flex items-center justify-center gap-2"
            >
              <span className="material-symbols-rounded text-lg">
                shopping_cart
              </span>
              Acheter cet article
            </button>
            {contactSuccess && (
              <div className="rounded-lg bg-green-50 border border-green-200 p-3 text-center text-xs font-semibold text-green-700">
                Demande d'achat envoyée ! Le vendeur vous contactera sous peu.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
