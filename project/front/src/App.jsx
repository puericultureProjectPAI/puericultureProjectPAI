import { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router";

import Layout from "./common/views/Layout";
import Connection from "./common/views/Connection";

import { AuthProvider } from "./common/security/AuthContext";
import RoleGuard from "./common/security/RoleGuard";
import ProtectedRoute from "./common/security/ProtectedRoute";
import RegisterView from "./common/views/RegisterView";

import CartPage from "./leasing/views/CartPage";

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
<Route path="/leasing/cart" element={<CartPage />} />
        <Route path="/login" element={<Connection />} />
        <Route path="/register" element={<RegisterView />} />

        {/* Security: Protected Shell */}
        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route path="/home" element={<Home />} />

            <Route element={<RoleGuard access={() => true} />}>
              {/* Leasing */}
              <Route path="/leasing/cart" element={<CartPage />} />
            </Route>

            {/* Default Redirections */}
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
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4">
      <h1 className="mb-6 text-2xl font-bold text-gray-900">
        Project PAI
      </h1>

      {/* Mobile-first styling */}
      <button className="w-full max-w-sm rounded-xl bg-blue-600 px-6 py-3 font-medium text-white shadow-md transition-transform hover:bg-blue-700 active:scale-95">
        Main Action
      </button>
    </div>
  );
}