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

export const getClients = (searchTerm = "", currentPage = 1) => {
  return locationApi.get("/clients", {
    headers,
    params: {
      search: searchTerm, // Paramètre pour la recherche
      page: currentPage, // Paramètre pour la pagination
    },
    headers,
  });
};

export const getClientById = (idClient) => {
  return locationApi.get(`/clients/${idClient}`, { headers });
};

export const addClient = (client) => {
  return locationApi.post("/clients", client, { headers });
};

export const editClient = (idClient, clientData) => {
  return locationApi.put(`/clients/${idClient}`, clientData, {
    headers: headersNormal,
  });
};
