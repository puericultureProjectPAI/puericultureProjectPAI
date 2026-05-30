import { useEffect } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router";
import Layout from "./common/views/Layout";
import Connection from "./common/views/Connection";
import { AuthProvider } from "./common/security/AuthContext";
import RoleGuard from "./common/security/RoleGuard";
import ProtectedRoute from "./common/security/ProtectedRoute";
import ForwardTradingView from "./forward-trading/views/ForwardTradingView";
import RegisterView from "./common/views/RegisterView";
import CatalogPage from "./leasing/views/CatalogPage";
import PublishAnnouncementView from "./common/views/PublishAnnouncementView.jsx";
import TrocView from "./troc/views/TrocView";
import CreationEnfantView from "./forward-trading/views/CreationEnfantView";
import LeasingProductDetailView from "./leasing/views/LeasingProductDetailView";

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
        <Route path="/leasing/products/:id" element={<LeasingProductDetailView />} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route path="/home" element={<Home />} />
            <Route path="/me" element={<Profile />} />
            <Route element={<RoleGuard access={() => true} />}>
              {/* Future vertical routes go here */}
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
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4">
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Project PAI</h1>

      <button className="w-full max-w-sm rounded-xl bg-blue-600 px-6 py-3 font-medium text-white shadow-md transition-transform hover:bg-blue-700 active:scale-95">
        Main Action
      </button>
      <button
        className="w-full max-w-sm bg-blue-600 text-white font-medium py-3 px-6 rounded-xl shadow-md hover:bg-blue-700 active:scale-95 transition-transform"
        onClick={() => navigate("/second-hand/scan")}
      >
        Scanner un produit
      </button>
    </div>
  );
}
