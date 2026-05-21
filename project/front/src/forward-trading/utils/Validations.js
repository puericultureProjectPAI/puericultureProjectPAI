import * as Yup from "yup";

// Accepte MM/AAAA (ex: 11/2026) OU JJ/MM/AAAA (ex: 27/11/2026)
export const REGEX_DPA = /^((0[1-9]|[12]\d|3[01])\/)?(0[1-9]|1[0-2])\/\d{4}$/;

export const schemaCreationEnfant = Yup.object({
  prenom: Yup.string()
    .min(2, "Le prénom doit contenir au moins 2 caractères")
    .required("Le prénom est requis"),

  genre: Yup.string()
    .oneOf(
      ["f", "m", "s"], // Aligné avec ton DTO backend
      "Veuillez sélectionner un genre valide",
    )
    .required("Le genre est requis"),

  dpa: Yup.string()
    .matches(REGEX_DPA, "Le format doit être JJ/MM/AAAA ou MM/AAAA")
    .required("La date est requise"),
});
