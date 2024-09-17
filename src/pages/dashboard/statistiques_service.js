import { locationApi } from "@/environment";

const token = JSON.parse(localStorage.getItem("token"));
export const headers = {
  "Content-Type": "multipart/form-data",
  Authorization: `Bearer ${token}`,
};


export const getTopVehicules = () => {
    return locationApi.get("statistics/classement-vehicule", {headers});
}