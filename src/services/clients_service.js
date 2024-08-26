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

export const getClients = () => {
  return locationApi.get("/clients", { headers });
};

export const getClientById = (idClient) => {
  return locationApi.get(`/clients/${idClient}`, { headers });
};
