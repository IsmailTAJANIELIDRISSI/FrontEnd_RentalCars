import { locationApi } from "@/environment"

const headers = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
}; 

export const getAllGarages = () => {
    return locationApi.get('/garages')
}