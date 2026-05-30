export default function TimelineNavigatorButton({
  item,
  isActive,
  onSelectPeriod,
}) {
  return (
    <button
      type="button"
      onClick={() => onSelectPeriod(item.id)}
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
}
