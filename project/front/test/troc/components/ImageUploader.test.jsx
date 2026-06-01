// @vitest-environment jsdom
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import * as matchers from "@testing-library/jest-dom/matchers";
import { Formik, Form } from "formik";
import MyImageInput from "../../../src/common/components/form/MyImageInput";

expect.extend(matchers);

const { uploadMock, deleteMock } = vi.hoisted(() => ({
  uploadMock: vi.fn().mockResolvedValue("https://example.com/photo.jpg"),
  deleteMock: vi.fn().mockResolvedValue(true),
}));

vi.mock("../../../src/common/hooks/useProductImage", () => ({
  useProductImage: () => ({
    uploadImage: uploadMock,
    deleteImage: deleteMock,
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

  it("masque le bouton d'ajout quand la limite est atteinte", async () => {
    const { container } = renderInFormik([
      "https://example.com/1.jpg",
      "https://example.com/2.jpg",
      "https://example.com/3.jpg",
      "https://example.com/4.jpg",
      "https://example.com/5.jpg",
    ]);
    await waitFor(() => {
      expect(
        container.querySelector('input[type="file"]'),
      ).not.toBeInTheDocument();
    });
  });

  it("n'uploade pas les formats non supportés", async () => {
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
