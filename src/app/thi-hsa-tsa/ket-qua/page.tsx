'use client';

import React from 'react';
import Header from '@/components/Header';
import RichRenderer from '@/components/RichRenderer';
import { useExamResult } from '@/hooks/useExam';
import { useSearchParams } from 'next/navigation';
import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';

// Loading component
function ExamResultLoading() {
    return (
        <div className="min-h-screen bg-gray-50">
            <Header />
            <div className="max-w-4xl mx-auto px-4 py-16">
                <div className="bg-white rounded-lg shadow-lg p-8">
                    <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    </div>
                    <p className="text-center mt-4 text-gray-600">Đang tải kết quả...</p>
                </div>
            </div>
        </div>
    );
}

// Helper function to render content with image placeholders
const renderContentWithImages = (content: string, images?: string[] | string): React.ReactNode => {
    // Convert images to array if it's a string
    const imagesArray = Array.isArray(images) ? images : (images ? [images] : []);

    // Check if content contains image_placeholder
    const placeholders = content.match(/image_placeholder/gi) || [];

    if (placeholders.length === 0) {
        // No placeholders, render content normally, then add all images at the end if they exist
        return (
            <>
                <RichRenderer content={content} />
                {imagesArray.length > 0 && (
                    <div className="mt-4 space-y-4">
                        {imagesArray.map((imageUrl, idx) => (
                            <div key={`default-img-${idx}`} className="my-4">
                                <img
                                    src={imageUrl}
                                    alt={`Image ${idx + 1}`}
                                    className="max-w-full rounded border border-gray-200"
                                    onError={(e) => {
                                        e.currentTarget.style.display = 'none';
                                    }}
                                />
                            </div>
                        ))}
                    </div>
                )}
            </>
        );
    }

    // Split content by placeholders and insert images
    const parts = content.split(/(image_placeholder)/gi);
    const elements: React.ReactNode[] = [];
    let imageIndex = 0;
    const unusedImages: string[] = [];

    parts.forEach((part, index) => {
        if (part.toLowerCase() === 'image_placeholder') {
            if (imageIndex < imagesArray.length) {
                const imageUrl = imagesArray[imageIndex];
                elements.push(
                    <div key={`img-${index}`} className="my-4">
                        <img
                            src={imageUrl}
                            alt={`Image ${imageIndex + 1}`}
                            className="max-w-full rounded border border-gray-200"
                            onError={(e) => {
                                e.currentTarget.style.display = 'none';
                            }}
                        />
                    </div>
                );
                imageIndex++;
            } else {
                // Placeholder without image - will be handled later
                imageIndex++;
            }
        } else if (part.trim()) {
            elements.push(
                <span key={`text-${index}`}>
                    <RichRenderer content={part} />
                </span>
            );
        }
    });

    // Add unused images at the end
    if (imageIndex < imagesArray.length) {
        unusedImages.push(...imagesArray.slice(imageIndex));
    }

    return (
        <>
            {elements}
            {unusedImages.length > 0 && (
                <div className="mt-4 space-y-4">
                    {unusedImages.map((imageUrl, idx) => (
                        <div key={`unused-img-${idx}`} className="my-4">
                            <img
                                src={imageUrl}
                                alt={`Image ${imageIndex + idx}`}
                                className="max-w-full rounded border border-gray-200"
                                onError={(e) => {
                                    e.currentTarget.style.display = 'none';
                                }}
                            />
                        </div>
                    ))}
                </div>
            )}
        </>
    );
};

