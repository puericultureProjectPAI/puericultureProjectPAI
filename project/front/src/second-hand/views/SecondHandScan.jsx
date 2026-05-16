import { useState } from "react";
import BarcodeScanner from "../components/BarcodeScanner";

export default function SecondHandScan() {
  const [scannedCode, setScannedCode] = useState(null);

  const handleDetected = (barcode) => {
    setScannedCode(barcode);
    console.log("Code scanné :", barcode);
  };

  return (
    <div className="flex flex-col gap-6 px-4 py-6 max-w-lg mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Scanner un produit</h1>
        <p className="text-gray-500 text-sm mt-1">
          Pointez la caméra vers le code-barres EAN-13 du produit.
        </p>
      </div>

      {!scannedCode ? (
        <BarcodeScanner onDetected={handleDetected} />
      ) : (
        <div className="rounded-2xl border border-gray-200 bg-white shadow-sm p-5">
          <p className="font-mono text-lg font-bold">
            Code EAN : {scannedCode}
          </p>
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
