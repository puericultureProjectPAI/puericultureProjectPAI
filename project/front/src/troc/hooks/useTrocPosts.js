import { useCallback, useEffect, useState } from "react";
import { createTroc, getTrocs } from "../utils/trocApi";

export function useTrocPosts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadPosts = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const data = await getTrocs();
      setPosts(data);
    } catch (requestError) {
      setError("Impossible de charger les annonces pour le moment.");
      console.error("Erreur chargement annonces", requestError);
    } finally {
      setLoading(false);
    }
  }, []);

  const publishPost = async (values) => {
    setError("");
    setSuccess("");

    try {
      await createTroc(values);
      setSuccess("Annonce publiée avec succès.");
      await loadPosts();
      return true;
    } catch (requestError) {
      setError("Impossible de publier l’annonce. Vérifiez les champs obligatoires.");
      console.error("Erreur publication annonce", requestError);
      return false;
    }
  };

  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  return { posts, loading, error, success, publishPost, loadPosts };
}
