import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import TrocSuggestionList from "./TrocSuggestionList.jsx";

describe("TrocSuggestionList", () => {
  const suggestion = {
    id: 2,
    postTitle: "Siège auto",
    category: "Sécurité bébé et enfant",
    city: "Lille",
    estimatedPrice: 45,
    indicePertinence: 85,
    pertinenceReason: "Pertinence : même catégorie, même ville",
    author: {
      firstName: "Jean",
      name: "Dupont",
    },
  };

  it("renders product suggestions with their relevance score", () => {
    render(
      <TrocSuggestionList
        suggestions={[suggestion]}
        loading={false}
        onRefresh={vi.fn()}
      />,
    );

    expect(screen.getByText("Suggestions de troc")).toBeInTheDocument();
    expect(screen.getByText("Siège auto")).toBeInTheDocument();
    expect(screen.getByText("85%")).toBeInTheDocument();
    expect(
      screen.getByText("Pertinence : même catégorie, même ville"),
    ).toBeInTheDocument();
  });

  it("renders an empty state and calls refresh", () => {
    const onRefresh = vi.fn();

    render(
      <TrocSuggestionList
        suggestions={[]}
        loading={false}
        onRefresh={onRefresh}
      />,
    );

    expect(
      screen.getByText("Aucune suggestion disponible pour le moment."),
    ).toBeInTheDocument();

    fireEvent.click(screen.getByText("Actualiser"));

    expect(onRefresh).toHaveBeenCalledTimes(1);
  });
});
