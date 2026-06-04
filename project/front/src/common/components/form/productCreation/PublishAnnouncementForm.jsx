import { Form, Formik } from "formik";
import { useState } from "react";
import * as Yup from "yup";
import ModeSelectionStep from "./ModeSelectionStep.jsx";
import OptionalProductInfoStep from "./OptionalProductInfoStep.jsx";
import PublicationFormActions from "./PublicationFormActions.jsx";
import PublicationMobileShell from "./PublicationMobileShell.jsx";
import RequiredProductInfoStep from "./RequiredProductInfoStep.jsx";
import TrocSpecificStep from "./TrocSpecificStep.jsx";

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
    estimatedPrice: Yup.number()
      .typeError("Le prix doit être un nombre")
      .min(0, "Le prix doit être positif")
      .required("Le prix est obligatoire"),
  }),
  3: Yup.object({}),
  4: Yup.object({}),
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
            {step === 4 && <TrocSpecificStep />}
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
