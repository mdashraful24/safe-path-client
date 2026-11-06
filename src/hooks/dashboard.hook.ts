import { useQuery } from "@tanstack/react-query";
import { getDashboardOverview } from "@/api";

export function useDashboardOverview() {
  return useQuery({
    queryKey: ["DASHBOARD_OVERVIEW"],
    queryFn: getDashboardOverview,
  });
}
