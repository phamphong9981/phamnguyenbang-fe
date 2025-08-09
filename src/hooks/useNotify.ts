import { apiClient } from "./apiClient";

interface Notify {
    name: string;
    phone: string;
    date: string;
    school: string;
}

const api = {
    sendNotify: async (data: Notify) => {
        const response = await apiClient.post(`/register-trial`, data);
        return response.data;
    }
}

export default api;