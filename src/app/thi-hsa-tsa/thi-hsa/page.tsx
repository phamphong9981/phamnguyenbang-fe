'use client';

import Header from '@/components/Header';
import { useState } from 'react';
import { useExamSets, ExamSetType, SUBJECT_ID } from '@/hooks/useExam';
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';

export default function ExamPage() {
    const [selectedYear, setSelectedYear] = useState("2025");
    const [selectedDifficulty, setSelectedDifficulty] = useState("all");
    const { user } = useAuth();

    // Fetch exam sets from API
    const { data: examSets, isLoading, error } = useExamSets(ExamSetType.HSA, undefined, user?.id);

    const difficulties = ["all", "Dễ", "Trung bình", "Khó", "Rất khó"];

    // Get unique years from exam sets
    const years = examSets ? [...new Set(examSets.map(exam => exam.year))] : [];

    // Filter exams by year and difficulty
    const filteredExams = examSets ? examSets.filter(exam => {
        if (selectedYear !== "all" && exam.year !== selectedYear) return false;
        if (selectedDifficulty !== "all" && exam.difficulty !== selectedDifficulty) return false;
        return true;
    }) : [];

    const getSubjectInfo = (subjectId: number) => {
        switch (subjectId) {
            case SUBJECT_ID.MATH:
                return { name: 'Toán học', color: 'blue', bgColor: 'bg-blue-500', textColor: 'text-blue-600', bgLight: 'bg-blue-50', borderColor: 'border-blue-200' };
            case SUBJECT_ID.GEOGRAPHY:
                return { name: 'Địa lý', color: 'green', bgColor: 'bg-green-500', textColor: 'text-green-600', bgLight: 'bg-green-50', borderColor: 'border-green-200' };
            case SUBJECT_ID.LITERATURE:
                return { name: 'Văn học', color: 'purple', bgColor: 'bg-purple-500', textColor: 'text-purple-600', bgLight: 'bg-purple-50', borderColor: 'border-purple-200' };
            case SUBJECT_ID.HISTORY:
                return { name: 'Lịch sử', color: 'orange', bgColor: 'bg-orange-500', textColor: 'text-orange-600', bgLight: 'bg-orange-50', borderColor: 'border-orange-200' };
            case SUBJECT_ID.ENGLISH:
                return { name: 'Tiếng Anh', color: 'indigo', bgColor: 'bg-indigo-500', textColor: 'text-indigo-600', bgLight: 'bg-indigo-50', borderColor: 'border-indigo-200' };
            case SUBJECT_ID.PHYSICS:
                return { name: 'Vật lý', color: 'red', bgColor: 'bg-red-500', textColor: 'text-red-600', bgLight: 'bg-red-50', borderColor: 'border-red-200' };
            case SUBJECT_ID.CHEMISTRY:
                return { name: 'Hóa học', color: 'yellow', bgColor: 'bg-yellow-500', textColor: 'text-yellow-600', bgLight: 'bg-yellow-50', borderColor: 'border-yellow-200' };
            case SUBJECT_ID.BIOLOGY:
                return { name: 'Sinh học', color: 'emerald', bgColor: 'bg-emerald-500', textColor: 'text-emerald-600', bgLight: 'bg-emerald-50', borderColor: 'border-emerald-200' };
            default:
                return { name: 'Khác', color: 'gray', bgColor: 'bg-gray-500', textColor: 'text-gray-600', bgLight: 'bg-gray-50', borderColor: 'border-gray-200' };
        }
    };
    // Group exams by subject
    const groupedExams = filteredExams.reduce((groups, exam) => {
        const subjectInfo = getSubjectInfo(exam.subject);
        const subjectName = subjectInfo.name;

        if (!groups[subjectName]) {
            groups[subjectName] = {
                subjectInfo,
                exams: []
            };
        }
        groups[subjectName].exams.push(exam);
        return groups;
    }, {} as Record<string, { subjectInfo: any; exams: any[] }>);

    const getDifficultyColor = (difficulty: string) => {
        switch (difficulty) {
            case "Dễ": return "bg-green-100 text-green-800";
            case "Trung bình": return "bg-yellow-100 text-yellow-800";
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

            {/* Loading and Error States */}
            {isLoading && (
                <div className="flex items-center justify-center min-h-[400px]">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
                        <p className="text-gray-600">Đang tải đề thi...</p>
                    </div>
                </div>
            )}

            {error && (
                <div className="flex items-center justify-center min-h-[400px]">
                    <div className="text-center">
                        <div className="text-red-600 text-6xl mb-4">❌</div>
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">Lỗi tải đề thi</h1>
                        <p className="text-gray-600 mb-4">Không thể tải đề thi. Vui lòng thử lại.</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                        >
                            Thử lại
                        </button>
                    </div>
                </div>
            )}

            {/* Main Content - Show when loaded */}
            {!isLoading && !error && (
                <>
                    {/* Hero Section */}
                    <section className="bg-gradient-to-r from-green-600 to-green-700 py-16">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
                                Thi HSA
                            </h1>
                            <p className="text-xl text-green-100 max-w-3xl mx-auto">
                                Luyện thi với đề thi thử chất lượng cao, giúp bạn chuẩn bị tốt nhất
                                cho kỳ thi HSA sắp tới với câu hỏi toán học đa dạng.
                            </p>
                        </div>
                    </section>

                    {/* Exams List */}
                    <section className="py-16">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            {Object.keys(groupedExams).length === 0 ? (
                                <div className="text-center py-12">
                                    <div className="text-gray-400 text-6xl mb-4">📝</div>
                                    <h3 className="text-xl font-semibold text-gray-600 mb-2">
                                        Không tìm thấy đề thi
                                    </h3>
                                    <p className="text-gray-500">
                                        Hãy thử thay đổi bộ lọc để tìm đề thi phù hợp.
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-12">
                                    {Object.entries(groupedExams).map(([subjectName, { subjectInfo, exams }]) => (
                                        <div key={subjectName} className="space-y-6">
                                            {/* Subject Header */}
                                            <div className="flex items-center space-x-4">
                                                <div className={`w-4 h-4 rounded-full ${subjectInfo.bgColor}`}></div>
                                                <h2 className={`text-2xl font-bold ${subjectInfo.textColor}`}>
                                                    {subjectName}
                                                </h2>
                                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${subjectInfo.bgLight} ${subjectInfo.textColor} border ${subjectInfo.borderColor}`}>
                                                    {exams.length} đề thi
                                                </span>
                                            </div>

                                            {/* Exams Grid */}
                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                                {exams.map((exam) => (
                                                    <div key={exam.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-100">
                                                        {/* Header with subject color */}
                                                        <div className={`bg-gradient-to-r ${subjectInfo.bgColor} to-${subjectInfo.color}-600 px-6 py-4 h-[20%]`}>
                                                            <div className="flex items-center justify-between">
                                                                <div className="flex items-center space-x-3">
                                                                    <div>
                                                                        <h3 className="text-lg font-bold text-white leading-tight">
                                                                            {exam.name}
                                                                        </h3>
                                                                        <p className="text-white text-sm opacity-90">{subjectName}</p>
                                                                    </div>
                                                                </div>
                                                                <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getDifficultyColor(exam.difficulty)}`}>
                                                                    {getSubjectInfo(exam.subject).name}
                                                                </span>
                                                            </div>
                                                        </div>

                                                        {/* Content */}
                                                        <div className="p-6 h-[80%] flex flex-col justify-between">
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
                                                                className={`mb-2 w-full py-3 px-4 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg ${user && exam.userStatus?.isCompleted
                                                                    ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                                                                    : `bg-gradient-to-r ${subjectInfo.bgColor} to-${subjectInfo.color}-600 hover:from-${subjectInfo.color}-700 hover:to-${subjectInfo.color}-800 text-white`
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
                                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.293l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" />
                                                                            </svg>
                                                                            <span>Bắt đầu làm bài</span>
                                                                        </>
                                                                    )}
                                                                </div>
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </section>

                    {/* Stats Section */}
                    <section className="bg-green-600 py-16">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
                                <div>
                                    <div className="text-4xl font-bold text-white mb-2">1</div>
                                    <div className="text-green-100">Đề thi</div>
                                </div>
                                <div>
                                    <div className="text-4xl font-bold text-white mb-2">1</div>
                                    <div className="text-green-100">Loại thi</div>
                                </div>
                                <div>
                                    <div className="text-4xl font-bold text-white mb-2">100</div>
                                    <div className="text-green-100">Câu hỏi</div>
                                </div>
                                <div>
                                    <div className="text-4xl font-bold text-white mb-2">100%</div>
                                    <div className="text-green-100">Miễn phí</div>
                                </div>
                            </div>
                        </div>
                    </section>
                </>
            )}
        </div>
    );
} 