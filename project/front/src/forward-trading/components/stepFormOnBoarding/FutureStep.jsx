import { FormikCardRadioGroup } from "../FormikCardRadioGroup";

export const FutureStep = () => (
  <FormikCardRadioGroup
    name="futurePlans"
    showIcon={false}
    options={[
      { value: "yes", label: "Oui, c'est prévu" },
      { value: "no", label: "Non, la famille est au complet" },
      { value: "undecided", label: "Je ne sais pas" },
    ]}
  />
);
