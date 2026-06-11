import { useState } from "react";
import { apiClient } from "../../common/utils/apiClient";

export default function useConditionAnalysis() {
  const [suggestion, setSuggestion] = useState(null);
  const [confidenceScore, setConfidenceScore] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState(null);
  const [multipleItemsDetected, setMultipleItemsDetected] = useState(false);
  const [hasAnalyzed, setHasAnalyzed] = useState(false);

  const analyzeCondition = async (imageUrl) => {
    if (!imageUrl) return;

    setIsAnalyzing(true);
    setError(null);
    setSuggestion(null);
    setConfidenceScore(null);
    setMultipleItemsDetected(false);

    try {
      const response = await apiClient.post("/troc/ai/condition", null, {
        params: { imageUrl },
      });
      if (response.data.multipleItemsDetected) {
        setMultipleItemsDetected(true);
      } else {
        setSuggestion(response.data.condition);
        setConfidenceScore(response.data.confidenceScore);
      }
    } catch {
      setError(
        "L'analyse automatique a échoué. Veuillez renseigner l'état manuellement.",
      );
    } finally {
      setIsAnalyzing(false);
      setHasAnalyzed(true);
    }
  };

  const reset = () => {
    setSuggestion(null);
    setConfidenceScore(null);
    setError(null);
    setMultipleItemsDetected(false);
    setHasAnalyzed(false);
  };

  return {
    analyzeCondition,
    suggestion,
    confidenceScore,
    isAnalyzing,
    error,
    multipleItemsDetected,
    hasAnalyzed,
    reset,
  };
}
