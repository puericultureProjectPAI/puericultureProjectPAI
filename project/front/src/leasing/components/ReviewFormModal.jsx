import { useFormik } from "formik";
import * as Yup from "yup";
import { useSubmitReview } from "../hooks/useLeasing";
import { useState } from "react";

export default function ReviewFormModal({ leasingId, onClose }) {
  const [submitError, setSubmitError] = useState("");
  const submitReviewMutation = useSubmitReview(leasingId);

  // Formik configuration with Yup validation schema
  const formik = useFormik({
    initialValues: {
      leasingOrderId: "1", // Pre-filled valid order id for seamless backend connection
      rating: 5,
      comment: "",
    },
    validationSchema: Yup.object({
      leasingOrderId: Yup.number()
        .typeError("L'ID de commande doit être un nombre")
        .integer("L'ID de commande doit être un entier")
        .positive("L'ID de commande doit être supérieur à 0")
        .required("Identifiant requis"),
      rating: Yup.number()
        .min(1, "1 étoile minimum")
        .max(5, "5 étoiles maximum")
        .required("Sélectionnez une note"),
      comment: Yup.string().max(280, "Le commentaire ne peut pas dépasser 280 caractères"),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      setSubmitError("");
      try {
        await submitReviewMutation.mutateAsync({
          leasingOrderId: parseInt(values.leasingOrderId, 10),
          rating: values.rating,
          comment: values.comment || null,
        });
        // Success: close modal automatically
        onClose();
      } catch (err) {
        console.error("Failed to submit review:", err);
        const apiMessage = err.response?.data?.message || err.message;
        setSubmitError(
          apiMessage === "Cette commande n'existe pas, ne vous appartient pas ou ne correspond pas à ce produit."
            ? "Commande invalide ou déjà évaluée."
            : "Une erreur est survenue."
        );
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 bg-[#040037]/60 backdrop-blur-xs font-['Figtree',sans-serif]">
      {/* Modal Container */}
      <div className="w-[240px] bg-white rounded-[8px] border border-[#E6E6E6] shadow-2xl overflow-hidden flex flex-col animate-fadeIn">
        
        {/* Header */}
        <div className="flex items-center justify-between px-[12px] py-[10px] border-b border-[#F2F2F5]">
          <h2 className="text-[10px] font-extrabold text-[#040037] uppercase tracking-wide">
            Donner votre avis
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-[#7C7A8A] hover:text-[#040037] focus:outline-none transition-colors"
          >
            <span className="material-symbols-rounded text-[14px]">
              close
            </span>
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={formik.handleSubmit} className="p-[12px] flex flex-col">
          
          {submitError && (
            <div className="p-2 mb-2 bg-red-50 border border-red-100 text-[7px] font-bold text-red-600 rounded-[4px] text-center">
              {submitError}
            </div>
          )}

          {/* Interactive Stars Row */}
          <div className="flex justify-center items-center gap-[4px] py-[6px]">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                type="button"
                key={star}
                onClick={() => formik.setFieldValue("rating", star)}
                className="focus:outline-none cursor-pointer transition-transform active:scale-90"
              >
                <span 
                  className={`material-symbols-rounded text-[22px] ${
                    star <= formik.values.rating 
                      ? "text-[#040037] fill-current" 
                      : "text-gray-200"
                  }`}
                  style={{ fontVariationSettings: star <= formik.values.rating ? "'FILL' 1" : "'FILL' 0" }}
                >
                  star
                </span>
              </button>
            ))}
          </div>

          {/* Hidden/Subtle Order ID Field (needed for database integrity) */}
          <div className="flex items-center justify-between mb-2">
            <span className="text-[7px] text-[#7C7A8A] font-bold">ID Commande:</span>
            <input
              type="text"
              name="leasingOrderId"
              onChange={formik.handleChange}
              value={formik.values.leasingOrderId}
              className="w-[50px] px-1 py-[2px] bg-gray-50 border border-[#E6E6E6] rounded-[4px] text-[7px] text-center focus:outline-none focus:border-[#040037]"
            />
          </div>

          {/* Comment Textarea Box */}
          <div className="relative mt-[2px] flex flex-col">
            <textarea
              name="comment"
              placeholder="Votre commentaire (optionnel)"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.comment}
              rows="4"
              className="w-full border border-[#E6E6E6] rounded-[6px] p-[8px] text-[8px] leading-tight text-[#040037] focus:outline-none focus:border-[#040037] resize-none bg-white placeholder-[#7C7A8A]"
            />
            {formik.touched.comment && formik.errors.comment ? (
              <span className="text-[7px] text-red-500 font-bold mt-[2px]">
                {formik.errors.comment}
              </span>
            ) : null}
            
            {/* Max characters helper label inside bottom right */}
            <span className="self-end text-[7px] text-[#7C7A8A] font-medium mt-[4px]">
              caractères max 280.
            </span>
          </div>

          {/* Confirm Validation Button */}
          <button
            type="submit"
            disabled={formik.isSubmitting}
            className="bg-[#040037] text-white w-full rounded-[6px] py-[8px] flex items-center justify-center gap-[6px] text-[9px] font-extrabold uppercase mt-[10px] hover:bg-[#040037]/90 disabled:opacity-50 transition active:scale-[0.98]"
          >
            {formik.isSubmitting ? (
              <span className="animate-pulse">Envoi...</span>
            ) : (
              <span>Confirmer</span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
