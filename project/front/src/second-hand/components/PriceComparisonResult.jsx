import { useNavigate } from "react-router-dom";

const PriceComparisonResult = ({ product = {}, comparison = {}, status }) => {
  const navigate = useNavigate();

  // Sécurisation : on définit des objets vides par défaut lors du destructuring
  const {
    listingsCount = 0,
    averageOccasionPrice = 0,
    savingsAmount = 0,
    savingsPercent = 0,
  } = comparison || {};

  const listings = comparison?.listings || [];

  if (status === "LOADING")
    return (
      <div className="p-10 animate-pulse text-center">
        Recherche des meilleures offres...
      </div>
    );

  if (status === "ERROR" || !product) {
    return (
      <div className="p-10 text-center">
        <h2 className="font-bold">Produit ou analyse introuvable</h2>
        <button
          onClick={() => navigate("/scan")}
          className="mt-4 border p-2 rounded"
        >
          Scanner à nouveau
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl p-6 pb-40">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#000033]">
          Articles disponibles
        </h1>
        <p className="text-gray-400 text-sm">
          {product?.brand || "Marque inconnue"} - {product?.name || "Produit"}
        </p>
      </div>

      <div className="mb-8 rounded-2xl border border-green-100 bg-green-50/30 p-5 text-center">
        <p className="text-xs text-gray-400 line-through">
          {product?.price || 0} €
        </p>
        <p className="text-2xl font-black text-[#000033]">
          {averageOccasionPrice}€
        </p>
        <p className="text-sm font-bold text-green-600">
          +{savingsAmount}€ économisés ({savingsPercent}%)
        </p>
      </div>

      {listings.length > 0 ? (
        <div className="grid grid-cols-2 gap-4">
          {listings.map((item) => (
            <div key={item.id} className="border rounded-xl p-2 bg-white">
              <img
                src={item.imageUrl || "placeholder.png"}
                className="h-32 w-full object-cover rounded-lg"
                alt={item.title}
              />
              <p className="font-bold mt-2">{item.price}€</p>
              <p className="text-xs text-gray-500 truncate">{item.title}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">
          Aucune annonce trouvée pour le moment.
        </p>
      )}

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t">
        <button className="w-full bg-[#000033] text-white py-4 rounded-full font-bold">
          Voir les {listingsCount} annonces
        </button>
      </div>
    </div>
  );
};

export default PriceComparisonResult;
