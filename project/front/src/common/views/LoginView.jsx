import { useState } from "react";
import { useNavigate } from "react-router";
import { supabase } from "../utils/supabaseClient";
import LoginForm from "../components/LoginForm";

export default function LoginView() {
  const [status, setStatus] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignIn = async (formValues) => {
    setIsLoading(true);
    setStatus("");

    const { email, password } = formValues;

    // Appel à Supabase pour la connexion
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setIsLoading(false);

    if (error) {
      // Gestion des erreurs de connexion (mauvais mot de passe, etc.)
      if (error.message.includes("Invalid login credentials")) {
        setStatus("Email ou mot de passe incorrect.");
      } else {
        setStatus(`Erreur : ${error.message}`);
      }
    } else {
      setStatus("Connexion réussie ! Redirection...");
      // Redirection vers le dashboard parent ou l'accueil (à adapter selon vos routes)
      setTimeout(() => navigate("/"), 1000);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6 md:p-8">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Connexion</h2>
        
        <LoginForm onSubmit={handleSignIn} isLoading={isLoading} />
        
        {status && (
          <p className={`mt-4 text-center text-sm font-medium ${status.includes("réussie") ? "text-green-600" : "text-red-600"}`}>
            {status}
          </p>
        )}

        <div className="mt-6 text-center text-sm text-gray-600">
          Pas encore de compte ?{" "}
          {/* Assure-toi que la route "/register" correspond bien à ce qui a été configuré dans React Router */}
          <button 
            onClick={() => navigate("/register")} 
            className="text-blue-600 hover:underline font-medium"
          >
            S'inscrire
          </button>
        </div>
      </div>
    </div>
  );
}