/* @vitest-environment jsdom */

import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import useTroc from "./useTroc";
import { createTroc, getProducts, getTrocSuggestions } from "../utils/trocApi";

vi.mock("../utils/trocApi", () => ({
  createTroc: vi.fn(),
  getProducts: vi.fn(),
  getTrocSuggestions: vi.fn(),
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
    const consoleErrorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});
    createTroc.mockRejectedValueOnce(new Error("API error"));
    const { result } = renderHook(() => useTroc());

    let publicationResult;
    await act(async () => {
      publicationResult = await result.current.publishTroc({
        title: "Poussette bébé",
      });
    });

    expect(publicationResult).toBe(false);
    expect(result.current.success).toBe("");
    expect(result.current.error).toBe(
      "Impossible de publier l’annonce. Vérifiez les champs obligatoires.",
    );

    consoleErrorSpy.mockRestore();
  });

  it("loads troc products", async () => {
    const products = [{ id: 1, postTitle: "Poussette bébé" }];
    getProducts.mockResolvedValueOnce(products);
    const { result } = renderHook(() => useTroc());

    await act(async () => {
      await result.current.getProductsTroc();
    });

    expect(getProducts).toHaveBeenCalledTimes(1);
    expect(result.current.products).toEqual(products);
    expect(result.current.loading).toBe(false);
  });

  it("loads dynamic troc suggestions", async () => {
    const suggestions = [
      {
        id: 2,
        postTitle: "Siège auto",
        indicePertinence: 85,
      },
    ];
    getTrocSuggestions.mockResolvedValueOnce(suggestions);
    const { result } = renderHook(() => useTroc());

    let fetchResult;
    await act(async () => {
      fetchResult = await result.current.fetchTrocSuggestions();
    });

    expect(fetchResult).toBe(true);
    expect(getTrocSuggestions).toHaveBeenCalledTimes(1);
    expect(result.current.trocSuggestions).toEqual(suggestions);
    expect(result.current.suggestionsError).toBe("");
    expect(result.current.suggestionsLoading).toBe(false);
  });

  it("exposes an error when suggestions cannot be loaded", async () => {
    const consoleErrorSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});
    getTrocSuggestions.mockRejectedValueOnce(new Error("API error"));
    const { result } = renderHook(() => useTroc());

    let fetchResult;
    await act(async () => {
      fetchResult = await result.current.fetchTrocSuggestions();
    });

    expect(fetchResult).toBe(false);
    expect(result.current.trocSuggestions).toEqual([]);
    expect(result.current.suggestionsError).toBe(
      "Impossible de récupérer les suggestions de troc.",
    );
    expect(result.current.suggestionsLoading).toBe(false);

    consoleErrorSpy.mockRestore();
  });
});
