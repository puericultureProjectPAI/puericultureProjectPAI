// src/views/RegisterView.jsx
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

    const { email, password, lastName, firstName, birthDate } = formValues;

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          last_name: lastName,
          first_name: firstName,
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
    <div>
      <h2>Créer un compte</h2>
      <RegisterForm onSubmit={handleSignUp} isLoading={isLoading} />
      {status && <p>{status}</p>}
    </div>
  );
}
