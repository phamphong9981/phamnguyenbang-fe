import { useQuery } from "@tanstack/react-query";
import { apiClient } from "./apiClient";

export enum LeaderboardType {
    GRADE_12 = 12,
    GRADE_11 = 11,
    GRADE_10 = 10,
}

export interface LeaderboardEntryDto {
    rank: number;
    profileId: string;
    fullname: string;
    class: string;
    totalPoints: number;
    totalExams: number;
    averageScore: number;
    lastExamDate?: Date | null; // null for students who haven't taken any exams
}

export interface LeaderboardResponseDto {
    class: string;
    totalStudents: number;
    entries: LeaderboardEntryDto[];
}

const api = {
    getLeaderboard: async (grade: number): Promise<LeaderboardResponseDto> => {
        const response = await apiClient.get(`/exams/leaderboard?grade=${grade}`);
        return response.data;
    },
};

export const useLeaderboard = (grade: number) => {
    return useQuery<LeaderboardResponseDto, Error>({
        queryKey: ['leaderboard', grade],
        queryFn: () => api.getLeaderboard(grade),
        enabled: !!grade && !isNaN(grade),
        retry: 1,
        retryDelay: (attemptIndex) => Math.min(1000 * 1 ** attemptIndex, 30000),
    })
}
