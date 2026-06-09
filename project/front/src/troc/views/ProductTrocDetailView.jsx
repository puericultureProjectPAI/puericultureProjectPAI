import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { apiClient } from "../../common/utils/apiClient";
import { useAuth } from "../../common/security/AuthContext";
import sendIcon from "../../assets/send-icon-inverse-m.svg";
import shareIcon from "../../assets/share-icon-subtle.svg";

const fallbackImage = (title) =>
  `https://placehold.co/382x176?text=${encodeURIComponent(title || "Produit")}`;

function formatAgeRange(minMonths, maxMonths) {
  if (minMonths == null && maxMonths == null) return "—";
  if (
    minMonths != null &&
    maxMonths != null &&
    minMonths % 12 === 0 &&
    maxMonths % 12 === 0
  ) {
    return `${Math.floor(minMonths / 12)} - ${Math.floor(maxMonths / 12)} ans`;
  }
  if (minMonths != null && maxMonths != null)
    return `${minMonths} - ${maxMonths} mois`;
  return "—";
}

export default function ProductTrocDetailView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    apiClient
      .get(`/public/troc/products/${id}`)
      .then((res) => setProduct(res.data))
      .catch(() => setError("Impossible de charger le produit."))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <p className="text-[16px] text-[#757388]">Chargement…</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="flex items-center justify-center py-16">
        <p className="text-[16px] text-red-500">
          {error || "Produit introuvable."}
        </p>
      </div>
    );
  }

  const images =
    product.imageUrls?.length > 0
      ? product.imageUrls
      : [fallbackImage(product.postTitle)];

  const handlePropose = () => {
    if (!isAuthenticated) navigate("/connection");
    else navigate(`/troc/select-my-product/${product.id}`);
  };

  return (
    <div className="flex flex-col items-center gap-4 px-6 py-4 bg-white w-full">
      {/* Ligne liens : retour + partage */}
      <div className="flex flex-row items-center justify-between self-stretch py-2">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center px-2 py-2"
          aria-label="Retour"
        >
          {/* arrow-left-icon-brand-l */}
          <svg
            width="18"
            height="32"
            viewBox="0 0 18 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M14 6L5 16L14 26"
              stroke="#040037"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        <button className="flex items-center px-1 py-0" aria-label="Partager">
          <img src={shareIcon} alt="" width={24} height={27} />
        </button>
      </div>

      {/* Section image + points carousel */}
      <div className="flex flex-col self-stretch gap-1">
        <div className="rounded-lg overflow-hidden">
          <img
            src={images[currentImage]}
            alt={product.postTitle}
            className="w-full h-44 object-cover rounded-lg"
            onError={(e) => {
              e.currentTarget.src = fallbackImage(product.postTitle);
            }}
          />
        </div>

        {images.length > 1 && (
          <div className="flex flex-row justify-center items-center self-stretch gap-1 py-2.5">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentImage(i)}
                aria-label={`Image ${i + 1}`}
                className={`w-2.5 h-2.5 rounded-full transition-colors ${
                  i === currentImage
                    ? "bg-[#757388]"
                    : "bg-[rgba(117,115,136,0.75)]"
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Informations produit */}
      <div className="flex flex-col self-stretch gap-3">
        {/* Chip Troc */}
        <div className="flex flex-row justify-end self-stretch">
          <span className="border border-[#040037] rounded-[12px] px-3 text-[16px] text-[#040037] h-[35px] flex items-center">
            Troc
          </span>
        </div>

        {/* Titre */}
        <h1 className="text-[32px] font-bold text-[#040037] leading-tight">
          {product.postTitle}
        </h1>

        {/* Divider */}
        <hr className="border-[#E3E3E3]" />

        {/* Label Description */}
        <p className="text-[16px] text-[#33323D]">Description</p>

        {/* Boîte description */}
        <div className="self-stretch border border-[#757388] rounded-lg p-3">
          <p className="text-[16px] text-[#33323D] leading-relaxed whitespace-pre-wrap">
            {product.description || "—"}
          </p>
        </div>

        {/* Etat */}
        <div className="flex flex-row items-center self-stretch gap-2.5">
          <div className="w-[135px] shrink-0">
            <span className="text-[20px] font-bold text-[#33323D]">Etat</span>
          </div>
          <span
            className={`text-[16px] ${
              (product.condition || "").toLowerCase().includes("bon")
                ? "text-[#188638]"
                : "text-[#33323D]"
            }`}
          >
            {product.condition ?? "—"}
          </span>
        </div>

        {/* Marque */}
        <div className="flex flex-row items-center self-stretch gap-2.5">
          <div className="w-[135px] shrink-0">
            <span className="text-[20px] font-bold text-[#33323D]">Marque</span>
          </div>
          <span className="text-[16px] text-[#757388]">
            {product.brand ?? "—"}
          </span>
        </div>

        {/* Dimension */}
        <div className="flex flex-row items-center self-stretch gap-2.5">
          <div className="w-[135px] shrink-0">
            <span className="text-[20px] font-bold text-[#33323D]">
              Dimension
            </span>
          </div>
          <span className="text-[16px] text-[#757388]">
            {product.dimensions ?? "—"}
          </span>
        </div>

        {/* Tranche d'âge */}
        <div className="flex flex-row items-center self-stretch gap-2.5">
          <div className="w-[135px] shrink-0">
            <span className="text-[20px] font-bold text-[#33323D]">
              Tranche d'âge
            </span>
          </div>
          <span className="text-[16px] text-[#757388]">
            {formatAgeRange(product.minAgeMonths, product.maxAgeMonths)}
          </span>
        </div>

        {/* Poids max */}
        <div className="flex flex-row items-center self-stretch gap-2.5">
          <div className="w-[135px] shrink-0">
            <span className="text-[20px] font-bold text-[#33323D]">
              Poids max
            </span>
          </div>
          <span className="text-[16px] text-[#757388]">
            {product.maxWeightKg != null
              ? `${product.maxWeightKg} kg`
              : product.maxWeight != null
                ? `${product.maxWeight} kg`
                : "—"}
          </span>
        </div>
      </div>

      {/* Divider bas */}
      <hr className="border-[#E3E3E3] self-stretch" />

      {/* Bouton Proposer un échange */}
      <div className="flex justify-center self-stretch pb-4">
        <button
          type="button"
          onClick={handlePropose}
          className="w-full h-[40px] bg-[#040037] text-white rounded-lg flex items-center justify-center gap-3"
        >
          <img src={sendIcon} alt="" width={24} height={21} />
          <span className="text-[16px] font-semibold">Proposer un échange</span>
        </button>
      </div>
    </div>
  );
}
