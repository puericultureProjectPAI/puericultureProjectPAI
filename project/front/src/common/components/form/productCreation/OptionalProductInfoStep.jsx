import { Field } from "formik";
import {
  CITY_OPTIONS,
  RADIUS_OPTIONS,
} from "../../../../troc/constants/publicationOptions.js";

const fieldClassName =
  "w-full rounded-md border border-[#858199] bg-white px-3 py-[10px] text-[14px] font-medium text-[#2f2d3c] outline-none placeholder:text-[#555261] focus:border-[#080036]";
const labelClassName =
  "mb-[8px] block text-[18px] font-extrabold leading-tight text-[#080036]";

export default function OptionalProductInfoStep() {
  return (
    <div className="space-y-[32px]">
      <section className="rounded-xl bg-[#f4f3fb] px-[10px] py-[18px]">
        <h2 className="mb-[18px] text-center text-[20px] font-extrabold leading-tight text-[#080036]">
          Troc
        </h2>

        <div className="grid grid-cols-2 gap-[16px]">
          <div>
            <label className={labelClassName} htmlFor="city">
              Ville
            </label>
            <Field as="select" className={fieldClassName} id="city" name="city">
              <option value="">Ville</option>
              {CITY_OPTIONS.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </Field>
          </div>

          <div>
            <label className={labelClassName} htmlFor="radius">
              Rayon
            </label>
            <Field
              as="select"
              className={fieldClassName}
              id="radius"
              name="radius"
            >
              <option value="">km</option>
              {RADIUS_OPTIONS.map((radius) => (
                <option key={radius} value={radius}>
                  {radius}
                </option>
              ))}
            </Field>
          </div>
        </div>

        <label
          className={`${labelClassName} mt-[26px]`}
          htmlFor="wantedArticle"
        >
          Je cherche
        </label>
        <Field
          className={fieldClassName}
          id="wantedArticle"
          name="wantedArticle"
          placeholder="Type d'article..."
        />
      </section>

      <section className="rounded-xl bg-[#f4f3fb] px-[10px] py-[18px]">
        <h2 className="mb-[18px] text-center text-[20px] font-extrabold leading-tight text-[#080036]">
          Location
        </h2>

        <div className="grid grid-cols-2 gap-[16px]">
          <div>
            <label className={labelClassName} htmlFor="rentalStartDate">
              Du
            </label>
            <Field
              className={fieldClassName}
              id="rentalStartDate"
              name="rentalStartDate"
              placeholder="jj/mm/aaaa"
            />
          </div>

          <div>
            <label className={labelClassName} htmlFor="rentalEndDate">
              Au
            </label>
            <Field
              className={fieldClassName}
              id="rentalEndDate"
              name="rentalEndDate"
              placeholder="jj/mm/aaaa"
            />
          </div>
        </div>

        <div className="mt-[26px] flex items-center gap-[14px]">
          <label
            className="shrink-0 text-[18px] font-extrabold leading-tight text-[#080036]"
            htmlFor="dailyPrice"
          >
            Prix / jour
          </label>
          <div className="relative flex-1">
            <Field
              className={`${fieldClassName} pr-8`}
              id="dailyPrice"
              min="0"
              name="dailyPrice"
              placeholder="0,00"
              step="0.01"
              type="number"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[18px] font-semibold text-[#2f2d3c]">
              €
            </span>
          </div>
        </div>
      </section>
    </div>
  );
}
