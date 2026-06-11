import { Field, useFormikContext } from "formik";
import { CONDITION_OPTIONS } from "../../../../troc/constants/publicationOptions.js";

export default function OptionalProductInfoStep() {
  const { values } = useFormikContext();
  const isTroc = values.mode === "TROC";

  return (
    <div>
      <div className="mb-5 rounded-xl bg-[#f5f4fb] px-4 py-3 text-center text-xs font-medium text-[#5f5b78]">
        Les informations complémentaires permettront aux utilisateurs de mieux
        connaître votre produit.
      </div>

      {!isTroc && (
        <>
          <label
            className="mb-2 block text-sm font-extrabold text-[#080036]"
            htmlFor="condition"
          >
            État
          </label>
          <Field
            as="select"
            className="w-full rounded-md border border-[#b8b6c7] bg-white px-3 py-2 text-sm outline-none focus:border-[#080036]"
            id="condition"
            name="condition"
          >
            <option value="">Select</option>
            {CONDITION_OPTIONS.map((condition) => (
              <option key={condition} value={condition}>
                {condition}
              </option>
            ))}
          </Field>
        </>
      )}

      {!isTroc && (
        <>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <div>
              <label
                className="mb-2 block text-sm font-extrabold text-[#080036]"
                htmlFor="brand"
              >
                Marque
              </label>
              <Field
                className="w-full rounded-md border border-[#b8b6c7] bg-white px-3 py-2 text-sm outline-none focus:border-[#080036]"
                id="brand"
                name="brand"
                placeholder="Ex : Kiabi"
              />
            </div>

            <div>
              <label
                className="mb-2 block text-sm font-extrabold text-[#080036]"
                htmlFor="model"
              >
                Modèle
              </label>
              <Field
                className="w-full rounded-md border border-[#b8b6c7] bg-white px-3 py-2 text-sm outline-none focus:border-[#080036]"
                id="model"
                name="model"
                placeholder="Optionnel"
              />
            </div>
          </div>

          <label
            className="mb-2 mt-4 block text-sm font-extrabold text-[#080036]"
            htmlFor="dimensions"
          >
            Dimensions
          </label>
          <Field
            className="w-full rounded-md border border-[#b8b6c7] bg-white px-3 py-2 text-sm outline-none focus:border-[#080036]"
            id="dimensions"
            name="dimensions"
            placeholder="Ex : 60 x 40 cm"
          />
        </>
      )}
    </div>
  );
}
