'use client';

import Header from '@/components/Header';
import { useState } from 'react';
import { useExamSets, ExamSetType } from '@/hooks/useExam';
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';

export default function ThiTSAPage() {
    const [selectedYear, setSelectedYear] = useState("2025");
    const [selectedDifficulty, setSelectedDifficulty] = useState("all");
    const { user } = useAuth();

    // Fetch exam sets from API
    const { data: examSets, isLoading, error } = useExamSets(ExamSetType.TSA, undefined, user?.id);

    const difficulties = ["all", "Khó", "Rất khó"];

    // Get unique years from exam sets
    const years = examSets ? [...new Set(examSets.map(exam => exam.year))] : [];

    // Filter exams by year and difficulty
    const filteredExams = examSets ? examSets.filter(exam => {
        if (selectedYear !== "all" && exam.year !== selectedYear) return false;
        if (selectedDifficulty !== "all" && exam.difficulty !== selectedDifficulty) return false;
        return true;
    }) : [];

    const getDifficultyColor = (difficulty: string) => {
        switch (difficulty) {
            case "Khó": return "bg-orange-100 text-orange-800";
            case "Rất khó": return "bg-red-100 text-red-800";
            default: return "bg-gray-100 text-gray-800";
        }
    };

    const startExam = (examId: string) => {
        // Navigate to exam page
        window.location.href = `/thi-hsa-tsa/lam-bai?examId=${examId}`;
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />

            {/* Hero Section */}
            <section className="bg-gradient-to-br from-purple-600 via-pink-600 to-red-600 py-16 relative overflow-hidden">
                <div className="absolute inset-0 bg-black/10"></div>
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
                        🏆 Thi TSA
                    </h1>
                    <p className="text-xl text-pink-100 max-w-3xl mx-auto">
                        Thử thách bản thân với kỳ thi TSA - dành cho học sinh có năng khiếu đặc biệt.
                        Các câu hỏi nâng cao đòi hỏi tư duy sáng tạo và khả năng giải quyết vấn đề xuất sắc.
                    </p>
                </div>
            </section>

            {/* Info Section */}
            <section className="py-12 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900 mb-6">
                                Về kỳ thi TSA
                            </h2>
                            <div className="space-y-4">
                                <div className="flex items-start space-x-3">
                                    <div className="w-6 h-6 bg-purple-100 rounded-lg flex items-center justify-center mt-1">
                                        <svg className="w-4 h-4 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <p className="text-gray-600">
                                        <span className="font-semibold">Dành cho học sinh giỏi:</span> TSA được thiết kế để đánh giá năng lực của những học sinh có tài năng đặc biệt.
                                    </p>
                                </div>
                                <div className="flex items-start space-x-3">
                                    <div className="w-6 h-6 bg-purple-100 rounded-lg flex items-center justify-center mt-1">
                                        <svg className="w-4 h-4 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <p className="text-gray-600">
                                        <span className="font-semibold">Câu hỏi nâng cao:</span> Các bài toán đòi hỏi tư duy sáng tạo và khả năng phân tích sâu.
                                    </p>
                                </div>
                                <div className="flex items-start space-x-3">
                                    <div className="w-6 h-6 bg-purple-100 rounded-lg flex items-center justify-center mt-1">
                                        <svg className="w-4 h-4 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <p className="text-gray-600">
                                        <span className="font-semibold">Thời gian dài:</span> 180 phút để hoàn thành 50 câu hỏi, cho phép suy nghĩ kỹ lưỡng.
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-8 border border-purple-100">
                            <div className="grid grid-cols-2 gap-6">
                                <div className="text-center">
                                    <div className="w-16 h-16 bg-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-2xl font-bold text-gray-900">180</h3>
                                    <p className="text-purple-600 font-medium">Phút</p>
                                </div>
                                <div className="text-center">
                                    <div className="w-16 h-16 bg-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-2xl font-bold text-gray-900">50</h3>
                                    <p className="text-pink-600 font-medium">Câu hỏi</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Filters Section */}
            <section className="py-8 bg-white border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">


                        {/* Year Filter */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Năm
                            </label>
                            <select
                                value={selectedYear}
                                onChange={(e) => setSelectedYear(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                            >
                                <option value="all">Tất cả năm</option>
                                {years.map(year => (
                                    <option key={year} value={year}>{year}</option>
                                ))}
                            </select>
                        </div>

                        {/* Difficulty Filter */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Độ khó
                            </label>
                            <select
                                value={selectedDifficulty}
                                onChange={(e) => setSelectedDifficulty(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                            >
                                <option value="all">Tất cả</option>
                                {difficulties.slice(1).map(difficulty => (
                                    <option key={difficulty} value={difficulty}>{difficulty}</option>
                                ))}
                            </select>
                        </div>

                        {/* Results Count */}
                        <div className="flex items-end">
                            <div className="w-full px-3 py-2 bg-gray-100 rounded-md">
                                <span className="text-sm text-gray-600">
                                    {filteredExams.length} đề thi
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Exams List */}
            <section className="py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {filteredExams.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="text-gray-400 text-6xl mb-4">🏆</div>
                            <h3 className="text-xl font-semibold text-gray-600 mb-2">
                                Không tìm thấy đề thi TSA
                            </h3>
                            <p className="text-gray-500">
                                Hãy thử thay đổi bộ lọc để tìm đề thi phù hợp.
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredExams.map((exam) => (
                                <div key={exam.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-100">
                                    {/* Header with gradient background */}
                                    <div className="bg-gradient-to-r from-purple-500 to-pink-600 px-6 py-4">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-3">
                                                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                                                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                    </svg>
                                                </div>
                                                <div>
                                                    <h3 className="text-lg font-bold text-white leading-tight">
                                                        {exam.name}
                                                    </h3>
                                                    <p className="text-pink-100 text-sm">Môn {exam.subject}</p>
                                                </div>
                                            </div>
                                            <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getDifficultyColor(exam.difficulty)}`}>
                                                {exam.difficulty}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="p-6">
                                        {/* Stats Grid */}
                                        <div className="grid grid-cols-2 gap-4 mb-6">
                                            <div className="bg-gray-50 rounded-lg p-3">
                                                <div className="flex items-center space-x-2">
                                                    <svg className="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                                                    </svg>
                                                    <span className="text-sm font-medium text-gray-700">Thời gian</span>
                                                </div>
                                                <p className="text-lg font-bold text-gray-900 mt-1">{exam.duration}</p>
                                            </div>
                                            <div className="bg-gray-50 rounded-lg p-3">
                                                <div className="flex items-center space-x-2">
                                                    <svg className="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                                                    </svg>
                                                    <span className="text-sm font-medium text-gray-700">Câu hỏi</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Description */}
                                        <div className="mb-6">
                                            <h4 className="text-sm font-semibold text-gray-900 mb-2">Mô tả đề thi:</h4>
                                            <p className="text-sm text-gray-600 leading-relaxed">
                                                {exam.description}
                                            </p>
                                        </div>

                                        {/* User Status Display */}
                                        {user && exam.userStatus && (
                                            <div className="mb-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
                                                <div className="flex items-center justify-between mb-2">
                                                    <span className="text-sm font-medium text-gray-700">Trạng thái:</span>
                                                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${exam.userStatus.isCompleted
                                                        ? 'bg-green-100 text-green-800'
                                                        : 'bg-blue-100 text-blue-800'
                                                        }`}>
                                                        {exam.userStatus.isCompleted ? 'Đã hoàn thành' : 'Chưa làm'}
                                                    </span>
                                                </div>
                                                {exam.userStatus.isCompleted && (
                                                    <div className="space-y-2">
                                                        <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                                                            <div>Điểm: <span className="font-semibold text-green-600">{exam.userStatus.totalPoints}</span></div>
                                                            <div>Thời gian: <span className="font-semibold">{exam.userStatus.totalTime}s</span></div>
                                                        </div>
                                                        <Link
                                                            href={`/thi-hsa-tsa/ket-qua?examId=${exam.id}`}
                                                            className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-medium bg-green-100 text-green-700 hover:bg-green-200 transition-colors"
                                                        >
                                                            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                            </svg>
                                                            Xem chi tiết
                                                        </Link>
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        {/* Action Button */}
                                        <button
                                            onClick={() => startExam(exam.id)}
                                            disabled={(user || undefined) && exam.userStatus?.isCompleted}
                                            className={`w-full py-3 px-4 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg ${user && exam.userStatus?.isCompleted
                                                ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                                                : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white'
                                                }`}
                                        >
                                            <div className="flex items-center justify-center space-x-2">
                                                {user && exam.userStatus?.isCompleted ? (
                                                    <>
                                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 000-1.414L9.414 7 8.707 6.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                        </svg>
                                                        <span>Đã hoàn thành</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                        </svg>
                                                        <span>Thử thách TSA</span>
                                                    </>
                                                )}
                                            </div>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* Stats Section */}
            <section className="bg-gradient-to-r from-purple-600 to-pink-600 py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
                        <div>
                            <div className="text-4xl font-bold text-white mb-2">2</div>
                            <div className="text-purple-100">Đề thi TSA</div>
                        </div>
                        <div>
                            <div className="text-4xl font-bold text-white mb-2">50</div>
                            <div className="text-purple-100">Câu hỏi/đề</div>
                        </div>
                        <div>
                            <div className="text-4xl font-bold text-white mb-2">180</div>
                            <div className="text-purple-100">Phút</div>
                        </div>
                        <div>
                            <div className="text-4xl font-bold text-white mb-2">100%</div>
                            <div className="text-purple-100">Thử thách</div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
