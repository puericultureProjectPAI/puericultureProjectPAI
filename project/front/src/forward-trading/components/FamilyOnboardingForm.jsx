import { useState } from "react";
import { Formik, Form, FieldArray, Field } from "formik";
import * as Yup from "yup";
import { useSubmitFamilyProfile } from "../hooks/useSubmitFamilyProfile";
import { FormikInput } from "./FormikInput";
import { FormikCardRadioGroup } from "./FormikCardRadioGroup";
import { SuccessScreenOnBoarding } from "./SuccessScreenOnBoarding";
import { ProgressBar } from "./ProgressBar";
import headerImage from "../../assets/onboarding/header_onboarding.png";
import bottleIcon from "../../assets/onboarding/bottle-icon-brand.svg";
import plusIcon from "../../assets/onboarding/plus-icon-subtle-s.svg";
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

export const FamilyOnboardingForm = ({ onComplete }) => {
  const mutation = useSubmitFamilyProfile();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isSuccess, setIsSuccess] = useState(false);

  const initialValues = {
    familyStatus: "",
    dueDate: "",
    children: [{ name: "", birthDate: "", gender: "" }],
    futurePlans: "",
  };

  const getSteps = (status) => {
    const steps = [
      {
        id: "STATUS",
        title: "Faisons Connaissance...",
        subtitle:
          "Pour personnaliser vos recommendations, dites-nous en plus sur vous.",
      },
    ];
    if (status === "expecting" || status === "both") {
      steps.push({
        id: "PREGNANCY",
        title: "Felicitation  !",
        subtitle: "Quand est-ce que le bébé sera né ?",
      });
    }
    if (status === "parent" || status === "both") {
      steps.push({
        id: "CHILDREN",
        title: "Vos petits explorateurs",
        subtitle: "Nous voulons en savoir plus sur votre enfant !",
      });
    }
    if (status) {
      steps.push({
        id: "FUTURE",
        title: "Prévoyons l’avenir...",
        subtitle: "Prévoyez-vous d’agrandir votre famille ?",
      });
    }
    return steps;
  };

  const handleSubmit = (values, { setSubmitting }) => {
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

    // --- TEMPORAIRE : SIMULATION POUR CONTOURNER L'ERREUR 404 ---
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setIsSuccess(true);
      payload.children.forEach((child) => {
        console.log(
          `Enfant: ${child.name}, Né le: ${child.birthDate}, Genre: ${child.gender}`,
        );
      });
    }, 1000);

    /* --- REEL CODE API ---
    mutation.mutate(payload, {
      onSuccess: () => {
        setSubmitting(false);
        setIsSuccess(true);
      },
      onError: () => setSubmitting(false)
    });
    --------------------------------------------------------------------------*/
  };

  if (isSuccess) {
    return <SuccessScreenOnBoarding onComplete={onComplete} />;
  }

  return (
    <div className="w-full max-w-[430px] min-h-[932px] mx-auto bg-white inline-flex flex-col justify-start items-center gap-5 overflow-hidden font-figtree pb-10">
      <img src={successBg} alt="" className="sr-only" />
      {/* HEADER IMAGE */}
      <div className="self-stretch h-64 flex flex-col justify-end items-center overflow-hidden">
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
        {({
          values,
          isSubmitting,
          validateForm,
          setFieldTouched,
          setFieldValue,
          errors,
          touched,
        }) => {
          const steps = getSteps(values.familyStatus);
          const currentStep = steps[currentStepIndex];

          const handleNext = async (e) => {
            if (e) e.preventDefault();
            const stepErrors = await validateForm();
            let hasError = false;

            if (currentStep.id === "STATUS" && stepErrors.familyStatus) {
              hasError = true;
              setFieldTouched("familyStatus", true, false);
            }
            if (currentStep.id === "PREGNANCY" && stepErrors.dueDate) {
              hasError = true;
              setFieldTouched("dueDate", true, false);
            }
            if (currentStep.id === "CHILDREN" && stepErrors.children) {
              hasError = true;
              setFieldTouched("children", true, false);

              if (Array.isArray(stepErrors.children)) {
                stepErrors.children.forEach((childErr, index) => {
                  if (childErr?.name)
                    setFieldTouched(`children.${index}.name`, true, false);
                  if (childErr?.birthDate)
                    setFieldTouched(`children.${index}.birthDate`, true, false);
                  if (childErr?.gender)
                    setFieldTouched(`children.${index}.gender`, true, false);
                });
              }
            }
            if (currentStep.id === "FUTURE" && stepErrors.futurePlans) {
              hasError = true;
              setFieldTouched("futurePlans", true, false);
            }

            if (!hasError) {
              setCurrentStepIndex((prev) => prev + 1);
            }
          };

          return (
            <Form className="w-full flex flex-col items-center flex-1">
              {/* PROGRESS BAR */}
              <ProgressBar currentStep={currentStepIndex + 1} totalSteps={4} />

              {/* TITLE */}
              <div className="self-stretch py-4 inline-flex justify-center items-center gap-2.5 overflow-hidden">
                <div className="justify-start text-text-brand text-3xl font-bold font-figtree text-center">
                  {currentStep.title}
                </div>
              </div>
              <div className="w-full px-4 text-center justify-start text-text-brand text-base font-medium font-figtree mb-6">
                {currentStep.subtitle}
              </div>

              {/* STEP CONTENT */}
              <div className="w-full flex flex-col justify-start items-center gap-5 overflow-hidden">
                {currentStep.id === "STATUS" && (
                  <FormikCardRadioGroup
                    name="familyStatus"
                    showIcon={true}
                    options={[
                      {
                        value: "expecting",
                        label: "J'attends un heureux événement",
                        icon: bottleIcon,
                      },
                      {
                        value: "parent",
                        label: "Je suis déjà parent",
                        icon: bottleIcon,
                      },
                      { value: "both", label: "Les deux", icon: bottleIcon },
                    ]}
                    onSelect={(value) => {
                      setFieldValue("familyStatus", value);
                      setCurrentStepIndex((prev) => prev + 1);
                    }}
                  />
                )}

                {currentStep.id === "PREGNANCY" && (
                  <FormikInput
                    label="Date de naissance"
                    name="dueDate"
                    type="date"
                    placeholder="JJ/MM/AAAA"
                  />
                )}

                {currentStep.id === "CHILDREN" && (
                  <div className="w-full flex flex-col justify-start items-center overflow-hidden">
                    <FieldArray name="children">
                      {({ push, remove }) => (
                        <div className="w-full flex flex-col items-center">
                          {values.children.map((child, index) => (
                            <div
                              key={index}
                              className="w-full flex flex-col items-center gap-2 pb-0"
                            >
                              {/* Radio Fille/Garçon Inline */}
                              <div className="w-80 p-2.5 inline-flex justify-start items-start gap-5 overflow-hidden">
                                {["girl", "boy"].map((gender) => {
                                  const isSelected =
                                    values.children[index]?.gender === gender;
                                  return (
                                    <label
                                      key={gender}
                                      className="p-2.5 flex justify-start items-center gap-2.5 overflow-hidden cursor-pointer group"
                                    >
                                      <Field
                                        type="radio"
                                        name={`children.${index}.gender`}
                                        value={gender}
                                        className="sr-only"
                                      />

                                      {/* Le design du bouton radio calqué sur la maquette (Cercle 24px avec anneau interne 20px) */}
                                      <div
                                        className={`size-6 rounded-full outline outline-1 outline-offset-[-1px] inline-flex justify-center items-center transition-colors ${
                                          isSelected
                                            ? "outline-bg-brand"
                                            : "outline-feedback-border-brand group-hover:outline-bg-brand"
                                        }`}
                                      >
                                        {isSelected && (
                                          <div className="size-5 bg-bg-brand rounded-full animate-in zoom-in-50 duration-200" />
                                        )}
                                      </div>

                                      <div className="text-center justify-start text-text-brand text-base font-normal font-figtree">
                                        {gender === "girl" ? "Fille" : "Garçon"}
                                      </div>
                                    </label>
                                  );
                                })}
                              </div>

                              <div className="w-full flex flex-col -space-y-3">
                                <FormikInput
                                  label="Prénom / Surnom"
                                  name={`children.${index}.name`}
                                  placeholder="Prénom / Surnom"
                                />
                                <FormikInput
                                  label="Sa date de naissance"
                                  name={`children.${index}.birthDate`}
                                  type="date"
                                  placeholder="Date"
                                />
                              </div>

                              {values.children.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => remove(index)}
                                  className="text-red-500 font-medium text-sm mt-1 mb-2"
                                >
                                  Retirer cet enfant
                                </button>
                              )}
                            </div>
                          ))}

                          <div className="w-full px-2 flex flex-col justify-center items-center mt-4">
                            <div className="w-full border-t border-gray-200"></div>

                            <button
                              type="button"
                              onClick={() =>
                                push({ name: "", birthDate: "", gender: "" })
                              }
                              className="w-80 py-4 inline-flex justify-start items-center gap-5"
                            >
                              <img
                                src={plusIcon}
                                alt="Ajouter"
                                className="w-5 h-5"
                              />
                              <div className="text-center justify-start text-feedback-text-subtle text-base font-normal font-figtree">
                                Ajouter un enfant
                              </div>
                            </button>

                            <div className="w-full border-t border-gray-200"></div>

                            {typeof errors?.children === "string" &&
                              touched.children && (
                                <div className="text-feedback-text-brand bg-feedback-background-alert p-2 rounded mt-3 w-80 text-center">
                                  {errors.children}
                                </div>
                              )}
                          </div>
                        </div>
                      )}
                    </FieldArray>
                  </div>
                )}

                {currentStep.id === "FUTURE" && (
                  <FormikCardRadioGroup
                    name="futurePlans"
                    showIcon={false}
                    options={[
                      { value: "yes", label: "Oui, c'est prévu" },
                      { value: "no", label: "Non, la famille est au complet" },
                      { value: "undecided", label: "Je ne sais pas" },
                    ]}
                  />
                )}
              </div>

              <div className="w-full pt-6 flex flex-col justify-center items-center gap-6 overflow-hidden">
                {currentStep.id !== "STATUS" ? (
                  currentStepIndex < steps.length - 1 ? (
                    <button
                      type="button"
                      onClick={handleNext}
                      className="w-80 h-10 p-2 bg-bg-brand rounded-lg inline-flex justify-center items-center gap-2.5 overflow-hidden"
                    >
                      <div className="text-center justify-start text-feedback-text-inverse text-base font-semibold font-figtree">
                        Suivant
                      </div>
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={isSubmitting || mutation.isPending}
                      className="w-80 h-10 p-2 bg-bg-brand rounded-lg inline-flex justify-center items-center gap-2.5 overflow-hidden disabled:opacity-50"
                    >
                      <div className="text-center justify-start text-feedback-text-inverse text-base font-semibold font-figtree">
                        {mutation.isPending ? "Traitement..." : "Suivant"}
                      </div>
                    </button>
                  )
                ) : (
                  <div className="w-80 h-10"></div>
                )}

                {currentStepIndex > 0 ? (
                  <button
                    type="button"
                    onClick={() => setCurrentStepIndex((prev) => prev - 1)}
                    className="w-80 p-2 rounded-lg inline-flex justify-center items-end gap-2.5 overflow-hidden"
                  >
                    <div className="text-center justify-start text-feedback-text-subtle text-base font-normal font-figtree">
                      Retour
                    </div>
                  </button>
                ) : (
                  <div className="w-80 p-2 h-10"></div>
                )}
              </div>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
};
