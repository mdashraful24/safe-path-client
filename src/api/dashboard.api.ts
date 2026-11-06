import apiClient from "@/lib/apiClient";
import type { ApiResponse, DashboardOverview } from "@/types";

export function getDashboardOverview() {
  return apiClient<ApiResponse<DashboardOverview>>("/dashboard/overview");
}
