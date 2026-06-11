import { Field, useFormikContext } from "formik";
import { useEffect } from "react";
import FieldError from "../FieldError.jsx";

const inputClassName =
  "w-full rounded-lg border border-[#858199] bg-white px-[14px] py-[14px] text-[18px] font-medium text-[#2f2d3c] outline-none placeholder:text-[#555261] focus:border-[#080036]";

const labelClassName =
  "mb-[10px] block text-[22px] font-extrabold leading-tight text-[#080036]";

function PriceInput({ id, name, placeholder = "0,00" }) {
  return (
    <div className="relative">
      <Field
        className={`${inputClassName} pr-[42px]`}
        id={id}
        min="0"
        name={name}
        placeholder={placeholder}
        step="0.01"
        type="number"
      />
      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[22px] font-semibold text-[#2f2d3c]">
        €
      </span>
      <FieldError name={name} />
    </div>
  );
}

function LocationCard() {
  const { values, setFieldValue } = useFormikContext();

  useEffect(() => {
    const perDay = Number(values.pricePerDay);
    if (!isNaN(perDay) && perDay >= 0) {
      setFieldValue("pricePerMonth", Math.round(perDay * 30));
    }
  }, [values.pricePerDay, setFieldValue]);

  return (
    <div className="rounded-xl bg-[#f4f3fb] px-[14px] py-[22px] font-figtree">
      <h2 className="mb-[22px] text-center text-[24px] font-extrabold leading-tight text-[#080036]">
        Location
      </h2>

      <div className="grid grid-cols-2 gap-[20px]">
        <div>
          <label className={labelClassName} htmlFor="pricePerDay">
            Prix / jour
          </label>
          <PriceInput id="pricePerDay" name="pricePerDay" placeholder="0" />
        </div>

        <div>
          <label className={labelClassName} htmlFor="pricePerMonth">
            Prix / mois
          </label>
          <div className="relative">
            <Field
              className={`${inputClassName} cursor-not-allowed bg-[#ebebf5] pr-[42px]`}
              disabled
              id="pricePerMonth"
              name="pricePerMonth"
              type="number"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[22px] font-semibold text-[#2f2d3c]">
              €
            </span>
          </div>
          <p className="mt-1 text-[12px] text-[#6b6b8a]">
            Calculé automatiquement (× 30)
          </p>
        </div>
      </div>
    </div>
  );
}

function TrocCard() {
  return (
    <div className="rounded-xl bg-[#f4f3fb] px-[14px] py-[22px] font-figtree">
      <h2 className="mb-[26px] text-center text-[24px] font-extrabold leading-tight text-[#080036]">
        Troc
      </h2>

      <div className="grid grid-cols-[190px_minmax(0,1fr)] items-center gap-[18px]">
        <label
          className="text-[24px] font-extrabold leading-tight text-[#080036]"
          htmlFor="estimatedPrice"
        >
          Prix estimé
        </label>
        <PriceInput id="estimatedPrice" name="estimatedPrice" />
      </div>
    </div>
  );
}

function SecondHandCard() {
  return (
    <div className="rounded-xl bg-[#f4f3fb] px-[14px] py-[22px] font-figtree">
      <h2 className="mb-[26px] text-center text-[24px] font-extrabold leading-tight text-[#080036]">
        Seconde main
      </h2>

      <div className="grid grid-cols-[190px_minmax(0,1fr)] items-center gap-[18px]">
        <label
          className="text-[24px] font-extrabold leading-tight text-[#080036]"
          htmlFor="price"
        >
          Prix
        </label>
        <PriceInput id="price" name="price" />
      </div>
    </div>
  );
}

export default function OptionalProductInfoStep() {
  const { values } = useFormikContext();

  if (values.mode === "TROC") {
    return <TrocCard />;
  }

  if (values.mode === "LOCATION") {
    return <LocationCard />;
  }

  return <SecondHandCard />;
}
