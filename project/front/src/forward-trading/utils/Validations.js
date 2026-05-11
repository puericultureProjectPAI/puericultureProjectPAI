import * as Yup from "yup";

export const REGEX_DPA_MM_AAAA = /^(0[1-9]|1[0-2])\/\d{4}$/;

export const schemaCreationEnfant = Yup.object({
  prenom: Yup.string()
    .min(2, "Le prénom doit contenir au moins 2 caractères")
    .required("Le prénom est requis"),

  genre: Yup.string()
    .oneOf(
      ["Fille", "Garçon", "Autre"],
      "Veuillez sélectionner un genre valide",
    )
    .required("Le genre est requis"),

  dpa: Yup.string()
    .matches(REGEX_DPA_MM_AAAA, "Le format doit être MM/AAAA (ex: 11/2026)")
    .required("La date est requise"),
});
