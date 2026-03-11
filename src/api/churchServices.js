import apiClient from "./apiClient";

/**
 * Fetch Church Dashboard data.
 * Includes church info, subscription details, and member statistics.
 */
export const getChurchDashboard = () =>
  apiClient.get("/api/registry/church/dashboard/");
