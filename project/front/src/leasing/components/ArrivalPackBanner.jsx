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
    <div className="mx-4 mb-4 mt-2 flex items-center justify-between rounded-[12px] border border-[#3A51C9] bg-[#e8f3ff] px-[12px] py-[8px]">
      <button
        type="button"
        onClick={handleCompose}
        className="flex-1 text-left font-['Figtree',sans-serif] text-[16px] font-normal text-[#3A51C9] outline-none"
      >
        Composez votre pack !
      </button>
      <button
        type="button"
        onClick={closeBanner}
        className="ml-2 flex items-center justify-center text-[#3A51C9] hover:opacity-80"
        aria-label="Fermer le pack d'arrivée"
      >
        <span className="material-symbols-rounded text-[20px]">close</span>
      </button>
    </div>
  );
}
