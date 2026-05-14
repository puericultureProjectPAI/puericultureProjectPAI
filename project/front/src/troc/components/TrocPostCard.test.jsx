// @vitest-environment jsdom
import { cleanup, render, screen } from "@testing-library/react";
import * as matchers from "@testing-library/jest-dom/matchers";
import { afterEach, describe, expect, it, vi } from "vitest";
import TrocPostCard from "./TrocPostCard";

expect.extend(matchers);
afterEach(cleanup);

const mockPost = {
  postTitle: "Poussette Yoyo",
  category: "Poussette",
  city: "Paris",
  description: "Très bon état, peu utilisée.",
};

describe("TrocPostCard", () => {
  it("affiche le titre, la catégorie, la ville et la description", () => {
    render(<TrocPostCard post={mockPost} onClick={() => {}} />);

    expect(screen.getByText("Poussette Yoyo")).toBeInTheDocument();
    expect(screen.getByText("Poussette")).toBeInTheDocument();
    expect(screen.getByText("Paris")).toBeInTheDocument();
    expect(
      screen.getByText("Très bon état, peu utilisée."),
    ).toBeInTheDocument();
  });

  it("appelle onClick au clic sur la carte", () => {
    const handleClick = vi.fn();
    render(<TrocPostCard post={mockPost} onClick={handleClick} />);

    screen.getByRole("button").click();

    expect(handleClick).toHaveBeenCalledOnce();
  });
});
