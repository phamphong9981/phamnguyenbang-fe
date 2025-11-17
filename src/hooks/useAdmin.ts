import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "./apiClient";

export interface GetUsersResponse {
    id: string
    username: string
    fullname: string
    class: string
    yearOfBirth: string
    premiumExpiredAt: string
}

export interface RegisterData {
    username: string
    password: string
    fullname: string
    phone?: string
    school?: string
    yearOfBirth: number
}

const api = {
    getUsers: async (searchKey?: string, yearOfBirth?: number, className?: string) => {
        const response = await apiClient.get('/admin/users', { params: { searchKey, yearOfBirth, className } });
        return response.data;
    },
    register: async (data: RegisterData) => {
        const response = await apiClient.post('/admin/users', data)
        return response.data
    },
    delete: async (userId: string) => {
        const response = await apiClient.delete(`/admin/users`, { data: { userId } })
        return response.data
    }
}

export const useGetUsers = (searchKey?: string, yearOfBirth?: number, className?: string) => {
    return useQuery<GetUsersResponse[], Error>({
        queryKey: ['users', searchKey, yearOfBirth ?? null, className ?? null],
        queryFn: () => api.getUsers(searchKey, yearOfBirth, className),
        retry: 1,
        retryDelay: (attemptIndex) => Math.min(1000 * 1 ** attemptIndex, 30000),
        staleTime: 60 * 1000, // 1 minute
        gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
    });
}

// Custom hooks
export function useRegister() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (data: RegisterData) => api.register(data),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['users'] })
        },
        onError: (error) => {
            console.error('Error registering user:', error)
        }
    })
}

export function useDelete() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (userId: string) => api.delete(userId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] })
        },
        onError: (error) => {
            console.error('Error deleting user:', error)
        }
    })
}