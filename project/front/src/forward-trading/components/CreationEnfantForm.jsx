import { useState } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import headerImage from "../../assets/onboarding/header_onboarding.png";

// Imports de tes sous-composants
import { StatusStep } from "../components/stepFormOnChildCreation/StatusStep";
import { GrossesseStep } from "../components/stepFormOnChildCreation/GrossesseStep";
import { DetailsStep } from "../components/stepFormOnChildCreation/DetailsStep";

// FONCTION UTILITAIRE POUR SÉCURISER LE PARSING DE LA DATE
// Un input type="date" renvoie YYYY-MM-DD, mais si un jour tu utilises un masque de texte DD/MM/YYYY, ça marchera aussi !
const parseSafeDate = (value) => {
  if (!value) return null;
  if (value.includes("-")) {
    return new Date(value);
  }
  if (value.includes("/")) {
    const parts = value.split("/");
    if (parts.length === 3)
      return new Date(`${parts[2]}-${parts[1]}-${parts[0]}T00:00:00`);
  }
  return new Date(value);
};

// SCHEMA DE VALIDATION YUP MIS À JOUR
const creationEnfantSchema = Yup.object().shape({
  statut: Yup.string().required("Veuillez sélectionner une option."),

  dpa: Yup.string().when("statut", {
    is: "grossesse",
    then: (schema) =>
      schema
        .required("Veuillez renseigner une date valide")
        .test(
          "is-future",
          "La date prévue doit être dans le futur",
          (value) => {
            const date = parseSafeDate(value);
            if (!date || isNaN(date.getTime())) return false; // Stoppe si la date est invalide

            const today = new Date();
            today.setHours(0, 0, 0, 0); // On compare uniquement la date, on ignore l'heure

            return date >= today;
          },
        ),
    otherwise: (schema) => schema.nullable(),
  }),

  genre: Yup.string().required("Le genre est requis"),
  prenom: Yup.string().required("Le prénom est requis"),

  dateNaissance: Yup.string().when("statut", {
    is: "parent",
    then: (schema) =>
      schema
        .required("Veuillez renseigner la date de naissance")
        .test("is-past", "La date ne peut pas être dans le futur", (value) => {
          const date = parseSafeDate(value);
          if (!date || isNaN(date.getTime())) return false;

          const today = new Date();
          return date <= today;
        })
        .test(
          "max-24-months",
          "L'enfant doit avoir moins de 24 mois",
          (value) => {
            const date = parseSafeDate(value);
            if (!date || isNaN(date.getTime())) return false;

            const limitDate = new Date();
            limitDate.setMonth(limitDate.getMonth() - 24); // Calcule la date exacte d'il y a 2 ans

            return date >= limitDate;
          },
        ),
    otherwise: (schema) => schema.nullable(),
  }),
});

// DEFINITION DES ETAPES (Renommé)
const CREATION_ENFANT_STEPS = [
  {
    id: "STATUT",
    title: "Votre enfant...",
    subtitle:
      "Pour personnaliser vos recommandations, dites-nous en plus sur vous.",
    condition: () => true, // Toujours affiché en premier
    component: (extraProps) => <StatusStep {...extraProps} />,
    buttonLabel: null, // Pas de bouton "Suivant", on avance au clic
  },
  {
    id: "GROSSESSE",
    title: "Félicitation !",
    subtitle: "Quand est-ce que le bébé sera né ?",
    condition: (statut) => statut === "grossesse",
    component: () => <GrossesseStep />,
    buttonLabel: "Suivant",
  },
  {
    id: "DETAILS",
    title: "Quelques détails en plus",
    subtitle: "Nous voulons en savoir plus sur votre enfant !",
    condition: (statut) => !!statut, // Affiché s'il a choisi un statut
    component: () => <DetailsStep />,
    buttonLabel: "Ajouter mon enfant",
  },
];

// FONCTIONS UTILITAIRES (Renommées)
const getActiveCreationSteps = (statut) =>
  CREATION_ENFANT_STEPS.filter((step) => step.condition(statut));

const getCreationFieldsForStep = (stepId) =>
  ({
    STATUT: ["statut"],
    GROSSESSE: ["dpa"],
    DETAILS: ["genre", "prenom", "dateNaissance"],
  })[stepId] ?? [];

