export default function TimelineNavigator({
  periods,
  activePeriodId,
  onSelectPeriod,
}) {
  return (
    <div className="relative px-6 mb-10">
      <div className="absolute top-5 left-10 right-10 h-0.5 bg-gray-200"></div>
      <div className="flex justify-between relative z-10">
        {periods.map((item) => (
          <button
            key={item.id}
            onClick={() => onSelectPeriod(item.id)}
            className="flex flex-col items-center gap-2"
          >
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center border-4 transition-all ${
                activePeriodId === item.id
                  ? "bg-blue-600 border-blue-100 scale-110"
                  : "bg-white border-gray-100 text-gray-400"
              }`}
            >
              <span
                className={`text-xs font-bold ${activePeriodId === item.id ? "text-white" : ""}`}
              >
                {item.type}
              </span>
            </div>
            <span
              className={`text-[10px] font-bold uppercase ${activePeriodId === item.id ? "text-blue-600" : "text-gray-400"}`}
            >
              {item.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
