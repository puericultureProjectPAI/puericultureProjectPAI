import { ErrorMessage } from "formik";

export default function FieldError({ name }) {
  return (
    <ErrorMessage
      className="mt-1 block text-xs font-medium text-red-600"
      component="span"
      name={name}
    />
  );
}
