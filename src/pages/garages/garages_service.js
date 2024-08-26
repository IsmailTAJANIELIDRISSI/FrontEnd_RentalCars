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

// export const getGarages = (page = 1, perPage = 10) => {
//   return locationApi.get(`garages?page=${page}&per_page=${perPage}`, {
//     headers,
//   });
// };

export const getGaragesByCriteria = (
  searchTerm,
  perPage = 10,
  currentPage = 1,
) => {
  console.log(headers);

  return locationApi.get(
    "/garages/search",
    {
      params: {
        searchTerm,
        per_page: perPage,
        page: currentPage,
      },
      headers
    },
    
  );
};

export const addGarage = (garage) => {
  return locationApi.post("/garages", garage, { headers });
};

export const editGarage = (idGarage, garageData) => {
  return locationApi.put(`/garages/${idGarage}`, garageData, { headersNormal });
};
