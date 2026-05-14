import { useState, useEffect } from "react";

// These values are read once at module load — they never change after mount
const getIsStandalone = () =>
  window.matchMedia("(display-mode: standalone)").matches ||
  window.navigator.standalone === true;

const getIsIOS = () => {
  const ua = window.navigator.userAgent.toLowerCase();
  return /iphone|ipad|ipod/.test(ua) && !window.navigator.standalone;
};

const InstallPWA = () => {
  // Initialized directly — no setState inside an effect
  const [isStandalone] = useState(getIsStandalone);
  const [isIOS] = useState(getIsIOS);
  const [deferredPrompt, setDeferredPrompt] = useState(null);

  useEffect(() => {
    // Listen for the native install prompt (Chrome Android / Chrome Desktop)
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
    console.log(outcome === "accepted" ? "PWA accepted." : "PWA dismissed.");
    setDeferredPrompt(null);
  };

  // Already installed — render nothing
  if (isStandalone) return null;

  // Neither iOS nor a native prompt available — nothing to show
  if (!isIOS && !deferredPrompt) return null;

  return (
    <div>
      <p>Install the application</p>

      {/* Chrome Android / Chrome Desktop — native install prompt available */}
      {deferredPrompt && <button onClick={handleInstallClick}>Install</button>}

      {/* iOS Safari — no native prompt, show manual instructions instead */}
      {isIOS && !deferredPrompt && (
        <p>
          iOS: tap <strong>Share [↑]</strong> then select{" "}
          <strong>"Add to Home Screen"</strong>
        </p>
      )}
    </div>
  );
};

export default InstallPWA;
