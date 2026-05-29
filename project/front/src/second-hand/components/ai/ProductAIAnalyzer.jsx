import { useState } from "react";

export default function ProductAIAnalyzer({ onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleAnalyze = async (file) => {
    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("images", file);

      const res = await fetch(
        "http://localhost:8080/api/v1/ai/analyze-products",
        {
          method: "POST",
          body: formData,
        },
      );

      //  CAS ERREUR METIER
      if (res.status === 400 || res.status === 422) {
        setError(
          "L'IA n'a pas pu analyser votre image. Veuillez remplir les champs manuellement.",
        );
        return;
      }

      //  CAS ERREUR SERVEUR
      if (res.status >= 500) {
        setError(
          "L'IA n'a pas pu analyser votre image. Veuillez remplir les champs manuellement.",
        );
        return;
      }

      const data = await res.json();

      //  SUCCESS
      onSuccess?.(data);
    } catch {
      //  CAS NETWORK / TIMEOUT
      setError(
        "L'IA n'a pas pu analyser votre image. Veuillez remplir les champs manuellement.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-3">
      {/* INPUT IMAGE */}
      <input
        type="file"
        accept="image/*"
        disabled={loading}
        onChange={(e) => handleAnalyze(e.target.files[0])}
      />

      {/* LOADING */}
      {loading && (
        <p className="text-blue-500 text-sm">Analyse IA en cours...</p>
      )}

      {/* ERROR (NON BLOQUANT) */}
      {error && (
        <p className="text-red-500 text-sm bg-red-50 p-2 rounded">{error}</p>
      )}
    </div>
  );
}
