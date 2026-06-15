import { Field, FieldArray, useFormikContext } from "formik";
import { FormikInput } from "../FormikInput";
import plusIcon from "../../../assets/onboarding/plus-icon-subtle-s.svg";

const ChildForm = ({ index, onRemove, showRemove }) => {
  const { values } = useFormikContext();

  return (
    <div className="w-full flex flex-col gap-2 mb-4">
      <div className="w-full flex justify-start items-center gap-5 px-1">
        {["girl", "boy"].map((gender) => {
          const isSelected = values.children[index]?.gender === gender;
          return (
            <label
              key={gender}
              className="p-2.5 flex justify-start items-center gap-2.5 cursor-pointer group"
            >
              <Field
                type="radio"
                name={`children.${index}.gender`}
                value={gender}
                className="sr-only"
              />
              <div
                className={`size-6 rounded-full border-2 flex justify-center items-center transition-colors ${
                  isSelected
                    ? "border-bg-brand"
                    : "border-feedback-border-brand group-hover:border-bg-brand"
                }`}
              >
                {isSelected && (
                  <div className="size-4 bg-bg-brand rounded-full" />
                )}
              </div>
              <div className="text-text-brand text-base font-normal font-figtree">
                {gender === "girl" ? "Fille" : "Garçon"}
              </div>
            </label>
          );
        })}
      </div>

      <div className="w-full flex flex-col gap-5">
        <FormikInput
          label="Prénom / Surnom"
          name={`children.${index}.name`}
          placeholder="Prénom / Surnom"
        />
        <FormikInput
          label="Sa date de naissance"
          name={`children.${index}.birthDate`}
          type="date"
          placeholder="Date"
        />
      </div>

      {showRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="text-red-500 font-medium text-sm mt-1"
        >
          Retirer cet enfant
        </button>
      )}
    </div>
  );
};

export const ChildrenStep = () => {
  const { values, errors, touched } = useFormikContext();

  return (
    <div className="w-full">
      <FieldArray name="children">
        {({ push, remove }) => (
          <div className="w-full flex flex-col items-center">
            {values.children.map((_, index) => (
              <ChildForm
                key={index}
                index={index}
                showRemove={values.children.length > 1}
                onRemove={() => remove(index)}
              />
            ))}

            <div className="w-full flex flex-col items-center mt-2">
              <div className="w-full border-t border-gray-200" />
              <button
                type="button"
                onClick={() => push({ name: "", birthDate: "", gender: "" })}
                className="w-full py-4 flex justify-start items-center gap-5"
              >
                <img src={plusIcon} alt="Ajouter" className="w-5 h-5" />
                <div className="text-feedback-text-subtle text-base font-normal font-figtree">
                  Ajouter un enfant
                </div>
              </button>
              <div className="w-full border-t border-gray-200" />

              {typeof errors?.children === "string" && touched.children && (
                <div className="text-feedback-text-brand bg-feedback-background-alert p-2 rounded mt-3 w-full text-center">
                  {errors.children}
                </div>
              )}
            </div>
          </div>
        )}
      </FieldArray>
    </div>
  );
};
