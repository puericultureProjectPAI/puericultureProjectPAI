import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { apiClient } from "../../common/utils/apiClient";
import { createExchange } from "../utils/exchangeApi";
import TrocBackHeader from "../components/TrocBackHeader";

const fallbackImage = (title) =>
  `https://placehold.co/260x200?text=${encodeURIComponent(title || "Produit")}`;

export default function MyProductsSelectionView() {
  const { receiverId } = useParams();
  const navigate = useNavigate();
  const [myProducts, setMyProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // `loading` is initialized to true; perform fetch and update state when complete
    apiClient
      .get("/products/my-available")
      .then((res) => setMyProducts(res.data || []))
      .catch((err) => {
        console.error(err);
        setError("Impossible de charger vos produits.");
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSelect = async (product) => {
    try {
      await createExchange({
        proposerProductId: product.id,
        receiverProductId: parseInt(receiverId, 10),
      });
      navigate("/troc", { replace: true });
    } catch (err) {
      console.error(err);
      setError("Impossible de proposer l'échange.");
    }
  };

  if (loading) return <div className="p-4">Chargement…</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <div className="flex h-[100dvh] w-full flex-col bg-bg-base text-neutral">
      <TrocBackHeader title="Sélectionnez votre produit" />

      <main className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto px-4 py-6">
          <h2 className="text-lg font-semibold mb-4">
            Choisissez un de vos produits
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {myProducts.length === 0 && (
              <div className="p-4 bg-white rounded border">
                Vous n'avez pas de produit disponible.
              </div>
            )}

            {myProducts.map((p) => (
              <div
                key={p.id}
                className="bg-white rounded-lg border shadow-sm p-3 flex flex-col justify-between"
              >
                <div className="flex gap-3">
                  <img
                    src={p.imageUrls?.[0] ?? fallbackImage(p.postTitle)}
                    alt={p.postTitle}
                    className="h-20 w-28 object-cover rounded"
                    onError={(e) =>
                      (e.currentTarget.src = fallbackImage(p.postTitle))
                    }
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-base">{p.postTitle}</h3>
                    <div className="text-sm text-subtle mt-1">{p.category}</div>
                    <div className="text-sm text-subtle mt-2">{p.city}</div>
                  </div>
                </div>

                <div className="mt-4 flex justify-end">
                  <button
                    onClick={() => handleSelect(p)}
                    className="px-4 py-2 bg-[#040037] text-white rounded-lg font-semibold"
                  >
                    Proposer ce produit
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
