import { useMutation } from '@tanstack/react-query'
import { apiClient } from './apiClient'

export interface RegisterData {
    username: string
    password: string
    fullname: string
    phone: string
    school: string
    birthday: Date
}

export interface LoginData {
    username: string
    password: string
}

export interface LoginResponse {
    token: string
    isPremium: boolean
    username: string
}

export const api = {
    register: async (data: RegisterData) => {
        const response = await apiClient.post('/register', data)
        return response.data
    },

    login: async (data: LoginData): Promise<LoginResponse> => {
        const response = await apiClient.post('/login', data)
        return response.data?.data
    }
}

// Custom hooks
export function useRegister() {
    return useMutation({
        mutationFn: (data: RegisterData) => api.register(data),
    })
}

export function useLogin() {
    return useMutation({
        mutationFn: (data: LoginData) => api.login(data),
        onSuccess: (data) => {
            localStorage.setItem('token', data.token)
            localStorage.setItem('isPremium', data.isPremium.toString())
            localStorage.setItem('username', data.username)
        },
        onError: (error) => {
            console.error(error)
        },
    })
}