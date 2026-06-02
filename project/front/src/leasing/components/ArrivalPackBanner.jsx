import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../../common/security/AuthContext";
import { apiClient } from "../../common/utils/apiClient";

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

  // Steps: 'loading_profile', 'select_child', 'car_question', 'pack'
  const [step, setStep] = useState(
    isAuthenticated ? "loading_profile" : "unauth",
  );
  const [error, setError] = useState(null);

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
          setSelectedChildFirstName(children[0].firstName);
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

  // Générer le pack si l'enfant est sélectionné et qu'on est à l'étape pack
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
        if (!ignore) setPackData(res.data);
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

  return (
    <section className="relative mx-4 mb-4 mt-2 rounded-xl bg-blue-50 p-4 shadow-sm border border-blue-100">
      <button
        onClick={closeBanner}
        className="absolute right-3 top-3 flex h-6 w-6 items-center justify-center rounded-full bg-white text-gray-500 shadow-sm hover:text-gray-800"
        aria-label="Fermer le pack d'arrivée"
      >
        ✕
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
          <p className="text-xs text-gray-600 mb-3">
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
        <p className="text-xs text-gray-500 mt-3 text-center">
          Chargement de votre profil...
        </p>
      )}

      {step === "error" && (
        <p className="text-xs text-red-500 mt-3 text-center">{error}</p>
      )}

      {step === "select_child" && (
        <div className="mt-3">
          <p className="text-xs text-gray-700 font-medium mb-2">
            Pour quel enfant organisez-vous ce séjour ?
          </p>
          <div className="flex flex-wrap gap-2">
            {childrenList.map((child, idx) => (
              <button
                key={idx}
                onClick={() => handleChildSelect(child.firstName)}
                className="rounded-full border border-[#040037] px-4 py-1 text-xs font-medium text-[#040037] hover:bg-[#040037] hover:text-white transition-colors"
              >
                {child.firstName}
              </button>
            ))}
          </div>
        </div>
      )}

      {step === "car_question" && (
        <div className="mt-3">
          <div className="flex items-center justify-between rounded-lg bg-white p-3 shadow-[0_1px_4px_rgba(0,0,0,0.05)]">
            <span className="text-xs font-medium text-gray-700">
              Vous prévoyez de prendre une voiture sur place ?
            </span>
            <button
              onClick={() => setCarNeeded(!carNeeded)}
              className={`relative h-6 w-11 rounded-full transition-colors ${
                carNeeded ? "bg-[#040037]" : "bg-gray-300"
              }`}
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
            <p className="text-xs text-gray-500 text-center">
              Génération du pack en cours...
            </p>
          ) : (
            <div className="bg-white rounded-lg p-3 shadow-[0_1px_4px_rgba(0,0,0,0.05)]">
              <h3 className="text-[10px] font-bold text-gray-800 mb-2 uppercase tracking-wide">
                Pack Recommandé (Enfant: {packData.childAgeMonths} mois)
              </h3>
              <ul className="mb-3 space-y-2">
                {packData.products.length === 0 ? (
                  <li className="text-xs text-gray-500">
                    Aucun équipement disponible dans cette ville.
                  </li>
                ) : (
                  packData.products.map((p) => (
                    <li
                      key={p.id}
                      className="flex items-center gap-2 text-xs text-gray-700"
                    >
                      <span className="material-symbols-rounded text-[14px] text-green-600">
                        check_circle
                      </span>
                      <span className="truncate">{p.postTitle}</span>
                    </li>
                  ))
                )}
              </ul>
              <div className="flex items-center justify-between border-t border-gray-100 pt-2">
                <span className="text-[10px] text-gray-500">Total estimé</span>
                <span className="text-sm font-bold text-[#040037]">
                  {packData.totalPrice ? `${packData.totalPrice} €` : "0 €"}
                </span>
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
