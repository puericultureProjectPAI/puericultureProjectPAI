import { Field, useFormikContext } from "formik";
import { useEffect } from "react";
import FieldError from "../../common/components/form/FieldError.jsx";

export default function LeasingSpecificStep() {
  const { values, setFieldValue } = useFormikContext();

  useEffect(() => {
    const perDay = Number(values.pricePerDay);
    if (!isNaN(perDay) && perDay >= 0) {
      setFieldValue("pricePerMonth", Math.round(perDay * 30));
    }
  }, [values.pricePerDay, setFieldValue]);

  return (
    <div className="rounded-lg bg-[#f5f4fb] p-4">
      <h2 className="mb-4 text-center text-sm font-extrabold text-[#080036]">
        Location
      </h2>

      <div className="mb-4 grid grid-cols-2 gap-3">
        <div>
          <label
            className="mb-2 block text-sm font-extrabold text-[#080036]"
            htmlFor="minAgeMonths"
          >
            Âge min (mois)
          </label>
          <Field
            className="w-full rounded-md border border-[#b8b6c7] bg-white px-3 py-2 text-sm outline-none focus:border-[#080036]"
            id="minAgeMonths"
            min="0"
            name="minAgeMonths"
            placeholder="Ex : 0"
            type="number"
          />
        </div>

        <div>
          <label
            className="mb-2 block text-sm font-extrabold text-[#080036]"
            htmlFor="maxAgeMonths"
          >
            Âge max (mois)
          </label>
          <Field
            className="w-full rounded-md border border-[#b8b6c7] bg-white px-3 py-2 text-sm outline-none focus:border-[#080036]"
            id="maxAgeMonths"
            min="0"
            name="maxAgeMonths"
            placeholder="Ex : 36"
            type="number"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label
            className="mb-2 block text-sm font-extrabold text-[#080036]"
            htmlFor="pricePerDay"
          >
            Prix / jour
          </label>
          <div className="relative">
            <Field
              className="w-full rounded-md border border-[#b8b6c7] bg-white px-3 py-2 pr-8 text-sm outline-none focus:border-[#080036]"
              id="pricePerDay"
              min="0"
              name="pricePerDay"
              placeholder="0"
              step="1"
              type="number"
            />
            <span className="absolute right-3 top-2 text-sm text-[#080036]">
              €
            </span>
          </div>
          <FieldError name="pricePerDay" />
        </div>

        <div>
          <label
            className="mb-2 block text-sm font-extrabold text-[#080036]"
            htmlFor="pricePerMonth"
          >
            Prix / mois
          </label>
          <div className="relative">
            <Field
              className="w-full cursor-not-allowed rounded-md border border-[#b8b6c7] bg-[#ebebf5] px-3 py-2 pr-8 text-sm text-[#080036] outline-none"
              disabled
              id="pricePerMonth"
              name="pricePerMonth"
              type="number"
            />
            <span className="absolute right-3 top-2 text-sm text-[#080036]">
              €
            </span>
          </div>
          <p className="mt-1 text-xs text-[#6b6b8a]">
            Calculé automatiquement (× 30)
          </p>
        </div>
      </div>
    </div>
  );
}
