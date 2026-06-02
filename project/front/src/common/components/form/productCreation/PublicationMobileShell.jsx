import PublicationStepper from "./PublicationStepper.jsx";

export default function PublicationMobileShell({
  children,
  currentStep,
  error,
  success,
}) {
  return (
    <section className="px-7 pb-6 pt-5">
      <div className="mb-1 flex items-center gap-4">
        <span className="text-3xl leading-none text-[#080036]">‹</span>
        <h1 className="text-2xl font-extrabold text-[#080036]">
          Publie ton article
        </h1>
      </div>
      <div className="ml-11 h-px bg-[#efedf5]" />

      <PublicationStepper currentStep={currentStep} />

      {success && (
        <div className="mb-4 rounded-xl border border-green-200 bg-green-50 px-3 py-2 text-sm font-medium text-green-700">
          {success}
        </div>
      )}

      {error && (
        <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-700">
          {error}
        </div>
      )}

      {children}
    </section>
  );
}
