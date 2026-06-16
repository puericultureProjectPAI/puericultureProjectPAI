// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import TrocSuggestionList from "./TrocSuggestionList.jsx";

afterEach(() => {
  cleanup();
});

describe("TrocSuggestionList", () => {
  const suggestion = {
    id: 2,
    postTitle: "Siège auto",
    category: "Sécurité bébé et enfant",
    city: "Lille",
    estimatedPrice: 45,
    indicePertinence: 85,
    pertinenceReason: "Pertinence : même catégorie, même ville",
    images: [],
    author: {
      firstName: "Jean",
      name: "Dupont",
    },
  };

  it("renders a suggestion and its relevance score", () => {
    render(
      <TrocSuggestionList
        loading={false}
        onRefresh={vi.fn()}
        suggestions={[suggestion]}
      />,
    );

    expect(
      screen.getByRole("heading", { name: "Nos recommandations" }),
    ).toBeTruthy();
    expect(screen.getByText("Siège auto")).toBeTruthy();
    expect(screen.getByText("85%")).toBeTruthy();
    expect(
      screen.getByText("Pertinence : même catégorie, même ville"),
    ).toBeTruthy();
    expect(
      screen.getByRole("button", {
        name: /Voir (le détail|les détails)/i,
      }),
    ).toBeTruthy();
    expect(
      screen.getByRole("button", {
        name: /^(Proposer un troc|Accepter et proposer un troc)$/i,
      }),
    ).toBeTruthy();
    expect(screen.getByRole("button", { name: "Ignorer" })).toBeTruthy();
  });

  it("renders the empty state and refreshes suggestions", () => {
    const onRefresh = vi.fn();

    render(
      <TrocSuggestionList
        loading={false}
        onRefresh={onRefresh}
        suggestions={[]}
      />,
    );

    expect(
      screen.getByText("Aucune suggestion disponible pour le moment."),
    ).toBeTruthy();

    fireEvent.click(screen.getByRole("button", { name: "Actualiser" }));

    expect(onRefresh).toHaveBeenCalledTimes(1);
  });

  it("hides a suggestion when it is ignored", () => {
    render(<TrocSuggestionList loading={false} suggestions={[suggestion]} />);

    fireEvent.click(screen.getByRole("button", { name: "Ignorer" }));

    expect(screen.queryByText("Siège auto")).toBeNull();
    expect(
      screen.getByText("Aucune suggestion disponible pour le moment."),
    ).toBeTruthy();
  });

  it("calls the accept callback", () => {
    const onAccept = vi.fn();

    render(
      <TrocSuggestionList
        loading={false}
        onAccept={onAccept}
        suggestions={[suggestion]}
      />,
    );

    fireEvent.click(
      screen.getByRole("button", {
        name: /^(Proposer un troc|Accepter et proposer un troc)$/i,
      }),
    );

    expect(onAccept).toHaveBeenCalledTimes(1);
    expect(onAccept).toHaveBeenCalledWith(suggestion);
  });
});
