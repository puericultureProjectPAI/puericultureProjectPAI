import { useState, useEffect, useMemo } from "react";

const InstallPWA = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);

  // Computed once at render time — no effect needed
  const isStandalone = useMemo(
    () =>
      window.matchMedia("(display-mode: standalone)").matches ||
      !!window.navigator.standalone,
    [],
  );

  const isIOS = useMemo(() => {
    const ua = window.navigator.userAgent.toLowerCase();
    return /iphone|ipad|ipod/.test(ua) && !window.navigator.standalone;
  }, []);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    return () =>
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt,
      );
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    console.log(
      outcome === "accepted" ? "PWA setup accepted." : "PWA setup dismissed.",
    );
    setDeferredPrompt(null);
  };

  if (isStandalone) return null;

  return (
    <div className="p-4 bg-gray-100 border-b border-gray-300 text-center flex flex-col items-center gap-3 z-50 w-full">
      <p className="font-semibold text-gray-800 text-sm m-0">
        Install the ecosystem for full access to trading, leasing, and forward
        markets.
      </p>

      {deferredPrompt && (
        <button
          onClick={handleInstallClick}
          className="px-6 py-3 bg-black text-white font-bold rounded-md w-full max-w-xs hover:bg-gray-800 transition-colors"
        >
          Install Application
        </button>
      )}

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
