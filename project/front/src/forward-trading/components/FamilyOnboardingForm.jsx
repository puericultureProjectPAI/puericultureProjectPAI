import React from "react";
import { Formik, Form, Field, FieldArray, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useSubmitFamilyProfile } from "../hooks/useSubmitFamilyProfile";

const validationSchema = Yup.object().shape({
  familyStatus: Yup.string().required("Veuillez sélectionner votre situation."),
  dueDate: Yup.string().when("familyStatus", {
    is: (val) => val === "expecting" || val === "both",
    then: () =>
      Yup.string().required("La date prévue d'accouchement est requise."),
    otherwise: () => Yup.string().nullable(),
  }),
  children: Yup.array().when("familyStatus", {
    is: (val) => val === "parent" || val === "both",
    then: () =>
      Yup.array()
        .of(
          Yup.object().shape({
            name: Yup.string().required("Prénom requis"),
            birthDate: Yup.date().required("Date requise"),
            gender: Yup.string()
              .oneOf(["girl", "boy", "neutral"])
              .required("Genre requis"),
          }),
        )
        .min(1, "Veuillez ajouter au moins un enfant."),
    otherwise: () => Yup.array().nullable(),
  }),
  futurePlans: Yup.string().required("Veuillez répondre à cette question."),
});

export const FamilyOnboardingForm = ({ onComplete }) => {
  const mutation = useSubmitFamilyProfile();

  const initialValues = {
    familyStatus: "",
    dueDate: "",
    children: [],
    futurePlans: "",
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

    mutation.mutate(payload, {
      onSuccess: () => {
        setSubmitting(false);
        if (onComplete) onComplete();
      },
      onError: () => {
        setSubmitting(false);
        alert(
          "Une erreur est survenue lors de l'enregistrement. Veuillez réessayer.",
        );
      },
    });
  };

  return (
    <div>
      <h2>Parlons de votre famille</h2>

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ values, isSubmitting, errors }) => (
          <Form>
            {/* --- STATUT --- */}
            <section>
              <h3>1. Quelle est votre situation actuelle ?</h3>
              <div>
                <label>
                  <Field type="radio" name="familyStatus" value="expecting" />
                  J'attends un heureux événement
                </label>
                <br />
                <label>
                  <Field type="radio" name="familyStatus" value="parent" />
                  Je suis déjà parent
                </label>
                <br />
                <label>
                  <Field type="radio" name="familyStatus" value="both" />
                  Les deux
                </label>
              </div>
              <ErrorMessage name="familyStatus" component="div" />
            </section>

            {/* ---  FLUX GROSSESSE --- */}
            {(values.familyStatus === "expecting" ||
              values.familyStatus === "both") && (
              <section>
                <h3>2. Pour quand est la rencontre ?</h3>
                <label>
                  Date Prévue d'Accouchement (DPA)
                  <Field type="date" name="dueDate" />
                </label>
                <ErrorMessage name="dueDate" component="div" />
              </section>
            )}

            {/* --- ENFANTS --- */}
            {(values.familyStatus === "parent" ||
              values.familyStatus === "both") && (
              <section>
                <h3>3. Vos enfants</h3>

                <FieldArray name="children">
                  {({ push, remove }) => (
                    <div>
                      {values.children.length > 0 &&
                        values.children.map((child, index) => (
                          <div key={index}>
                            <div>
                              <Field
                                name={`children.${index}.name`}
                                placeholder="Prénom / Surnom"
                              />
                              <ErrorMessage
                                name={`children.${index}.name`}
                                component="div"
                              />
                            </div>

                            <div>
                              <Field
                                type="date"
                                name={`children.${index}.birthDate`}
                              />
                              <ErrorMessage
                                name={`children.${index}.birthDate`}
                                component="div"
                              />
                            </div>

                            <div>
                              <Field
                                as="select"
                                name={`children.${index}.gender`}
                              >
                                <option value="" disabled>
                                  Genre...
                                </option>
                                <option value="girl">Fille</option>
                                <option value="boy">Garçon</option>
                                <option value="neutral">Neutre</option>
                              </Field>
                              <ErrorMessage
                                name={`children.${index}.gender`}
                                component="div"
                              />
                            </div>

                            <button type="button" onClick={() => remove(index)}>
                              Supprimer
                            </button>
                          </div>
                        ))}

                      <button
                        type="button"
                        onClick={() =>
                          push({ name: "", birthDate: "", gender: "" })
                        }
                      >
                        + Ajouter un enfant
                      </button>

                      {typeof errors?.children === "string" && (
                        <div>{errors.children}</div>
                      )}
                    </div>
                  )}
                </FieldArray>
              </section>
            )}
            {/* --- Future plans --- */}
            {values.familyStatus && (
              <section>
                <h3>
                  4. Prévoyez-vous d'agrandir encore la famille plus tard ?
                </h3>
                <div>
                  {[
                    { val: "yes", label: "Oui, c'est prévu" },
                    { val: "no", label: "Non, la famille est au complet" },
                    { val: "undecided", label: "Je ne sais pas" },
                  ].map((option) => (
                    <React.Fragment key={option.val}>
                      <label>
                        <Field
                          type="radio"
                          name="futurePlans"
                          value={option.val}
                        />
                        {option.label}
                      </label>
                      <br />
                    </React.Fragment>
                  ))}
                </div>
                <ErrorMessage name="futurePlans" component="div" />
              </section>
            )}

            <button
              type="submit"
              disabled={
                isSubmitting || !values.familyStatus || mutation.isPending
              }
            >
              {mutation.isPending ? "Enregistrement..." : "Valider mon profil"}
            </button>

            {mutation.isError && (
              <div>
                Échec de la sauvegarde. Veuillez vérifier votre connexion.
              </div>
            )}
          </Form>
        )}
      </Formik>
    </div>
  );
};
