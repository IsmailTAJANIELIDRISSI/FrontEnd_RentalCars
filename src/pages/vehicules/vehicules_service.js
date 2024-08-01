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

export const updateVehicule = (matricule, vehiculeData) => {
  return locationApi.post(`/update-vehicule/${matricule}`, vehiculeData, {
    headers,
  });
};

export const deleteVehicule = (matricule) => {
  return locationApi.delete(`/vehicules/${matricule}`, {
    headers,
  });
};

export const addVehicule = (vehicule) => {
  return locationApi.post(`/vehicules`, vehicule, {
    headers,
  });
};
