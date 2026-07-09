import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "./apiClient";
import { QuestionDetailDto } from "./useExam";

// ==== Kết quả bài thi bộ đề gộp (admin) ====

export interface ExamSetGroupResultDto {
    id: string;
    groupId: string;
    groupName: string;
    profileId: string;
    fullname: string;
    phone: string | null;
    class: string | null;
    type: number;
    totalPoint: number;
    maxPoints: number;
    percentage: number;
    createdAt: string;
    updatedAt: string;
}

export interface ExamSetGroupResultDetailDto extends ExamSetGroupResultDto {
    message: string;
    questionDetails: QuestionDetailDto[];
}

export interface FindExamSetGroupResultsParams {
    groupId?: string;
    type?: number;
    class?: string;
    search?: string;
    page?: number;
    limit?: number;
}

export interface PaginatedExamSetGroupResults {
    data: ExamSetGroupResultDto[];
    total: number;
    page: number;
    limit: number;
}

export interface GetUsersResponse {
    id: string
    username: string
    fullname: string
    class: string
    yearOfBirth: string
    premiumExpiredAt: string
    phone?: string
    school?: string
    profileId: string
    accessibleExamTypes?: string[]
}

export interface RegisterData {
    username: string
    password: string
    fullname: string
    phone?: string
    school?: string
    yearOfBirth: number
    class: string
    accessibleExamTypes?: string[]
}

export interface UpdateUserData {
    username?: string
    password?: string
    fullname?: string
    phone?: string
    school?: string
    yearOfBirth?: number
    class?: string
    premiumExpiredAt?: Date
    accessibleExamTypes?: string[]
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
    },
    update: async (userId: string, data: UpdateUserData) => {
        const response = await apiClient.patch(`/admin/users/${userId}`, data)
        return response.data
    },
    exportExamSetGroupExcel: async (groupId: string, groupName?: string): Promise<void> => {
        const response = await apiClient.get(`/admin/exam-set-groups/${groupId}/export-excel`, {
            responseType: 'blob',
        });

        const disposition = response.headers['content-disposition'] as string | undefined;
        let filename = groupName
            ? `${groupName.replace(/[^\w\u00C0-\u024f\s-]/gi, '').trim().replace(/\s+/g, '-') || 'ket-qua'}.xlsx`
            : `ket-qua-${groupId}.xlsx`;

        if (disposition) {
            const utf8Match = disposition.match(/filename\*=UTF-8''([^;]+)/i);
            const asciiMatch = disposition.match(/filename="?([^";]+)"?/i);
            if (utf8Match?.[1]) {
                filename = decodeURIComponent(utf8Match[1]);
            } else if (asciiMatch?.[1]) {
                filename = asciiMatch[1];
            }
        }

        const blob = new Blob([response.data], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
    },
    getGroupResults: async (params: FindExamSetGroupResultsParams): Promise<PaginatedExamSetGroupResults> => {
        const response = await apiClient.get('/admin/exam-set-group-results', { params });
        return response.data;
    },
    getGroupResultDetail: async (resultId: string): Promise<ExamSetGroupResultDetailDto> => {
        const response = await apiClient.get(`/admin/exam-set-group-results/${resultId}`);
        return response.data;
    },
    updateGroupResult: async (
        resultId: string,
        data: { totalPoint?: number; maxPoints?: number },
    ): Promise<ExamSetGroupResultDto> => {
        const response = await apiClient.patch(`/admin/exam-set-group-results/${resultId}`, data);
        return response.data;
    },
    deleteGroupResult: async (resultId: string): Promise<void> => {
        await apiClient.delete(`/admin/exam-set-group-results/${resultId}`);
    },
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

export function useUpdate() {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: ({ userId, data }: { userId: string; data: UpdateUserData }) => api.update(userId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] })
        },
        onError: (error) => {
            console.error('Error updating user:', error)
        }
    })
}

export function useExportExamSetGroupExcel() {
    return useMutation({
        mutationFn: ({ groupId, groupName }: { groupId: string; groupName?: string }) =>
            api.exportExamSetGroupExcel(groupId, groupName),
        onError: (error) => {
            console.error('Error exporting exam set group:', error)
        },
    })
}

export function useGroupResults(params: FindExamSetGroupResultsParams) {
    return useQuery<PaginatedExamSetGroupResults, Error>({
        queryKey: [
            'groupResults',
            params.groupId ?? null,
            params.type ?? null,
            params.class ?? null,
            params.search ?? null,
            params.page ?? 1,
            params.limit ?? 20,
        ],
        queryFn: () => api.getGroupResults(params),
        retry: 1,
        staleTime: 30 * 1000,
    })
}

export function useGroupResultDetail(resultId: string | null) {
    return useQuery<ExamSetGroupResultDetailDto, Error>({
        queryKey: ['groupResultDetail', resultId],
        queryFn: () => api.getGroupResultDetail(resultId as string),
        enabled: !!resultId,
        retry: 1,
    })
}

export function useUpdateGroupResult() {
    const queryClient = useQueryClient()
    return useMutation<ExamSetGroupResultDto, Error, { resultId: string; totalPoint?: number; maxPoints?: number }>({
        mutationFn: ({ resultId, totalPoint, maxPoints }) =>
            api.updateGroupResult(resultId, { totalPoint, maxPoints }),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['groupResults'] })
            queryClient.invalidateQueries({ queryKey: ['groupResultDetail', variables.resultId] })
        },
        onError: (error) => {
            console.error('Error updating group result:', error)
        },
    })
}

export function useDeleteGroupResult() {
    const queryClient = useQueryClient()
    return useMutation<void, Error, string>({
        mutationFn: (resultId) => api.deleteGroupResult(resultId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['groupResults'] })
        },
        onError: (error) => {
            console.error('Error deleting group result:', error)
        },
    })
}