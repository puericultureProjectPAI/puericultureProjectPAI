const fallbackImage = (category) =>
  `https://placehold.co/400x300?text=${encodeURIComponent(category || "Produit")}`;

export default function ArrivalPackEditModal({
  eligibleProducts,
  eligibleLoading,
  eligibleError,
  isProductSelected,
  onAddProduct,
  onRemoveProduct,
  onClose,
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#040037]/60 p-4 backdrop-blur-xs">
      <div className="relative flex max-h-[85dvh] w-full max-w-[420px] flex-col rounded-lg bg-white p-4 shadow-2xl">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-3 top-3 text-gray-500 hover:text-[#040037]"
          aria-label="Fermer"
        >
          <span className="material-symbols-rounded text-[20px]">close</span>
        </button>

        <h3 className="pr-8 text-base font-bold text-[#040037]">
          Modifier le pack
        </h3>

        <div className="mt-4 min-h-0 flex-1 overflow-y-auto">
          {eligibleLoading && (
            <p className="text-center text-sm text-gray-500">
              Chargement des articles...
            </p>
          )}
          {eligibleError && (
            <p className="text-center text-sm text-red-500">{eligibleError}</p>
          )}
          {!eligibleLoading && !eligibleError && (
            <ul className="space-y-2">
              {eligibleProducts.map((product) => {
                const selected = isProductSelected(product.id);
                return (
                  <li
                    key={product.id}
                    className="flex items-center gap-3 rounded border border-gray-100 p-2"
                  >
                    <img
                      src={
                        product.firstImageUrl || fallbackImage(product.category)
                      }
                      alt={product.postTitle}
                      className="h-12 w-12 shrink-0 rounded object-cover"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-[#040037]">
                        {product.postTitle}
                      </p>
                      <p className="truncate text-xs text-gray-500">
                        {product.category}
                      </p>
                    </div>
                    {selected ? (
                      <button
                        type="button"
                        onClick={() => onRemoveProduct(product.id)}
                        className="rounded border border-red-500 px-3 py-1 text-xs font-semibold text-red-600"
                      >
                        Retirer
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => onAddProduct(product)}
                        className="rounded bg-[#040037] px-3 py-1 text-xs font-semibold text-white"
                      >
                        Ajouter
                      </button>
                    )}
                  </li>
                );
              })}
              {eligibleProducts.length === 0 && (
                <li className="text-center text-sm text-gray-500">
                  Aucun article compatible disponible.
                </li>
              )}
            </ul>
          )}
        </div>

        <button
          type="button"
          onClick={onClose}
          className="mt-4 h-10 w-full rounded-md bg-[#040037] text-sm font-semibold text-white"
        >
          Valider
        </button>
      </div>
    </div>
  );
}
