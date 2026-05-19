import { Field } from "formik";
import FieldError from "./FieldError";

export default function TrocSpecificStep() {
  return (
    <div className="rounded-lg bg-[#f5f4fb] p-4">
      <h2 className="mb-4 text-center text-sm font-extrabold text-[#080036]">
        Troc
      </h2>

      <label
        className="mb-2 block text-sm font-extrabold text-[#080036]"
        htmlFor="estimatedPrice"
      >
        Prix estimé
      </label>
      <div className="relative">
        <Field
          className="w-full rounded-md border border-[#b8b6c7] bg-white px-3 py-2 pr-8 text-sm outline-none focus:border-[#080036]"
          id="estimatedPrice"
          min="0"
          name="estimatedPrice"
          placeholder="0,00"
          step="1"
          type="number"
        />
        <span className="absolute right-3 top-2 text-sm text-[#080036]">€</span>
      </div>
      <FieldError name="estimatedPrice" />

      <div className="mt-4 grid grid-cols-2 gap-3">
        <div>
          <label
            className="mb-2 block text-sm font-extrabold text-[#080036]"
            htmlFor="radius"
          >
            Rayon
          </label>
          <div className="relative">
            <Field
              className="w-full rounded-md border border-[#b8b6c7] bg-white px-3 py-2 pr-9 text-sm outline-none focus:border-[#080036]"
              id="radius"
              min="1"
              name="radius"
              placeholder="km"
              type="number"
            />
            <span className="absolute right-3 top-2 text-xs font-semibold text-[#5f5b78]">
              km
            </span>
          </div>
        </div>

        <div>
          <label
            className="mb-2 block text-sm font-extrabold text-[#080036]"
            htmlFor="wantedArticle"
          >
            Je cherche
          </label>
          <Field
            className="w-full rounded-md border border-[#b8b6c7] bg-white px-3 py-2 text-sm outline-none focus:border-[#080036]"
            id="wantedArticle"
            name="wantedArticle"
            placeholder="Article"
          />
        </div>
      </div>
    </div>
  );
}
