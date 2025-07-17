import axios, { AxiosResponse } from 'axios'

// Create axios instance with default config
export const apiClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000',
    timeout: 30000, // 30 seconds for alpha simulation
    headers: {
        'Content-Type': 'application/json',
    },
})

// Add request interceptor for logging
apiClient.interceptors.request.use(
    (config) => {
        console.log(`🚀 ${config.method?.toUpperCase()} ${config.url}`)
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

// Add response interceptor for error handling
apiClient.interceptors.response.use(
    (response: AxiosResponse) => {
        return response
    },
    (error) => {
        console.error('❌ API Error:', error.response?.data || error.message)
        return Promise.reject(error)
    }
)