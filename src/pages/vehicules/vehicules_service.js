import { locationApi, headers } from "@/environment";
import { format } from "date-fns";

export const getVehicules = () => {
  return locationApi.get("/vehicules", { headers });
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
  const formattedDate = format(dateDebut, "yyyy-MM-dd");
  const formattedDateFin = format(dateFin, "yyyy-MM-dd");
  // console.log(formattedDate);
  // console.log(formattedDateFin);

  return locationApi.get(`/vehicules/search/${searchTerm}`, {
    params: {
      dateDebut: formattedDate,
      dateFin: formattedDateFin,
      numReservation,
    },
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
