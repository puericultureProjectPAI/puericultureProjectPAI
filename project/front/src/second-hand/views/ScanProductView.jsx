import { useState, useEffect } from "react";
import UnknownProductForm from "../components/UnknownProductForm";

const ScanProductView = ({ ean }) => {
  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!ean) return;

    const fetchProduct = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/v1/products/${ean}`);

        if (response.ok) {
          const data = await response.json();
          setProduct(data);
        } else if (response.status === 404) {
          const errorData = await response.json();

          if (errorData.error === "PRODUCT_NOT_FOUND") {
            setError("PRODUCT_NOT_FOUND");
          } else {
            setError("Une erreur est survenue.");
          }
        } else {
          setError("Une erreur est survenue.");
        }
      } catch {
        setError("Une erreur est survenue.");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [ean]);

  const handleSuccess = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/v1/products/${ean}`);
      const data = await response.json();

      setProduct(data);
    } catch {
      setError("Une erreur est survenue.");
    } finally {
      setLoading(false);
    }
  };

  // LOADING
  if (loading) {
    return <div>Chargement...</div>;
  }

  // FORM (PRODUCT NOT FOUND)
  if (error === "PRODUCT_NOT_FOUND") {
    return <UnknownProductForm ean={ean} onSubmitSuccess={handleSuccess} />;
  }

  // OTHER ERROR
  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  // PRODUCT FOUND
  return (
    <div>
      <h1>Détails du produit</h1>
      <pre>{JSON.stringify(product, null, 2)}</pre>
    </div>
  );
};

export default ScanProductView;
