import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "./apiClient";

export enum ExamSetType {
    HSA = 'HSA',
    TSA = 'TSA',
    CHAPTER = 'chapter',
}

export enum SUBJECT_ID {
    MATH = 1,
    GEOGRAPHY = 2,
    LITERATURE = 3,
    HISTORY = 4,
    ENGLISH = 5,
    PHYSICS = 6,
    CHEMISTRY = 7,
    BIOLOGY = 8,
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
    userStatus?: {
        isCompleted: boolean,
        submittedAt: null,
        totalPoints: number,
        totalTime: number,
        giveAway: string | null,
        score: 0,
    }
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
    question_type?: QuestionType; // Optional, defaults to 'true_false' if null
    options?: Record<string, string>; // Optional, only for multiple_choice
}

export interface SubmitExamDto {
    examId: string;

    profileId: string;

    answers: {
        questionId: string;
        selectedAnswer: string;
    }[];

    totalTime: number;
}

export interface QuestionDetailDto {
    questionId: string;
    content: string;
    questionType: string;
    image?: string;
    options?: Record<string, string>;
    correctAnswer: string;
    explanation?: string;
    userAnswer: string;
    isCorrect: boolean;
    pointsEarned: number;
    subQuestions?: {
        id: string;
        subId: string;
        content: string;
        correctAnswer: string;
        explanation?: string;
        userAnswer: string;
        isCorrect: boolean;
        pointsEarned: number;
    }[]
}

export interface ExamResultDto {
    totalPoints: number;

    maxPoints: number;

    percentage: number;

    totalTime: number;

    giveAway?: string;

    message: string;

    questionDetails: QuestionDetailDto[];
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
    generatedAt: Date;
}

export interface CreateSubQuestionDto {
    id: string;
    content: string;
    correctAnswer: string;
    explanation?: string;
}

export interface CreateQuestionDto {
    id: string;
    section: string;
    content: string;
    image?: string;
    questionType: QuestionType;
    options?: Record<string, string>;
    correctAnswer?: string;
    explanation?: string;

    subQuestions?: CreateSubQuestionDto[];
}

export interface CreateExamSetDto {
    type: ExamSetType;
    name: string;
    year: string;
    subject: number;
    duration: string;
    difficulty: string;
    status: string;
    description: string;
    grade: number;
    questions: CreateQuestionDto[];
}

export interface CreateQuestionDto {
    id: string;
    section: string;
    content: string;
    imageFileName?: string;
    questionType: QuestionType;
    options?: Record<string, string>;
    correctAnswer?: string;
    explanation?: string;
    subQuestions?: CreateSubQuestionDto[];
}

export interface CreateSubQuestionDto {
    id: string;
    content: string;
    correctAnswer: string;
    explanation?: string;
}

const api = {
    getExamSets: async (type: ExamSetType, grade?: number, userId?: string): Promise<ExamSetResponse[]> => {
        const response = await apiClient.get(`/exams/sets?type=${type}&sortBy=created_at${grade ? `&grade=${grade}` : ''}${userId ? `&userId=${userId}` : ''}`);
        return response.data;
    },
    getExamSet: async (id: string): Promise<ExamSetDetailResponse> => {
        const response = await apiClient.get(`/exams/sets/${id}`);
        return response.data;
    },
    submitExam: async (data: SubmitExamDto): Promise<ExamResultDto> => {
        const response = await apiClient.post('/exams/submit', data);
        return response.data;
    },
    getExamResult: async (id: string): Promise<ExamResultDto> => {
        const response = await apiClient.get(`/exams/result/${id}`);
        return response.data;
    },
    getLeaderboard: async (className: string): Promise<LeaderboardResponseDto> => {
        const response = await apiClient.get(`/exams/leaderboard?class=${className}`);
        return response.data;
    },
    createExamSet: async (data: CreateExamSetDto, questionImages: { questionId: string; image: File }[]): Promise<ExamSetResponse> => {
        const formData = new FormData();
        formData.append('examSetData', JSON.stringify(data));

        // Append question images with the correct field name 'images' as expected by backend
        questionImages.forEach(({ image }) => {
            formData.append('images', image);
        });

        console.log('FormData contents:');
        for (let [key, value] of formData.entries()) {
            console.log(`${key}:`, value);
        }

        const response = await apiClient.post('/exams/sets/upload', formData, {
            headers: {
                'Content-Type': undefined, // Let browser set Content-Type with boundary for FormData
            },
        });
        return response.data;
    }
}

export const useExamSets = (type: ExamSetType, grade?: number, userId?: string) => {
    return useQuery<ExamSetResponse[], Error>({
        queryKey: ['examSets', type, grade, userId],
        queryFn: () => api.getExamSets(type, grade, userId),
        enabled: true, // Always enable query - userId is optional
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

// Hook để submit bài thi
export const useSubmitExam = () => {
    const queryClient = useQueryClient()
    return useMutation<ExamResultDto, Error, SubmitExamDto>({
        mutationFn: (data) => api.submitExam(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['examSet'] })
            queryClient.invalidateQueries({ queryKey: ['examSets'] })
        }
    })
};

export const useExamResult = (id: string) => {
    return useQuery<ExamResultDto, Error>({
        queryKey: ['examResult', id],
        queryFn: () => api.getExamResult(id),
        enabled: !!id,
        retry: 1,
        retryDelay: (attemptIndex) => Math.min(1000 * 1 ** attemptIndex, 30000),
    })
}

export const useLeaderboard = (className: string) => {
    return useQuery<LeaderboardResponseDto, Error>({
        queryKey: ['leaderboard', className],
        queryFn: () => api.getLeaderboard(className),
        enabled: !!className,
        retry: 1,
        retryDelay: (attemptIndex) => Math.min(1000 * 1 ** attemptIndex, 30000),
    })
}

export const useCreateExamSet = () => {
    const queryClient = useQueryClient()
    return useMutation<ExamSetResponse, Error, { data: CreateExamSetDto; questionImages: { questionId: string; image: File }[] }>({
        mutationFn: ({ data, questionImages }) => api.createExamSet(data, questionImages),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['examSets'] })
        }
    })
}