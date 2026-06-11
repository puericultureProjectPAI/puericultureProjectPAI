export const ProgressBar = ({ currentStep, totalSteps }) => {
  const progressPercent = (currentStep / totalSteps) * 100;
  return (
    <div className="w-full h-1 bg-feedback-background-neutral rounded-sm overflow-hidden">
      <div
        className="h-1 bg-feedback-background-service transition-all duration-300"
        style={{ width: `${progressPercent}%` }}
      />
    </div>
  );
};
