import { Form, Formik } from "formik";
import { useState } from "react";
import * as Yup from "yup";
import ModeSelectionStep from "./ModeSelectionStep.jsx";
import OptionalProductInfoStep from "./OptionalProductInfoStep.jsx";
import PublicationFormActions from "./PublicationFormActions.jsx";
import PublicationMobileShell from "./PublicationMobileShell.jsx";
import RequiredProductInfoStep from "./RequiredProductInfoStep.jsx";
import TrocSpecificStep from "./TrocSpecificStep.jsx";
import SecondHandSpecificStep from "../../../../second-hand/components/SecondHandSpecificStep.jsx";
import LeasingSpecificStep from "../../../../leasing/components/LeasingSpecificStep.jsx";

const initialValues = {
  mode: "TROC",
  images: [],
  title: "",
  description: "",
  category: "",
  city: "",
  condition: "",
  brand: "",
  model: "",
  dimensions: "",
  radius: "",
  wantedArticle: "",
  estimatedPrice: "",
  price: "",
  pricePerDay: "",
  pricePerMonth: "",
};

const validationSchemas = {
  1: Yup.object({
    mode: Yup.string().oneOf(["TROC", "SECOND_HAND", "LOCATION"]).required(),
  }),
  2: Yup.object({
    images: Yup.array().min(1, "Au moins une image est obligatoire"),
    title: Yup.string().required("Le nom de l'article est obligatoire"),
    description: Yup.string().required("La description est obligatoire"),
    category: Yup.string().required("La catégorie est obligatoire"),
    city: Yup.string().required("La ville est obligatoire"),
  }),
  3: Yup.object({}),
  4: Yup.object({
    estimatedPrice: Yup.number()
      .typeError("Le prix estimé doit être un nombre")
      .min(0, "Le prix estimé doit être positif")
      .when("mode", {
        is: "TROC",
        then: (schema) => schema.required("Le prix estimé est obligatoire"),
        otherwise: (schema) => schema.optional(),
      }),
    pricePerDay: Yup.number()
      .typeError("Le prix/jour doit être un nombre")
      .min(0, "Le prix/jour doit être positif")
      .when("mode", {
        is: "LOCATION",
        then: (schema) => schema.required("Le prix par jour est obligatoire"),
        otherwise: (schema) => schema.optional(),
      }),
    pricePerMonth: Yup.number()
      .typeError("Le prix/mois doit être un nombre")
      .min(0, "Le prix/mois doit être positif")
      .when("mode", {
        is: "LOCATION",
        then: (schema) => schema.required("Le prix par mois est obligatoire"),
        otherwise: (schema) => schema.optional(),
      }),
  }),
  5: Yup.object({}),
};

export default function PublishAnnouncementForm({ error, onSubmit, success }) {
  const [step, setStep] = useState(1);

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchemas[step]}
      onSubmit={async (values, helpers) => {
        const payload = {
          title: values.title,
          description: values.description,
          estimatedPrice: Number(values.estimatedPrice),
          images: values.images,
          price: values.price ? Number(values.price) : 0,
          city: values.city,
          category: values.category,
          condition: values.condition,
        };

        const isCreated = await onSubmit(values.mode, payload);
        if (isCreated) {
          helpers.resetForm();
          setStep(1);
        }
        helpers.setSubmitting(false);
      }}
    >
      {({ isSubmitting, setFieldValue, setTouched, validateForm, values }) => (
        <PublicationMobileShell
          currentStep={step}
          error={error}
          success={success}
        >
          <Form>
            {step === 1 && <ModeSelectionStep setFieldValue={setFieldValue} />}
            {step === 2 && <RequiredProductInfoStep />}
            {step === 3 && <OptionalProductInfoStep />}
            {step === 4 && values.mode === "TROC" && <TrocSpecificStep />}
            {step === 4 && values.mode === "SECOND_HAND" && (
              <SecondHandSpecificStep />
            )}
            {step === 4 && values.mode === "LOCATION" && (
              <LeasingSpecificStep />
            )}
            <PublicationFormActions
              isSubmitting={isSubmitting}
              setStep={setStep}
              setTouched={setTouched}
              step={step}
              validateForm={validateForm}
              values={values}
            />
          </Form>
        </PublicationMobileShell>
      )}
    </Formik>
  );
}
