import React, { useState, useEffect } from "react";

const InstallPWA = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // 1. Detect if the app is already running as a PWA
    const checkStandalone = () => {
      const isStandaloneMode =
        window.matchMedia("(display-mode: standalone)").matches ||
        window.navigator.standalone;
      setIsStandalone(isStandaloneMode);
    };
    checkStandalone();

    // 2. Detect Apple devices (iOS restriction bypass)
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIOSDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(isIOSDevice && !window.navigator.standalone);

    // 3. Intercept the native install prompt on Chrome/Android
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt,
      );
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();

    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      console.log("PWA setup accepted.");
    } else {
      console.log("PWA setup dismissed.");
    }

    setDeferredPrompt(null);
  };

  // Render nothing if the app is already installed
  if (isStandalone) {
    return null;
  }

  return (
    <div className="p-4 bg-gray-100 border-b border-gray-300 text-center flex flex-col items-center gap-3 z-50 w-full">
      <p className="font-semibold text-gray-800 text-sm m-0">
        Install the ecosystem for full access to trading, leasing, and forward
        markets.
      </p>
      {/* Android & Desktop Action */}
      {(
        <button
          onClick={handleInstallClick}
          className="px-6 py-3 bg-black text-white font-bold rounded-md w-full max-w-xs hover:bg-gray-800 transition-colors"
        >
          Install Application
        </button>
      )}

      {/* iOS Manual Instructions */}
      {isIOS && !deferredPrompt && (
        <div className="text-sm text-gray-600 bg-gray-200 p-3 rounded-md w-full max-w-sm">
          <p className="m-0">
            🍎 <strong>iOS:</strong> Tap the Share icon <strong>[↑]</strong>{" "}
            below, then select <strong>"Add to Home Screen"</strong> to install.
          </p>
        </div>
      )}
    </div>
  );
};

export default InstallPWA;
