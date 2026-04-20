'use client';

import { useState } from 'react';
import { useLeaderboard, LeaderboardType } from '@/hooks/useLeaderboard';

// Hiển thị avatar hoặc chữ cái đầu tên
function LeaderboardAvatar({
    avatarUrl,
    name,
    size,
    ringClass,
    bgClass,
    textClass,
    fallback,
}: {
    avatarUrl?: string | null;
    name: string;
    size: string;          // Tailwind w-* h-*
    ringClass?: string;    // border + ring classes
    bgClass?: string;
    textClass?: string;
    fallback?: React.ReactNode; // emoji hoặc icon thay thế khi không có ảnh
}) {
    if (avatarUrl) {
        return (
            // eslint-disable-next-line @next/next/no-img-element
            <img
                src={avatarUrl}
                alt={name}
                className={`${size} rounded-full object-cover ${ringClass ?? ''}`}
            />
        );
    }
    if (fallback) {
        return (
            <div className={`${size} rounded-full ${bgClass ?? ''} ${ringClass ?? ''} flex items-center justify-center`}>
                {fallback}
            </div>
        );
    }
    return (
        <div className={`${size} rounded-full ${bgClass ?? 'bg-gradient-to-tr from-gray-100 to-gray-200'} ${ringClass ?? ''} flex items-center justify-center ${textClass ?? 'text-gray-500 font-bold'}`}>
            {name.charAt(0).toUpperCase()}
        </div>
    );
}

