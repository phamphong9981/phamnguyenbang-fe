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

    useEffect(() => {
        const id = searchParams.get('examId') || '';
        setExamId(id);
    }, [searchParams]);

    const { data: examResult, isLoading, error } = useExamResult(examId);

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

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />

            {/* Hero Section */}
            <section className="bg-gradient-to-br from-green-600 via-emerald-600 to-teal-700 py-16 relative overflow-hidden">
                <div className="absolute inset-0 bg-black/10"></div>
                <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
                        📊 Kết quả bài thi
                    </h1>
                    <p className="text-xl text-green-100 max-w-3xl mx-auto">
                        Xem chi tiết kết quả và phân tích từng câu hỏi
                    </p>
                </div>
            </section>

            {/* Result Summary */}
            <section className="py-8">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Question Details */}
                    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                        <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-8 py-6 border-b border-gray-200">
                            <h2 className="text-2xl font-bold text-gray-900">Chi tiết từng câu hỏi</h2>
                            <p className="text-gray-600 mt-2">Xem đáp án và giải thích cho từng câu hỏi</p>
                        </div>

                        <div className="divide-y divide-gray-200">
                            {examResult.questionDetails.map((question, index) => (
                                <div key={question.questionId} className="p-8">
                                    <div className="flex items-start space-x-4">
                                        {/* Question Number */}
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm ${question.isCorrect
                                            ? 'bg-green-500'
                                            : 'bg-red-500'
                                            }`}>
                                            {index + 1}
                                        </div>

                                        {/* Question Content */}
                                        <div className="flex-1">
                                            {/* Question Header */}
                                            <div className="flex items-center justify-between mb-4">
                                                <div className="flex items-center space-x-3">
                                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${question.isCorrect
                                                        ? 'bg-green-100 text-green-800'
                                                        : 'bg-red-100 text-red-800'
                                                        }`}>
                                                        {question.isCorrect ? 'Đúng' : 'Sai'}
                                                    </span>
                                                    <span className="text-sm text-gray-500">
                                                        +{question.pointsEarned} điểm
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Question Text */}
                                            <div className="mb-4">
                                                {renderContentWithImages(question.content, question.images)}
                                            </div>

                                            {/* Options */}
                                            {question.options && (
                                                <div className="mb-4">
                                                    <div className="grid grid-cols-1 gap-2">
                                                        {Object.entries(question.options).map(([key, value]) => {
                                                            const isCorrectAnswer = Array.isArray(question.correctAnswer) && question.correctAnswer.includes(key);
                                                            const isUserAnswer = Array.isArray(question.userAnswer) && question.userAnswer.includes(key);
                                                            const isWrongUserAnswer = isUserAnswer && !question.isCorrect;

                                                            return (
                                                                <div
                                                                    key={key}
                                                                    className={`p-3 rounded-lg border-2 ${isCorrectAnswer
                                                                        ? 'border-green-500 bg-green-50'
                                                                        : isWrongUserAnswer
                                                                            ? 'border-red-500 bg-red-50'
                                                                            : 'border-gray-200 bg-gray-50'
                                                                        }`}
                                                                >
                                                                    <div className="flex items-center space-x-3">
                                                                        <span className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold ${isCorrectAnswer
                                                                            ? 'bg-green-500 text-white'
                                                                            : isWrongUserAnswer
                                                                                ? 'bg-red-500 text-white'
                                                                                : 'bg-gray-300 text-gray-600'
                                                                            }`}>
                                                                            {key}
                                                                        </span>
                                                                        <span className="text-gray-700">
                                                                            <RichRenderer content={value} />
                                                                        </span>
                                                                        {isCorrectAnswer && (
                                                                            <svg className="w-5 h-5 text-green-500 ml-auto" fill="currentColor" viewBox="0 0 20 20">
                                                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 000-1.414L9.414 7 8.707 6.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                                            </svg>
                                                                        )}
                                                                        {isWrongUserAnswer && (
                                                                            <svg className="w-5 h-5 text-red-500 ml-auto" fill="currentColor" viewBox="0 0 20 20">
                                                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                                                            </svg>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                </div>
                                            )}

                                            {/* User Answer vs Correct Answer - Chỉ hiển thị nếu không có subQuestions */}
                                            {!question.subQuestions || question.subQuestions.length === 0 ? (
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                                    <div className="bg-gray-50 rounded-lg p-4">
                                                        <h4 className="text-sm font-semibold text-gray-700 mb-2">Đáp án của bạn:</h4>
                                                        <div className={`font-medium ${question.isCorrect ? 'text-green-600' : 'text-red-600'
                                                            }`}>
                                                            {Array.isArray(question.userAnswer) && question.userAnswer.length > 0
                                                                ? <RichRenderer content={question.userAnswer.join(', ')} />
                                                                : 'Không trả lời'}
                                                        </div>
                                                    </div>
                                                    <div className="bg-gray-50 rounded-lg p-4">
                                                        <h4 className="text-sm font-semibold text-gray-700 mb-2">Đáp án đúng:</h4>
                                                        <div className="font-medium text-green-600">
                                                            {Array.isArray(question.correctAnswer)
                                                                ? <RichRenderer content={question.correctAnswer.join(', ')} />
                                                                : <RichRenderer content={question.correctAnswer} />}
                                                        </div>
                                                    </div>
                                                </div>
                                            ) : null}

                                            {/* Explanation */}
                                            {question.explanation && (
                                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                                    <h4 className="text-sm font-semibold text-blue-800 mb-2">Giải thích:</h4>
                                                    <RichRenderer content={question.explanation} />
                                                </div>
                                            )}

                                            {/* Sub Questions */}
                                            {question.subQuestions && question.subQuestions.length > 0 && (
                                                <div className="mt-4 space-y-4">
                                                    <h4 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">
                                                        Các câu hỏi con:
                                                    </h4>
                                                    {question.subQuestions.map((subQuestion, index) => (
                                                        <div key={subQuestion.id} className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                                                            {/* Sub Question Header */}
                                                            <div className="flex items-center mb-3">
                                                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm mr-3 ${subQuestion.isCorrect ? 'bg-green-500' : 'bg-red-500'
                                                                    }`}>
                                                                    {index + 1}
                                                                </div>
                                                                <div className="flex items-center space-x-3">
                                                                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${subQuestion.isCorrect
                                                                        ? 'bg-green-100 text-green-800'
                                                                        : 'bg-red-100 text-red-800'
                                                                        }`}>
                                                                        {subQuestion.isCorrect ? 'Đúng' : 'Sai'}
                                                                    </span>
                                                                    <span className="text-xs text-gray-500">
                                                                        +{subQuestion.pointsEarned} điểm
                                                                    </span>
                                                                </div>
                                                            </div>

                                                            {/* Sub Question Content */}
                                                            <div className="mb-4">
                                                                {(() => {
                                                                    // Always use renderContentWithImages to handle placeholders and images
                                                                    return (
                                                                        <p className="text-gray-700 mb-3 font-medium">
                                                                            {renderContentWithImages(subQuestion.content, subQuestion.images)}
                                                                        </p>
                                                                    );
                                                                })()}
                                                            </div>

                                                            {/* Sub Question Answers */}
                                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                                                                <div className="bg-white rounded-lg p-3 border border-amber-200">
                                                                    <h5 className="text-xs font-semibold text-gray-600 mb-1">Đáp án của bạn:</h5>
                                                                    <div className={`font-medium text-sm ${subQuestion.isCorrect ? 'text-green-600' : 'text-red-600'
                                                                        }`}>
                                                                        {Array.isArray(subQuestion.userAnswer) && subQuestion.userAnswer.length > 0
                                                                            ? <RichRenderer content={subQuestion.userAnswer.join(', ')} />
                                                                            : 'Không trả lời'}
                                                                    </div>
                                                                </div>
                                                                <div className="bg-white rounded-lg p-3 border border-amber-200">
                                                                    <h5 className="text-xs font-semibold text-gray-600 mb-1">Đáp án đúng:</h5>
                                                                    <div className="font-medium text-green-600 text-sm">
                                                                        {Array.isArray(subQuestion.correctAnswer)
                                                                            ? <RichRenderer content={subQuestion.correctAnswer.join(', ')} />
                                                                            : <RichRenderer content={subQuestion.correctAnswer} />}
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            {/* Sub Question Explanation */}
                                                            {subQuestion.explanation && (
                                                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                                                                    <h5 className="text-xs font-semibold text-blue-800 mb-2">Giải thích:</h5>
                                                                    <div className="text-sm text-gray-700">
                                                                        <RichRenderer content={subQuestion.explanation} />
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            href="/thi-hsa-tsa/bai-tap-chuong"
                            className="bg-blue-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors text-center"
                        >
                            Quay lại trang bài tập
                        </Link>
                    </div>
                </div>
            </section>
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