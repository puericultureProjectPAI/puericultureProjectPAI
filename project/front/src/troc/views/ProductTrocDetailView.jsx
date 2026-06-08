import { useState, useEffect } from "react";
import { useParams } from "react-router";
import { apiClient } from "../../common/utils/apiClient";
// Header and NavBar are provided by the global `Layout`; avoid double rendering here
import TrocBackHeader from "../components/TrocBackHeader";
import TrocOfferSection from "../components/TrocOfferSection";
import "../troc.css";

const fallbackImage = (title) =>
  `https://placehold.co/260x200?text=${encodeURIComponent(title || "Produit")}`;

export default function ProductTrocDetailView() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    apiClient
      .get(`/public/troc/products/${id}`)
      .then((res) => setProduct(res.data))
      .catch(() => setError("Impossible de charger le produit."))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <main className="flex h-screen w-full items-center justify-center bg-white text-[#040037]">
        <p className="text-sm text-[#7C7A8A]">Chargement…</p>
      </main>
    );
  }

  if (error || !product) {
    return (
      <main className="flex h-screen w-full items-center justify-center bg-white text-[#040037]">
        <p className="text-sm text-red-500">
          {error || "Produit introuvable."}
        </p>
      </main>
    );
  }

  const images =
    product.imageUrls?.length > 0
      ? product.imageUrls
      : [fallbackImage(product.postTitle)];

  return (
    <div className="flex h-[100dvh] w-full flex-col overflow-hidden bg-white text-[#040037]">
      <TrocBackHeader />

      <main className="flex-1 overflow-y-auto">
        <section className="relative">
          <img
            src={images[currentImage]}
            alt={product.postTitle}
            className="h-[320px] md:h-[420px] w-full object-cover"
            onError={(e) => {
              e.currentTarget.src = fallbackImage(product.postTitle);
            }}
          />

          {/* Thumbnails / indicators */}
          {images.length > 1 && (
            <div className="absolute left-1/2 top-[90%] -translate-x-1/2 flex items-center gap-2">
              {images.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentImage(i)}
                  aria-label={`Image ${i + 1}`}
                  className={`h-2 w-8 rounded-full transition-colors ${
                    i === currentImage ? "bg-[#040037]" : "bg-[#040037]/30"
                  }`}
                />
              ))}
            </div>
          )}
        </section>

        <div className="w-full px-4 md:px-6 md:pt-4">
          <section className="pb-4">
            <div className="mb-3 flex justify-end">
              <span className="rounded-full border border-[#040037] px-3 py-1 text-xs font-semibold">
                Troc
              </span>
            </div>

            <div className="mb-3 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
              <div>
                <h1 className="text-2xl md:text-3xl font-extrabold leading-tight">
                  {product.postTitle}
                </h1>
                <div className="mt-2 text-sm text-[#7C7A8A]">
                  <span>{product.city}</span>
                  <span className="mx-2">•</span>
                  <span>{new Date(product.postDate).toLocaleDateString()}</span>
                </div>
              </div>

              {product.estimatedPrice !== null &&
                product.estimatedPrice !== undefined && (
                  <div className="flex items-baseline gap-2">
                    <span className="text-xs text-[#7C7A8A]">Estimation</span>
                    <span className="text-xl font-bold text-[#040037]">
                      {product.estimatedPrice >= 1000
                        ? (product.estimatedPrice / 100).toFixed(2)
                        : product.estimatedPrice}
                      &nbsp;€
                    </span>
                  </div>
                )}
            </div>

            {product.description && (
              <div className="mb-4 mt-3">
                <p className="mb-2 text-sm font-semibold">Description</p>
                <p className="rounded-lg border border-[#F0F0F2] p-4 text-sm leading-relaxed text-[#333333]">
                  {product.description}
                </p>
              </div>
            )}
          </section>

          <section>
            <TrocOfferSection product={product} />
          </section>
        </div>

        <section className="px-4 md:px-6 pb-6">
          {/* Placeholder for reviews or exchanges list if needed in future */}
        </section>
      </main>
    </div>
  );
}
