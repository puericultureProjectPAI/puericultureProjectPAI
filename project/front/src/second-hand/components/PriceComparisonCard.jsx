export const PriceComparisonCard = ({ product, comparison }) => {
  const { newPrice } = product;
  const {
    averageOccasionPrice,
    savingsAmount,
    savingsPercent,
    lowSampleWarning,
  } = comparison;

  return (
    <div className="mb-8 overflow-hidden rounded-xl border border-green-200 bg-white shadow-sm">
      <div className="flex flex-col items-center justify-center p-6 md:flex-row md:justify-around">
        <div className="text-center">
          <p className="text-sm text-gray-400 line-through">{newPrice} €</p>
          <p className="text-3xl font-black text-green-600">
            {averageOccasionPrice}€
          </p>
          <p className="text-xs font-medium text-gray-500 uppercase">
            Prix moyen d'occasion
          </p>
        </div>

        <div className="mt-4 h-px w-12 bg-gray-100 md:mt-0 md:h-12 md:w-px" />

        <div className="mt-4 rounded-full bg-green-50 px-6 py-2 text-center md:mt-0 border border-green-100">
          <span className="text-lg font-bold text-green-700">
            +{savingsAmount}€ économisés ({savingsPercent}%)
          </span>
        </div>
      </div>

      {lowSampleWarning && (
        <div className="bg-orange-50 py-1 text-center text-[11px] font-semibold text-orange-700 border-t border-orange-100">
          ⚠️ Prix indicatif — peu d'annonces disponibles
        </div>
      )}
    </div>
  );
};
