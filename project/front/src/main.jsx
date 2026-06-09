import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import "./index.css";

// Virtual import from vite-plugin-pwa
import { registerSW } from "virtual:pwa-register";
// Initialize the Service Worker and listen for new deployments
const updateSW = registerSW({
  onNeedRefresh() {
    // Alert the user that a new version of the app is available.
    // Replace this `confirm` with a custom UI Toast/Modal designed by your UI Lead.
    const userWantsToUpdate = confirm(
      "A new app version is available. Reload now?",
    );
    if (userWantsToUpdate) {
      updateSW(true); // Purge old cache and load the new code
    }
  },
  onOfflineReady() {
    console.log("PWA Engine: The app is now ready to work offline.");
  },
});

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
);
