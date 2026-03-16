import apiClient from "./apiClient";

/**
 * Fetch Church Dashboard data.
 * Includes church info, subscription details, and member statistics.
 */
export const getChurchDashboard = () =>
  apiClient.get("/api/registry/church/dashboard/");

// Tomb Type APIs
export const listTombTypes = () => apiClient.get("/api/registry/tomb-types/");
export const createTombType = (data) =>
  apiClient.post("/api/registry/tomb-types/", data);
export const getTombType = (id) =>
  apiClient.get(`/api/registry/tomb-types/${id}/`);
export const updateTombType = (id, data) =>
  apiClient.patch(`/api/registry/tomb-types/${id}/`, data);
export const deleteTombType = (id) =>
  apiClient.delete(`/api/registry/tomb-types/${id}/`);