// Main content component
function ExamResultContent() {
    const searchParams = useSearchParams();
    const [examId, setExamId] = useState<string>('');
    const [currentPage, setCurrentPage] = useState(1);
    const [targetQuestionId, setTargetQuestionId] = useState<string | null>(null);
    const QUESTIONS_PER_PAGE = 10;

    useEffect(() => {
        const id = searchParams.get('examId') || '';
        setExamId(id);
    }, [searchParams]);

    const { data: examResult, isLoading, error } = useExamResult(examId);

    // Effect to scroll to target question after page change
    useEffect(() => {
        if (targetQuestionId) {
            const element = document.getElementById(targetQuestionId);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                setTargetQuestionId(null);
            }
        }
    }, [currentPage, targetQuestionId, examResult]);

    if (isLoading) {
        return <ExamResultLoading />;
    }

    if (error || !examResult) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Header />
                <div className="max-w-4xl mx-auto px-4 py-16">
                    <div className="bg-white rounded-lg shadow-lg p-8">
                        <div className="text-center">
                            <h1 className="text-2xl font-bold text-gray-900 mb-4">Không tìm thấy kết quả</h1>
                            <p className="text-gray-600 mb-6">Không thể tải kết quả bài thi. Vui lòng thử lại sau.</p>
                            <Link
                                href="/thi-hsa-tsa/bai-tap-chuong"
                                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                Quay lại trang bài tập
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const totalQuestions = examResult.questionDetails.length;
    const totalPages = Math.ceil(totalQuestions / QUESTIONS_PER_PAGE);

    const startIndex = (currentPage - 1) * QUESTIONS_PER_PAGE;
    const currentQuestions = examResult.questionDetails.slice(startIndex, startIndex + QUESTIONS_PER_PAGE);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleJumpToQuestion = (index: number) => {
        const page = Math.floor(index / QUESTIONS_PER_PAGE) + 1;
        if (page !== currentPage) {
            setCurrentPage(page);
        }
        // Set target ID to scroll to after render
        setTimeout(() => setTargetQuestionId(`question-${index}`), 100);
    };

    const getQuestionStatusColor = (question: any) => {
        // Check if skipped (no user answer)
        const hasAnswer = Array.isArray(question.userAnswer)
            ? question.userAnswer.length > 0
            : !!question.userAnswer;

        if (!hasAnswer) return 'bg-gray-200 text-gray-700 hover:bg-gray-300';
        if (question.isCorrect) return 'bg-green-500 text-white hover:bg-green-600';
        return 'bg-red-500 text-white hover:bg-red-600';
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />

            {/* Hero Section */}
            <section className="bg-gradient-to-br from-green-600 via-emerald-600 to-teal-700 py-12 relative overflow-hidden">
                <div className="absolute inset-0 bg-black/10"></div>
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                        📊 Kết quả bài thi
                    </h1>
                    <p className="text-lg text-green-100 max-w-3xl mx-auto">
                        {examResult.percentage}% - {examResult.totalPoints}/{examResult.maxPoints} điểm
                    </p>
                </div>
            </section>

            {/* Main Content Area */}
            <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                    {/* Left Column: Questions List (Content) */}
                    <div className="lg:col-span-9 order-2 lg:order-1">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden mb-6">
                            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                                <h2 className="text-lg font-bold text-gray-900">
                                    Danh sách câu hỏi (Trang {currentPage}/{totalPages})
                                </h2>
                            </div>

                            <div className="divide-y divide-gray-200">
                                {currentQuestions.map((question, idx) => {
                                    const actualIndex = startIndex + idx;
                                    return (
                                        <div
                                            key={question.questionId}
                                            id={`question-${actualIndex}`}
                                            className={`p-6 ${actualIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}
                                        >
                                            <div className="flex items-start space-x-4">
                                                {/* Question Number Badge */}
                                                <div className={`w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center font-bold text-sm shadow-sm ${question.isCorrect ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                                                    }`}>
                                                    {actualIndex + 1}
                                                </div>

                                                {/* Question Content Wrapper */}
                                                <div className="flex-1 min-w-0">
                                                    {/* Header: Score & Status */}
                                                    <div className="flex items-center space-x-3 mb-4">
                                                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${question.isCorrect
                                                            ? 'bg-green-50 text-green-700 border-green-200'
                                                            : 'bg-red-50 text-red-700 border-red-200'
                                                            }`}>
                                                            {question.isCorrect ? 'Đúng' : 'Sai'}
                                                        </span>
                                                        <span className="text-xs text-gray-500 font-medium">
                                                            +{question.pointsEarned} điểm
                                                        </span>
                                                    </div>

                                                    {/* Question Text */}
                                                    <div className="prose prose-sm max-w-none text-gray-800 mb-6">
                                                        {renderContentWithImages(question.content, question.images)}
                                                    </div>

                                                    {/* Options */}
                                                    {question.options && (
                                                        <div className="grid grid-cols-1 xl:grid-cols-2 gap-3 mb-6">
                                                            {Object.entries(question.options).map(([key, value]) => {
                                                                const isCorrectAnswer = Array.isArray(question.correctAnswer) && question.correctAnswer.includes(key);
                                                                const isUserAnswer = Array.isArray(question.userAnswer) && question.userAnswer.includes(key);
                                                                const isWrongUserAnswer = isUserAnswer && !question.isCorrect;

                                                                return (
                                                                    <div
                                                                        key={key}
                                                                        className={`relative p-3 rounded-lg border-2 transition-all ${isCorrectAnswer
                                                                            ? 'border-green-500 bg-green-50/50'
                                                                            : isWrongUserAnswer
                                                                                ? 'border-red-500 bg-red-50/50'
                                                                                : 'border-gray-200 hover:border-gray-300 bg-white'
                                                                            }`}
                                                                    >
                                                                        <div className="flex items-start space-x-3">
                                                                            <span className={`w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold ${isCorrectAnswer
                                                                                ? 'bg-green-500 text-white'
                                                                                : isWrongUserAnswer
                                                                                    ? 'bg-red-500 text-white'
                                                                                    : 'bg-gray-100 text-gray-600'
                                                                                }`}>
                                                                                {key}
                                                                            </span>
                                                                            <div className="text-sm text-gray-700 pt-0.5">
                                                                                <RichRenderer content={value} />
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                );
                                                            })}
                                                        </div>
                                                    )}

                                                    {/* Compact Answer Comparison (if no options or just text) */}
                                                    {(!question.subQuestions || question.subQuestions.length === 0) && (
                                                        <div className="bg-gray-100 rounded-lg p-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                                            <div>
                                                                <span className="text-gray-500 font-medium">Bạn chọn:</span>
                                                                <div className={`mt-1 font-semibold ${question.isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                                                                    {Array.isArray(question.userAnswer) && question.userAnswer.length > 0
                                                                        ? <RichRenderer content={question.userAnswer.join(', ')} />
                                                                        : <span className="text-gray-400 italic">Không trả lời</span>}
                                                                </div>
                                                            </div>
                                                            <div>
                                                                <span className="text-gray-500 font-medium">Đáp án đúng:</span>
                                                                <div className="mt-1 font-semibold text-green-600">
                                                                    {Array.isArray(question.correctAnswer)
                                                                        ? <RichRenderer content={question.correctAnswer.join(', ')} />
                                                                        : <RichRenderer content={question.correctAnswer} />}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}

                                                    {/* Explanation */}
                                                    {question.explanation && (
                                                        <div className="mt-4 bg-blue-50/80 border border-blue-100 rounded-lg p-4">
                                                            <div className="flex items-center space-x-2 text-blue-800 font-semibold text-sm mb-2">
                                                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                                </svg>
                                                                <span>Giải thích chi tiết</span>
                                                            </div>
                                                            <div className="text-sm text-gray-700 prose prose-blue max-w-none">
                                                                <RichRenderer content={question.explanation} />
                                                            </div>
                                                        </div>
                                                    )}

                                                    {/* Sub Questions Rendering - Simplified for brevity, similar structure */}
                                                    {question.subQuestions && question.subQuestions.length > 0 && (
                                                        <div className="mt-6 space-y-4">
                                                            {question.subQuestions.map((subQ, sqIdx) => (
                                                                <div key={subQ.id} className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                                                                    <div className="mb-2 font-medium text-sm text-gray-900 border-b border-gray-200 pb-2 flex justify-between">
                                                                        <span>Câu hỏi con {sqIdx + 1}</span>
                                                                        <span className={subQ.isCorrect ? 'text-green-600' : 'text-red-600'}>
                                                                            {subQ.isCorrect ? 'Đúng' : 'Sai'}
                                                                        </span>
                                                                    </div>
                                                                    <div className="text-sm mb-2"><RichRenderer content={subQ.content} /></div>
                                                                    {/* Short answer summary for subquestion */}
                                                                    <div className="text-xs text-gray-500 grid grid-cols-2 gap-2">
                                                                        <div>Chọn: <span className={subQ.isCorrect ? 'text-green-600' : 'text-red-600'}>{Array.isArray(subQ.userAnswer) ? subQ.userAnswer.join(', ') : subQ.userAnswer || '-'}</span></div>
                                                                        <div>Đúng: <span className="text-green-600">{Array.isArray(subQ.correctAnswer) ? subQ.correctAnswer.join(', ') : subQ.correctAnswer}</span></div>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Pagination */}
                            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex items-center justify-between">
                                <button
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Trang trước
                                </button>
                                <span className="text-sm text-gray-600 font-medium">
                                    Trang {currentPage} / {totalPages}
                                </span>
                                <button
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                    className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Trang sau
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Navigation Sidebar (Sticky) */}
                    <div className="lg:col-span-3 order-1 lg:order-2">
                        <div className="sticky top-8 space-y-6">
                            {/* Score Card */}
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                                <div className="text-center mb-4">
                                    <div className="text-3xl font-bold text-gray-900">{examResult.percentage}%</div>
                                    <div className="text-sm text-gray-500">Kết quả làm bài</div>
                                </div>
                                <div className="grid grid-cols-2 gap-4 text-center text-sm">
                                    <div className="p-2 bg-green-50 rounded-lg">
                                        <div className="font-bold text-green-700">{examResult.totalPoints}</div>
                                        <div className="text-green-600 text-xs">Điểm</div>
                                    </div>
                                    <div className="p-2 bg-blue-50 rounded-lg">
                                        <div className="font-bold text-blue-700">{examResult.maxPoints}</div>
                                        <div className="text-blue-600 text-xs">Tổng điểm</div>
                                    </div>
                                </div>
                            </div>

                            {/* Question Navigation Grid */}
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                                <div className="p-4 border-b border-gray-200 bg-gray-50">
                                    <h3 className="font-semibold text-gray-900">Mục lục câu hỏi</h3>
                                    <div className="flex gap-2 mt-2 text-xs">
                                        <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-green-500"></div><span>Đúng</span></div>
                                        <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-red-500"></div><span>Sai</span></div>
                                        <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-gray-200 border border-gray-300"></div><span>Bỏ qua</span></div>
                                    </div>
                                </div>
                                <div className="p-4">
                                    <div className="grid grid-cols-5 gap-2">
                                        {examResult.questionDetails.map((q, idx) => {
                                            const isActive = idx >= startIndex && idx < startIndex + QUESTIONS_PER_PAGE;
                                            return (
                                                <button
                                                    key={q.questionId}
                                                    onClick={() => handleJumpToQuestion(idx)}
                                                    className={`aspect-square rounded flex items-center justify-center text-xs font-bold transition-all ${getQuestionStatusColor(q)
                                                        } ${isActive ? 'ring-2 ring-blue-500 ring-offset-2' : ''}`}
                                                >
                                                    {idx + 1}
                                                </button>
                                            )
                                        })}
                                    </div>
                                </div>
                            </div>

                            <Link
                                href="/thi-hsa-tsa/bai-tap-chuong"
                                className="block w-full bg-gray-800 text-white text-center px-4 py-3 rounded-xl font-medium hover:bg-gray-900 transition-colors shadow-lg shadow-gray-200"
                            >
                                Về trang đề thi
                            </Link>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}

// Default export with Suspense boundary
export default function ExamResultPage() {
    return (
        <Suspense fallback={<ExamResultLoading />}>
            <ExamResultContent />
        </Suspense>
    );
}