export default function DropdownHeader({ title, count, open, onToggle }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="self-stretch py-2 bg-bg-base flex flex-col justify-center items-start gap-2 overflow-hidden w-full text-left border-0 border-b border-feedback-border-neutral"
    >
      <div className="self-stretch inline-flex justify-start items-center gap-2">
        {/* Title */}
        <div className="p-2.5 inline-flex flex-col justify-start items-start gap-2.5">
          <span className="text-brand text-xl font-bold font-['Figtree']">
            {title}
          </span>
        </div>

        {/* Count */}
        <div className="flex-1 flex justify-end items-center gap-2.5">
          <span className="text-subtle text-base font-normal font-['Figtree']">
            {count} article{count > 1 ? "s" : ""}
          </span>
        </div>

        {/* Chevron */}
        <div className="py-2.5 pr-2.5 flex justify-end items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 12 8"
            fill="none"
            className={`w-3 h-2 transition-transform duration-300 text-icon-brand shrink-0 ${
              open ? "rotate-180" : "rotate-0"
            }`}
          >
            <path
              d="M1 1L6 6L11 1"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
    </button>
  );
}
