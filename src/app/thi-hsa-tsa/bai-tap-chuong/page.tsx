'use client';

import Header from '@/components/Header';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useChapterExamSets, ExamSetStatus, ExamSetResponse } from '@/hooks/useExam';
import { useAuth } from '@/hooks/useAuth';

export default function BaiTapChuongPage() {
    const { user, isAuthenticated, isLoading: isAuthLoading } = useAuth();
    const [selectedChapterId, setSelectedChapterId] = useState<string>('');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const getGradeFromYearOfBirth = (yearOfBirth: string): number | undefined => {
        if (yearOfBirth === '2008') return 12;
        if (yearOfBirth === '2009') return 11;
        if (yearOfBirth === '2010') return 10;
        return undefined;
    };

    const userGrade = user?.yearOfBirth ? getGradeFromYearOfBirth(user.yearOfBirth) : undefined;
    const { data: chapters, isLoading } = useChapterExamSets(userGrade, user?.classname);

    useEffect(() => {
        if (chapters && chapters.length > 0 && !selectedChapterId) {
            setSelectedChapterId(chapters[0].id);
        }
    }, [chapters, selectedChapterId]);

    const selectedChapter = chapters?.find(c => c.id === selectedChapterId);

    const startExam = (examId: string, hasPassword?: boolean) => {
        const params = new URLSearchParams({ examId });
        if (hasPassword) {
            const enteredPassword = window.prompt('Đề thi này có mật khẩu. Vui lòng nhập mật khẩu để bắt đầu làm bài:');
            if (!enteredPassword) return;
            params.set('password', enteredPassword);
        }
        window.location.href = `/thi-hsa-tsa/lam-bai?${params.toString()}`;
    };

    const renderExamStatusFooter = (exam: ExamSetResponse) => {
        const hasResult =
            exam.userStatus?.isCompleted === true ||
            (exam.userStatus?.totalPoints !== undefined && exam.userStatus?.totalPoints !== null);

        if (hasResult) {
            const totalPoints = exam.userStatus?.totalPoints ?? 0;

            return (
                <>
                    <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-amber-300 flex items-center justify-center shadow-inner">
                            <svg className="w-5 h-5 text-amber-900" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xs font-bold text-amber-600 leading-none">Hoàn thành</span>
                            <span className="text-[10px] text-amber-700 font-semibold">
                                {exam.userStatus?.totalPoints != null ? `${totalPoints} điểm` : 'Đã nộp bài'}
                            </span>
                        </div>
                    </div>
                    {exam.lockView ? (
                        <span
                            title="Đề này đang khóa xem đáp án"
                            className="inline-flex items-center gap-1.5 bg-slate-100 text-slate-400 border-2 border-slate-200 px-4 py-2.5 rounded-xl text-sm font-bold cursor-not-allowed shrink-0"
                        >
                            🔒 Khóa xem đáp án
                        </span>
                    ) : (
                        <Link
                            href={`/thi-hsa-tsa/ket-qua?examId=${exam.id}`}
                            className="inline-flex items-center gap-1.5 bg-white text-emerald-700 border-2 border-emerald-500 px-4 py-2.5 rounded-xl text-sm font-bold shadow-sm hover:bg-emerald-50 hover:shadow-md transition-all active:scale-95 shrink-0"
                        >
                            Xem đáp án
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                            </svg>
                        </Link>
                    )}
                </>
            );
        }

        if (exam.status === ExamSetStatus.EXPIRED) {
            return (
                <>
                    <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-rose-100 flex items-center justify-center">
                            <svg className="w-4 h-4 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                        </div>
                        <span className="text-xs font-bold text-rose-500">Hết hạn</span>
                    </div>
                    <button disabled className="bg-slate-100 text-slate-400 px-5 py-2.5 rounded-xl text-sm font-bold cursor-not-allowed">
                        Đóng
                    </button>
                </>
            );
        }

        return (
            <>
                <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-emerald-100 flex items-center justify-center">
                        <div className="h-2.5 w-2.5 rounded-full bg-emerald-600 animate-pulse"></div>
                    </div>
                    <span className="text-xs font-bold text-emerald-600">Chưa làm</span>
                </div>
                <button
                    disabled={!isAuthenticated}
                    onClick={() => startExam(exam.id, exam.hasPassword)}
                    className={`${isAuthenticated ? 'bg-emerald-600 hover:bg-emerald-700 shadow-md hover:shadow-lg' : 'bg-slate-300 cursor-not-allowed'} text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all active:scale-95`}
                    title={!isAuthenticated ? 'Vui lòng đăng nhập để làm bài' : ''}
                >
                    Làm bài
                </button>
            </>
        );
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#f4faff] flex flex-col items-center justify-center">
                <div className="w-12 h-12 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin mb-4"></div>
                <p className="text-slate-500 font-medium">Đang tải dữ liệu khóa học...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f4faff] font-sans text-slate-800">
            <Header />

            {/* Mobile Header Toggle */}
            <div className="lg:hidden bg-white border-b border-emerald-100 p-4 sticky top-[64px] z-40 flex items-center justify-between">
                <h2 className="font-bold text-emerald-900 border-l-4 border-emerald-500 pl-3">Danh sách chương</h2>
                <button
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="p-2 bg-emerald-50 text-emerald-700 rounded-lg font-bold text-sm"
                >
                    {isMobileMenuOpen ? 'Đóng' : 'Mở danh sách'}
                </button>
            </div>

            {/* ─── Main Workspace ─── */}
            <main className="pt-6 lg:pt-12 pb-12 px-4 md:px-8 max-w-[1600px] mx-auto flex flex-col lg:flex-row gap-8">

                {/* ─── Sidebar: Academic Path ─── */}
                <aside className={`lg:flex flex-col w-full lg:w-72 shrink-0 gap-y-2 p-4 bg-emerald-50/50 lg:backdrop-blur-xl rounded-2xl border lg:border-r border-emerald-100/50 lg:sticky top-[100px] lg:h-[calc(100vh-8rem)] overflow-y-auto ${isMobileMenuOpen ? 'flex' : 'hidden'}`}>
                    <div className="px-4 mb-4">
                        <h3 className="text-lg font-extrabold text-emerald-900">Chương Trình Học</h3>
                        <p className="text-[10px] text-emerald-800/60 font-bold uppercase tracking-widest mt-1">
                            Sinh viên lớp {userGrade || '12'}
                        </p>
                    </div>

                    {chapters?.map((ch, idx) => {
                        const isSelected = ch.id === selectedChapterId;
                        return (
                            <button
                                key={ch.id}
                                onClick={() => {
                                    setSelectedChapterId(ch.id);
                                    setIsMobileMenuOpen(false);
                                }}
                                className={`flex items-center gap-3 py-3 px-4 rounded-xl font-medium transition-all text-left group ${isSelected
                                    ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/10'
                                    : 'text-emerald-800/70 hover:bg-emerald-100/70'
                                    }`}
                            >

                                <span className="text-sm font-semibold line-clamp-2">Chương {idx + 1}: {ch.name}</span>
                            </button>
                        );
                    })}

                    {(!chapters || chapters.length === 0) && (
                        <div className="p-4 text-center text-sm text-emerald-700/60">
                            Chưa có dữ liệu chương học.
                        </div>
                    )}
                </aside>

                {/* ─── Main Workspace ─── */}
                <div className="flex-1 space-y-8 min-w-0">

                    {/* Chapter Header */}
                    {selectedChapter && (
                        <header className="relative p-6 lg:p-10 rounded-3xl overflow-hidden min-h-[220px] flex flex-col justify-end bg-emerald-700 text-white shadow-xl shadow-emerald-900/5">
                            {/* Decorative background image */}
                            <div className="absolute inset-0 bg-[url('https://t4.ftcdn.net/jpg/02/76/89/30/360_F_276893092_t59XFpU1uN7qYq1iRzH6X9XhZk2s1wXz.jpg')] bg-cover bg-center opacity-10 mix-blend-overlay"></div>
                            <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/90 via-emerald-800/40 to-transparent"></div>

                            <div className="relative z-10">
                                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-200 mb-3 block">
                                    Chi tiết chương
                                </span>
                                <h1 className="text-3xl md:text-5xl font-extrabold leading-tight tracking-tight mb-2">
                                    {selectedChapter.name}
                                </h1>
                                <p className="text-emerald-100 mt-3 max-w-xl text-sm font-medium leading-relaxed">
                                    Hệ thống kiến thức được chia làm {selectedChapter.subChapters?.length || 0} bài học nhỏ với tổng cộng {selectedChapter.subChapters?.reduce((acc, sub) => acc + (sub.examSets?.length || 0), 0) || 0} đề ôn luyện.
                                </p>
                            </div>
                        </header>
                    )}

                    {/* Learning Content Area */}
                    <div className="space-y-12">
                        {selectedChapter?.subChapters?.map((sub, sIdx) => (
                            <section key={sub.id}>
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="h-8 w-1.5 bg-emerald-600 rounded-full"></div>
                                    <h2 className="text-xl md:text-2xl font-extrabold text-emerald-900 tracking-tight">
                                        {sub.name}
                                    </h2>
                                </div>

                                {sub.examSets && sub.examSets.length > 0 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-5">
                                        {sub.examSets.map((exam) => (
                                            <div
                                                key={exam.id}
                                                className="group bg-blue-50/40 hover:bg-white transition-all duration-300 rounded-2xl p-5 md:p-6 flex flex-col justify-between border-2 border-transparent hover:border-emerald-500 shadow-sm hover:shadow-xl"
                                            >
                                                <div className="flex justify-between items-start mb-5 gap-4">
                                                    <div>
                                                        <h3 className="font-extrabold text-lg text-emerald-950 line-clamp-2 leading-snug">
                                                            {exam.name}
                                                        </h3>
                                                        <div className="flex flex-wrap gap-4 mt-3">
                                                            <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                                                                <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                                                <span>{exam.duration || '--'}</span>
                                                            </div>
                                                            {exam.totalPoints && (
                                                                <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                                                                    <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                                                    <span>{exam.totalPoints} điểm</span>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>

                                                    {/* Badge / Difficulty / Deadline */}
                                                    {exam.deadline && (
                                                        <span className="px-3 py-1 bg-amber-100 text-amber-800 text-[10px] font-bold uppercase tracking-widest rounded-full whitespace-nowrap">
                                                            Hạn: {new Date(exam.deadline).toLocaleDateString()}
                                                        </span>
                                                    )}
                                                    {!exam.deadline && (
                                                        <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase tracking-widest rounded-full whitespace-nowrap">
                                                            Cơ bản
                                                        </span>
                                                    )}
                                                </div>

                                                <div className="flex items-center justify-between mt-auto pt-4 border-t border-dashed border-slate-200">
                                                    {renderExamStatusFooter(exam)}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="bg-white/50 border border-dashed border-slate-300 rounded-2xl p-8 flex flex-col items-center justify-center text-center">
                                        <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mb-3">
                                            <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" /></svg>
                                        </div>
                                        <p className="text-sm font-semibold text-slate-600">Đang cập nhật bài tập cho nội dung này</p>
                                    </div>
                                )}
                            </section>
                        ))}
                    </div>

                    {!selectedChapter && !isLoading && (
                        <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-200">
                            Vui lòng chọn một chương học bên trái để xem chi tiết.
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
