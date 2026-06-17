import { useState, useEffect } from "react";
import { useParams, useSearchParams } from "react-router";
import { apiClient } from "../../common/utils/apiClient";
import { usePerson } from "../../common/service/PersonService";
import Header from "../../common/views/Header";
import NavBar from "../../common/views/NavBar";
import LeasingBackHeader from "../components/LeasingBackHeader";
import LeasingBookingSection from "../components/LeasingBookingSection";
import LeasingReviewsSection from "../components/LeasingReviewsSection";
import "../leasing.css";

const fallbackImage = (title) =>
  `https://placehold.co/260x200?text=${encodeURIComponent(title || "Produit")}`;

const getDateInFrance = (daysFromToday = 0) => {
  const date = new Date(
    new Date().toLocaleString("en-US", { timeZone: "Europe/Paris" }),
  );
  date.setDate(date.getDate() + daysFromToday);
  return date.toISOString().split("T")[0];
};

const getMinimumRentalStartDateFrance = () => getDateInFrance(3);

const getDateInOneMonthFrance = (startDate) => {
  const date = new Date(
    startDate ??
      new Date().toLocaleString("en-US", { timeZone: "Europe/Paris" }),
  );
  date.setMonth(date.getMonth() + 1);
  return date.toISOString().split("T")[0];
};

const getConditionColor = (condition) => {
  const normalized = condition
    ?.normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

  if (normalized === "etat correct") return "text-[#CF4B01]";
  if (normalized === "use") return "text-[#E91C2E]";
  if (normalized === "tres bon etat") return "text-[#2E7D32]";
  return "";
};

function formatAgeRange(minMonths, maxMonths) {
  if (minMonths == null && maxMonths == null) return null;
  const fmt = (m) => {
    if (m === 0) return "0";
    const y = Math.floor(m / 12);
    const r = m % 12;
    if (r === 0) return `${y} ans`;
    return `${y} ans ${r} mois`;
  };
  return `${fmt(minMonths ?? 0)} - ${fmt(maxMonths ?? 0)}`;
}

const DEFAULT_DISCLAIMER =
  "Analyse indicative - consultez toujours les recommandations du fabricant.";

function getChildKey(child, index) {
  return `${child.firstName ?? "enfant"}-${child.birthDate ?? "sans-date"}-${index}`;
}

function formatChildSummary(child) {
  const ageLabel = child.age
    ? `${child.age} an${child.age > 1 ? "s" : ""}`
    : "Bébé attendu";

  return `${child.firstName}, ${ageLabel}`;
}

function getAnalysisTargetLabel(children) {
  if (children.length === 0) return "votre sélection";
  return children.map(formatChildSummary).join(" et ");
}

function getScoreTheme(score) {
  if (score <= 40) {
    return {
      label: "Déconseillé pour cet âge",
      textClass: "text-[#E91C2E]",
      badgeClass: "border-[#FAD2D4] bg-[#FEE8E9] text-[#E91C2E]",
    };
  }

  if (score <= 70) {
    return {
      label: "À utiliser avec précaution",
      textClass: "text-[#CF4B01]",
      badgeClass: "border-[#FCD3C1] bg-[#FFF0E8] text-[#CF4B01]",
    };
  }

  return {
    label: "Adapté à cet âge",
    textClass: "text-[#2E7D32]",
    badgeClass: "border-[#C8E6C9] bg-[#E8F5E9] text-[#2E7D32]",
  };
}

function buildJustifications(score, selectedChildren, productTitle) {
  const targetLabel = getAnalysisTargetLabel(selectedChildren);
  const riskLabel = score < 40 ? "élevé" : score < 70 ? "modéré" : "faible";

  return [
    `Analyse réalisée pour ${targetLabel} sur l'article ${productTitle}.`,
    `Le niveau de risque estimé est ${riskLabel} pour un usage en location.`,
    "Les éléments déclarés par la fiche restent cohérents avec un contrôle de livraison classique.",
    "La vérification physique du produit reste indispensable avant validation finale.",
  ];
}

