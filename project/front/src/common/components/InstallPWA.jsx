import { useState, useEffect } from "react";

const InstallPWA = () => {
  const [isStandalone] = useState(
    () =>
      globalThis.matchMedia("(display-mode: standalone)").matches ||
      globalThis.navigator.standalone,
  );

  // Initialize state from the global window object if the event already fired
  const [deferredPrompt, setDeferredPrompt] = useState(
    globalThis.deferredPrompt,
  );

  useEffect(() => {
    const syncPrompt = () => setDeferredPrompt(globalThis.deferredPrompt);

    // Listen for the custom event in case it fires after this component mounts
    globalThis.addEventListener("pwa-prompt-available", syncPrompt);
    return () =>
      globalThis.removeEventListener("pwa-prompt-available", syncPrompt);
  }, []);

  const handleInstallClick = async () => {
    const prompt = deferredPrompt || window.deferredPrompt;
    if (!prompt) return;

    prompt.prompt();
    const { outcome } = await prompt.userChoice;

    if (outcome === "accepted") {
      globalThis.deferredPrompt = null;
      setDeferredPrompt(null);
    }
  };

  // Logic: Only show if not installed and prompt is available (or iOS)
  if (isStandalone || !deferredPrompt) return null;

  return (
    <div>
      <button className="bg-red-600" onClick={handleInstallClick}>
        Installer
      </button>
    </div>
  );
};

export default InstallPWA;
