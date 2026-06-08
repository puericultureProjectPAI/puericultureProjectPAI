import { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router";
import Layout from "./common/views/Layout";
import Connection from "./common/views/Connection";
import { AuthProvider } from "./common/security/AuthContext";
import RoleGuard from "./common/security/RoleGuard";
import ProtectedRoute from "./common/security/ProtectedRoute";
import ForwardTradingView from "./forward-trading/views/ForwardTradingView";
import RegisterView from "./common/views/RegisterView";
import CatalogPage from "./leasing/views/CatalogPage";
import LeasingProductDetailView from "./leasing/views/LeasingProductDetailView";
import LeasingBookingPage from "./leasing/views/LeasingBookingPage";
import PublishAnnouncementView from "./common/views/PublishAnnouncementView.jsx";
import ProductTrocDetailView from "./troc/views/ProductTrocDetailView";
import MyProductsSelectionView from "./troc/views/MyProductsSelectionView";
import CreationEnfantView from "./forward-trading/views/CreationEnfantView";
import GlobalCatalogView from "./common/views/GlobalCatalogView";
// Second-hand
import SecondHandScan from "./second-hand/views/SecondHandScan";
import Profile from "./common/views/Profile.jsx";
import PriceComparisonView from "./second-hand/views/PriceComparisonView.jsx";

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
        <Route
          path="/leasing/products/:id"
          element={<LeasingProductDetailView />}
        />
        <Route path="/leasing/booking/:id" element={<LeasingBookingPage />} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route path="/home" element={<GlobalCatalogView />} />
            <Route path="/me" element={<Profile />} />
            <Route element={<RoleGuard access={() => true} />}>
              {/* Second-hand : scan de code-barres */}
              <Route path="/second-hand/scan" element={<SecondHandScan />} />
              <Route
                path="/second-hand/compare/:ean"
                element={<PriceComparisonView />}
              />
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
              <Route
                path="/troc/products/:id"
                element={<ProductTrocDetailView />}
              />
              <Route
                path="/troc/select-my-product/:receiverId"
                element={<MyProductsSelectionView />}
              />
            </Route>

            <Route path="*" element={<Navigate to="/home" replace />} />
          </Route>
        </Route>
      </Routes>
    </AuthProvider>
  );
}
