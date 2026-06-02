import { useState } from "react";
import TimelineNavigatorButton from "./TimelineNavigatorButton";

export default function TimelineNavigator({
  periods = [],
  activePeriodId,
  onSelectPeriod,
}) {
  const itemsPerPage = 3;

  const totalItems = periods?.length || 0;
  const maxPage = totalItems > 0 ? Math.ceil(totalItems / itemsPerPage) - 1 : 0;

  const activeIdx = periods
    ? periods.findIndex((p) => p.id === activePeriodId)
    : -1;
  const safeActiveIdx = activeIdx !== -1 ? activeIdx : 0;
  const targetPage = Math.floor(safeActiveIdx / itemsPerPage);

  const [currentPage, setCurrentPage] = useState(targetPage);
  const [prevTargetPage, setPrevTargetPage] = useState(targetPage);

  if (targetPage !== prevTargetPage) {
    setCurrentPage(targetPage);
    setPrevTargetPage(targetPage);
  }

  const handlePrev = () => {
    if (currentPage > 0 && totalItems > 0) {
      const newPage = currentPage - 1;
      setCurrentPage(newPage);

      const targetIdx = newPage * itemsPerPage;
      if (periods[targetIdx]) {
        onSelectPeriod(periods[targetIdx].id);
      }
    }
  };

  const handleNext = () => {
    if (currentPage < maxPage && totalItems > 0) {
      const newPage = currentPage + 1;
      setCurrentPage(newPage);

      const targetIdx = newPage * itemsPerPage;
      if (periods[targetIdx]) {
        onSelectPeriod(periods[targetIdx].id);
      }
    }
  };

  const currentIndex = currentPage * itemsPerPage;
  const visiblePeriods = periods
    ? periods.slice(currentIndex, currentIndex + itemsPerPage)
    : [];

  if (totalItems === 0) {
    return (
      <div className="text-center text-xs text-gray-400 my-4">
        Loading timeline...
      </div>
    );
  }

  return (
    <div className="relative px-12 mb-10 flex items-center justify-between gap-2">
      <button
        type="button"
        onClick={handlePrev}
        disabled={currentPage === 0}
        className={`w-8 h-8 rounded-full flex items-center justify-center bg-white shadow-sm border border-gray-100 text-gray-600 font-bold transition-all ${
          currentPage === 0
            ? "opacity-30 cursor-not-allowed"
            : "hover:bg-gray-50 active:scale-95"
        }`}
      >
        ‹
      </button>

      <div className="flex-1 relative">
        <div className="absolute top-5 left-4 right-4 h-0.5 bg-gray-200"></div>

        <div className="flex justify-between relative z-10">
          {visiblePeriods.map((item) => (
            <TimelineNavigatorButton
              key={item.id}
              item={item}
              isActive={activePeriodId === item.id}
              onSelectPeriod={onSelectPeriod}
            />
          ))}
        </div>
      </div>

      <button
        type="button"
        onClick={handleNext}
        disabled={currentPage === maxPage}
        className={`w-8 h-8 rounded-full flex items-center justify-center bg-white shadow-sm border border-gray-100 text-gray-600 font-bold transition-all ${
          currentPage === maxPage
            ? "opacity-30 cursor-not-allowed"
            : "hover:bg-gray-50 active:scale-95"
        }`}
      >
        ›
      </button>
    </div>
  );
}
