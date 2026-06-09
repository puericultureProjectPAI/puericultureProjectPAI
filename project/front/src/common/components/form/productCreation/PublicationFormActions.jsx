const getStepFields = (step, values) => {
  if (step === 1) {
    return ["mode"];
  }

  if (step === 2) {
    return ["images", "title", "description", "category", "condition"];
  }

  if (step === 3 && values.mode === "TROC") {
    return ["estimatedPrice"];
  }

  if (step === 3 && values.mode === "LOCATION") {
    return ["rentalStartDate", "rentalEndDate", "dailyPrice"];
  }

  if (step === 3 && values.mode === "SECOND_HAND") {
    return ["price"];
  }

  return [];
};

export default function PublicationFormActions({
  isSubmitting,
  setStep,
  setTouched,
  step,
  validateForm,
  values,
}) {
  const goNext = async () => {
    const errors = await validateForm();
    const stepFields = getStepFields(step, values);

    const stepErrors = stepFields.filter((field) => errors[field]);
    if (stepErrors.length > 0) {
      setTouched(
        stepFields.reduce((accumulator, field) => {
          accumulator[field] = true;
          return accumulator;
        }, {}),
        true,
      );
      return;
    }

    setStep(step + 1);
  };

  const isLastStep = step === 4;

  if (isLastStep) {
    return (
      <div className="mt-[35px] flex flex-col items-center gap-[20px]">
        <button
          className="w-full rounded-md bg-[#080036] px-5 py-[15px] text-[16px] font-extrabold text-white transition hover:bg-[#1a1157] disabled:cursor-not-allowed disabled:bg-[#908ca9]"
          disabled={isSubmitting}
          type="submit"
        >
          {isSubmitting ? "Publication..." : "Publier"}
        </button>
        <button
          className="text-[17px] font-medium text-[#777388] transition hover:text-[#080036]"
          onClick={() => setStep(step - 1)}
          type="button"
        >
          Retour
        </button>
      </div>
    );
  }

  return (
    <div className="mt-[34px] flex flex-col items-center gap-[20px]">
      <button
        className="w-full rounded-md bg-[#080036] px-5 py-[15px] text-[16px] font-extrabold text-white transition hover:bg-[#1a1157]"
        onClick={goNext}
        type="button"
      >
        Continuer
      </button>

      {step > 1 && (
        <button
          className="text-[17px] font-medium text-[#777388] transition hover:text-[#080036]"
          onClick={() => setStep(step - 1)}
          type="button"
        >
          Retour
        </button>
      )}
    </div>
  );
}
