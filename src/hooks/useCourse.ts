import { useQuery } from "@tanstack/react-query";
import { apiClient } from "./apiClient";

export interface ChapterSummaryDto {
    id: string
    name: string
    description?: string
    sortOrder: number
    videosCount?: number
}

export interface GradeResponseDto {
    id: string
    name: string
    description?: string
    sortOrder: number
    chapters: ChapterSummaryDto[]
}

export interface SubjectDetailResponseDto {
    id: string
    name: string
    description?: string
    grades: GradeResponseDto[]
}

export interface VideoResponseDto {
    id: string
    title: string
    description?: string
    s3Video: string
    s3Thumbnail: string
    videoType: 'theory' | 'exercise'
    duration?: number
    sortOrder: number
    isFree: boolean
}

export interface ChapterResponseDto {
    id: string
    gradeId: string
    name: string
    description?: string
    sortOrder: number
    videos: VideoResponseDto[]
}

const api = {
    getSubjectsList: async () => {
        const response = await apiClient.get(`/subjects`);
        return response.data;
    },
    getChapterById: async (chapterId: string) => {
        const response = await apiClient.get(`/chapters/${chapterId}`);
        return response.data;
    }
}

export const useSubjectsList = () => {
    return useQuery<SubjectDetailResponseDto[], Error>({
        queryKey: ['subjectsList'],
        queryFn: api.getSubjectsList,
        enabled: true,
        retry: 1,
        retryDelay: (attemptIndex) => Math.min(1000 * 1 ** attemptIndex, 30000),
    })
}

export const useChapterById = (chapterId: string) => {
    return useQuery<ChapterResponseDto, Error>({
        queryKey: ['chapterById', chapterId],
        queryFn: () => api.getChapterById(chapterId),
        enabled: !!chapterId,
        retry: 1,
        retryDelay: (attemptIndex) => Math.min(1000 * 1 ** attemptIndex, 30000),
    })
}