'use client';

import Header from '@/components/Header';
import { useMemo, useState, useEffect } from 'react';
import { useExamSets, ExamSetType, SUBJECT_ID, ExamSetGroupExamType, ExamSetGroupType } from '@/hooks/useExam';
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';
import { getSubjectInfo, SubjectInfo } from '../utils';
import ExamSetGroupModal from '@/components/exam/ExamSetGroupModal';
import { ExamSetGroupResponseDto } from '@/hooks/useExam';

export default function ThiTSAPage() {
    const [selectedYear, setSelectedYear] = useState<string>('2025');
    const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');

    // multi-select môn học: 'all' hoặc mảng id
    const [selectedSubjects, setSelectedSubjects] = useState<number[] | 'all'>('all');

    const { user } = useAuth();

    // Fetch exam sets from API
    const { data: examSets, isLoading, error } = useExamSets(ExamSetType.TSA, undefined, user?.id);

    // Modal bộ đề hoàn chỉnh
    const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);

    // subjects có trong dữ liệu + đếm số đề
    const subjectsInData = useMemo(() => {
        const counts = new Map<number, number>();
        (examSets ?? []).forEach(e => counts.set(e.subject, (counts.get(e.subject) ?? 0) + 1));
        return [...counts.entries()].map(([id, count]) => ({ info: getSubjectInfo(id), count }));
    }, [examSets]);

    // lấy state ban đầu từ URL
    useEffect(() => {
        const p = new URLSearchParams(location.search);
        if (p.get('year')) setSelectedYear(p.get('year')!);
        if (p.get('difficulty')) setSelectedDifficulty(p.get('difficulty')!);
        if (p.get('subjects')) {
            const arr = p.get('subjects')!.split(',').map(v => Number(v)).filter(Boolean);
            if (arr.length) setSelectedSubjects(arr);
        }
    }, []);

    // sync state -> URL
    useEffect(() => {
        const p = new URLSearchParams(location.search);
        selectedYear === 'all' ? p.delete('year') : p.set('year', selectedYear);
        selectedDifficulty === 'all' ? p.delete('difficulty') : p.set('difficulty', selectedDifficulty);
        if (selectedSubjects === 'all') p.delete('subjects');
        else p.set('subjects', selectedSubjects.join(','));
        history.replaceState(null, '', `?${p.toString()}`);
    }, [selectedYear, selectedDifficulty, selectedSubjects]);


    const filteredExams = useMemo(() => {
        return (examSets ?? []).filter(exam => {
            if (selectedYear !== 'all' && exam.year !== selectedYear) return false;
            if (selectedDifficulty !== 'all' && exam.difficulty !== selectedDifficulty) return false;
            if (selectedSubjects !== 'all' && !selectedSubjects.includes(exam.subject)) return false;
            return true;
        });
    }, [examSets, selectedYear, selectedDifficulty, selectedSubjects]);

    // group theo môn (sau khi lọc)
    const groupedExams = useMemo(() => {
        return filteredExams.reduce((groups, exam) => {
            const subjectInfo = getSubjectInfo(exam.subject);
            const subjectName = subjectInfo.name;
            if (!groups[subjectName]) groups[subjectName] = { subjectInfo, exams: [] as any[] };
            groups[subjectName].exams.push(exam);
            return groups;
        }, {} as Record<string, { subjectInfo: SubjectInfo; exams: any[] }>);
    }, [filteredExams]);

    const getDifficultyColor = (d: string) =>
        d === 'Dễ' ? 'bg-green-100 text-green-800 border-green-200'
            : d === 'Trung bình' ? 'bg-yellow-100 text-yellow-800 border-yellow-200'
                : d === 'Khó' ? 'bg-orange-100 text-orange-800 border-orange-200'
                    : d === 'Rất khó' ? 'bg-red-100 text-red-800 border-red-200'
                        : 'bg-gray-100 text-gray-800 border-gray-200';

    const startExam = (examId: string) => {
        window.location.href = `/thi-hsa-tsa/lam-bai?examId=${examId}`;
    };

    const handleStartGroupExam = (group: ExamSetGroupResponseDto, type?: ExamSetGroupType | null) => {
        sessionStorage.setItem('examSetGroup', JSON.stringify(group));
        sessionStorage.setItem('examType', ExamSetType.TSA);
        let url = `/thi-hsa-tsa/lam-bai-group?groupId=${group.id}`;
        if (type) {
            url += `&type=${type}`;
        }
        window.location.href = url;
    };

    // toggle chọn môn
    const toggleSubject = (id: number) => {
        setSelectedSubjects(prev => {
            if (prev === 'all') return [id];
            return prev.includes(id)
                ? (prev.length === 1 ? 'all' : prev.filter(x => x !== id))
                : [...prev, id];
        });
    };

    // State để theo dõi môn nào đang "xem tất cả"
    const [expandedSubjects, setExpandedSubjects] = useState<Record<string, boolean>>({});

    const toggleExpandSubject = (subjectName: string) => {
        setExpandedSubjects(prev => ({
            ...prev,
            [subjectName]: !prev[subjectName]
        }));
    };

    return (
        <div className="min-h-screen bg-slate-50 font-sans">
            <Header />

            {/* loading / error */}
            {isLoading && (
                <div className="flex items-center justify-center min-h-[400px]">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
                        <p className="text-gray-600 font-medium">Đang tải đề thi...</p>
                    </div>
                </div>
            )}
            {error && (
                <div className="flex items-center justify-center min-h-[400px]">
                    <div className="text-center">
                        <div className="text-red-500 text-5xl mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 mx-auto">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                            </svg>
                        </div>
                        <h1 className="text-xl font-bold text-gray-900 mb-2">Lỗi tải đề thi</h1>
                        <p className="text-gray-600 mb-6">Đã có lỗi xảy ra. Vui lòng thử lại sau.</p>
                        <button onClick={() => window.location.reload()} className="bg-red-600 hover:bg-red-700 text-white px-6 py-2.5 rounded-lg font-medium transition-colors shadow-sm">
                            Thử lại
                        </button>
                    </div>
                </div>
            )}

            {!isLoading && !error && (
                <>
                    {/* Hero Section */}
                    <section className="relative bg-slate-50 border-b border-gray-200 overflow-hidden">
                        <div className="absolute inset-0 z-0 flex justify-center">
                            <img
                                src="/TSA.png"
                                alt="TSA Background"
                                className="h-full w-auto object-cover opacity-30"
                            />
                        </div>
                        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                <div className="max-w-2xl">
                                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 text-red-700 text-xs font-semibold mb-4 border border-red-100">
                                        <span className="relative flex h-2 w-2">
                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                                        </span>
                                        Luyện thi TSA 2025
                                    </div>
                                    <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-3 tracking-tight">Kỳ thi Tư duy TSA</h1>
                                    <p className="text-lg text-gray-500 leading-relaxed">
                                        Thử thách bản thân với bộ đề thi Tư duy logic, Toán học và Giải quyết vấn đề.
                                    </p>
                                </div>
                                <div className='flex gap-2 flex-wrap'>
                                    <button
                                        onClick={() => setIsGroupModalOpen(true)}
                                        className="group relative flex items-center justify-center gap-2 px-6 py-3.5 bg-gray-900 hover:bg-black text-white rounded-xl font-semibold shadow-xl hover:shadow-2xl transition-all w-full md:w-auto overflow-hidden"
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 opacity-0 group-hover:opacity-10 transition-opacity duration-500"></div>
                                        <svg className="w-5 h-5 text-red-300 group-hover:text-red-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                                        </svg>
                                        <span className="relative z-10">Làm bộ đề hoàn chỉnh</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* FILTER BAR (sticky) */}
                    <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-gray-200/60 shadow-sm">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
                            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
                                <button
                                    onClick={() => setSelectedSubjects('all')}
                                    className={`flex items-center gap-1.5 px-4 py-2 rounded-full border text-sm font-medium transition-all whitespace-nowrap
                                        ${selectedSubjects === 'all'
                                            ? 'bg-gray-900 text-white border-gray-900 shadow-md'
                                            : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                                        }`}
                                >
                                    <span>Tất cả</span>
                                    <span className={`text-xs ml-1 ${selectedSubjects === 'all' ? 'text-gray-300' : 'text-gray-400'}`}>
                                        {examSets?.length ?? 0}
                                    </span>
                                </button>
                                <div className="w-px h-6 bg-gray-200 mx-1 flex-shrink-0"></div>
                                {subjectsInData.map(({ info, count }) => {
                                    const active = selectedSubjects !== 'all' && selectedSubjects.includes(info.id);
                                    return (
                                        <button
                                            key={info.id}
                                            onClick={() => toggleSubject(info.id)}
                                            className={`flex items-center gap-2 px-3.5 py-2 rounded-full border text-sm font-medium transition-all whitespace-nowrap
                                                ${active
                                                    ? 'bg-red-50 border-red-200 text-red-700 shadow-sm ring-1 ring-red-100'
                                                    : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                                                }`}
                                        >
                                            <span className={`w-2 h-2 rounded-full ${info.dot}`} />
                                            {info.name}
                                            <span className="text-xs text-gray-400 bg-gray-100 px-1.5 rounded-md">{count}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Exams List */}
                    <section className="py-10 bg-slate-50 min-h-screen">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            {Object.keys(groupedExams).length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-dashed border-gray-300">
                                    <div className="p-4 bg-gray-50 rounded-full mb-4">
                                        <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-900">Không tìm thấy đề thi TSA</h3>
                                    <p className="text-gray-500 mt-1">Hãy thử thay đổi bộ lọc tìm kiếm.</p>
                                    <button onClick={() => setSelectedSubjects('all')} className="mt-4 text-red-600 font-medium hover:underline">
                                        Xóa bộ lọc
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-12">
                                    {Object.entries(groupedExams)
                                        .sort((a, b) => {
                                            const subjectOrder = [
                                                SUBJECT_ID.MATH,
                                                SUBJECT_ID.SCIENCE,
                                                SUBJECT_ID.LITERATURE,
                                                SUBJECT_ID.ENGLISH,
                                                SUBJECT_ID.PHYSICS,
                                                SUBJECT_ID.CHEMISTRY,
                                                SUBJECT_ID.BIOLOGY,
                                                SUBJECT_ID.HISTORY,
                                                SUBJECT_ID.GEOGRAPHY,
                                            ];
                                            const aId = (a[1].subjectInfo as any).id ?? 0;
                                            const bId = (b[1].subjectInfo as any).id ?? 0;
                                            return subjectOrder.indexOf(aId) - subjectOrder.indexOf(bId);
                                        })
                                        .map(([subjectName, { subjectInfo, exams }]) => {
                                            const isExpanded = expandedSubjects[subjectName];
                                            // Hiển thị tối đa 6 đề nếu chưa expand, hoặc tất cả nếu đã expand
                                            const displayExams = isExpanded ? exams : exams.slice(0, 6);
                                            const hasMore = exams.length > 6;

                                            return (
                                                <div key={subjectName} className="space-y-5">
                                                    <div className="flex items-center justify-between sticky top-[72px] bg-slate-50/95 backdrop-blur py-3 z-10 border-b border-gray-200/50">
                                                        <div className="flex items-center gap-3">
                                                            <div className={`p-2 rounded-lg bg-white shadow-sm border ${subjectInfo.border}`}>
                                                                <div className={`w-3 h-3 rounded-full ${subjectInfo.dot}`} />
                                                            </div>
                                                            <h2 className="text-xl font-bold text-gray-800">{subjectName}</h2>
                                                            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gray-200 text-gray-600">
                                                                {exams.length}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
                                                        {displayExams.map((exam) => {
                                                            const isCompleted = exam.userStatus?.isCompleted;
                                                            const difficultyColor = getDifficultyColor(exam.difficulty);

                                                            return (
                                                                <div key={exam.id} className="group relative bg-white rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-gray-100 overflow-hidden flex flex-col">
                                                                    {/* Decorative Top Border */}
                                                                    <div className={`h-1.5 w-full bg-gradient-to-r ${subjectInfo.gradient}`}></div>

                                                                    <div className="p-6 flex-1 flex flex-col">
                                                                        <div className="flex items-start justify-between mb-4">
                                                                            <span className={`px-2.5 py-1 rounded-md text-xs font-medium border ${difficultyColor}`}>
                                                                                {exam.difficulty}
                                                                            </span>
                                                                            {user && exam.userStatus && (
                                                                                <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${isCompleted ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-blue-50 text-blue-700 border border-blue-100'}`}>
                                                                                    {isCompleted ? (
                                                                                        <>
                                                                                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                                                                            Đã xong
                                                                                        </>
                                                                                    ) : 'Chưa làm'}
                                                                                </div>
                                                                            )}
                                                                        </div>

                                                                        <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 leading-snug group-hover:text-red-600 transition-colors">
                                                                            {exam.name}
                                                                        </h3>

                                                                        <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-sm text-gray-500 mb-6">
                                                                            <div className="flex items-center gap-1.5">
                                                                                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                                                                <span>{exam.duration}</span>
                                                                            </div>
                                                                            <div className="flex items-center gap-1.5">
                                                                                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                                                                                <span>100 câu</span>
                                                                            </div>
                                                                        </div>

                                                                        {/* Divider */}
                                                                        <div className="mt-auto border-t border-gray-100 pt-4">
                                                                            {isCompleted ? (
                                                                                <div className="space-y-3">
                                                                                    <div className="flex items-center justify-between text-sm">
                                                                                        <span className="text-gray-500">Kết quả tốt nhất</span>
                                                                                        <span className="font-bold text-gray-900 text-base">{exam.userStatus.totalPoints} <span className="text-xs font-normal text-gray-400">điểm</span></span>
                                                                                    </div>
                                                                                    <div className="grid grid-cols-2 gap-3">
                                                                                        <Link
                                                                                            href={`/thi-hsa-tsa/ket-qua?examId=${exam.id}`}
                                                                                            className="py-2.5 px-3 rounded-lg text-sm font-medium text-center border border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                                                                                        >
                                                                                            Xem lại
                                                                                        </Link>
                                                                                        <button
                                                                                            onClick={() => startExam(exam.id)}
                                                                                            className="py-2.5 px-3 rounded-lg text-sm font-medium text-center bg-gray-900 text-white hover:bg-black transition-colors"
                                                                                        >
                                                                                            Làm lại
                                                                                        </button>
                                                                                    </div>
                                                                                </div>
                                                                            ) : (
                                                                                <button
                                                                                    onClick={() => startExam(exam.id)}
                                                                                    className="w-full py-3 rounded-lg font-semibold text-sm bg-red-50 text-red-600 hover:bg-red-100 transition-colors flex items-center justify-center gap-2 group-hover:bg-red-600 group-hover:text-white"
                                                                                >
                                                                                    <span>Thử thách ngay</span>
                                                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                                                                                </button>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            );
                                                        })}
                                                    </div>

                                                    {hasMore && (
                                                        <div className="flex justify-center mt-6">
                                                            <button
                                                                onClick={() => toggleExpandSubject(subjectName)}
                                                                className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white border border-gray-200 text-gray-600 hover:text-red-600 hover:border-red-200 hover:bg-red-50 transition-all font-medium shadow-sm hover:shadow"
                                                            >
                                                                {isExpanded ? (
                                                                    <div className="flex items-center gap-2">
                                                                        <span>Thu gọn</span>
                                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" /></svg>
                                                                    </div>
                                                                ) : (
                                                                    <div className="flex items-center gap-2">
                                                                        <span>Xem tất cả ({exams.length} đề thi)</span>
                                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                                                                    </div>
                                                                )}
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                </div>
                            )}
                        </div>
                    </section>
                </>
            )}

            {/* Modal Bộ đề hoàn chỉnh */}
            <ExamSetGroupModal
                isOpen={isGroupModalOpen}
                onClose={() => setIsGroupModalOpen(false)}
                onStartGroupExam={handleStartGroupExam}
                examType={ExamSetGroupExamType.TSA}
            />
        </div>
    );
}
