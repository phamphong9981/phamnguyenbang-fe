import { useQuery } from "@tanstack/react-query";
import { apiClient } from "./apiClient";

export enum LeaderboardType {
    GRADE_12 = 12,
    GRADE_11 = 11,
    GRADE_10 = 10,
    HSA = 'hsa',
    TSA = 'tsa',
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
    getLeaderboard: async (type: LeaderboardType): Promise<LeaderboardResponseDto> => {
        const url = `/exams/leaderboard?type=${type}`;
        const response = await apiClient.get(url);
        return response.data;
    },
};

export const useLeaderboard = (type: LeaderboardType) => {
    return useQuery<LeaderboardResponseDto, Error>({
        queryKey: ['leaderboard', type],
        queryFn: () => api.getLeaderboard(type),
        enabled: !!type,
        retry: 1,
        retryDelay: (attemptIndex) => Math.min(1000 * 1 ** attemptIndex, 30000),
    })
}
