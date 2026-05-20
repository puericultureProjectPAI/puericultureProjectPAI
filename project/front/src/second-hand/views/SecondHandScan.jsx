import { useState } from "react";
import BarcodeScanner from "../components/BarcodeScanner";
import { ScanQrCodeIcon, Heart } from "lucide-react";

export default function SecondHandScan() {
  const [scannedCode, setScannedCode] = useState(null);

  const handleDetected = (barcode) => {
    setScannedCode(barcode);
    console.log("Code scanné :", barcode);
  };

  return (
    <div className="flex flex-col gap-6 px-4 py-6 max-w-lg mx-auto">
      <div className="w-full h-[66px] bg-[#040037] px-4 flex items-center justify-between">
        <img
          src="/logoKiabi.png"
          alt="Logo"
          className="w-[150px] h-[33px] object-contain"
        />

        <div className="flex items-center gap-5">
          <ScanQrCodeIcon className="w-6 h-6 text-white" strokeWidth={2} />

          <Heart className="w-6 h-[21.21px] text-white" strokeWidth={2} />
        </div>
      </div>
      <div className="flex flex-col items-center text-center">
        <h1 className="text-2xl font-bold text-gray-900">
          Scanner un produit en magasin
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Pointez la caméra vers le code-barres EAN-13 du produit.
        </p>
      </div>

      {!scannedCode ? (
        <div className="flex flex-col gap-4">
          <BarcodeScanner onDetected={handleDetected} />
          <div className="w-full rounded-xl bg-green-50 border border-green-200 px-4 py-3 text-center shadow-sm">
            <p className="text-green-700 font-semibold">Scanner actif</p>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <div className="w-full rounded-xl bg-green-50 border border-green-200 px-4 py-3 text-center shadow-sm">
            <p className="text-green-700 font-semibold break-all">
              Code scanné : {scannedCode}
            </p>
          </div>
          <div className="rounded-2xl border border-gray-200 bg-white shadow-sm p-5">
            <button
              onClick={() => setScannedCode(null)}
              className="w-full text-sm text-white bg-[#040037] hover:bg-[#030026] rounded-md py-3 font-semibold transition-colors"
            >
              Scanner un autre produit
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
