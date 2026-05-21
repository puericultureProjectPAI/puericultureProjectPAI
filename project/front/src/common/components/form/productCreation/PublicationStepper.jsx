export default function PublicationStepper({ currentStep }) {
  return (
    <div className="mb-8 mt-6 flex items-center justify-center">
      {[1, 2, 3, 4].map((step) => (
        <div className="flex items-center" key={step}>
          <div
            className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold ${
              currentStep === step
                ? "bg-[#e8f2ff] text-[#080036]"
                : "bg-[#f0f0f7] text-[#9b9ab0]"
            }`}
          >
            {step}
          </div>

          {step < 4 && <div className="h-px w-9 bg-[#e3e1ee]" />}
        </div>
      ))}
    </div>
  );
}
