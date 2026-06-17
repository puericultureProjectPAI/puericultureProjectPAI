export default function PublicationStepper({ currentStep }) {
  const steps = [1, 2];

  return (
    <div className="mb-[40px] mt-[23px] flex items-center justify-between px-[3px]">
      {steps.map((step, index) => {
        const isDone = currentStep > step;
        const isCurrent = currentStep === step;
        const lineDone = currentStep > step;

        return (
          <div className="flex flex-1 items-center last:flex-none" key={step}>
            <div
              className={`z-10 flex h-[54px] w-[54px] shrink-0 items-center justify-center rounded-full text-[17px] font-medium transition-colors ${
                isDone
                  ? "bg-[#ecfff2] text-[#6f6b80]"
                  : isCurrent
                    ? "bg-[#e7f3ff] text-[#080036]"
                    : "bg-[#f1f0f8] text-[#777388]"
              }`}
            >
              {step}
            </div>

            {index < steps.length - 1 && (
              <div
                className={`mx-[3px] h-[2px] flex-1 rounded-full transition-colors ${
                  lineDone ? "bg-[#e6fbef]" : "bg-[#f1f0f8]"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
