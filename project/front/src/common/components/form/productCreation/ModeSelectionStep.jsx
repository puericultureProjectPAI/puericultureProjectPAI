import { useFormikContext } from "formik";
import { PUBLISH_MODES } from "../../../../troc/constants/publicationOptions.js";

export default function ModeSelectionStep() {
  const { setFieldValue, values } = useFormikContext();

  const handleSelect = (key) => {
    setFieldValue("mode", key);
  };

  return (
    <div className="font-figtree">
      <h2 className="mb-[33px] text-center text-[20px] font-extrabold leading-tight tracking-[-0.03em] text-[#080036]">
        Comment proposer cet article ?
      </h2>

      <div className="space-y-[32px]">
        {PUBLISH_MODES.map((mode) => {
          const selected = values.mode === mode.key;

          return (
            <button
              className={`flex min-h-[86px] w-full items-center gap-[24px] rounded-lg bg-white px-[18px] py-[14px] text-left transition ${
                selected
                  ? "border-2 border-[#080036] shadow-sm"
                  : "border border-[#8d8aa1] shadow-[0_2px_4px_rgba(8,0,54,0.12)]"
              }`}
              key={mode.key}
              onClick={() => handleSelect(mode.key)}
              type="button"
            >
              <span
                className={`flex h-[55px] w-[55px] shrink-0 items-center justify-center rounded-md ${mode.iconBackground} text-[#080036]`}
              >
                <span className="material-symbols-rounded text-[32px] leading-none">
                  {mode.icon}
                </span>
              </span>

              <span>
                <span className="block text-[20px] font-extrabold leading-tight tracking-[-0.03em] text-[#080036]">
                  {mode.title}
                </span>
                <span className="mt-[8px] block text-[15px] font-medium leading-tight text-[#2f2d3c]">
                  {mode.description}
                </span>
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
