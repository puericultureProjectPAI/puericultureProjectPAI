import { Formik, Form } from "formik";
import { NavLink } from "react-router";
import * as Yup from "yup";
import MyTextInput from "./form/MyTextInput";

const validationSchema = Yup.object({
  lastName: Yup.string().required("Le nom est requis."),
  firstName: Yup.string().required("Le prénom est requis."),
  birthDate: Yup.date()
    .max(new Date(), "La date de naissance doit être dans le passé.")
    .required("La date de naissance est requise."),
  email: Yup.string()
    .email("Le format de l'adresse email est invalide.")
    .required("L'email est requis."),
  password: Yup.string()
    .min(8, "Le mot de passe doit contenir au moins 8 caractères.")
    .matches(/[0-9]/, "Le mot de passe doit contenir au moins un chiffre.")
    .matches(
      /[!@#$%^&*(),.?":{}|<>]/,
      "Le mot de passe doit contenir au moins un caractère spécial.",
    )
    .required("Le mot de passe est requis."),
});

export default function RegisterForm({ onSubmit, isLoading }) {
  return (
    <>
      <Formik
        initialValues={{
          lastName: "",
          firstName: "",
          birthDate: "",
          email: "",
          password: "",
        }}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        <Form class="flex flex-col">
          <MyTextInput label="Nom" name="lastName" type="text" />
          <MyTextInput label="Prénom" name="firstName" type="text" />
          <MyTextInput label="Date de naissance" name="birthDate" type="date" />
          <MyTextInput label="Email" name="email" type="email" />
          <MyTextInput label="Mot de passe" name="password" type="password" />
          <button type="submit" disabled={isLoading}>
            {isLoading ? "Inscription..." : "S'inscrire"}
          </button>
        </Form>
      </Formik>
      <NavLink to="../login">Login</NavLink>
    </>
  );
}
