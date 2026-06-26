'use client';

import { ReactNode } from 'react';
import { ExamQuestion } from '@/hooks/useExam';
import ExamHeader from './ExamHeader';
import ExamAlertModal from './ExamAlertModal';
import QuestionNavigator from './QuestionNavigator';
import TSAExamPlayer from './TSAExamPlayer';
import tsaLogo from '@/app/thi-hsa-tsa/lam-bai-group-tsa/PZB_Edu_TSA_red_transparent.png';

export const TSA_EXAM_HEADER_CLASS = 'w-full shrink-0 px-0 py-3';
export const TSA_EXAM_PAGE_CLASS = 'flex min-h-0 w-full flex-1 flex-col overflow-hidden';
export const TSA_EXAM_VIEWPORT_CLASS = 'flex h-dvh flex-col overflow-hidden bg-white';
/** Sidebar width: +20% vs original 7.5rem / 8rem (w-32) */
export const TSA_QUESTION_LIST_WIDTH_CLASS = 'w-[9rem] lg:w-[11rem]';

export interface TSAExamUserAnswer {
    questionId: string;
    selectedAnswer: string[];
    subAnswers?: { [key: string]: string[] };
    isMarked?: boolean;
}

interface TSAExamLayoutProps {
    alertConfig: {
        isOpen: boolean;
        title: string;
        message: string | ReactNode;
        type: 'warning' | 'error' | 'info';
        onConfirm?: () => void;
        hideCloseButton?: boolean;
    };
    closeAlert: () => void;
    headerTitle: string;
    subjectDotClassName?: string;
    totalQuestions: number;
    timeLeft: number;
    formatTime: (seconds: number) => string;
    onFinishExam: () => void;
    headerRightSlot?: ReactNode;
    questions: ExamQuestion[];
    currentQuestionIndex: number;
    userAnswers: TSAExamUserAnswer[];
    onAnswerSelect: (questionId: string) => (answer: string | string[], questionType: string, isMultiple: boolean) => void;
    onSubAnswerSelect: (questionId: string) => (subQuestionId: string, answer: string | string[], questionType: string, isMultiple: boolean) => void;
    onMarkQuestion: (questionId: string) => void;
    onNext: () => void;
    onPrev: () => void;
    isImageAnswer: (answer: string) => boolean;
    questionTimeSeconds?: number;
    getQuestionStatus: (index: number) => 'answered' | 'unanswered';
    answeredCount: number;
    onQuestionSelect: (index: number) => void;
    getQuestionMarkedStatus: (index: number) => boolean;
    submitDisabled?: boolean;
    submitButtonTitle?: string;
}

export default function TSAExamLayout({
    alertConfig,
    closeAlert,
    headerTitle,
    subjectDotClassName,
    totalQuestions,
    timeLeft,
    formatTime,
    onFinishExam,
    headerRightSlot,
    questions,
    currentQuestionIndex,
    userAnswers,
    onAnswerSelect,
    onSubAnswerSelect,
    onMarkQuestion,
    onNext,
    onPrev,
    isImageAnswer,
    questionTimeSeconds,
    getQuestionStatus,
    answeredCount,
    onQuestionSelect,
    getQuestionMarkedStatus,
    submitDisabled = false,
    submitButtonTitle,
}: TSAExamLayoutProps) {
    return (
        <div className={TSA_EXAM_VIEWPORT_CLASS}>
            <ExamAlertModal
                isOpen={alertConfig.isOpen}
                title={alertConfig.title}
                message={alertConfig.message}
                type={alertConfig.type}
                onClose={alertConfig.hideCloseButton ? undefined : closeAlert}
                onConfirm={alertConfig.onConfirm}
                hideCloseButton={alertConfig.hideCloseButton}
                confirmText="Đã hiểu"
                closeText="Quay lại"
            />
            <ExamHeader
                fixedLayout
                headerTitle={headerTitle}
                subjectDotClassName={subjectDotClassName}
                totalQuestions={totalQuestions}
                timeLeft={timeLeft}
                formatTime={formatTime}
                onFinishExam={onFinishExam}
                logoSrc={tsaLogo}
                contentClassName={TSA_EXAM_HEADER_CLASS}
                hideFinishButton
                headerRightSlot={headerRightSlot}
            />

            <div className={TSA_EXAM_PAGE_CLASS}>
                <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
                    <div className="flex min-h-0 flex-1 overflow-hidden">
                        <div className="min-h-0 min-w-0 flex-1 overflow-hidden">
                            <div className="flex h-full min-h-0 flex-col overflow-hidden border-y border-gray-200 bg-white">
                                <div className="min-h-0 flex-1 overflow-hidden">
                                    <TSAExamPlayer
                                        embedded
                                        fillHeight
                                        questions={questions}
                                        currentIndex={currentQuestionIndex}
                                        userAnswers={userAnswers}
                                        onAnswerSelect={onAnswerSelect}
                                        onSubAnswerSelect={onSubAnswerSelect}
                                        onMarkQuestion={onMarkQuestion}
                                        onNext={onNext}
                                        onPrev={onPrev}
                                        isImageAnswer={isImageAnswer}
                                        questionTimeSeconds={questionTimeSeconds}
                                        formatTime={formatTime}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className={`min-h-0 shrink-0 overflow-hidden border-l border-gray-200 ${TSA_QUESTION_LIST_WIDTH_CLASS}`}>
                            <QuestionNavigator
                                compact
                                narrow
                                fillHeight
                                totalQuestions={totalQuestions}
                                getQuestionStatus={getQuestionStatus}
                                answeredCount={answeredCount}
                                onQuestionSelect={onQuestionSelect}
                                currentQuestionIndex={currentQuestionIndex}
                                getQuestionMarkedStatus={getQuestionMarkedStatus}
                            />
                        </div>
                    </div>
                    <div className="flex shrink-0 justify-end border-t border-gray-200 bg-white px-4 py-2">
                        <button
                            onClick={onFinishExam}
                            disabled={submitDisabled}
                            title={submitButtonTitle}
                            className={`rounded-lg px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors ${submitDisabled
                                ? 'bg-gray-300 cursor-not-allowed'
                                : 'bg-red-600 hover:bg-red-700'
                                }`}
                        >
                            Nộp bài
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
