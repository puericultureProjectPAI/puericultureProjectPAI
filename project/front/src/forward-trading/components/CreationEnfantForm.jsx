import { Formik, Form, Field, ErrorMessage } from "formik";
import { schemaCreationEnfant } from "../utils/Validations";

const CreationEnfantForm = ({ onSubmit, isPending }) => {
  const initialValues = {
    prenom: "",
    genre: "",
    dpa: "",
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={schemaCreationEnfant}
      onSubmit={onSubmit}
    >
      {() => (
        <Form>
          <div>
            <label htmlFor="prenom">Prénom de l'enfant :</label>
            <Field
              type="text"
              id="prenom"
              name="prenom"
              placeholder="Ex: Léo"
            />
            <ErrorMessage name="prenom" component="div" />
          </div>

          <div>
            <label htmlFor="genre">Genre :</label>
            <Field as="select" id="genre" name="genre">
              <option value="">Sélectionnez un genre</option>
              <option value="Fille">Fille</option>
              <option value="Garçon">Garçon</option>
              <option value="Autre">Autre</option>
            </Field>
            <ErrorMessage name="genre" component="div" />
          </div>

          <div>
            <label htmlFor="dpa">Date de naissance (MM/AAAA) :</label>
            <Field
              type="text"
              id="dpa"
              name="dpa"
              placeholder="Ex: 05/2026"
              maxLength="7"
            />
            <ErrorMessage name="dpa" component="div" />
          </div>

          <button type="submit" disabled={isPending}>
            {isPending ? "Création en cours..." : "Créer l'enfant"}
          </button>
        </Form>
      )}
    </Formik>
  );
};

export default CreationEnfantForm;
