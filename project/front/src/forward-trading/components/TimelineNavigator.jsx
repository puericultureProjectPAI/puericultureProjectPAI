import { useState, useRef, useEffect } from "react";
import SliderComponent from "react-slick";
import TimelineNavigatorButton from "./TimelineNavigatorButton";

const Slider = SliderComponent.default || SliderComponent;

const statusStyles = {
  past: {
    bubble: "bg-feedback-background-success",
    line: "bg-feedback-background-success",
    text: "text-subtle",
    label: "text-subtle",
  },
  current: {
    bubble: "bg-info",
    line: "bg-info",
    text: "text-neutral",
    label: "text-neutral",
  },
  future: {
    bubble: "bg-feedback-background-neutral",
    line: "bg-feedback-background-neutral",
    text: "text-subtle",
    label: "text-subtle",
  },
};

const getStatusConfig = (status) => {
  const normalized = status?.toLowerCase();
  return statusStyles[normalized] || statusStyles.future;
};

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

  const [prevTargetPage, setPrevTargetPage] = useState(targetPage);

  if (targetPage !== prevTargetPage) {
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
  };

  useEffect(() => {
    if (sliderRef.current) {
      sliderRef.current.slickGoTo(targetPage);
    }
  }, [targetPage]);

  if (totalItems === 0) {
    return (
      <div className="text-center text-xs text-gray-400 my-4">
        Loading timeline...
      </div>
    );
  }

  return (
    <div className="relative px-2 mb-10 overflow-hidden select-none w-full max-w-md mx-auto">
      <div className="relative py-4">
        <Slider ref={sliderRef} {...settings} className="relative z-10">
          {Array.from({ length: maxPage + 1 }, (_, pageIdx) => {
            const slice = periods.slice(pageIdx * PER, pageIdx * PER + PER);

            return (
              <div key={pageIdx} className="outline-none py-2 relative">
                <div className="absolute top-[36px] left-12 right-12 h-[2px] z-0 pointer-events-none">
                  <div className="w-full h-full bg-gray-200 absolute top-0 left-0" />

                  <div className="w-full h-full absolute top-0 left-0 flex">
                    {slice.map((item, idx) => {
                      if (idx === slice.length - 1) return null;
                      return (
                        <div
                          key={`color-line-${item.id}`}
                          className="flex-1 h-full"
                        >
                          <div
                            className={`w-full h-full transition-colors duration-300 ${getStatusConfig(item.status).line}`}
                          />
                        </div>
                      );
                    })}
                    {slice.length < PER && <div className="flex-1" />}
                  </div>
                </div>

                <div className="flex justify-between items-center relative z-10 px-4 w-full">
                  {slice.map((item) => (
                    <TimelineNavigatorButton
                      key={item.id}
                      item={item}
                      isActive={activePeriodId === item.id}
                      onSelectPeriod={onSelectPeriod}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </Slider>
      </div>
    </div>
  );
}
