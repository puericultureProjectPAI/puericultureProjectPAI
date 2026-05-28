import { useState } from "react";
import { useParams, useNavigate } from "react-router";

export default function LeasingProductDetailView() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Mock data for the product (Replace with real API fetch later)
  const product = {
    id: id || "123",
    title: "Chaussons Premiers Pas",
    brand: "KITCHOUN",
    description:
      "Chaussons souples et confortables pour bébé avec fermeture velcro (scratch). Idéals pour l'apprentissage de la marche en intérieur ou à la crèche. Semelle légère et antidérapante.",
    condition: "Très bon état",
    images: ["/leasing/chaussure.jpg"],
    basePrice: 4, // Base monthly price
  };

  // State
  const [selectedDuration, setSelectedDuration] = useState(3); // Months
  const [addInsurance, setAddInsurance] = useState(false);

  // Pricing Logic (Mock)
  const calculatePrice = () => {
    let price = product.basePrice;
    if (selectedDuration === 3) price = Math.round(price * 0.9); // 10% discount
    if (selectedDuration === 6) price = Math.round(price * 0.8); // 20% discount
    if (selectedDuration === 12) price = Math.round(price * 0.7); // 30% discount

    if (addInsurance) price += 5; // Flat +5€/month for insurance

    return price;
  };

  const finalMonthlyPrice = calculatePrice();

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 pb-28">
      {/* Top Header */}
      <header className="sticky top-0 z-10 flex items-center justify-between px-4 py-3 bg-white shadow-sm">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-full hover:bg-gray-100 transition"
        >
          {/* Back Icon */}
          <svg
            className="w-6 h-6 text-gray-800"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
        <span className="font-semibold text-gray-800">Détail du produit</span>
        <button className="p-2 rounded-full hover:bg-gray-100 transition text-gray-800">
          {/* Heart/Favorite Icon */}
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
        </button>
      </header>

      {/* Product Image */}
      <div className="w-full bg-white relative">
        <img
          src={product.images[0]}
          alt={product.title}
          className="w-full h-72 object-cover"
        />
        <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-semibold text-gray-700 shadow">
          {product.condition}
        </div>
      </div>

      <div className="p-4 bg-white mt-2 space-y-4">
        {/* Title and Brand */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{product.title}</h1>
          <p className="text-sm text-gray-500 font-medium tracking-wide uppercase mt-1">
            {product.brand}
          </p>
        </div>

        {/* Description */}
        <p className="text-gray-600 text-sm leading-relaxed">
          {product.description}
        </p>

        <hr className="border-gray-100" />

        {/* Leasing Configuration */}
        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-3">
            Durée de location
          </h3>
          <div className="grid grid-cols-4 gap-2">
            {[1, 3, 6, 12].map((months) => (
              <button
                key={months}
                onClick={() => setSelectedDuration(months)}
                className={`py-2 px-1 rounded-xl text-sm font-medium border-2 transition-all ${
                  selectedDuration === months
                    ? "border-blue-600 bg-blue-50 text-blue-700"
                    : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
                }`}
              >
                {months} {months === 1 ? "mois" : "mois"}
              </button>
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Plus la durée est longue, plus le tarif mensuel baisse.
          </p>
        </div>

        {/* Options / Insurance */}
        <div className="mt-4">
          <label className="flex items-start space-x-3 p-3 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50 transition">
            <input
              type="checkbox"
              className="mt-1 w-5 h-5 rounded text-blue-600 focus:ring-blue-500"
              checked={addInsurance}
              onChange={(e) => setAddInsurance(e.target.checked)}
            />
            <div className="flex-1">
              <span className="block font-semibold text-gray-900 text-sm">
                Assurance Casse & Vol
              </span>
              <span className="block text-xs text-gray-500 mt-0.5">
                Tranquillité d'esprit garantie (+5€/mois)
              </span>
            </div>
          </label>
        </div>
      </div>

      {/* Safety info blocks */}
      <div className="p-4 space-y-3 mt-2 bg-white">
        <div className="flex items-center space-x-3 text-sm text-gray-700">
          <svg
            className="w-5 h-5 text-green-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>Produit désinfecté et contrôlé</span>
        </div>
        <div className="flex items-center space-x-3 text-sm text-gray-700">
          <svg
            className="w-5 h-5 text-blue-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <span>Livraison et retour sans frais</span>
        </div>
      </div>

      {/* Fixed Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white border-t border-gray-200 p-4 pb-6 sm:pb-4 flex items-center justify-between z-20 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
        <div>
          <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-0.5">
            Tarif mensuel
          </p>
          <div className="flex items-baseline">
            <span className="text-2xl font-black text-gray-900">
              {finalMonthlyPrice}€
            </span>
            <span className="text-sm font-medium text-gray-500 ml-1">
              / mois
            </span>
          </div>
        </div>
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full shadow-lg shadow-blue-600/30 transition-all active:scale-95"
          onClick={() =>
            alert(`Location ajoutée au panier pour ${selectedDuration} mois !`)
          }
        >
          Louer l'article
        </button>
      </div>
    </div>
  );
}
