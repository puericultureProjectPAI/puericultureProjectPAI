import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CreationEnfantForm } from "../components/CreationEnfantForm";
import { createChild } from "../services/childrenServices";

const CreationEnfantView = () => {
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const navigate = useNavigate();

  const handleFormSubmit = async (values) => {
    setIsError(false);
    setError(null);
    setShowSuccess(false);

    try {
      // 1. PLUS BESOIN DE FORMATAGE !
      // Puisqu'on utilise type="date", values.date est DÉJÀ formaté en "YYYY-MM-DD"
      // C'est exactement le format qu'attend ton DTO Java (LocalDate)

      // 2. Préparation du Payload API (Option 1 : On envoie toujours 'dpa')
      const payloadForBackend = {
        name: values.prenom,
        gender: values.genre,
        dpa: values.date,
      };

      // 3. Appel API
      await createChild(payloadForBackend);

      // 4. Succès : On affiche la bulle verte
      setShowSuccess(true);

      // 5. On crée une pause artificielle de 2 secondes avant redirection
      await new Promise((resolve) => {
        setTimeout(() => {
          navigate("/me");
          resolve();
        }, 2000);
      });
    } catch (err) {
      console.error(err);
      setIsError(true);
      setError(err);
      setShowSuccess(false);
      throw err;
    }
  };

  return (
    <div className="min-h-screen bg-base relative">
      {/* NOTIFICATION VERTE DE SUCCÈS (TOAST) */}
      {showSuccess && (
        <div className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50 flex items-center gap-3 bg-feedback-background-success border border-feedback-background-success-bold text-feedback-background-success-bold px-6 py-3 rounded-lg shadow-lg font-figtree transition-all duration-300">
          <svg
            className="w-5 h-5 text-feedback-background-success-bold"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M5 13l4 4L19 7"
            ></path>
          </svg>
          <span className="text-sm font-bold">Enfant ajouté avec succès !</span>
        </div>
      )}

      {/* MESSAGE D'ERREUR ROUGE */}
      {isError && (
        <div className="w-full bg-feedback-background-alert p-4 text-center text-feedback-border-alert text-sm font-medium">
          Erreur :{" "}
          {error?.response?.data?.message ||
            error?.message ||
            "Une erreur est survenue lors de la création."}
        </div>
      )}

      <CreationEnfantForm onSubmitComplete={handleFormSubmit} />
    </div>
  );
};

export default CreationEnfantView;
