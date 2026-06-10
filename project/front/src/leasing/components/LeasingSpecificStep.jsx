import { Field } from "formik";
import FieldError from "../../common/components/form/FieldError.jsx";

export default function LeasingSpecificStep() {
  return (
    <div className="rounded-lg bg-[#f5f4fb] p-4">
      <h2 className="mb-4 text-center text-sm font-extrabold text-[#080036]">
        Location
      </h2>

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
              className="w-full rounded-md border border-[#b8b6c7] bg-white px-3 py-2 pr-8 text-sm outline-none focus:border-[#080036]"
              id="pricePerMonth"
              min="0"
              name="pricePerMonth"
              placeholder="0"
              step="1"
              type="number"
            />
            <span className="absolute right-3 top-2 text-sm text-[#080036]">
              €
            </span>
          </div>
          <FieldError name="pricePerMonth" />
        </div>
      </div>
    </div>
  );
}
