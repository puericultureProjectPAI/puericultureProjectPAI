import { useQuery } from "@tanstack/react-query";
import { apiClient } from "../../common/utils/apiClient";

export const useTimelineData = (timelineId) => {
  const {
    data: periods = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["timeline", timelineId],
    queryFn: async () => {
      const response = await apiClient.get(
        `/forward-trading/timelines/${timelineId}`,
      );
      return response.data;
    },
    enabled: !!timelineId,
  });

  return { periods, isLoading, error };
};
