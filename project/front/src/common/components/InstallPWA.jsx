import { useState, useEffect } from "react";
import kiabiLogo from "../../assets/logo-Kiabi-complet-couleur-brand.png";

const InstallPWA = () => {
  const [isStandalone] = useState(
    () =>
      globalThis.matchMedia("(display-mode: standalone)").matches ||
      globalThis.navigator.standalone,
  );

  const [deferredPrompt, setDeferredPrompt] = useState(
    globalThis.deferredPrompt,
  );

  useEffect(() => {
    const syncPrompt = () => setDeferredPrompt(globalThis.deferredPrompt);

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

  // Masque le composant si l'app est déjà installée ou si le prompt n'est pas prêt
  if (isStandalone || !deferredPrompt) return null;

  return (
    <div className="flex w-full items-center gap-4 bg-[#F2F2F9] px-6 py-3 shadow-sm">
      <img
        className="h-14 w-14 object-contain"
        src={kiabiLogo}
        alt="Logo Application Kiabi"
      />

      <div className="flex flex-col">
        <span className="font-['Figtree'] text-xl font-bold text-[#040037]">
          Application Kiabi
        </span>
        <span className="font-['Figtree'] text-base font-normal text-[#757388]">
          Meilleure expérience sur l'app !
        </span>
      </div>

      <button
        onClick={handleInstallClick}
        className="ml-auto flex h-10 items-center justify-center rounded-lg bg-[#040037] px-6 font-['Figtree'] text-base font-semibold text-[#FFFFFF] transition-opacity hover:opacity-90 active:scale-95"
      >
        Télécharger
      </button>
    </div>
  );
};

export default InstallPWA;
