import { useQuery, useMutation } from "@tanstack/react-query";
import { apiClient } from "./apiClient";

export interface UserKCProgress {
    progress_id: number;
    user_id: string;
    kc_tag: string;
    mastery_level: number;
    last_updated: Date;
}

export interface GeneratedQuestion {
    level: number;
    question: string;
    choices: Record<string, string>;
    answer: string;
    explanation: string;
}

const api = {
    getUserKcProgress: async () => {
        const response = await apiClient.get('/kc/progress');
        return response.data;
    },
    generateAiPractice: async (kcTag: string) => {
        const response = await apiClient.post('/kc/generate-questions', { kc_tag: kcTag });
        return response.data.questions;
    }
}

export const useUserKcProgress = () => {
    return useQuery<UserKCProgress[], Error>({
        queryKey: ['userKcProgress'],
        queryFn: () => api.getUserKcProgress(),
    })
}

export const useGenerateAiPractice = (kcTag: string) => {
    return useQuery<GeneratedQuestion[], Error>({
        queryKey: ['generateAiPractice', kcTag],
        queryFn: () => api.generateAiPractice(kcTag),
        enabled: !!kcTag, // Only fetch if kcTag is provided
    })
}

export const useGenerateAiPracticeMutation = () => {
    return useMutation<GeneratedQuestion[], Error, string>({
        mutationFn: (kcTag: string) => api.generateAiPractice(kcTag),
    })
}