import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { createExchange } from "../utils/exchangeApi";
import useTroc from "../hooks/useTroc";

const fallbackImage = (title) =>
  `https://placehold.co/182x182?text=${encodeURIComponent(title || "Produit")}`;

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

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <p className="text-[16px] text-[#757388]">Chargement…</p>
      </div>
    );
  }

  const displayError = error || localError;
  if (displayError) {
    return (
      <div className="flex items-center justify-center py-16">
        <p className="text-[16px] text-red-500">{displayError}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col bg-white w-full min-h-full">
      {/* Titre */}
      <div className="flex flex-row justify-center items-center self-stretch gap-2.5 px-3 py-2">
        <h2 className="text-[20px] font-bold text-[#040037]">
          Sélectionnez un article à échanger
        </h2>
      </div>

      {/* Grille produits + boutons */}
      <div className="flex flex-col flex-1 self-stretch gap-2.5 px-6">
        {/* Grille 2 colonnes */}
        {myProducts.length === 0 ? (
          <div className="flex items-center justify-center py-8">
            <p className="text-[16px] text-[#757388]">
              Vous n'avez pas de produit disponible.
            </p>
          </div>
        ) : (
          <div className="flex flex-wrap justify-center gap-5 py-0 px-3">
            {myProducts.map((p) => {
              const selected = selectedId === p.id;
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setSelectedId(p.id)}
                  className={`flex flex-col w-[182px] pb-5 rounded-lg overflow-hidden bg-white shadow-[0_2px_2px_rgba(0,0,0,0.1)] transition-all ${
                    selected ? "ring-2 ring-[#040037]" : ""
                  }`}
                >
                  {/* Image */}
                  <div className="w-full h-[182px] overflow-hidden rounded-sm">
                    <img
                      src={p.imageUrls?.[0] ?? fallbackImage(p.postTitle)}
                      alt={p.postTitle}
                      className="w-full h-full object-cover rounded-lg"
                      onError={(e) => {
                        e.currentTarget.src = fallbackImage(p.postTitle);
                      }}
                    />
                  </div>

                  {/* Informations */}
                  <div className="flex flex-col self-stretch gap-1 px-3 pt-1">
                    <p className="text-[16px] text-[#000000] text-center">
                      {p.postTitle}
                    </p>
                    {selected && p.estimatedPrice != null && (
                      <p className="text-[16px] font-semibold text-[#040037] text-center">
                        {p.estimatedPrice}€
                      </p>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {/* Espaceur */}
        <div className="flex-1" />

        {/* Boutons d'action */}
        <div className="flex flex-col items-center self-stretch gap-2.5 p-2.5 pb-4">
          <button
            type="button"
            onClick={handleContinue}
            className="w-[330px] h-[40px] bg-[#040037] text-white rounded-lg flex items-center justify-center"
          >
            <span className="text-[16px] font-semibold">Continuer</span>
          </button>

          <button
            type="button"
            onClick={() => navigate(-1)}
            className="w-[330px] flex items-end justify-center gap-2.5 px-2 py-2"
          >
            <span className="text-[16px] text-[#757388]">Retour</span>
          </button>
        </div>
      </div>
    </div>
  );
}