function normalizeJustifications(
  responseData,
  score,
  selectedChildren,
  productTitle,
) {
  const rawJustifications =
    responseData?.justifications ??
    responseData?.reasons ??
    responseData?.explanations ??
    responseData?.details ??
    [];

  const parsedJustifications = Array.isArray(rawJustifications)
    ? rawJustifications
    : typeof rawJustifications === "string"
      ? rawJustifications
          .split(/\n+/)
          .map((item) => item.trim())
          .filter(Boolean)
      : [];

  const fallbackJustifications = buildJustifications(
    score,
    selectedChildren,
    productTitle,
  );

  const combined = [...parsedJustifications];
  for (
    let i = 0;
    combined.length < 4 && i < fallbackJustifications.length;
    i++
  ) {
    combined.push(fallbackJustifications[i]);
  }
  return combined.slice(0, 4);
}

function normalizeAnalysisResponse(
  responseData,
  selectedChildren,
  productTitle,
  fallbackScore,
) {
  const rawScore =
    responseData?.score ??
    responseData?.confidenceScore ??
    responseData?.result?.score ??
    responseData?.analysis?.score ??
    fallbackScore;

  const score = Number(rawScore);

  if (!Number.isFinite(score)) {
    throw new Error("Analyse invalide");
  }

  const boundedScore = Math.max(0, Math.min(100, Math.round(score)));
  const theme = getScoreTheme(boundedScore);

  return {
    score: boundedScore,
    label: theme.label,
    textClass: theme.textClass,
    badgeClass: theme.badgeClass,
    justifications: normalizeJustifications(
      responseData,
      boundedScore,
      selectedChildren,
      productTitle,
    ),
    disclaimer: DEFAULT_DISCLAIMER,
  };
}

function formatChildAgeForAnalysis(child) {
  if (!child.birthDate) {
    return "bébé attendu";
  }
  const birth = new Date(child.birthDate);
  const now = new Date();
  const diffTime = Math.abs(now - birth);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  const diffMonths = Math.floor(diffDays / 30.4375);

  if (diffMonths < 1) {
    return "nouveau-né";
  }
  if (diffMonths < 24) {
    return `${diffMonths} mois`;
  }
  const diffYears = Math.floor(diffMonths / 12);
  const remainingMonths = diffMonths % 12;
  if (remainingMonths === 0) {
    return `${diffYears} ans`;
  }
  return `${diffYears} ans et ${remainingMonths} mois`;
}

async function requestSafetyAnalysis(articleTitle, childAge) {
  const payload = {
    articleName: articleTitle,
    childAge: childAge,
  };
  return await apiClient.post("/leasing/security-check", payload);
}

