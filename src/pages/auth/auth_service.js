import { locationApi } from "@/environment"


export const login = (email, password) => {
    return locationApi.post('/login', {email, password})
}

export const register = (name, email, password) => {
    return locationApi.post('/register', {name, email, password})
}