import { useParams, useNavigate } from "react-router";
import { useLeasingArticle } from "../hooks/useLeasing";
import ProductHeader from "../components/ProductHeader";
import ProductImage from "../components/ProductImage";
import ProductInfo from "../components/ProductInfo";
import LeasingReviewsSection from "../components/LeasingReviewsSection";
import FooterNavigation from "../components/FooterNavigation";

export default function LeasingProductDetailView() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Fetch article details dynamically from the backend using the custom hook
  const { data: articleData, isLoading, error } = useLeasingArticle(id);

  // Exact mockup fallback details to display if in demo/fallback mode
  const defaultProduct = {
    id: id || "123",
    title: "Chaussons",
    price: "5.36",
    brand: "Kitchoun",
    description:
      'Chaussons motricité 3 "1ers pas" - Kitchoun - Beige Premiers pas assurés ! Confort, souplesse et maintien',
    condition: "Très bon état",
    images: ["/leasing/chaussure.jpg"],
    dimensions: "15 x 6 x 4 cm",
    minAgeMonths: 0,
    maxAgeMonths: 36, // 3 ans
    maxWeightKg: 15,
  };

  // Dynamically map backend DTO fields, falling back to Figma specs only in full demo mode
  const product =
    error || !articleData
      ? defaultProduct
      : {
          id: articleData.id,
          title:
            articleData.postTitle || articleData.model || "Produit sans titre",
          price: articleData.pricePerMonth
            ? (articleData.pricePerMonth / 100).toFixed(2)
            : "0.00",
          brand: articleData.brand || "Non spécifiée",
          description: articleData.description || "Aucune description.",
          condition: articleData.condition || "Non spécifié",
          images:
            articleData.imageUrls && articleData.imageUrls.length > 0
              ? articleData.imageUrls
              : ["https://placehold.co/400x300?text=Pas+d'image"],
          dimensions: articleData.dimensions || "Non renseignée",
          minAgeMonths: articleData.minAgeMonths,
          maxAgeMonths: articleData.maxAgeMonths,
          maxWeightKg: articleData.maxWeightKg,
        };

  const isDemoMode = error || !articleData;

  const handleBack = () => {
    navigate("/leasing/catalog");
  };

  if (isLoading) {
    return (
      <div className="mx-auto flex h-screen w-[260px] flex-col items-center justify-center bg-white shadow-lg border border-gray-100 font-['Figtree',sans-serif]">
        <div className="animate-spin rounded-full h-8 w-8 border-[3px] border-[#040037] border-t-transparent shadow-sm"></div>
        <p className="mt-3 text-[9px] font-bold text-[#7C7A8A] tracking-wider animate-pulse">
          Chargement...
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto flex min-h-screen w-[260px] flex-col bg-white text-[#040037] pb-[50px] relative shadow-lg border border-gray-100 font-['Figtree',sans-serif]">
      {/* Top and Sub Header components */}
      <ProductHeader onBack={handleBack} />

      {/* Demo Warning Banner if backend call fails */}
      {isDemoMode && (
        <div className="bg-amber-500 text-white text-[7px] font-extrabold py-1 px-3 text-center tracking-wider shadow-sm flex items-center justify-center gap-1">
          <span>⚠️ Mode Démo — Fallback Figma Actif</span>
        </div>
      )}

      {/* Product Image component with Carousel dots and Seconde Main badge */}
      <ProductImage src={product.images[0]} alt={product.title} />

      {/* Title, Price, Description Box, and Characteristics Table */}
      <ProductInfo
        title={product.title}
        price={product.price}
        description={product.description}
        condition={product.condition}
        brand={product.brand}
        dimensions={product.dimensions}
        minAgeMonths={product.minAgeMonths}
        maxAgeMonths={product.maxAgeMonths}
        maxWeightKg={product.maxWeightKg}
      />

      {/* Reviews list component with inline submit reviews popup trigger */}
      <LeasingReviewsSection leasingId={product.id} />

      {/* Fixed bottom navigation menu bar */}
      <FooterNavigation />
    </div>
  );
}
