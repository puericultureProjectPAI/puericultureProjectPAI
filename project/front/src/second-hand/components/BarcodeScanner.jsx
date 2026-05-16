import { useEffect } from "react";
import { useBarcodeScanner } from "../hooks/useBarcodeScanner";

export default function BarcodeScanner({ onDetected }) {
  const { isScanning, error, startScanner, stopScanner } =
    useBarcodeScanner(onDetected);

  useEffect(() => {
    startScanner();
    return () => stopScanner();
  }, [startScanner, stopScanner]);

  return (
    <div className="w-full max-w-sm mx-auto flex flex-col gap-3">
      {error && (
        <div className="text-red-600 text-sm text-center bg-red-50 p-3 rounded-lg">
          {error}
        </div>
      )}
      <div className="relative w-full rounded-xl overflow-hidden shadow-sm bg-gray-100 min-h-[250px] border border-gray-200">
        {!isScanning && !error && (
          <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-sm z-0">
            Démarrage de la caméra...
          </div>
        )}
        <div id="qr-reader" className="relative z-10 w-full" />
      </div>
    </div>
  );
}
