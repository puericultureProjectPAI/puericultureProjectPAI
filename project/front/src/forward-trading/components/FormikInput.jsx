import { Field, useField, ErrorMessage } from "formik";

export const FormikInput = ({ label, name, type = "text", placeholder }) => {
  const [, meta] = useField(name);
  const hasError = meta.touched && meta.error;

  return (
    <div className="w-full px-3 flex flex-col justify-start items-center gap-1 overflow-hidden mb-5">
      <div className="w-80 text-left justify-start text-text-brand text-base font-normal font-figtree">
        {label}
      </div>

      <div
        className={`w-80 p-3 bg-bg-base rounded-lg outline outline-1 outline-offset-[-1px] inline-flex justify-start items-center gap-2.5 overflow-hidden transition-colors ${
          hasError
            ? "outline-feedback-border-alert"
            : "outline-feedback-border-neutral"
        }`}
      >
        <div className="flex-1 flex justify-start items-center gap-5 overflow-hidden">
          <Field name={name}>
            {({ field }) => (
              <input
                {...field}
                type={type}
                placeholder={placeholder}
                className="w-full bg-transparent outline-none justify-start text-text-brand text-base font-normal font-figtree placeholder:text-text-subtle"
              />
            )}
          </Field>
        </div>
      </div>

      <ErrorMessage name={name}>
        {(msg) => (
          <div className="w-80 mt-1 inline-flex justify-center items-center gap-2.5">
            <div className="text-center justify-center text-feedback-text-brand text-base font-normal font-figtree">
              {msg}
            </div>
          </div>
        )}
      </ErrorMessage>
    </div>
  );
};
