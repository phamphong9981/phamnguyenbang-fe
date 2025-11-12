'use client';

import Header from '@/components/Header';
import LeaderboardModal from '@/components/LeaderboardModal';
import { useState } from 'react';
import Link from 'next/link';
import { useExamSets, ExamSetType, ExamSetStatus } from '@/hooks/useExam';
import { useAuth } from '@/hooks/useAuth';
import { PRIZE_CONFIG } from '@/lib/prizes';
import { Prize } from '@/components/LuckyWheel';

export default function BaiTapChuongPage() {
    const [showLeaderboard, setShowLeaderboard] = useState(false);
    const { user } = useAuth();

    // Calculate grade from yearOfBirth
    const getGradeFromYearOfBirth = (yearOfBirth: string): number => {
        // Calculate grade based on age
        if (yearOfBirth === '2008') return 12; // 18+ years old = Grade 12
        if (yearOfBirth === '2009') return 11; // 17 years old = Grade 11
        if (yearOfBirth === '2010') return 10; // 16 years old = Grade 10
        return 10; // Default to Grade 10
    };

    // Get user's grade
    const userGrade = user?.yearOfBirth ? getGradeFromYearOfBirth(user.yearOfBirth) : 10;
    const selectedGrade = `LỚP ${userGrade}`;

    // Fetch chapter exam sets from API with user's grade
    const { data: examSets } = useExamSets(ExamSetType.CHAPTER, userGrade, user?.id);

    // Placeholder data structure - examSets chỉ có basic info, không có examQuestions
    const currentGradeData = {
        chapters: examSets ? examSets.map(exam => ({
            stt: parseInt(exam.id),
            name: exam.name,
            description: exam.description,
            exercises: [{
                name: exam.description,
                link: `/thi-hsa-tsa/lam-bai?examId=${exam.id}`
            }]
        })) : []
    };

    const gradeStats = {
        totalChapters: currentGradeData.chapters.length,
        totalExercises: currentGradeData.chapters.reduce((total, ch) => total + ch.exercises.length, 0),
        availableExercises: currentGradeData.chapters.reduce((total, ch) => total + ch.exercises.length, 0),
        completionRate: currentGradeData.chapters.length > 0 ?
            Math.round((currentGradeData.chapters.reduce((total, ch) => total + ch.exercises.length, 0) / currentGradeData.chapters.length) * 100) : 0
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />

            {/* Hero Section */}
            <section className="bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 py-16 relative overflow-hidden">
                <div className="absolute inset-0 bg-black/10"></div>
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
                        📚 Bài tập chương
                    </h1>
                    <p className="text-xl text-blue-100 max-w-3xl mx-auto">
                        Luyện tập theo từng chương học với bài tập được phân loại chi tiết,
                        giúp bạn củng cố kiến thức một cách có hệ thống.
                    </p>
                </div>
            </section>

            {/* Grade Display */}
            <section className="py-8 bg-white border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="flex items-center space-x-4">
                            <h2 className="text-2xl font-bold text-gray-900">Bài tập chương</h2>
                            <div className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold text-sm shadow-lg">
                                {selectedGrade}
                            </div>
                        </div>
                        <button
                            onClick={() => setShowLeaderboard(!showLeaderboard)}
                            className="px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-200 bg-gradient-to-r from-yellow-500 to-orange-500 text-white hover:from-yellow-600 hover:to-orange-600 shadow-lg flex items-center space-x-2"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                            <span>Bảng xếp hạng</span>
                        </button>
                    </div>
                </div>
            </section>

            {/* Leaderboard Modal */}
            <LeaderboardModal
                isOpen={showLeaderboard}
                onClose={() => setShowLeaderboard(false)}
                className={user?.classname || "12s"}
            />

            {/* Chapters List */}
            <section className="py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* <div className="mb-8">
                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-4">
                                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-bold text-gray-900">{selectedGrade}</h3>
                                        <p className="text-blue-600">Danh sách chương học và bài tập</p>
                                        {user?.classname && (
                                            <p className="text-sm text-gray-500 mt-1">Lớp: {user.classname}</p>
                                        )}
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-2xl font-bold text-blue-600">{currentGradeData.chapters.length}</div>
                                    <div className="text-sm text-blue-600">Chương</div>
                                </div>
                            </div>
                        </div>
                    </div> */}

                    {/* Chapters Table */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-gradient-to-r from-gray-50 to-gray-100">
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                            STT
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                            Chương
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                            Đề bài
                                        </th>
                                        <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                            Điểm
                                        </th>
                                        <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                            Deadline
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {currentGradeData.chapters.map((chapter, index) => (
                                        <tr key={index} className="hover:bg-blue-50/50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                                    <span className="text-sm font-bold text-blue-600">{index + 1}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center space-x-3">
                                                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                                                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                                        </svg>
                                                    </div>
                                                    <div>
                                                        <h6 className="text-sm font-semibold text-gray-900 leading-tight">
                                                            {chapter.name}
                                                        </h6>
                                                        {/* {chapter.description && (
                                                            <p className="text-xs text-gray-500 mt-1">
                                                                {chapter.description}
                                                            </p>
                                                        )} */}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                {chapter.exercises.length > 0 ? (
                                                    <div className="space-y-2">
                                                        {chapter.exercises.map((exercise, exerciseIndex) => {
                                                            const examId = exercise.link.split('examId=')[1];
                                                            const exam = examSets?.find(exam => exam.id === examId);
                                                            const isCompleted = user && exam?.userStatus?.isCompleted;
                                                            const isExpired = exam?.status === ExamSetStatus.EXPIRED;

                                                            return (
                                                                <div key={exerciseIndex} className="relative">
                                                                    {isCompleted ? (
                                                                        <div className="flex flex-col space-y-2">
                                                                            <Link
                                                                                href={`/thi-hsa-tsa/ket-qua?examId=${examId}`}
                                                                                className="inline-flex items-center px-3 py-1 rounded-lg text-sm font-medium bg-green-100 text-green-700 hover:bg-green-200 transition-colors"
                                                                            >
                                                                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                                                </svg>
                                                                                Xem chi tiết
                                                                            </Link>
                                                                        </div>
                                                                    ) : isExpired ? (
                                                                        <div className="flex flex-col space-y-2">
                                                                            <span className="inline-flex items-center px-3 py-1 rounded-lg text-sm font-medium bg-red-100 text-red-700">
                                                                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                                                </svg>
                                                                                Đã hết hạn
                                                                            </span>
                                                                        </div>
                                                                    ) : (
                                                                        <Link
                                                                            href={exercise.link}
                                                                            className="inline-flex items-center px-3 py-1 rounded-lg text-sm font-medium bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors"
                                                                        >
                                                                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                                            </svg>
                                                                            {exercise.name}
                                                                        </Link>
                                                                    )}
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                ) : (
                                                    <span className="text-sm text-gray-400 italic">Chưa có bài tập</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                {chapter.exercises.length > 0 ? (
                                                    user && examSets?.find(exam => exam.id === chapter.exercises[0]?.link.split('examId=')[1])?.userStatus?.isCompleted ? (
                                                        <div className="text-center">
                                                            <div className="text-lg font-bold text-green-600">
                                                                {examSets.find(exam => exam.id === chapter.exercises[0]?.link.split('examId=')[1])?.userStatus?.score || 0}%
                                                            </div>
                                                            <div className="text-xs text-gray-500">
                                                                {examSets.find(exam => exam.id === chapter.exercises[0]?.link.split('examId=')[1])?.userStatus?.totalPoints || 0} điểm
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                            <div className="w-2 h-2 bg-blue-500 rounded-full mr-1"></div>
                                                            Chưa làm
                                                        </span>
                                                    )
                                                ) : (
                                                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                                                        <div className="w-2 h-2 bg-gray-400 rounded-full mr-1"></div>
                                                        Sắp có
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                {chapter.exercises.length > 0 ? (
                                                    (() => {
                                                        const examId = chapter.exercises[0]?.link.split('examId=')[1];
                                                        const exam = examSets?.find(exam => exam.id === examId);
                                                        if (exam?.deadline) {
                                                            const deadlineDate = new Date(exam.deadline);
                                                            const now = new Date();
                                                            const isPastDeadline = deadlineDate < now;
                                                            return (
                                                                <div className="flex flex-col items-center">
                                                                    <div className={`text-sm font-medium ${isPastDeadline ? 'text-red-600' : 'text-gray-700'}`}>
                                                                        {deadlineDate.toLocaleDateString('vi-VN', {
                                                                            day: '2-digit',
                                                                            month: '2-digit',
                                                                            year: 'numeric'
                                                                        })}
                                                                    </div>
                                                                    <div className="text-xs text-gray-500">
                                                                        {deadlineDate.toLocaleTimeString('vi-VN', {
                                                                            hour: '2-digit',
                                                                            minute: '2-digit'
                                                                        })}
                                                                    </div>
                                                                    {isPastDeadline && (
                                                                        <span className="mt-1 px-2 py-0.5 bg-red-100 text-red-700 rounded text-xs font-medium">
                                                                            Đã hết hạn
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            );
                                                        }
                                                        return (
                                                            <span className="text-sm text-gray-400 italic">
                                                                Không có
                                                            </span>
                                                        );
                                                    })()
                                                ) : (
                                                    <span className="text-sm text-gray-400 italic">
                                                        -
                                                    </span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Summary Stats */}
                    <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-6">
                        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Tổng chương</p>
                                    <p className="text-2xl font-bold text-gray-900">{gradeStats?.totalChapters || 0}</p>
                                </div>
                                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-2xl font-bold text-green-600">
                                        {examSets?.filter(exam => exam.userStatus?.isCompleted).length || 0}
                                    </p>
                                </div>
                                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 0118 0z" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Tổng bài tập</p>
                                    <p className="text-2xl font-bold text-purple-600">
                                        {gradeStats?.totalExercises || 0}
                                    </p>
                                </div>
                                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Tỷ lệ hoàn thành</p>
                                    <p className="text-2xl font-bold text-orange-600">
                                        {gradeStats?.completionRate || 0}%
                                    </p>
                                </div>
                                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                                    <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Call to Action */}
            <section className="bg-gradient-to-r from-blue-600 to-indigo-700 py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl font-bold text-white mb-4">
                        Sẵn sàng luyện tập?
                    </h2>
                    <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
                        Chọn chương bạn muốn ôn tập và bắt đầu làm bài tập ngay hôm nay!
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            href="/khoa-hoc"
                            className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-3 rounded-xl font-semibold transition-colors"
                        >
                            Xem video lý thuyết
                        </Link>
                        <Link
                            href="/thi-hsa-tsa"
                            className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-3 rounded-xl font-semibold transition-colors"
                        >
                            Thi thử HSA
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
