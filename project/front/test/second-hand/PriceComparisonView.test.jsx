/**
 * @vitest-environment jsdom
 */
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, it, expect } from "vitest";
import * as matchers from "@testing-library/jest-dom/matchers";
import PriceComparisonResult from "../../src/second-hand/components/PriceComparisonResult.jsx";

// Liaison des matchers pour Vitest
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
  it("Cas Succès : doit afficher le prix neuf barré et l’économie", () => {
    render(
      <MemoryRouter>
        <PriceComparisonResult
          status="SUCCESS"
          product={mockProduct}
          comparison={mockComparison}
        />
      </MemoryRouter>,
    );

    // Vérification du prix neuf avec la classe line-through
    const newPrice = screen.getByText(/19.99€/);
    expect(newPrice).toHaveClass("line-through");

    // Vérification de l'économie
    expect(screen.getByText(/\+11.09€ économisés/)).toBeInTheDocument();

    // Vérification du bouton principal (Bleu Foncé Kiabi)
    const mainBtn = screen.getByRole("button", {
      name: /Voir les 4 annonces/i,
    });
    expect(mainBtn).toHaveClass("bg-[#000033]");
  });

  it('Cas Vide : doit afficher le bouton "Créer une alerte prix" en indigo', () => {
    const emptyComp = { ...mockComparison, listingsCount: 0 };
    render(
      <MemoryRouter>
        <PriceComparisonResult
          status="SUCCESS"
          product={mockProduct}
          comparison={emptyComp}
        />
      </MemoryRouter>,
    );

    // On utilise getAllByText car le message peut apparaître plusieurs fois
    expect(
      screen.getAllByText(/Aucun article disponible/i)[0],
    ).toBeInTheDocument();

    // Le bouton doit être Indigo
    const alertBtn = screen.getByRole("button", {
      name: /Créer une alerte prix/i,
    });
    expect(alertBtn).toHaveClass("bg-indigo-600");
  });

  it('Cas Erreur : doit gérer les boutons "Scanner à nouveau" multiples', () => {
    render(
      <MemoryRouter>
        <PriceComparisonResult status="ERROR" />
      </MemoryRouter>,
    );

    expect(screen.getByText(/Produit introuvable/i)).toBeInTheDocument();

    // Comme il y a plusieurs boutons "Scanner à nouveau" dans le code,
    // on utilise getAllByRole pour vérifier qu'au moins un existe.
    const scanButtons = screen.getAllByRole("button", {
      name: /Scanner à nouveau/i,
    });
    expect(scanButtons.length).toBeGreaterThan(0);
  });

  it("Cas Loading : doit afficher le skeleton loader (pulse)", () => {
    const { container } = render(
      <MemoryRouter>
        <PriceComparisonResult status="LOADING" />
      </MemoryRouter>,
    );

    // Vérifie la présence de la classe d'animation du skeleton
    expect(container.querySelector(".animate-pulse")).toBeInTheDocument();
  });
});
