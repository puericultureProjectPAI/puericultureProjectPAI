/* @vitest-environment jsdom */

import "@testing-library/jest-dom/vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import PublishAnnouncementForm from "./PublishAnnouncementForm";

describe("PublishAnnouncementForm", () => {
  it("submits the expected payload after the full Troc publication flow", async () => {
    const onSubmit = vi.fn().mockResolvedValue(true);
    const { container } = render(
      <PublishAnnouncementForm error="" onSubmit={onSubmit} success="" />,
    );

    fireEvent.click(screen.getByRole("button", { name: /continuer/i }));

    await screen.findByText(/Max 5 photos JPG ou PNG/i);
    const fileInput = container.querySelector('input[type="file"]');
    const file = new File(["image content"], "poussette.png", {
      type: "image/png",
    });

    fireEvent.change(fileInput, { target: { files: [file] } });
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

    fireEvent.click(screen.getByRole("button", { name: /continuer/i }));

    await screen.findByText(/informations optionnelles/i);
    fireEvent.change(screen.getByLabelText(/État/i), {
      target: { value: "Très bon état" },
    });
    fireEvent.change(screen.getByLabelText(/Marque/i), {
      target: { value: "Kiabi" },
    });
    fireEvent.change(screen.getByLabelText(/Modèle/i), {
      target: { value: "Lullaby" },
    });
    fireEvent.change(screen.getByLabelText(/Dimensions/i), {
      target: { value: "60 x 40 cm" },
    });
    fireEvent.change(screen.getByLabelText(/Dernier contrôle/i), {
      target: { value: "2026-05-21" },
    });
    fireEvent.change(screen.getByLabelText(/Poids max/i), {
      target: { value: "15" },
    });
    fireEvent.change(screen.getByLabelText(/Norme de sécurité/i), {
      target: { value: "EN 1888" },
    });
    fireEvent.change(screen.getByLabelText(/Âge min/i), {
      target: { value: "0" },
    });
    fireEvent.change(screen.getByLabelText(/Âge max/i), {
      target: { value: "36" },
    });

    fireEvent.click(screen.getByRole("button", { name: /continuer/i }));

    await screen.findByRole("button", { name: /publier/i });
    fireEvent.change(screen.getByLabelText(/Prix estimé/i), {
      target: { value: "40" },
    });
    fireEvent.change(screen.getByLabelText(/Rayon/i), {
      target: { value: "10" },
    });
    fireEvent.change(screen.getByLabelText(/Je cherche/i), {
      target: { value: "Lit parapluie" },
    });

    fireEvent.click(screen.getByRole("button", { name: /publier/i }));

    await waitFor(() => expect(onSubmit).toHaveBeenCalledTimes(1));
    expect(onSubmit).toHaveBeenCalledWith({
      title: "Poussette bébé",
      description: "Poussette bébé en très bon état",
      estimatedPrice: 40,
      imageReference: "poussette.png",
      city: "Lille",
      category: "Poussettes, porte-bébés et sièges auto",
      condition: "Très bon état",
      brand: "Kiabi",
      model: "Lullaby",
      dimensions: "60 x 40 cm",
      lastCheckDate: "2026-05-21",
      securityStandard: "EN 1888",
      maxWeightKg: 15,
      minAgeMonths: 0,
      maxAgeMonths: 36,
    });
  });
});