export default function HomeLeaderboard() {
    const [selectedGrade, setSelectedGrade] = useState<LeaderboardType>(LeaderboardType.GRADE_12);
    const { data: leaderboardData, isLoading } = useLeaderboard(selectedGrade);

    const tabs = [
        { type: LeaderboardType.GRADE_12, label: 'Khối 12' },
        { type: LeaderboardType.GRADE_11, label: 'Khối 11' },
        { type: LeaderboardType.GRADE_10, label: 'Khối 10' },
        { type: LeaderboardType.HSA, label: 'HSA' },
        { type: LeaderboardType.TSA, label: 'TSA' },
    ];

    return (
        <section className="py-24 bg-[conic-gradient(at_top_right,_var(--tw-gradient-stops))] from-green-50 via-slate-50 to-white relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-green-200 to-transparent opacity-50"></div>
            <div className="absolute -top-40 -right-40 w-96 h-96 bg-green-200/20 rounded-full blur-3xl pointer-events-none mix-blend-multiply"></div>
            <div className="absolute top-40 -left-20 w-72 h-72 bg-blue-200/20 rounded-full blur-3xl pointer-events-none mix-blend-multiply"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center mb-12">
                    <span className="inline-flex items-center justify-center px-4 py-1.5 rounded-full bg-green-500/10 text-green-700 text-xs font-bold tracking-wide uppercase mb-6 border border-green-500/20 backdrop-blur-sm">
                        <svg className="w-3.5 h-3.5 mr-1.5" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                        Thành tích nổi bật
                    </span>
                    <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6 tracking-tight">
                        Bảng Vàng <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600">Học Tập</span>
                    </h2>
                    <p className="text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed">
                        Vinh danh những học viên xuất sắc nhất. Hãy nỗ lực để tên bạn được ghi danh trên bảng vàng tuần tới!
                    </p>
                </div>

                {/* Modern Tabs */}
                <div className="flex justify-center mb-16">
                    <div className="inline-flex p-1.5 bg-gray-100/80 backdrop-blur-sm rounded-2xl border border-gray-200 shadow-inner">
                        {tabs.map((tab) => (
                            <button
                                key={tab.type}
                                onClick={() => setSelectedGrade(tab.type)}
                                className={`relative px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ease-out ${selectedGrade === tab.type
                                    ? 'text-gray-900 shadow-[0_2px_8px_rgba(0,0,0,0.08)] bg-white'
                                    : 'text-gray-500 hover:text-gray-900 hover:bg-white/50'
                                    }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Content */}
                <div className="max-w-6xl mx-auto">
                    {isLoading ? (
                        <div className="flex flex-col justify-center items-center py-32 bg-white/50 rounded-3xl border border-gray-100/50 backdrop-blur-sm">
                            <div className="relative w-16 h-16">
                                <div className="absolute top-0 left-0 w-full h-full border-4 border-gray-200 rounded-full"></div>
                                <div className="absolute top-0 left-0 w-full h-full border-4 border-green-500 rounded-full border-t-transparent animate-spin"></div>
                            </div>
                            <p className="mt-6 text-gray-400 font-medium animate-pulse">Đang tải dữ liệu...</p>
                        </div>
                    ) : leaderboardData?.entries && leaderboardData.entries.length > 0 ? (
                        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start">
                            {/* Top 3 Podium (Left side on desktop) */}
                            <div className="w-full lg:w-5/12 mx-auto lg:sticky lg:top-24">
                                <div className="grid grid-cols-2 gap-4 relative pt-12 grid-rows-2 items-end">
                                    {/* 2nd Place */}
                                    <div className="col-start-1 row-start-2 order-2 mt-4">
                                        <div className="relative group">
                                            <div className="absolute inset-0 bg-gradient-to-b from-slate-100 to-slate-200 rounded-2xl transform rotate-1 group-hover:rotate-2 transition-transform duration-300"></div>
                                            <div className="relative bg-white rounded-2xl p-6 border border-slate-200 shadow-xl flex flex-col items-center">
                                                <div className="absolute -top-5 w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center font-bold text-slate-600 shadow-md border-2 border-white text-lg">2</div>
                                                <div className="mb-3 shadow-inner">
                                                    <LeaderboardAvatar
                                                        avatarUrl={leaderboardData.entries[1].avatarUrl}
                                                        name={leaderboardData.entries[1].fullname}
                                                        size="w-16 h-16"
                                                        ringClass="border border-slate-200"
                                                        bgClass="bg-slate-50"
                                                        textClass="text-slate-600 font-bold text-2xl"
                                                        fallback="🥈"
                                                    />
                                                </div>
                                                <h3 className="font-bold text-gray-900 text-base text-center mb-1 line-clamp-2 w-full leading-tight">{leaderboardData.entries[1].fullname}</h3>
                                                <p className="text-xs text-gray-500 mb-2">{leaderboardData.entries[1].class || 'Học viên'}</p>
                                                <div className="text-slate-700 font-bold font-mono text-sm bg-slate-50 px-3 py-1 rounded-full border border-slate-100">
                                                    {leaderboardData.entries[1].totalPoints.toLocaleString()}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* 1st Place */}
                                    <div className="col-span-2 row-start-1 justify-self-center z-10 w-full max-w-[220px] order-1 -mt-12">
                                        <div className="relative group">
                                            <div className="absolute -inset-0.5 bg-gradient-to-b from-yellow-300 to-amber-500 rounded-[20px] blur opacity-30 group-hover:opacity-50 transition-duration-500 animate-pulse-slow"></div>
                                            <div className="relative bg-white rounded-2xl p-8 border border-yellow-100 shadow-2xl flex flex-col items-center">
                                                <div className="absolute -top-6 w-12 h-12 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-full flex items-center justify-center font-bold text-white shadow-lg border-2 border-white text-xl">1</div>
                                                <div className="absolute top-0 right-0 p-2">
                                                    <div className="animate-bounce">👑</div>
                                                </div>
                                                <div className="mb-3 shadow-inner ring-4 ring-yellow-50/50 rounded-full">
                                                    <LeaderboardAvatar
                                                        avatarUrl={leaderboardData.entries[0].avatarUrl}
                                                        name={leaderboardData.entries[0].fullname}
                                                        size="w-20 h-20"
                                                        ringClass="border border-yellow-200"
                                                        bgClass="bg-yellow-50"
                                                        textClass="text-amber-700 font-bold text-3xl"
                                                        fallback="🏆"
                                                    />
                                                </div>
                                                <h3 className="font-bold text-gray-900 text-lg text-center mb-1 line-clamp-2 w-full leading-tight">{leaderboardData.entries[0].fullname}</h3>
                                                <p className="text-sm text-gray-500 mb-3">{leaderboardData.entries[0].class || 'Thủ khoa'}</p>
                                                <div className="text-amber-700 font-bold font-mono text-lg bg-gradient-to-r from-amber-50 to-yellow-50 px-4 py-1.5 rounded-full border border-yellow-100 shadow-sm">
                                                    {leaderboardData.entries[0].totalPoints.toLocaleString()}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* 3rd Place */}
                                    <div className="col-start-2 row-start-2 order-3">
                                        <div className="relative group">
                                            <div className="absolute inset-0 bg-gradient-to-b from-orange-100 to-orange-200 rounded-2xl transform -rotate-1 group-hover:-rotate-2 transition-transform duration-300"></div>
                                            <div className="relative bg-white rounded-2xl p-6 border border-orange-200 shadow-xl flex flex-col items-center">
                                                <div className="absolute -top-5 w-10 h-10 bg-orange-200 rounded-full flex items-center justify-center font-bold text-orange-700 shadow-md border-2 border-white text-lg">3</div>
                                                <div className="mb-3 shadow-inner">
                                                    <LeaderboardAvatar
                                                        avatarUrl={leaderboardData.entries[2].avatarUrl}
                                                        name={leaderboardData.entries[2].fullname}
                                                        size="w-16 h-16"
                                                        ringClass="border border-orange-200"
                                                        bgClass="bg-orange-50"
                                                        textClass="text-orange-700 font-bold text-2xl"
                                                        fallback="🥉"
                                                    />
                                                </div>
                                                <h3 className="font-bold text-gray-900 text-base text-center mb-1 line-clamp-2 w-full leading-tight">{leaderboardData.entries[2].fullname}</h3>
                                                <p className="text-xs text-gray-500 mb-2">{leaderboardData.entries[2].class || 'Học viên'}</p>
                                                <div className="text-orange-800 font-bold font-mono text-sm bg-orange-50 px-3 py-1 rounded-full border border-orange-100">
                                                    {leaderboardData.entries[2].totalPoints.toLocaleString()}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Remaining List (Right side on desktop) */}
                            <div className="w-full lg:w-7/12">
                                <div className="bg-white rounded-2xl border border-gray-100 shadow-lg shadow-gray-200/50 overflow-hidden">
                                    <div className="px-6 py-4 border-b border-gray-50 bg-gray-50/30 flex items-center justify-between">
                                        <h3 className="font-bold text-gray-800 text-lg">Xếp hạng tuần</h3>
                                        <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">Top 100</span>
                                    </div>
                                    <div className="divide-y divide-gray-50">
                                        {leaderboardData.entries.slice(3, 10).map((student, index) => (
                                            <div key={index} className="px-6 py-4 flex items-center gap-4 hover:bg-gray-50 transition-colors group cursor-default">
                                                <div className="flex-shrink-0 w-8 text-center font-bold text-gray-400 group-hover:text-green-600 transition-colors duration-200">
                                                    #{index + 4}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-3">
                                                        <LeaderboardAvatar
                                                            avatarUrl={student.avatarUrl}
                                                            name={student.fullname}
                                                            size="w-10 h-10"
                                                            ringClass="border border-white shadow-sm"
                                                            bgClass="bg-gradient-to-tr from-gray-100 to-gray-200"
                                                            textClass="text-sm font-bold text-gray-500"
                                                        />
                                                        <div>
                                                            <p className="text-sm font-bold text-gray-900 truncate group-hover:text-green-700 transition-colors">{student.fullname}</p>
                                                            <p className="text-xs text-gray-500 truncate">{student.class || 'Lớp học'}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex-shrink-0 text-right">
                                                    <span className="text-sm font-bold font-mono text-gray-900 bg-gray-100/50 px-2 py-1 rounded-md border border-transparent group-hover:border-gray-200 group-hover:bg-white transition-all">
                                                        {student.totalPoints.toLocaleString()}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    {leaderboardData.entries.length > 10 && (
                                        <div className="p-4 bg-gray-50/50 border-t border-gray-100 text-center">
                                            <button className="text-sm font-semibold text-green-600 hover:text-green-700 transition-colors flex items-center justify-center gap-1 mx-auto hover:gap-2 duration-200">
                                                Xem toàn bộ danh sách
                                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-300">
                            <div className="flex flex-col items-center justify-center text-gray-400">
                                <svg className="w-16 h-16 mb-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                </svg>
                                <h3 className="text-lg font-medium text-gray-900 mb-1">Chưa có dữ liệu</h3>
                                <p className="text-gray-500 text-sm">Bảng xếp hạng sẽ sớm được cập nhật.</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}
