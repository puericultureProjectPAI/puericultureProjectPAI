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

  if (isMini) {
    return (
      <div className="mt-[8px] flex items-center justify-between gap-[10px] rounded-[6px] border border-[#D0E3FF]/70 bg-[#E8F3FF] px-[12px] py-[6px] shadow-xs">
        {/* Sparkle Icon */}
        <div className="flex shrink-0 items-center justify-center text-[#3A51C9]">
          <span className="material-symbols-rounded text-[16px] animate-pulse">
            auto_awesome
          </span>
        </div>

        {/* Text */}
        <div className="flex-1 min-w-0">
          <p className="font-['Figtree',sans-serif] text-[11px] font-medium text-[#040037] truncate">
            Filtrez ci-dessous pour générer votre pack d'arrivée par IA.
          </p>
        </div>

        {/* Close Button */}
        <button
          type="button"
          onClick={closeBanner}
          className="flex h-[20px] w-[20px] shrink-0 items-center justify-center rounded-full text-[#757388] transition hover:bg-white/50 hover:text-[#040037]"
          aria-label="Fermer"
        >
          <span className="material-symbols-rounded text-[12px]">close</span>
        </button>
      </div>
    );
  }

  return (
    <div
      onClick={handleActivateFilters}
      className="shimmer-right-to-left relative mx-4 mb-4 mt-2 flex cursor-pointer items-center justify-between gap-[12px] rounded-[10px] border border-[#D0E3FF] p-[10px] pr-[40px] shadow-[0px_1px_3px_rgba(0,0,0,0.05)] transition hover:opacity-95"
    >
      {/* Premium Sparkles Icon with Pulse */}
      <div className="flex h-[32px] w-[32px] shrink-0 items-center justify-center rounded-full bg-white text-[#3A51C9] shadow-xs">
        <span className="material-symbols-rounded text-[18px] animate-pulse">
          auto_awesome
        </span>
      </div>

      {/* Text block */}
      <div className="flex-1 min-w-0">
        <h4 className="font-['Figtree',sans-serif] text-[13px] font-bold text-[#040037] leading-tight">
          Pack d'arrivée intelligent
        </h4>
        <p className="mt-[2px] font-['Figtree',sans-serif] text-[11px] font-normal text-[#5A5C75] leading-snug">
          Filtrez par destination et dates pour composer votre pack sur-mesure.
        </p>
      </div>

      {/* Arrow Action */}
      <div className="flex items-center shrink-0">
        <div className="flex h-[32px] w-[32px] items-center justify-center rounded-full bg-white text-[#3A51C9] shadow-xs hover:bg-[#E8F3FF] transition">
          <span className="material-symbols-rounded text-[22px]">
            chevron_right
          </span>
        </div>
      </div>

      {/* Close Button */}
      <button
        type="button"
        onClick={closeBanner}
        className="absolute right-[8px] top-[8px] flex h-[20px] w-[20px] items-center justify-center rounded-full text-[#757388] transition hover:bg-white/50 hover:text-[#040037]"
        aria-label="Fermer"
      >
        <span className="material-symbols-rounded text-[12px]">close</span>
      </button>
    </div>
  );
}
