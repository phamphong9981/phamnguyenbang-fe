import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "./apiClient";

export enum ExamSetType {
    HSA = 'HSA',
    TSA = 'TSA',
    CHAPTER = 'chapter',
}

export enum ExamSetStatus {
    AVAILABLE = 'available',
    EXPIRED = 'expired',
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
    SCIENCE = 9
}

export enum ExamSetGroupType {
    TO_HOP_1 = 1,
    TO_HOP_2 = 2,
}

export enum ExamSetGroupExamType {
    HSA = 'HSA',
    TSA = 'TSA',
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
    status: ExamSetStatus;
    description: string;
    userStatus?: {
        isCompleted: boolean,
        submittedAt: null,
        totalPoints: number,
        totalTime: number,
        giveAway: string | null,
        score: 0,
    }
    deadline?: Date;
    class?: string;
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

export enum QuestionType {
    SINGLE_CHOICE = 'single_choice',
    MULTIPLE_CHOICE = 'multiple_choice',
    TRUE_FALSE = 'true_false',
    SHORT_ANSWER = 'short_answer',
    GROUP_QUESTION = 'group_question',
}

export interface Question {
    id: string;
    section?: string;
    content: string;
    images?: string[];
    question_type: QuestionType;
    options: Record<string, string>;
    correct_answer: string[];
    explanation: string;
    subQuestions: Question[];
}

export interface SubmitExamDto {
    examId: string;

    profileId: string;

    answers: {
        questionId: string;
        selectedAnswer: string[];
    }[];

