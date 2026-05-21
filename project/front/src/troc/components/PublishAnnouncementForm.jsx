import { Form, Formik } from "formik";
import { useState } from "react";
import * as Yup from "yup";
import ModeSelectionStep from "./ModeSelectionStep";
import OptionalProductInfoStep from "./OptionalProductInfoStep";
import PublicationFormActions from "./PublicationFormActions";
import PublicationMobileShell from "./PublicationMobileShell";
import RequiredProductInfoStep from "./RequiredProductInfoStep";
import TrocSpecificStep from "./TrocSpecificStep";

const emptyToNull = (value) => (value === "" ? null : value);

const numberOrNull = (value) => (value === "" ? null : Number(value));

const initialValues = {
  mode: "TROC",
  imageReference: "",
  title: "",
  description: "",
  category: "",
  city: "",
  condition: "",
  brand: "",
  model: "",
  dimensions: "",
  lastCheckDate: "",
  securityStandard: "",
  maxWeightKg: "",
  minAgeMonths: "",
  maxAgeMonths: "",
  radius: "",
  wantedArticle: "",
  estimatedPrice: "",
};

const validationSchemas = {
  1: Yup.object({
    mode: Yup.string().oneOf(["TROC"]).required(),
  }),
  2: Yup.object({
    imageReference: Yup.string().required("Une image est obligatoire"),
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
      .required("Le prix estimé est obligatoire"),
  }),
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
          imageReference: values.imageReference,
          city: values.city,
          category: values.category,
          condition: emptyToNull(values.condition),
          brand: emptyToNull(values.brand),
          model: emptyToNull(values.model),
          dimensions: emptyToNull(values.dimensions),
          lastCheckDate: emptyToNull(values.lastCheckDate),
          securityStandard: emptyToNull(values.securityStandard),
          maxWeightKg: numberOrNull(values.maxWeightKg),
          minAgeMonths: numberOrNull(values.minAgeMonths),
          maxAgeMonths: numberOrNull(values.maxAgeMonths),
        };

        const isCreated = await onSubmit(payload);
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
            {step === 2 && (
              <RequiredProductInfoStep
                setFieldValue={setFieldValue}
                values={values}
              />
            )}
            {step === 3 && <OptionalProductInfoStep />}
            {step === 4 && <TrocSpecificStep />}

            <PublicationFormActions
              isSubmitting={isSubmitting}
              setStep={setStep}
              setTouched={setTouched}
              step={step}
              validateForm={validateForm}
            />
          </Form>
        </PublicationMobileShell>
      )}
    </Formik>
  );
}
