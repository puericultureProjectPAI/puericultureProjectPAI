import TimelineArticle from "./TimelineArticle";

const formatPrice = (value) => `${value}€`;

export default function TimelinePeriod({ period }) {
  const articles = period?.products ?? [];
  const count = articles.length;
  const total = articles.reduce(
    (sum, article) => sum + (article.price ?? 0),
    0,
  );
  return (
    <div className="px-6">
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <h3 className="text-gray-800 font-bold flex items-center gap-2">
          {/* Etoile en SVG Natif */}
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="#EAB308"
            stroke="#EAB308"
            strokeWidth="2"
            aria-hidden="true"
          >
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
          Articles recommandés
          <span className="text-sm font-semibold text-gray-600">({count})</span>
        </h3>

        {count > 0 && (
          <span
            className="text-sm font-bold text-blue-600"
            aria-label={`Total du lot ${period.type}`}
          >
            Lot {period.type} : {formatPrice(total)}
          </span>
        )}
      </div>

      {count === 0 ? (
        <div className="bg-white p-6 rounded-2xl text-center text-sm text-gray-500 shadow-sm">
          Aucun article recommandé pour ce lot pour le moment.
        </div>
      ) : (
        <div className="space-y-4">
          {articles.map((product, idx) => (
            <TimelineArticle key={idx} article={product} />
          ))}
        </div>
      )}
    </div>
  );
}
