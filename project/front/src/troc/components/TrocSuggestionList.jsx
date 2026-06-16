import { useMemo, useState } from "react";

const fallbackImage = (category) =>
  `https://placehold.co/400x300?text=${encodeURIComponent(category || "Article")}`;

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

  return `${price}€`;
};

const suggestionImage = (suggestion) =>
  suggestion?.images?.[0]?.imageUrl ||
  suggestion?.firstImageUrl ||
  fallbackImage(suggestion?.category);

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

  return (
    <section className="font-['Figtree']">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-[20px] font-bold leading-[24px] text-[#080036]">
            Nos recommandations
          </h2>

          <p className="mt-1 text-[13px] leading-[18px] text-[#7C7A8A]">
            Les suggestions les plus pertinentes pour vos annonces.
          </p>
        </div>

        {onRefresh && (
          <button
            aria-label="Actualiser"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[#080036] transition hover:bg-[#F2F2F9] disabled:opacity-40"
            disabled={loading}
            onClick={onRefresh}
            type="button"
          >
            <svg
              aria-hidden="true"
              className={`h-6 w-6 ${loading ? "animate-spin" : ""}`}
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                d="M20 6v5h-5M4 18v-5h5M18.2 9A7 7 0 0 0 6.6 6.6L4 11M5.8 15A7 7 0 0 0 17.4 17.4L20 13"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
              />
            </svg>

            <span className="sr-only">Actualiser</span>
          </button>
        )}
      </div>

      {!loading && visibleSuggestions.length === 0 && (
        <p className="py-4 text-[13px] text-[#7C7A8A]">
          Aucune suggestion disponible pour le moment.
        </p>
      )}

      {visibleSuggestions.length > 0 && (
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
          {visibleSuggestions.map((suggestion) => (
            <article
              key={suggestionKey(suggestion)}
              className="relative flex min-w-0 flex-col overflow-hidden rounded-[9px] bg-white shadow-[0_1px_4px_rgba(0,0,0,0.10)]"
            >
              <div className="relative">
                <img
                  alt={productTitle(suggestion)}
                  className="aspect-square w-full bg-[#F5F5F7] object-cover"
                  src={suggestionImage(suggestion)}
                />

                <span className="absolute right-2 top-2 rounded-full bg-white/95 px-2.5 py-1 text-[12px] font-bold text-[#188A42] shadow-sm">
                  {suggestion.indicePertinence}%
                </span>
              </div>

              <div className="flex flex-1 flex-col px-3 pb-3 pt-2">
                <div className="flex justify-end">
                  <span className="rounded-[12px] border border-[#080036] px-3 py-1 text-[13px] leading-[18px]">
                    Troc
                  </span>
                </div>

                <h3 className="mt-2 line-clamp-2 text-[16px] font-normal leading-5 text-[#080036]">
                  {productTitle(suggestion)}
                </h3>

                <p className="mt-1 text-[16px] font-bold leading-5 text-[#080036]">
                  {formatPrice(suggestion.estimatedPrice)}
                </p>

                <p className="mt-2 truncate text-[12px] text-[#7C7A8A]">
                  {suggestion.city || "Ville non renseignée"}
                  {suggestion.distanceKm !== null &&
                  suggestion.distanceKm !== undefined
                    ? ` · ${suggestion.distanceKm} km`
                    : ""}
                </p>

                <p className="mt-1 truncate text-[12px] text-[#7C7A8A]">
                  Par {authorName(suggestion.author)}
                </p>

                {suggestion.pertinenceReason && (
                  <p className="mt-2 line-clamp-2 text-[11px] leading-4 text-[#7C7A8A]">
                    {suggestion.pertinenceReason}
                  </p>
                )}

                <div className="mt-auto grid gap-2 pt-3">
                  <button
                    className="h-10 rounded-[8px] border border-[#080036] px-3 font-['Figtree'] text-[13px] font-medium text-[#080036]"
                    onClick={() => onViewDetails?.(suggestion)}
                    type="button"
                  >
                    Voir les détails
                  </button>

                  <button
                    className="h-10 rounded-[8px] bg-[#080036] px-3 font-['Figtree'] text-[13px] font-semibold leading-4 text-white"
                    onClick={() => acceptSuggestion(suggestion)}
                    type="button"
                  >
                    Proposer un troc
                  </button>

                  <button
                    className="h-8 font-['Figtree'] text-[12px] font-medium text-[#7C7A8A] underline underline-offset-2"
                    onClick={() => ignoreSuggestion(suggestion)}
                    type="button"
                  >
                    Ignorer
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
};

export default TrocSuggestionList;
