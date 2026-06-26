'use client';

import Image, { StaticImageData } from 'next/image';
import { ReactNode } from 'react';

interface ExamHeaderProps {
    examName?: string;
    headerTitle?: string;
    totalQuestions: number;
    timeLeft: number;
    formatTime: (seconds: number) => string;
    onFinishExam: () => void;
    logoSrc?: StaticImageData | string;
    contentClassName?: string;
    subjectDotClassName?: string;
    fixedLayout?: boolean;
    hideFinishButton?: boolean;
    headerRightSlot?: ReactNode;
}

export default function ExamHeader({
    examName,
    headerTitle,
    totalQuestions,
    timeLeft,
    formatTime,
    onFinishExam,
    logoSrc,
    contentClassName = 'max-w-7xl mx-auto px-4 py-4',
    subjectDotClassName,
    fixedLayout = false,
    hideFinishButton = false,
    headerRightSlot,
}: ExamHeaderProps) {
    const title = headerTitle ?? examName ?? '';

    return (
        <div className={`bg-white shadow-md z-50 ${fixedLayout ? 'shrink-0' : 'sticky top-0'}`}>
            <div className={contentClassName}>
                <div className="flex justify-between items-center gap-4">
                    <div className="flex items-center gap-3 min-w-0">
                        {logoSrc && (
                            <Image
                                src={logoSrc}
                                alt="TSA Edu"
                                className="h-10 w-auto object-contain shrink-0"
                                priority
                            />
                        )}
                        <div className="min-w-0">
                            <h1 className="text-xl font-semibold text-gray-900 truncate flex items-center gap-2">
                                {subjectDotClassName && (
                                    <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${subjectDotClassName}`} />
                                )}
                                {title}
                            </h1>
                            <p className="text-sm text-gray-600">
                                Tổng cộng {totalQuestions} câu hỏi
                            </p>
                        </div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl font-bold text-red-600">
                            {formatTime(timeLeft)}
                        </div>
                        <div className="text-sm text-gray-600">Thời gian còn lại</div>
                    </div>
                    {!hideFinishButton ? (
                        <button
                            onClick={onFinishExam}
                            className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-medium transition-colors shrink-0"
                        >
                            Nộp bài
                        </button>
                    ) : headerRightSlot ? (
                        <div className="shrink-0">{headerRightSlot}</div>
                    ) : null}
                </div>
            </div>
        </div>
    );
}
