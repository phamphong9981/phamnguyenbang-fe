'use client';

import { ReactNode } from 'react';
import ExamHeader from './ExamHeader';
import ExamAlertModal from './ExamAlertModal';
import HSAQuestionStatusBars from './HSAQuestionStatusBars';
import HSAExamPlayer, { HSAExamQuestionItem, HSAExamUserAnswer } from './HSAExamPlayer';
import hsaLogo from '@/app/thi-hsa-tsa/lam-bai-group-hsa/PZB_Edu_HSA_green_transparent.png';

export const HSA_EXAM_HEADER_CLASS = 'w-full shrink-0 px-0 py-3';
export const HSA_EXAM_LOGO_CLASS = 'h-14 w-auto object-contain shrink-0';
export const HSA_EXAM_PAGE_CLASS = 'flex min-h-0 w-full flex-1 flex-col overflow-hidden';
export const HSA_EXAM_VIEWPORT_CLASS = 'flex h-dvh flex-col overflow-hidden bg-white';

export type { HSAExamUserAnswer };

interface HSAExamLayoutProps {
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
    questionItems: HSAExamQuestionItem[];
    userAnswers: HSAExamUserAnswer[];
    onAnswerSelect: (questionId: string) => (answer: string | string[], questionType: string, isMultiple: boolean) => void;
    onSubAnswerSelect: (questionId: string) => (subQuestionId: string, answer: string | string[], questionType: string, isMultiple: boolean) => void;
    onMarkQuestion: (questionId: string) => void;
    isImageAnswer: (answer: string) => boolean;
    getQuestionStatus: (index: number) => 'answered' | 'unanswered';
    getQuestionMarkedStatus: (index: number) => boolean;
    isLastSubject: boolean;
    onNextSubject?: () => void;
    submitDisabled?: boolean;
    submitButtonTitle?: string;
}

export default function HSAExamLayout({
    alertConfig,
    closeAlert,
    headerTitle,
    subjectDotClassName,
    totalQuestions,
    timeLeft,
    formatTime,
    onFinishExam,
    questionItems,
    userAnswers,
    onAnswerSelect,
    onSubAnswerSelect,
    onMarkQuestion,
    isImageAnswer,
    getQuestionStatus,
    getQuestionMarkedStatus,
    isLastSubject,
    onNextSubject,
    submitDisabled = false,
    submitButtonTitle,
}: HSAExamLayoutProps) {
    return (
        <div className={HSA_EXAM_VIEWPORT_CLASS}>
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
                logoSrc={hsaLogo}
                logoClassName={HSA_EXAM_LOGO_CLASS}
                contentClassName={HSA_EXAM_HEADER_CLASS}
                hideFinishButton
            />

            <div className={HSA_EXAM_PAGE_CLASS}>
                <HSAQuestionStatusBars
                    totalQuestions={totalQuestions}
                    getQuestionStatus={getQuestionStatus}
                    getQuestionMarkedStatus={getQuestionMarkedStatus}
                />
                <HSAExamPlayer
                    items={questionItems}
                    userAnswers={userAnswers}
                    onAnswerSelect={onAnswerSelect}
                    onSubAnswerSelect={onSubAnswerSelect}
                    onMarkQuestion={onMarkQuestion}
                    isImageAnswer={isImageAnswer}
                />
                <div className="flex shrink-0 justify-end border-t border-gray-200 bg-white px-0 py-2">
                    {isLastSubject ? (
                        <button
                            type="button"
                            onClick={onFinishExam}
                            disabled={submitDisabled}
                            title={submitButtonTitle}
                            className={`rounded-lg px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors ${
                                submitDisabled
                                    ? 'cursor-not-allowed bg-gray-300'
                                    : 'bg-green-600 hover:bg-green-700'
                            }`}
                        >
                            Nộp bài
                        </button>
                    ) : (
                        <button
                            type="button"
                            onClick={onNextSubject}
                            className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700"
                        >
                            Môn tiếp theo →
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
