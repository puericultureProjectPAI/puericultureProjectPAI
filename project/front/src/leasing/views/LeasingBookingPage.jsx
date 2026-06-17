import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  useSubmitBooking,
  useSubmitPackBooking,
  useLeasingProfile,
} from "../hooks/useLeasing";
import { useAuth } from "../../common/security/AuthContext";
import LeasingBackHeader from "../components/LeasingBackHeader";

const formatDateFR = (dateStr) => {
  if (!dateStr) return "";
  const [year, month, day] = dateStr.split("-");
  return `${day}/${month}/${year}`;
};

const formatReservationNumber = (reservationNumber) =>
  reservationNumber
    ? `N°${String(reservationNumber).replace(/^RES-/, "")}`
    : "";

export default function LeasingBookingPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  const {
    isPack = false,
    products = [],
    productIds = [],
    productTitle = "",
    startDate = "",
    endDate = "",
    totalPrice = 0,
    firstImageUrl = null,
  } = location.state || {};

  const [submitError, setSubmitError] = useState("");
  const [successData, setSuccessData] = useState(null);

  const { data: profile } = useLeasingProfile();
  const bookingMutation = useSubmitBooking(id);
  const packBookingMutation = useSubmitPackBooking();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (!startDate || !endDate) {
      navigate(isPack ? "/leasing/catalog" : `/leasing/products/${id}`);
      return;
    }

    if (isPack && productIds.length === 0) {
      navigate("/leasing/catalog");
    }
  }, [startDate, endDate, id, isPack, navigate, productIds.length]);

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
        const bookingPayload = {
          startDate,
          endDate,
          deliveryStreet: values.deliveryStreet.trim(),
          deliveryZipCode: values.deliveryZipCode.trim(),
          deliveryCity: values.deliveryCity.trim(),
        };
        const response = isPack
          ? await packBookingMutation.mutateAsync({
              ...bookingPayload,
              productIds,
            })
          : await bookingMutation.mutateAsync(bookingPayload);
        setSuccessData(response);
      } catch (err) {
        const apiMessage = err.response?.data?.message || err.message;
        setSubmitError(
          apiMessage || "Une erreur est survenue lors de la réservation.",
        );
      } finally {
        setSubmitting(false);
      }
    },
  });

  const isFormValid =
    formik.values.deliveryStreet.trim() &&
    formik.values.deliveryZipCode.trim() &&
    formik.values.deliveryCity.trim() &&
    (!isPack || productIds.length > 0);

  const fallbackImage = `https://placehold.co/135x135?text=${encodeURIComponent(productTitle || "Article")}`;
  const reservationNumbers =
    successData?.reservationNumbers ||
    (successData?.reservationNumber ? [successData.reservationNumber] : []);

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden bg-white text-[#040037] font-['Figtree',sans-serif]">
      <LeasingBackHeader />

      <main className="min-h-0 flex-1 overflow-y-auto">
        {successData ? (
          <div className="flex flex-col items-center justify-center min-h-full px-[24px] py-[24px] text-center">
            <span className="material-symbols-rounded text-[64px] text-[#188638] mb-[16px]">
              check_circle
            </span>
            <h2 className="font-bold text-[20px] text-[#040037] mb-[8px]">
              {isPack ? "Pack réservé !" : "Réservation confirmée !"}
            </h2>
            <p className="font-normal text-[16px] text-[#757388] leading-normal mb-[24px]">
              {isPack
                ? "Les articles ont été bloqués pour vos dates de location."
                : "L'article a été bloqué pour vos dates de location."}
            </p>

            <div className="w-full border border-[rgba(117,115,136,0.75)] rounded-[8px] p-[12px] flex flex-col gap-[8px] mb-[24px] text-left">
              <div className="flex flex-col gap-[4px]">
                <span className="font-bold text-[16px] text-[#757388]">
                  {reservationNumbers.length > 1
                    ? "Numéros de réservation :"
                    : "Numéro de réservation :"}
                </span>
                <div className="flex flex-wrap gap-[6px]">
                  {reservationNumbers.map((reservationNumber) => (
                    <span
                      key={reservationNumber}
                      className="font-bold text-[16px] text-[#040037]"
                    >
                      {formatReservationNumber(reservationNumber)}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex flex-wrap gap-[4px]">
                <span className="font-bold text-[16px] text-[#757388]">
                  Livraison estimée :
                </span>
                <span className="font-bold text-[16px] text-[#040037]">
                  {formatDateFR(successData.estimatedDeliveryDate)}
                </span>
              </div>
              <div className="flex flex-wrap gap-[4px]">
                <span className="font-bold text-[16px] text-[#757388]">
                  Prix total :
                </span>
                <span className="font-bold text-[16px] text-[#040037]">
                  {Number(successData.totalPrice).toLocaleString("fr-FR", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                  €
                </span>
              </div>
            </div>

            <button
              onClick={() => navigate("/leasing/catalog")}
              className="bg-[#040037] text-white h-[40px] rounded-[8px] w-full font-semibold text-[16px] hover:bg-[#040037]/90 transition"
            >
              Retour au catalogue
            </button>
          </div>
        ) : (
          <div className="px-[24px] py-[16px] flex flex-col gap-[16px]">
            {isPack ? (
              <div className="border border-[rgba(117,115,136,0.75)] rounded-[8px] p-[12px] flex flex-col gap-[10px]">
                <h1 className="font-bold text-[20px] text-[#040037] leading-tight">
                  Pack arrivée
                </h1>
                <ul className="flex flex-col gap-[8px]">
                  {products.map((product) => (
                    <li
                      key={product.id}
                      className="flex items-center gap-[10px]"
                    >
                      <img
                        src={
                          product.firstImageUrl ||
                          `https://placehold.co/56x56?text=${encodeURIComponent(product.category || "Article")}`
                        }
                        alt={product.postTitle}
                        className="h-[56px] w-[56px] shrink-0 rounded-[8px] object-cover"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-bold text-[16px] text-[#040037]">
                          {product.postTitle}
                        </p>
                        <p className="truncate text-[14px] text-[#757388]">
                          {product.category}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <div className="flex gap-[4px] items-start">
                <img
                  src={firstImageUrl || fallbackImage}
                  alt={productTitle}
                  className="rounded-[8px] size-[135px] object-cover shrink-0"
                  onError={(e) => {
                    e.currentTarget.src = fallbackImage;
                  }}
                />
                <div className="flex-1 flex flex-col gap-[10px] p-[10px]">
                  <h1 className="font-bold text-[20px] text-[#040037] leading-tight">
                    {productTitle}
                  </h1>
                  <div className="bg-white border border-[#040037] flex h-[35px] items-center justify-center px-[12px] rounded-[12px] self-start">
                    <span className="font-normal text-[16px] text-[#040037]">
                      Location
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Récap réservation */}
            <div className="border border-[rgba(117,115,136,0.75)] rounded-[8px] p-[12px] flex flex-col gap-[12px]">
              <div className="flex flex-wrap items-center gap-[8px]">
                <span className="font-normal text-[16px] text-[#757388]">
                  Réservation le :
                </span>
                <span className="font-bold text-[16px] text-[#040037]">
                  {formatDateFR(startDate)} – {formatDateFR(endDate)}
                </span>
              </div>
              <div className="flex items-center gap-[8px]">
                <span className="font-normal text-[16px] text-[#757388]">
                  Prix total :
                </span>
                <span className="font-bold text-[20px] text-[#040037]">
                  {totalPrice.toLocaleString("fr-FR", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                  €
                </span>
              </div>
            </div>

            <div className="h-px w-full bg-[rgba(0,0,0,0.1)]" />

            {/* Formulaire adresse */}
            <form
              onSubmit={formik.handleSubmit}
              className="flex flex-col gap-[12px]"
            >
              <h2 className="font-bold text-[20px] text-[#040037]">
                Entrez votre adresse
              </h2>

              {submitError && (
                <div className="p-[12px] bg-red-50 border border-red-100 text-[14px] font-semibold text-red-600 rounded-[8px] text-center">
                  {submitError}
                </div>
              )}

              {/* N° et rue */}
              <div className="flex flex-col gap-[4px]">
                <label className="font-normal text-[16px] text-[#040037]">
                  N° et rue
                </label>
                <input
                  type="text"
                  name="deliveryStreet"
                  placeholder="16 Rue de Paris"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.deliveryStreet}
                  className={`w-full border rounded-[8px] p-[12px] text-[16px] text-[#040037] bg-white placeholder-[#757388] focus:outline-none ${
                    formik.touched.deliveryStreet &&
                    formik.errors.deliveryStreet
                      ? "border-red-500"
                      : "border-[#757388]"
                  }`}
                />
                {formik.touched.deliveryStreet &&
                  formik.errors.deliveryStreet && (
                    <span className="text-[14px] text-red-500">
                      {formik.errors.deliveryStreet}
                    </span>
                  )}
              </div>

              {/* Code Postal */}
              <div className="flex flex-col gap-[4px]">
                <label className="font-normal text-[16px] text-[#040037]">
                  Code Postal
                </label>
                <input
                  type="text"
                  name="deliveryZipCode"
                  placeholder="77670"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.deliveryZipCode}
                  className={`w-full border rounded-[8px] p-[12px] text-[16px] text-[#040037] bg-white placeholder-[#757388] focus:outline-none ${
                    formik.touched.deliveryZipCode &&
                    formik.errors.deliveryZipCode
                      ? "border-red-500"
                      : "border-[#757388]"
                  }`}
                />
                {formik.touched.deliveryZipCode &&
                  formik.errors.deliveryZipCode && (
                    <span className="text-[14px] text-red-500">
                      {formik.errors.deliveryZipCode}
                    </span>
                  )}
              </div>

              {/* Ville */}
              <div className="flex flex-col gap-[4px]">
                <label className="font-normal text-[16px] text-[#040037]">
                  Ville
                </label>
                <input
                  type="text"
                  name="deliveryCity"
                  placeholder="Paris"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.deliveryCity}
                  className={`w-full border rounded-[8px] p-[12px] text-[16px] text-[#040037] bg-white placeholder-[#757388] focus:outline-none ${
                    formik.touched.deliveryCity && formik.errors.deliveryCity
                      ? "border-red-500"
                      : "border-[#757388]"
                  }`}
                />
                {formik.touched.deliveryCity && formik.errors.deliveryCity && (
                  <span className="text-[14px] text-red-500">
                    {formik.errors.deliveryCity}
                  </span>
                )}
              </div>

              {/* Boutons */}
              <div className="flex flex-col gap-[12px] items-center py-[16px]">
                <button
                  type="submit"
                  disabled={!isFormValid || formik.isSubmitting}
                  className={`h-[40px] rounded-[8px] w-full font-semibold text-[16px] text-white transition ${
                    isFormValid && !formik.isSubmitting
                      ? "bg-[#040037] hover:bg-[#040037]/90"
                      : "bg-[rgba(117,115,136,0.5)] cursor-not-allowed"
                  }`}
                >
                  {formik.isSubmitting ? "Réservation..." : "Réserver"}
                </button>
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="font-normal text-[16px] text-[#757388] py-[8px] hover:opacity-80 transition"
                >
                  Annuler
                </button>
              </div>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}
