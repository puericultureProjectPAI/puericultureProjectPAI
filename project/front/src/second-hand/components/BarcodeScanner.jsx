import { useBarcodeScanner } from "../hooks/useBarcodeScanner";

/**
 * BarcodeScanner
 * Composant de scan EAN-13 via ZXing + feedback haptique/visuel.
 *
 * Props :
 *   onDetected(barcode: string) — appelé dès qu'un code est scanné
 */
export default function BarcodeScanner({ onDetected }) {
  const {
    videoRef,
    isScanning,
    error,
    lastBarcode,
    startScanner,
    stopScanner,
  } = useBarcodeScanner(onDetected);

  return (
    <div className="flex flex-col items-center gap-4 w-full max-w-md mx-auto px-4">
      {/* Viewfinder */}
      <div className="relative w-full overflow-hidden rounded-2xl shadow-lg bg-black">
        {/* Élément vidéo — toujours présent dans le DOM pour que ZXing puisse s'y attacher */}
        <video
          ref={videoRef}
          className="w-full h-72 object-cover"
          playsInline
          muted
        />

        {/* Overlay + réticule quand le scanner est actif */}
        {isScanning && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            {/* Coins du réticule */}
            <div className="relative w-48 h-32">
              {/* Coin haut-gauche */}
              <span className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-green-400 rounded-tl-md" />
              {/* Coin haut-droit */}
              <span className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-green-400 rounded-tr-md" />
              {/* Coin bas-gauche */}
              <span className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-green-400 rounded-bl-md" />
              {/* Coin bas-droit */}
              <span className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-green-400 rounded-br-md" />

              {/* Ligne de scan animée */}
              <span className="absolute left-2 right-2 h-0.5 bg-green-400 opacity-80 animate-scan" />
            </div>
          </div>
        )}

        {/* Écran vide quand inactif */}
        {!isScanning && !error && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70">
            <svg
              className="w-12 h-12 text-gray-400 mb-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M3 7V5a2 2 0 012-2h2M17 3h2a2 2 0 012 2v2M21 17v2a2 2 0 01-2 2h-2M7 21H5a2 2 0 01-2-2v-2"
              />
              <rect
                x="7"
                y="7"
                width="10"
                height="10"
                rx="1"
                strokeWidth={1.5}
              />
            </svg>
            <p className="text-gray-400 text-sm">Caméra inactive</p>
          </div>
        )}
      </div>

      {/* Statuts */}
      {isScanning && (
        <div className="flex items-center gap-2 text-green-600 font-medium text-sm">
          {/* Point clignotant */}
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500" />
          </span>
          Scanner actif — pointez vers un code-barres
        </div>
      )}

      {error && (
        <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-red-700 text-sm w-full">
          <svg
            className="w-4 h-4 mt-0.5 shrink-0"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          {error}
        </div>
      )}

      {/* Résultat */}
      {lastBarcode && !isScanning && (
        <div className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-xl px-4 py-3 w-full">
          <svg
            className="w-5 h-5 text-green-600 shrink-0"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
          <div>
            <p className="text-xs text-green-600 font-medium uppercase tracking-wide">
              Code scanné
            </p>
            <p className="text-green-800 font-mono font-semibold text-sm">
              {lastBarcode}
            </p>
          </div>
        </div>
      )}

      {/* Boutons */}
      <div className="flex gap-3 w-full">
        {!isScanning ? (
          <button
            onClick={startScanner}
            className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-semibold py-3 px-6 rounded-xl shadow-md transition-all"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 7V5a2 2 0 012-2h2M17 3h2a2 2 0 012 2v2M21 17v2a2 2 0 01-2 2h-2M7 21H5a2 2 0 01-2-2v-2"
              />
            </svg>
            Démarrer le scanner
          </button>
        ) : (
          <button
            onClick={stopScanner}
            className="flex-1 flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 active:scale-95 text-white font-semibold py-3 px-6 rounded-xl shadow-md transition-all"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
            Arrêter
          </button>
        )}
      </div>
    </div>
  );
}
