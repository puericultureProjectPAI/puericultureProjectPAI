import { useState } from "react";
import { useLeasingReviewsData } from "../hooks/useLeasing";
import ReviewFormModal from "./ReviewFormModal";
import heartplusIcon from "../../assets/icons/heartplus.svg";

export default function LeasingReviewsSection({ leasingId }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Consume pre-formatted reviews and calculated metrics from the custom hook
  const { reviews, averageRating, totalReviews, isLoading } =
    useLeasingReviewsData(leasingId);

  return (
    <div className="w-full px-[12px] flex flex-col font-['Figtree',sans-serif]">
      {/* Wishlist Link with Divider */}
      <div className="w-full h-[1px] bg-[#F2F2F5] mt-[10px]"></div>
      <div className="flex justify-center items-center py-[10px] gap-[4px] cursor-pointer hover:opacity-80 transition-opacity">
        <img
          src={heartplusIcon}
          alt=""
          className="w-[14px] h-[11px] text-[#040037]"
          style={{
            filter:
              "brightness(0) saturate(100%) invert(5%) sepia(56%) saturate(3000%) hue-rotate(230deg) brightness(94%) contrast(103%)",
          }}
        />
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

      {/* Notation Globale Header — affiché uniquement si des avis existent */}
      {totalReviews > 0 && (
        <div className="flex justify-between items-center mt-[12px] mb-[6px]">
          <h3 className="text-[#040037] font-extrabold text-[9px] leading-none">
            Note moyenne : {averageRating} / 5
          </h3>
          <span className="text-[#7C7A8A] font-bold text-[8px] leading-none">
            {totalReviews} avis
          </span>
        </div>
      )}

      {/* Reviews Cards List */}
      <div className="flex flex-col gap-[8px] mb-[20px]">
        {isLoading ? (
          <div className="text-center py-4">
            <span className="text-[8px] text-[#7C7A8A] animate-pulse">
              Chargement des avis...
            </span>
          </div>
        ) : reviews.length === 0 ? (
          <div className="text-center py-4">
            <span className="text-[8px] text-[#7C7A8A]">
              Soyez le premier à laisser un avis
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
