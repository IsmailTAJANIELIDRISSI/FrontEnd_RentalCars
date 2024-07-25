import { locationApi } from "@/environment";

const token = localStorage.getItem("token");

const headers = {
  "Content-Type": "multipart/form-data",
  Authorization: `Bearer ${token}`,
};

export const getVehicules = () => {
  return locationApi.get("/vehicules", { headers });
};

export const getVehiculeByMatricule = (matricule) => {
  return locationApi.get(`/vehicules/${matricule}`, { headers });
};
