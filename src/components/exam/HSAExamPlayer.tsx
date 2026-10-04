'use client';

import QuestionCard from './QuestionCard';
import GroupQuestionSplitView from './GroupQuestionSplitView';
import { Question } from '@/hooks/useExam';

export interface HSAExamQuestionItem {
    questionId: string;
    questionNumber: number;
    question: Question;
    subjectName?: string;
    subjectDotClassName?: string;
}

export interface HSAExamUserAnswer {
    questionId: string;
    selectedAnswer: string[];
    subAnswers?: { [key: string]: string[] };
    isMarked?: boolean;
}

interface HSAExamPlayerProps {
    items: HSAExamQuestionItem[];
    userAnswers: HSAExamUserAnswer[];
    onAnswerSelect: (questionId: string) => (answer: string | string[], questionType: string, isMultiple: boolean) => void;
    onSubAnswerSelect: (questionId: string) => (subQuestionId: string, answer: string | string[], questionType: string, isMultiple: boolean) => void;
    onMarkQuestion: (questionId: string) => void;
    isImageAnswer: (answer: string) => boolean;
}

export default function HSAExamPlayer({
    items,
    userAnswers,
    onAnswerSelect,
    onSubAnswerSelect,
    onMarkQuestion,
    isImageAnswer,
}: HSAExamPlayerProps) {
    return (
        <div
            id="hsa-exam-scroll-container"
            className="min-h-0 flex-1 overflow-y-auto bg-gray-50 py-4"
        >
            <div className="w-full space-y-6">
                {items.map((item, index) => {
                    const userAnswer = userAnswers.find((ans) => ans.questionId === item.questionId);

                    return (
                        <div
                            key={item.questionId}
                            id={`question-${index}`}
                            className="scroll-mt-2 space-y-2"
                        >
                            {item.subjectName && (
                                <div className="mb-1 flex items-center gap-2">
                                    {item.subjectDotClassName && (
                                        <div className={`h-2 w-2 rounded-full ${item.subjectDotClassName}`} />
                                    )}
                                    <span className="text-sm font-medium text-gray-600">{item.subjectName}</span>
                                </div>
                            )}
                            {item.question.question_type === 'group_question' ? (
                                <GroupQuestionSplitView
                                    question={item.question}
                                    questionNumber={item.questionNumber}
                                    questionId={item.questionId}
                                    subAnswers={userAnswer?.subAnswers}
                                    onSubAnswerSelect={onSubAnswerSelect(item.questionId)}
                                    isImageAnswer={isImageAnswer}
                                    isMarked={userAnswer?.isMarked || false}
                                    onMarkQuestion={() => onMarkQuestion(item.questionId)}
                                />
                            ) : (
                                <QuestionCard
                                    question={item.question}
                                    questionNumber={item.questionNumber}
                                    questionId={item.questionId}
                                    selectedAnswer={userAnswer?.selectedAnswer || []}
                                    subAnswers={userAnswer?.subAnswers}
                                    onAnswerSelect={onAnswerSelect(item.questionId)}
                                    onSubAnswerSelect={onSubAnswerSelect(item.questionId)}
                                    isImageAnswer={isImageAnswer}
                                    isMarked={userAnswer?.isMarked || false}
                                    onMarkQuestion={() => onMarkQuestion(item.questionId)}
                                />
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
