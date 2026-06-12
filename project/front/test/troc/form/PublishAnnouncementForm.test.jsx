/* @vitest-environment jsdom */

import "@testing-library/jest-dom/vitest";
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { MemoryRouter } from "react-router-dom"; // L'injection du contexte de navigation
import { describe, expect, it, vi } from "vitest";
import PublishAnnouncementForm from "../../../src/common/components/form/productCreation/PublishAnnouncementForm.jsx";

const { uploadMock, navigateMock } = vi.hoisted(() => ({
  uploadMock: vi.fn().mockResolvedValue("https://example.com/photo.jpg"),
  navigateMock: vi.fn(),
}));

// 1. On bloque la façade
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => navigateMock,
  };
});

// 2. On bloque le noyau dur (La faille est ici)
vi.mock("react-router", async () => {
  const actual = await vi.importActual("react-router");
  return {
    ...actual,
    useNavigate: () => navigateMock,
  };
});

vi.mock("../../../src/common/hooks/useImageManager", () => ({
  useImageManager: () => ({
    uploadImage: uploadMock,
    deleteImage: vi.fn().mockResolvedValue(true),
    isUploading: false,
    isDeleting: false,
    error: null,
  }),
}));

describe("PublishAnnouncementForm", () => {
  it("submits the expected payload after the full Troc publication flow", async () => {
    const onSubmit = vi.fn().mockResolvedValue(true);

    // 1. On enveloppe le composant dans le routeur en mémoire
    const { container } = render(
      <MemoryRouter>
        <PublishAnnouncementForm error="" onSubmit={onSubmit} success="" />
      </MemoryRouter>,
    );

    // --- Étape 1 : Choix du Mode ---
    fireEvent.click(screen.getByRole("button", { name: /troc/i }));
    fireEvent.click(screen.getByRole("button", { name: /continuer/i }));

    // --- Étape 2 : Informations Produit (Prix inclus) ---
    await screen.findByLabelText(/Nom de l'article/i);
    const fileInput = container.querySelector('input[type="file"]');
    const file = new File(["image content"], "poussette.png", {
      type: "image/png",
    });

    await act(async () => {
      fireEvent.change(fileInput, { target: { files: [file] } });
    });

    fireEvent.change(screen.getByLabelText(/Nom de l'article/i), {
      target: { value: "Poussette bébé" },
    });
    fireEvent.change(screen.getByLabelText(/Description/i), {
      target: { value: "Poussette bébé en très bon état" },
    });
    fireEvent.change(screen.getByLabelText(/Catégorie/i), {
      target: { value: "Poussettes, porte-bébés et sièges auto" },
    });
    fireEvent.change(screen.getByLabelText(/Ville/i), {
      target: { value: "Lille" },
    });
    fireEvent.change(screen.getByLabelText(/État/i), {
      target: { value: "Très bon état" },
    });

    // Le prix est maintenant renseigné directement sur cette même étape
    fireEvent.change(screen.getByLabelText(/Prix estimé/i), {
      target: { value: 40 },
    });

    // Validation finale du formulaire
    // (Ajuste le nom du bouton en /continuer/i ou /publier/i selon le texte géré par ton composant PublicationFormActions à la dernière étape)
    fireEvent.click(screen.getByRole("button", { name: /publier/i }));

    await waitFor(() => expect(onSubmit).toHaveBeenCalledTimes(1));

    // 2. Les assertions sont corrigées pour s'attendre à des nulls propres au lieu de NaN
    expect(onSubmit).toHaveBeenCalledWith("TROC", {
      title: "Poussette bébé",
      description: "Poussette bébé en très bon état",
      estimatedPrice: 40,
      images: ["https://example.com/photo.jpg"],
      city: "Lille",
      category: "Poussettes, porte-bébés et sièges auto",
      condition: "Très bon état",
      price: 0,
      brand: "",
      dailyPrice: 0,
      dimensions: "",
      maxAgeMonths: null,
      minAgeMonths: null,
      maxWeightKg: null,
      rentalEndDate: "",
      rentalStartDate: "",
    });
  });
});
