import { getStatusConfig } from "../utils/timelineStyles";

export default function TimelineNavigatorButton({
  item,
  isActive,
  onSelectPeriod,
  index,
}) {
  const styles = getStatusConfig(item.status);
  const scaleOrigin = index === 0 ? "origin-left" : "origin-center";

  return (
    <button
      type="button"
      onClick={(e) => {
        onSelectPeriod(item.id);
        e.currentTarget.blur();
      }}
      style={{
        WebkitTapHighlightColor: "transparent",
        outline: "none",
      }}
      className={`flex flex-col items-center gap-2 min-w-[60px] transition-all duration-300
        focus:outline-none
        focus:ring-0
        focus-visible:outline-none
        focus-visible:ring-0
        active:outline-none
        active:ring-0
        ${
          isActive ? `z-20 relative scale-110 ${scaleOrigin}` : "z-10 relative"
        }`}
    >
      <div
        className={`w-10 h-10 rounded-full flex items-center justify-center border-4 transition-all duration-300 ${
          styles.bubble
        } ${
          isActive
            ? "border-blue-500 shadow-md shadow-blue-100/50"
            : "border-transparent"
        }`}
      >
        <span className={`text-xs font-bold ${styles.text}`}>{item.type}</span>
      </div>
      <span
        className={`text-[10px] font-bold uppercase tracking-wider text-center transition-colors ${
          isActive ? "text-blue-600 font-extrabold" : styles.label
        }`}
      >
        {item.label}
      </span>
    </button>
  );
}
