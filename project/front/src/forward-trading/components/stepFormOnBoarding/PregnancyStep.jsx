import { FormikInput } from "../FormikInput";

export const PregnancyStep = () => (
  <FormikInput
    label="Date de naissance prévue"
    name="dueDate"
    type="date"
    placeholder="JJ/MM/AAAA"
  />
);
