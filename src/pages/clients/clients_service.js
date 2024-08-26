import { locationApi, headers } from "@/environment";

export const getClients = (searchTerm = "", currentPage = 1) => {
  return locationApi.get("/clients", {
    headers,
    params: {
      search: searchTerm, // Paramètre pour la recherche
      page: currentPage, // Paramètre pour la pagination
    },
  });
};


export const addClient = (client) => {
  return locationApi.post("/clients", client, { headers });
};

export const editClient = (idClient, clientData) => {
  return locationApi.put(`/clients/${idClient}`, clientData);
};