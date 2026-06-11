import { useCallback, useEffect, useState } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router";
import Layout from "./common/views/Layout";
import Connection from "./common/views/Connection";
import { AuthProvider } from "./common/security/AuthContext";
import RoleGuard from "./common/security/RoleGuard";
import ProtectedRoute from "./common/security/ProtectedRoute";
import ForwardTradingView from "./forward-trading/views/ForwardTradingView";
import RegisterView from "./common/views/RegisterView";
import CatalogPage from "./leasing/views/CatalogPage";
import ProductDetailPage from "./leasing/views/ProductDetailPage";
import PublishAnnouncementView from "./common/views/PublishAnnouncementView.jsx";
import TrocView from "./troc/views/TrocView";
import TrocSuggestionList from "./troc/components/TrocSuggestionList";
import { getTrocSuggestions } from "./troc/utils/exchangeApi.jsx";
import CreationEnfantView from "./forward-trading/views/CreationEnfantView";
// Second-hand
import SecondHandScan from "./second-hand/views/SecondHandScan";
import Profile from "./common/views/Profile.jsx";

export default function App() {
  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      globalThis.deferredPrompt = e;
      globalThis.dispatchEvent(new Event("pwa-prompt-available"));
    };

    globalThis.addEventListener(
      "beforeinstallprompt",
      handleBeforeInstallPrompt,
    );

    return () =>
      globalThis.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt,
      );
  }, []);

  return (
    <AuthProvider>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Connection />} />
        <Route path="/register" element={<RegisterView />} />

        {/* Leasing - public */}
        <Route path="/leasing/catalog" element={<CatalogPage />} />
        <Route path="/leasing/products/:id" element={<ProductDetailPage />} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route path="/home" element={<Home />} />
            <Route path="/me" element={<Profile />} />
            <Route element={<RoleGuard access={() => true} />}>
              {/* Second-hand : scan de code-barres */}
              <Route path="/second-hand/scan" element={<SecondHandScan />} />
              <Route
                path="/forward/timeline/:id"
                element={<ForwardTradingView />}
              />
              <Route
                path="/forward/create-children"
                element={<CreationEnfantView />}
              />
              <Route
                path="/product/create"
                element={<PublishAnnouncementView />}
              />
              <Route path="/troc" element={<TrocView />} />
            </Route>

            <Route path="/" element={<Navigate to="/home" replace />} />
            <Route path="*" element={<Navigate to="/home" replace />} />
          </Route>
        </Route>
      </Routes>
    </AuthProvider>
  );
}

function Home() {
  const navigate = useNavigate();
  const [trocSuggestions, setTrocSuggestions] = useState([]);
  const [suggestionsLoading, setSuggestionsLoading] = useState(false);
  const [suggestionsError, setSuggestionsError] = useState("");

  const fetchHomeTrocSuggestions = useCallback(async () => {
    setSuggestionsLoading(true);
    setSuggestionsError("");

    try {
      const response = await getTrocSuggestions();
      setTrocSuggestions(response.data);
    } catch (error) {
      setSuggestionsError("Impossible de charger les suggestions de troc.");
      console.error("Error fetching home troc suggestions", error);
    } finally {
      setSuggestionsLoading(false);
    }
  }, []);

  useEffect(() => {
    const timeoutId = globalThis.setTimeout(() => {
      void fetchHomeTrocSuggestions();
    }, 0);

    return () => globalThis.clearTimeout(timeoutId);
  }, [fetchHomeTrocSuggestions]);

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-8">
      <section className="rounded-2xl bg-[#080036] p-6 text-white shadow-md">
        <h1 className="text-2xl font-bold">Accueil</h1>
        <p className="mt-2 text-sm text-blue-100">
          Retrouvez vos services et les suggestions de troc les plus
          pertinentes.
        </p>
        <div className="mt-5 flex flex-col gap-3 sm:flex-row">
          <button
            className="rounded-xl bg-white px-6 py-3 font-semibold text-[#080036] shadow-md transition-transform hover:bg-blue-50 active:scale-95"
            onClick={() => navigate("/product/create")}
            type="button"
          >
            Publier un article
          </button>
          <button
            className="rounded-xl border border-white/40 px-6 py-3 font-semibold text-white transition-transform hover:bg-white/10 active:scale-95"
            onClick={() => navigate("/second-hand/scan")}
            type="button"
          >
            Scanner un produit
          </button>
        </div>
      </section>

      <TrocSuggestionList
        suggestions={trocSuggestions}
        loading={suggestionsLoading}
        onRefresh={fetchHomeTrocSuggestions}
      />

      {suggestionsError && (
        <p className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {suggestionsError}
        </p>
      )}
    </div>
  );
}
