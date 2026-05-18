import { ErrorMessage, Field, Form, Formik } from "formik";
import { useRef, useState } from "react";
import * as Yup from "yup";

const CATEGORIES = [
  { value: "0", label: "Autres articles pour bébé et enfant" },
  { value: "1", label: "Vêtements" },
  { value: "2", label: "Jeux et jouets" },
  { value: "3", label: "Poussettes, porte-bébés et sièges auto" },
  { value: "4", label: "Meubles et décoration" },
  { value: "5", label: "Bain et change" },
  { value: "6", label: "Sécurité bébé et enfant" },
  { value: "7", label: "Allaitement et alimentation" },
  { value: "8", label: "Sommeil et literie" },
  { value: "9", label: "Santé et grossesse" },
];

const CONDITION_OPTIONS = [
  "Très bon état",
  "Bon état",
  "État correct",
  "Usure visible",
];

const initialValues = {
  mode: "TROC",
  imageReference: "",
  title: "",
  description: "",
  category: "",
  condition: "",
  estimatedPrice: "",
  city: "",
  radius: "",
  wantedArticle: "",
};

const validationSchemas = {
  1: Yup.object({
    mode: Yup.string().oneOf(["TROC"]).required(),
  }),
  2: Yup.object({
    title: Yup.string().required("Le nom de l'article est obligatoire"),
    description: Yup.string().required("La description est obligatoire"),
    category: Yup.string().required("La catégorie est obligatoire"),
    condition: Yup.string().required("L’état est obligatoire"),
    estimatedPrice: Yup.number()
      .typeError("Le prix doit être un nombre")
      .min(0, "Le prix doit être positif")
      .required("Le prix est obligatoire"),
  }),
  3: Yup.object({
    city: Yup.string().required("La ville est obligatoire"),
    radius: Yup.number()
      .typeError("Le rayon doit être un nombre")
      .min(1, "Le rayon doit être supérieur à 0")
      .required("Le rayon est obligatoire"),
    wantedArticle: Yup.string().required("L’article recherché est obligatoire"),
  }),
};

const publishModes = [
  {
    key: "SECOND_HAND",
    title: "Seconde main",
    description: "Je fixe un prix et je vends",
    icon: "🏷️",
    disabled: true,
  },
  {
    key: "LOCATION",
    title: "Location",
    description: "Je mets en location",
    icon: "⏱️",
    disabled: true,
  },
  {
    key: "TROC",
    title: "Troc",
    description: "J’échange contre un article",
    icon: "↔",
    disabled: false,
  },
];

