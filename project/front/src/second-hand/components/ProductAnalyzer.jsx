import { useState } from "react";
const ProductAnalyzer = () => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 1. Gérer la sélection des fichiers
  const handleFileChange = (e) => {
    if (e.target.files) {
      setSelectedFiles(Array.from(e.target.files));
      setError(null); // Reset l'erreur lors d'une nouvelle sélection
    }
  };

  // 2. Soumettre au backend Spring Boot
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (selectedFiles.length === 0) {
      setError("Veuillez sélectionner au moins une image.");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    const formData = new FormData();
    selectedFiles.forEach((file) => {
      // "images" doit correspondre à @RequestParam("images") dans ton Controller
      formData.append("images", file);
    });

    // Récupération du token depuis le localStorage
    const token = localStorage.getItem("pp_token");

    try {
      const response = await fetch(
        "http://localhost:8080/api/api/v1/ai/analyze-products",
        {
          method: "POST",
          headers: {
            // IMPORTANT: On ajoute le token JWT
            Authorization: `Bearer ${token}`,
            // Note: On ne définit PAS 'Content-Type', le navigateur le fait pour FormData
          },
          body: formData,
        },
      );

      if (response.status === 401) {
        throw new Error("Session expirée ou non autorisée (401).");
      }

      if (response.status === 403) {
        throw new Error(
          "Accès refusé (403). Vérifiez votre token ou la configuration CORS/Security.",
        );
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `Erreur serveur (${response.status})`,
        );
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      console.error("Analysis Error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Test IA Gemini Vision</h2>

      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.inputGroup}>
          <label style={styles.label}>Images du produit :</label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileChange}
            style={styles.fileInput}
          />
        </div>

        {selectedFiles.length > 0 && (
          <p style={styles.fileList}>
            {selectedFiles.length} fichier(s) prêt(s) pour l'analyse.
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          style={{
            ...styles.button,
            backgroundColor: loading ? "#94a3b8" : "#2563eb",
          }}
        >
          {loading ? "Analyse par Gemini..." : "Lancer l'analyse"}
        </button>
      </form>

      {/* Message d'erreur */}
      {error && (
        <div style={styles.errorBox}>
          <strong>Erreur :</strong> {error}
        </div>
      )}

      {/* Résultat */}
      {result && (
        <div style={styles.resultBox}>
          <h3 style={styles.resultTitle}>Résultat de l'analyse</h3>
          <div style={styles.resultItem}>
            <strong>Titre :</strong> {result.title}
          </div>
          <div style={styles.resultItem}>
            <strong>Description :</strong> {result.description}
          </div>
          <div style={styles.resultItem}>
            <strong>Catégorie :</strong>
            <span style={styles.badge}>{result.category}</span>
          </div>
          <div style={styles.resultItem}>
            <strong>Confiance :</strong> {result.confidenceScore}%
          </div>

          <details style={styles.details}>
            <summary>JSON Brut</summary>
            <pre style={styles.pre}>{JSON.stringify(result, null, 2)}</pre>
          </details>
        </div>
      )}
    </div>
  );
};

// Styles CSS-in-JS rapides
const styles = {
  container: {
    maxWidth: "600px",
    margin: "50px auto",
    padding: "20px",
    fontFamily: "system-ui",
    border: "1px solid #e2e8f0",
    borderRadius: "12px",
    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
  },
  title: { textAlign: "center", color: "#1e293b", marginBottom: "25px" },
  form: { display: "flex", flexDirection: "column", gap: "20px" },
  label: { display: "block", fontWeight: "600", marginBottom: "8px" },
  fileInput: {
    width: "100%",
    padding: "10px",
    border: "1px dashed #cbd5e1",
    borderRadius: "6px",
  },
  fileList: { fontSize: "14px", color: "#64748b", margin: 0 },
  button: {
    color: "white",
    padding: "12px",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "600",
    transition: "0.2s",
  },
  errorBox: {
    marginTop: "20px",
    padding: "12px",
    backgroundColor: "#fef2f2",
    color: "#b91c1c",
    borderRadius: "6px",
    border: "1px solid #fee2e2",
  },
  resultBox: {
    marginTop: "25px",
    padding: "20px",
    backgroundColor: "#f8fafc",
    borderRadius: "8px",
    border: "1px solid #e2e8f0",
  },
  resultTitle: { margin: "0 0 15px 0", color: "#0f172a" },
  resultItem: { marginBottom: "10px", lineHeight: "1.5" },
  badge: {
    marginLeft: "8px",
    padding: "2px 10px",
    backgroundColor: "#dcfce7",
    color: "#166534",
    borderRadius: "12px",
    fontSize: "13px",
    fontWeight: "600",
  },
  details: { marginTop: "15px", fontSize: "12px" },
  pre: {
    backgroundColor: "#1e293b",
    color: "#f8fafc",
    padding: "10px",
    borderRadius: "4px",
    marginTop: "10px",
    overflowX: "auto",
  },
};

export default ProductAnalyzer;
