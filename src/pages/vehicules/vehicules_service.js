import { locationApi } from "@/environment";
import { format } from "date-fns";

const token = JSON.parse(localStorage.getItem("token"));
export const headers = {
  "Content-Type": "multipart/form-data",
  Authorization: `Bearer ${token}`,
};

export const headersNormal = {
  "Content-Type": "application/json",
  Authorization: `Bearer ${token}`,
};

export const getVehicules = (searchTerm = "", page, filters) => {
  return locationApi.get(`/vehicules?page=${page}`, {
    params: { filters, searchTerm },
    headers,
  });
};

export const getMarques = () => {
  return locationApi.get("/vehicules-marques", { headers });
};

export const getVehiculeByMatricule = (matricule) => {
  return locationApi.get(`/vehicules/${matricule}`, { headers });
};

export const getVehiculesByCriteria = async (
  searchTerm = "",
  dateDebut,
  dateFin,
  numReservation = null,
) => {
  if (dateDebut || dateFin) {
    var formattedDate = format(dateDebut, "yyyy-MM-dd");
    var formattedDateFin = format(dateFin, "yyyy-MM-dd");
  }

  return locationApi.get(`/vehicules/search/${searchTerm}`, {
    params: {
      dateDebut: formattedDate,
      dateFin: formattedDateFin,
      numReservation,
    },
    headers,
  });
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
