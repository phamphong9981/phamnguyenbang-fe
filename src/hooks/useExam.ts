import { useQuery } from "@tanstack/react-query";
import { apiClient } from "./apiClient";

export enum ExamSetType {
    HSA = 'HSA',
    TSA = 'TSA',
    CHAPTER = 'chapter',
}

export interface ExamSetResponse {
    id: string;
    type: ExamSetType;
    name: string;
    year: string;
    grade: number;
    subject: number;
    duration: string;
    difficulty: string;
    // status: string;
    description: string;
}

export interface ExamSetDetailResponse {
    id: string;
    type: ExamSetType;
    name: string;
    year: string;
    grade: number;
    subject: number;
    duration: string;
    difficulty: string;
    // status: string;
    description: string;
    examQuestions: ExamQuestion[];
}

export interface ExamQuestion {
    id: string;
    exam_set_id: string;
    question_id: string;
    question_order: number; // Thứ tự câu hỏi trong đề
    points: number; // Điểm của câu hỏi
    question: Question
}

export enum QuestionSection {
    MATH = 'Toán học',
    LOGIC = 'Suy luận logic',
    READING = 'Đọc hiểu',
}

export enum QuestionType {
    MULTIPLE_CHOICE = 'multiple_choice',
    TRUE_FALSE = 'true_false',
    SHORT_ANSWER = 'short_answer',
    GROUP_QUESTION = 'group_question',
}

export interface Question {
    id: string;
    section: QuestionSection;
    content: string;
    image: string;
    question_type: QuestionType;
    options: Record<string, string>;
    correct_answer: string;
    explanation: string;
    subQuestions: SubQuestion[];
}

export interface SubQuestion {
    id: string;
    question_id: string;
    sub_id: string; // a, b, c, d
    content: string;
    correct_answer: string;
    explanation: string;
}

const api = {
    getExamSets: async (type: ExamSetType): Promise<ExamSetResponse[]> => {
        const response = await apiClient.get(`/exams/sets?type=${type}`);
        return response.data;
    },
    getExamSet: async (id: string): Promise<ExamSetDetailResponse> => {
        const response = await apiClient.get(`/exams/sets/${id}`);
        return response.data;
    },
}

export const useExamSets = (type: ExamSetType) => {
    return useQuery<ExamSetResponse[], Error>({
        queryKey: ['examSets', type],
        queryFn: () => api.getExamSets(type),
        enabled: true,
        retry: 1,
        retryDelay: (attemptIndex) => Math.min(1000 * 1 ** attemptIndex, 30000),
    });
}

export const useExamSet = (id: string) => {
    return useQuery<ExamSetDetailResponse, Error>({
        queryKey: ['examSet', id],
        queryFn: () => api.getExamSet(id),
        enabled: !!id,
        retry: 1,
        retryDelay: (attemptIndex) => Math.min(1000 * 1 ** attemptIndex, 30000),
    });
}