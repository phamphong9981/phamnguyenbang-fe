'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExamQuestion } from '@/hooks/useExam';
import QuestionCard from './QuestionCard';
import GroupQuestionSplitView from './GroupQuestionSplitView';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface UserAnswer {
    questionId: string;
    selectedAnswer: string[];
    subAnswers?: { [key: string]: string[] };
}

interface TSAExamPlayerProps {
    questions: ExamQuestion[];
    currentIndex: number;
    userAnswers: UserAnswer[];
    onAnswerSelect: (questionId: string) => (answer: string | string[], questionType: string, isMultiple: boolean) => void;
    onSubAnswerSelect: (questionId: string) => (subQuestionId: string, answer: string | string[], questionType: string, isMultiple: boolean) => void;
    onNext: () => void;
    onPrev: () => void;
    isImageAnswer: (answer: string) => boolean;
}

export default function TSAExamPlayer({
    questions,
    currentIndex,
    userAnswers,
    onAnswerSelect,
    onSubAnswerSelect,
    onNext,
    onPrev,
    isImageAnswer
}: TSAExamPlayerProps) {
    const currentQuestion = questions[currentIndex];
    const questionId = currentQuestion?.question_id;

    if (!currentQuestion) return null;

    const userAnswer = userAnswers.find(a => a.questionId === questionId);

    // Determines if we should use the split view (specifically for group questions)
    // You can adjust this condition if you want ALL questions to look a certain way,
    // but GroupQuestionSplitView is designed for group questions.
    const isGroupQuestion = currentQuestion.question.question_type === 'group_question';

    return (
        <div className="w-full">
            <AnimatePresence mode='wait'>
                <motion.div
                    key={currentIndex}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className="w-full"
                >
                    {isGroupQuestion ? (
                        <GroupQuestionSplitView
                            question={currentQuestion.question}
                            questionNumber={currentIndex + 1}
                            questionId={questionId}
                            subAnswers={userAnswer?.subAnswers}
                            onSubAnswerSelect={onSubAnswerSelect(questionId)}
                            isImageAnswer={isImageAnswer}
                        />
                    ) : (
                        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 md:p-8">
                            <QuestionCard
                                question={currentQuestion.question}
                                questionNumber={currentIndex + 1}
                                questionId={questionId}
                                selectedAnswer={userAnswer?.selectedAnswer || []}
                                subAnswers={userAnswer?.subAnswers}
                                onAnswerSelect={onAnswerSelect(questionId)}
                                onSubAnswerSelect={onSubAnswerSelect(questionId)}
                                isImageAnswer={isImageAnswer}
                            />
                        </div>
                    )}
                </motion.div>
            </AnimatePresence>

            {/* Navigation Controls */}
            <div className="flex items-center justify-between mt-6 bg-white p-4 rounded-xl shadow-sm border border-gray-200">
                <button
                    onClick={onPrev}
                    disabled={currentIndex === 0}
                    className="flex items-center px-6 py-2.5 rounded-lg font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    <ChevronLeft className="w-5 h-5 mr-1" />
                    Câu trước
                </button>

                <span className="font-semibold text-gray-700">
                    Câu {currentIndex + 1} / {questions.length}
                </span>

                <button
                    onClick={onNext}
                    disabled={currentIndex === questions.length - 1}
                    className="flex items-center px-6 py-2.5 rounded-lg font-medium bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    Câu tiếp
                    <ChevronRight className="w-5 h-5 ml-1" />
                </button>
            </div>
        </div>
    );
}
