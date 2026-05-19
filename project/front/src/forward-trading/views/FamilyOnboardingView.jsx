import { FamilyOnboardingForm } from "../components/FamilyOnboardingForm";

export const FamilyOnboardingView = ({ onStepComplete }) => {
  const handleComplete = () => {
    // Cette fonction sera appelée dès que le hook de mutation TanStack Query réussira
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
