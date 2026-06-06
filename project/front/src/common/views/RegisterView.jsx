import { useState } from "react";
import { useNavigate } from "react-router";
import { supabase } from "../utils/supabaseClient";
import RegisterForm from "../components/RegisterForm";

export default function RegisterView() {
  const [status, setStatus] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignUp = async (formValues) => {
    setIsLoading(true);
    setStatus("");

    const { email, password, lastName, firstName, pseudo, birthDate } =
      formValues;

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          last_name: lastName,
          first_name: firstName,
          username: pseudo,
          birth_date: birthDate,
        },
      },
    });

    setIsLoading(false);

    if (error) {
      if (
        error.message.includes("already registered") ||
        error.status === 422
      ) {
        setStatus("Un compte existe déjà avec cette adresse email.");
      } else {
        setStatus(`Erreur : ${error.message}`);
      }
    } else {
      setStatus("Compte créé avec succès ! Redirection vers l'onboarding...");
      setTimeout(() => navigate("/onboarding"), 1500);
    }
  };

  return (
    <div className="min-h-screen bg-bg-alternate flex flex-col items-center justify-center p-4 font-figtree">
      <RegisterForm onSubmit={handleSignUp} isLoading={isLoading} />
      {status && (
        <p
          className={`mt-4 p-3 rounded text-center w-full max-w-md ${
            status.includes("Erreur") || status.includes("existe déjà")
              ? "bg-feedback-background-alert text-feedback-background-alert-bold"
              : "bg-feedback-background-success text-feedback-background-success-bold"
          }`}
        >
          {status}
        </p>
      )}
    </div>
  );
}
