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
    yearOfBirth?: number | null;
}

const api = {
    getExamHistory: async (
        userId?: string,
        className?: string,
        examSetId?: string,
        yearOfBirth?: number,
        examType?: ExamSetType,
    ) => {
        const response = await apiClient.get('/admin/exam-history', {
            params: {
                userId,
                class: className,
                examSetId,
                yearOfBirth,
                examType,
            }
        });
        return response.data;
    },
    deleteQuestionFromExamSet: async (examSetId: string, questionId: string) => {
        const response = await apiClient.delete(`/exams/sets/${examSetId}/questions/${questionId}`);
        return response.data;
    }
}

const useGetExamHistory = (
    userId?: string,
    className?: string,
    examSetId?: string,
    yearOfBirth?: number,
    examType?: ExamSetType,
) => {
    return useQuery<ExamHistoryAdminResponseDto[], Error>({
        queryKey: ['examHistory', userId ?? null, className ?? null, examSetId ?? null, yearOfBirth ?? null, examType ?? null],
        queryFn: () => api.getExamHistory(userId, className, examSetId, yearOfBirth, examType),
        retry: 1,
        retryDelay: (attemptIndex) => Math.min(1000 * 1 ** attemptIndex, 30000),
    });
}

const useDeleteQuestionFromExamSet = () => {
    const queryClient = useQueryClient();
    return useMutation<void, Error, { examSetId: string; questionId: string }>({
        mutationFn: ({ examSetId, questionId }) => api.deleteQuestionFromExamSet(examSetId, questionId),
        onSuccess: (_, variables) => {
            // Invalidate exam set queries to refresh the data
            queryClient.invalidateQueries({ queryKey: ['examSet', variables.examSetId] });
            queryClient.invalidateQueries({ queryKey: ['examSet'] });
            queryClient.invalidateQueries({ queryKey: ['examSets'] });
        },
        onError: (error) => {
            console.error('Error deleting question from exam set:', error);
        }
    });
}

export { useGetExamHistory, useDeleteQuestionFromExamSet };