/* @vitest-environment jsdom */

import "@testing-library/jest-dom/vitest";
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import PublishAnnouncementForm from "../../../src/common/components/form/productCreation/PublishAnnouncementForm.jsx";

const { uploadMock } = vi.hoisted(() => ({
  uploadMock: vi.fn().mockResolvedValue("https://example.com/photo.jpg"),
}));

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
    const { container } = render(
      <PublishAnnouncementForm error="" onSubmit={onSubmit} success="" />,
    );

    fireEvent.click(screen.getByRole("button", { name: /troc/i }));
    fireEvent.click(screen.getByRole("button", { name: /continuer/i }));

    // Step 2: all required TROC fields (TROC submits directly from step 2)
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

    fireEvent.click(screen.getByRole("button", { name: /continuer/i }));

    await screen.findByRole("button", { name: /publier/i });
    fireEvent.change(screen.getByLabelText(/Prix estimé/i), {
      target: { value: 40 },
    });

    fireEvent.click(screen.getByRole("button", { name: /publier/i }));

    await waitFor(() => expect(onSubmit).toHaveBeenCalledTimes(1));
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
      maxAgeMonths: NaN,
      minAgeMonths: NaN,
      maxWeightKg: NaN,
      rentalEndDate: "",
      rentalStartDate: "",
    });
  });
});
