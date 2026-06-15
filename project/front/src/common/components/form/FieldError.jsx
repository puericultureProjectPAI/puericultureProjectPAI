import { ErrorMessage, useFormikContext } from "formik";

export default function FieldError({ name }) {
  const { submitCount } = useFormikContext();
  if (submitCount <= 1) {
    return null;
  }
  return (
    <ErrorMessage
      className="mt-1 block text-xs font-medium text-red-600"
      component="span"
      name={name}
    />
  );
}
