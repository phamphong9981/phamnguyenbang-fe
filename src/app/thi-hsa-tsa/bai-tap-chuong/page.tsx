'use client';

import Header from '@/components/Header';
import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useChapterExamSets, ExamSetStatus, ExamSetResponse } from '@/hooks/useExam';
import { useAuth } from '@/hooks/useAuth';

const skeletons = Array.from({ length: 3 }).map((_, i) => i);

export default function BaiTapChuongPage() {
    const { user } = useAuth();
    const [expandedChapters, setExpandedChapters] = useState<Set<string>>(new Set());

    const getGradeFromYearOfBirth = (yearOfBirth: string): number | undefined => {
        if (yearOfBirth === '2008') return 12;
        if (yearOfBirth === '2009') return 11;
        if (yearOfBirth === '2010') return 10;
        return undefined;
    };

    const userGrade = user?.yearOfBirth ? getGradeFromYearOfBirth(user.yearOfBirth) : undefined;
    const { data: chapters, isLoading } = useChapterExamSets(userGrade, user?.classname);

    const stats = useMemo(() => {
        const totalChapters = chapters?.length || 0;
        const totalSubChapters = chapters?.reduce((acc, ch) => acc + (ch.subChapters?.length || 0), 0) || 0;
        const totalExams = chapters?.reduce(
            (acc, ch) => acc + (ch.subChapters?.reduce((subAcc, sub) => subAcc + (sub.examSets?.length || 0), 0) || 0),
            0
        ) || 0;
        const completedExams = chapters?.reduce(
            (acc, ch) =>
                acc +
                (ch.subChapters?.reduce(
                    (subAcc, sub) => subAcc + (sub.examSets?.filter((exam) =>
                        exam.userStatus?.totalPoints !== undefined && exam.userStatus?.totalPoints !== null
                    ).length || 0),
                    0
                ) || 0),
            0
        ) || 0;

        return { totalChapters, totalSubChapters, totalExams, completedExams };
    }, [chapters]);

    const toggleChapter = (id: string) => {
        setExpandedChapters((prev) => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    };

    // Helper function to get score color based on percentage
    const getScoreColor = (score: number) => {
        if (score >= 80) return { bg: 'bg-emerald-500', text: 'text-emerald-600', light: 'bg-emerald-50', border: 'border-emerald-200' };
        if (score >= 60) return { bg: 'bg-blue-500', text: 'text-blue-600', light: 'bg-blue-50', border: 'border-blue-200' };
        if (score >= 40) return { bg: 'bg-amber-500', text: 'text-amber-600', light: 'bg-amber-50', border: 'border-amber-200' };
        return { bg: 'bg-rose-500', text: 'text-rose-600', light: 'bg-rose-50', border: 'border-rose-200' };
    };

    const renderExamStatus = (exam: ExamSetResponse) => {
        // Nếu có totalPoints thì đã có kết quả, có thể xem chi tiết
        if (exam.userStatus?.totalPoints !== undefined && exam.userStatus?.totalPoints !== null) {
            const score = exam.userStatus?.score || 0;
            const totalPoints = exam.userStatus.totalPoints;
            const scoreColors = getScoreColor(score);

            return (
                <div className="flex flex-col gap-2">
                    {/* Score Display - Simple */}
                    <div className={`rounded-lg ${scoreColors.light} ${scoreColors.border} border px-1 py-1 text-center`}>
                        <div className="text-sm text-slate-600">
                            <span className="font-semibold">{totalPoints}</span> điểm
                        </div>
                    </div>

                    {/* View Result Button - Simple */}
                    <Link
                        href={`/thi-hsa-tsa/ket-qua?examId=${exam.id}`}
                        className="group inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-1 py-2 text-sm font-medium text-white transition-all duration-200 hover:bg-indigo-700 hover:shadow-md"
                    >
                        <span>Xem chi tiết</span>
                        <svg className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </Link>
                </div>
            );
        }

        if (exam.status === ExamSetStatus.EXPIRED) {
            return (
                <div className="rounded-lg bg-rose-50 border border-rose-200 px-4 py-2.5 text-center">
                    <span className="text-sm font-medium text-rose-700">Đã hết hạn</span>
                </div>
            );
        }

        return (
            <Link
                href={`/thi-hsa-tsa/lam-bai?examId=${exam.id}`}
                className="group inline-flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-all duration-200 hover:bg-indigo-700 hover:shadow-md"
            >
                <span>Bắt đầu làm bài</span>
                <svg className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
            </Link>
        );
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 flex flex-col">
            <Header />

            {/* Hero */}
            <section className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-violet-600 to-emerald-500 text-white">
                <div className="absolute inset-0 opacity-20 mix-blend-overlay"
                    style={{
                        backgroundImage:
                            'radial-gradient(circle at 20% 20%, rgba(255,255,255,0.3) 0, transparent 25%), radial-gradient(circle at 80% 0%, rgba(255,255,255,0.25) 0, transparent 20%), radial-gradient(circle at 50% 80%, rgba(255,255,255,0.25) 0, transparent 20%)'
                    }}
                />
                <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-7">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
                        <div className="space-y-4">
                            <h1 className="text-4xl sm:text-5xl font-bold leading-tight drop-shadow-sm">
                                Chinh phục kiến thức theo từng chương
                            </h1>
                            <p className="text-lg text-indigo-50 max-w-2xl">
                                Bài tập được tổ chức theo Chương → Chương con → Đề thi, giúp bạn luyện tập hệ thống, dễ theo dõi tiến độ và kết quả.
                            </p>
                            <div className="inline-flex items-center rounded-full bg-white/15 px-4 py-2 text-sm font-semibold backdrop-blur shadow">
                                🎯 Khối: <span className="ml-2 text-white">{`Lớp ${userGrade}`}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Content */}
            <section className="py-10 flex-1">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
                    {isLoading ? (
                        <div className="grid gap-4">
                            {skeletons.map((key) => (
                                <div key={key} className="rounded-2xl border border-slate-100 bg-white shadow-sm p-5 animate-pulse">
                                    <div className="h-6 w-1/3 bg-slate-200 rounded mb-3"></div>
                                    <div className="h-4 w-1/2 bg-slate-200 rounded mb-4"></div>
                                    <div className="h-3 w-full bg-slate-100 rounded mb-2"></div>
                                    <div className="h-3 w-5/6 bg-slate-100 rounded"></div>
                                </div>
                            ))}
                        </div>
                    ) : chapters && chapters.length > 0 ? (
                        <div className="space-y-4">
                            {chapters.map((chapter, chapterIndex) => {
                                const expanded = expandedChapters.has(chapter.id);
                                return (
                                    <div
                                        key={chapter.id}
                                        className="rounded-2xl border border-slate-100 bg-white shadow-sm transition hover:shadow-md"
                                    >
                                        <button
                                            onClick={() => toggleChapter(chapter.id)}
                                            className="w-full flex items-center justify-between px-5 py-4 text-left"
                                        >
                                            <div className="flex items-center space-x-4">
                                                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-emerald-500 text-white font-bold shadow">
                                                    {chapterIndex + 1}
                                                </div>
                                                <div>
                                                    <div className="text-lg font-semibold text-slate-900">{chapter.name}</div>
                                                    <div className="text-sm text-slate-500">
                                                        {chapter.subChapters?.length || 0} chương con •{' '}
                                                        {chapter.subChapters?.reduce((acc, sub) => acc + (sub.examSets?.length || 0), 0) || 0} bài tập
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center space-x-3 text-sm text-slate-500">
                                                <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 font-medium">
                                                    {expanded ? 'Thu gọn' : 'Xem chi tiết'}
                                                </span>
                                                <svg
                                                    className={`h-5 w-5 text-slate-500 transition-transform ${expanded ? 'rotate-180' : ''}`}
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                </svg>
                                            </div>
                                        </button>

                                        {expanded && (
                                            <div className="border-t border-slate-100 bg-slate-50/60">
                                                {chapter.subChapters && chapter.subChapters.length > 0 ? (
                                                    <div className="divide-y divide-slate-100">
                                                        {chapter.subChapters.map((sub, subIndex) => (
                                                            <div key={sub.id} className="px-5 py-4">
                                                                <div className="mb-3 flex items-center space-x-2">
                                                                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-100 text-indigo-700 text-sm font-semibold">
                                                                        {chapterIndex + 1}.{subIndex + 1}
                                                                    </span>
                                                                    <div className="text-base font-semibold text-slate-800">{sub.name}</div>
                                                                    <span className="text-xs text-slate-500">({sub.examSets?.length || 0} bài)</span>
                                                                </div>

                                                                {sub.examSets && sub.examSets.length > 0 ? (
                                                                    <div className="space-y-4">
                                                                        {sub.examSets.map((exam) => {
                                                                            const hasResult = exam.userStatus?.totalPoints !== undefined && exam.userStatus?.totalPoints !== null;

                                                                            return (
                                                                                <div
                                                                                    key={exam.id}
                                                                                    className={`rounded-2xl border bg-white p-4 shadow-sm transition-all duration-300 hover:shadow-md ${hasResult
                                                                                        ? 'border-emerald-100 hover:border-emerald-200'
                                                                                        : 'border-slate-100 hover:border-indigo-200'
                                                                                        }`}
                                                                                >
                                                                                    <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                                                                                        {/* Exam Info */}
                                                                                        <div className="flex-1 space-y-2">
                                                                                            <div className="flex items-start gap-3">
                                                                                                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${hasResult
                                                                                                    ? 'bg-gradient-to-br from-emerald-400 to-teal-500'
                                                                                                    : 'bg-gradient-to-br from-indigo-400 to-purple-500'
                                                                                                    } text-white shadow-sm`}>
                                                                                                    {hasResult ? (
                                                                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                                                                        </svg>
                                                                                                    ) : (
                                                                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                                                                        </svg>
                                                                                                    )}
                                                                                                </div>
                                                                                                <div className="flex-1 min-w-0">
                                                                                                    <h4 className="text-base font-semibold text-slate-900 line-clamp-1">{exam.name}</h4>
                                                                                                    {exam.description && (
                                                                                                        <p className="mt-1 text-sm text-slate-500 line-clamp-2">{exam.description}</p>
                                                                                                    )}
                                                                                                </div>
                                                                                            </div>

                                                                                            {/* Tags */}
                                                                                            <div className="flex flex-wrap gap-2 pl-13">
                                                                                                <span className="inline-flex items-center gap-1 rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                                                                                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                                                                    </svg>
                                                                                                    {exam.duration || 'N/A'}
                                                                                                </span>
                                                                                                {exam.totalPoints && (
                                                                                                    <span className="inline-flex items-center gap-1 rounded-lg bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700">
                                                                                                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                                                                                                        </svg>
                                                                                                        {exam.totalPoints} điểm
                                                                                                    </span>
                                                                                                )}
                                                                                                {/* Deadline badge */}
                                                                                                {exam.deadline && (
                                                                                                    <span className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-medium ${new Date(exam.deadline) < new Date()
                                                                                                        ? 'bg-rose-50 text-rose-700'
                                                                                                        : 'bg-blue-50 text-blue-700'
                                                                                                        }`}>
                                                                                                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                                                                        </svg>
                                                                                                        {new Date(exam.deadline).toLocaleDateString('vi-VN')}
                                                                                                    </span>
                                                                                                )}
                                                                                            </div>
                                                                                        </div>

                                                                                        {/* Status & Actions */}
                                                                                        <div className="lg:w-auto lg:min-w-[180px]">
                                                                                            {renderExamStatus(exam)}
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            );
                                                                        })}
                                                                    </div>
                                                                ) : (
                                                                    <div className="rounded-lg border border-dashed border-slate-200 bg-white px-4 py-3 text-sm text-slate-500">
                                                                        Chưa có bài tập trong chương con này.
                                                                    </div>
                                                                )}
                                                            </div>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <div className="px-5 py-6 text-center text-sm text-slate-500">
                                                        Chưa có chương con. Vui lòng kiểm tra lại sau.
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-10 text-center shadow-sm">
                            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-3xl">📘</div>
                            <h3 className="text-lg font-semibold text-slate-900 mb-1">Chưa có bài tập chương</h3>
                            <p className="text-sm text-slate-500">Nội dung sẽ được cập nhật sớm.</p>
                        </div>
                    )}
                </div>
            </section>

            {/* CTA / Footer */}
            <section className="bg-gradient-to-r from-indigo-600 via-blue-600 to-emerald-500 py-7 mt-auto">
            </section>
        </div>
    );
}

function StatCard({ label, value, accent, icon }: { label: string; value: number; accent: string; icon: string }) {
    return (
        <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm flex items-center space-x-4">
            <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${accent} text-white text-xl`}>
                {icon}
            </div>
            <div>
                <div className="text-sm text-slate-500">{label}</div>
                <div className="text-2xl font-bold text-slate-900">{value}</div>
            </div>
        </div>
    );
}
