import { Field, useField, ErrorMessage } from "formik";

export const FormikInput = ({ label, name, type = "text", placeholder }) => {
  const [, meta] = useField(name);
  const hasError = meta.touched && meta.error;

  return (
    <div className="w-full flex flex-col gap-1">
      <div className="text-left text-text-brand text-base font-normal font-figtree">
        {label}
      </div>
      <div
        className={`w-full p-3 bg-bg-base rounded-lg outline outline-1 outline-offset-[-1px] flex justify-start items-center transition-colors ${
          hasError
            ? "outline-feedback-border-alert"
            : "outline-feedback-border-neutral"
        }`}
      >
        <Field name={name}>
          {({ field }) => (
            <input
              {...field}
              type={type}
              placeholder={placeholder}
              className="w-full bg-transparent outline-none text-text-brand text-base font-normal font-figtree placeholder:text-text-subtle"
            />
          )}
        </Field>
      </div>
      <ErrorMessage name={name}>
        {(msg) => (
          <div className="w-full mt-1 text-center text-feedback-text-brand text-base font-normal font-figtree">
            {msg}
          </div>
        )}
      </ErrorMessage>
    </div>
  );
};
