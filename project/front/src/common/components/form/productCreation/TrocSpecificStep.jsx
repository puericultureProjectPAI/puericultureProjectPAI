import { Field } from "formik";
import FieldError from "../FieldError.jsx";

export default function TrocSpecificStep() {
  //Nous ne savons pas encore s'il sera possible de sélectionner plusieurs modes ou un seul
  //Si plusieurs sont sélectionnable il faudra faire une div par mode et un système qui affiche les bonnes div selon les modes sélectionnés
  //Dans tous les cas il faut mettre en place ce système et créer votre propre div pour vos infos supplémentaires
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
          step="0.01"
          type="number"
        />
        <span className="absolute right-3 top-2 text-sm text-[#080036]">€</span>
      </div>
      <FieldError name="estimatedPrice" />
    </div>
  );
}
