import { locationApi, headers } from "@/environment";

export const getReclamation = (
    searchTerm,
    perPage = 10,
    currentPage = 1,
  ) => {
    return locationApi.get(
      "/reclamations/search",
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
export const addReclamation = (reclamation) => {
    return locationApi.post("/reclamations", reclamation, { headers });
  };