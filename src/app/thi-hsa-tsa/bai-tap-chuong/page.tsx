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
                    (subAcc, sub) => subAcc + (sub.examSets?.filter((exam) => exam.userStatus?.isCompleted).length || 0),
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

    const renderDeadline = (exam: ExamSetResponse) => {
        if (!exam.deadline) return <span className="text-sm text-gray-400 italic">Không có</span>;
        const deadlineDate = new Date(exam.deadline);
        const isPastDeadline = deadlineDate < new Date();
        return (
            <div className="flex flex-col">
                <span className={`text-sm font-medium ${isPastDeadline ? 'text-rose-600' : 'text-slate-700'}`}>
                    {deadlineDate.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                </span>
                <span className="text-xs text-slate-500">
                    {deadlineDate.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                </span>
                {isPastDeadline && (
                    <span className="mt-1 inline-flex w-fit rounded-full bg-rose-100 px-2 py-0.5 text-[11px] font-semibold text-rose-700">
                        Đã hết hạn
                    </span>
                )}
            </div>
        );
    };

    const renderExamStatus = (exam: ExamSetResponse) => {
        if (exam.userStatus?.isCompleted) {
            return (
                <div className="flex items-center space-x-3">
                    <Link
                        href={`/thi-hsa-tsa/ket-qua?examId=${exam.id}`}
                        className="inline-flex items-center rounded-full bg-emerald-100 px-3 py-1.5 text-sm font-medium text-emerald-700 hover:bg-emerald-200"
                    >
                        <span className="mr-2 text-lg">✅</span>
                        Kết quả
                    </Link>
                    <span className="text-sm font-semibold text-emerald-700">
                        {exam.userStatus?.score || 0}% ({exam.userStatus?.totalPoints || 0} điểm)
                    </span>
                </div>
            );
        }

        if (exam.status === ExamSetStatus.EXPIRED) {
            return (
                <span className="inline-flex items-center rounded-full bg-rose-100 px-3 py-1.5 text-sm font-medium text-rose-700">
                    <span className="mr-2 text-lg">⏳</span>
                    Đã hết hạn
                </span>
            );
        }

        return (
            <Link
                href={`/thi-hsa-tsa/lam-bai?examId=${exam.id}`}
                className="inline-flex items-center rounded-full bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
            >
                <span className="mr-2 text-lg">🚀</span>
                Làm bài
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
                                                                    <div className="space-y-3">
                                                                        {sub.examSets.map((exam) => (
                                                                            <div
                                                                                key={exam.id}
                                                                                className="rounded-xl border border-slate-100 bg-white px-4 py-3 shadow-sm transition hover:border-indigo-100 hover:shadow"
                                                                            >
                                                                                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                                                                                    <div className="space-y-1">
                                                                                        <div className="text-sm font-semibold text-slate-900">{exam.name}</div>
                                                                                        {exam.description && (
                                                                                            <div className="text-xs text-slate-500 line-clamp-2">{exam.description}</div>
                                                                                        )}
                                                                                        <div className="flex flex-wrap gap-2 text-xs text-slate-500">
                                                                                            <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-1">
                                                                                                ⏱ {exam.duration || 'N/A'}
                                                                                            </span>
                                                                                            <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-1">
                                                                                                🎯 {exam.subject}
                                                                                            </span>
                                                                                        </div>
                                                                                    </div>
                                                                                    <div className="flex flex-col items-end gap-2 sm:items-end">
                                                                                        <div>{renderExamStatus(exam)}</div>
                                                                                        <div className="text-right">{renderDeadline(exam)}</div>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        ))}
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
