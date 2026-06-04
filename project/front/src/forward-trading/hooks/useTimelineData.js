import { useEffect, useState } from "react";
import { apiClient } from "../../common/utils/apiClient";

export const useTimelineData = (timelineId) => {
  const [periods, setPeriods] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!timelineId) return;

    const fetchTimeline = async () => {
      try {
        setIsLoading(true);

        const response = await apiClient.get(
          `/forward-trading/timelines/${timelineId}`,
        );

        setPeriods(response.data);
      } catch (err) {
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTimeline();
  }, [timelineId]);

  return {
    periods,
    isLoading,
    error,
  };
};
