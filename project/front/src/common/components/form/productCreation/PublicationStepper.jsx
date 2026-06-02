export default function PublicationStepper({ currentStep }) {
  const steps = [1, 2, 3, 4];

  return (
    <div className="mb-8 mt-6 flex items-center justify-center px-7">
      {steps.map((step, index) => {
        const isDone = currentStep > step;
        const isCurrent = currentStep === step;
        const isLineDone = currentStep > step;

        return (
          <div
            className={`flex items-center ${index === steps.length - 1 ? "" : "flex-1"}`}
            key={step}
          >
            <div
              className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold transition-colors ${
                isDone
                  ? "bg-[#e8faef] text-[#1d8f4f]"
                  : isCurrent
                    ? "bg-[#e8f2ff] text-[#080036]"
                    : "bg-[#f0f0f7] text-[#9b9ab0]"
              }`}
            >
              {step}
            </div>

            {index < steps.length - 1 && (
              <div
                className={`mx-2 h-px flex-1 rounded-full transition-colors ${
                  isLineDone ? "bg-[#c9f2d8]" : "bg-[#efedf5]"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
