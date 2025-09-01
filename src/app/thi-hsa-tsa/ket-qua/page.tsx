'use client';

import Header from '@/components/Header';
import MathRenderer from '@/components/MathRenderer';
import { useExamResult } from '@/hooks/useExam';
import { useSearchParams } from 'next/navigation';
import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';

// Hàm làm sạch nội dung, loại bỏ các text dạng [cite...]
const cleanContent = (content: string): string => {
    if (!content) return '';
    // Loại bỏ các pattern dạng [cite...], [ref...], [1], [2], etc.
    return content
        .replace(/\[cite[^\]]*\]/gi, '') // Loại bỏ [cite...]
        .replace(/\[ref[^\]]*\]/gi, '') // Loại bỏ [ref...]
        .replace(/\[\d+\]/g, '') // Loại bỏ [1], [2], [3], etc.
        .replace(/\[[^\]]*\]/g, '') // Loại bỏ tất cả các text trong dấu ngoặc vuông khác
        .replace(/\s+/g, ' ') // Thay thế nhiều khoảng trắng liên tiếp bằng một khoảng trắng
        .trim(); // Loại bỏ khoảng trắng đầu cuối
};

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
                    <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
                        <div className="text-center mb-8">
                            <div className="text-6xl font-bold text-green-600 mb-4">
                                {examResult.percentage}%
                            </div>
                            <div className="text-xl text-gray-600 mb-2">
                                {examResult.totalPoints}/{examResult.maxPoints} điểm
                            </div>
                            <div className="text-sm text-gray-500">
                                Thời gian làm bài: {Math.floor(examResult.totalTime / 60)}:{String(examResult.totalTime % 60).padStart(2, '0')}
                            </div>
                        </div>

                        {examResult.message && (
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                                <p className="text-blue-800">{examResult.message}</p>
                            </div>
                        )}

                        {/* Stats Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-green-600">Điểm số</p>
                                        <p className="text-2xl font-bold text-green-700">{examResult.totalPoints}</p>
                                    </div>
                                    <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                                        <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-blue-600">Tỷ lệ đúng</p>
                                        <p className="text-2xl font-bold text-blue-700">{examResult.percentage}%</p>
                                    </div>
                                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                                        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-200">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-purple-600">Thời gian</p>
                                        <p className="text-2xl font-bold text-purple-700">{Math.floor(examResult.totalTime / 60)}:{String(examResult.totalTime % 60).padStart(2, '0')}</p>
                                    </div>
                                    <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                                        <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

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
                                                <MathRenderer content={cleanContent(question.content)} />
                                            </div>

                                            {/* Question Image */}
                                            {question.image && (
                                                <div className="mb-4">
                                                    <img
                                                        src={question.image}
                                                        alt="Question"
                                                        className="max-w-full h-auto rounded-lg border border-gray-200"
                                                        onError={(e) => {
                                                            e.currentTarget.style.display = 'none';
                                                        }}
                                                        onLoad={(e) => {
                                                            e.currentTarget.style.display = 'block';
                                                        }}
                                                    />
                                                </div>
                                            )}

                                            {/* Options */}
                                            {question.options && (
                                                <div className="mb-4">
                                                    <div className="grid grid-cols-1 gap-2">
                                                        {Object.entries(question.options).map(([key, value]) => (
                                                            <div
                                                                key={key}
                                                                className={`p-3 rounded-lg border-2 ${key === question.correctAnswer
                                                                    ? 'border-green-500 bg-green-50'
                                                                    : key === question.userAnswer && !question.isCorrect
                                                                        ? 'border-red-500 bg-red-50'
                                                                        : 'border-gray-200 bg-gray-50'
                                                                    }`}
                                                            >
                                                                <div className="flex items-center space-x-3">
                                                                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold ${key === question.correctAnswer
                                                                        ? 'bg-green-500 text-white'
                                                                        : key === question.userAnswer && !question.isCorrect
                                                                            ? 'bg-red-500 text-white'
                                                                            : 'bg-gray-300 text-gray-600'
                                                                        }`}>
                                                                        {key}
                                                                    </span>
                                                                    <span className="text-gray-700">{value}</span>
                                                                    {key === question.correctAnswer && (
                                                                        <svg className="w-5 h-5 text-green-500 ml-auto" fill="currentColor" viewBox="0 0 20 20">
                                                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 000-1.414L9.414 7 8.707 6.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                                        </svg>
                                                                    )}
                                                                    {key === question.userAnswer && !question.isCorrect && (
                                                                        <svg className="w-5 h-5 text-red-500 ml-auto" fill="currentColor" viewBox="0 0 20 20">
                                                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                                                        </svg>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {/* User Answer vs Correct Answer - Chỉ hiển thị nếu không có subQuestions */}
                                            {!question.subQuestions || question.subQuestions.length === 0 ? (
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                                    <div className="bg-gray-50 rounded-lg p-4">
                                                        <h4 className="text-sm font-semibold text-gray-700 mb-2">Đáp án của bạn:</h4>
                                                        <p className={`font-medium ${question.isCorrect ? 'text-green-600' : 'text-red-600'
                                                            }`}>
                                                            {question.userAnswer || 'Không trả lời'}
                                                        </p>
                                                    </div>
                                                    <div className="bg-gray-50 rounded-lg p-4">
                                                        <h4 className="text-sm font-semibold text-gray-700 mb-2">Đáp án đúng:</h4>
                                                        <p className="font-medium text-green-600">
                                                            {question.correctAnswer}
                                                        </p>
                                                    </div>
                                                </div>
                                            ) : null}

                                            {/* Explanation */}
                                            {question.explanation && (
                                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                                    <h4 className="text-sm font-semibold text-blue-800 mb-2">Giải thích:</h4>
                                                    <MathRenderer content={cleanContent(question.explanation)} />
                                                </div>
                                            )}

                                            {/* Sub Questions */}
                                            {question.subQuestions && question.subQuestions.length > 0 && (
                                                <div className="mt-4 space-y-4">
                                                    <h4 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">
                                                        Các câu hỏi con:
                                                    </h4>
                                                    {question.subQuestions.map((subQuestion) => (
                                                        <div key={subQuestion.id} className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                                                            {/* Sub Question Header */}
                                                            <div className="flex items-center mb-3">
                                                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm mr-3 ${subQuestion.isCorrect ? 'bg-green-500' : 'bg-red-500'
                                                                    }`}>
                                                                    {subQuestion.subId}
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
                                                                <p className="text-gray-700 mb-3 font-medium">
                                                                    {cleanContent(subQuestion.content)}
                                                                </p>
                                                            </div>

                                                            {/* Sub Question Answers */}
                                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                                                                <div className="bg-white rounded-lg p-3 border border-amber-200">
                                                                    <h5 className="text-xs font-semibold text-gray-600 mb-1">Đáp án của bạn:</h5>
                                                                    <p className={`font-medium text-sm ${subQuestion.isCorrect ? 'text-green-600' : 'text-red-600'
                                                                        }`}>
                                                                        {subQuestion.userAnswer || 'Không trả lời'}
                                                                    </p>
                                                                </div>
                                                                <div className="bg-white rounded-lg p-3 border border-amber-200">
                                                                    <h5 className="text-xs font-semibold text-gray-600 mb-1">Đáp án đúng:</h5>
                                                                    <p className="font-medium text-green-600 text-sm">
                                                                        {subQuestion.correctAnswer}
                                                                    </p>
                                                                </div>
                                                            </div>

                                                            {/* Sub Question Explanation */}
                                                            {subQuestion.explanation && (
                                                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                                                                    <h5 className="text-xs font-semibold text-blue-800 mb-2">Giải thích:</h5>
                                                                    <div className="text-sm text-gray-700">
                                                                        <MathRenderer content={cleanContent(subQuestion.explanation)} />
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