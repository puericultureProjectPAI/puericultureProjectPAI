import { useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../../common/security/AuthContext";
import BookingSummaryModal from "./BookingSummaryModal";

export default function LeasingBookingSection({
  leasingId,
  productTitle,
  pricePerMonth,
  pricePerDay = 500, // Default daily price fallback in centimes (5€)
}) {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const todayStr = new Date().toISOString().split("T")[0];

  // Calculate pricing dynamically in real-time when dates change (PUE-53)
  let totalPrice = 0;
  let durationText = "";
  let errorText = "";

  if (startDate && endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (start > end) {
      errorText = "La date de début doit être antérieure à la date de fin.";
    } else {
      const diffTime = end.getTime() - start.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

      if (diffDays > 0) {
        const months = Math.floor(diffDays / 30);
        const remainingDays = diffDays % 30;

        const pricePerMonthEuros = Number(pricePerMonth) / 100;
        const pricePerDayEuros = Number(pricePerDay) / 100;

        // Pricing formula matching backend logic
        totalPrice =
          months * pricePerMonthEuros + remainingDays * pricePerDayEuros;

        durationText = `${diffDays} jour${diffDays > 1 ? "s" : ""}`;
        if (months > 0) {
          durationText += ` (${months} mois${months > 1 ? "s" : ""}`;
          if (remainingDays > 0) {
            durationText += ` et ${remainingDays} jour${remainingDays > 1 ? "s" : ""}`;
          }
          durationText += ")";
        }
      }
    }
  }

  const handleBookClick = () => {
    if (!isAuthenticated) {
      // Redirect to connection screen if unauthorized
      navigate("/connection");
      return;
    }
    setIsModalOpen(true);
  };

  const isFormValid = startDate && endDate && !errorText && totalPrice > 0;

  return (
    <div className="w-full px-[12px] pt-[12px] flex flex-col font-['Figtree',sans-serif] border-t border-[#F2F2F5] mt-[10px]">
      <span className="text-[#7C7A8A] font-bold text-[9px] uppercase tracking-wider mb-[4px]">
        Louer cet article
      </span>

      {/* Date Inputs Form */}
      <div className="flex gap-[10px] w-full">
        {/* Start Date */}
        <div className="flex-1 flex flex-col gap-[2px]">
          <label
            htmlFor="startDateInput"
            className="text-[7px] font-bold text-[#7C7A8A] uppercase"
          >
            Début
          </label>
          <input
            id="startDateInput"
            type="date"
            min={todayStr}
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full border border-[#E6E6E6] rounded-[6px] p-[6px] text-[9px] font-semibold text-[#040037] focus:outline-none focus:border-[#040037] bg-white"
          />
        </div>

        {/* End Date */}
        <div className="flex-1 flex flex-col gap-[2px]">
          <label
            htmlFor="endDateInput"
            className="text-[7px] font-bold text-[#7C7A8A] uppercase"
          >
            Fin
          </label>
          <input
            id="endDateInput"
            type="date"
            min={startDate || todayStr}
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full border border-[#E6E6E6] rounded-[6px] p-[6px] text-[9px] font-semibold text-[#040037] focus:outline-none focus:border-[#040037] bg-white"
          />
        </div>
      </div>

      {/* Real-time Pricing details display */}
      {errorText && (
        <span className="text-[8px] font-bold text-red-500 mt-[6px]">
          {errorText}
        </span>
      )}

      {isFormValid && (
        <div className="flex justify-between items-center bg-[#F2F2F9] rounded-[6px] p-[8px] mt-[8px]">
          <div className="flex flex-col">
            <span className="text-[7px] text-[#7C7A8A] font-bold uppercase leading-none">
              Durée
            </span>
            <span className="text-[8px] text-[#040037] font-semibold mt-[2px]">
              {durationText}
            </span>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-[7px] text-[#7C7A8A] font-bold uppercase leading-none">
              Estimation total
            </span>
            <span className="text-[12px] text-[#040037] font-extrabold mt-[1px]">
              {totalPrice.toLocaleString("fr-FR", {
                minimumFractionDigits: 0,
                maximumFractionDigits: 2,
              })}
              €
            </span>
          </div>
        </div>
      )}

      {/* CTA Button */}
      <button
        onClick={handleBookClick}
        disabled={!isFormValid}
        className="w-full bg-[#040037] text-white rounded-[6px] py-[8px] text-[9px] font-extrabold uppercase mt-[8px] hover:bg-[#040037]/90 disabled:opacity-40 disabled:cursor-not-allowed transition active:scale-[0.98]"
      >
        Réserver
      </button>

      {/* Confirmation Modal */}
      {isModalOpen && (
        <BookingSummaryModal
          leasingId={leasingId}
          productTitle={productTitle}
          startDate={startDate}
          endDate={endDate}
          totalPrice={totalPrice}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
}
