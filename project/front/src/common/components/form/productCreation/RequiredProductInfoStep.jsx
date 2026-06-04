import { Field } from "formik";
import {
  AGE_RANGE_OPTIONS,
  CONDITION_OPTIONS,
  PRODUCT_CATEGORIES,
  WEIGHT_OPTIONS,
} from "../../../../troc/constants/publicationOptions.js";
import FieldError from "../FieldError.jsx";
import MyImageInput from "../MyImageInput.jsx";

const fieldClassName =
  "w-full rounded-md border border-[#858199] bg-white px-3 py-[9px] text-[14px] font-medium text-[#2f2d3c] outline-none placeholder:text-[#555261] focus:border-[#080036]";
const labelClassName =
  "mb-[7px] block text-[16px] font-extrabold leading-tight text-[#080036]";

export default function RequiredProductInfoStep() {
  return (
    <div>
      <p className="mb-[10px] text-center text-[16px] font-medium text-[#3957d8]">
        Max 5 photos JPG ou PNG
      </p>
      <MyImageInput name="images" maxImages={5} />

      <label className={`${labelClassName} mt-[15px]`} htmlFor="title">
        Nom de l'article
      </label>
      <Field
        className={fieldClassName}
        id="title"
        name="title"
        placeholder="Ex : Veste en jean bleue"
      />
      <FieldError name="title" />

      <label className={`${labelClassName} mt-[14px]`} htmlFor="description">
        Description
      </label>
      <Field
        as="textarea"
        className={`${fieldClassName} min-h-[66px] resize-none`}
        id="description"
        name="description"
        placeholder="Décrivez l’article..."
      />
      <FieldError name="description" />

      <div className="mt-[18px] grid grid-cols-2 gap-[16px]">
        <div>
          <label className={labelClassName} htmlFor="category">
            Catégorie
          </label>
          <Field
            as="select"
            className={fieldClassName}
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
        </div>

        <div>
          <label className={labelClassName} htmlFor="condition">
            État
          </label>
          <Field
            as="select"
            className={fieldClassName}
            id="condition"
            name="condition"
          >
            <option value="">Select</option>
            {CONDITION_OPTIONS.map((condition) => (
              <option key={condition} value={condition}>
                {condition}
              </option>
            ))}
          </Field>
          <FieldError name="condition" />
        </div>
      </div>

      <label className={`${labelClassName} mt-[16px]`} htmlFor="brand">
        Marque
      </label>
      <Field
        className={fieldClassName}
        id="brand"
        name="brand"
        placeholder="Ex : IKEA"
      />

      <div className="mt-[16px] grid grid-cols-2 gap-[16px]">
        <div>
          <label className={labelClassName} htmlFor="ageRange">
            Tranche d'âge
          </label>
          <Field
            as="select"
            className={fieldClassName}
            id="ageRange"
            name="ageRange"
          >
            <option value="">Select</option>
            {AGE_RANGE_OPTIONS.map((ageRange) => (
              <option key={ageRange} value={ageRange}>
                {ageRange}
              </option>
            ))}
          </Field>
        </div>

        <div>
          <label className={labelClassName} htmlFor="maxWeightKg">
            Poids max
          </label>
          <Field
            as="select"
            className={fieldClassName}
            id="maxWeightKg"
            name="maxWeightKg"
          >
            <option value="">Select</option>
            {WEIGHT_OPTIONS.map((weight) => (
              <option key={weight} value={weight}>
                {weight}
              </option>
            ))}
          </Field>
        </div>
      </div>

      <label className={`${labelClassName} mt-[16px]`} htmlFor="lengthCm">
        Dimensions
      </label>
      <div className="grid grid-cols-2 gap-[12px]">
        <div className="relative">
          <Field
            className="w-full rounded-md border border-[#858199] bg-white px-3 py-[9px] pr-[44px] text-[14px] font-medium text-[#2f2d3c] outline-none placeholder:text-[#555261] focus:border-[#080036]"
            id="lengthCm"
            name="lengthCm"
            placeholder="Long"
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[14px] font-medium text-[#2f2d3c]">
            cm
          </span>
        </div>
        <div className="relative">
          <Field
            className="w-full rounded-md border border-[#858199] bg-white px-3 py-[9px] pr-[44px] text-[14px] font-medium text-[#2f2d3c] outline-none placeholder:text-[#555261] focus:border-[#080036]"
            id="widthCm"
            name="widthCm"
            placeholder="Larg"
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[14px] font-medium text-[#2f2d3c]">
            cm
          </span>
        </div>
      </div>

      <label className={`${labelClassName} mt-[16px]`} htmlFor="estimatedPrice">
        Prix
      </label>
      <div className="relative">
        <Field
          className={`${fieldClassName} pr-9`}
          id="estimatedPrice"
          min="0"
          name="estimatedPrice"
          placeholder="0,00"
          step="0.01"
          type="number"
        />
        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[18px] font-semibold text-[#2f2d3c]">
          €
        </span>
      </div>
      <FieldError name="estimatedPrice" />
    </div>
  );
}
