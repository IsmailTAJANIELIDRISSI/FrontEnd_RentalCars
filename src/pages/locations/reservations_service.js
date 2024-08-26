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

export const getReservationsByCriteria = (
  searchTerm = "",
  perPage = 10,
  currentPage = 1,
) => {
  return locationApi.get("/reservations/search", {
    params: {
      searchTerm,
      per_page: perPage,
      page: currentPage,
    },
    headers,
  });
};

export const addReservation = (reservation) => {
  return locationApi.post("/reservations", reservation, { headers });
};
export const getReservationByNumero = (numero) => {
  return locationApi.get(`/reservations/${numero}`, { headers });
};
export const updateReservation = (reservation, numReservation) => {
  return locationApi.put(`/reservations/${numReservation}`, reservation, {
    headers: headersNormal,
  });
};
