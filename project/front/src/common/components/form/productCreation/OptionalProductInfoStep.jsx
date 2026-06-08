import { Field } from "formik";
import FieldError from "../FieldError.jsx";

const inputClassName =
  "w-full rounded-lg border border-[#858199] bg-white px-[14px] py-[14px] text-[18px] font-medium text-[#2f2d3c] outline-none placeholder:text-[#555261] focus:border-[#080036]";
const labelClassName =
  "mb-[10px] block text-[22px] font-extrabold leading-tight text-[#080036]";

export default function OptionalProductInfoStep() {
  return (
    <div className="rounded-xl bg-[#f4f3fb] px-[14px] py-[22px]">
      <h2 className="mb-[22px] text-center text-[24px] font-extrabold leading-tight text-[#080036]">
        Location
      </h2>

      <div className="grid grid-cols-2 gap-[20px]">
        <div>
          <label className={labelClassName} htmlFor="rentalStartDate">
            Du
          </label>
          <Field
            className={inputClassName}
            id="rentalStartDate"
            name="rentalStartDate"
            placeholder="jj/mm/aaaa"
            type="text"
          />
          <FieldError name="rentalStartDate" />
        </div>

        <div>
          <label className={labelClassName} htmlFor="rentalEndDate">
            Au
          </label>
          <Field
            className={inputClassName}
            id="rentalEndDate"
            name="rentalEndDate"
            placeholder="jj/mm/aaaa"
            type="text"
          />
          <FieldError name="rentalEndDate" />
        </div>
      </div>

      <div className="mt-[26px] grid grid-cols-[190px_minmax(0,1fr)] items-center gap-[18px]">
        <label
          className="text-[24px] font-extrabold leading-tight text-[#080036]"
          htmlFor="dailyPrice"
        >
          Prix / jour
        </label>
        <div className="relative">
          <Field
            className={`${inputClassName} pr-[42px]`}
            id="dailyPrice"
            min="0"
            name="dailyPrice"
            placeholder="0,00"
            step="0.01"
            type="number"
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[22px] font-semibold text-[#2f2d3c]">
            €
          </span>
          <FieldError name="dailyPrice" />
        </div>
      </div>
    </div>
  );
}
