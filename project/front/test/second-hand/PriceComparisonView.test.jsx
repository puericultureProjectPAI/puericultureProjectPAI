/**
 * @vitest-environment jsdom
 */

import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, it, expect, vi } from "vitest";
import * as matchers from "@testing-library/jest-dom/matchers";

import PriceComparisonResult from "../../src/second-hand/components/PriceComparisonResult.jsx";

expect.extend(matchers);

/**
 * MOCK NAVIGATE (IMPORTANT)
 */
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => vi.fn(),
  };
});

// MOCKS
const mockProduct = {
  name: "Pyjama gris",
  brand: "Kiabi",
  newPrice: 19.99,
};

const mockComparison = {
  listingsCount: 4,
  averageOccasionPrice: 8.9,
  savingsAmount: 11.09,
  savingsPercent: 55,
  lowSampleWarning: false,
};

describe("PriceComparisonResult Component", () => {
  it("Cas Succès", () => {
    render(
      <MemoryRouter>
        <PriceComparisonResult
          status="SUCCESS"
          product={mockProduct}
          comparison={mockComparison}
        />
      </MemoryRouter>,
    );

    expect(screen.getByText(/\+11.09€ économisés/i)).toBeInTheDocument();
  });

  it("Cas Vide", () => {
    render(
      <MemoryRouter>
        <PriceComparisonResult
          status="SUCCESS"
          product={mockProduct}
          comparison={{
            ...mockComparison,
            listingsCount: 0,
          }}
        />
      </MemoryRouter>,
    );

    expect(screen.getByText(/Aucun article disponible/i)).toBeInTheDocument();
  });

  it("Cas Erreur", () => {
    render(
      <MemoryRouter>
        <PriceComparisonResult status="ERROR" />
      </MemoryRouter>,
    );

    expect(screen.getByText(/Produit introuvable/i)).toBeInTheDocument();
  });

  it("Cas Loading", () => {
    const { container } = render(
      <MemoryRouter>
        <PriceComparisonResult status="LOADING" />
      </MemoryRouter>,
    );

    expect(container.querySelector(".animate-pulse")).toBeInTheDocument();
  });
});
