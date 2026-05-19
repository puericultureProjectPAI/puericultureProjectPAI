import { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router";
import Layout from "./common/views/Layout";
import Connection from "./common/views/Connection";
import { AuthProvider } from "./common/security/AuthContext";
import RoleGuard from "./common/security/RoleGuard";
import ProtectedRoute from "./common/security/ProtectedRoute";
import ForwardTradingView from "./forward-trading/views/ForwardTradingView";
import RegisterView from "./common/views/RegisterView";
import PublishAnnouncementView from "./common/views/PublishAnnouncementView.jsx";
import TrocView from "./troc/views/TrocView";
import CreationEnfantView from "./forward-trading/views/CreationEnfantView";
import { FamilyOnboardingView } from "./forward-trading/views/FamilyOnboardingView";

export default function App() {
  useEffect(() => {
    // PWA Logic: Captured at root to ensure shell availability
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
        {/* Public Route */}
        <Route path="/login" element={<Connection />} />
        <Route path="/register" element={<RegisterView />} />

        {/* Security: Protected Shell*/}
        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route path="/home" element={<Home />} />

            <Route element={<RoleGuard access={() => true} />}>
              {/* Future vertical routes go here */}
              <Route path="/forward" element={<ForwardTradingView />} />
              <Route
                path="/forward/create-children"
                element={<CreationEnfantView />}
              />
              <Route
                path="/product/create"
                element={<PublishAnnouncementView />}
              />
              <Route path="/troc" element={<TrocView />} />
                 <Route path="/onboarding-family"
                element={<FamilyOnboardingView />}
                />
            </Route>

            {/* Default Redirections: Explicit logic  */}
            <Route path="/" element={<Navigate to="/home" replace />} />
            <Route path="*" element={<Navigate to="/home" replace />} />
          </Route>
        </Route>
      </Routes>
    </AuthProvider>
  );
}

function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Project PAI</h1>
      {/*Mobile-first styling*/}
      <button className="w-full max-w-sm bg-blue-600 text-white font-medium py-3 px-6 rounded-xl shadow-md hover:bg-blue-700 active:scale-95 transition-transform">
        Main Action
      </button>
    </div>
  );
}
