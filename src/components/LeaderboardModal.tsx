'use client';

import { useLeaderboard } from '@/hooks/useExam';

interface LeaderboardModalProps {
    isOpen: boolean;
    onClose: () => void;
    className?: string;
}

export default function LeaderboardModal({ isOpen, onClose, className }: LeaderboardModalProps) {
    // Fetch leaderboard data for user's class
    const { data: leaderboardData } = useLeaderboard(className || "12s");

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 p-6 text-white">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 bg-white bg-opacity-30 rounded-xl flex items-center justify-center shadow-lg">
                                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold">Bảng xếp hạng lớp {className || '12s'}</h3>
                                <p className="text-yellow-100">
                                    {leaderboardData ? `${leaderboardData.totalStudents} học sinh` : 'Đang tải...'}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="w-10 h-10 bg-white bg-opacity-30 rounded-xl flex items-center justify-center hover:bg-opacity-40 transition-colors shadow-lg"
                        >
                            <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>

                <div className="p-6 max-h-[70vh] overflow-y-auto">
                    {leaderboardData ? (
                        <div className="space-y-6">
                            {/* Top 3 Podium */}
                            {leaderboardData.entries.length >= 3 && (
                                <div className="flex justify-center items-end space-x-8 mb-12">
                                    {/* 2nd Place */}
                                    {leaderboardData.entries[1] && (
                                        <div className="flex flex-col items-center space-y-4">
                                            <div className="relative">
                                                <div className="w-24 h-24 bg-gradient-to-br from-slate-400 to-slate-600 rounded-full flex items-center justify-center border-4 border-slate-300 shadow-xl">
                                                    <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                                    </svg>
                                                </div>
                                                <div className="absolute -top-3 -right-3 w-10 h-10 bg-gradient-to-br from-slate-500 to-slate-700 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                                                    🥈
                                                </div>
                                            </div>
                                            <div className="text-center">
                                                <h4 className="font-bold text-slate-800 text-base">{leaderboardData.entries[1].fullname}</h4>
                                                <p className="text-base font-bold text-slate-700">{leaderboardData.entries[1].totalPoints} điểm</p>
                                            </div>
                                        </div>
                                    )}

                                    {/* 1st Place */}
                                    {leaderboardData.entries[0] && (
                                        <div className="flex flex-col items-center space-y-4">
                                            <div className="relative">
                                                <div className="w-28 h-28 bg-gradient-to-br from-amber-400 to-yellow-600 rounded-full flex items-center justify-center border-4 border-amber-300 shadow-2xl">
                                                    <svg className="w-14 h-14 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                                    </svg>
                                                </div>
                                                <div className="absolute -top-3 -right-3 w-10 h-10 bg-gradient-to-br from-yellow-500 to-amber-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                                                    🥇
                                                </div>
                                            </div>
                                            <div className="text-center">
                                                <h4 className="font-bold text-amber-900 text-lg">{leaderboardData.entries[0].fullname}</h4>
                                                <p className="text-xl font-bold text-amber-600">{leaderboardData.entries[0].totalPoints} điểm</p>
                                            </div>
                                        </div>
                                    )}

                                    {/* 3rd Place */}
                                    {leaderboardData.entries[2] && (
                                        <div className="flex flex-col items-center space-y-4">
                                            <div className="relative">
                                                <div className="w-24 h-24 bg-gradient-to-br from-amber-600 to-orange-700 rounded-full flex items-center justify-center border-4 border-amber-500 shadow-xl">
                                                    <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                                    </svg>
                                                </div>
                                                <div className="absolute -top-3 -right-3 w-10 h-10 bg-gradient-to-br from-orange-600 to-amber-700 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                                                    🥉
                                                </div>
                                            </div>
                                            <div className="text-center">
                                                <h4 className="font-bold text-orange-800 text-base">{leaderboardData.entries[2].fullname}</h4>
                                                <p className="text-base font-bold text-orange-700">{leaderboardData.entries[2].totalPoints} điểm</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Rest of the list */}
                            {leaderboardData.entries.length > 3 && (
                                <div className="space-y-2">
                                    <h4 className="text-lg font-semibold text-gray-700 mb-4 text-center">Các vị trí khác</h4>
                                    {leaderboardData.entries.slice(3).map((entry, index) => (
                                        <div
                                            key={entry.profileId}
                                            className="flex items-center justify-between p-3 rounded-lg bg-gray-50 border border-gray-200 hover:bg-gray-100 transition-colors"
                                        >
                                            <div className="flex items-center space-x-3">
                                                <div className="w-8 h-8 bg-blue-400 rounded-lg flex items-center justify-center font-bold text-sm text-blue-900">
                                                    {entry.rank}
                                                </div>
                                                <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                                                    <svg className="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                                    </svg>
                                                </div>
                                                <div>
                                                    <h5 className="font-medium text-gray-900 text-sm">{entry.fullname}</h5>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-sm font-bold text-gray-900">
                                                    {entry.totalPoints} điểm
                                                </div>
                                                <div className="text-xs text-gray-600">
                                                    {entry.averageScore}% trung bình
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Show all entries if less than 3 */}
                            {leaderboardData.entries.length < 3 && (
                                <div className="space-y-2">
                                    {leaderboardData.entries.map((entry, index) => (
                                        <div
                                            key={entry.profileId}
                                            className="flex items-center justify-between p-3 rounded-lg bg-gray-50 border border-gray-200 hover:bg-gray-100 transition-colors"
                                        >
                                            <div className="flex items-center space-x-3">
                                                <div className="w-8 h-8 bg-blue-400 rounded-lg flex items-center justify-center font-bold text-sm text-blue-900">
                                                    {entry.rank}
                                                </div>
                                                <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                                                    <svg className="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                                    </svg>
                                                </div>
                                                <div>
                                                    <h5 className="font-medium text-gray-900 text-sm">{entry.fullname}</h5>
                                                    <p className="text-xs text-gray-600">{entry.class}</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-sm font-bold text-gray-900">
                                                    {entry.totalPoints} điểm
                                                </div>
                                                <div className="text-xs text-gray-600">
                                                    {entry.averageScore}% trung bình
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="flex items-center justify-center py-12">
                            <div className="text-center">
                                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                    </svg>
                                </div>
                                <p className="text-gray-500">Đang tải dữ liệu bảng xếp hạng...</p>
                            </div>
                        </div>
                    )}
                </div>

                <div className="bg-gray-50 px-6 py-4 border-t">
                    <p className="text-sm text-gray-600 text-center">
                        Cập nhật lần cuối: {leaderboardData ? new Date(leaderboardData.generatedAt).toLocaleString('vi-VN') : 'Đang tải...'}
                    </p>
                </div>
            </div>
        </div>
    );
}
