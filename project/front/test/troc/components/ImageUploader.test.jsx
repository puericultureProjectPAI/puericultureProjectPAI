// @vitest-environment jsdom
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import * as matchers from "@testing-library/jest-dom/matchers";
import ImageUploader from "../../../src/troc/components/ImageUploader";

expect.extend(matchers);

function makeFiles(count, type = "image/jpeg") {
  return Array.from({ length: count }, (_, i) =>
    Object.assign(new File(["content"], `photo${i}.jpg`, { type }), {}),
  );
}

describe("ImageUploader", () => {
  it("bloque l'upload et affiche une erreur si plus de 5 photos sont sélectionnées", async () => {
    render(<ImageUploader onImagesChange={vi.fn()} />);

    const input = document.querySelector('input[type="file"]');

    fireEvent.change(input, { target: { files: makeFiles(6) } });

    await waitFor(() => {
      expect(screen.getByText(/Maximum 5 images/i)).toBeInTheDocument();
    });
  });

  it("affiche une erreur pour un format de fichier non supporté", async () => {
    render(<ImageUploader onImagesChange={vi.fn()} />);

    const input = document.querySelector('input[type="file"]');
    const pdfFile = new File(["content"], "document.pdf", {
      type: "application/pdf",
    });

    fireEvent.change(input, { target: { files: [pdfFile] } });

    await waitFor(() => {
      expect(screen.getByText(/Format non supporté/i)).toBeInTheDocument();
    });
  });

  it("appelle onImagesChange avec les fichiers valides sélectionnés", async () => {
    const onImagesChange = vi.fn();
    render(<ImageUploader onImagesChange={onImagesChange} />);

    const input = document.querySelector('input[type="file"]');
    const files = makeFiles(2);

    fireEvent.change(input, { target: { files } });

    await waitFor(() => {
      expect(onImagesChange).toHaveBeenCalledWith(
        expect.arrayContaining([expect.any(File)]),
      );
    });
  });
});
