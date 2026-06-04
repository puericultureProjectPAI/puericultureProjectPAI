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
            className={`w-80 px-5 py-2 bg-bg-base rounded-lg shadow-[0px_2px_2px_0px_rgba(0,0,0,0.10)] outline outline-1 outline-offset-[-1px] inline-flex justify-start items-center gap-4 overflow-hidden cursor-pointer transition-colors ${
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
                  onChange={(event) => {
                    field.onChange(event);
                    if (onSelect) onSelect(option.value, event);
                  }}
                />
              )}
            </Field>

            {showIcon && (
              <div className="w-16 p-3 bg-feedback-background-warning rounded-sm inline-flex flex-col justify-center items-center gap-2.5 overflow-hidden">
                {option.icon ? (
                  <img
                    src={option.icon}
                    alt=""
                    className="w-5 h-10 object-contain"
                  />
                ) : (
                  <div className="w-5 h-10 bg-feedback-icon-brand"></div>
                )}
              </div>
            )}

            <div className="p-2.5 inline-flex flex-col justify-start items-start gap-2.5 overflow-hidden">
              <div className="w-36 max-w-52 justify-start text-text-brand text-xl font-bold font-figtree">
                {option.label}
              </div>
            </div>
          </label>
        );
      })}

      <ErrorMessage name={name}>
        {(msg) => (
          <div className="w-80 p-4 bg-feedback-background-alert rounded-lg outline outline-1 outline-offset-[-1px] outline-feedback-background-alert-bold flex flex-col justify-start items-start gap-0.5 overflow-hidden">
            <div className="w-full inline-flex justify-start items-center gap-2.5 overflow-hidden">
              <div className="max-w-80 text-center justify-start text-feedback-text-brand text-base font-normal font-figtree">
                {msg}
              </div>
            </div>
          </div>
        )}
      </ErrorMessage>
    </div>
  );
};
