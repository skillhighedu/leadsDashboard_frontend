import { useEffect, useState } from "react";
import { leadAnalytics, type LeadAnalyticsResponse } from "@/services/leads.services";


export const useDashboardAnalytics = () => {
  const [data, setData] = useState<LeadAnalyticsResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await leadAnalytics();
        setData(response);
      } catch (error) {
        console.error("Error fetching analytics", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  return { data, loading };
};
