import { useState } from "react";
import { useLeasingReviewsData } from "../hooks/useLeasing";
import ReviewFormModal from "./ReviewFormModal";
import heartplusIcon from "../../assets/icons/heartplus.svg";

export default function LeasingReviewsSection({ leasingId }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showMessageInfo, setShowMessageInfo] = useState(false);

  const { reviews, averageRating, totalReviews, isLoading } =
    useLeasingReviewsData(leasingId);

  return (
    <div className="w-full flex flex-col font-['Figtree',sans-serif]">
      {/* Wishlist */}
      <div className="h-px w-full bg-[rgba(0,0,0,0.1)]" />
      <div className="flex justify-center items-center py-[10px] gap-[6px] cursor-pointer hover:opacity-80 transition-opacity">
        <img
          src={heartplusIcon}
          alt=""
          className="w-[16px] h-[16px]"
          style={{
            filter:
              "brightness(0) saturate(100%) invert(5%) sepia(56%) saturate(3000%) hue-rotate(230deg) brightness(94%) contrast(103%)",
          }}
        />
        <span className="text-[#040037] font-semibold text-[16px]">
          Ajouter à ma wishlist
        </span>
      </div>
      <div className="h-px w-full bg-[rgba(0,0,0,0.1)]" />

      {/* Envoyer un message */}
      <button
        onClick={() => setShowMessageInfo(true)}
        className="bg-[#040037] text-white w-full rounded-[8px] h-[40px] flex items-center justify-center gap-[8px] mt-[12px] hover:bg-[#040037]/90 transition active:scale-[0.98]"
      >
        <span className="material-symbols-rounded text-[20px]">send</span>
        <span className="font-semibold text-[16px]">Envoyer un message</span>
      </button>

      {showMessageInfo && (
        <div className="font-regular text-[14px] text-[#040037] bg-[#F2F2F9] rounded-[8px] p-[12px] text-center mt-[8px]">
          Messagerie en cours de développement. Votre demande sera transmise
          prochainement.
        </div>
      )}

      {/* Donner votre avis */}
      <div className="h-px w-full bg-[rgba(0,0,0,0.1)] mt-[12px]" />
      <button
        onClick={() => setIsModalOpen(true)}
        className="bg-white border border-[#040037] text-[#040037] w-full rounded-[8px] h-[40px] flex items-center justify-center gap-[12px] mt-[12px] hover:bg-gray-50 transition active:scale-[0.98]"
      >
        <span
          className="material-symbols-rounded text-[22px]"
          style={{ fontVariationSettings: "'FILL' 1" }}
        >
          star
        </span>
        <span className="font-semibold text-[16px]">Donner votre avis</span>
      </button>
      <div className="h-px w-full bg-[rgba(0,0,0,0.1)] mt-[12px]" />

      {/* Note moyenne */}
      {totalReviews > 0 && (
        <div className="flex justify-between items-center mt-[12px] mb-[8px]">
          <h3 className="text-[#040037] font-bold text-[20px] leading-none">
            Note moyenne : {averageRating} / 5
          </h3>
          <span className="text-[#757388] font-normal text-[16px] leading-none">
            {totalReviews} avis
          </span>
        </div>
      )}

      {/* Liste des avis */}
      <div className="flex flex-col gap-[8px] mb-[24px]">
        {isLoading ? (
          <div className="text-center py-6">
            <span className="text-[16px] text-[#757388] animate-pulse">
              Chargement des avis...
            </span>
          </div>
        ) : reviews.length === 0 ? (
          <div className="text-center py-6">
            <span className="text-[16px] text-[#757388]">
              Soyez le premier à laisser un avis
            </span>
          </div>
        ) : (
          reviews.map((review, index) => (
            <div
              key={index}
              className="bg-white border border-[rgba(0,0,0,0.1)] rounded-[12px] px-[16px] py-[8px] flex flex-col gap-[8px]"
            >
              <div className="flex justify-between items-center py-[10px]">
                <span className="font-bold text-[20px] text-black">
                  {review.reviewerName}
                </span>
                <span className="font-semibold text-[16px] text-[#757388] text-right">
                  {review.rating}/5 ~ {review.timeAgo}
                </span>
              </div>
              <p className="font-normal text-[16px] leading-normal text-[#757388]">
                {review.comment}
              </p>
            </div>
          ))
        )}
      </div>

      {isModalOpen && (
        <ReviewFormModal
          leasingId={leasingId}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
}
