export const ProgressBar = ({ currentStep, totalSteps }) => {
  const progressPercent = (currentStep / totalSteps) * 100;

  return (
    <div className="w-80 h-1 bg-feedback-background-neutral rounded-sm inline-flex justify-start items-start overflow-hidden mb-4">
      <div
        className="h-1 relative bg-feedback-background-service transition-all duration-300"
        style={{ width: `${progressPercent}%` }}
      ></div>
    </div>
  );
};
