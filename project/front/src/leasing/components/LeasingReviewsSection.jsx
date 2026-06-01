import { useState } from "react";
import { useLeasingReviews } from "../hooks/useLeasing";
import ReviewFormModal from "./ReviewFormModal";

export default function LeasingReviewsSection({ leasingId }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch reviews using the custom TanStack Query hook
  const { data: reviewsData, isLoading } = useLeasingReviews(leasingId);

  // Exact mockup reviews to display as fallback
  const mockFallbackReviews = [
    {
      reviewerName: "Lina",
      rating: 5,
      comment:
        "Cette chaussure de la marque Kitchoun est formidable, je l’ai prise pour mon fils qui faisais ses premiers pas. Il est très ... Plus",
      reviewDate: "2026-05-18T12:00:00Z",
      timeAgo: "Il  y a 2 semaines",
    },
    {
      reviewerName: "Marthe",
      rating: 4,
      comment:
        "Cette chaussure de la marque Kitchoun est formidable, je l’ai prise pour mon fils qui faisais ses premiers pas. Il est très ... Plus",
      reviewDate: "2026-05-01T12:00:00Z",
      timeAgo: "Il  y a  mois",
    },
  ];

  // Helper to format names nicely
  const formatReviewerName = (name) => {
    if (!name) return "Parent Anonyme";
    const parts = name.trim().split(" ");
    return parts[0]; // Figma displays first names only
  };

  // Helper to get time elapsed
  const formatTimeAgo = (review) => {
    if (review.timeAgo) return review.timeAgo;
    if (!review.reviewDate) return "Récemment";
    const date = new Date(review.reviewDate);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays <= 1) return "Aujourd'hui";
    if (diffDays <= 7) return `Il y a ${diffDays} jours`;
    if (diffDays <= 30) {
      const weeks = Math.floor(diffDays / 7);
      return `Il y a ${weeks} semaine${weeks > 1 ? "s" : ""}`;
    }
    const months = Math.floor(diffDays / 30);
    return `Il y a ${months} mois`;
  };

  // Combine real reviews with figma mock ones if database is empty, to match figma layout perfectly!
  const reviews =
    !reviewsData || reviewsData.length === 0
      ? mockFallbackReviews
      : reviewsData.map((r) => ({
          reviewerName: formatReviewerName(r.reviewerName),
          rating: r.rating,
          comment: r.comment || "Aucun commentaire.",
          reviewDate: r.reviewDate,
          timeAgo: formatTimeAgo(r),
        }));

  // Calculate statistics
  const totalReviews = reviews.length;
  const averageRating =
    totalReviews > 0
      ? (
          reviews.reduce((acc, curr) => acc + curr.rating, 0) / totalReviews
        ).toFixed(1)
      : "4.7";

  return (
    <div className="w-full px-[12px] flex flex-col font-['Figtree',sans-serif]">
      {/* Wishlist Link with Divider */}
      <div className="w-full h-[1px] bg-[#F2F2F5] mt-[10px]"></div>
      <div className="flex justify-center items-center py-[10px] gap-[4px] cursor-pointer hover:opacity-80 transition-opacity">
        <span className="material-symbols-rounded text-[14px] text-[#040037]">
          favorite
        </span>
        <span className="text-[#040037] font-bold text-[9px]">
          Ajouter à ma wishlist
        </span>
      </div>
      <div className="w-full h-[1px] bg-[#F2F2F5]"></div>

      {/* Action Button: Envoyer un message */}
      <button
        onClick={() =>
          alert(
            "Messagerie non configurée. Votre message est en cours de préparation.",
          )
        }
        className="bg-[#040037] text-white w-full rounded-[6px] py-[10px] flex items-center justify-center gap-[6px] mt-[10px] hover:bg-[#040037]/90 transition active:scale-[0.98]"
      >
        <span className="material-symbols-rounded text-[14px]">send</span>
        <span className="text-[9px] font-extrabold uppercase tracking-wider">
          Envoyer un message
        </span>
      </button>

      <div className="w-full h-[1px] bg-[#F2F2F5] mt-[10px]"></div>

      {/* Action Button: Donner votre avis */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="bg-white border border-[#040037] text-[#040037] w-full rounded-[6px] py-[10px] flex items-center justify-center gap-[6px] mt-[10px] hover:bg-gray-50 transition active:scale-[0.98]"
      >
        <span className="material-symbols-rounded text-[14px] font-bold">
          star
        </span>
        <span className="text-[9px] font-extrabold uppercase tracking-wider">
          Donner votre avis
        </span>
      </button>

      <div className="w-full h-[1px] bg-[#F2F2F5] mt-[10px]"></div>

      {/* Notation Globale Header */}
      <div className="flex justify-between items-center mt-[12px] mb-[6px]">
        <h3 className="text-[#040037] font-extrabold text-[9px] leading-none">
          Note moyenne : {averageRating} / 5
        </h3>
        <span className="text-[#7C7A8A] font-bold text-[8px] leading-none">
          {totalReviews} avis
        </span>
      </div>

      {/* Reviews Cards List */}
      <div className="flex flex-col gap-[8px] mb-[20px]">
        {isLoading ? (
          <div className="text-center py-4">
            <span className="text-[8px] text-[#7C7A8A] animate-pulse">
              Chargement des avis...
            </span>
          </div>
        ) : (
          reviews.map((review, index) => (
            <div
              key={index}
              className="bg-white border border-[#E6E6E6] rounded-[6px] p-[8px] flex flex-col"
            >
              {/* User details */}
              <div className="flex justify-between items-center">
                <span className="text-[9px] font-bold text-[#040037]">
                  {review.reviewerName}
                </span>
                <span className="text-[7px] text-[#7C7A8A] font-medium">
                  {review.rating}/5 ~ {review.timeAgo}
                </span>
              </div>

              {/* Comment text */}
              <p className="text-[8px] leading-relaxed text-[#7C7A8A] mt-[4px]">
                {review.comment}
              </p>
            </div>
          ))
        )}
      </div>

      {/* Review Submission Modal Dialog */}
      {isModalOpen && (
        <ReviewFormModal
          leasingId={leasingId}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
}
