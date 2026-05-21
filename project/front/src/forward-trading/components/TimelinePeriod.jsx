import TimelineArticle from "./TimelineArticle";

export default function TimelinePeriod({ period }) {
  return (
    <div className="px-6">
      <h3 className="text-gray-800 font-bold mb-4 flex items-center gap-2">
        {/* Etoile en SVG Natif */}
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
        Articles recommandés
      </h3>

      <div className="space-y-4">
        {period.products.map((product, idx) => (
          <TimelineArticle key={idx} article={product} />
        ))}
      </div>
    </div>
  );
}
