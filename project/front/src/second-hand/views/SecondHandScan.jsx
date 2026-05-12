import { useState } from "react";
import BarcodeScanner from "../components/BarcodeScanner";

/**
 * SecondHandScan
 * Vue de la fonctionnalité "Second-hand" : scan d'un produit par code-barres.
 * À brancher sur une route dans App.jsx (ex: /second-hand/scan)
 */
export default function SecondHandScan() {
  const [scannedCode, setScannedCode] = useState(null);

  const handleDetected = (barcode) => {
    setScannedCode(barcode);
    // TODO : déclencher ici un appel API pour récupérer les infos du produit
    // ex: queryClient.fetchQuery(['product', barcode], () => fetchProduct(barcode))
    console.log("Code scanné :", barcode);
  };

  return (
    <div className="flex flex-col gap-6 px-4 py-6 max-w-lg mx-auto">
      {/* En-tête */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Scanner un produit</h1>
        <p className="text-gray-500 text-sm mt-1">
          Pointez la caméra vers le code-barres EAN-13 du produit.
        </p>
      </div>

      {/* Scanner */}
      <BarcodeScanner onDetected={handleDetected} />

      {/* Zone de résultat étendu */}
      {scannedCode && (
        <div className="rounded-2xl border border-gray-200 bg-white shadow-sm p-5">
          <h2 className="text-base font-semibold text-gray-800 mb-1">
            Produit identifié
          </h2>
          <p className="text-xs text-gray-500 mb-3">Code-barres :</p>
          <p className="font-mono text-lg text-gray-900 font-bold tracking-widest">
            {scannedCode}
          </p>

          {/* Placeholder pour les infos produit à venir (appel API) */}
          <div className="mt-4 rounded-xl bg-gray-50 border border-dashed border-gray-300 p-4 text-center text-sm text-gray-400">
            Les informations produit seront affichées ici après appel API.
          </div>

          <button
            onClick={() => setScannedCode(null)}
            className="mt-4 w-full text-sm text-blue-600 hover:underline"
          >
            Scanner un autre produit
          </button>
        </div>
      )}
    </div>
  );
}
