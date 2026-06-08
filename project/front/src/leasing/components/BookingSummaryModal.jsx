import { useFormik } from "formik";
import * as Yup from "yup";
import { useSubmitBooking, useLeasingProfile } from "../hooks/useLeasing";
import { useState } from "react";
import { useNavigate } from "react-router";

export default function BookingSummaryModal({
  leasingId,
  productTitle,
  startDate,
  endDate,
  totalPrice,
  onClose,
}) {
  const navigate = useNavigate();
  const [submitError, setSubmitError] = useState("");
  const [successData, setSuccessData] = useState(null);

  const { data: profile } = useLeasingProfile();
  const bookingMutation = useSubmitBooking(leasingId);

  // Formik configuration with Yup validation schema
  const formik = useFormik({
    initialValues: {
      deliveryStreet: profile?.street || "",
      deliveryZipCode: profile?.zipCode || "",
      deliveryCity: profile?.city || "",
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      deliveryStreet: Yup.string()
        .trim()
        .required("L'adresse (numéro + rue) est obligatoire"),
      deliveryZipCode: Yup.string()
        .trim()
        .required("Le code postal est obligatoire"),
      deliveryCity: Yup.string().trim().required("La ville est obligatoire"),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      setSubmitError("");
      try {
        const response = await bookingMutation.mutateAsync({
          startDate,
          endDate,
          deliveryStreet: values.deliveryStreet.trim(),
          deliveryZipCode: values.deliveryZipCode.trim(),
          deliveryCity: values.deliveryCity.trim(),
        });
        // Success state
        setSuccessData(response);
      } catch (err) {
        console.error("Failed to book leasing:", err);
        const apiMessage = err.response?.data?.message || err.message;
        setSubmitError(
          apiMessage || "Une erreur est survenue lors de la réservation.",
        );
      } finally {
        setSubmitting(false);
      }
    },
  });

  const handleReturnToCatalog = () => {
    onClose();
    navigate("/leasing/catalog");
  };

  // Format date helper for human readable display (FR format DD/MM/YYYY)
  const formatDateString = (dateStr) => {
    if (!dateStr) return "";
    const [year, month, day] = dateStr.split("-");
    return `${day}/${month}/${year}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 bg-[#040037]/60 backdrop-blur-xs font-['Figtree',sans-serif]">
      {/* Modal Container */}
      <div className="w-[240px] bg-white rounded-[8px] border border-[#E6E6E6] shadow-2xl overflow-hidden flex flex-col animate-fadeIn">
        {/* Header */}
        <div className="flex items-center justify-between px-[12px] py-[10px] border-b border-[#F2F2F5]">
          <h2 className="text-[10px] font-extrabold text-[#040037] uppercase tracking-wide">
            {successData
              ? "Réservation Réussie"
              : "Récapitulatif de réservation"}
          </h2>
          {!successData && (
            <button
              type="button"
              onClick={onClose}
              className="text-[#7C7A8A] hover:text-[#040037] focus:outline-none transition-colors"
            >
              <span className="material-symbols-rounded text-[14px]">
                close
              </span>
            </button>
          )}
        </div>

        {/* Success Screen */}
        {successData ? (
          <div className="p-[12px] flex flex-col items-center text-center">
            <span className="material-symbols-rounded text-[36px] text-green-500 mb-2">
              check_circle
            </span>
            <h3 className="text-[11px] font-bold text-[#040037] mb-[4px]">
              Votre réservation est validée !
            </h3>
            <p className="text-[8px] text-[#7C7A8A] leading-relaxed mb-4">
              L'article a été bloqué pour vos dates de location.
            </p>

            <div className="w-full bg-[#F2F2F9] rounded-[6px] p-[8px] text-left text-[8px] text-[#040037] flex flex-col gap-[4px] mb-4">
              <div>
                <span className="font-bold">Numéro de réservation :</span>{" "}
                <span className="font-extrabold">
                  {successData.reservationNumber}
                </span>
              </div>
              <div>
                <span className="font-bold">Date de livraison estimée :</span>{" "}
                <span className="font-extrabold">
                  {formatDateString(successData.estimatedDeliveryDate)}
                </span>
              </div>
              <div>
                <span className="font-bold">Prix total payé :</span>{" "}
                <span className="font-extrabold">
                  {(successData.totalPrice / 100).toLocaleString("fr-FR", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                  €
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleReturnToCatalog}
              className="bg-[#040037] text-white w-full rounded-[6px] py-[8px] text-[9px] font-extrabold uppercase hover:bg-[#040037]/90 transition"
            >
              Retour au catalogue
            </button>
          </div>
        ) : (
          /* Form / Summary Screen */
          <form
            onSubmit={formik.handleSubmit}
            className="p-[12px] flex flex-col"
          >
            {submitError && (
              <div className="p-2 mb-2 bg-red-50 border border-red-100 text-[7px] font-bold text-red-600 rounded-[4px] text-center">
                {submitError}
              </div>
            )}

            {/* Summary Details */}
            <div className="bg-[#F2F2F9] rounded-[6px] p-[8px] text-[8px] text-[#040037] flex flex-col gap-[3px] mb-3">
              <div className="truncate">
                <span className="font-bold">Article :</span> {productTitle}
              </div>
              <div>
                <span className="font-bold">Du :</span>{" "}
                {formatDateString(startDate)}
              </div>
              <div>
                <span className="font-bold">Au :</span>{" "}
                {formatDateString(endDate)}
              </div>
              <div className="font-bold border-t border-[#E6E6E6] pt-[3px] mt-[3px] text-[9px] flex justify-between">
                <span>Prix total :</span>
                <span>{totalPrice}€</span>
              </div>
            </div>

            {/* Address Form Fields */}
            <span className="text-[7px] font-bold text-[#7C7A8A] uppercase mb-[4px]">
              Adresse de livraison
            </span>

            {/* Street */}
            <div className="flex flex-col mb-2">
              <label htmlFor="deliveryStreetInput" className="sr-only">
                Numéro + Rue
              </label>
              <input
                id="deliveryStreetInput"
                type="text"
                name="deliveryStreet"
                placeholder="Numéro + Rue"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.deliveryStreet}
                className="border border-[#E6E6E6] rounded-[6px] p-[6px] text-[8px] text-[#040037] focus:outline-none focus:border-[#040037] bg-white placeholder-[#7C7A8A]"
              />
              {formik.touched.deliveryStreet &&
                formik.errors.deliveryStreet && (
                  <span className="text-[6px] text-red-500 font-bold mt-[1px]">
                    {formik.errors.deliveryStreet}
                  </span>
                )}
            </div>

            {/* Zip code */}
            <div className="flex flex-col mb-2">
              <label htmlFor="deliveryZipCodeInput" className="sr-only">
                Code Postal
              </label>
              <input
                id="deliveryZipCodeInput"
                type="text"
                name="deliveryZipCode"
                placeholder="Code Postal"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.deliveryZipCode}
                className="border border-[#E6E6E6] rounded-[6px] p-[6px] text-[8px] text-[#040037] focus:outline-none focus:border-[#040037] bg-white placeholder-[#7C7A8A]"
              />
              {formik.touched.deliveryZipCode &&
                formik.errors.deliveryZipCode && (
                  <span className="text-[6px] text-red-500 font-bold mt-[1px]">
                    {formik.errors.deliveryZipCode}
                  </span>
                )}
            </div>

            {/* City */}
            <div className="flex flex-col mb-2">
              <label htmlFor="deliveryCityInput" className="sr-only">
                Ville
              </label>
              <input
                id="deliveryCityInput"
                type="text"
                name="deliveryCity"
                placeholder="Ville"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.deliveryCity}
                className="border border-[#E6E6E6] rounded-[6px] p-[6px] text-[8px] text-[#040037] focus:outline-none focus:border-[#040037] bg-white placeholder-[#7C7A8A]"
              />
              {formik.touched.deliveryCity && formik.errors.deliveryCity && (
                <span className="text-[6px] text-red-500 font-bold mt-[1px]">
                  {formik.errors.deliveryCity}
                </span>
              )}
            </div>

            {/* Confirm button is disabled if empty fields or dirty validation */}
            <button
              type="submit"
              disabled={
                formik.isSubmitting ||
                !formik.values.deliveryStreet ||
                !formik.values.deliveryZipCode ||
                !formik.values.deliveryCity
              }
              className="bg-[#040037] text-white w-full rounded-[6px] py-[8px] flex items-center justify-center gap-[6px] text-[9px] font-extrabold uppercase mt-[6px] hover:bg-[#040037]/90 disabled:opacity-40 disabled:cursor-not-allowed transition active:scale-[0.98]"
            >
              {formik.isSubmitting ? (
                <span className="animate-pulse">Réservation...</span>
              ) : (
                <span>Confirmer</span>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
