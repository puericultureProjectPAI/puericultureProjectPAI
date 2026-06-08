import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../../common/security/AuthContext";
import { apiClient } from "../../common/utils/apiClient";
import ArrivalPackEditModal from "./ArrivalPackEditModal";

const fallbackImage = (category) =>
  `https://placehold.co/400x300?text=${encodeURIComponent(category || "Produit")}`;

const getChildFirstName = (child) => child.firstName || child.name || "";

const calculateDurationDays = (startDate, endDate) => {
  if (!startDate || !endDate) return 0;
  const start = new Date(startDate);
  const end = new Date(endDate);
  if (start > end) return 0;
  return (
    Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1
  );
};

const calculateProductPrice = (product, durationDays) => {
  const pricePerMonth = Number(product.pricePerMonth || 0);
  const pricePerDay = Number(product.pricePerDay || 0);
  const months = Math.floor(durationDays / 30);
  const remainingDays = durationDays % 30;
  return months * pricePerMonth + remainingDays * pricePerDay;
};

export default function ArrivalPackBanner({ city, startDate, endDate }) {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [isVisible, setIsVisible] = useState(() => {
    return sessionStorage.getItem("arrivalPackClosed") !== "true";
  });

  const [childrenList, setChildrenList] = useState([]);
  const [selectedChildFirstName, setSelectedChildFirstName] = useState(null);
  const [carNeeded, setCarNeeded] = useState(false);
  const [packData, setPackData] = useState(null);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [eligibleProducts, setEligibleProducts] = useState([]);
  const [eligibleLoading, setEligibleLoading] = useState(false);
  const [eligibleError, setEligibleError] = useState("");

  const [step, setStep] = useState(
    isAuthenticated ? "loading_profile" : "unauth",
  );
  const [error, setError] = useState(null);

  const durationDays = calculateDurationDays(startDate, endDate);
  const selectedTotalPrice = useMemo(
    () =>
      selectedProducts.reduce(
        (total, product) =>
          total + calculateProductPrice(product, durationDays),
        0,
      ),
    [durationDays, selectedProducts],
  );

  useEffect(() => {
    if (!isAuthenticated) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setStep("unauth");
      return;
    }

    let ignore = false;
    apiClient
      .get("/person/me")
      .then((res) => {
        if (ignore) return;
        const children = res.data.children || [];
        setChildrenList(children);

        if (children.length === 0) {
          setError("Vous n'avez pas d'enfant enregistré dans votre profil.");
          setStep("error");
        } else if (children.length === 1) {
          setSelectedChildFirstName(getChildFirstName(children[0]));
          setStep("car_question");
        } else {
          setStep("select_child");
        }
      })
      .catch(() => {
        if (!ignore) {
          setError("Impossible de charger votre profil.");
          setStep("error");
        }
      });

    return () => {
      ignore = true;
    };
  }, [isAuthenticated]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPackData(null);
    setSelectedProducts([]);
  }, [city, startDate, endDate]);

  useEffect(() => {
    if (
      step !== "pack" ||
      !city ||
      !startDate ||
      !endDate ||
      !selectedChildFirstName
    )
      return;

    let ignore = false;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPackData(null);

    apiClient
      .get("/leasing/arrival-pack", {
        params: {
          city,
          startDate,
          endDate,
          carNeeded,
          childFirstName: selectedChildFirstName,
        },
      })
      .then((res) => {
        if (ignore) return;
        setPackData(res.data);
        setSelectedProducts(res.data.products || []);
      })
      .catch(() => {
        if (!ignore) {
          setError("Impossible de générer votre pack personnalisé.");
          setStep("error");
        }
      });

    return () => {
      ignore = true;
    };
  }, [step, city, startDate, endDate, carNeeded, selectedChildFirstName]);

  useEffect(() => {
    if (!showEditModal || !selectedChildFirstName) return;

    let ignore = false;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setEligibleLoading(true);
    setEligibleError("");

    apiClient
      .get("/leasing/arrival-pack/eligible-products", {
        params: {
          city,
          startDate,
          endDate,
          childFirstName: selectedChildFirstName,
        },
      })
      .then((res) => {
        if (!ignore) setEligibleProducts(res.data || []);
      })
      .catch(() => {
        if (!ignore) setEligibleError("Impossible de charger les articles.");
      })
      .finally(() => {
        if (!ignore) setEligibleLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, [showEditModal, city, startDate, endDate, selectedChildFirstName]);

  if (!isVisible || !city || !startDate || !endDate) return null;

  const closeBanner = () => {
    sessionStorage.setItem("arrivalPackClosed", "true");
    setIsVisible(false);
  };

  const handleChildSelect = (childFirstName) => {
    setSelectedChildFirstName(childFirstName);
    setStep("car_question");
  };

  const handleCarSubmit = () => {
    setStep("pack");
  };

  const isProductSelected = (productId) =>
    selectedProducts.some((product) => product.id === productId);

  const addProduct = (product) => {
    if (isProductSelected(product.id)) return;
    setSelectedProducts((current) => [...current, product]);
  };

  const removeProduct = (productId) => {
    setSelectedProducts((current) =>
      current.filter((product) => product.id !== productId),
    );
  };

  const handleReservePack = () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    if (selectedProducts.length === 0) return;

    navigate("/leasing/booking/pack", {
      state: {
        isPack: true,
        products: selectedProducts,
        productIds: selectedProducts.map((product) => product.id),
        startDate,
        endDate,
        totalPrice: selectedTotalPrice,
      },
    });
  };

  return (
    <section className="relative mx-4 mb-4 mt-2 rounded-xl border border-blue-100 bg-blue-50 p-4 shadow-sm">
      <button
        onClick={closeBanner}
        className="absolute right-3 top-3 flex h-6 w-6 items-center justify-center rounded-full bg-white text-gray-500 shadow-sm hover:text-gray-800"
        aria-label="Fermer le pack d'arrivée"
      >
        x
      </button>

      <div className="mb-2 flex items-center gap-2">
        <span className="material-symbols-rounded text-[#040037]">
          backpack
        </span>
        <h2 className="text-sm font-bold text-[#040037]">
          Composez votre Pack Arrivée
        </h2>
      </div>

      {step === "unauth" && (
        <div className="mt-3">
          <p className="mb-3 text-xs text-gray-600">
            Connectez-vous pour recevoir un pack personnalisé en fonction de
            l'âge de votre enfant.
          </p>
          <button
            onClick={() => navigate("/login")}
            className="w-full rounded-md bg-[#040037] py-2 text-xs font-semibold text-white transition-opacity hover:opacity-90"
          >
            Se connecter / S'inscrire
          </button>
        </div>
      )}

      {step === "loading_profile" && (
        <p className="mt-3 text-center text-xs text-gray-500">
          Chargement de votre profil...
        </p>
      )}

      {step === "error" && (
        <p className="mt-3 text-center text-xs text-red-500">{error}</p>
      )}

      {step === "select_child" && (
        <div className="mt-3">
          <p className="mb-2 text-xs font-medium text-gray-700">
            Pour quel enfant organisez-vous ce séjour ?
          </p>
          <div className="flex flex-wrap gap-2">
            {childrenList.map((child, idx) => {
              const firstName = getChildFirstName(child);
              return (
                <button
                  key={`${firstName}-${idx}`}
                  onClick={() => handleChildSelect(firstName)}
                  className="rounded-full border border-[#040037] px-4 py-1 text-xs font-medium text-[#040037] transition-colors hover:bg-[#040037] hover:text-white"
                >
                  {firstName}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {step === "car_question" && (
        <div className="mt-3">
          <div className="flex items-center justify-between gap-3 rounded-lg bg-white p-3 shadow-[0_1px_4px_rgba(0,0,0,0.05)]">
            <span className="text-xs font-medium text-gray-700">
              Vous prévoyez de prendre une voiture sur place ?
            </span>
            <button
              onClick={() => setCarNeeded(!carNeeded)}
              className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${
                carNeeded ? "bg-[#040037]" : "bg-gray-300"
              }`}
              aria-label="Besoin d'un siège auto"
            >
              <span
                className={`absolute left-1 top-1 h-4 w-4 rounded-full bg-white transition-transform ${
                  carNeeded ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>
          <button
            onClick={handleCarSubmit}
            className="mt-3 w-full rounded-md bg-[#040037] py-2 text-xs font-semibold text-white transition-opacity hover:opacity-90"
          >
            Générer mon pack
          </button>
        </div>
      )}

      {step === "pack" && (
        <div className="mt-4">
          {!packData ? (
            <p className="text-center text-xs text-gray-500">
              Génération du pack en cours...
            </p>
          ) : (
            <div className="rounded-lg bg-white p-3 shadow-[0_1px_4px_rgba(0,0,0,0.05)]">
              <h3 className="mb-2 text-[10px] font-bold uppercase tracking-wide text-gray-800">
                Pack recommandé (enfant : {packData.childAgeMonths} mois)
              </h3>
              <ul className="mb-3 space-y-2">
                {selectedProducts.length === 0 ? (
                  <li className="text-xs text-gray-500">
                    Aucun équipement sélectionné.
                  </li>
                ) : (
                  selectedProducts.map((product) => (
                    <li
                      key={product.id}
                      className="flex items-center gap-3 rounded border border-gray-100 bg-gray-50/50 p-1 text-xs text-gray-700"
                    >
                      <img
                        src={
                          product.firstImageUrl ||
                          fallbackImage(product.category)
                        }
                        alt={product.postTitle}
                        className="h-10 w-10 shrink-0 rounded object-cover"
                      />
                      <div className="min-w-0 flex-1">
                        <span className="block truncate font-medium">
                          {product.postTitle}
                        </span>
                        <span className="block truncate text-[9px] text-gray-500">
                          {product.category}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeProduct(product.id)}
                        className="rounded px-2 py-1 text-[10px] font-semibold text-red-600 hover:bg-red-50"
                      >
                        Retirer
                      </button>
                    </li>
                  ))
                )}
              </ul>

              <div className="flex items-center justify-between border-t border-gray-100 pt-2">
                <span className="text-[10px] text-gray-500">Total estimé</span>
                <span className="text-sm font-bold text-[#040037]">
                  {selectedTotalPrice.toLocaleString("fr-FR")} €
                </span>
              </div>

              <div className="mt-3 flex flex-col gap-2">
                <button
                  type="button"
                  onClick={() => setShowEditModal(true)}
                  className="h-9 w-full rounded-md border border-[#040037] bg-white text-xs font-semibold text-[#040037]"
                >
                  Modifier le pack
                </button>
                <button
                  type="button"
                  onClick={handleReservePack}
                  disabled={selectedProducts.length === 0}
                  className={`h-9 w-full rounded-md text-xs font-semibold text-white ${
                    selectedProducts.length === 0
                      ? "bg-gray-300"
                      : "bg-[#040037] hover:opacity-90"
                  }`}
                >
                  Réserver le pack
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {showEditModal && (
        <ArrivalPackEditModal
          eligibleProducts={eligibleProducts}
          eligibleLoading={eligibleLoading}
          eligibleError={eligibleError}
          isProductSelected={isProductSelected}
          onAddProduct={addProduct}
          onRemoveProduct={removeProduct}
          onClose={() => setShowEditModal(false)}
        />
      )}
    </section>
  );
}
