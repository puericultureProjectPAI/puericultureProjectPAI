import { useState } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { SuccessScreenOnBoarding } from "./SuccessScreenOnBoarding";
import { ProgressBar } from "./ProgressBar";
import { StatusStep } from "./stepFormOnBoarding/StatusStep";
import { PregnancyStep } from "./stepFormOnBoarding/PregnancyStep";
import { ChildrenStep } from "./stepFormOnBoarding/ChildrenStep";
import { FutureStep } from "./stepFormOnBoarding/FutureStep";
import { createOnBoarding } from "../services/onBoardingServices";
import headerImage from "../../assets/onboarding/header_onboarding.png";
import successBg from "../../assets/onboarding/success_onboarding.png";

const validationSchema = Yup.object().shape({
  familyStatus: Yup.string().required("Veuillez sélectionner votre situation."),
  dueDate: Yup.string().when("familyStatus", {
    is: (val) => val === "expecting" || val === "both",
    then: (schema) => schema.required("Veuillez renseigner une date valide."),
    otherwise: (schema) => schema.nullable(),
  }),
  children: Yup.array().when("familyStatus", {
    is: (val) => val === "parent" || val === "both",
    then: (schema) =>
      schema
        .of(
          Yup.object().shape({
            name: Yup.string().required("Prénom requis"),
            birthDate: Yup.date().required("Date requise"),
            gender: Yup.string()
              .oneOf(["girl", "boy"])
              .required("Genre requis"),
          }),
        )
        .min(1, "Ajoutez au moins un enfant."),
    otherwise: (schema) => schema.nullable(),
  }),
  futurePlans: Yup.string().required("Veuillez répondre à cette question."),
});

const STEP_DEFINITIONS = [
  {
    id: "STATUS",
    title: "Faisons connaissance...",
    subtitle:
      "Pour personnaliser vos recommandations, dites-nous en plus sur vous.",
    condition: () => true,
    component: (extraProps) => <StatusStep {...extraProps} />,
  },
  {
    id: "PREGNANCY",
    title: "Félicitations !",
    subtitle: "Quand est-ce que le bébé sera né ?",
    condition: (status) => status === "expecting" || status === "both",
    component: () => <PregnancyStep />,
  },
  {
    id: "CHILDREN",
    title: "Vos petits explorateurs",
    subtitle: "Nous voulons en savoir plus sur votre enfant !",
    condition: (status) => status === "parent" || status === "both",
    component: () => <ChildrenStep />,
  },
  {
    id: "FUTURE",
    title: "Prévoyons l'avenir...",
    subtitle: "Prévoyez-vous d'agrandir votre famille ?",
    condition: (status) => !!status,
    component: () => <FutureStep />,
  },
];

const getActiveSteps = (familyStatus) =>
  STEP_DEFINITIONS.filter((step) => step.condition(familyStatus));

const getFieldsForStep = (stepId) =>
  ({
    STATUS: ["familyStatus"],
    PREGNANCY: ["dueDate"],
    CHILDREN: ["children"],
    FUTURE: ["futurePlans"],
  })[stepId] ?? [];

export const FamilyOnboardingForm = ({ onComplete }) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const initialValues = {
    familyStatus: "",
    dueDate: "",
    children: [{ name: "", birthDate: "", gender: "" }],
    futurePlans: "",
  };

  const handleSubmit = async (values) => {
    const isExpecting =
      values.familyStatus === "expecting" || values.familyStatus === "both";
    const isParent =
      values.familyStatus === "parent" || values.familyStatus === "both";

    const payload = {
      familyStatus: values.familyStatus,
      dueDate: isExpecting ? values.dueDate : null,
      children: isParent ? values.children : [],
      futurePlans: values.futurePlans,
    };

    setIsSubmitting(true);
    try {
      await createOnBoarding(payload);
      setIsSuccess(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) return <SuccessScreenOnBoarding onComplete={onComplete} />;

  return (
    <div className="w-full min-h-screen bg-white flex flex-col font-figtree pb-10">
      <img src={successBg} alt="" className="sr-only" />

      <div className="w-full h-64 flex flex-col justify-end items-center overflow-hidden shrink-0">
        <img
          className="w-full h-80 object-cover"
          src={headerImage}
          alt="Poussette"
        />
      </div>

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ values, validateForm, setFieldTouched, setFieldValue }) => {
          const steps = getActiveSteps(values.familyStatus);
          const currentStep = steps[currentStepIndex];
          const isLastStep = currentStepIndex === steps.length - 1;

          const handleNext = async (e) => {
            if (e) e.preventDefault();
            const errors = await validateForm();
            const fields = getFieldsForStep(currentStep.id);
            const hasError = fields.some((field) => errors[field]);

            if (hasError) {
              fields.forEach((field) => setFieldTouched(field, true, false));
              if (
                currentStep.id === "CHILDREN" &&
                Array.isArray(errors.children)
              ) {
                errors.children.forEach((childErr, i) => {
                  if (childErr?.name)
                    setFieldTouched(`children.${i}.name`, true, false);
                  if (childErr?.birthDate)
                    setFieldTouched(`children.${i}.birthDate`, true, false);
                  if (childErr?.gender)
                    setFieldTouched(`children.${i}.gender`, true, false);
                });
              }
              return;
            }
            setCurrentStepIndex((prev) => prev + 1);
          };

          const handleStatusSelect = (value) => {
            setFieldValue("familyStatus", value);
            setCurrentStepIndex((prev) => prev + 1);
          };

          const extraProps =
            currentStep.id === "STATUS" ? { onSelect: handleStatusSelect } : {};

          return (
            <Form className="w-full flex flex-col px-6">
              <div className="py-4">
                <ProgressBar
                  currentStep={currentStepIndex + 1}
                  totalSteps={4}
                />
              </div>

              <div className="text-text-brand text-3xl font-bold font-figtree text-center mb-3">
                {currentStep.title}
              </div>
              <div className="text-center text-text-brand text-base font-medium font-figtree mb-6">
                {currentStep.subtitle}
              </div>

              <div className="w-full flex flex-col items-center gap-5">
                {currentStep.component(extraProps)}
              </div>

              <div className="w-full pt-6 flex flex-col items-center gap-4">
                {currentStep.id !== "STATUS" &&
                  (isLastStep ? (
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full h-10 p-2 bg-bg-brand rounded-lg flex justify-center items-center disabled:opacity-50"
                    >
                      <span className="text-feedback-text-inverse text-base font-semibold font-figtree">
                        {isSubmitting ? "Traitement..." : "Suivant"}
                      </span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleNext}
                      className="w-full h-10 p-2 bg-bg-brand rounded-lg flex justify-center items-center"
                    >
                      <span className="text-feedback-text-inverse text-base font-semibold font-figtree">
                        Suivant
                      </span>
                    </button>
                  ))}

                {currentStepIndex > 0 && (
                  <button
                    type="button"
                    onClick={() => setCurrentStepIndex((prev) => prev - 1)}
                    className="w-full p-2 rounded-lg flex justify-center items-center"
                  >
                    <span className="text-feedback-text-subtle text-base font-normal font-figtree">
                      Retour
                    </span>
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
