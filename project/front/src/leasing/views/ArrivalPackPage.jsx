import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../../common/security/AuthContext";
import { apiClient } from "../../common/utils/apiClient";

export default function ArrivalPackPage() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [city, setCity] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [availableCities, setAvailableCities] = useState([]);

  const [childrenList, setChildrenList] = useState([]);
  const [selectedChildFirstName, setSelectedChildFirstName] = useState(null);
  const [carNeeded, setCarNeeded] = useState(false);
  const [packData, setPackData] = useState(null);

  const [step, setStep] = useState("filters");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    apiClient
      .get("/public/leasing/products/cities")
      .then((res) => setAvailableCities(res.data))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!isAuthenticated) return;
    apiClient
      .get("/person/me")
      .then((res) => {
        const children = res.data.children || [];
        setChildrenList(children);
        if (children.length === 1) {
          setSelectedChildFirstName(children[0].firstName);
        }
      })
      .catch(() => {});
  }, [isAuthenticated]);

  const handleFiltersSubmit = () => {
    if (!city || !startDate || !endDate) return;
    if (childrenList.length > 1 && !selectedChildFirstName) {
      setStep("select_child");
    } else {
      setStep("car_question");
    }
  };

  const handleChildSelect = (firstName) => {
    setSelectedChildFirstName(firstName);
    setStep("car_question");
  };

  const handleGeneratePack = () => {
    setStep("pack");
    setLoading(true);
    setError(null);

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
      .then((res) => setPackData(res.data))
      .catch(() => setError("Impossible de générer votre pack personnalisé."))
      .finally(() => setLoading(false));
  };

  if (!isAuthenticated) {
    return (
      <main className="mx-auto flex min-h-screen w-full max-w-md flex-col bg-white px-4 pt-6">
        <button
          onClick={() => navigate(-1)}
          className="mb-4 self-start text-sm text-gray-500"
        >
          ← Retour
        </button>
        <h1 className="mb-2 text-lg font-bold text-[#040037]">
          Planifier un voyage
        </h1>
        <p className="mb-4 text-sm text-gray-600">
          Connectez-vous pour recevoir un pack personnalisé en fonction de l'âge
          de votre enfant.
        </p>
        <button
          onClick={() => navigate("/login")}
          className="w-full rounded-lg bg-[#040037] py-3 text-sm font-semibold text-white"
        >
          Se connecter / S'inscrire
        </button>
      </main>
    );
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md flex-col bg-white px-4 pt-6 pb-24">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 self-start text-sm text-gray-500"
      >
        ← Retour
      </button>

      <h1 className="mb-1 text-lg font-bold text-[#040037]">
        Planifier un voyage
      </h1>
      <p className="mb-5 text-xs text-gray-500">
        Composez un pack de matériel adapté à votre enfant
      </p>

      {step === "filters" && (
        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-700">
              Ville de destination
            </label>
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-[#040037] focus:outline-none"
            >
              <option value="">Sélectionnez une ville</option>
              {availableCities.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-700">
                Date d'arrivée
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-[#040037] focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-700">
                Date de départ
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-[#040037] focus:outline-none"
              />
            </div>
          </div>

          <button
            onClick={handleFiltersSubmit}
            disabled={!city || !startDate || !endDate}
            className="mt-2 w-full rounded-lg bg-[#040037] py-3 text-sm font-semibold text-white disabled:opacity-40"
          >
            Continuer
          </button>
        </div>
      )}

      {step === "select_child" && (
        <div>
          <p className="mb-3 text-sm font-medium text-gray-700">
            Pour quel enfant organisez-vous ce séjour ?
          </p>
          <div className="flex flex-wrap gap-2">
            {childrenList.map((child, idx) => (
              <button
                key={idx}
                onClick={() => handleChildSelect(child.firstName)}
                className="rounded-full border border-[#040037] px-5 py-2 text-sm font-medium text-[#040037] transition-colors hover:bg-[#040037] hover:text-white"
              >
                {child.firstName}
              </button>
            ))}
          </div>
        </div>
      )}

      {step === "car_question" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between rounded-xl bg-gray-50 p-4">
            <span className="text-sm font-medium text-gray-700">
              Voiture sur place ?
            </span>
            <button
              onClick={() => setCarNeeded(!carNeeded)}
              className={`relative h-7 w-12 rounded-full transition-colors ${
                carNeeded ? "bg-[#040037]" : "bg-gray-300"
              }`}
            >
              <span
                className={`absolute left-1 top-1 h-5 w-5 rounded-full bg-white transition-transform ${
                  carNeeded ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>

          <button
            onClick={handleGeneratePack}
            className="w-full rounded-lg bg-[#040037] py-3 text-sm font-semibold text-white"
          >
            Générer mon pack
          </button>
        </div>
      )}

      {step === "pack" && (
        <div>
          {loading && (
            <p className="py-8 text-center text-sm text-gray-500">
              Génération du pack en cours…
            </p>
          )}
          {error && (
            <p className="py-8 text-center text-sm text-red-500">{error}</p>
          )}
          {!loading && !error && packData && (
            <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
              <h2 className="mb-1 text-sm font-bold text-[#040037]">
                Votre Pack Arrivée
              </h2>
              <p className="mb-4 text-xs text-gray-500">
                Enfant : {packData.childAgeMonths} mois · {city}
              </p>

              {packData.products.length === 0 ? (
                <p className="text-sm text-gray-500">
                  Aucun équipement disponible dans cette ville pour ces dates.
                </p>
              ) : (
                <ul className="mb-4 space-y-3">
                  {packData.products.map((p) => (
                    <li
                      key={p.id}
                      className="flex items-center gap-3 rounded-lg bg-white p-3 shadow-sm"
                    >
                      {p.firstImageUrl && (
                        <img
                          src={p.firstImageUrl}
                          alt={p.postTitle}
                          className="h-12 w-12 rounded-md object-cover"
                        />
                      )}
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-800">
                          {p.postTitle}
                        </p>
                        <p className="text-xs text-gray-500">
                          {p.pricePerDay} €/jour
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              )}

              <div className="flex items-center justify-between border-t border-gray-200 pt-3">
                <span className="text-sm text-gray-600">Total estimé</span>
                <span className="text-lg font-bold text-[#040037]">
                  {packData.totalPrice} €
                </span>
              </div>
            </div>
          )}
        </div>
      )}
    </main>
  );
}