export const CreationEnfantForm = ({ onSubmitComplete }) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const initialValues = {
    statut: "",
    dpa: "",
    genre: "",
    prenom: "",
    dateNaissance: "",
  };

  const handleSubmit = async (values) => {
    setIsSubmitting(true);
    try {
      // Nettoyage des données selon le statut avant l'envoi API
      const payload = {
        statut: values.statut,
        genre: values.genre,
        prenom: values.prenom,
        date: values.statut === "grossesse" ? values.dpa : values.dateNaissance,
      };

      if (onSubmitComplete) await onSubmitComplete(payload);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto w-full min-h-screen bg-base flex flex-col font-figtree pb-10">
      {/* IMAGE D'EN-TÊTE FIXE */}
      <div className="w-full h-64 flex flex-col justify-end items-center overflow-hidden shrink-0">
        <img
          className="w-full h-80 object-cover"
          src={headerImage}
          alt="Poussette"
        />
      </div>

      <Formik
        initialValues={initialValues}
        validationSchema={creationEnfantSchema}
        onSubmit={handleSubmit}
      >
        {({ values, validateForm, setFieldTouched, setFieldValue }) => {
          const steps = getActiveCreationSteps(values.statut);
          const currentStep = steps[currentStepIndex];
          const isLastStep = currentStepIndex === steps.length - 1;

          let progressPercent = 0;
          if (currentStepIndex > 0) {
            // On calcule le pourcentage dynamiquement en fonction du parcours choisi
            progressPercent = (currentStepIndex / (steps.length - 1)) * 100;
          }

          const handleNext = async (e) => {
            if (e) e.preventDefault();
            const errors = await validateForm();
            const fields = getCreationFieldsForStep(currentStep.id);
            const hasError = fields.some((field) => errors[field]);

            if (hasError) {
              fields.forEach((field) => setFieldTouched(field, true, false));
              return;
            }
            setCurrentStepIndex((prev) => prev + 1);
          };

          const handleStatusSelect = (value) => {
            setFieldValue("statut", value);
            setCurrentStepIndex((prev) => prev + 1);
          };

          const extraProps =
            currentStep.id === "STATUT" ? { onSelect: handleStatusSelect } : {};

          return (
            <Form className="w-full flex flex-col flex-grow px-6">
              {/* BARRE DE PROGRESSION AVEC ESPACEMENT */}
              <div className="pt-8 w-full shrink-0 flex">
                <div className="w-full h-1 bg-feedback-background-neutral rounded-full flex">
                  <div
                    className="h-full bg-feedback-background-service rounded-full transition-all duration-300"
                    style={{ width: `${progressPercent}%` }}
                  ></div>
                </div>
              </div>

              {/* CONTENEUR DES TEXTES ET CHAMPS AVEC FLEX-GROW POUR REPOUSSER LES BOUTONS EN BAS */}
              <div className="mt-10 flex flex-col flex-grow">
                {/* TITRE & SOUS-TITRE */}
                <h1 className="text-[32px] font-bold text-text-brand text-center leading-tight">
                  {currentStep.title}
                </h1>
                <p className="text-[16px] text-text-brand text-center mt-6 px-2">
                  {currentStep.subtitle}
                </p>

                {/* CONTENU DE L'ÉTAPE */}
                <div className="w-full flex flex-col items-center gap-5 mt-10">
                  {currentStep.component(extraProps)}
                </div>
              </div>

              {/* ZONE DES BOUTONS */}
              <div className="w-full pt-6 mt-auto flex flex-col items-center gap-4">
                {currentStep.buttonLabel &&
                  (isLastStep ? (
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-bg-brand text-feedback-text-inverse font-bold py-3.5 rounded-md hover:bg-opacity-90 transition-all disabled:opacity-50"
                    >
                      {isSubmitting
                        ? "Création en cours..."
                        : currentStep.buttonLabel}
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleNext}
                      className="w-full bg-bg-brand text-feedback-text-inverse font-bold py-3.5 rounded-md hover:bg-opacity-90 transition-all"
                    >
                      {currentStep.buttonLabel}
                    </button>
                  ))}

                {/* BOUTON RETOUR */}
                {currentStepIndex > 0 && (
                  <button
                    type="button"
                    onClick={() => setCurrentStepIndex((prev) => prev - 1)}
                    className="w-full text-center text-subtle text-sm mt-2 mb-2 hover:underline"
                  >
                    Retour
                  </button>
                )}
              </div>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
};
