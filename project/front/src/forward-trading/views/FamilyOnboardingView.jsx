import { FamilyOnboardingForm } from "../components/FamilyOnboardingForm";

export const FamilyOnboardingView = ({ onStepComplete }) => {
  const handleComplete = () => {
    if (onStepComplete) {
      onStepComplete();
    }
  };

  return (
    <div>
      <main>
        <FamilyOnboardingForm onComplete={handleComplete} />
      </main>
    </div>
  );
};
