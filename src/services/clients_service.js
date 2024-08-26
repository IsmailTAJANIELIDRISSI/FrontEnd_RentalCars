import { locationApi, headers } from "@/environment";

export const getClients = () => {
  return locationApi.get("/clients", { headers });
};

export const getClientById = (idClient) => {
  return locationApi.get(`/clients/${idClient}`, { headers });
};
