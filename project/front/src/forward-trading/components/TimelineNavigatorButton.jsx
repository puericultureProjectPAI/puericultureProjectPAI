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

export default function TimelineNavigatorButton({
  item,
  isActive,
  onSelectPeriod,
}) {
  const styles = getStatusConfig(item.status);

  return (
    <button
      type="button"
      onClick={(e) => {
        onSelectPeriod(item.id);
        e.currentTarget.blur();
      }}
      style={{ WebkitTapHighlightColor: "transparent", outline: "none" }}
      className="flex flex-col items-center gap-2 w-[72px] transition-all duration-300
        focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0
        active:outline-none active:ring-0 z-20 relative flex-shrink-0"
    >
      <div
        className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 relative z-20 ${styles.bubble}`}
        style={
          isActive
            ? { boxShadow: "0 0 0 2px white, 0 0 0 4px #3b82f6" }
            : undefined
        }
      >
        <span className={`text-base font-normal font-figtree ${styles.text}`}>
          {item.type}
        </span>
      </div>

      <span
        className={`text-[10px] font-bold uppercase tracking-wider text-center transition-colors whitespace-nowrap ${
          isActive ? "text-blue-600 font-extrabold" : styles.label
        }`}
      >
        {item.label}
      </span>
    </button>
  );
}
