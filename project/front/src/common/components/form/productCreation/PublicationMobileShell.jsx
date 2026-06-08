import PublicationStepper from "./PublicationStepper.jsx";

export default function PublicationMobileShell({
  children,
  currentStep,
  error,
  onBack,
  success,
}) {
  return (
    <section className="mx-auto flex min-h-dvh w-full max-w-[414px] flex-col overflow-hidden bg-white text-[#080036] shadow-[0_0_18px_rgba(8,0,54,0.08)]">
      <div className="flex flex-1 flex-col overflow-y-auto px-[24px] pb-[28px] pt-[34px]">
        <div className="mb-[28px] flex items-center gap-[24px]">
          <button
            aria-label="Retour"
            className="-ml-[8px] flex h-[44px] w-[36px] shrink-0 items-center justify-center text-[#080036]"
            onClick={onBack}
            type="button"
          >
            <svg
              aria-hidden="true"
              className="h-[34px] w-[22px]"
              fill="none"
              viewBox="0 0 21 35"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M18.5 2.5L3.5 17.5L18.5 32.5"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="5"
              />
            </svg>
          </button>
          <h1 className="text-[30px] font-extrabold leading-none tracking-[-0.035em] text-[#080036]">
            Publie ton article
          </h1>
        </div>

        <div className="mx-[24px] h-px bg-[#e5e2ea]" />

        <PublicationStepper currentStep={currentStep} />

        {success && (
          <div className="mb-4 rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-[12px] font-bold leading-snug text-green-700">
            {success}
          </div>
        )}

        {error && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-[12px] font-bold leading-snug text-red-600">
            {error}
          </div>
        )}

        <div className="flex-1">{children}</div>
      </div>
    </section>
  );
}
