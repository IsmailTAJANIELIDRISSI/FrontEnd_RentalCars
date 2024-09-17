import { locationApi } from "@/environment";

const token = JSON.parse(localStorage.getItem("token"));
export const headers = {
  "Content-Type": "multipart/form-data",
  Authorization: `Bearer ${token}`,
};

export const headersNormal = {
  "Content-Type": "application/json",
  Authorization: `Bearer ${token}`,
};
export const getReclamation = (searchTerm, perPage = 10, currentPage = 1) => {
  return locationApi.get("/reclamations/search", {
    params: {
      searchTerm,
      per_page: perPage,
      page: currentPage,
    },
    headers,
  });
};
export const addReclamation = (reclamation) => {
  return locationApi.post("/reclamations", reclamation, { headers });
};
