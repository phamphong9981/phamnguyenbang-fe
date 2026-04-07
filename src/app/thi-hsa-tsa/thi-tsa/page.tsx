'use client';

import Header from '@/components/Header';
import { useMemo, useState, useEffect } from 'react';
import { useExamSets, ExamSetType, SUBJECT_ID, ExamSetGroupExamType, ExamSetGroupType } from '@/hooks/useExam';
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';
import { getSubjectInfo, SubjectInfo } from '../utils';
import ExamSetGroupModal from '@/components/exam/ExamSetGroupModal';
import { ExamSetGroupResponseDto } from '@/hooks/useExam';
import { useLeaderboard, LeaderboardType } from '@/hooks/useLeaderboard';

export default function ThiTSAPage() {
    const [selectedYear, setSelectedYear] = useState<string>('all');
    const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
    const [selectedSubjects, setSelectedSubjects] = useState<number[] | 'all'>('all');
    const [expandedSubjects, setExpandedSubjects] = useState<Record<string, boolean>>({});

    const { user } = useAuth();
    const { data: examSets, isLoading, error } = useExamSets(ExamSetType.TSA, undefined, user?.id);
    const { data: leaderboard } = useLeaderboard(LeaderboardType.TSA);

    const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);

    const subjectsInData = useMemo(() => {
        const counts = new Map<number, number>();
        (examSets ?? []).forEach(e => counts.set(e.subject, (counts.get(e.subject) ?? 0) + 1));
        return [...counts.entries()].map(([id, count]) => ({ info: getSubjectInfo(id), count }));
    }, [examSets]);

    useEffect(() => {
        const p = new URLSearchParams(location.search);
        if (p.get('year')) setSelectedYear(p.get('year')!);
        if (p.get('difficulty')) setSelectedDifficulty(p.get('difficulty')!);
        if (p.get('subjects')) {
            const arr = p.get('subjects')!.split(',').map(v => Number(v)).filter(Boolean);
            if (arr.length) setSelectedSubjects(arr);
        }
    }, []);

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

    const groupedExams = useMemo(() => {
        return filteredExams.reduce((groups, exam) => {
            const subjectInfo = getSubjectInfo(exam.subject);
            const subjectName = subjectInfo.name;
            if (!groups[subjectName]) groups[subjectName] = { subjectInfo, exams: [] as any[] };
            groups[subjectName].exams.push(exam);
            return groups;
        }, {} as Record<string, { subjectInfo: SubjectInfo; exams: any[] }>);
    }, [filteredExams]);

    const getDifficultyConfig = (d: string) => {
        if (d === 'Dễ') return { cls: 'bg-emerald-100 text-emerald-700 border border-emerald-200', label: 'Easy' };
        if (d === 'Trung bình') return { cls: 'bg-amber-100 text-amber-700 border border-amber-200', label: 'Medium' };
        if (d === 'Khó') return { cls: 'bg-orange-100 text-orange-700 border border-orange-200', label: 'Hard' };
        if (d === 'Rất khó') return { cls: 'bg-red-100 text-red-700 border border-red-200', label: 'Expert' };
        return { cls: 'bg-gray-100 text-gray-600 border border-gray-200', label: d };
    };

    const startExam = (examId: string, hasPassword?: boolean) => {
        const params = new URLSearchParams({ examId });
        if (hasPassword) {
            const enteredPassword = window.prompt('Đề thi này có mật khẩu. Vui lòng nhập mật khẩu để bắt đầu làm bài:');
            if (!enteredPassword) return;
            params.set('password', enteredPassword);
        }
        window.location.href = `/thi-hsa-tsa/lam-bai?${params.toString()}`;
    };

    const handleStartGroupExam = (group: ExamSetGroupResponseDto, type?: ExamSetGroupType | null) => {
        sessionStorage.setItem('examSetGroup', JSON.stringify(group));
        sessionStorage.setItem('examType', ExamSetType.TSA);
        let url = `/thi-hsa-tsa/lam-bai-group-tsa?groupId=${group.id}`;
        if (type) url += `&type=${type}`;
        window.location.href = url;
    };

    const toggleSubject = (id: number) => {
        setSelectedSubjects(prev => {
            if (prev === 'all') return [id];
            return prev.includes(id)
                ? (prev.length === 1 ? 'all' : prev.filter(x => x !== id))
                : [...prev, id];
        });
    };

    const toggleExpandSubject = (subjectName: string) => {
        setExpandedSubjects(prev => ({ ...prev, [subjectName]: !prev[subjectName] }));
    };

    const topPerformers = leaderboard?.entries?.slice(0, 5) ?? [];
    const totalExamCount = examSets?.length ?? 0;

    // TSA accent colors (indigo/blue palette)
    const ACCENT = '#4f46e5';      // indigo-600
    const ACCENT_DARK = '#3730a3'; // indigo-800
    const ACCENT_LIGHT = '#eef2ff'; // indigo-50
    const ACCENT_MID = '#c7d2fe'; // indigo-200

    return (
        <div className="min-h-screen font-sans" style={{ background: '#f5f3ff', fontFamily: "'Inter', sans-serif" }}>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Inter:wght@300;400;500;600;700&display=swap');
                @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap');
                .material-symbols-outlined { font-family: 'Material Symbols Outlined'; font-weight: normal; font-style: normal; font-size: 20px; line-height: 1; letter-spacing: normal; text-transform: none; display: inline-block; white-space: nowrap; word-wrap: normal; direction: ltr; font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24; }
                .ms-fill { font-variation-settings: 'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24; }
                .tsa-exam-card { transition: transform 0.25s ease, box-shadow 0.25s ease; }
                .tsa-exam-card:hover { transform: translateY(-4px); box-shadow: 0 20px 40px rgba(79,70,229,0.14); }
                .tsa-chip { transition: all 0.2s ease; }
                .tsa-chip:hover { transform: translateY(-1px); }
                .tsa-start-btn { transition: background 0.2s ease; }
                .tsa-start-btn:hover { background: ${ACCENT_DARK}; }
                .tsa-expand-btn { transition: all 0.2s ease; }
                .tsa-expand-btn:hover { border-color: ${ACCENT}; background: ${ACCENT_LIGHT}; color: ${ACCENT}; }
                h1, h2, h3, h4 { font-family: 'Plus Jakarta Sans', sans-serif; }
            `}</style>

            <Header />

            {/* ── Hero ── */}
            <section style={{
                background: `linear-gradient(135deg, ${ACCENT_DARK} 0%, ${ACCENT} 60%, #6366f1 100%)`,
                position: 'relative', overflow: 'hidden'
            }}>
                <div style={{
                    position: 'absolute', right: '-80px', top: '-80px',
                    width: '380px', height: '380px',
                    background: '#f59e0b', opacity: 0.12,
                    borderRadius: '9999px', filter: 'blur(60px)'
                }} />
                <div style={{
                    position: 'absolute', left: '-40px', bottom: '-60px',
                    width: '280px', height: '280px',
                    background: '#06b6d4', opacity: 0.1,
                    borderRadius: '9999px', filter: 'blur(48px)'
                }} />

                <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '48px 32px', position: 'relative', zIndex: 1 }}>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '32px', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ maxWidth: '600px' }}>
                            <span style={{
                                display: 'inline-block', padding: '4px 16px',
                                borderRadius: '9999px', background: 'rgba(255,255,255,0.18)',
                                fontSize: '11px', fontWeight: 700, letterSpacing: '0.1em',
                                textTransform: 'uppercase', color: '#fff', marginBottom: '16px'
                            }}>Scholastic Atelier · TSA</span>
                            <h1 style={{
                                fontSize: 'clamp(28px,5vw,48px)', fontWeight: 800,
                                color: '#fff', marginBottom: '16px', lineHeight: 1.15, letterSpacing: '-0.03em'
                            }}>Kỳ thi Tư duy TSA</h1>
                            <p style={{ fontSize: '17px', color: 'rgba(255,255,255,0.88)', lineHeight: 1.7, marginBottom: '32px' }}>
                                Thử thách bản thân với bộ đề thi Tư duy logic, Toán học và Giải quyết vấn đề theo chuẩn TSA ĐHQG HCM.
                            </p>

                            {/* Stats */}
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '12px' }}>
                                {[
                                    { label: 'Đề thi thử', value: `${totalExamCount}+` },
                                    { label: 'Câu hỏi', value: '120' },
                                    { label: 'Phút làm bài', value: '150' },
                                    { label: 'Tỷ lệ đỗ', value: '96%' },
                                ].map(stat => (
                                    <div key={stat.label} style={{
                                        background: 'rgba(255,255,255,0.12)',
                                        backdropFilter: 'blur(12px)',
                                        border: '1px solid rgba(255,255,255,0.15)',
                                        borderRadius: '16px', padding: '16px 12px', textAlign: 'center'
                                    }}>
                                        <p style={{ fontSize: '22px', fontWeight: 800, color: '#fff', lineHeight: 1 }}>{stat.value}</p>
                                        <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.75)', marginTop: '4px', fontWeight: 500 }}>{stat.label}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* CTA */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', minWidth: '200px' }}>
                            <button
                                onClick={() => setIsGroupModalOpen(true)}
                                style={{
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                                    padding: '14px 24px', borderRadius: '14px',
                                    background: '#fbbf24', color: '#1c1917',
                                    fontWeight: 800, fontSize: '15px', border: 'none', cursor: 'pointer',
                                    boxShadow: '0 8px 24px rgba(251,191,36,0.35)'
                                }}
                            >
                                <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>assignment</span>
                                Làm bộ đề hoàn chỉnh
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Loading ── */}
            {isLoading && (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '400px' }}>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{
                            width: '48px', height: '48px', border: `3px solid ${ACCENT_LIGHT}`,
                            borderTopColor: ACCENT, borderRadius: '50%',
                            animation: 'spin 0.8s linear infinite', margin: '0 auto 16px'
                        }} />
                        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                        <p style={{ color: '#4b5563', fontWeight: 500 }}>Đang tải đề thi...</p>
                    </div>
                </div>
            )}

            {/* ── Error ── */}
            {error && (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '400px' }}>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '48px', marginBottom: '16px' }}>⚠️</div>
                        <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#1e1b4b', marginBottom: '8px' }}>Lỗi tải đề thi</h2>
                        <p style={{ color: '#6b7280', marginBottom: '20px' }}>Đã có lỗi xảy ra. Vui lòng thử lại sau.</p>
                        <button
                            onClick={() => window.location.reload()}
                            style={{
                                background: ACCENT, color: '#fff',
                                padding: '10px 24px', borderRadius: '10px',
                                fontWeight: 600, border: 'none', cursor: 'pointer'
                            }}
                        >Thử lại</button>
                    </div>
                </div>
            )}

            {/* ── Main Content ── */}
            {!isLoading && !error && (
                <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '40px 24px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '32px', alignItems: 'start' }}>

                        {/* LEFT: Filters + Exam List */}
                        <div>
                            {/* Filter Bar */}
                            <div style={{
                                background: '#fff', borderRadius: '20px',
                                padding: '20px 24px', marginBottom: '28px',
                                boxShadow: '0 2px 12px rgba(79,70,229,0.07)',
                                border: `1px solid ${ACCENT_MID}`
                            }}>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'center' }}>
                                    {/* Subject chips */}
                                    <div style={{ flex: 1 }}>
                                        <p style={{ fontSize: '11px', fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '10px' }}>Môn học</p>
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                            <button
                                                onClick={() => setSelectedSubjects('all')}
                                                className="tsa-chip"
                                                style={{
                                                    padding: '6px 14px', borderRadius: '9999px', fontSize: '12px', fontWeight: 600,
                                                    border: '1.5px solid',
                                                    borderColor: selectedSubjects === 'all' ? ACCENT : '#c7d2fe',
                                                    background: selectedSubjects === 'all' ? ACCENT : 'transparent',
                                                    color: selectedSubjects === 'all' ? '#fff' : '#4b5563',
                                                    cursor: 'pointer'
                                                }}
                                            >Tất cả</button>
                                            {subjectsInData.map(({ info, count }) => {
                                                const isSelected = selectedSubjects !== 'all' && selectedSubjects.includes((info as any).id);
                                                return (
                                                    <button
                                                        key={(info as any).id}
                                                        onClick={() => toggleSubject((info as any).id)}
                                                        className="tsa-chip"
                                                        style={{
                                                            padding: '6px 14px', borderRadius: '9999px', fontSize: '12px', fontWeight: 600,
                                                            border: '1.5px solid',
                                                            borderColor: isSelected ? ACCENT : '#c7d2fe',
                                                            background: isSelected ? ACCENT : 'transparent',
                                                            color: isSelected ? '#fff' : '#4b5563',
                                                            cursor: 'pointer'
                                                        }}
                                                    >
                                                        {info.name} <span style={{ opacity: 0.7 }}>({count})</span>
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    <div style={{ width: '1px', height: '40px', background: ACCENT_LIGHT }} />

                                    {/* Difficulty chips */}
                                    <div>
                                        <p style={{ fontSize: '11px', fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '10px' }}>Độ khó</p>
                                        <div style={{ display: 'flex', gap: '6px' }}>
                                            {['all', 'Dễ', 'Trung bình', 'Khó', 'Rất khó'].map(d => (
                                                <button
                                                    key={d}
                                                    onClick={() => setSelectedDifficulty(d)}
                                                    className="tsa-chip"
                                                    style={{
                                                        padding: '6px 12px', borderRadius: '9999px', fontSize: '12px', fontWeight: 600,
                                                        border: '1.5px solid',
                                                        borderColor: selectedDifficulty === d ? ACCENT : '#c7d2fe',
                                                        background: selectedDifficulty === d ? ACCENT : 'transparent',
                                                        color: selectedDifficulty === d ? '#fff' : '#4b5563',
                                                        cursor: 'pointer', whiteSpace: 'nowrap'
                                                    }}
                                                >{d === 'all' ? 'Tất cả' : d}</button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Exam Groups */}
                            {Object.keys(groupedExams).length === 0 ? (
                                <div style={{
                                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                                    padding: '80px 24px',
                                    background: '#fff', borderRadius: '24px',
                                    border: `2px dashed ${ACCENT_MID}`
                                }}>
                                    <span className="material-symbols-outlined" style={{ fontSize: '48px', color: ACCENT_MID, marginBottom: '16px' }}>search_off</span>
                                    <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#1e1b4b', marginBottom: '8px' }}>Không tìm thấy đề thi TSA</h3>
                                    <p style={{ color: '#6b7280', marginBottom: '20px' }}>Hãy thử thay đổi bộ lọc tìm kiếm.</p>
                                    <button
                                        onClick={() => { setSelectedSubjects('all'); setSelectedDifficulty('all'); }}
                                        style={{
                                            padding: '8px 20px', borderRadius: '10px',
                                            background: ACCENT_LIGHT, color: ACCENT,
                                            fontWeight: 600, fontSize: '14px', border: 'none', cursor: 'pointer'
                                        }}
                                    >Xóa bộ lọc</button>
                                </div>
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '36px' }}>
                                    {Object.entries(groupedExams)
                                        .sort((a, b) => {
                                            const subjectOrder = [
                                                SUBJECT_ID.MATH, SUBJECT_ID.SCIENCE, SUBJECT_ID.LITERATURE,
                                                SUBJECT_ID.ENGLISH, SUBJECT_ID.PHYSICS, SUBJECT_ID.CHEMISTRY,
                                                SUBJECT_ID.BIOLOGY, SUBJECT_ID.HISTORY, SUBJECT_ID.GEOGRAPHY,
                                            ];
                                            const aId = (a[1].subjectInfo as any).id ?? 0;
                                            const bId = (b[1].subjectInfo as any).id ?? 0;
                                            return subjectOrder.indexOf(aId) - subjectOrder.indexOf(bId);
                                        })
                                        .map(([subjectName, { subjectInfo, exams }]) => {
                                            const isExpanded = expandedSubjects[subjectName];
                                            const displayExams = isExpanded ? exams : exams.slice(0, 6);
                                            const hasMore = exams.length > 6;

                                            return (
                                                <div key={subjectName}>
                                                    {/* Subject Header */}
                                                    <div style={{
                                                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                                        marginBottom: '20px', paddingBottom: '16px',
                                                        borderBottom: `2px solid ${ACCENT_LIGHT}`,
                                                        position: 'sticky', top: '72px',
                                                        background: '#f5f3ff', zIndex: 10, paddingTop: '8px'
                                                    }}>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                            <div style={{
                                                                width: '10px', height: '10px', borderRadius: '50%',
                                                                background: ACCENT, boxShadow: `0 0 0 4px ${ACCENT_LIGHT}`
                                                            }} />
                                                            <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#1e1b4b', letterSpacing: '-0.02em' }}>{subjectName}</h2>
                                                            <span style={{
                                                                padding: '2px 10px', borderRadius: '9999px',
                                                                background: ACCENT_LIGHT, color: ACCENT,
                                                                fontSize: '12px', fontWeight: 700
                                                            }}>{exams.length}</span>
                                                        </div>
                                                    </div>

                                                    {/* Cards Grid */}
                                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: '20px' }}>
                                                        {displayExams.map((exam) => {
                                                            const isCompleted = exam.userStatus?.isCompleted;
                                                            const diffConfig = getDifficultyConfig(exam.difficulty);

                                                            return (
                                                                <div key={exam.id} className="tsa-exam-card" style={{
                                                                    background: '#fff', borderRadius: '20px',
                                                                    border: `1px solid ${ACCENT_MID}`,
                                                                    overflow: 'hidden', display: 'flex', flexDirection: 'column',
                                                                    boxShadow: '0 2px 8px rgba(79,70,229,0.07)'
                                                                }}>
                                                                    {/* Top accent bar */}
                                                                    <div style={{
                                                                        height: '4px',
                                                                        background: isCompleted
                                                                            ? `linear-gradient(90deg,${ACCENT},#818cf8)`
                                                                            : 'linear-gradient(90deg,#6366f1,#a5b4fc)'
                                                                    }} />

                                                                    <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                                                                        {/* Tags */}
                                                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                                                                            <span style={{
                                                                                padding: '4px 10px', borderRadius: '9999px',
                                                                                fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em'
                                                                            }} className={diffConfig.cls}>{diffConfig.label}</span>

                                                                            {user && exam.userStatus && (
                                                                                <span style={{
                                                                                    display: 'flex', alignItems: 'center', gap: '4px',
                                                                                    padding: '4px 10px', borderRadius: '9999px', fontSize: '11px', fontWeight: 600,
                                                                                    background: isCompleted ? ACCENT_LIGHT : '#f0fdf4',
                                                                                    color: isCompleted ? ACCENT : '#16a34a'
                                                                                }}>
                                                                                    {isCompleted ? (
                                                                                        <><span className="material-symbols-outlined ms-fill" style={{ fontSize: '14px', color: ACCENT }}>check_circle</span>Đã xong</>
                                                                                    ) : 'Chưa làm'}
                                                                                </span>
                                                                            )}
                                                                        </div>

                                                                        {/* Title */}
                                                                        <h3 style={{
                                                                            fontSize: '16px', fontWeight: 700, color: '#1e1b4b',
                                                                            marginBottom: '16px', lineHeight: 1.4,
                                                                            display: '-webkit-box', WebkitLineClamp: 2,
                                                                            WebkitBoxOrient: 'vertical', overflow: 'hidden'
                                                                        }}>{exam.name}</h3>

                                                                        {/* Meta */}
                                                                        <div style={{ display: 'flex', gap: '16px', marginBottom: '8px' }}>
                                                                            <span style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '13px', color: '#6b7280' }}>
                                                                                <span className="material-symbols-outlined" style={{ fontSize: '15px' }}>timer</span>
                                                                                {exam.duration}
                                                                            </span>
                                                                            <span style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '13px', color: '#6b7280' }}>
                                                                                <span className="material-symbols-outlined" style={{ fontSize: '15px' }}>help_outline</span>
                                                                                100 câu
                                                                            </span>
                                                                        </div>

                                                                        {/* Actions */}
                                                                        <div style={{ marginTop: 'auto', paddingTop: '16px', borderTop: `1px solid ${ACCENT_LIGHT}` }}>
                                                                            {isCompleted ? (
                                                                                <div>
                                                                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                                                                                        <span style={{ fontSize: '13px', color: '#6b7280' }}>Điểm tốt nhất</span>
                                                                                        <span style={{ fontSize: '18px', fontWeight: 800, color: ACCENT }}>
                                                                                            {exam.userStatus.totalPoints}
                                                                                            <span style={{ fontSize: '11px', fontWeight: 400, color: '#9ca3af', marginLeft: '2px' }}>đ</span>
                                                                                        </span>
                                                                                    </div>
                                                                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                                                                                        <Link
                                                                                            href={`/thi-hsa-tsa/ket-qua?examId=${exam.id}`}
                                                                                            style={{
                                                                                                display: 'block', textAlign: 'center',
                                                                                                padding: '10px', borderRadius: '12px',
                                                                                                fontSize: '13px', fontWeight: 600,
                                                                                                border: `1.5px solid ${ACCENT_MID}`, color: '#4b5563',
                                                                                                textDecoration: 'none'
                                                                                            }}
                                                                                        >Xem lại</Link>
                                                                                        <button
                                                                                            onClick={() => startExam(exam.id, exam.hasPassword)}
                                                                                            className="tsa-start-btn"
                                                                                            style={{
                                                                                                padding: '10px', borderRadius: '12px',
                                                                                                fontSize: '13px', fontWeight: 700,
                                                                                                background: ACCENT, color: '#fff',
                                                                                                border: 'none', cursor: 'pointer'
                                                                                            }}
                                                                                        >Làm lại</button>
                                                                                    </div>
                                                                                </div>
                                                                            ) : (
                                                                                <button
                                                                                    onClick={() => startExam(exam.id, exam.hasPassword)}
                                                                                    className="tsa-start-btn"
                                                                                    style={{
                                                                                        width: '100%', padding: '12px',
                                                                                        borderRadius: '14px', fontSize: '14px', fontWeight: 700,
                                                                                        background: ACCENT, color: '#fff',
                                                                                        border: 'none', cursor: 'pointer',
                                                                                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
                                                                                    }}
                                                                                >
                                                                                    Thử thách ngay
                                                                                    <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>arrow_forward</span>
                                                                                </button>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            );
                                                        })}
                                                    </div>

                                                    {/* Expand / Collapse */}
                                                    {hasMore && (
                                                        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                                                            <button
                                                                onClick={() => toggleExpandSubject(subjectName)}
                                                                className="tsa-expand-btn"
                                                                style={{
                                                                    display: 'flex', alignItems: 'center', gap: '8px',
                                                                    padding: '10px 24px', borderRadius: '9999px',
                                                                    background: '#fff', border: `1.5px solid ${ACCENT_MID}`,
                                                                    color: '#6b7280', fontWeight: 600, fontSize: '13px', cursor: 'pointer',
                                                                    boxShadow: '0 1px 4px rgba(79,70,229,0.08)'
                                                                }}
                                                            >
                                                                {isExpanded ? (
                                                                    <>
                                                                        <span>Thu gọn</span>
                                                                        <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>expand_less</span>
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        <span>Xem tất cả ({exams.length} đề thi)</span>
                                                                        <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>expand_more</span>
                                                                    </>
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

                        {/* RIGHT: Sidebar */}
                        <aside style={{ display: 'flex', flexDirection: 'column', gap: '24px', position: 'sticky', top: '88px' }}>

                            {/* Top Performers */}
                            <div style={{
                                background: '#fff', borderRadius: '24px',
                                padding: '24px',
                                boxShadow: '0 4px 20px rgba(79,70,229,0.09)',
                                border: `1px solid ${ACCENT_MID}`
                            }}>
                                <h3 style={{
                                    fontSize: '16px', fontWeight: 800, color: '#1e1b4b',
                                    marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px'
                                }}>
                                    <span className="material-symbols-outlined ms-fill" style={{ color: '#f59e0b', fontSize: '22px' }}>emoji_events</span>
                                    Top Performers
                                </h3>

                                {topPerformers.length === 0 ? (
                                    <p style={{ color: '#9ca3af', fontSize: '13px', textAlign: 'center', padding: '16px 0' }}>
                                        Chưa có dữ liệu bảng xếp hạng
                                    </p>
                                ) : (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                        {topPerformers.map((entry, idx) => (
                                            <div key={entry.profileId} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                    <div style={{
                                                        width: '36px', height: '36px', borderRadius: '50%',
                                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                        fontWeight: 800, fontSize: '14px', flexShrink: 0,
                                                        background: idx === 0 ? '#fbbf24' : idx === 1 ? ACCENT_LIGHT : idx === 2 ? '#fef3c7' : '#f9fafb',
                                                        color: idx === 0 ? '#1c1917' : idx === 1 ? ACCENT : idx === 2 ? '#92400e' : '#4b5563',
                                                    }}>{idx + 1}</div>
                                                    <div>
                                                        <p style={{ fontSize: '13px', fontWeight: 700, color: '#1e1b4b' }}>{entry.fullname}</p>
                                                        <p style={{ fontSize: '11px', color: '#9ca3af' }}>{entry.class}</p>
                                                    </div>
                                                </div>
                                                <span style={{ fontSize: '16px', fontWeight: 800, color: ACCENT }}>
                                                    {entry.totalPoints}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Quick Resources */}
                            <div style={{
                                background: `linear-gradient(135deg,${ACCENT_LIGHT} 0%,#e0e7ff 100%)`,
                                borderRadius: '24px', padding: '24px',
                                border: `1px solid ${ACCENT_MID}`
                            }}>
                                <h4 style={{ fontSize: '13px', fontWeight: 800, color: ACCENT_DARK, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '14px' }}>
                                    Tài nguyên học tập
                                </h4>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                    {['Cấu trúc TSA', 'Tư duy logic', 'Mẹo đọc nhanh', 'Toán TSA', 'Đề chuẩn 2025'].map(tag => (
                                        <span key={tag} style={{
                                            padding: '6px 12px', background: '#fff',
                                            borderRadius: '8px', fontSize: '12px', fontWeight: 600,
                                            color: ACCENT, boxShadow: '0 1px 4px rgba(79,70,229,0.1)',
                                            cursor: 'pointer'
                                        }}>{tag}</span>
                                    ))}
                                </div>
                            </div>

                            {/* Exam Structure Info */}
                            <div style={{
                                background: '#1e1b4b',
                                borderRadius: '24px', padding: '24px',
                                position: 'relative', overflow: 'hidden'
                            }}>
                                <div style={{
                                    position: 'absolute', bottom: '-24px', right: '-24px',
                                    width: '120px', height: '120px',
                                    background: 'rgba(99,102,241,0.3)', borderRadius: '50%', filter: 'blur(30px)'
                                }} />
                                <h3 style={{ fontSize: '11px', fontWeight: 700, color: '#a5b4fc', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '12px' }}>
                                    Cấu trúc đề TSA
                                </h3>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', position: 'relative', zIndex: 1 }}>
                                    {[
                                        { label: 'Tư duy Toán học', icon: 'functions', val: '40 câu' },
                                        { label: 'Tư duy Đọc hiểu', icon: 'history_edu', val: '40 câu' },
                                        { label: 'Giải quyết vấn đề', icon: 'psychology', val: '40 câu' },
                                    ].map(item => (
                                        <div key={item.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                            <span style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'rgba(255,255,255,0.75)' }}>
                                                <span className="material-symbols-outlined" style={{ fontSize: '16px', color: '#818cf8' }}>{item.icon}</span>
                                                {item.label}
                                            </span>
                                            <span style={{ fontSize: '13px', fontWeight: 700, color: '#fff' }}>{item.val}</span>
                                        </div>
                                    ))}
                                    <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '10px', display: 'flex', justifyContent: 'space-between' }}>
                                        <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>Tổng thời gian</span>
                                        <span style={{ fontSize: '13px', fontWeight: 700, color: '#c7d2fe' }}>150 phút</span>
                                    </div>
                                </div>
                            </div>
                        </aside>
                    </div>
                </div>
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
