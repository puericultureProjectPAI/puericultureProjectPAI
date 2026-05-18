import { useState } from "react";
import PublishAnnouncementForm from "../components/PublishAnnouncementForm";
import { createTroc } from "../utils/trocApi";

export default function PublishAnnouncementView() {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const publishPost = async (values) => {
    setError("");
    setSuccess("");

    try {
      await createTroc(values);
      setSuccess("Annonce Troc publiée avec succès.");
      return true;
    } catch (requestError) {
      setError("Impossible de publier l’annonce. Vérifiez les champs obligatoires.");
      console.error("Erreur publication annonce", requestError);
      return false;
    }
  };

  return (
    <main className="min-h-screen bg-[#f6f6fb] px-4 py-6">
      <PublishAnnouncementForm
        error={error}
        success={success}
        onSubmit={publishPost}
      />
    </main>
  );
}
