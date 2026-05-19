import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { getTrocProduct } from "../utils/trocProductApi";
import { getProductImages } from "../utils/productImageApi";

export default function TrocProductDetailView() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [images, setImages] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [productRes, imagesRes] = await Promise.all([
          getTrocProduct(id),
          getProductImages(id),
        ]);
        setProduct(productRes.data);
        setImages(imagesRes.data);
      } catch {
        setError("Impossible de charger l'annonce.");
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, [id]);

  if (isLoading) return <p className="p-4 text-gray-500">Chargement...</p>;
  if (error) return <p className="p-4 text-red-500">{error}</p>;
  if (!product) return null;

  return (
    <div className="max-w-lg mx-auto p-4">
      {images.length > 0 && (
        <div className="flex gap-2 overflow-x-auto mb-4">
          {images
            .sort((a, b) => a.position - b.position)
            .map((img) => (
              <img
                key={img.id}
                src={img.imageUrl}
                alt={product.postTitle}
                className="w-32 h-32 object-cover rounded-lg flex-shrink-0"
              />
            ))}
        </div>
      )}

      <h1 className="text-xl font-bold text-gray-900 mb-1">
        {product.postTitle}
      </h1>
      <p className="text-sm text-gray-500 mb-3">{product.city}</p>
      <p className="text-gray-700 mb-4">{product.description}</p>

      {product.estimatedPrice != null && (
        <p className="text-sm text-gray-600">
          Prix estimé : {(product.estimatedPrice / 100).toFixed(2)} €
        </p>
      )}
    </div>
  );
}
