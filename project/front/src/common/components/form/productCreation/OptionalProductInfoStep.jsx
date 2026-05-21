import { Field } from "formik";
import { CONDITION_OPTIONS } from "../../../../troc/constants/publicationOptions.js";

export default function OptionalProductInfoStep() {
  return (
    <div>
      <div className="mb-5 rounded-xl border border-[#bfdbfe] bg-[#eff6ff] px-4 py-3 text-center text-xs font-medium text-[#1e3a8a]">
        Ces informations optionnelles permettront aux utilisateurs de mieux
        connaître votre produit.
      </div>

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

      <div className="mt-4 grid grid-cols-2 gap-3">
        <div>
          <label
            className="mb-2 block text-sm font-extrabold text-[#080036]"
            htmlFor="lastCheckDate"
          >
            Dernier contrôle
          </label>
          <Field
            className="w-full rounded-md border border-[#b8b6c7] bg-white px-3 py-2 text-sm outline-none focus:border-[#080036]"
            id="lastCheckDate"
            name="lastCheckDate"
            type="date"
          />
        </div>

        <div>
          <label
            className="mb-2 block text-sm font-extrabold text-[#080036]"
            htmlFor="maxWeightKg"
          >
            Poids max. kg
          </label>
          <Field
            className="w-full rounded-md border border-[#b8b6c7] bg-white px-3 py-2 text-sm outline-none focus:border-[#080036]"
            id="maxWeightKg"
            min="0"
            name="maxWeightKg"
            placeholder="Ex : 15"
            type="number"
          />
        </div>
      </div>

      <label
        className="mb-2 mt-4 block text-sm font-extrabold text-[#080036]"
        htmlFor="securityStandard"
      >
        Norme de sécurité
      </label>
      <Field
        className="w-full rounded-md border border-[#b8b6c7] bg-white px-3 py-2 text-sm outline-none focus:border-[#080036]"
        id="securityStandard"
        name="securityStandard"
        placeholder="Ex : EN 1888"
      />

      <div className="mt-4 grid grid-cols-2 gap-3">
        <div>
          <label
            className="mb-2 block text-sm font-extrabold text-[#080036]"
            htmlFor="minAgeMonths"
          >
            Âge min. mois
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
            Âge max. mois
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
    </div>
  );
}
