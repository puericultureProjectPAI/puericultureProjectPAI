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
        <h1 className="text-2xl font-bold text-gray-900">
          Scanner un produit en magasin
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Pointez la caméra vers le code-barres EAN-13 du produit.
        </p>
      </div>

      {!scannedCode ? (
        <BarcodeScanner onDetected={handleDetected} />
      ) : (
        <div className="rounded-2xl border border-gray-200 bg-white shadow-sm p-5">
          <button
            onClick={() => setScannedCode(null)}
            className="w-full text-sm bg-[#75738880] text-white py-3 rounded-xl font-medium hover:opacity-80 transition-opacity"
          >
            Scanner un autre produit
          </button>
        </div>
      )}

      <input
        type="text"
        readOnly
        value={scannedCode ? `Code scanné : ${scannedCode}` : "Scanner actif"}
        className="w-full p-4 rounded-xl border-2 text-center font-semibold outline-none transition-colors border-green-500 text-green-600 bg-green-50"
      />
    </div>
  );
}
