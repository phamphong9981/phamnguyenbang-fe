'use client';

import Header from '@/components/Header';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { useExamSets, ExamSetType, SUBJECT_ID } from '@/hooks/useExam';
import { useAuth } from '@/hooks/useAuth';
import { getSubjectInfo, SubjectInfo } from '../utils';

export default function ExamPage() {
    const [selectedYear, setSelectedYear] = useState<string>('2025');
    const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');

    // multi-select môn học: 'all' hoặc mảng id
    const [selectedSubjects, setSelectedSubjects] = useState<number[] | 'all'>('all');

    const { user } = useAuth();
    const { data: examSets, isLoading, error } = useExamSets(ExamSetType.HSA, undefined, user?.id);

    // subjects có trong dữ liệu + đếm số đề
    const subjectsInData = useMemo(() => {
        const counts = new Map<number, number>();
        (examSets ?? []).forEach(e => counts.set(e.subject, (counts.get(e.subject) ?? 0) + 1));
        return [...counts.entries()].map(([id, count]) => ({ info: getSubjectInfo(id), count }));
    }, [examSets]);

    // lấy state ban đầu từ URL (?subjects=1,2&difficulty=Khó&year=2025)
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

    // years (nếu cần)
    const years = useMemo(() => (examSets ? [...new Set(examSets.map(e => e.year))] : []), [examSets]);

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
        d === 'Dễ' ? 'bg-green-100 text-green-800'
            : d === 'Trung bình' ? 'bg-yellow-100 text-yellow-800'
                : d === 'Khó' ? 'bg-orange-100 text-orange-800'
                    : d === 'Rất khó' ? 'bg-red-100 text-red-800'
                        : 'bg-gray-100 text-gray-800';

    const startExam = (examId: string) => (window.location.href = `/thi-hsa-tsa/lam-bai?examId=${examId}`);

    // toggle chọn môn
    const toggleSubject = (id: number) => {
        setSelectedSubjects(prev => {
            if (prev === 'all') return [id];
            return prev.includes(id)
                ? (prev.length === 1 ? 'all' : prev.filter(x => x !== id))
                : [...prev, id];
        });
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />

            {/* loading / error */}
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
                        <button onClick={() => window.location.reload()} className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium">
                            Thử lại
                        </button>
                    </div>
                </div>
            )}

            {!isLoading && !error && (
                <>
                    {/* hero */}
                    <section className="bg-gradient-to-r from-green-600 to-green-700 py-16">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">Thi HSA</h1>
                            <p className="text-xl text-green-100 max-w-3xl mx-auto">
                                Luyện thi với đề thi thử chất lượng cao, giúp bạn chuẩn bị tốt nhất cho kỳ thi HSA sắp tới với câu hỏi đa dạng.
                            </p>
                        </div>
                    </section>

                    {/* FILTER BAR (sticky) */}
                    <section className="sticky top-0 z-20 bg-white/90 backdrop-blur border-b">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-col gap-3">
                            <div className="flex items-center gap-2 overflow-x-auto">
                                <button
                                    onClick={() => setSelectedSubjects('all')}
                                    aria-pressed={selectedSubjects === 'all'}
                                    className={`px-3 py-2 rounded-full border text-sm whitespace-nowrap ${selectedSubjects === 'all' ? 'border-blue-600 bg-blue-50' : 'border-gray-200 bg-white'}`}
                                >
                                    Tất cả <span className="opacity-60">({examSets?.length ?? 0})</span>
                                </button>
                                {subjectsInData.map(({ info, count }) => {
                                    const active = selectedSubjects !== 'all' && selectedSubjects.includes(info.id);
                                    return (
                                        <button
                                            key={info.id}
                                            onClick={() => toggleSubject(info.id)}
                                            aria-pressed={active}
                                            className={`px-3 py-2 rounded-full border text-sm whitespace-nowrap
                        ${active ? 'border-blue-600 bg-blue-50' : 'border-gray-200 bg-white'}`}
                                        >
                                            <span className={`inline-block w-2 h-2 rounded-full mr-2 ${info.dot}`} />
                                            {info.name} <span className="opacity-60">({count})</span>
                                        </button>
                                    );
                                })}
                            </div>

                            {/* ví dụ thêm filter độ khó (nếu muốn hiển thị) */}
                            {/* <div className="flex items-center gap-2 overflow-x-auto">
                {difficulties.map(d => (
                  <button key={d} onClick={() => setSelectedDifficulty(d)}
                    className={`px-3 py-1.5 rounded-full border text-sm ${selectedDifficulty===d?'border-emerald-600 bg-emerald-50':'border-gray-200 bg-white'}`}>
                    {d === 'all' ? 'Mọi độ khó' : d}
                  </button>
                ))}
              </div> */}
                        </div>
                    </section>

                    {/* list */}
                    <section className="py-12">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            {Object.keys(groupedExams).length === 0 ? (
                                <div className="text-center py-12">
                                    <div className="text-gray-400 text-6xl mb-4">📝</div>
                                    <h3 className="text-xl font-semibold text-gray-600 mb-2">Không tìm thấy đề thi</h3>
                                    <p className="text-gray-500">Hãy thay đổi bộ lọc để tìm đề thi phù hợp.</p>
                                </div>
                            ) : (
                                <div className="space-y-12">
                                    {Object.entries(groupedExams)
                                        .sort((a, b) => {
                                            const subjectOrder = [
                                                SUBJECT_ID.MATH,
                                                SUBJECT_ID.PHYSICS,
                                                SUBJECT_ID.CHEMISTRY,
                                                SUBJECT_ID.BIOLOGY,
                                                SUBJECT_ID.LITERATURE,
                                                SUBJECT_ID.GEOGRAPHY,
                                                SUBJECT_ID.HISTORY,
                                                SUBJECT_ID.ENGLISH,
                                                SUBJECT_ID.SCIENCE,
                                            ];
                                            const aId = (a[1].subjectInfo as any).id ?? 0;
                                            const bId = (b[1].subjectInfo as any).id ?? 0;
                                            return subjectOrder.indexOf(aId) - subjectOrder.indexOf(bId);
                                        })
                                        .map(([subjectName, { subjectInfo, exams }]) => (
                                            <div key={subjectName} className="space-y-6">
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-4 h-4 rounded-full ${subjectInfo.dot}`} />
                                                    <h2 className={`text-2xl font-bold ${subjectInfo.text}`}>{subjectName}</h2>
                                                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${subjectInfo.badge} border ${subjectInfo.border}`}>
                                                        {exams.length} đề thi
                                                    </span>
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                                    {exams.map(exam => (
                                                        <div key={exam.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all border border-gray-100">
                                                            <div className={`bg-gradient-to-r ${subjectInfo.gradient} px-6 py-4`}>
                                                                <div className="flex items-center justify-between">
                                                                    <div>
                                                                        <h3 className="text-lg font-bold text-white leading-tight">{exam.name}</h3>
                                                                        <p className="text-white/90 text-sm">{subjectName}</p>
                                                                    </div>
                                                                    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getDifficultyColor(exam.difficulty)}`}>
                                                                        {exam.difficulty ?? '—'}
                                                                    </span>
                                                                </div>
                                                            </div> 

                                                            <div className="p-6 flex flex-col gap-4">
                                                                <div className="grid grid-cols-2 gap-4">
                                                                    <div className="bg-gray-50 rounded-lg p-3">
                                                                        <div className="flex items-center gap-2 text-sm text-gray-700">
                                                                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                                                                            </svg>
                                                                            Thời gian
                                                                        </div>
                                                                        <p className="text-lg font-bold text-gray-900 mt-1">{exam.duration}</p>
                                                                    </div>
                                                                    <div className="bg-gray-50 rounded-lg p-3">
                                                                        <div className="flex items-center gap-2 text-sm text-gray-700">
                                                                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                                                <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                                                                            </svg>
                                                                            Câu hỏi
                                                                        </div>
                                                                    </div>
                                                                </div>

                                                                <div>
                                                                    <h4 className="text-sm font-semibold text-gray-900 mb-1">Mô tả đề thi:</h4>
                                                                    <p className="text-sm text-gray-600 leading-relaxed">{exam.description}</p>
                                                                </div>

                                                                {user && exam.userStatus && (
                                                                    <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                                                                        <div className="flex items-center justify-between mb-2">
                                                                            <span className="text-sm font-medium text-gray-700">Trạng thái:</span>
                                                                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${exam.userStatus.isCompleted ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                                                                                {exam.userStatus.isCompleted ? 'Đã hoàn thành' : 'Chưa làm'}
                                                                            </span>
                                                                        </div>
                                                                        {exam.userStatus.isCompleted && (
                                                                            <div className="space-y-2">
                                                                                <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                                                                                    <div>Điểm: <span className="font-semibold text-green-600">{exam.userStatus.totalPoints}</span></div>
                                                                                    <div>Thời gian: <span className="font-semibold">{exam.userStatus.totalTime}s</span></div>
                                                                                </div>
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                )}

                                                                {user && exam.userStatus?.isCompleted ? (
                                                                    <Link
                                                                        href={`/thi-hsa-tsa/ket-qua?examId=${exam.id}`}
                                                                        className="w-full inline-flex items-center justify-center py-3 px-4 rounded-lg font-semibold shadow bg-white text-green-700 border border-green-200 hover:bg-green-50"
                                                                    >
                                                                        Xem chi tiết kết quả
                                                                    </Link>
                                                                ) : (
                                                                    <button
                                                                        onClick={() => startExam(exam.id)}
                                                                        className={`w-full py-3 px-4 rounded-lg font-semibold shadow bg-gradient-to-r ${subjectInfo.gradient} text-white hover:brightness-110`}
                                                                    >
                                                                        Bắt đầu làm bài
                                                                    </button>
                                                                )}
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

                    {/* stats */}
                    <section className="bg-green-600 py-16">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
                                <div><div className="text-4xl font-bold text-white mb-2">1</div><div className="text-green-100">Đề thi</div></div>
                                <div><div className="text-4xl font-bold text-white mb-2">1</div><div className="text-green-100">Loại thi</div></div>
                                <div><div className="text-4xl font-bold text-white mb-2">100</div><div className="text-green-100">Câu hỏi</div></div>
                                <div><div className="text-4xl font-bold text-white mb-2">100%</div><div className="text-green-100">Miễn phí</div></div>
                            </div>
                        </div>
                    </section>
                </>
            )}
        </div>
    );
}
