import { useMemo, useState } from "react";

const productTitle = (product) => product?.postTitle || "Article sans titre";

const authorName = (author) => {
  const firstName = author?.firstName || "";
  const name = author?.name || "";
  const fullName = `${firstName} ${name}`.trim();
  return fullName || author?.email || "Autre utilisateur";
};

const formatPrice = (price) => {
  if (price === null || price === undefined || price === "") {
    return "Prix non renseigné";
  }

  return `${price} €`;
};

const suggestionKey = (suggestion) =>
  suggestion?.id ?? suggestion?.productId ?? suggestion?.postTitle;

const TrocSuggestionList = ({
  suggestions = [],
  loading,
  onAccept,
  onRefresh,
  onViewDetails,
}) => {
  const [ignoredSuggestionIds, setIgnoredSuggestionIds] = useState([]);

  const visibleSuggestions = useMemo(
    () =>
      suggestions.filter(
        (suggestion) =>
          !ignoredSuggestionIds.includes(suggestionKey(suggestion)),
      ),
    [ignoredSuggestionIds, suggestions],
  );

  const ignoreSuggestion = (suggestion) => {
    const key = suggestionKey(suggestion);

    if (key !== undefined) {
      setIgnoredSuggestionIds((currentIds) => [...currentIds, key]);
    }
  };

  const acceptSuggestion = (suggestion) => {
    if (onAccept) {
      onAccept(suggestion);
      return;
    }

    onViewDetails?.(suggestion);
  };

  if (!loading && visibleSuggestions.length === 0) {
    return (
      <section className="rounded-2xl border border-blue-100 bg-blue-50 p-5 shadow-sm">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-xl font-bold text-[#080036]">
              Nos recommandations
            </h2>
            <p className="mt-1 text-sm text-gray-600">
              Aucune suggestion disponible pour le moment.
            </p>
          </div>
          {onRefresh && (
            <button
              onClick={onRefresh}
              className="rounded-lg bg-[#080036] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#1a1157]"
              type="button"
            >
              Actualiser
            </button>
          )}
        </div>
      </section>
    );
  }

  return (
    <section className="rounded-2xl border border-blue-100 bg-white p-5 shadow-sm">
      <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-xl font-bold text-[#080036]">
            Nos recommandations
          </h2>
          <p className="mt-1 text-sm text-gray-600">
            Les suggestions de troc les plus pertinentes sont calculées
            automatiquement à partir de vos annonces disponibles.
          </p>
        </div>
        {onRefresh && (
          <button
            onClick={onRefresh}
            disabled={loading}
            className="rounded-lg bg-[#080036] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#1a1157] disabled:bg-gray-400"
            type="button"
          >
            {loading ? "Chargement..." : "Actualiser"}
          </button>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {visibleSuggestions.map((suggestion) => (
          <article
            key={suggestionKey(suggestion)}
            className="flex h-full flex-col rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
          >
            <div className="mb-3 flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase text-gray-500">
                  Article proposé
                </p>
                <h3 className="mt-1 line-clamp-2 text-lg font-bold text-[#080036]">
                  {productTitle(suggestion)}
                </h3>
              </div>
              <div className="rounded-full bg-green-50 px-3 py-1 text-sm font-bold text-green-700">
                {suggestion.indicePertinence}%
              </div>
            </div>

            <div className="space-y-2 text-sm text-gray-700">
              <p>
                <span className="font-semibold">Catégorie :</span>{" "}
                {suggestion.category || "Non renseignée"}
              </p>
              <p>
                <span className="font-semibold">Ville :</span>{" "}
                {suggestion.city || "Non renseignée"}
              </p>
              <p>
                <span className="font-semibold">Prix estimé :</span>{" "}
                {formatPrice(suggestion.estimatedPrice)}
              </p>
              <p>
                <span className="font-semibold">Profil :</span>{" "}
                {authorName(suggestion.author)}
              </p>
              {suggestion.distanceKm !== null &&
                suggestion.distanceKm !== undefined && (
                  <p>
                    <span className="font-semibold">Distance :</span>{" "}
                    {suggestion.distanceKm} km
                  </p>
                )}
            </div>

            {suggestion.pertinenceReason && (
              <p className="mt-3 rounded-lg bg-gray-50 p-3 text-xs text-gray-600">
                {suggestion.pertinenceReason}
              </p>
            )}

            <div className="mt-4 flex flex-col gap-2">
              <button
                className="rounded-lg border border-[#080036] px-3 py-2 text-sm font-semibold text-[#080036] transition-colors hover:bg-[#f4f3fb]"
                onClick={() => onViewDetails?.(suggestion)}
                type="button"
              >
                Voir détail
              </button>

              <button
                className="rounded-lg border border-gray-300 px-3 py-2 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50"
                onClick={() => ignoreSuggestion(suggestion)}
                type="button"
              >
                Ignorer
              </button>

              <button
                className="rounded-lg bg-[#080036] px-3 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#1a1157]"
                onClick={() => acceptSuggestion(suggestion)}
                type="button"
              >
                Accepter et proposer un troc
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

export default TrocSuggestionList;
