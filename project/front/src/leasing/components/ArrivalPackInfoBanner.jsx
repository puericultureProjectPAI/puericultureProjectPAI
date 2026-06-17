import { useState } from "react";

export default function ArrivalPackInfoBanner({
  setShowFilters,
  isMini = false,
}) {
  const [isVisible, setIsVisible] = useState(() => {
    const closedKey = isMini
      ? "arrivalPackInfoMiniClosed"
      : "arrivalPackInfoClosed";
    return sessionStorage.getItem(closedKey) !== "true";
  });

  if (!isVisible) return null;

  const closeBanner = (e) => {
    e.stopPropagation();
    const closedKey = isMini
      ? "arrivalPackInfoMiniClosed"
      : "arrivalPackInfoClosed";
    sessionStorage.setItem(closedKey, "true");
    setIsVisible(false);
  };

  const handleActivateFilters = () => {
    if (!isMini) {
      setShowFilters(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const containerSpacing = isMini ? "-mx-[8px] mt-[8px]" : "mx-4 mb-4 mt-2";
  const subtitle = isMini
    ? "Filtrez ci-dessous pour composer votre pack."
    : "Filtrez par destination et dates.";

  return (
    <div
      onClick={handleActivateFilters}
      className={`${containerSpacing} flex h-[70px] cursor-pointer items-center justify-between gap-[16px] rounded-[8px] bg-gradient-to-r from-[#B6CFFF] to-white px-[12px] shadow-[0px_2px_2px_0px_rgba(0,0,0,0.15)] transition hover:opacity-95`}
    >
      <button
        type="button"
        onClick={closeBanner}
        className="flex shrink-0 items-center justify-center text-[#3A51C9] hover:opacity-80"
        aria-label="Fermer"
      >
        <span className="material-symbols-rounded text-[20px]">close</span>
      </button>

      <div className="flex min-w-0 flex-1 items-center justify-between gap-[12px] text-left">
        <div className="flex min-w-0 flex-col items-start justify-center gap-[4px]">
          <span className="w-full truncate font-['Figtree',sans-serif] text-[18px] font-bold leading-[22px] text-[#040037]">
            Pack d'arrivée intelligent
          </span>
          <span className="truncate font-['Figtree',sans-serif] text-[14px] font-normal leading-[18px] text-[#33323d]">
            {subtitle}
          </span>
        </div>

        {!isMini && (
          <div className="flex size-[56px] shrink-0 items-center justify-center rounded-full bg-white/70 text-[#3A51C9] shadow-xs transition hover:bg-white">
            <span className="material-symbols-rounded text-[28px]">
              chevron_right
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
