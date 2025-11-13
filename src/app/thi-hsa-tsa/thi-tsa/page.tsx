'use client';

import Header from '@/components/Header';
import { useState } from 'react';
import { useExamSets, ExamSetType } from '@/hooks/useExam';
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';
import { getSubjectInfo } from '../utils';

export default function ThiTSAPage() {
    const [selectedYear, setSelectedYear] = useState("all");
    const [selectedDifficulty, setSelectedDifficulty] = useState("all");
    const [selectedSubject, setSelectedSubject] = useState<number | "all">("all");
    const { user } = useAuth();

    // Fetch exam sets from API
    const { data: examSets, isLoading, error } = useExamSets(ExamSetType.TSA, undefined, user?.id);

    const difficulties = ["all", "Khó", "Rất khó"];

    // Get unique years from exam sets
    const years = examSets ? [...new Set(examSets.map(exam => exam.year))] : [];

    // Get unique subjects from exam sets
    const subjects = examSets ? [...new Set(examSets.map(exam => exam.subject))] : [];

    // Filter exams by year, difficulty, and subject
    const filteredExams = examSets ? examSets.filter(exam => {
        if (selectedYear !== "all" && exam.year !== selectedYear) return false;
        if (selectedDifficulty !== "all" && exam.difficulty !== selectedDifficulty) return false;
        if (selectedSubject !== "all" && exam.subject !== selectedSubject) return false;
        return true;
    }) : [];

    // Group exams by subject
    const examsBySubject = filteredExams.reduce((acc, exam) => {
        const subjectId = exam.subject;
        if (!acc[subjectId]) {
            acc[subjectId] = [];
        }
        acc[subjectId].push(exam);
        return acc;
    }, {} as Record<number, typeof filteredExams>);

    // Get subject count
    const getSubjectCount = (subjectId: number) => {
        return filteredExams.filter(exam => exam.subject === subjectId).length;
    };

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

    // Exam Card Component
    const ExamCard = ({ exam, startExam, user, getDifficultyColor }: {
        exam: typeof filteredExams[0];
        startExam: (examId: string) => void;
        user: any;
        getDifficultyColor: (difficulty: string) => string;
    }) => (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-100">
            {/* Header with gradient background */}
            <div className={`bg-gradient-to-r ${getSubjectInfo(exam.subject).gradient} px-6 py-4`}>
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
                            <p className="text-white/80 text-sm">Môn {getSubjectInfo(exam.subject).name}</p>
                        </div>
                    </div>
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full bg-white/20 text-white backdrop-blur-sm`}>
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
                        : `bg-gradient-to-r ${getSubjectInfo(exam.subject).gradient} hover:opacity-90 text-white`
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
    );

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
                    ) : selectedSubject === "all" ? (
                        // Show grouped by subject
                        <div className="space-y-12">
                            {Object.entries(examsBySubject).map(([subjectIdStr, exams]) => {
                                const subjectId = parseInt(subjectIdStr);
                                const subjectInfo = getSubjectInfo(subjectId);

                                return (
                                    <div key={subjectId} className="space-y-6">
                                        {/* Subject Header */}
                                        <div className={`bg-gradient-to-r ${subjectInfo.gradient} rounded-2xl p-6 shadow-lg`}>
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center space-x-4">
                                                    <div className={`w-12 h-12 ${subjectInfo.badge} rounded-xl flex items-center justify-center`}>
                                                        <span className="text-2xl">
                                                            {subjectId === 1 ? '🔢' :
                                                                subjectId === 2 ? '🌍' :
                                                                    subjectId === 3 ? '📖' :
                                                                        subjectId === 4 ? '📜' :
                                                                            subjectId === 5 ? '🔤' :
                                                                                subjectId === 6 ? '⚛️' :
                                                                                    subjectId === 7 ? '🧪' :
                                                                                        subjectId === 8 ? '🧬' :
                                                                                            subjectId === 9 ? '🔬' : '📚'}
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <h2 className="text-2xl font-bold text-white">
                                                            {subjectInfo.name}
                                                        </h2>
                                                        <p className="text-white/80 text-sm">
                                                            {exams.length} đề thi TSA
                                                        </p>
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={() => setSelectedSubject(subjectId)}
                                                    className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg font-medium transition-all backdrop-blur-sm"
                                                >
                                                    Xem tất cả →
                                                </button>
                                            </div>
                                        </div>

                                        {/* Exams Grid */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                            {exams.map((exam) => (
                                                <ExamCard
                                                    key={exam.id}
                                                    exam={exam}
                                                    startExam={startExam}
                                                    user={user}
                                                    getDifficultyColor={getDifficultyColor}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        // Show single subject
                        <div className="space-y-6">
                            {/* Subject Header */}
                            {(() => {
                                const subjectInfo = getSubjectInfo(selectedSubject);
                                return (
                                    <div className={`bg-gradient-to-r ${subjectInfo.gradient} rounded-2xl p-6 shadow-lg`}>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-4">
                                                <div className={`w-12 h-12 ${subjectInfo.badge} rounded-xl flex items-center justify-center`}>
                                                    <span className="text-2xl">
                                                        {selectedSubject === 1 ? '🔢' :
                                                            selectedSubject === 2 ? '🌍' :
                                                                selectedSubject === 3 ? '📖' :
                                                                    selectedSubject === 4 ? '📜' :
                                                                        selectedSubject === 5 ? '🔤' :
                                                                            selectedSubject === 6 ? '⚛️' :
                                                                                selectedSubject === 7 ? '🧪' :
                                                                                    selectedSubject === 8 ? '🧬' :
                                                                                        selectedSubject === 9 ? '🔬' : '📚'}
                                                    </span>
                                                </div>
                                                <div>
                                                    <h2 className="text-2xl font-bold text-white">
                                                        {subjectInfo.name}
                                                    </h2>
                                                    <p className="text-white/80 text-sm">
                                                        {filteredExams.length} đề thi TSA
                                                    </p>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => setSelectedSubject("all")}
                                                className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg font-medium transition-all backdrop-blur-sm"
                                            >
                                                ← Tất cả môn
                                            </button>
                                        </div>
                                    </div>
                                );
                            })()}

                            {/* Exams Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {filteredExams.map((exam) => (
                                    <ExamCard
                                        key={exam.id}
                                        exam={exam}
                                        startExam={startExam}
                                        user={user}
                                        getDifficultyColor={getDifficultyColor}
                                    />
                                ))}
                            </div>
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
