import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, it, expect } from "vitest";
import * as matchers from "@testing-library/jest-dom/matchers";
import PriceComparisonResult from "../../../src/second-hand/components/PriceComparisonResult.jsx";

// On lie les matchers à l'objet expect de Vitest
expect.extend(matchers);

// --- MOCKS ---
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
  it("Cas 1 : doit afficher le prix neuf barré et le prix moyen en vert", () => {
    render(
      <MemoryRouter>
        <PriceComparisonResult
          status="SUCCESS"
          product={mockProduct}
          comparison={mockComparison}
        />
      </MemoryRouter>,
    );

    const newPrice = screen.getByText("19.99€");
    expect(newPrice).toHaveClass("line-through");

    const occasionPrice = screen.getByText("8.9€");
    expect(occasionPrice).toHaveClass("text-green-600");

    expect(screen.getByText(/Voir les 4 annonces/i)).toBeInTheDocument();
  });

  it("Cas 2 : doit afficher le bouton Alerte Prix si aucune annonce n’est trouvée", () => {
    const emptyComparison = { ...mockComparison, listingsCount: 0 };
    render(
      <MemoryRouter>
        <PriceComparisonResult
          status="SUCCESS"
          product={mockProduct}
          comparison={emptyComparison}
        />
      </MemoryRouter>,
    );

    expect(screen.getByText(/Aucune annonce disponible/i)).toBeInTheDocument();
    expect(screen.getByText(/Créer une alerte prix/i)).toBeInTheDocument();
    expect(
      screen.getByText(/Créer une alerte prix/i).closest("button"),
    ).toHaveClass("bg-indigo-600");
  });

  it("Cas Loading : doit afficher le skeleton loader", () => {
    const { container } = render(
      <MemoryRouter>
        <PriceComparisonResult status="LOADING" />
      </MemoryRouter>,
    );
    expect(container.querySelector(".animate-pulse")).toBeInTheDocument();
  });

  it("Cas 3 : doit afficher le bloc formulaire en cas d’erreur 404", () => {
    render(
      <MemoryRouter>
        <PriceComparisonResult status="ERROR" />
      </MemoryRouter>,
    );

    expect(screen.getByText(/Produit introuvable/i)).toBeInTheDocument();
    expect(screen.getByText(/Scanner à nouveau/i)).toBeInTheDocument();
  });
});
