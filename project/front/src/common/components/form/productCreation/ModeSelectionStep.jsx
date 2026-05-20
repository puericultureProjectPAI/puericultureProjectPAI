import { PUBLISH_MODES } from "../../../../troc/constants/publicationOptions.js";

export default function ModeSelectionStep({ setFieldValue }) {
  return (
    <div>
      <h2 className="mb-5 text-center text-sm font-extrabold text-[#080036]">
        Comment proposer cet article ?
      </h2>

      <div className="space-y-4">
        {PUBLISH_MODES.map((mode) => (
          <button
            className={`flex w-full items-center gap-4 rounded-lg border px-4 py-4 text-left transition ${
              mode.key === "TROC"
                ? "border-[#080036] bg-white shadow-sm"
                : "border-[#d7d5e5] bg-white opacity-70"
            } ${mode.disabled ? "cursor-not-allowed" : "hover:border-[#080036]"}`}
            disabled={mode.disabled}
            key={mode.key}
            onClick={() => setFieldValue("mode", "TROC")}
            type="button"
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-md bg-[#f1efff] text-2xl text-[#080036]">
              {mode.icon}
            </span>
            <span>
              <span className="block font-extrabold text-[#080036]">
                {mode.title}
              </span>
              <span className="mt-1 block text-xs font-medium text-[#5f5b78]">
                {mode.description}
              </span>
            </span>
          </button>
        ))}
      </div>

      <div className="mt-5 rounded-md border border-[#b9c5ff] bg-[#f7f9ff] px-3 py-3 text-center text-xs font-medium text-[#36336a]">
        ⓘ Les autres modes seront disponibles prochainement
      </div>
    </div>
  );
}
