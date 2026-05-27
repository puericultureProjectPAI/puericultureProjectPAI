import { Field, ErrorMessage } from "formik";

export default function SecondHandSpecificStep() {
  return (
    <div className="rounded-lg bg-[#f5f4fb] p-4">
      <h2 className="mb-4 text-center text-sm font-extrabold text-[#080036]">
        Seconde main
      </h2>

      <label
        className="mb-2 block text-sm font-extrabold text-[#080036]"
        htmlFor="price"
      >
        Prix de vente
      </label>
      <div className="relative">
        <Field
          className="w-full rounded-md border border-[#b8b6c7] bg-white px-3 py-2 pr-8 text-sm outline-none focus:border-[#080036]"
          id="price"
          min="0"
          name="price"
          placeholder="0,00"
          step="0.01"
          type="number"
        />
        <span className="absolute right-3 top-2 text-sm text-[#080036]">€</span>
      </div>
      <ErrorMessage
        name="price"
        component="div"
        className="text-xs text-red-500 mt-1"
      />
    </div>
  );
}