function Stepper({ currentStep }) {
  return (
    <div className="mb-8 mt-6 flex items-center justify-center gap-7">
      {[1, 2, 3, 4].map((step) => (
        <div key={step} className="flex items-center">
          <div
            className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold ${
              currentStep === step
                ? "bg-[#e8f2ff] text-[#080036]"
                : "bg-[#f0f0f7] text-[#9b9ab0]"
            }`}
          >
            {step}
          </div>
        </div>
      ))}
    </div>
  );
}

function FieldError({ name }) {
  return (
    <ErrorMessage
      className="mt-1 block text-xs font-medium text-red-600"
      component="span"
      name={name}
    />
  );
}

function MobileShell({ children, currentStep, success, error }) {
  return (
    <section className="mx-auto max-w-[390px] overflow-hidden rounded-[1.6rem] border border-[#e6e6ef] bg-white shadow-sm">
      <header className="flex h-14 items-center justify-between bg-[#080036] px-4 text-white">
        <div className="text-2xl font-extrabold tracking-wide">KIABI</div>
        <div className="flex items-center gap-3 text-xl" aria-hidden="true">
          <span>⌘</span>
          <span>♡</span>
        </div>
      </header>

      <div className="px-7 pb-4 pt-5">
        <div className="mb-1 flex items-center gap-4">
          <span className="text-3xl leading-none text-[#080036]">‹</span>
          <h1 className="text-2xl font-extrabold text-[#080036]">
            Publie ton article
          </h1>
        </div>
        <div className="ml-11 h-px bg-[#efedf5]" />

        <Stepper currentStep={currentStep} />

        {success && (
          <div className="mb-4 rounded-xl border border-green-200 bg-green-50 px-3 py-2 text-sm font-medium text-green-700">
            {success}
          </div>
        )}

        {error && (
          <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-700">
            {error}
          </div>
        )}

        {children}
      </div>

      <nav className="grid grid-cols-5 border-t border-[#efedf5] bg-white px-4 pb-3 pt-2 text-[10px] text-[#7d7b93]">
        {[
          ["⌂", "Accueil"],
          ["⌕", "Rechercher"],
          ["⊕", "Publier"],
          ["✉", "Messages"],
          ["♙", "Profil"],
        ].map(([icon, label]) => (
          <div
            className={`flex flex-col items-center gap-1 ${
              label === "Publier" ? "font-bold text-[#080036]" : ""
            }`}
            key={label}
          >
            <span className="text-xl leading-none">{icon}</span>
            <span>{label}</span>
          </div>
        ))}
      </nav>
    </section>
  );
}

function StepOne({ setFieldValue }) {
  return (
    <div>
      <h2 className="mb-5 text-center text-sm font-extrabold text-[#080036]">
        Comment proposer cet article ?
      </h2>

      <div className="space-y-4">
        {publishModes.map((mode) => (
          <button
            className={`flex w-full items-center gap-4 rounded-lg border px-4 py-4 text-left transition ${
              mode.key === "TROC"
                ? "border-[#080036] bg-white shadow-sm"
                : "border-[#d7d5e5] bg-white opacity-70"
            } ${mode.disabled ? "cursor-not-allowed" : "hover:border-[#080036]"}`}
            disabled={mode.disabled}
            key={mode.key}
            onClick={() => setFieldValue("mode", "TROC")}
            type="button"
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-md bg-[#f1efff] text-2xl text-[#080036]">
              {mode.icon}
            </span>
            <span>
              <span className="block font-extrabold text-[#080036]">
                {mode.title}
              </span>
              <span className="mt-1 block text-xs font-medium text-[#5f5b78]">
                {mode.description}
              </span>
            </span>
          </button>
        ))}
      </div>

      <div className="mt-5 rounded-md border border-[#b9c5ff] bg-[#f7f9ff] px-3 py-3 text-center text-xs font-medium text-[#36336a]">
        ⓘ Vous pouvez combiner plusieurs modes
      </div>
    </div>
  );
}

function StepTwo({ setFieldValue, values }) {
  const fileInputRef = useRef(null);

  return (
    <div>
      <input
        accept="image/png,image/jpeg"
        className="hidden"
        onChange={(event) => {
          const [file] = event.target.files;
          if (file) {
            setFieldValue("imageReference", file.name);
          }
        }}
        ref={fileInputRef}
        type="file"
      />

      <p className="mb-2 text-center text-xs font-semibold text-[#5362d6]">
        Max 5 photos JPG ou PNG
      </p>
      <button
        className="mb-4 flex min-h-20 w-full items-center rounded-xl border border-[#9b99b5] bg-[#f5f4fb] px-4 text-left"
        onClick={() => fileInputRef.current?.click()}
        type="button"
      >
        <span className="flex h-16 w-16 flex-col items-center justify-center rounded-lg border border-dashed border-[#9b99b5] bg-white text-[#080036]">
          <span className="text-lg">＋</span>
          <span className="text-sm font-semibold">Ajouter</span>
        </span>
        {values.imageReference && (
          <span className="ml-4 text-xs font-medium text-[#5f5b78]">
            {values.imageReference}
          </span>
        )}
      </button>

      <label className="mb-2 block text-sm font-extrabold text-[#080036]" htmlFor="title">
        Nom de l'article
      </label>
      <Field
        className="mb-1 w-full rounded-md border border-[#b8b6c7] px-3 py-2 text-sm outline-none focus:border-[#080036]"
        id="title"
        name="title"
        placeholder="Ex : Veste en jean bleue"
      />
      <FieldError name="title" />

      <label
        className="mb-2 mt-4 block text-sm font-extrabold text-[#080036]"
        htmlFor="description"
      >
        Description
      </label>
      <Field
        as="textarea"
        className="mb-1 min-h-16 w-full rounded-md border border-[#b8b6c7] px-3 py-2 text-sm outline-none focus:border-[#080036]"
        id="description"
        name="description"
        placeholder="Décrivez l’article..."
      />
      <FieldError name="description" />

      <div className="mt-4 grid grid-cols-2 gap-3">
        <div>
          <label className="mb-2 block text-sm font-extrabold text-[#080036]" htmlFor="category">
            Catégorie
          </label>
          <Field
            as="select"
            className="w-full rounded-md border border-[#b8b6c7] bg-white px-3 py-2 text-sm outline-none focus:border-[#080036]"
            id="category"
            name="category"
          >
            <option value="">Select</option>
            {CATEGORIES.map((category) => (
              <option key={category.value} value={category.value}>
                {category.label}
              </option>
            ))}
          </Field>
          <FieldError name="category" />
        </div>

        <div>
          <label className="mb-2 block text-sm font-extrabold text-[#080036]" htmlFor="condition">
            État
          </label>
          <Field
            as="select"
            className="w-full rounded-md border border-[#b8b6c7] bg-white px-3 py-2 text-sm outline-none focus:border-[#080036]"
            id="condition"
            name="condition"
          >
            <option value="">Select</option>
            {CONDITION_OPTIONS.map((condition) => (
              <option key={condition} value={condition}>
                {condition}
              </option>
            ))}
          </Field>
          <FieldError name="condition" />
        </div>
      </div>

      <label
        className="mb-2 mt-4 block text-sm font-extrabold text-[#080036]"
        htmlFor="estimatedPrice"
      >
        Prix
      </label>
      <div className="relative">
        <Field
          className="w-full rounded-md border border-[#b8b6c7] px-3 py-2 pr-8 text-sm outline-none focus:border-[#080036]"
          id="estimatedPrice"
          min="0"
          name="estimatedPrice"
          placeholder="0,00"
          step="1"
          type="number"
        />
        <span className="absolute right-3 top-2 text-sm text-[#080036]">€</span>
      </div>
      <FieldError name="estimatedPrice" />
    </div>
  );
}

function StepThree() {
  return (
    <div className="rounded-lg bg-[#f5f4fb] p-4">
      <h2 className="mb-4 text-center text-sm font-extrabold text-[#080036]">
        Troc
      </h2>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="mb-2 block text-sm font-extrabold text-[#080036]" htmlFor="city">
            Ville
          </label>
          <Field
            className="w-full rounded-md border border-[#b8b6c7] bg-white px-3 py-2 text-sm outline-none focus:border-[#080036]"
            id="city"
            name="city"
            placeholder="Ville"
          />
          <FieldError name="city" />
        </div>

        <div>
          <label className="mb-2 block text-sm font-extrabold text-[#080036]" htmlFor="radius">
            Rayon
          </label>
          <div className="relative">
            <Field
              className="w-full rounded-md border border-[#b8b6c7] bg-white px-3 py-2 pr-9 text-sm outline-none focus:border-[#080036]"
              id="radius"
              min="1"
              name="radius"
              placeholder="km"
              type="number"
            />
            <span className="absolute right-3 top-2 text-xs font-semibold text-[#5f5b78]">
              km
            </span>
          </div>
          <FieldError name="radius" />
        </div>
      </div>

      <label
        className="mb-2 mt-4 block text-sm font-extrabold text-[#080036]"
        htmlFor="wantedArticle"
      >
        Je cherche
      </label>
      <Field
        className="w-full rounded-md border border-[#b8b6c7] bg-white px-3 py-2 text-sm outline-none focus:border-[#080036]"
        id="wantedArticle"
        name="wantedArticle"
        placeholder="Type d’article..."
      />
      <FieldError name="wantedArticle" />
    </div>
  );
}

function FormActions({ isSubmitting, setStep, step, validateForm, setTouched }) {
  const goNext = async () => {
    const errors = await validateForm();
    const stepFields = {
      1: ["mode"],
      2: ["title", "description", "category", "condition", "estimatedPrice"],
      3: ["city", "radius", "wantedArticle"],
    }[step];

    const stepErrors = stepFields.filter((field) => errors[field]);
    if (stepErrors.length > 0) {
      setTouched(
        stepFields.reduce((accumulator, field) => {
          accumulator[field] = true;
          return accumulator;
        }, {}),
        true,
      );
      return;
    }

    setStep(step + 1);
  };

  return (
    <div className="mt-6 flex items-center justify-center gap-4">
      {step > 1 && (
        <button
          className="min-w-28 rounded-md bg-[#c4c2ce] px-5 py-3 text-sm font-extrabold text-white transition hover:bg-[#aaa8b8]"
          onClick={() => setStep(step - 1)}
          type="button"
        >
          ← Retour
        </button>
      )}

      {step < 3 ? (
        <button
          className="min-w-28 rounded-md bg-[#080036] px-5 py-3 text-sm font-extrabold text-white transition hover:bg-[#1a1157]"
          onClick={goNext}
          type="button"
        >
          Continuer →
        </button>
      ) : (
        <button
          className="min-w-28 rounded-md bg-[#080036] px-5 py-3 text-sm font-extrabold text-white transition hover:bg-[#1a1157] disabled:cursor-not-allowed disabled:bg-[#908ca9]"
          disabled={isSubmitting}
          type="submit"
        >
          {isSubmitting ? "Publication..." : "Publier"}
        </button>
      )}
    </div>
  );
}

export default function PublishAnnouncementForm({ onSubmit, error, success }) {
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
        <MobileShell currentStep={step} error={error} success={success}>
          <Form>
            {step === 1 && <StepOne setFieldValue={setFieldValue} />}
            {step === 2 && (
              <StepTwo setFieldValue={setFieldValue} values={values} />
            )}
            {step === 3 && <StepThree />}

            <FormActions
              isSubmitting={isSubmitting}
              setStep={setStep}
              setTouched={setTouched}
              step={step}
              validateForm={validateForm}
            />
          </Form>
        </MobileShell>
      )}
    </Formik>
  );
}
