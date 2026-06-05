import { useState, useRef, useEffect, useCallback } from "react";
import TimelineNavigatorButton from "./TimelineNavigatorButton";

export default function TimelineNavigator({
  periods = [],
  activePeriodId,
  onSelectPeriod,
}) {
  const PER = 3;
  const totalItems = periods?.length || 0;
  const maxPage = totalItems > 0 ? Math.ceil(totalItems / PER) - 1 : 0;

  const activeIdx = periods
    ? periods.findIndex((p) => p.id === activePeriodId)
    : -1;
  const safeActiveIdx = activeIdx !== -1 ? activeIdx : 0;
  const targetPage = Math.floor(safeActiveIdx / PER);

  const [currentPage, setCurrentPage] = useState(targetPage);
  const [prevTargetPage, setPrevTargetPage] = useState(targetPage);

  if (targetPage !== prevTargetPage) {
    setCurrentPage(targetPage);
    setPrevTargetPage(targetPage);
  }

  const winRef = useRef(null);
  const trackRef = useRef(null);
  const touchStartX = useRef(null);
  const touchStartTranslate = useRef(0);

  const pageToTranslate = useCallback((p) => {
    if (!winRef.current) return 0;
    return -(p * winRef.current.offsetWidth);
  }, []);

  const setTranslate = useCallback((x, animate) => {
    if (!trackRef.current) return;
    trackRef.current.style.transition = animate
      ? "transform 0.35s cubic-bezier(0.4, 0, 0.2, 1)"
      : "none";
    trackRef.current.style.transform = `translateX(${x}px)`;
  }, []);

  const snapToPage = useCallback(
    (p) => {
      const clamped = Math.max(0, Math.min(maxPage, p));
      setCurrentPage(clamped);
      if (periods[clamped * PER]) {
        onSelectPeriod(periods[clamped * PER].id);
      }
    },
    [maxPage, periods, PER, onSelectPeriod],
  );

  useEffect(() => {
    setTranslate(pageToTranslate(currentPage), true);
  }, [currentPage, pageToTranslate, setTranslate]);

  const handlePrev = () => {
    if (currentPage > 0) snapToPage(currentPage - 1);
  };
  const handleNext = () => {
    if (currentPage < maxPage) snapToPage(currentPage + 1);
  };

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartTranslate.current = pageToTranslate(currentPage);
    if (trackRef.current) trackRef.current.style.transition = "none";
  };

  const handleTouchMove = (e) => {
    if (touchStartX.current === null) return;
    const dx = e.touches[0].clientX - touchStartX.current;
    const min = pageToTranslate(maxPage);
    const max = pageToTranslate(0);
    let raw = touchStartTranslate.current + dx;
    if (raw > max) raw = max + (raw - max) * 0.2;
    if (raw < min) raw = min + (raw - min) * 0.2;
    if (trackRef.current) {
      trackRef.current.style.transition = "none";
      trackRef.current.style.transform = `translateX(${raw}px)`;
    }
  };

  const handleTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    const winW = winRef.current?.offsetWidth || 0;
    if (dx < -(winW * 0.2) && currentPage < maxPage)
      snapToPage(currentPage + 1);
    else if (dx > winW * 0.2 && currentPage > 0) snapToPage(currentPage - 1);
    else setTranslate(pageToTranslate(currentPage), true);
    touchStartX.current = null;
  };

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
        className={`w-8 h-8 rounded-full flex items-center justify-center bg-white shadow-sm border border-gray-100 text-gray-600 font-bold transition-all flex-shrink-0 ${
          currentPage === 0
            ? "opacity-30 cursor-not-allowed"
            : "hover:bg-gray-50 active:scale-95"
        }`}
      >
        ‹
      </button>

      <div
        ref={winRef}
        className="flex-1 overflow-hidden relative"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className="absolute top-5 left-4 right-4 h-0.5 bg-gray-200 z-0" />

        <div
          ref={trackRef}
          className="flex"
          style={{ width: `${(maxPage + 1) * 100}%` }}
        >
          {Array.from({ length: maxPage + 1 }, (_, pageIdx) => {
            const slice = periods.slice(pageIdx * PER, pageIdx * PER + PER);
            return (
              <div
                key={pageIdx}
                className="flex justify-between relative z-10"
                style={{ width: `${100 / (maxPage + 1)}%`, padding: "0 1rem" }}
              >
                {slice.map((item) => (
                  <TimelineNavigatorButton
                    key={item.id}
                    item={item}
                    isActive={activePeriodId === item.id}
                    onSelectPeriod={onSelectPeriod}
                  />
                ))}
              </div>
            );
          })}
        </div>
      </div>

      <button
        type="button"
        onClick={handleNext}
        disabled={currentPage === maxPage}
        className={`w-8 h-8 rounded-full flex items-center justify-center bg-white shadow-sm border border-gray-100 text-gray-600 font-bold transition-all flex-shrink-0 ${
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
