'use client';

import { useState } from 'react';
import { useLeaderboard, LeaderboardType } from '@/hooks/useLeaderboard';

export default function HomeLeaderboard() {
    const [selectedGrade, setSelectedGrade] = useState<LeaderboardType>(LeaderboardType.GRADE_12);
    const { data: leaderboardData, isLoading } = useLeaderboard(selectedGrade);

    const getRankColor = (rank: number) => {
        switch (rank) {
            case 1: return 'bg-yellow-100 text-yellow-700 border-yellow-300';
            case 2: return 'bg-gray-100 text-gray-700 border-gray-300';
            case 3: return 'bg-orange-100 text-orange-700 border-orange-300';
            default: return 'bg-white text-gray-600 border-gray-100';
        }
    };

    const getRankIcon = (rank: number) => {
        switch (rank) {
            case 1: return '🥇';
            case 2: return '🥈';
            case 3: return '🥉';
            default: return `#${rank}`;
        }
    };

    return (
        <section className="py-12 bg-gradient-to-b from-emerald-50 to-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-10">
                    <h2 className="text-3xl sm:text-4xl font-bold text-emerald-800 mb-4">
                        Bảng Xếp Hạng Học Tập
                    </h2>
                    <p className="text-lg text-emerald-600">
                        Vinh danh những học sinh có thành tích xuất sắc nhất
                    </p>
                </div>

                {/* Grade Tabs */}
                <div className="flex justify-center mb-8">
                    <div className="bg-white p-1.5 rounded-full shadow-md inline-flex border border-emerald-100">
                        {[
                            { type: LeaderboardType.GRADE_12, label: 'Khối 12' },
                            { type: LeaderboardType.GRADE_11, label: 'Khối 11' },
                            { type: LeaderboardType.GRADE_10, label: 'Khối 10' },
                        ].map((tab) => (
                            <button
                                key={tab.type}
                                onClick={() => setSelectedGrade(tab.type)}
                                className={`px-6 py-2 rounded-full text-sm sm:text-base font-semibold transition-all duration-300 ${
                                    selectedGrade === tab.type
                                        ? 'bg-emerald-600 text-white shadow-lg transform scale-105'
                                        : 'text-gray-500 hover:text-emerald-600 hover:bg-emerald-50'
                                }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Leaderboard Content */}
                <div className="max-w-4xl mx-auto">
                    {isLoading ? (
                        <div className="flex justify-center items-center py-20">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-600"></div>
                        </div>
                    ) : leaderboardData?.entries && leaderboardData.entries.length > 0 ? (
                        <div className="bg-white rounded-2xl shadow-xl border border-emerald-100 overflow-hidden">
                            {/* Header */}
                            <div className="grid grid-cols-12 gap-4 p-4 bg-emerald-600 text-white font-bold text-sm sm:text-base">
                                <div className="col-span-2 sm:col-span-2 text-center">Hạng</div>
                                <div className="col-span-6 sm:col-span-5">Họ và tên</div>
                                <div className="col-span-4 sm:col-span-2 text-center">Lớp</div>
                                <div className="hidden sm:block sm:col-span-3 text-right pr-4">Tổng điểm</div>
                                <div className="sm:hidden col-span-12 text-right pr-2 pt-2 border-t border-emerald-500 mt-2 text-yellow-300">
                                    Điểm số
                                </div>
                            </div>

                            {/* List */}
                            <div className="divide-y divide-gray-100">
                                {leaderboardData.entries.slice(0, 10).map((student, index) => (
                                    <div 
                                        key={student.profileId} 
                                        className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-emerald-50 transition-colors duration-200"
                                    >
                                        {/* Rank */}
                                        <div className="col-span-2 sm:col-span-2 flex justify-center">
                                            <div className={`w-10 h-10 flex items-center justify-center rounded-full font-bold border-2 ${getRankColor(index + 1)}`}>
                                                {getRankIcon(index + 1)}
                                            </div>
                                        </div>

                                        {/* Name */}
                                        <div className="col-span-6 sm:col-span-5 font-semibold text-gray-800 truncate">
                                            {student.fullname}
                                        </div>

                                        {/* Class */}
                                        <div className="col-span-4 sm:col-span-2 text-center">
                                            <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs sm:text-sm font-medium">
                                                {student.class || 'N/A'}
                                            </span>
                                        </div>

                                        {/* Score (Desktop) */}
                                        <div className="hidden sm:block sm:col-span-3 text-right pr-4 font-bold text-emerald-600 text-lg">
                                            {student.totalPoints.toLocaleString()}
                                        </div>

                                        {/* Score (Mobile) */}
                                        <div className="sm:hidden col-span-12 text-right pr-2 font-bold text-emerald-600">
                                            {student.totalPoints.toLocaleString()} điểm
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-16 bg-white rounded-2xl shadow-lg border border-gray-100">
                            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-10 h-10 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <p className="text-gray-500 text-lg">Chưa có dữ liệu xếp hạng cho khối này</p>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}

