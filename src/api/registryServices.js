import apiClient from "./apiClient";

// Ward APIs
export const listWards = () => apiClient.get("/api/registry/wards/");
export const createWard = (data) =>
  apiClient.post("/api/registry/wards/", data);
export const getWard = (id) => apiClient.get(`/api/registry/wards/${id}/`);
export const updateWard = (id, data) =>
  apiClient.patch(`/api/registry/wards/${id}/`, data);
export const deleteWard = (id) =>
  apiClient.delete(`/api/registry/wards/${id}/`);

// Grade APIs
export const listGrades = () => apiClient.get("/api/registry/grade/");
export const createGrade = (data) =>
  apiClient.post("/api/registry/grade/", data);
export const getGrade = (id) => apiClient.get(`/api/registry/grade/${id}/`);
export const updateGrade = (id, data) =>
  apiClient.patch(`/api/registry/grade/${id}/`, data);
export const deleteGrade = (id) =>
  apiClient.delete(`/api/registry/grade/${id}/`);

// Relationships APIs
export const listRelationships = () =>
  apiClient.get("/api/registry/relationships/");
export const createRelationship = (data) =>
  apiClient.post("/api/registry/relationships/", data);
export const getRelationship = (id) =>
  apiClient.get(`/api/registry/relationships/${id}/`);
export const updateRelationship = (id, data) =>
  apiClient.patch(`/api/registry/relationships/${id}/`, data);
export const deleteRelationship = (id) =>
  apiClient.delete(`/api/registry/relationships/${id}/`);

// Families APIs
export const listFamilies = () => apiClient.get("/api/registry/families/");
export const createFamily = (data) =>
  apiClient.post("/api/registry/families/", data);
export const getFamily = (id) => apiClient.get(`/api/registry/families/${id}/`);
export const updateFamily = (id, data) =>
  apiClient.patch(`/api/registry/families/${id}/`, data);
export const deleteFamily = (id) =>
  apiClient.delete(`/api/registry/families/${id}/`);

// Members APIs
export const listMembers = () => apiClient.get("/api/registry/members/");
export const createMember = (data) =>
  apiClient.post("/api/registry/members/", data);
export const getMember = (id) => apiClient.get(`/api/registry/members/${id}/`);
export const updateMember = (id, data) =>
  apiClient.patch(`/api/registry/members/${id}/`, data);
export const deleteMember = (id) =>
  apiClient.delete(`/api/registry/members/${id}/`);
export const createHead = (data) =>
  apiClient.post("/api/registry/members/create-head/", data);
