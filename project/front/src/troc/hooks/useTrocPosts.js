import { useQuery } from "@tanstack/react-query";
import { apiClient } from "../../common/utils/apiClient";

const fetchTrocPosts = async (filters) => {
  const params = {};
  if (filters.category) params.category = filters.category;
  if (filters.city) params.city = filters.city;
  const { data } = await apiClient.get("/troc/posts", { params });
  return data;
};

const fetchTrocPostById = async (id) => {
  const { data } = await apiClient.get(`/troc/posts/${id}`);
  return data;
};

export const useTrocPosts = (filters = {}) => {
  return useQuery({
    queryKey: ["troc-posts", filters],
    queryFn: () => fetchTrocPosts(filters),
  });
};

export const useTrocPost = (id) => {
  return useQuery({
    queryKey: ["troc-post", id],
    queryFn: () => fetchTrocPostById(id),
    enabled: !!id,
  });
};
