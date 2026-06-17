import { FormikCardRadioGroup } from "../FormikCardRadioGroup";
import bottleIcon from "../../../assets/onboarding/bottle-icon-brand.svg";

export const StatusStep = ({ onSelect }) => (
  <FormikCardRadioGroup
    name="familyStatus"
    showIcon={true}
    options={[
      {
        value: "expecting",
        label: "J'attends un heureux événement",
        icon: bottleIcon,
      },
      { value: "parent", label: "Je suis déjà parent", icon: bottleIcon },
      { value: "both", label: "Les deux", icon: bottleIcon },
    ]}
    onSelect={onSelect}
  />
);
