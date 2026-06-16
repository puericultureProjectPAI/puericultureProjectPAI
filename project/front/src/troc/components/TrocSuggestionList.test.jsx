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

  it("renders catalogue-style suggestions with their relevance score", () => {
    render(
      <TrocSuggestionList
        loading={false}
        onRefresh={vi.fn()}
        suggestions={[suggestion]}
      />,
    );

    expect(screen.getByText("Nos recommandations")).toBeInTheDocument();
    expect(screen.getByText("Siège auto")).toBeInTheDocument();
    expect(screen.getByText("85%")).toBeInTheDocument();
    expect(
      screen.getByText("Pertinence : même catégorie, même ville"),
    ).toBeInTheDocument();
    expect(screen.getByText("Voir les détails")).toBeInTheDocument();
    expect(screen.getByText("Ignorer")).toBeInTheDocument();
    expect(screen.getByText("Proposer un troc")).toBeInTheDocument();
  });

  it("renders an empty state and calls refresh", () => {
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
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Actualiser" }));

    expect(onRefresh).toHaveBeenCalledTimes(1);
  });

  it("hides a suggestion when it is ignored", () => {
    render(<TrocSuggestionList loading={false} suggestions={[suggestion]} />);

    fireEvent.click(screen.getByText("Ignorer"));

    expect(screen.queryByText("Siège auto")).not.toBeInTheDocument();
    expect(
      screen.getByText("Aucune suggestion disponible pour le moment."),
    ).toBeInTheDocument();
  });

  it("calls accept callback when accepting a suggestion", () => {
    const onAccept = vi.fn();

    render(
      <TrocSuggestionList
        loading={false}
        onAccept={onAccept}
        suggestions={[suggestion]}
      />,
    );

    fireEvent.click(screen.getByText("Proposer un troc"));

    expect(onAccept).toHaveBeenCalledWith(suggestion);
  });
});
