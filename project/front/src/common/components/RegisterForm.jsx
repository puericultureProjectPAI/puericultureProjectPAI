import { useState } from "react";
import { Formik, Form, useField } from "formik";
import logoKiabi from "../../assets/comm-logo-complet-brand.svg";
import * as Yup from "yup";

// --- Sous-composant Input (Modifié pour pouvoir masquer la bordure verte à l'étape 2) ---
const MyTextInput = ({
  label,
  required,
  showSuccessBorder = true,
  ...props
}) => {
  const [field, meta] = useField(props);
  const isError = meta.touched && meta.error;
  const isSuccess = meta.touched && !meta.error && field.value;

  return (
    <div className="flex flex-col mb-4 font-figtree">
      <label className="text-sm font-medium text-neutral mb-1">
        {label}{" "}
        {required && (
          <span className="text-feedback-background-alert-bold">*</span>
        )}
      </label>
      <input
        {...field}
        {...props}
        className={`border rounded-lg p-3 outline-none transition-colors ${
          isError
            ? "border-feedback-background-alert-bold focus:border-feedback-background-alert-bold"
            : isSuccess && showSuccessBorder
              ? "border-feedback-background-success-bold focus:border-feedback-background-success-bold"
              : "border-subtle focus:border-neutral"
        }`}
      />
    </div>
  );
};

