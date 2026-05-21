// @vitest-environment jsdom
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import * as matchers from "@testing-library/jest-dom/matchers";
import { Formik, Form } from "formik";
import MyImageInput from "../../../src/common/components/form/MyImageInput";

expect.extend(matchers);

vi.mock("../../../src/common/hooks/useProductImage", () => ({
  useProductImage: () => ({
    uploadImage: vi.fn().mockResolvedValue("https://example.com/photo.jpg"),
    deleteImage: vi.fn().mockResolvedValue(true),
    isUploading: false,
    isDeleting: false,
    error: null,
  }),
}));

function renderInFormik(initialImages = []) {
  return render(
    <Formik initialValues={{ images: initialImages }} onSubmit={vi.fn()}>
      <Form>
        <MyImageInput name="images" label="Photos" maxImages={5} />
      </Form>
    </Formik>,
  );
}

describe("MyImageInput", () => {
  it("affiche le compteur d'images", () => {
    renderInFormik();
    expect(screen.getByText(/Photos \(0\/5\)/i)).toBeInTheDocument();
  });

  it("affiche les previews des images déjà présentes", () => {
    renderInFormik(["https://example.com/a.jpg", "https://example.com/b.jpg"]);
    expect(screen.getAllByRole("img")).toHaveLength(2);
  });

  it("masque le bouton d'ajout quand la limite est atteinte", () => {
    renderInFormik([
      "https://example.com/1.jpg",
      "https://example.com/2.jpg",
      "https://example.com/3.jpg",
      "https://example.com/4.jpg",
      "https://example.com/5.jpg",
    ]);
    expect(
      document.querySelector('input[type="file"]'),
    ).not.toBeInTheDocument();
  });

  it("n'uploade pas les formats non supportés", async () => {
    const { useProductImage } =
      await import("../../../src/common/hooks/useProductImage");
    const uploadMock = useProductImage().uploadImage;

    renderInFormik();
    const input = document.querySelector('input[type="file"]');
    const pdfFile = new File(["content"], "doc.pdf", {
      type: "application/pdf",
    });

    fireEvent.change(input, { target: { files: [pdfFile] } });

    await waitFor(() => {
      expect(uploadMock).not.toHaveBeenCalled();
    });
  });
});
