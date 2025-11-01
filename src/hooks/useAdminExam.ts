import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "./apiClient";
import { ExamSetType } from "./useExam";

export interface ExamHistoryAdminResponseDto {
    submissionId: string;
    examId: string;
    examName: string | null;
    examType: ExamSetType | null;
    subject: number | null;
    grade: number | null;
    totalPoints: number;
    totalTime: number;
    giveAway: string | null;
    takenAt: Date;
    examYear: string | null;
    examDuration: string | null;
    examDifficulty: string | null;
    userId: string | null;
    username: string | null;
    profileId: string | null;
    fullName: string | null;
    class: string | null;
}

const api = {
    getExamHistory: async (userId?: string, className?: string, examSetId?: string) => {
        const response = await apiClient.get('/admin/exam-history', { params: { userId, class: className, examSetId } });
        return response.data;
    }
}

const useGetExamHistory = (userId?: string, className?: string, examSetId?: string) => {
    return useQuery<ExamHistoryAdminResponseDto[], Error>({
        queryKey: ['examHistory', userId ?? null, className ?? null, examSetId ?? null],
        queryFn: () => api.getExamHistory(userId, className, examSetId),
        retry: 1,
        retryDelay: (attemptIndex) => Math.min(1000 * 1 ** attemptIndex, 30000),
    });
}

export { useGetExamHistory };