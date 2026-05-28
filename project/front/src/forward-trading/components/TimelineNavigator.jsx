import { useState } from "react";

export default function TimelineNavigator({
  periods,
  activePeriodId,
  onSelectPeriod,
}) {
  const itemsPerPage = 3;

  const activeIdx = periods.findIndex((p) => p.id === activePeriodId);
  const safeActiveIdx = activeIdx !== -1 ? activeIdx : 0;

  const targetPage = Math.floor(safeActiveIdx / itemsPerPage);

  let idealStartIndex = targetPage * itemsPerPage;
  if (idealStartIndex + itemsPerPage > periods.length) {
    idealStartIndex = Math.max(0, periods.length - itemsPerPage);
  }

  const [manualOffset, setManualOffset] = useState(0);

  const currentIndex = Math.max(
    0,
    Math.min(idealStartIndex + manualOffset, periods.length - itemsPerPage),
  );

  const handlePrev = () => {
    if (currentIndex > 0) {
      setManualOffset((prev) => prev - 1);
    }
  };

  const handleNext = () => {
    if (currentIndex + itemsPerPage < periods.length) {
      setManualOffset((prev) => prev + 1);
    }
  };

  const visiblePeriods = periods.slice(
    currentIndex,
    currentIndex + itemsPerPage,
  );

  return (
    <div className="relative px-12 mb-10 flex items-center justify-between gap-2">
      <button
        type="button"
        onClick={handlePrev}
        disabled={currentIndex === 0}
        className={`w-8 h-8 rounded-full flex items-center justify-center bg-white shadow-sm border border-gray-100 text-gray-600 font-bold transition-all ${
          currentIndex === 0
            ? "opacity-30 cursor-not-allowed"
            : "hover:bg-gray-50 active:scale-95"
        }`}
      >
        ‹
      </button>

      <div className="flex-1 relative">
        <div className="absolute top-5 left-4 right-4 h-0.5 bg-gray-200"></div>

        <div className="flex justify-between relative z-10">
          {visiblePeriods.map((item) => {
            const isActive = activePeriodId === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setManualOffset(0);
                  onSelectPeriod(item.id);
                }}
                className="flex flex-col items-center gap-2 min-w-[60px]"
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center border-4 transition-all duration-300 ${
                    isActive
                      ? "bg-blue-600 border-blue-100 scale-110 shadow-md shadow-blue-100"
                      : "bg-white border-gray-100 text-gray-400 hover:border-gray-200"
                  }`}
                >
                  <span
                    className={`text-xs font-bold ${isActive ? "text-white" : "text-gray-500"}`}
                  >
                    {item.type}
                  </span>
                </div>

                <span
                  className={`text-[10px] font-bold uppercase tracking-wider text-center transition-colors ${
                    isActive ? "text-blue-600" : "text-gray-400"
                  }`}
                >
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* BOUTON SUIVANT */}
      <button
        type="button"
        onClick={handleNext}
        disabled={currentIndex + itemsPerPage >= periods.length}
        className={`w-8 h-8 rounded-full flex items-center justify-center bg-white shadow-sm border border-gray-100 text-gray-600 font-bold transition-all ${
          currentIndex + itemsPerPage >= periods.length
            ? "opacity-30 cursor-not-allowed"
            : "hover:bg-gray-50 active:scale-95"
        }`}
      >
        ›
      </button>
    </div>
  );
}
