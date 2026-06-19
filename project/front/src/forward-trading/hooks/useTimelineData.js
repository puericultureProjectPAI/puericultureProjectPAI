import { useEffect, useState } from "react";
import { apiClient } from "../../common/utils/apiClient";
import allArticles from "../utils/Timelinearticle.json";
import { PERIODS_CONFIG } from "../utils/periodsConfig";

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

        const enriched = response.data.map((period, index) => {
          const config = PERIODS_CONFIG[index];
          return {
            ...period,
            forwardTradingArticles: config
              ? allArticles.filter(
                  (a) =>
                    a.isValide &&
                    a.min_age_utilisation >= config.minAge &&
                    a.max_age_utilisation <= config.maxAge,
                )
              : [],
          };
        });

        setPeriods(enriched);
      } catch (err) {
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTimeline();
  }, [timelineId]);

  return { periods, isLoading, error };
};
