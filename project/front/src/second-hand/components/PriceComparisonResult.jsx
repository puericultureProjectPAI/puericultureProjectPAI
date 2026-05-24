import { useNavigate } from "react-router-dom";

const PriceComparisonResult = ({ product, comparison, status }) => {
  const navigate = useNavigate();
  const listings = comparison?.listings || []; // Récupération des annonces depuis la comparaison

  if (status === "LOADING")
    return <div className="p-10 animate-pulse">Chargement...</div>;

  if (status === "ERROR") {
    return (
      <div className="p-10 text-center">
        <h2 className="font-bold">Produit introuvable</h2>
        <button
          onClick={() => navigate("/scan")}
          className="mt-4 border p-2 rounded"
        >
          Scanner à nouveau
        </button>
      </div>
    );
  }

  const { listingsCount, averageOccasionPrice, savingsAmount, savingsPercent } =
    comparison;

  return (
    <div className="mx-auto max-w-4xl p-6 pb-40">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#000033]">
          Articles disponibles
        </h1>
        <p className="text-gray-400 text-sm">
          {product.brand} - {product.name}
        </p>
      </div>

      {/* Encart Economie */}
      <div className="mb-8 rounded-2xl border border-green-100 bg-green-50/30 p-5 text-center">
        <p className="text-xs text-gray-400 line-through">{product.price} €</p>
        <p className="text-2xl font-black text-[#000033]">
          {averageOccasionPrice}€
        </p>
        <p className="text-sm font-bold text-green-600">
          +{savingsAmount}€ économisés ({savingsPercent}%)
        </p>
      </div>

      {/* Liste des produits réels du backend */}
      <div className="grid grid-cols-2 gap-4">
        {listings.map((item) => (
          <div key={item.id} className="border rounded-xl p-2 bg-white">
            <img
              src={item.imageUrl}
              className="h-32 w-full object-cover rounded-lg"
            />
            <p className="font-bold mt-2">{item.price}€</p>
            <p className="text-xs text-gray-500 truncate">{item.title}</p>
          </div>
        ))}
      </div>

      {/* Navigation fixe */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t">
        <button className="w-full bg-[#000033] text-white py-4 rounded-full font-bold">
          Voir les {listingsCount} annonces
        </button>
      </div>
    </div>
  );
};

export default PriceComparisonResult;
