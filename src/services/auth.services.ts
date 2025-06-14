import api from "@/config/axiosConfig"

export interface LoginFormData {
    email:string,
    password: string,
}

export type UserRole = "admin" | "leadManager" | "teamManager" | "intern"

export const loginUser = async (role: UserRole, formData: LoginFormData) => {
    const response = await api.post(`api/v1/${role}/login`, formData)
    return response.data
}