export default function LeasingProductDetailView() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const minRentalStartDate = getMinimumRentalStartDateFrance();
  const initialStartDate = searchParams.get("startDate") || minRentalStartDate;
  const initialEndDate =
    searchParams.get("endDate") || getDateInOneMonthFrance(initialStartDate);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentImage, setCurrentImage] = useState(0);

  const {
    data: person,
    loading: personLoading,
    error: personError,
  } = usePerson();
  const [isSafetyModalOpen, setIsSafetyModalOpen] = useState(false);
  const [analysisStep, setAnalysisStep] = useState("idle");
  const [selectedChildKeys, setSelectedChildKeys] = useState([]);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [analysisError, setAnalysisError] = useState("");

  useEffect(() => {
    if (!isSafetyModalOpen) {
      return;
    }

    if (analysisStep !== "profile-loading") {
      return;
    }

    if (personLoading) {
      return;
    }

    const timer = window.setTimeout(() => {
      if (personError) {
        setAnalysisError("Impossible de charger les enfants du profil.");
        setAnalysisStep("error");
        return;
      }

      if ((person?.children ?? []).length === 1) {
        const [onlyChild] = person.children;
        setSelectedChildKeys([getChildKey(onlyChild, 0)]);
        setAnalysisStep("loading");
        return;
      }

      if ((person?.children ?? []).length > 1) {
        setAnalysisStep("choosing");
        return;
      }

      setAnalysisError("Aucun enfant n'est renseigné dans votre profil.");
      setAnalysisStep("error");
    }, 0);

    return () => window.clearTimeout(timer);
  }, [analysisStep, isSafetyModalOpen, person, personError, personLoading]);

  useEffect(() => {
    if (!isSafetyModalOpen) {
      return;
    }

    if (analysisStep !== "loading") {
      return;
    }

    const children = (person?.children ?? []).filter((child, index) =>
      selectedChildKeys.includes(getChildKey(child, index)),
    );

    if (children.length === 0) {
      return;
    }

    let cancelled = false;

    const runAnalysis = async () => {
      try {
        const childAgeStr = children
          .map(formatChildAgeForAnalysis)
          .join(" et ");
        const response = await requestSafetyAnalysis(
          product.postTitle,
          childAgeStr,
        );
        if (cancelled) {
          return;
        }

        const normalizedResult = normalizeAnalysisResponse(
          response?.data,
          children,
          product.postTitle,
          product.confidenceScore,
        );

        setAnalysisResult(normalizedResult);
        setAnalysisError("");
        setAnalysisStep("success");
      } catch {
        if (cancelled) {
          return;
        }

        setAnalysisResult(null);
        setAnalysisError("Analyse indisponible pour le moment");
        setAnalysisStep("error");
      }
    };

    void runAnalysis();

    return () => {
      cancelled = true;
    };
  }, [analysisStep, id, isSafetyModalOpen, person, product, selectedChildKeys]);

  useEffect(() => {
    if (!isSafetyModalOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isSafetyModalOpen]);

  const children = person?.children ?? [];
  const selectedChildren = children.filter((child, index) =>
    selectedChildKeys.includes(getChildKey(child, index)),
  );

  const closeSafetyModal = () => {
    setIsSafetyModalOpen(false);
    setAnalysisStep("idle");
    setSelectedChildKeys([]);
    setAnalysisResult(null);
    setAnalysisError("");
  };

  const openSafetyModal = () => {
    setIsSafetyModalOpen(true);
    setAnalysisResult(null);
    setAnalysisError("");
    setSelectedChildKeys([]);

    if (personLoading || personError) {
      setAnalysisStep("profile-loading");
      return;
    }

    if (children.length === 1) {
      setSelectedChildKeys([getChildKey(children[0], 0)]);
      setAnalysisStep("loading");
      return;
    }

    if (children.length > 1) {
      setAnalysisStep("choosing");
      return;
    }

    setAnalysisError("Aucun enfant n'est renseigné dans votre profil.");
    setAnalysisStep("error");
  };

  const toggleChildSelection = (child, index) => {
    const key = getChildKey(child, index);

    setSelectedChildKeys((currentKeys) =>
      currentKeys.includes(key)
        ? currentKeys.filter((itemKey) => itemKey !== key)
        : [...currentKeys, key],
    );
  };

  const launchAnalysis = () => {
    if (selectedChildren.length === 0) {
      return;
    }

    setAnalysisResult(null);
    setAnalysisError("");
    setAnalysisStep("loading");
  };

  useEffect(() => {
    apiClient
      .get(`/public/leasing/articles/${id}`)
      .then((res) => setProduct(res.data))
      .catch(() => setError("Impossible de charger le produit."))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <main className="flex h-screen w-full items-center justify-center bg-white text-[#040037]">
        <p className="text-[16px] text-[#7C7A8A]">Chargement…</p>
      </main>
    );
  }

  if (error || !product) {
    return (
      <main className="flex h-screen w-full items-center justify-center bg-white text-[#040037]">
        <p className="text-[16px] text-red-500">
          {error || "Produit introuvable."}
        </p>
      </main>
    );
  }

  const images =
    product.imageUrls?.length > 0
      ? product.imageUrls
      : [fallbackImage(product.postTitle)];

  const priceDisplay =
    product.pricePerMonth != null
      ? Number(product.pricePerMonth).toLocaleString("fr-FR", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }) + " €"
      : null;

  const ageRange = formatAgeRange(product.minAgeMonths, product.maxAgeMonths);

  const details = [
    {
      label: "Etat",
      value: product.condition,
      valueClassName: getConditionColor(product.condition),
    },
    { label: "Marque", value: product.brand },
    { label: "Dimension", value: product.dimensions },
    { label: "Tranche d'âge", value: ageRange },
    {
      label: "Poids max",
      value: product.maxWeightKg != null ? `${product.maxWeightKg} kg` : null,
    },
  ].filter((d) => d.value);

  const shareButton = (
    <button
      aria-label="Partager"
      onClick={() => {
        if (navigator.share) {
          navigator.share({
            title: product.postTitle,
            url: window.location.href,
          });
        } else {
          navigator.clipboard.writeText(window.location.href);
        }
      }}
      className="p-[2px]"
    >
      <span className="material-symbols-rounded text-[20px]">ios_share</span>
    </button>
  );

  return (
    <div className="flex h-[100dvh] w-full flex-col overflow-hidden bg-white text-[#040037]">
      <Header />
      <LeasingBackHeader rightElement={shareButton} />

      <main className="flex-1 overflow-y-auto">
        {/* Image carousel — full width on mobile, fixed height on desktop */}
        <section>
          <img
            src={images[currentImage]}
            alt={product.postTitle}
            className="h-[200px] md:h-[280px] w-full object-cover"
            onError={(e) => {
              e.currentTarget.src = fallbackImage(product.postTitle);
            }}
          />
          {images.length > 1 && (
            <div className="flex justify-center gap-[4px] pt-[8px]">
              {images.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentImage(i)}
                  className={`h-[6px] w-[6px] rounded-full transition-colors ${
                    i === currentImage ? "bg-[#040037]" : "bg-[#040037]/30"
                  }`}
                />
              ))}
            </div>
          )}
          {images.length === 1 && <div className="pt-[8px]" />}
        </section>

        {/* Content — vertical layout on mobile and desktop */}
        <div className="w-full px-[24px] md:pt-4">
          <section className="pb-[12px]">
            {/* Badge */}
            <div className="mb-[6px] flex justify-end">
              <span className="rounded-full border border-[#040037] px-[9px] py-[2px] text-[12px]">
                Location
              </span>
            </div>

            {/* Title + Price */}
            <div className="mb-[10px] flex items-baseline justify-between">
              <h1 className="text-[22px] font-bold leading-tight">
                {product.postTitle}
              </h1>
              {priceDisplay && (
                <span className="ml-[8px] whitespace-nowrap text-[18px] font-bold">
                  {priceDisplay}
                </span>
              )}
            </div>

            {/* Description */}
            {product.description && (
              <div className="mb-[12px] mt-[10px]">
                <p className="mb-[4px] text-[16px] font-semibold">
                  Description
                </p>
                <p className="rounded-[4px] border border-[#E6E6E6] p-[10px] text-[15px] leading-[1.45]">
                  {product.description}
                </p>
              </div>
            )}

            {/* Details */}
            {details.length > 0 && (
              <div className="mb-[16px] flex flex-col gap-[6px]">
                {details.map(({ label, value, valueClassName }) => (
                  <div key={label} className="flex gap-[8px] text-[15px]">
                    <span className="min-w-[112px] font-bold">{label}</span>
                    <span className={valueClassName}>{value}</span>
                  </div>
                ))}
              </div>
            )}

            <button
              type="button"
              onClick={openSafetyModal}
              className="btn-outline"
            >
              <span className="material-symbols-rounded text-[18px]">
                shield
              </span>
              Vérifier avec l'IA
            </button>
          </section>

          <section>
            <LeasingBookingSection
              leasingId={id}
              productTitle={product.postTitle}
              pricePerMonth={product.pricePerMonth}
              pricePerDay={product.pricePerDay}
              firstImageUrl={images[0]}
              initialStartDate={initialStartDate}
              initialEndDate={initialEndDate}
              minStartDate={minRentalStartDate}
            />
          </section>
        </div>

        {/* Reviews — full width below both columns */}
        <section className="px-[24px] pb-[24px]">
          <LeasingReviewsSection leasingId={id} />
        </section>
      </main>
      <NavBar />

      {isSafetyModalOpen && (
        <div className="ai-verification-overlay">
          <div className="ai-modal">
            <div className="flex items-start justify-between border-b border-[#d8d8d8] pb-[18px]">
              <h2 className="ai-modal-title">{product.postTitle}</h2>

              <button
                type="button"
                onClick={closeSafetyModal}
                aria-label="Fermer la modale"
                className="ml-[12px] flex size-[32px] items-center justify-center rounded-full bg-[#f5f5f7] text-[#040037]"
              >
                <span className="material-symbols-rounded text-[20px]">
                  close
                </span>
              </button>
            </div>

            <div className="pt-[20px]">
              {analysisStep === "choosing" && (
                <div className="space-y-[14px]">
                  <p className="ai-modal-title">Vérifier avec l&apos;IA</p>

                  <p className="ai-modal-subtitle">
                    Choisissez un enfant pour lancer l&apos;analyse de sécurité.
                  </p>

                  <div className="space-y-0">
                    {children.map((child, index) => {
                      const key = getChildKey(child, index);
                      const checked = selectedChildKeys.includes(key);

                      return (
                        <button
                          key={key}
                          type="button"
                          onClick={() => toggleChildSelection(child, index)}
                          className={`ai-select-option ${
                            checked ? "is-selected" : ""
                          }`}
                        >
                          <span className="truncate">
                            {child.firstName}
                            {child.age
                              ? ` · ${child.age} an${child.age > 1 ? "s" : ""}`
                              : " · Bébé attendu"}
                          </span>

                          <span className="ai-select-option-mark">✓</span>
                        </button>
                      );
                    })}
                  </div>

                  <button
                    type="button"
                    onClick={launchAnalysis}
                    disabled={selectedChildren.length === 0}
                    className="ai-btn"
                  >
                    Lancer l&apos;analyse
                  </button>
                </div>
              )}

              {analysisStep === "profile-loading" && (
                <div className="loading-modal">
                  <div className="ai-spinner" />

                  <p className="loading-title">
                    Chargement du profil en cours...
                  </p>
                  <p className="loading-text">
                    Nous récupérons les enfants associés à votre compte pour
                    lancer l&apos;analyse.
                  </p>
                </div>
              )}

              {analysisStep === "loading" && (
                <div className="loading-modal">
                  <div className="ai-spinner" />

                  <p className="loading-title">
                    Analyse en cours pour{" "}
                    {getAnalysisTargetLabel(selectedChildren)}...
                  </p>

                  <p className="loading-text">
                    L&apos;IA examine l&apos;état déclaré de l&apos;article et
                    la cohérence avec le profil sélectionné.
                  </p>
                </div>
              )}

              {analysisStep === "error" && (
                <div className="error-modal">
                  <p className="error-title">Analyse indisponible</p>

                  <p className="error-message">
                    {analysisError ||
                      "Le service n'a pas répondu. Vous pouvez relancer la demande."}
                  </p>

                  <button
                    type="button"
                    onClick={() => {
                      if (
                        children.length > 1 &&
                        selectedChildren.length === 0
                      ) {
                        setAnalysisStep("choosing");
                        return;
                      }

                      if (
                        children.length === 1 &&
                        selectedChildren.length === 0
                      ) {
                        setSelectedChildKeys([getChildKey(children[0], 0)]);
                      }

                      setAnalysisError("");
                      setAnalysisResult(null);
                      setAnalysisStep("loading");
                    }}
                    className="error-btn"
                  >
                    Réessayer
                  </button>
                </div>
              )}

              {analysisStep === "success" && analysisResult && (
                <div className="result-sheet">
                  <div className="result-sheet-inner">
                    <p className="result-title">Résultat de l&apos;analyse</p>

                    <div className="score-box">
                      Score de sécurité : {analysisResult.score}/100
                    </div>

                    <ul className="result-list">
                      {analysisResult.justifications.map(
                        (justification, index) => (
                          <li key={`${index}-${justification}`}>
                            {justification}
                          </li>
                        ),
                      )}
                    </ul>

                    <p className="result-note">
                      {analysisResult.disclaimer ?? DEFAULT_DISCLAIMER}
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="border-t border-[#d8d8d8] pt-[12px]">
              <p className="result-note">
                {analysisResult?.disclaimer ?? DEFAULT_DISCLAIMER}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
