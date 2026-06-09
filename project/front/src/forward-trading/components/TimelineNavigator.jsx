import React, { useState, useRef, useEffect } from "react";
import SliderComponent from "react-slick";
import TimelineNavigatorButton from "./TimelineNavigatorButton";
import { getStatusConfig } from "../utils/timelineStyles";

const Slider = SliderComponent.default || SliderComponent;

export default function TimelineNavigator({
  periods = [],
  activePeriodId,
  onSelectPeriod,
}) {
  const sliderRef = useRef(null);

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

  const settings = {
    dots: false,
    infinite: false,
    speed: 400,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    initialSlide: targetPage,
    swipe: true,
    afterChange: (current) => {
      setCurrentPage(current);
    },
  };

  useEffect(() => {
    if (sliderRef.current) {
      sliderRef.current.slickGoTo(targetPage);
    }
  }, [targetPage]);

  const handlePageChange = (direction) => {
    if (!sliderRef.current) return;

    let nextPage = currentPage;

    if (direction === "prev" && currentPage > 0) {
      nextPage = currentPage - 1;
      sliderRef.current.slickPrev();
    } else if (direction === "next" && currentPage < maxPage) {
      nextPage = currentPage + 1;
      sliderRef.current.slickNext();
    }

    if (periods[nextPage * PER]) {
      onSelectPeriod(periods[nextPage * PER].id);
    }
  };

  if (totalItems === 0) {
    return (
      <div className="text-center text-xs text-gray-400 my-4">
        Loading timeline...
      </div>
    );
  }

  return (
    <div className="relative px-4 mb-10 flex items-center justify-between gap-4 select-none">
      {/* Bouton précédent */}
      <button
        type="button"
        onClick={() => handlePageChange("prev")}
        disabled={currentPage === 0}
        className={`w-8 h-8 rounded-full flex items-center justify-center bg-white shadow-md border border-gray-100 text-gray-600 font-bold transition-all flex-shrink-0 z-30 ${
          currentPage === 0
            ? "opacity-20 cursor-not-allowed"
            : "hover:bg-gray-50 active:scale-95 cursor-pointer"
        }`}
      >
        ‹
      </button>

      {/* Timeline */}
      <div className="flex-1 overflow-hidden relative py-4">
        {/* Ligne grise corrigée */}
        <div className="absolute top-[36px] left-16 right-16 h-[2px] bg-gray-200 z-0" />

        <Slider ref={sliderRef} {...settings} className="relative z-10">
          {Array.from({ length: maxPage + 1 }, (_, pageIdx) => {
            const slice = periods.slice(pageIdx * PER, pageIdx * PER + PER);

            return (
              <div
                key={pageIdx}
                className="!flex justify-between items-center outline-none"
              >
                {slice.map((item, idx) => (
                  <React.Fragment key={item.id}>
                    <TimelineNavigatorButton
                      item={item}
                      index={idx}
                      isActive={activePeriodId === item.id}
                      onSelectPeriod={onSelectPeriod}
                    />

                    {idx < slice.length - 1 && (
                      <div className="relative flex-1 h-10 min-w-[20px] mx-1">
                        <div
                          className={`w-full h-[2px] absolute top-[18px] left-0 transition-colors duration-300 ${
                            getStatusConfig(item.status).line
                          }`}
                        />
                      </div>
                    )}
                  </React.Fragment>
                ))}
              </div>
            );
          })}
        </Slider>
      </div>

      {/* Bouton suivant */}
      <button
        type="button"
        onClick={() => handlePageChange("next")}
        disabled={currentPage === maxPage}
        className={`w-8 h-8 rounded-full flex items-center justify-center bg-white shadow-md border border-gray-100 text-gray-600 font-bold transition-all flex-shrink-0 z-30 ${
          currentPage === maxPage
            ? "opacity-20 cursor-not-allowed"
            : "hover:bg-gray-50 active:scale-95 cursor-pointer"
        }`}
      >
        ›
      </button>
    </div>
  );
}
