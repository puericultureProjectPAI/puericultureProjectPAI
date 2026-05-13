import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";

// Validation plus souple pour le login : on vérifie juste que les champs ne sont pas vides
const validationSchema = Yup.object({
  email: Yup.string()
    .email("Le format de l'adresse email est invalide.")
    .required("L'email est requis."),
  password: Yup.string().required("Le mot de passe est requis."),
});

export default function LoginForm({ onSubmit, isLoading }) {
  // État pour gérer l'affichage du mot de passe
  const [showPassword, setShowPassword] = useState(false);

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      onSubmit(values);
    },
  });

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-4">
      <div>
        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.email}
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
        />
        {formik.touched.email && formik.errors.email && (
          <div className="text-red-500 text-sm mt-1">{formik.errors.email}</div>
        )}
      </div>

      <div className="relative">
        <input
          type={showPassword ? "text" : "password"}
          name="password"
          placeholder="Mot de passe"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.password}
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5 text-gray-500 hover:text-gray-700"
        >
          {showPassword ? "Cacher" : "Afficher"}
        </button>
        {formik.touched.password && formik.errors.password && (
          <div className="text-red-500 text-sm mt-1">{formik.errors.password}</div>
        )}
      </div>

      <button 
        type="submit" 
        disabled={isLoading || !formik.isValid}
        className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 transition duration-150 mt-6 disabled:bg-gray-400"
      >
        {isLoading ? "Connexion en cours..." : "Se connecter"}
      </button>
    </form>
  );
}