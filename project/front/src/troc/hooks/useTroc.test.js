/* @vitest-environment jsdom */

import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import useTroc from "./useTroc";
import { createTroc } from "../utils/trocApi";

vi.mock("../utils/trocApi", () => ({
  createTroc: vi.fn(),
}));

describe("useTroc", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useRealTimers();
  });

  it("publishes a troc announcement and hides the success message automatically", async () => {
    vi.useFakeTimers();
    createTroc.mockResolvedValueOnce({ productId: 1 });

    const { result } = renderHook(() => useTroc());
    const payload = {
      title: "Poussette bébé",
      description: "Poussette en très bon état",
      category: "Poussettes, porte-bébés et sièges auto",
      city: "Lille",
      estimatedPrice: 40,
      imageReference: "poussette.png",
    };

    let publicationResult;
    await act(async () => {
      publicationResult = await result.current.publishTroc(payload);
    });

    expect(publicationResult).toBe(true);
    expect(createTroc).toHaveBeenCalledWith(payload);
    expect(result.current.error).toBe("");
    expect(result.current.success).toBe("Annonce Troc publiée avec succès.");

    act(() => {
      vi.advanceTimersByTime(3000);
    });

    expect(result.current.success).toBe("");
    vi.useRealTimers();
  });

  it("returns false and exposes an error message when publication fails", async () => {
    const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    createTroc.mockRejectedValueOnce(new Error("API error"));

    const { result } = renderHook(() => useTroc());

    let publicationResult;
    await act(async () => {
      publicationResult = await result.current.publishTroc({ title: "Poussette bébé" });
    });

    expect(publicationResult).toBe(false);
    expect(result.current.success).toBe("");
    expect(result.current.error).toBe(
      "Impossible de publier l’annonce. Vérifiez les champs obligatoires.",
    );

    consoleErrorSpy.mockRestore();
  });
});
