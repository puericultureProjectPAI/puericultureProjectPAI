/* @vitest-environment jsdom */

import "@testing-library/jest-dom/vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import TrocSuggestionList from "./TrocSuggestionList.jsx";

describe("TrocSuggestionList", () => {
  const suggestion = {
    id: 12,
    requesterProduct: {
      id: 1,
      postTitle: "Poussette bébé",
      category: "Poussettes, porte-bébés et sièges auto",
    },
    suggestedProduct: {
      id: 2,
      postTitle: "Siège auto",
      category: "Poussettes, porte-bébés et sièges auto",
      description: "Siège auto en très bon état",
      city: "Lille",
      condition: "Très bon état",
    },
    otherUser: { firstName: "Sarah", name: "Martin" },
    compatibilityScore: 90,
    compatibilityReason: "Compatibilité : même catégorie, prix proche",
    distanceKm: 0,
  };

  it("renders suggestion details and calls actions", () => {
    const onAccept = vi.fn();
    const onIgnore = vi.fn();
    const onRefresh = vi.fn();

    render(
      <TrocSuggestionList
        suggestions={[suggestion]}
        loading={false}
        onAccept={onAccept}
        onIgnore={onIgnore}
        onRefresh={onRefresh}
      />,
    );

    expect(screen.getByText("Poussette bébé")).toBeInTheDocument();
    expect(screen.getByText("Siège auto")).toBeInTheDocument();
    expect(screen.getByText(/90%/i)).toBeInTheDocument();
    expect(screen.getByText(/Sarah Martin/i)).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /voir détail/i }));
    expect(
      screen.getByText(/Siège auto en très bon état/i),
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /ignorer/i }));
    expect(onIgnore).toHaveBeenCalledWith(12);

    fireEvent.click(
      screen.getByRole("button", { name: /accepter et proposer le troc/i }),
    );
    expect(onAccept).toHaveBeenCalledWith(12);
  });

  it("renders an empty state when no suggestion is available", () => {
    render(
      <TrocSuggestionList
        suggestions={[]}
        loading={false}
        onAccept={vi.fn()}
        onIgnore={vi.fn()}
        onRefresh={vi.fn()}
      />,
    );

    expect(
      screen.getByText(/Aucun troc n’est proposé pour le moment/i),
    ).toBeInTheDocument();
  });
});
