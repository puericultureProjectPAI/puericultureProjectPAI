// @vitest-environment jsdom
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { describe, expect, it, vi } from "vitest";
import { useTrocPosts, useTrocPost } from "./useTrocPosts";
import { apiClient } from "../../common/utils/apiClient";

vi.mock("../../common/utils/apiClient", () => ({
  apiClient: { get: vi.fn() },
}));

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return ({ children }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe("useTrocPosts", () => {
  it("retourne la liste des offres sans filtre", async () => {
    const posts = [{ id: 1, postTitle: "Poussette Yoyo" }];
    apiClient.get.mockResolvedValue({ data: posts });

    const { result } = renderHook(() => useTrocPosts(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(posts);
    expect(apiClient.get).toHaveBeenCalledWith("/troc/posts", { params: {} });
  });

  it("transmet les filtres catégorie et ville à l'API", async () => {
    apiClient.get.mockResolvedValue({ data: [] });

    const { result } = renderHook(
      () => useTrocPosts({ category: "Jouets", city: "Lyon" }),
      { wrapper: createWrapper() },
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(apiClient.get).toHaveBeenCalledWith("/troc/posts", {
      params: { category: "Jouets", city: "Lyon" },
    });
  });
});

describe("useTrocPost", () => {
  it("retourne une offre par son identifiant", async () => {
    const post = { id: 1, postTitle: "Poussette Yoyo" };
    apiClient.get.mockResolvedValue({ data: post });

    const { result } = renderHook(() => useTrocPost(1), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(post);
    expect(apiClient.get).toHaveBeenCalledWith("/troc/posts/1");
  });

  it("ne déclenche pas de requête si l'identifiant est absent", () => {
    const { result } = renderHook(() => useTrocPost(null), {
      wrapper: createWrapper(),
    });

    expect(result.current.fetchStatus).toBe("idle");
  });
});
