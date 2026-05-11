import CreationEnfantForm from "../components/CreationEnfantForm";
import { useCreateEnfant } from "../hooks/UseCreateEnfant";

const CreationEnfantView = () => {
  // Récupération de la mutation TanStack Query
  const { mutateAsync, isPending, isError, error } = useCreateEnfant();

  const handleFormSubmit = async (values, { resetForm }) => {
    try {
      await mutateAsync(values);
      alert("Enfant ajouté avec succès !");
      resetForm();
    } catch (err) {
      console.error(err);
    }
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
