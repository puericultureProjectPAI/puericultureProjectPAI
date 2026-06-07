import { useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../../common/security/AuthContext";

const formatDateFR = (dateStr) => {
  if (!dateStr) return "";
  const [year, month, day] = dateStr.split("-");
  return `${day}/${month}/${year}`;
};

export default function LeasingBookingSection({
  leasingId,
  productTitle,
  pricePerMonth,
  pricePerDay,
  firstImageUrl,
  initialStartDate = "",
  initialEndDate = "",
}) {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [savedStart, setSavedStart] = useState(initialStartDate);
  const [savedEnd, setSavedEnd] = useState(initialEndDate);
  const [editStart, setEditStart] = useState(initialStartDate);
  const [editEnd, setEditEnd] = useState(initialEndDate);
  const [isEditing, setIsEditing] = useState(
    !initialStartDate || !initialEndDate,
  );

  const todayStr = new Date().toISOString().split("T")[0];

  const calcPrice = (start, end) => {
    if (!start || !end) return 0;
    const s = new Date(start);
    const e = new Date(end);
    if (s > e) return 0;
    const diffDays =
      Math.ceil((e.getTime() - s.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    const months = Math.floor(diffDays / 30);
    const remainingDays = diffDays % 30;
    return months * Number(pricePerMonth) + remainingDays * Number(pricePerDay);
  };

  const editError =
    editStart && editEnd && new Date(editStart) > new Date(editEnd)
      ? "La date de début doit être antérieure à la date de fin."
      : "";

  const editValid =
    editStart && editEnd && !editError && calcPrice(editStart, editEnd) > 0;
  const hasSavedDates = savedStart && savedEnd;
  const savedPrice = calcPrice(savedStart, savedEnd);

  const handleBookClick = () => {
    if (!isAuthenticated) {
      navigate("/connection");
      return;
    }
    navigate(`/leasing/booking/${leasingId}`, {
      state: {
        productTitle,
        startDate: savedStart,
        endDate: savedEnd,
        totalPrice: savedPrice,
        firstImageUrl,
      },
    });
  };

  const handleValider = () => {
    setSavedStart(editStart);
    setSavedEnd(editEnd);
    setIsEditing(false);
  };

  const handleAnnuler = () => {
    setEditStart(savedStart);
    setEditEnd(savedEnd);
    setIsEditing(false);
  };

  return (
    <div className="w-full px-[14px] py-[12px] font-['Figtree',sans-serif]">
      <div className="border border-[rgba(117,115,136,0.75)] rounded-[8px] px-[12px] py-[12px] flex flex-col gap-[12px]">
        {/* Dates recap */}
        <div className="flex gap-[10px] items-center flex-wrap">
          <span className="font-normal text-[16px] text-[#757388]">
            Disponibilités :
          </span>
          {hasSavedDates && !isEditing ? (
            <span className="font-bold text-[16px] text-[#040037]">
              {formatDateFR(savedStart)} – {formatDateFR(savedEnd)}
            </span>
          ) : (
            !isEditing && (
              <span className="font-normal text-[16px] text-[#757388]">
                Choisir des dates
              </span>
            )
          )}
        </div>

        {/* Inline date editor */}
        {isEditing && (
          <div className="flex flex-col gap-[8px]">
            <div className="flex gap-[8px]">
              <div className="flex-1 flex flex-col gap-[2px]">
                <label className="font-normal text-[14px] text-[#757388]">
                  Début
                </label>
                <input
                  type="date"
                  min={todayStr}
                  value={editStart}
                  onChange={(e) => setEditStart(e.target.value)}
                  className="w-full border border-[#757388] rounded-[8px] p-[8px] text-[14px] text-[#040037] focus:outline-none bg-white"
                />
              </div>
              <div className="flex-1 flex flex-col gap-[2px]">
                <label className="font-normal text-[14px] text-[#757388]">
                  Fin
                </label>
                <input
                  type="date"
                  min={editStart || todayStr}
                  value={editEnd}
                  onChange={(e) => setEditEnd(e.target.value)}
                  className="w-full border border-[#757388] rounded-[8px] p-[8px] text-[14px] text-[#040037] focus:outline-none bg-white"
                />
              </div>
            </div>

            {editError && (
              <span className="text-[13px] text-red-500">{editError}</span>
            )}

            {editValid && (
              <div className="flex justify-between items-center bg-[#F2F2F9] rounded-[6px] px-[8px] py-[6px]">
                <span className="font-normal text-[14px] text-[#757388]">
                  Estimation
                </span>
                <span className="font-bold text-[16px] text-[#040037]">
                  {calcPrice(editStart, editEnd).toLocaleString("fr-FR", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}{" "}
                  €
                </span>
              </div>
            )}

            <button
              type="button"
              onClick={handleValider}
              disabled={!editValid}
              className={`h-[40px] rounded-[8px] w-full font-semibold text-[16px] text-white transition ${
                editValid
                  ? "bg-[#040037] hover:bg-[#040037]/90 active:scale-[0.98]"
                  : "bg-[rgba(117,115,136,0.5)] cursor-not-allowed"
              }`}
            >
              Valider
            </button>

            {hasSavedDates && (
              <button
                type="button"
                onClick={handleAnnuler}
                className="font-normal text-[16px] text-[#757388] py-[4px] text-center hover:opacity-80 transition"
              >
                Annuler
              </button>
            )}
          </div>
        )}

        {/* Boutons quand les dates sont confirmées */}
        {!isEditing && (
          <div className="flex flex-col gap-[12px]">
            <button
              type="button"
              onClick={handleBookClick}
              disabled={!hasSavedDates}
              className={`h-[40px] rounded-[8px] w-full font-semibold text-[16px] border transition ${
                hasSavedDates
                  ? "bg-white border-[#040037] text-[#040037] hover:bg-gray-50 active:scale-[0.98]"
                  : "bg-white border-[rgba(117,115,136,0.5)] text-[rgba(117,115,136,0.5)] cursor-not-allowed"
              }`}
            >
              Réserver
            </button>
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="bg-[#040037] text-white h-[40px] rounded-[8px] w-full font-semibold text-[16px] hover:bg-[#040037]/90 transition active:scale-[0.98]"
            >
              Modifier les dates
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
