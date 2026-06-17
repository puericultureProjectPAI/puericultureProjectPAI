import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { useAuth } from "../../common/security/AuthContext";
import { apiClient } from "../../common/utils/apiClient";
import Header from "../../common/views/Header";
import Navbar from "../../common/views/NavBar";
import ArrivalPackEditModal from "../components/ArrivalPackEditModal";

/* ─── helpers ─────────────────────────────────────────────── */
const fallbackImage = (category) =>
  `https://placehold.co/400x300?text=${encodeURIComponent(category || "Produit")}`;

const getChildFirstName = (child) => child.firstName || child.name || "";

const formatDateFR = (dateStr) => {
  if (!dateStr) return "";
  const [year, month, day] = dateStr.split("-");
  return `${day}/${month}/${year}`;
};

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

/* ─── component ───────────────────────────────────────────── */
export default function ArrivalPackPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { isAuthenticated } = useAuth();

  const city = searchParams.get("city") || "";
  const startDate = searchParams.get("startDate") || "";
  const endDate = searchParams.get("endDate") || "";

  /* redirect if no context */
  useEffect(() => {
    if (!city || !startDate || !endDate) {
      navigate("/leasing/catalog", { replace: true });
    }
    if (!isAuthenticated) {
      navigate("/login", { replace: true });
    }
  }, [city, startDate, endDate, isAuthenticated, navigate]);

  /* ── state ── */
  const [childrenList, setChildrenList] = useState([]);
  const [selectedChildFirstName, setSelectedChildFirstName] = useState(null);
  const [carNeeded, setCarNeeded] = useState(false);
  const [packData, setPackData] = useState(null);
  const [packLoading, setPackLoading] = useState(false);
  const [packError, setPackError] = useState("");
  const [profileLoading, setProfileLoading] = useState(true);
  const [profileError, setProfileError] = useState("");
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [eligibleProducts, setEligibleProducts] = useState([]);
  const [eligibleLoading, setEligibleLoading] = useState(false);
  const [eligibleError, setEligibleError] = useState("");

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

  /* ── load profile on mount ── */
  useEffect(() => {
    if (!isAuthenticated) return;
    let ignore = false;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setProfileLoading(true);
    setProfileError("");

    apiClient
      .get("/person/me")
      .then((res) => {
        if (ignore) return;
        const children = res.data.children || [];
        setChildrenList(children);
        if (children.length === 1) {
          setSelectedChildFirstName(getChildFirstName(children[0]));
        }
      })
      .catch(() => {
        if (!ignore) setProfileError("Impossible de charger votre profil.");
      })
      .finally(() => {
        if (!ignore) setProfileLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, [isAuthenticated]);

  /* ── load pack when child + car choice confirmed ── */
  const generatePack = () => {
    if (!selectedChildFirstName || !city || !startDate || !endDate) return;
    let ignore = false;
    setPackLoading(true);
    setPackError("");
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
        if (!ignore)
          setPackError("Impossible de générer votre pack personnalisé.");
      })
      .finally(() => {
        if (!ignore) setPackLoading(false);
      });

    return () => {
      ignore = true;
    };
  };

  /* auto-generate when child is selected (single child flow) */
  useEffect(() => {
    if (selectedChildFirstName) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      generatePack();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedChildFirstName, carNeeded]);

  /* ── eligible products for edit modal ── */
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

  /* ── product helpers ── */
  const isProductSelected = (productId) =>
    selectedProducts.some((p) => p.id === productId);

  const addProduct = (product) => {
    if (isProductSelected(product.id)) return;
    setSelectedProducts((curr) => [...curr, product]);
  };

  const removeProduct = (productId) => {
    setSelectedProducts((curr) => curr.filter((p) => p.id !== productId));
  };

  const handleReservePack = () => {
    if (selectedProducts.length === 0) return;
    navigate("/leasing/booking/pack", {
      state: {
        isPack: true,
        products: selectedProducts,
        productIds: selectedProducts.map((p) => p.id),
        startDate,
        endDate,
        totalPrice: selectedTotalPrice,
      },
    });
  };

  /* ─── render ─────────────────────────────────────────────── */
  return (
    <div className="relative flex h-[100dvh] flex-col overflow-hidden bg-white font-['Figtree',sans-serif] text-[#040037]">
      <Header />

      <main className="flex-1 overflow-y-auto">
        {/* ── back header ── */}
        <div className="flex flex-col gap-[12px] px-[24px] py-[8px]">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex items-center gap-[8px] rounded-[8px] p-[8px] hover:bg-[#f2f2f9]"
          >
            <span className="material-symbols-rounded text-[24px] font-bold text-[#040037]">
              arrow_back
            </span>
            <span className="font-['Figtree',sans-serif] text-[20px] font-bold text-[#040037]">
              Retour au catalogue
            </span>
          </button>
          <div className="h-px w-full bg-[#D9D7E2]" />
        </div>

        {/* ── body ── */}
        <div className="flex flex-col gap-[10px] px-[24px]">
          {/* Loading / error profile */}
          {profileLoading && (
            <p className="py-[8px] text-[16px] text-[#757388]">
              Chargement de votre profil…
            </p>
          )}
          {profileError && (
            <p className="py-[8px] text-[16px] text-red-500">{profileError}</p>
          )}

          {!profileLoading && !profileError && (
            <>
              {/* ── child selection ── */}
              <div className="flex flex-col gap-[8px]">
                <p className="text-[16px] font-normal text-[#040037]">
                  Quel enfant est concerné par votre voyage ?
                </p>
                <div className="relative w-full">
                  <select
                    value={selectedChildFirstName || ""}
                    onChange={(e) =>
                      setSelectedChildFirstName(e.target.value || null)
                    }
                    className="h-[48px] w-full appearance-none rounded-[8px] border border-[#757388] bg-white px-[12px] pr-[40px] text-[16px] text-[#33323d] outline-none"
                  >
                    {childrenList.length > 1 && (
                      <option value="">Sélectionner un enfant</option>
                    )}
                    {childrenList.map((child, idx) => {
                      const firstName = getChildFirstName(child);
                      return (
                        <option key={`${firstName}-${idx}`} value={firstName}>
                          {firstName}
                        </option>
                      );
                    })}
                  </select>
                  {/* dropdown chevron */}
                  <span className="pointer-events-none absolute right-[12px] top-1/2 -translate-y-1/2 material-symbols-rounded text-[20px] text-[#757388]">
                    expand_more
                  </span>
                </div>
              </div>

              {/* ── car question ── */}
              <div className="flex flex-col gap-[8px]">
                <p className="text-[16px] font-normal text-[#040037]">
                  Prévoyez-vous de prendre une voiture sur place ?
                </p>
                <div className="flex items-center gap-[20px]">
                  {/* Oui */}
                  <button
                    type="button"
                    onClick={() => setCarNeeded(true)}
                    className="flex items-center gap-[12px] p-[10px]"
                  >
                    <span
                      className={`flex h-[24px] w-[24px] items-center justify-center rounded-full border border-[#040037] ${
                        carNeeded ? "bg-[#040037]" : "bg-white"
                      }`}
                    >
                      {carNeeded && (
                        <span className="block h-[16px] w-[16px] rounded-full bg-white" />
                      )}
                    </span>
                    <span className="text-[16px] font-normal text-[#040037]">
                      Oui
                    </span>
                  </button>
                  {/* Non */}
                  <button
                    type="button"
                    onClick={() => setCarNeeded(false)}
                    className="flex items-center gap-[12px] p-[10px]"
                  >
                    <span
                      className={`flex h-[24px] w-[24px] items-center justify-center rounded-full border border-[#040037] ${
                        !carNeeded ? "bg-[#040037]" : "bg-white"
                      }`}
                    >
                      {!carNeeded && (
                        <span className="block h-[16px] w-[16px] rounded-full bg-white" />
                      )}
                    </span>
                    <span className="text-[16px] font-normal text-[#040037]">
                      Non
                    </span>
                  </button>
                </div>
              </div>

              {/* ── pack section ── */}
              {selectedChildFirstName && (
                <div className="flex flex-col gap-[10px] rounded-[8px] bg-[#f2f2f9] p-[12px]">
                  {/* title */}
                  <h3 className="text-center text-[20px] font-bold text-[#040037]">
                    Votre pack
                  </h3>

                  {/* description */}
                  {packData && (
                    <p className="max-w-[358px] text-[16px] font-normal leading-normal text-[#040037]">
                      Lors de votre séjour à {city} du {formatDateFR(startDate)}{" "}
                      au {formatDateFR(endDate)}, nous recommandons pour{" "}
                      {selectedChildFirstName}, {packData.childAgeMonths} mois :
                    </p>
                  )}

                  {/* loading */}
                  {packLoading && (
                    <p className="py-[8px] text-center text-[16px] text-[#757388]">
                      Génération du pack en cours…
                    </p>
                  )}

                  {/* error */}
                  {packError && (
                    <p className="py-[8px] text-center text-[16px] text-red-500">
                      {packError}
                    </p>
                  )}

                  {/* products grid */}
                  {!packLoading && !packError && packData && (
                    <>
                      <div className="flex gap-[10px] overflow-x-auto py-[4px]">
                        {selectedProducts.length === 0 ? (
                          <p className="text-[16px] text-[#757388]">
                            Aucun équipement sélectionné.
                          </p>
                        ) : (
                          selectedProducts.map((product) => (
                            <div
                              key={product.id}
                              className="flex w-[112px] shrink-0 flex-col gap-[10px] rounded-[8px] bg-white pb-[12px] shadow-[0px_2px_1px_rgba(0,0,0,0.1)]"
                            >
                              <div className="h-[117px] w-full overflow-hidden rounded-t-[8px] bg-[#f2f2f9]">
                                <img
                                  src={
                                    product.firstImageUrl ||
                                    fallbackImage(product.category)
                                  }
                                  alt={product.postTitle}
                                  className="h-full w-full object-cover"
                                />
                              </div>
                              <p className="px-[12px] text-center text-[16px] font-normal text-[#040037]">
                                {product.postTitle}
                              </p>
                            </div>
                          ))
                        )}
                      </div>

                      {/* buttons */}
                      <button
                        type="button"
                        onClick={handleReservePack}
                        disabled={selectedProducts.length === 0}
                        className={`h-[40px] w-full rounded-[8px] text-[16px] font-semibold text-white transition ${
                          selectedProducts.length > 0
                            ? "bg-[#040037] hover:bg-[#040037]/90"
                            : "cursor-not-allowed bg-[rgba(117,115,136,0.5)]"
                        }`}
                      >
                        Réserver
                      </button>

                      <button
                        type="button"
                        onClick={() => setShowEditModal(true)}
                        className="h-[40px] w-full rounded-[8px] border border-[#040037] bg-white text-[16px] font-semibold text-[#040037] hover:bg-[#f2f2f9]"
                      >
                        Modifier
                      </button>
                    </>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </main>

      <Navbar />

      {/* edit modal */}
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
    </div>
  );
}
