import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

export default function ArrivalPackBanner({ city, startDate, endDate }) {
  const navigate = useNavigate();

  const [isVisible, setIsVisible] = useState(() => {
    return sessionStorage.getItem("arrivalPackClosed") !== "true";
  });

  useEffect(() => {
    // Réinitialiser la visibilité à chaque nouvelle recherche
    sessionStorage.removeItem("arrivalPackClosed");
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsVisible(true);
  }, [city, startDate, endDate]);

  if (!isVisible || !city || !startDate || !endDate) return null;

  const closeBanner = () => {
    sessionStorage.setItem("arrivalPackClosed", "true");
    setIsVisible(false);
  };

  const handleCompose = () => {
    const params = new URLSearchParams();
    params.set("city", city);
    params.set("startDate", startDate);
    params.set("endDate", endDate);
    navigate(`/leasing/pack?${params.toString()}`);
  };

  return (
    <div className="mx-4 mb-4 mt-2 flex h-[70px] items-center justify-between gap-[16px] rounded-[8px] bg-gradient-to-r from-[#B6CFFF] to-white px-[12px] shadow-[0px_2px_2px_0px_rgba(0,0,0,0.15)]">
      {/* Close button */}
      <button
        type="button"
        onClick={closeBanner}
        className="flex items-center justify-center text-[#3A51C9] hover:opacity-80 shrink-0"
        aria-label="Fermer le pack d'arrivée"
      >
        <span className="material-symbols-rounded text-[20px]">close</span>
      </button>

      {/* Banner content and action button */}
      <button
        type="button"
        onClick={handleCompose}
        className="flex flex-1 items-center justify-between gap-[12px] text-left outline-none"
      >
        <div className="flex flex-col gap-[4px] items-start justify-center">
          <span className="font-['Figtree',sans-serif] text-[20px] font-bold text-[#040037] leading-none">
            Composez votre pack !
          </span>
          <span className="font-['Figtree',sans-serif] text-[16px] font-normal text-[#33323d] leading-none">
            Sélection intelligente par IA
          </span>
        </div>

        {/* Circular button with chevron */}
        <div className="flex size-[56px] items-center justify-center rounded-full bg-white/70 text-[#3A51C9] shadow-xs transition hover:bg-white shrink-0">
          <span className="material-symbols-rounded text-[28px]">
            chevron_right
          </span>
        </div>
      </button>
    </div>
  );
}
