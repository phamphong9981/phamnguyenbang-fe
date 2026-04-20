import { useMutation, useQuery } from '@tanstack/react-query'
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

export interface UserProfileResponse {
    id: string
    username: string
    profile: {
        id: string
        fullname: string
        phone: string
        school: string
        yearOfBirth?: number
        class: string
    } | null
}

export interface UpdateProfileData {
    fullname?: string
    phone?: string
    school?: string
    class?: string
    yearOfBirth?: number
    currentPassword?: string
    newPassword?: string
}

export const api = {
    login: async (data: LoginData): Promise<LoginResponse> => {
        const response = await apiClient.post('/login', data)
        return response.data?.data
    },
    getProfile: async (): Promise<UserProfileResponse> => {
        const response = await apiClient.get('/profile')
        return response.data?.data
    },
    updateProfile: async (data: UpdateProfileData): Promise<void> => {
        await apiClient.patch('/profile', data)
    },
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

export function useProfile(enabled = true) {
    return useQuery({
        queryKey: ['userProfile'],
        queryFn: api.getProfile,
        enabled,
        staleTime: 1000 * 60 * 2,
    })
}

export function useUpdateProfile() {
    return useMutation({
        mutationFn: (data: UpdateProfileData) => api.updateProfile(data),
    })
}
