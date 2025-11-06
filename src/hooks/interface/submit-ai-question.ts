export interface AIQuestionAnswerDto {
    generatedQuestionId: string;
    userAnswer: string[];
}

export interface SubmitAIQuestionsDto {
    answers: AIQuestionAnswerDto[];
}
export interface AIQuestionResultDto {
    questionId: string;
    userAnswer: string[];
    isCorrect: boolean;
    explanation?: string;
    level: number;
}
export interface SubmitAIQuestionsResponseDto {
    totalQuestions: number;
    correctAnswers: number;
    percentage: number;
    results: AIQuestionResultDto[];
}