import { Field, useField, ErrorMessage } from "formik";

export const FormikCardRadioGroup = ({
  name,
  options,
  showIcon = false,
  onSelect,
}) => {
  const [, meta] = useField(name);
  const hasError = meta.touched && meta.error;

  return (
    <div className="flex flex-col items-center gap-5 w-full">
      {options.map((option) => {
        const isSelected = meta.value === option.value;
        return (
          <label
            key={option.value}
            className={`w-full px-5 py-2 bg-bg-base rounded-lg shadow-[0px_2px_2px_0px_rgba(0,0,0,0.10)] outline outline-1 outline-offset-[-1px] flex justify-start items-center gap-4 cursor-pointer transition-colors ${
              isSelected
                ? "outline-bg-brand bg-blue-50"
                : hasError
                  ? "outline-feedback-border-alert"
                  : "outline-feedback-border-neutral"
            }`}
          >
            <Field name={name}>
              {({ field }) => (
                <input
                  {...field}
                  type="radio"
                  value={option.value}
                  checked={isSelected}
                  className="hidden"
                  onClick={() => {
                    field.onChange({ target: { name, value: option.value } });
                    if (onSelect) onSelect(option.value);
                  }}
                />
              )}
            </Field>

            {showIcon && (
              <div className="w-16 p-3 bg-feedback-background-warning rounded-sm flex flex-col justify-center items-center shrink-0">
                {option.icon ? (
                  <img
                    src={option.icon}
                    alt=""
                    className="w-5 h-10 object-contain"
                  />
                ) : (
                  <div className="w-5 h-10 bg-feedback-icon-brand" />
                )}
              </div>
            )}

            <div className="flex-1 py-2.5">
              <div className="text-text-brand text-base font-bold font-figtree leading-snug">
                {option.label}
              </div>
            </div>
          </label>
        );
      })}

      <ErrorMessage name={name}>
        {(msg) => (
          <div className="w-full p-4 bg-feedback-background-alert rounded-lg outline outline-1 outline-offset-[-1px] outline-feedback-background-alert-bold">
            <div className="text-center text-feedback-text-brand text-base font-normal font-figtree">
              {msg}
            </div>
          </div>
        )}
      </ErrorMessage>
    </div>
  );
};
