// @vitest-environment jsdom
import { describe, it, expect, vi, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import LeasingReviewsSection from "../../src/leasing/components/LeasingReviewsSection";
import * as useLeasingHooks from "../../src/leasing/hooks/useLeasing";

// Mock the useLeasingReviewsData hook
vi.mock("../../src/leasing/hooks/useLeasing", () => ({
  useLeasingReviewsData: vi.fn(),
  useSubmitReview: vi.fn(),
}));

afterEach(() => {
  cleanup(); // Reset DOM between tests
});

describe("LeasingReviewsSection Component", () => {
  it("renders a loading state initially", () => {
    vi.mocked(useLeasingHooks.useLeasingReviewsData).mockReturnValue({
      reviews: [],
      averageRating: "0.0",
      totalReviews: 0,
      isLoading: true,
      error: null,
    });

    const { getByText } = render(<LeasingReviewsSection leasingId={1} />);

    expect(getByText("Chargement des avis...")).toBeDefined();
  });

  it("renders empty state if fetching returns empty or fails", () => {
    vi.mocked(useLeasingHooks.useLeasingReviewsData).mockReturnValue({
      reviews: [],
      averageRating: null,
      totalReviews: 0,
      isLoading: false,
      error: new Error("Fetch failed"),
    });

    const { queryByText, getByText } = render(
      <LeasingReviewsSection leasingId={1} />,
    );

    // Rating header must NOT be displayed when there are no reviews
    expect(queryByText(/Note moyenne/)).toBeNull();
    expect(queryByText("0 avis")).toBeNull();
    expect(getByText("Soyez le premier à laisser un avis")).toBeDefined();
  });

  it("renders custom database reviews and calculates average rating correctly", () => {
    const mockReviews = [
      {
        reviewerName: "John",
        rating: 5,
        comment: "Super !",
        reviewDate: "2026-06-01T12:00:00Z",
        timeAgo: "Il y a 1 jour",
      },
      {
        reviewerName: "Jane",
        rating: 3,
        comment: "Moyen",
        reviewDate: "2026-05-30T12:00:00Z",
        timeAgo: "Il y a 3 jours",
      },
    ];

    vi.mocked(useLeasingHooks.useLeasingReviewsData).mockReturnValue({
      reviews: mockReviews,
      averageRating: "4.0",
      totalReviews: 2,
      isLoading: false,
      error: null,
    });

    const { getByText } = render(<LeasingReviewsSection leasingId={1} />);

    expect(getByText("Note moyenne : 4.0 / 5")).toBeDefined();
    expect(getByText("2 avis")).toBeDefined();

    expect(getByText("John")).toBeDefined();
    expect(getByText("Jane")).toBeDefined();
    expect(getByText("Super !")).toBeDefined();
    expect(getByText("Moyen")).toBeDefined();
  });
});
