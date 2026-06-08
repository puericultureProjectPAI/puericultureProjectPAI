/* @vitest-environment jsdom */

import "@testing-library/jest-dom/vitest";
import { act, renderHook, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

const { mockPost } = vi.hoisted(() => ({
  mockPost: vi.fn(),
}));

vi.mock("../../../src/common/utils/apiClient", () => ({
  apiClient: { post: mockPost },
}));

import useConditionAnalysis from "../../../src/troc/hooks/useConditionAnalysis";

const IMAGE_URL = "https://res.cloudinary.com/demo/image/upload/sample.jpg";

describe("useConditionAnalysis", () => {
  it("démarre avec un état initial vide", () => {
    const { result } = renderHook(() => useConditionAnalysis());

    expect(result.current.suggestion).toBeNull();
    expect(result.current.confidenceScore).toBeNull();
    expect(result.current.isAnalyzing).toBe(false);
    expect(result.current.error).toBeNull();
    expect(result.current.multipleItemsDetected).toBe(false);
  });

  it("retourne la suggestion et le score de confiance après une analyse réussie", async () => {
    mockPost.mockResolvedValue({
      data: {
        condition: "Bon état",
        confidenceScore: 78,
        multipleItemsDetected: false,
      },
    });

    const { result } = renderHook(() => useConditionAnalysis());

    act(() => {
      result.current.analyzeCondition(IMAGE_URL);
    });

    expect(result.current.isAnalyzing).toBe(true);

    await waitFor(() => expect(result.current.isAnalyzing).toBe(false));

    expect(result.current.suggestion).toBe("Bon état");
    expect(result.current.confidenceScore).toBe(78);
    expect(result.current.error).toBeNull();
    expect(result.current.multipleItemsDetected).toBe(false);
  });

  it("signale la détection de plusieurs articles sans retourner de suggestion", async () => {
    mockPost.mockResolvedValue({
      data: {
        condition: null,
        confidenceScore: 0,
        multipleItemsDetected: true,
      },
    });

    const { result } = renderHook(() => useConditionAnalysis());

    act(() => {
      result.current.analyzeCondition(IMAGE_URL);
    });

    await waitFor(() => expect(result.current.isAnalyzing).toBe(false));

    expect(result.current.multipleItemsDetected).toBe(true);
    expect(result.current.suggestion).toBeNull();
  });

  it("affiche un message d'erreur si l'appel API échoue", async () => {
    mockPost.mockRejectedValue(new Error("Network Error"));

    const { result } = renderHook(() => useConditionAnalysis());

    act(() => {
      result.current.analyzeCondition(IMAGE_URL);
    });

    await waitFor(() => expect(result.current.isAnalyzing).toBe(false));

    expect(result.current.error).toBe(
      "L'analyse automatique a échoué. Veuillez renseigner l'état manuellement.",
    );
    expect(result.current.suggestion).toBeNull();
  });

  it("reset remet tous les états à leurs valeurs initiales", async () => {
    mockPost.mockResolvedValue({
      data: {
        condition: "Neuf",
        confidenceScore: 95,
        multipleItemsDetected: false,
      },
    });

    const { result } = renderHook(() => useConditionAnalysis());

    act(() => {
      result.current.analyzeCondition(IMAGE_URL);
    });
    await waitFor(() => expect(result.current.suggestion).toBe("Neuf"));

    act(() => {
      result.current.reset();
    });

    expect(result.current.suggestion).toBeNull();
    expect(result.current.confidenceScore).toBeNull();
    expect(result.current.error).toBeNull();
    expect(result.current.multipleItemsDetected).toBe(false);
  });
});
