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
      setSuccess("Annonce publiée avec succès.");
      return true;
    } catch (requestError) {
      setError("Impossible de publier l’annonce. Vérifiez les champs obligatoires.");
      console.error("Erreur publication annonce", requestError);
      return false;
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-6 md:px-8">
      <section className="mx-auto max-w-3xl">
        <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-blue-600">
          Troc · US 1
        </p>
        <h1 className="mb-3 text-3xl font-bold text-slate-900">
          Publier une annonce
        </h1>
        <p className="mb-6 text-sm leading-6 text-slate-600">
          Créez une annonce de type troc. Une fois validée, elle est enregistrée en base.
        </p>
        <PublishAnnouncementForm
          error={error}
          success={success}
          onSubmit={publishPost}
        />
      </section>
    </main>
  );
}
