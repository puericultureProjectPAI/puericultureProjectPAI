import { useState } from "react";
import BarcodeScanner from "../components/BarcodeScanner";
import UnknownProductForm from "../components/UnknownProductForm";
import { apiClient } from "../../common/utils/apiClient";

export default function SecondHandScan() {
  const [scannedCode, setScannedCode] = useState(null);
  const [productNotFound, setProductNotFound] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleDetected = async (barcode) => {
    console.log("📸 Barcode scanné :", barcode);

    setScannedCode(barcode);
    setLoading(true);
    setProductNotFound(false);

    try {
      await apiClient.get(`/api/v1/products/${barcode}`);

      //  CASE 200 OK - Produit trouvé
      setProductNotFound(false);
    } catch (err) {
      if (err.response) {
        const { status, data } = err.response;

        //  CASE 404 NOT FOUND - Produit inconnu
        if (status === 404) {
          console.log(" 404 reçu");

          if (data?.error === "PRODUCT_NOT_FOUND") {
            // console.log(" Produit inconnu → affichage formulaire");
            setProductNotFound(true);
          } else {
            console.log(" 404 mais format inattendu :", data);
          }
        } else {
          //  Autres erreurs serveur
          console.log(" Erreur serveur :", status);
        }
      } else {
        console.error(" Erreur réseau :", err);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSuccess = () => {
    console.log("Produit créé avec succès");
    setProductNotFound(false);
    setScannedCode(null);
  };

  return (
    <div className="flex flex-col gap-6 px-4 py-6 max-w-lg mx-auto">
      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Scanner un produit</h1>
        <p className="text-gray-500 text-sm mt-1">
          Pointez la caméra vers le code-barres EAN-13 du produit.
        </p>
      </div>

      {/* BARCODE SCANNER */}
      {!scannedCode && !productNotFound && (
        <BarcodeScanner onDetected={handleDetected} />
      )}

      {/* LOADING STATE */}
      {loading && (
        <p className="text-sm text-gray-500">Recherche du produit...</p>
      )}

      {/* UNKNOWN PRODUCT FORM */}
      {productNotFound && (
        <UnknownProductForm ean={scannedCode} onSubmitSuccess={handleSuccess} />
      )}

      {/* PRODUCT FOUND (PLACEHOLDER) */}
      {scannedCode && !productNotFound && !loading && (
        <div className="rounded-2xl border border-gray-200 bg-white shadow-sm p-5">
          <p className="font-mono text-lg font-bold">{scannedCode}</p>

          <p className="text-sm text-green-600 mt-2">
            Produit trouvé (affichage comparatif à venir)
          </p>

          <button
            onClick={() => {
              setScannedCode(null);
              setProductNotFound(false);
            }}
            className="mt-4 w-full text-sm text-blue-600 hover:underline"
          >
            Scanner un autre produit
          </button>
        </div>
      )}
    </div>
  );
}
