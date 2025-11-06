import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "./apiClient";
import { SubmitAIQuestionsDto, SubmitAIQuestionsResponseDto } from "./interface/submit-ai-question";

export interface KcNode {
    name_vi: string;
    desc_vi: string;
}

export interface UserKCProgress {
    progress_id: number;
    user_id: string;
    kc_tag: string;
    mastery_level: number;
    last_updated: Date;
    kcNode: KcNode;
}

export interface GeneratedQuestion {
    id: string;
    level: number;
    question: string;
    choices: Record<string, string>;
    kc_tag: string;
}

const api = {
    getUserKcProgress: async () => {
        const response = await apiClient.get('/kc/progress');
        return response.data;
    },
    generateAiPractice: async (kcTag: string) => {
        const response = await apiClient.post('/kc/generate-questions', { kc_tag: kcTag });
        return response.data.questions;
    },
    submitAiPractice: async (data: SubmitAIQuestionsDto) => {
        const response = await apiClient.post('/kc/submit-ai-questions', data);
        return response.data;
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

export const useSubmitAiPracticeMutation = () => {
    const queryClient = useQueryClient()
    return useMutation<SubmitAIQuestionsResponseDto, Error, SubmitAIQuestionsDto>({
        mutationFn: (data) => api.submitAiPractice(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['userKcProgress'] })
            queryClient.invalidateQueries({ queryKey: ['generateAiPractice'] })
        }
    })
}