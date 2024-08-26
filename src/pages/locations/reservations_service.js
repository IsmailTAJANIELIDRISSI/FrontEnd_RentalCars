import { headers, headersNormal, locationApi } from "@/environment";

export const getReservationsByCriteria = (
  searchTerm = "",
  perPage = 10,
  currentPage = 1,
) => {
  return locationApi.get(
    "/reservations/search",
    {
      params: {
        searchTerm,
        per_page: perPage,
        page: currentPage,
      },
    },
    { headers },
  );
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
