import { useState } from "react";
import CreationEnfantForm from "../components/CreationEnfantForm";
import { createChild } from "../services/childrenServices";

const CreationEnfantView = () => {
  const [isPending, setIsLoading] = useState(false);
  const [isError] = useState(false);
  const [error] = useState(null);
  const handleFormSubmit = async (values, { resetForm }) => {
    setIsLoading(true);
    try {
      const parts = values.dpa.split("/");
      let formattedDate = "";

      if (parts.length === 2) {
        // Cas MM/AAAA on force le jour à "01"
        const [month, year] = parts;
        formattedDate = `${year}-${month}-01`;
      } else if (parts.length === 3) {
        // Cas JJ/MM/AAAA
        const [day, month, year] = parts;
        formattedDate = `${year}-${month}-${day}`;
      }

      const payloadForBackend = {
        name: values.prenom,
        gender: values.genre,
        dpa: formattedDate,
      };

      // 3. Appel API
      await createChild(payloadForBackend);
      //await mutateAsync(payloadForBackend);

      alert("Enfant ajouté avec succès !");
      resetForm();
    } catch (err) {
      console.error(err);
    }
    setIsLoading(false);
  };

  return (
    <div>
      <h1>Nouvel enfant</h1>
      <p>Veuillez remplir les informations ci-dessous.</p>

      {isError && (
        <div>
          Erreur :{" "}
          {error.response?.data?.message ||
            error.message ||
            "Une erreur est survenue"}
        </div>
      )}

      <CreationEnfantForm onSubmit={handleFormSubmit} isPending={isPending} />
    </div>
  );
};

export default CreationEnfantView;
