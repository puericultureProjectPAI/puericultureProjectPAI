import { useState } from "react";
import { useNavigate } from "react-router-dom"; // <-- Import du hook de redirection
import { CreationEnfantForm } from "../components/CreationEnfantForm";
import { createChild } from "../services/childrenServices";

const CreationEnfantView = () => {
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false); // <-- Nouvel état pour la notification

  const navigate = useNavigate(); // <-- Initialisation du hook

  const handleFormSubmit = async (values) => {
    setIsError(false);
    setError(null);
    setShowSuccess(false);

    try {
      // 1. Formatage de la date
      const parts = values.date.split("/");
      let formattedDate = "";

      if (parts.length === 2) {
        const [month, year] = parts;
        formattedDate = `${year}-${month}-01`;
      } else if (parts.length === 3) {
        const [day, month, year] = parts;
        formattedDate = `${year}-${month}-${day}`;
      }

      // 2. Préparation du Payload API
      // (J'ai utilisé la distinction birthDate/dpa dont on a parlé)
      const payloadForBackend = {
        name: values.prenom,
        gender: values.genre,
        ...(values.statut === "grossesse"
          ? { dpa: formattedDate }
          : { birthDate: formattedDate }),
      };

      // 3. Appel API
      await createChild(payloadForBackend);

      // 4. Succès : On affiche la bulle verte
      setShowSuccess(true);

      // 5. On crée une pause artificielle de 2 secondes AVANT de rendre la main au formulaire
      // (Ça permet de garder le bouton "Création en cours..." bloqué pendant qu'on lit le message)
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
