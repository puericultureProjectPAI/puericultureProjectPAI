import { useState } from "react";
import { QUARTERLY_DATA } from "../utils/recommendations";

export default function TimelineFrise() {
  const [activeTab, setActiveTab] = useState(QUARTERLY_DATA[0]);
  // Détermine quel lot (index de 0 à 5) est actuellement affiché en premier
  const [startIndex, setStartIndex] = useState(0);

  // Découpe le tableau pour n'afficher que 3 éléments à la fois
  const visibleLots = QUARTERLY_DATA.slice(startIndex, startIndex + 3);

  // Navigation vers la droite (lots suivants)
  const nextSlide = () => {
    if (startIndex < QUARTERLY_DATA.length - 3) {
      setStartIndex(startIndex + 1);
    }
  };

  // Navigation vers la gauche (lots précédents)
  const prevSlide = () => {
    if (startIndex > 0) {
      setStartIndex(startIndex - 1);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-gray-50 min-h-screen pb-10 select-none">
      {/* HEADER */}
      <div className="bg-white p-6 rounded-b-3xl shadow-sm mb-8">
        <h2 className="text-xl font-bold text-gray-800">Ma Timeline</h2>
        <p className="text-sm text-gray-500">
          Visualisez vos lots et planifiez vos achats
        </p>
      </div>

      {/* CARROUSEL DE LA FRISE */}
      <div className="flex items-center justify-between px-4 mb-10 gap-2">
        {/* Bouton Gauche (Désactivé si en bordure gauche) */}
        <button
          onClick={prevSlide}
          disabled={startIndex === 0}
          className={`p-2 rounded-full bg-white shadow-sm border border-gray-100 transition-opacity ${
            startIndex === 0
              ? "opacity-30 cursor-not-allowed"
              : "hover:bg-gray-100 active:scale-95"
          }`}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
          >
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>

        {/* Conteneur des 3 Bulles */}
        <div className="flex-1 relative py-2">
          {/* Ligne de fond */}
          <div className="absolute top-7 left-6 right-6 h-0.5 bg-gray-200"></div>

          <div className="flex justify-between relative z-10">
            {visibleLots.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item)}
                className="flex flex-col items-center gap-2 flex-1 transition-all"
              >
                {/* La bulle */}
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center border-4 transition-all ${
                    activeTab.id === item.id
                      ? "bg-blue-600 border-blue-100 scale-110 shadow-md shadow-blue-200"
                      : "bg-white border-gray-100 text-gray-400"
                  }`}
                >
                  <span
                    className={`text-xs font-bold ${activeTab.id === item.id ? "text-white" : ""}`}
                  >
                    {item.type}
                  </span>
                </div>
                {/* Le label sous la bulle */}
                <span
                  className={`text-[10px] font-bold uppercase whitespace-nowrap tracking-tight ${
                    activeTab.id === item.id ? "text-blue-600" : "text-gray-400"
                  }`}
                >
                  {item.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Bouton Droite (Désactivé si en bordure droite) */}
        <button
          onClick={nextSlide}
          disabled={startIndex === QUARTERLY_DATA.length - 3}
          className={`p-2 rounded-full bg-white shadow-sm border border-gray-100 transition-opacity ${
            startIndex === QUARTERLY_DATA.length - 3
              ? "opacity-30 cursor-not-allowed"
              : "hover:bg-gray-100 active:scale-95"
          }`}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
          >
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>

      {/* PANNEAU DE CONTENU */}
      <div className="px-6">
        <div className="bg-blue-50 border border-blue-100 p-4 rounded-2xl mb-6">
          <p className="text-xs text-blue-600 font-bold uppercase mb-1">
            {activeTab.type} - Aperçu de l'étape
          </p>
          <p className="text-sm text-gray-700 font-medium leading-relaxed">
            {activeTab.description}
          </p>
        </div>

        <h3 className="text-gray-800 font-bold mb-4 flex items-center gap-2">
          {/* SVG Étoile Natif */}
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="#EAB308"
            stroke="#EAB308"
            strokeWidth="2"
          >
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
          Articles essentiels recommandés
        </h3>

        <div className="space-y-4">
          {activeTab.products.map((product, idx) => (
            <div
              key={idx}
              className="bg-white p-4 rounded-2xl flex items-center gap-4 shadow-sm border border-transparent hover:border-blue-100 transition-all"
            >
              {/* Carré de couleur dynamique avec initiale */}
              <div className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 font-bold text-lg shrink-0">
                {product.name.charAt(0)}
              </div>

              <div className="flex-1 min-w-0">
                <span className="text-[9px] font-bold text-blue-600 uppercase bg-blue-50 px-2 py-0.5 rounded-md tracking-wider">
                  {product.tag}
                </span>
                <h4 className="text-sm font-bold text-gray-800 mt-1 truncate">
                  {product.name}
                </h4>
                <p className="text-xs text-gray-400">
                  Estimation : {product.price}
                </p>
              </div>

              {/* Chevron textuel simple › */}
              <span className="text-gray-300 text-xl font-light select-none pr-1">
                ›
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