// --- Schémas de validation séparés ---
const step1Schema = Yup.object({
  email: Yup.string().email("Format invalide.").required("L'email est requis."),
  password: Yup.string()
    .min(8, "Au moins 8 caractères.")
    .matches(/[A-Z]/, "Au moins une majuscule.")
    .matches(/[0-9]/, "Au moins un chiffre.")
    .matches(/[!@#$%^&*(),.?":{}|<>]/, "Au moins un caractère spécial.")
    .required("Le mot de passe est requis."),
  confirmPassword: Yup.string()
    .oneOf(
      [Yup.ref("password"), null],
      "Les mots de passe ne correspondent pas.",
    )
    .required("La confirmation est requise."),
});

const step2Schema = Yup.object({
  lastName: Yup.string().required("Le nom est requis."),
  firstName: Yup.string().required("Le prénom est requis."),
  pseudo: Yup.string().required("Le pseudo est requis."),
  // Retrait de .required() car pas d'astérisque sur la maquette
  birthDate: Yup.date()
    .max(new Date(), "La date doit être dans le passé.")
    .nullable(),
});

export default function RegisterForm({ onSubmit, isLoading }) {
  const [step, setStep] = useState(1);

  const currentValidationSchema = step === 1 ? step1Schema : step2Schema;

  const handleNextStep = async (validateForm, setTouched) => {
    const errors = await validateForm();
    if (Object.keys(errors).length === 0) {
      setStep(2);
    } else {
      setTouched({ email: true, password: true, confirmPassword: true });
    }
  };

  return (
    <Formik
      initialValues={{
        email: "",
        password: "",
        confirmPassword: "",
        firstName: "",
        lastName: "",
        pseudo: "",
        birthDate: "",
      }}
      validationSchema={currentValidationSchema}
      validateOnMount={true}
      onSubmit={(values) => onSubmit(values)}
    >
      {({ values, validateForm, setTouched, isValid, dirty }) => {
        const pwd = values.password;
        const pwdReqs = [
          {
            label: "Mot de passe contient au minimum 8 caractères",
            valid: pwd.length >= 8,
          },
          {
            label: "Mot de passe contient au moins 1 majuscule",
            valid: /[A-Z]/.test(pwd),
          },
          {
            label: "Mot de passe contient au moins 1 caractère spécial",
            valid: /[!@#$%^&*(),.?":{}|<>]/.test(pwd),
          },
          {
            label: "Mot de passe contient au moins 1 chiffre",
            valid: /[0-9]/.test(pwd),
          },
        ];

        return (
          <Form className="flex flex-col w-full max-w-md mx-auto bg-white p-6 rounded-xl font-figtree [&_label]:text-color-brand">
            <div className="flex justify-center mb-8">
              <img src={logoKiabi} alt="Logo Kiabi" className="h-12 w-auto" />
            </div>

            <h2 className="text-xl font-bold text-center text-color-brand mb-6">
              {step === 1
                ? "Créez votre compte en quelques étapes."
                : "Vos informations"}
            </h2>

            {/* ÉTAPE 1 (Je n'y ai pas touché) */}
            {step === 1 && (
              <div className="flex flex-col gap-2">
                <MyTextInput
                  label="E-mail"
                  name="email"
                  type="email"
                  placeholder="example@kiabi.com"
                />
                <MyTextInput
                  label="Mot de passe"
                  name="password"
                  type="password"
                  placeholder="******"
                />

                <ul className="text-xs flex flex-col gap-1.5 mb-4">
                  {pwdReqs.map((req, idx) => {
                    const isPristine = pwd.length === 0;

                    let iconClass = "w-4 h-4 ";
                    let IconPath;

                    if (isPristine) {
                      iconClass += "text-subtle";
                      IconPath = (
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      );
                    } else if (req.valid) {
                      iconClass += "text-feedback-background-success-bold";
                      IconPath = (
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      );
                    } else {
                      iconClass += "text-feedback-background-alert-bold";
                      IconPath = (
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      );
                    }

                    return (
                      <li key={idx} className="flex items-center gap-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="1.5"
                          stroke="currentColor"
                          className={iconClass}
                        >
                          {IconPath}
                        </svg>
                        <span className="text-subtle">{req.label}</span>
                      </li>
                    );
                  })}
                </ul>

                <MyTextInput
                  label="Confirmation du mot de passe"
                  name="confirmPassword"
                  type="password"
                  placeholder="******"
                />

                <button
                  type="button"
                  disabled={!isValid}
                  onClick={() => handleNextStep(validateForm, setTouched)}
                  className="w-full mt-4 bg-color-brand text-white py-3 rounded-lg font-semibold hover:opacity-90 transition-all disabled:bg-feedback-background-neutral-bold-low"
                >
                  Continuer
                </button>
              </div>
            )}

            {/* ÉTAPE 2 (Modifiée pour correspondre à la maquette) */}
            {step === 2 && (
              <div className="flex flex-col gap-2">
                <MyTextInput
                  label="Prénom"
                  name="firstName"
                  type="text"
                  placeholder="Antoine"
                  required
                  showSuccessBorder={false}
                />
                <MyTextInput
                  label="Nom"
                  name="lastName"
                  type="text"
                  placeholder="Dupont"
                  required
                  showSuccessBorder={false}
                />
                <MyTextInput
                  label="Pseudo"
                  name="pseudo"
                  type="text"
                  placeholder="a_dupont9"
                  required
                  showSuccessBorder={false}
                />
                <div
                  className={
                    !values.birthDate
                      ? "[&_input]:text-subtle"
                      : "[&_input]:text-color-brand"
                  }
                >
                  <MyTextInput
                    label="Date de naissance"
                    name="birthDate"
                    type="date"
                    showSuccessBorder={false}
                  />
                </div>

                {!isValid && dirty && (
                  <div className="text-feedback-background-alert-bold text-center text-sm my-2">
                    Certains champs sont incomplets
                  </div>
                )}

                <button
                  type="submit"
                  type="submit"
                  disabled={
                    isLoading ||
                    !isValid ||
                    !values.firstName ||
                    !values.lastName ||
                    !values.pseudo
                  }
                  className="w-full mt-2 bg-color-brand text-white py-3 rounded-lg font-semibold hover:opacity-90 transition-all disabled:bg-feedback-background-neutral-bold-low"
                >
                  {isLoading ? "Création..." : "Créer mon compte"}
                </button>
              </div>
            )}
          </Form>
        );
      }}
    </Formik>
  );
}