    totalTime: number;
}

export interface SubmitGroupAnswerDto {
    groupId: string;
    exams: SubmitExamDto[];
}

export interface GroupSubmitResponse {
    id: string;
    totalPoint: number;
    maxPoints: number;
}

export interface QuestionDetailDto {
    questionId: string;
    content: string;
    questionType: string;
    images?: string[];
    options?: Record<string, string>;
    correctAnswer: string[];
    explanation?: string;
    userAnswer: string[];
    isCorrect: boolean;
    pointsEarned: number;
    subQuestions?: {
        id: string;
        subId: string;
        content: string;
        images?: string[];
        correctAnswer: string[];
        explanation?: string;
        userAnswer: string[];
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

export interface GroupExamResultDto {
    id: string;
    totalPoint: number;
    maxPoints: number;
    percentage: number;
    message: string;
    questionDetails: QuestionDetailDto[];
}

export interface AllExamSetGroupResponseDto {
    id: string;
    name: string;
    description?: string;
}

export interface ExamSetGroupResponseDto extends AllExamSetGroupResponseDto {
    examSets: ExamSetDetailResponse[];
    userResult?: {
        totalPoint: number;
        maxPoints: number;
    };
}

export interface CreateSubQuestionDto {
    id: string;
    content: string;
    images?: string[];
    correctAnswer: string[];
    explanation?: string;
    questionType?: QuestionType;
    options?: Record<string, string>;
    subQuestions?: CreateSubQuestionDto[]; // Support nested subquestions (group_question within group_question)
}

export interface CreateQuestionDto {
    id: string;
    section: string;
    content: string;
    images?: string[]; // Changed from image?: string to images?: string[]
    questionType: QuestionType;
    options?: Record<string, string>;
    correctAnswer?: string[];
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
    deadline?: Date;
    class?: string;
}

export interface UpdateExamSetDto {
    type?: ExamSetType;
    name?: string;
    year?: string;
    subject?: number;
    duration?: string;
    difficulty?: string;
    status?: ExamSetStatus;
    description?: string;
    grade?: number;
    deadline?: Date;
    class?: string;
}

export interface UpdateQuestionDto {
    content?: string;
    section?: string;
    images?: string[];
    questionType?: QuestionType;
    options?: Record<string, string>;
    correctAnswer?: string[];
    explanation?: string;
    subQuestions?: CreateSubQuestionDto[]; // Optional, nested structure supported
}

export interface UpdateQuestionWithImagesDto {
    content?: string;
    section?: string;
    images?: string[]; // Image file names (will be replaced with URLs after upload)
    questionType?: QuestionType;
    options?: Record<string, string>;
    correctAnswer?: string[];
    explanation?: string;
    subQuestions?: CreateSubQuestionDto[]; // Optional, nested structure supported
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
    submitGroupAnswer: async (data: SubmitGroupAnswerDto): Promise<GroupSubmitResponse> => {
        const response = await apiClient.post('/exams/groups/submit', data);
        return response.data;
    },
    getExamResult: async (id: string): Promise<ExamResultDto> => {
        const response = await apiClient.get(`/exams/result/${id}`);
        return response.data;
    },
    getExamGroupResult: async (groupId: string): Promise<GroupExamResultDto> => {
        const response = await apiClient.get(`/exams/groups/${groupId}/result`);
        return response.data;
    },
    getAllExamSetGroups: async (examType: ExamSetGroupExamType, groupType?: ExamSetGroupType): Promise<AllExamSetGroupResponseDto[]> => {
        const url = groupType
            ? `/exams/groups?type=${examType}&groupType=${groupType}`
            : `/exams/groups?type=${examType}`;
        const response = await apiClient.get(url);
        return response.data;
    },
    getExamSetGroupById: async (id: string, examType: ExamSetGroupExamType, groupType?: ExamSetGroupType): Promise<ExamSetGroupResponseDto> => {
        const url = groupType
            ? `/exams/groups/${id}?type=${examType}&groupType=${groupType}`
            : `/exams/groups/${id}?type=${examType}`;
        const response = await apiClient.get(url);
        return response.data;
    },
    uploadExamSetWithImage: async (data: CreateExamSetDto, questionImages: { questionId: string; images: File[] }[]): Promise<ExamSetResponse> => {
        const formData = new FormData();
        formData.append('examSetData', JSON.stringify(data));

        // Append question images with the correct field name 'images' as expected by backend
        // Each question can have multiple images
        questionImages.forEach(({ questionId, images }) => {
            images.forEach((image) => {
                formData.append('images', image);
            });
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
    },
    createExamSet: async (data: CreateExamSetDto): Promise<ExamSetResponse> => {
        const response = await apiClient.post('/exams/sets', data);
        return response.data;
    },
    deleteExamSet: async (id: string): Promise<void> => {
        const response = await apiClient.delete(`/exams/sets/${id}`);
        return response.data;
    },
    updateExamSet: async (id: string, data: UpdateExamSetDto): Promise<ExamSetResponse> => {
        const response = await apiClient.patch(`/exams/sets/${id}`, data);
        return response.data;
    },
    updateQuestion: async (id: string, data: UpdateQuestionDto): Promise<Question> => {
        const response = await apiClient.patch(`/exams/questions/${id}`, data);
        return response.data;
    },
    updateQuestionWithImages: async (id: string, data: UpdateQuestionWithImagesDto, images: File[]): Promise<Question> => {
        const formData = new FormData();
        formData.append('questionData', JSON.stringify(data));

        // Append image files with the field name 'images' as expected by backend
        images.forEach((image) => {
            formData.append('images', image);
        });

        const response = await apiClient.patch(`/exams/questions/${id}/upload`, formData, {
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

// Hook để submit bài thi cho group
export const useSubmitGroupAnswer = () => {
    const queryClient = useQueryClient()
    return useMutation<GroupSubmitResponse, Error, SubmitGroupAnswerDto>({
        mutationFn: (data) => api.submitGroupAnswer(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['examSet'] })
            queryClient.invalidateQueries({ queryKey: ['examSets'] })
            queryClient.invalidateQueries({ queryKey: ['examSetGroup'] })
            queryClient.invalidateQueries({ queryKey: ['examSetGroups'] })
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

export const useExamGroupResult = (groupId: string) => {
    return useQuery<GroupExamResultDto, Error>({
        queryKey: ['examGroupResult', groupId],
        queryFn: () => api.getExamGroupResult(groupId),
        enabled: !!groupId,
        retry: 1,
        retryDelay: (attemptIndex) => Math.min(1000 * 1 ** attemptIndex, 30000),
    })
}

export const useExamSetGroups = (examType: ExamSetGroupExamType, groupType?: ExamSetGroupType) => {
    return useQuery<AllExamSetGroupResponseDto[], Error>({
        queryKey: ['examSetGroups', examType, groupType],
        queryFn: () => api.getAllExamSetGroups(examType, groupType),
        enabled: true,
        retry: 1,
        retryDelay: (attemptIndex) => Math.min(1000 * 1 ** attemptIndex, 30000),
    })
}

export const useExamSetGroup = (id: string, examType: ExamSetGroupExamType, groupType?: ExamSetGroupType) => {
    return useQuery<ExamSetGroupResponseDto, Error>({
        queryKey: ['examSetGroup', id, examType, groupType],
        queryFn: () => api.getExamSetGroupById(id, examType, groupType),
        enabled: !!id,
        retry: 1,
        retryDelay: (attemptIndex) => Math.min(1000 * 1 ** attemptIndex, 30000),
    })
}

export const useUploadExamSetWithImage = () => {
    const queryClient = useQueryClient()
    return useMutation<ExamSetResponse, Error, { data: CreateExamSetDto; questionImages: { questionId: string; images: File[] }[] }>({
        mutationFn: ({ data, questionImages }) => api.uploadExamSetWithImage(data, questionImages),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['examSets'] })
        }
    })
}

export const useCreateExamSet = () => {
    const queryClient = useQueryClient()
    return useMutation<ExamSetResponse, Error, CreateExamSetDto>({
        mutationFn: (data) => api.createExamSet(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['examSets'] })
        }
    })
}

export const useDeleteExamSet = () => {
    const queryClient = useQueryClient()
    return useMutation<void, Error, string>({
        mutationFn: (id) => api.deleteExamSet(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['examSets'] })
        }
    })
}

export const useUpdateExamSet = () => {
    const queryClient = useQueryClient()
    return useMutation<ExamSetResponse, Error, { id: string; data: UpdateExamSetDto }>({
        mutationFn: ({ id, data }) => api.updateExamSet(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['examSets'] })
            queryClient.invalidateQueries({ queryKey: ['examSet'] })
        }
    })
}

export const useUpdateQuestion = () => {
    const queryClient = useQueryClient()
    return useMutation<Question, Error, { id: string; data: UpdateQuestionDto }>({
        mutationFn: ({ id, data }) => api.updateQuestion(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['examSet'] })
            queryClient.invalidateQueries({ queryKey: ['examSets'] })
        }
    })
}

export const useUpdateQuestionWithImages = () => {
    const queryClient = useQueryClient()
    return useMutation<Question, Error, { id: string; data: UpdateQuestionWithImagesDto; images: File[] }>({
        mutationFn: ({ id, data, images }) => api.updateQuestionWithImages(id, data, images),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['examSet'] })
            queryClient.invalidateQueries({ queryKey: ['examSets'] })
        }
    })
}