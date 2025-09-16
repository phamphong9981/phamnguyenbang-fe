import { useMutation } from '@tanstack/react-query'
import { apiClient } from './apiClient'

export interface LoginData {
    username: string
    password: string
}

export interface LoginResponse {
    token: string
    isPremium: boolean
    username: string
    userId: string
    classname: string
    yearOfBirth: string
}

export const api = {
    login: async (data: LoginData): Promise<LoginResponse> => {
        const response = await apiClient.post('/login', data)
        return response.data?.data
    }
}

export function useLogin() {
    return useMutation({
        mutationFn: (data: LoginData) => api.login(data),
        onSuccess: (data) => {
            localStorage.setItem('token', data.token)
            localStorage.setItem('isPremium', data.isPremium.toString())
            localStorage.setItem('username', data.username)
            localStorage.setItem('userId', data.userId)
            localStorage.setItem('classname', data.classname)
            localStorage.setItem('yearOfBirth', data.yearOfBirth)
        },
        onError: (error) => {
            console.error(error)
        },
    })
}