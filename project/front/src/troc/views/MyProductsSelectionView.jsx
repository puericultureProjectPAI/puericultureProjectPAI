import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { createExchange } from "../utils/exchangeApi";
import TrocBackHeader from "../components/TrocBackHeader";
import useTroc from "../hooks/useTroc";
// (icons removed per design)

const fallbackImage = (title) =>
  `https://placehold.co/260x200?text=${encodeURIComponent(title || "Produit")}`;

export default function MyProductsSelectionView() {
  const { receiverId } = useParams();
  const navigate = useNavigate();
  const { products: myProducts, loading, error, fetchMyProducts } = useTroc();
  const [localError, setLocalError] = useState(null);
  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    fetchMyProducts();
  }, [fetchMyProducts]);

  const handleContinue = async () => {
    if (!selectedId) return setLocalError("Sélectionnez un produit.");
    try {
      await createExchange({
        proposerProductId: selectedId,
        receiverProductId: parseInt(receiverId, 10),
      });
      navigate("/troc", { replace: true });
    } catch (err) {
      console.error(err);
      setLocalError("Impossible de proposer l'échange.");
    }
  };

  if (loading) return <div className="p-4">Chargement…</div>;
  const displayError = error || localError;
  if (displayError)
    return <div className="p-4 text-red-500">{displayError}</div>;

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

            {myProducts.map((p) => {
              const selected = selectedId === p.id;
              return (
                <div
                  key={p.id}
                  onClick={() => setSelectedId(p.id)}
                  role="button"
                  tabIndex={0}
                  className={`bg-white rounded-lg border shadow-sm p-3 flex items-center justify-between cursor-pointer focus:outline-none ${selected ? "border-2 border-[#040037]" : ""}`}
                >
                  <div className="flex gap-3 items-center">
                    <div className="h-28 w-28 flex items-center justify-center rounded-lg bg-[#FBF9FD] overflow-hidden">
                      <img
                        src={p.imageUrls?.[0] ?? fallbackImage(p.postTitle)}
                        alt={p.postTitle}
                        className="h-full w-full object-contain"
                        onError={(e) =>
                          (e.currentTarget.src = fallbackImage(p.postTitle))
                        }
                      />
                    </div>
                    <div className="flex-1 pl-2">
                      <h3 className="font-semibold text-base">{p.postTitle}</h3>
                      <div className="text-sm text-subtle mt-1">
                        {p.category}
                      </div>
                      <div className="text-sm text-subtle mt-2">
                        <span>{p.city}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {selected ? (
                      <span className="text-[#040037] font-semibold">
                        Sélectionné
                      </span>
                    ) : (
                      <span className="text-[#7C7A8A]">›</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer actions (Continue / Retour) */}
          <div className="mt-6">
            <button
              onClick={handleContinue}
              disabled={!selectedId}
              className={`w-full h-11 rounded-full font-semibold text-base ${selectedId ? "bg-[#040037] text-white" : "bg-[#E9E9EE] text-[#999]"} transition`}
            >
              Continuer
            </button>

            <div className="mt-3 text-center">
              <button
                onClick={() => navigate(-1)}
                className="text-sm text-[#7C7A8A]"
              >
                Retour
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
