import { Form, Formik } from "formik";
import { useState } from "react";
import * as Yup from "yup";
import ModeSelectionStep from "./ModeSelectionStep.jsx";
import OptionalProductInfoStep from "./OptionalProductInfoStep.jsx";
import PublicationFormActions from "./PublicationFormActions.jsx";
import PublicationMobileShell from "./PublicationMobileShell.jsx";
import RequiredProductInfoStep from "./RequiredProductInfoStep.jsx";

const initialValues = {
  mode: "SECOND_HAND",
  images: [],
  title: "",
  description: "",
  category: "",
  city: "",
  condition: "",
  brand: "",
  model: "",
  dimensions: "",
  ageRange: "",
  maxWeightKg: "",
  lengthCm: "",
  widthCm: "",
  radius: "",
  wantedArticle: "",
  rentalStartDate: "",
  rentalEndDate: "",
  dailyPrice: "",
  estimatedPrice: "",
  price: "",
};

const priceSchema = Yup.number()
  .transform((value, originalValue) =>
    originalValue === "" || originalValue === null ? undefined : value,
  )
  .typeError("Le prix doit être un nombre")
  .min(0, "Le prix doit être positif");

const validationSchemas = {
  1: Yup.object({
    mode: Yup.string().oneOf(["TROC", "SECOND_HAND", "LOCATION"]).required(),
  }),
  2: Yup.object({
    images: Yup.array().min(1, "Une image est obligatoire"),
    title: Yup.string().required("Le nom de l'article est obligatoire"),
    description: Yup.string().required("La description est obligatoire"),
    category: Yup.string().required("La catégorie est obligatoire"),
    condition: Yup.string().required("L’état est obligatoire"),
  }),
  3: Yup.object({
    rentalStartDate: Yup.string().when("mode", {
      is: "LOCATION",
      then: (schema) => schema.required("La date de début est obligatoire"),
      otherwise: (schema) => schema.notRequired(),
    }),
    rentalEndDate: Yup.string().when("mode", {
      is: "LOCATION",
      then: (schema) => schema.required("La date de fin est obligatoire"),
      otherwise: (schema) => schema.notRequired(),
    }),
    dailyPrice: priceSchema.when("mode", {
      is: "LOCATION",
      then: (schema) => schema.required("Le prix par jour est obligatoire"),
      otherwise: (schema) => schema.notRequired(),
    }),
    estimatedPrice: priceSchema.when("mode", {
      is: "TROC",
      then: (schema) => schema.required("Le prix estimé est obligatoire"),
      otherwise: (schema) => schema.notRequired(),
    }),
    price: priceSchema.when("mode", {
      is: "SECOND_HAND",
      then: (schema) => schema.required("Le prix est obligatoire"),
      otherwise: (schema) => schema.notRequired(),
    }),
  }),
};

export default function PublishAnnouncementForm({ error, onSubmit, success }) {
  const [step, setStep] = useState(1);

  const goBack = () => {
    if (step > 1) {
      setStep(step - 1);
      return;
    }

    window.history.back();
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchemas[step]}
      onSubmit={async (values, helpers) => {
        const payload = {
          title: values.title,
          description: values.description,
          estimatedPrice: Number(
            values.dailyPrice || values.estimatedPrice || 0,
          ),
          images: values.images,
          price: values.price ? Number(values.price) : 0,
          city: values.city,
          category: values.category,
          condition: values.condition,
          brand: values.brand,
          minAgeMonths: parseInt(values.ageRange.split("-")[0]),
          maxAgeMonths: parseInt(values.ageRange.split("-")[1]),
          maxWeightKg: parseInt(values.maxWeightKg.split("-")[1]),
          dimensions:
            (values.lengthCm ? values.lengthCm : "") +
            (values.lengthCm && values.widthCm ? "x" : "") +
            (values.widthCm ? values.widthCm : "") +
            (values.lengthCm || values.widthCm ? "cm" : ""),
          rentalStartDate: values.rentalStartDate,
          rentalEndDate: values.rentalEndDate,
          dailyPrice: values.dailyPrice ? Number(values.dailyPrice) : 0,
        };

        const isCreated = await onSubmit(values.mode, payload);
        if (isCreated) {
          helpers.resetForm();
          setStep(1);
        }
        helpers.setSubmitting(false);
      }}
    >
      {({ isSubmitting, setTouched, validateForm, values }) => (
        <PublicationMobileShell
          currentStep={step}
          error={error}
          onBack={goBack}
          success={success}
        >
          <Form>
            {step === 1 && <ModeSelectionStep />}
            {step === 2 && <RequiredProductInfoStep />}
            {step === 3 && <OptionalProductInfoStep />}
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
