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
        <section className="py-20 bg-gradient-to-b from-slate-50 via-emerald-50/30 to-white relative overflow-hidden">
            {/* Decorative background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 -left-20 w-96 h-96 bg-emerald-200/20 rounded-full blur-3xl"></div>
                <div className="absolute bottom-20 -right-20 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-emerald-100/10 rounded-full blur-3xl"></div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center mb-12">
                    {/* Badge */}
                    <div className="inline-block mb-4">
                        <div className="flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-yellow-100 to-orange-100 rounded-full border border-yellow-200 shadow-sm">
                            <svg className="w-5 h-5 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                            </svg>
                            <span className="text-sm font-semibold text-yellow-700">Top học sinh xuất sắc</span>
                        </div>
                    </div>

                    <h2 className="text-4xl sm:text-5xl font-bold mb-4">
                        <span className="bg-gradient-to-r from-emerald-600 via-blue-600 to-emerald-600 bg-clip-text text-transparent">
                            Bảng Xếp Hạng Học Tập
                        </span>
                    </h2>
                    <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
                        Vinh danh những học sinh có thành tích xuất sắc nhất
                    </p>
                </div>

                {/* Grade Tabs */}
                <div className="flex justify-center mb-12">
                    <div className="bg-white/80 backdrop-blur-sm p-2 rounded-2xl shadow-xl inline-flex flex-wrap gap-2 border border-emerald-200/50">
                        {[
                            { type: LeaderboardType.GRADE_12, label: 'Khối 12', icon: '🎓' },
                            { type: LeaderboardType.GRADE_11, label: 'Khối 11', icon: '📚' },
                            { type: LeaderboardType.GRADE_10, label: 'Khối 10', icon: '📖' },
                            { type: LeaderboardType.HSA, label: 'HSA', icon: '🏆' },
                            { type: LeaderboardType.TSA, label: 'TSA', icon: '⭐' },
                        ].map((tab) => (
                            <button
                                key={tab.type}
                                onClick={() => setSelectedGrade(tab.type)}
                                className={`group relative px-5 py-3 rounded-xl text-sm sm:text-base font-bold transition-all duration-300 ${
                                    selectedGrade === tab.type
                                        ? 'bg-gradient-to-r from-emerald-600 to-blue-600 text-white shadow-lg transform scale-105'
                                        : 'text-gray-600 hover:text-emerald-600 hover:bg-emerald-50'
                                }`}
                            >
                                {selectedGrade === tab.type && (
                                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 to-blue-400 rounded-xl blur-md opacity-50"></div>
                                )}
                                <span className="relative flex items-center gap-2">
                                    <span className="text-lg">{tab.icon}</span>
                                    {tab.label}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Leaderboard Content */}
                <div className="max-w-6xl mx-auto">
                    {isLoading ? (
                        <div className="flex flex-col justify-center items-center py-20">
                            <div className="relative">
                                <div className="animate-spin rounded-full h-16 w-16 border-4 border-emerald-200"></div>
                                <div className="animate-spin rounded-full h-16 w-16 border-4 border-t-emerald-600 absolute top-0"></div>
                            </div>
                            <p className="mt-4 text-gray-600 font-medium">Đang tải bảng xếp hạng...</p>
                        </div>
                    ) : leaderboardData?.entries && leaderboardData.entries.length > 0 ? (
                        <div className="space-y-8">
                            {/* Top 3 Podium */}
                            {leaderboardData.entries.length >= 3 && (
                                <div className="relative">
                                    {/* Decorative elements */}
                                    <div className="absolute inset-0 bg-gradient-to-b from-yellow-100/50 to-transparent rounded-3xl blur-xl"></div>
                                    
                                    <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-yellow-200/50 p-8 overflow-hidden">
                                        {/* Crown decoration */}
                                        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
                                            <div className="text-6xl animate-bounce">👑</div>
                                        </div>

                                        <div className="grid grid-cols-3 gap-4 sm:gap-6 items-end pt-8">
                                            {/* 2nd Place */}
                                            <div className="flex flex-col items-center">
                                                <div className="relative group mb-4">
                                                    <div className="absolute inset-0 bg-gradient-to-br from-gray-300 to-gray-500 rounded-2xl blur-md opacity-50 group-hover:opacity-75 transition-opacity"></div>
                                                    <div className="relative bg-gradient-to-br from-gray-200 to-gray-400 rounded-2xl p-4 sm:p-6 shadow-xl transform group-hover:scale-105 transition-transform duration-300">
                                                        <div className="text-4xl sm:text-6xl mb-2">🥈</div>
                                                        <div className="text-white font-bold text-xl sm:text-3xl">2</div>
                                                    </div>
                                                </div>
                                                <div className="text-center w-full">
                                                    <p className="font-bold text-sm sm:text-lg text-gray-800 truncate px-2">{leaderboardData.entries[1].fullname}</p>
                                                    <p className="text-xs sm:text-sm text-gray-600 mt-1">{leaderboardData.entries[1].class || 'N/A'}</p>
                                                    <div className="mt-2 bg-gradient-to-r from-gray-100 to-gray-200 rounded-lg px-3 py-2">
                                                        <p className="text-lg sm:text-xl font-bold text-gray-700">{leaderboardData.entries[1].totalPoints.toLocaleString()}</p>
                                                        <p className="text-xs text-gray-500">điểm</p>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* 1st Place */}
                                            <div className="flex flex-col items-center -mt-8">
                                                <div className="relative group mb-4">
                                                    <div className="absolute inset-0 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-3xl blur-lg opacity-60 group-hover:opacity-90 transition-opacity animate-pulse"></div>
                                                    <div className="relative bg-gradient-to-br from-yellow-400 via-yellow-500 to-orange-500 rounded-3xl p-6 sm:p-8 shadow-2xl transform group-hover:scale-105 transition-transform duration-300">
                                                        <div className="text-5xl sm:text-7xl mb-2">🥇</div>
                                                        <div className="text-white font-bold text-2xl sm:text-4xl">1</div>
                                                    </div>
                                                </div>
                                                <div className="text-center w-full">
                                                    <p className="font-bold text-base sm:text-xl text-gray-900 truncate px-2">{leaderboardData.entries[0].fullname}</p>
                                                    <p className="text-xs sm:text-sm text-gray-600 mt-1">{leaderboardData.entries[0].class || 'N/A'}</p>
                                                    <div className="mt-2 bg-gradient-to-r from-yellow-100 to-orange-100 rounded-lg px-4 py-2 border-2 border-yellow-300">
                                                        <p className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">{leaderboardData.entries[0].totalPoints.toLocaleString()}</p>
                                                        <p className="text-xs text-yellow-700 font-semibold">điểm</p>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* 3rd Place */}
                                            <div className="flex flex-col items-center">
                                                <div className="relative group mb-4">
                                                    <div className="absolute inset-0 bg-gradient-to-br from-orange-300 to-orange-500 rounded-2xl blur-md opacity-50 group-hover:opacity-75 transition-opacity"></div>
                                                    <div className="relative bg-gradient-to-br from-orange-300 to-orange-500 rounded-2xl p-4 sm:p-6 shadow-xl transform group-hover:scale-105 transition-transform duration-300">
                                                        <div className="text-4xl sm:text-6xl mb-2">🥉</div>
                                                        <div className="text-white font-bold text-xl sm:text-3xl">3</div>
                                                    </div>
                                                </div>
                                                <div className="text-center w-full">
                                                    <p className="font-bold text-sm sm:text-lg text-gray-800 truncate px-2">{leaderboardData.entries[2].fullname}</p>
                                                    <p className="text-xs sm:text-sm text-gray-600 mt-1">{leaderboardData.entries[2].class || 'N/A'}</p>
                                                    <div className="mt-2 bg-gradient-to-r from-orange-100 to-orange-200 rounded-lg px-3 py-2">
                                                        <p className="text-lg sm:text-xl font-bold text-orange-700">{leaderboardData.entries[2].totalPoints.toLocaleString()}</p>
                                                        <p className="text-xs text-orange-500">điểm</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Rest of Rankings */}
                            {leaderboardData.entries.length > 3 && (
                                <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
                                    {/* Header */}
                                    <div className="bg-gradient-to-r from-emerald-600 to-blue-600 px-6 py-4">
                                        <h3 className="text-white font-bold text-lg sm:text-xl flex items-center gap-2">
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                                            </svg>
                                            Bảng xếp hạng chi tiết
                                        </h3>
                                    </div>

                                    {/* List */}
                                    <div className="divide-y divide-gray-100">
                                        {leaderboardData.entries.slice(3, 20).map((student, index) => (
                                            <div
                                                key={student.profileId}
                                                className="group px-6 py-4 hover:bg-gradient-to-r hover:from-emerald-50 hover:to-blue-50 transition-all duration-300"
                                            >
                                                <div className="flex items-center gap-4">
                                                    {/* Rank */}
                                                    <div className="flex-shrink-0">
                                                        <div className="w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 border-2 border-gray-300 font-bold text-gray-700 text-lg group-hover:scale-110 transition-transform">
                                                            #{index + 4}
                                                        </div>
                                                    </div>

                                                    {/* Info */}
                                                    <div className="flex-1 min-w-0">
                                                        <p className="font-bold text-gray-800 text-base sm:text-lg truncate group-hover:text-emerald-700 transition-colors">
                                                            {student.fullname}
                                                        </p>
                                                        <div className="flex items-center gap-2 mt-1">
                                                            <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs sm:text-sm font-medium">
                                                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                                                </svg>
                                                                {student.class || 'N/A'}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    {/* Score */}
                                                    <div className="flex-shrink-0 text-right">
                                                        <div className="bg-gradient-to-br from-emerald-50 to-blue-50 rounded-xl px-4 py-2 border border-emerald-200 group-hover:border-emerald-400 transition-colors">
                                                            <p className="font-bold text-emerald-700 text-lg sm:text-xl">
                                                                {student.totalPoints.toLocaleString()}
                                                            </p>
                                                            <p className="text-xs text-gray-600">điểm</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="text-center py-20 bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-gray-200">
                            <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <p className="text-gray-600 text-xl font-semibold mb-2">Chưa có dữ liệu xếp hạng</p>
                            <p className="text-gray-500">Dữ liệu sẽ được cập nhật sớm nhất có thể</p>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}

