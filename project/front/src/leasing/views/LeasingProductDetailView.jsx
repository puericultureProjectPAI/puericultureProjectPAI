import { useParams, useNavigate } from "react-router";
import { useLeasingArticle } from "../hooks/useLeasing";
import ProductHeader from "../components/ProductHeader";
import ProductImage from "../components/ProductImage";
import ProductInfo from "../components/ProductInfo";
import LeasingBookingSection from "../components/LeasingBookingSection";
import LeasingReviewsSection from "../components/LeasingReviewsSection";
import FooterNavigation from "../components/FooterNavigation";

export default function LeasingProductDetailView() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Fetch article details dynamically from the backend using the custom hook
  const { data: articleData, isLoading, error } = useLeasingArticle(id);

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

  if (error || !articleData) {
    return (
      <div className="mx-auto flex h-screen w-[260px] flex-col items-center justify-center bg-white shadow-lg border border-gray-100 font-['Figtree',sans-serif]">
        <p className="text-[9px] font-bold text-red-500">
          Impossible de charger le produit.
        </p>
        <button
          onClick={handleBack}
          className="mt-3 bg-[#040037] text-white rounded-[6px] py-[6px] px-[12px] text-[8px] font-extrabold uppercase tracking-wider hover:bg-[#040037]/90 transition"
        >
          Retour au catalogue
        </button>
      </div>
    );
  }

  const product = {
    id: articleData.id,
    title: articleData.postTitle || articleData.model || "Produit sans titre",
    price: articleData.pricePerMonth ? articleData.pricePerMonth / 100 : 0,
    brand: articleData.brand || "Non spécifiée",
    description: articleData.description || "Aucune description.",
    condition: articleData.condition || "Non spécifié",
    images:
      articleData.imageUrls && articleData.imageUrls.length > 0
        ? articleData.imageUrls
        : [
            `https://placehold.co/260x200?text=${encodeURIComponent(articleData.postTitle || "Produit")}`,
          ],
    dimensions: articleData.dimensions || "Non renseignée",
    minAgeMonths: articleData.minAgeMonths,
    maxAgeMonths: articleData.maxAgeMonths,
    maxWeightKg: articleData.maxWeightKg,
  };

  return (
    <div className="mx-auto flex min-h-screen w-[260px] flex-col bg-white text-[#040037] pb-[50px] relative shadow-lg border border-gray-100 font-['Figtree',sans-serif]">
      {/* Top and Sub Header components */}
      <ProductHeader onBack={handleBack} />

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

      {/* Date picker and booking logic section */}
      <LeasingBookingSection
        leasingId={product.id}
        productTitle={product.title}
        pricePerMonth={articleData.pricePerMonth}
        pricePerDay={articleData.pricePerDay}
      />

      {/* Reviews list component with inline submit reviews popup trigger */}
      <LeasingReviewsSection leasingId={product.id} />

      {/* Fixed bottom navigation menu bar */}
      <FooterNavigation />
    </div>
  );
}
