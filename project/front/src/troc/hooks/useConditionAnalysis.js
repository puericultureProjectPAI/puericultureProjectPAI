import { useState } from "react";
import { apiClient } from "../../common/utils/apiClient";

export default function useConditionAnalysis() {
  const [suggestion, setSuggestion] = useState(null);
  const [confidenceScore, setConfidenceScore] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState(null);

  const analyzeCondition = async (imageUrl) => {
    if (!imageUrl) return;

    setIsAnalyzing(true);
    setError(null);
    setSuggestion(null);
    setConfidenceScore(null);

    try {
      const response = await apiClient.post("/troc/ai/condition", null, {
        params: { imageUrl },
      });
      setSuggestion(response.data.condition);
      setConfidenceScore(response.data.confidenceScore);
    } catch {
      setError(
        "L'analyse automatique a échoué. Veuillez renseigner l'état manuellement.",
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  const reset = () => {
    setSuggestion(null);
    setConfidenceScore(null);
    setError(null);
  };

  return {
    analyzeCondition,
    suggestion,
    confidenceScore,
    isAnalyzing,
    error,
    reset,
  };
}
