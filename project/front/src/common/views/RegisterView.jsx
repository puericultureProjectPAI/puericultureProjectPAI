import { useFormik } from "formik";
import * as Yup from "yup";

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
  const formik = useFormik({
    initialValues: {
      lastName: "",
      firstName: "",
      birthDate: "",
      email: "",
      password: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      onSubmit(values);
    },
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <div>
        <input
          type="text"
          name="lastName"
          placeholder="Nom"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.lastName}
        />
        {formik.touched.lastName && formik.errors.lastName && (
          <div>{formik.errors.lastName}</div>
        )}
      </div>

      <div>
        <input
          type="text"
          name="firstName"
          placeholder="Prénom"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.firstName}
        />
        {formik.touched.firstName && formik.errors.firstName && (
          <div>{formik.errors.firstName}</div>
        )}
      </div>

      <div>
        <input
          type="date"
          name="birthDate"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.birthDate}
        />
        {formik.touched.birthDate && formik.errors.birthDate && (
          <div>{formik.errors.birthDate}</div>
        )}
      </div>

      <div>
        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.email}
        />
        {formik.touched.email && formik.errors.email && (
          <div>{formik.errors.email}</div>
        )}
      </div>

      <div>
        <input
          type="password"
          name="password"
          placeholder="Mot de passe"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.password}
        />
        {formik.touched.password && formik.errors.password && (
          <div>{formik.errors.password}</div>
        )}
      </div>

      <button type="submit" disabled={isLoading || !formik.isValid}>
        {isLoading ? "Inscription en cours..." : "S'inscrire"}
      </button>
    </form>
  );
}
