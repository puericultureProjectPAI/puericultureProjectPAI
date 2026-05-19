import { Field } from "formik";
import { useRef } from "react";
import { PRODUCT_CATEGORIES } from "../constants/publicationOptions";
import FieldError from "./FieldError";

export default function RequiredProductInfoStep({ setFieldValue, values }) {
  const fileInputRef = useRef(null);

  return (
    <div>
      <input
        accept="image/png,image/jpeg"
        className="hidden"
        onChange={(event) => {
          const [file] = event.target.files;
          if (file) {
            setFieldValue("imageReference", file.name);
          }
        }}
        ref={fileInputRef}
        type="file"
      />

      <p className="mb-2 text-center text-xs font-semibold text-[#5362d6]">
        Max 5 photos JPG ou PNG
      </p>
      <button
        className="mb-4 flex min-h-20 w-full items-center rounded-xl border border-[#9b99b5] bg-[#f5f4fb] px-4 text-left"
        onClick={() => fileInputRef.current?.click()}
        type="button"
      >
        <span className="flex h-16 w-16 flex-col items-center justify-center rounded-lg border border-dashed border-[#9b99b5] bg-white text-[#080036]">
          <span className="text-lg">＋</span>
          <span className="text-sm font-semibold">Ajouter</span>
        </span>
        {values.imageReference && (
          <span className="ml-4 text-xs font-medium text-[#5f5b78]">
            {values.imageReference}
          </span>
        )}
      </button>
      <FieldError name="imageReference" />

      <label
        className="mb-2 mt-4 block text-sm font-extrabold text-[#080036]"
        htmlFor="title"
      >
        Nom de l'article
      </label>
      <Field
        className="mb-1 w-full rounded-md border border-[#b8b6c7] px-3 py-2 text-sm outline-none focus:border-[#080036]"
        id="title"
        name="title"
        placeholder="Ex : Veste en jean bleue"
      />
      <FieldError name="title" />

      <label
        className="mb-2 mt-4 block text-sm font-extrabold text-[#080036]"
        htmlFor="description"
      >
        Description
      </label>
      <Field
        as="textarea"
        className="mb-1 min-h-16 w-full rounded-md border border-[#b8b6c7] px-3 py-2 text-sm outline-none focus:border-[#080036]"
        id="description"
        name="description"
        placeholder="Décrivez l’article..."
      />
      <FieldError name="description" />

      <label
        className="mb-2 mt-4 block text-sm font-extrabold text-[#080036]"
        htmlFor="category"
      >
        Catégorie
      </label>
      <Field
        as="select"
        className="w-full rounded-md border border-[#b8b6c7] bg-white px-3 py-2 text-sm outline-none focus:border-[#080036]"
        id="category"
        name="category"
      >
        <option value="">Select</option>
        {PRODUCT_CATEGORIES.map((category) => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
      </Field>
      <FieldError name="category" />

      <label
        className="mb-2 mt-4 block text-sm font-extrabold text-[#080036]"
        htmlFor="city"
      >
        Ville
      </label>
      <Field
        className="w-full rounded-md border border-[#b8b6c7] bg-white px-3 py-2 text-sm outline-none focus:border-[#080036]"
        id="city"
        name="city"
        placeholder="Ville"
      />
      <FieldError name="city" />
    </div>
  );
}
