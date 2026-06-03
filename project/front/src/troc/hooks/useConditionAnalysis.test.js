/* @vitest-environment jsdom */

import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import useConditionAnalysis from "./useConditionAnalysis";
import { apiClient } from "../../common/utils/apiClient";

vi.mock("../../common/utils/apiClient", () => ({
  apiClient: { post: vi.fn() },
}));

describe("useConditionAnalysis", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns the AI suggestion and confidence score on success", async () => {
    apiClient.post.mockResolvedValueOnce({
      data: {
        condition: "Bon état",
        confidenceScore: 78,
        multipleItemsDetected: false,
      },
    });

    const { result } = renderHook(() => useConditionAnalysis());

    await act(async () => {
      await result.current.analyzeCondition("https://example.com/image.jpg");
    });

    expect(result.current.suggestion).toBe("Bon état");
    expect(result.current.confidenceScore).toBe(78);
    expect(result.current.multipleItemsDetected).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it("sets multipleItemsDetected and no suggestion when multiple items are detected", async () => {
    apiClient.post.mockResolvedValueOnce({
      data: {
        condition: null,
        confidenceScore: 0,
        multipleItemsDetected: true,
      },
    });

    const { result } = renderHook(() => useConditionAnalysis());

    await act(async () => {
      await result.current.analyzeCondition("https://example.com/image.jpg");
    });

    expect(result.current.multipleItemsDetected).toBe(true);
    expect(result.current.suggestion).toBeNull();
    expect(result.current.confidenceScore).toBeNull();
    expect(result.current.error).toBeNull();
  });

  it("sets an error message when the API call fails", async () => {
    apiClient.post.mockRejectedValueOnce(new Error("Network error"));

    const { result } = renderHook(() => useConditionAnalysis());

    await act(async () => {
      await result.current.analyzeCondition("https://example.com/image.jpg");
    });

    expect(result.current.error).toBe(
      "L'analyse automatique a échoué. Veuillez renseigner l'état manuellement.",
    );
    expect(result.current.suggestion).toBeNull();
    expect(result.current.multipleItemsDetected).toBe(false);
  });

  it("resets all state when reset is called", async () => {
    apiClient.post.mockResolvedValueOnce({
      data: {
        condition: "Neuf",
        confidenceScore: 95,
        multipleItemsDetected: false,
      },
    });

    const { result } = renderHook(() => useConditionAnalysis());

    await act(async () => {
      await result.current.analyzeCondition("https://example.com/image.jpg");
    });

    act(() => {
      result.current.reset();
    });

    expect(result.current.suggestion).toBeNull();
    expect(result.current.confidenceScore).toBeNull();
    expect(result.current.error).toBeNull();
    expect(result.current.multipleItemsDetected).toBe(false);
  });
});
