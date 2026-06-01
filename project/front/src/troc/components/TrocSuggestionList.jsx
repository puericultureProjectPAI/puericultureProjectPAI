import { useState } from "react";

const productTitle = (product) => product?.postTitle || "Article sans titre";

const authorName = (author) => {
  const firstName = author?.firstName || "";
  const name = author?.name || "";
  const fullName = `${firstName} ${name}`.trim();
  return fullName || author?.email || "Autre utilisateur";
};

const TrocSuggestionList = ({
  suggestions,
  loading,
  onAccept,
  onIgnore,
  onRefresh,
}) => {
  const [expandedSuggestionId, setExpandedSuggestionId] = useState(null);

  if (!loading && suggestions.length === 0) {
    return (
      <div className="rounded-lg border border-blue-200 bg-blue-50 p-6 text-center">
        <h2 className="mb-2 text-2xl font-bold text-gray-900">
          Suggestions de trocs
        </h2>
        <p className="mb-4 text-gray-600">
          Aucun troc n’est proposé pour le moment. Le système pourra générer des
          suggestions dès que des articles compatibles seront disponibles.
        </p>
        <button
          onClick={onRefresh}
          className="rounded-lg bg-blue-600 px-5 py-2 font-semibold text-white transition-colors hover:bg-blue-700"
        >
          Actualiser les suggestions
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 rounded-lg border border-blue-200 bg-blue-50 p-6 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Suggestions de trocs
          </h2>
          <p className="text-sm text-gray-600">
            Ces propositions sont générées automatiquement par le backend à
            partir de vos articles et des annonces disponibles.
          </p>
        </div>
        <button
          onClick={onRefresh}
          disabled={loading}
          className="rounded-lg bg-blue-600 px-5 py-2 font-semibold text-white transition-colors hover:bg-blue-700 disabled:bg-gray-400"
        >
          {loading ? "Chargement..." : "Actualiser"}
        </button>
      </div>

      {suggestions.map((suggestion) => {
        const isExpanded = expandedSuggestionId === suggestion.id;
        return (
          <div
            key={suggestion.id}
            className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm"
          >
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div className="space-y-3">
                <div>
                  <p className="text-xs font-semibold uppercase text-gray-500">
                    Vous proposez
                  </p>
                  <p className="text-lg font-bold text-gray-900">
                    {productTitle(suggestion.requesterProduct)}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase text-gray-500">
                    Article suggéré
                  </p>
                  <p className="text-lg font-bold text-blue-700">
                    {productTitle(suggestion.suggestedProduct)}
                  </p>
                  <p className="text-sm text-gray-600">
                    Par {authorName(suggestion.otherUser)}
                  </p>
                </div>
              </div>

              <div className="rounded-lg bg-green-50 px-4 py-3 text-center">
                <p className="text-3xl font-bold text-green-700">
                  {suggestion.compatibilityScore}%
                </p>
                <p className="text-xs font-semibold uppercase text-green-700">
                  compatibilité
                </p>
              </div>
            </div>

            <div className="mt-4 grid gap-3 text-sm text-gray-700 md:grid-cols-3">
              <p>
                <span className="font-semibold">Pertinence :</span>{" "}
                {suggestion.compatibilityReason || "Suggestion compatible"}
              </p>
              <p>
                <span className="font-semibold">Distance :</span>{" "}
                {suggestion.distanceKm !== null &&
                suggestion.distanceKm !== undefined
                  ? `${suggestion.distanceKm} km`
                  : "Non disponible"}
              </p>
              <p>
                <span className="font-semibold">Catégorie :</span>{" "}
                {suggestion.suggestedProduct?.category || "Non renseignée"}
              </p>
            </div>

            {isExpanded && (
              <div className="mt-4 rounded-lg bg-gray-50 p-4 text-sm text-gray-700">
                <p>
                  <span className="font-semibold">Description :</span>{" "}
                  {suggestion.suggestedProduct?.description ||
                    "Aucune description disponible."}
                </p>
                <p className="mt-2">
                  <span className="font-semibold">Ville :</span>{" "}
                  {suggestion.suggestedProduct?.city || "Non renseignée"}
                </p>
                <p className="mt-2">
                  <span className="font-semibold">État :</span>{" "}
                  {suggestion.suggestedProduct?.condition || "Non renseigné"}
                </p>
              </div>
            )}

            <div className="mt-5 flex flex-wrap gap-2">
              <button
                onClick={() =>
                  setExpandedSuggestionId(isExpanded ? null : suggestion.id)
                }
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50"
              >
                {isExpanded ? "Masquer le détail" : "Voir détail"}
              </button>
              <button
                onClick={() => onIgnore(suggestion.id)}
                disabled={loading}
                className="rounded-lg bg-gray-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-gray-600 disabled:bg-gray-400"
              >
                Ignorer
              </button>
              <button
                onClick={() => onAccept(suggestion.id)}
                disabled={loading}
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:bg-gray-400"
              >
                Accepter et proposer le troc
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default TrocSuggestionList;
