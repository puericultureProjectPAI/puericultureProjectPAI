// @vitest-environment jsdom
import { describe, it, expect, vi, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import React from "react";
import LeasingReviewsSection from "../../src/leasing/components/LeasingReviewsSection";
import * as useLeasingHooks from "../../src/leasing/hooks/useLeasing";

// Mock the useLeasingReviews hook
vi.mock("../../src/leasing/hooks/useLeasing", () => ({
  useLeasingReviews: vi.fn(),
  useSubmitReview: vi.fn(),
}));

afterEach(() => {
  cleanup(); // Reset DOM between tests
});

describe("LeasingReviewsSection Component", () => {
  it("renders a loading state initially", () => {
    vi.mocked(useLeasingHooks.useLeasingReviews).mockReturnValue({
      data: [],
      isLoading: true,
      error: null,
    });

    const { getByText } = render(<LeasingReviewsSection leasingId={1} />);

    expect(getByText("Chargement des avis...")).toBeDefined();
  });

  it("gracefully falls back to mock reviews if fetching fails", () => {
    vi.mocked(useLeasingHooks.useLeasingReviews).mockReturnValue({
      data: [],
      isLoading: false,
      error: new Error("Fetch failed"),
    });

    const { getByText } = render(<LeasingReviewsSection leasingId={1} />);

    // In demo/error mode, it renders 2 mock fallback reviews (Lina and Marthe)
    expect(getByText("Note moyenne : 4.5 / 5")).toBeDefined();
    expect(getByText("2 avis")).toBeDefined();
    expect(getByText("Lina")).toBeDefined();
    expect(getByText("Marthe")).toBeDefined();
  });

  it("renders custom database reviews and calculates average rating correctly", () => {
    const mockReviews = [
      { reviewerName: "John Doe", rating: 5, comment: "Super !", reviewDate: "2026-06-01T12:00:00Z" },
      { reviewerName: "Jane Smith", rating: 3, comment: "Moyen", reviewDate: "2026-05-30T12:00:00Z" },
    ];

    vi.mocked(useLeasingHooks.useLeasingReviews).mockReturnValue({
      data: mockReviews,
      isLoading: false,
      error: null,
    });

    const { getByText } = render(<LeasingReviewsSection leasingId={1} />);

    // Shows 2 reviews and correct calculated average rating (5 + 3)/2 = 4.0/5
    expect(getByText("Note moyenne : 4.0 / 5")).toBeDefined();
    expect(getByText("2 avis")).toBeDefined();

    // Assert name displaying first name only as per Figma spec
    expect(getByText("John")).toBeDefined();
    expect(getByText("Jane")).toBeDefined();
    expect(getByText("Super !")).toBeDefined();
    expect(getByText("Moyen")).toBeDefined();
  });
});
