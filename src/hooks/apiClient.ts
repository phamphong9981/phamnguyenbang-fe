import axios, { AxiosResponse } from 'axios'

const AUTH_STORAGE_KEYS = ['token', 'username', 'isPremium', 'userId', 'classname', 'yearOfBirth']

const clearAuthStorage = () => {
    if (typeof window === 'undefined') return
    AUTH_STORAGE_KEYS.forEach((key) => {
        try {
            localStorage.removeItem(key)
        } catch (error) {
            console.warn(`⚠️ Unable to remove key ${key} from localStorage`, error)
        }
    })
}

const handleUnauthorized = () => {
    if (typeof window === 'undefined') return
    clearAuthStorage()
    window.dispatchEvent(
        new CustomEvent('auth-session-expired', {
            detail: { reason: 'unauthorized' },
        }),
    )
}

// Create axios instance with default config
export const apiClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
    timeout: 0, // 30 seconds for alpha simulation,
    onUploadProgress: e => { console.log(e.progress) }, // hiển thị % đã upload
    headers: {
        'Content-Type': 'application/json',
    },
})

// Add request interceptor for logging and auth
apiClient.interceptors.request.use(
    (config) => {
        console.log(`🚀 ${config.method?.toUpperCase()} ${config.url}`)

        // Add auth token if available
        if (typeof window !== 'undefined') {
            const token = localStorage.getItem('token')
            if (token) {
                config.headers.Authorization = `Bearer ${token}`
            }
        }

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
        if (error.response?.status === 401) {
            handleUnauthorized()
        }
        console.error('❌ API Error:', error.response?.data || error.message)
        return Promise.reject(error)
    }
)