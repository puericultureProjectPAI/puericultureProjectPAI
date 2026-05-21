export default function PublicationFormActions({
  isSubmitting,
  setStep,
  setTouched,
  step,
  validateForm,
}) {
  const goNext = async () => {
    const errors = await validateForm();
    const stepFields = {
      1: ["mode"],
      2: ["imageReference", "title", "description", "category", "city"],
      3: [],
    }[step];

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

  return (
    <div className="mt-6 flex items-center justify-center gap-4">
      {step > 1 && (
        <button
          className="min-w-28 rounded-md bg-[#c4c2ce] px-5 py-3 text-sm font-extrabold text-white transition hover:bg-[#aaa8b8]"
          onClick={() => setStep(step - 1)}
          type="button"
        >
          ← Retour
        </button>
      )}

      {step < 4 ? (
        <button
          className="min-w-28 rounded-md bg-[#080036] px-5 py-3 text-sm font-extrabold text-white transition hover:bg-[#1a1157]"
          onClick={goNext}
          type="button"
        >
          Continuer →
        </button>
      ) : (
        <button
          className="min-w-28 rounded-md bg-[#080036] px-5 py-3 text-sm font-extrabold text-white transition hover:bg-[#1a1157] disabled:cursor-not-allowed disabled:bg-[#908ca9]"
          disabled={isSubmitting}
          type="submit"
        >
          {isSubmitting ? "Publication..." : "Publier"}
        </button>
      )}
    </div>
  );
}
