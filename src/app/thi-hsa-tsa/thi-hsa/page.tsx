'use client';

import Header from '@/components/Header';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { useExamSets, ExamSetType, SUBJECT_ID, ExamSetGroupExamType, ExamSetGroupType } from '@/hooks/useExam';
import { useAuth } from '@/hooks/useAuth';
import { getSubjectInfo, SubjectInfo } from '../utils';
import ExamSetGroupModal from '@/components/exam/ExamSetGroupModal';
import ExamLeaderboardModal from '@/components/exam/ExamLeaderboardModal';
import { ExamSetGroupResponseDto } from '@/hooks/useExam';
import { useLeaderboard, LeaderboardType } from '@/hooks/useLeaderboard';
import GuestProfileModal from '@/components/exam/GuestProfileModal';
import { GuestProfileDto } from '@/hooks/useExam';

export default function ExamPage() {
    const [selectedYear, setSelectedYear] = useState<string>('all');
    const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
    const [selectedSubjects, setSelectedSubjects] = useState<number[] | 'all'>('all');

    const { user, isAuthenticated, isLoading: isAuthLoading } = useAuth();
    const { data: examSets, isLoading, error } = useExamSets(ExamSetType.HSA, undefined, user?.id);
    const { data: leaderboard } = useLeaderboard(LeaderboardType.HSA);

    const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
    const [leaderboardExam, setLeaderboardExam] = useState<{ id: string; name: string; password?: string } | null>(null);
    const [guestModalExam, setGuestModalExam] = useState<{ examId: string; hasPassword?: boolean } | null>(null);

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

    const years = useMemo(() => (examSets ? [...new Set(examSets.map(e => e.year))] : []), [examSets]);

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

    const startExam = (examId: string, hasPassword?: boolean, isFree?: boolean) => {
        if (!isAuthenticated && !isFree) {
            return;
        }
        // For free exams by unauthenticated users, collect profile first
        if (isFree && !isAuthenticated) {
            setGuestModalExam({ examId, hasPassword });
            return;
        }
        const params = new URLSearchParams({ examId });
        if (isFree) params.set('isFree', 'true');
        if (hasPassword) {
            const enteredPassword = window.prompt('Đề thi này có mật khẩu. Vui lòng nhập mật khẩu để bắt đầu làm bài:');
            if (!enteredPassword) return;
            params.set('password', enteredPassword);
        }
        window.location.href = `/thi-hsa-tsa/lam-bai?${params.toString()}`;
    };

    const handleGuestProfileConfirm = (profile: GuestProfileDto) => {
        if (!guestModalExam) return;
        sessionStorage.setItem('guestProfile', JSON.stringify(profile));
        const { examId, hasPassword } = guestModalExam;
        setGuestModalExam(null);
        const params = new URLSearchParams({ examId, isFree: 'true' });
        if (hasPassword) {
            const enteredPassword = window.prompt('Đề thi này có mật khẩu. Vui lòng nhập mật khẩu để bắt đầu làm bài:');
            if (!enteredPassword) return;
            params.set('password', enteredPassword);
        }
        window.location.href = `/thi-hsa-tsa/lam-bai?${params.toString()}`;
    };

    const handleStartGroupExam = (group: ExamSetGroupResponseDto, type?: ExamSetGroupType | null) => {
        sessionStorage.setItem('examSetGroup', JSON.stringify(group));
        sessionStorage.setItem('examType', ExamSetType.HSA);
        let url = `/thi-hsa-tsa/lam-bai-group-hsa?groupId=${group.id}`;
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

    const topPerformers = leaderboard?.entries?.slice(0, 5) ?? [];
    const totalExamCount = examSets?.length ?? 0;

    return (
        <div className="min-h-screen font-sans" style={{ background: '#f4faff', fontFamily: "'Inter', sans-serif" }}>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Inter:wght@300;400;500;600;700&display=swap');
                @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap');
                .material-symbols-outlined { font-family: 'Material Symbols Outlined'; font-weight: normal; font-style: normal; font-size: 20px; line-height: 1; letter-spacing: normal; text-transform: none; display: inline-block; white-space: nowrap; word-wrap: normal; direction: ltr; font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24; }
                .ms-fill { font-variation-settings: 'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24; }
                .exam-card:hover { transform: translateY(-4px); box-shadow: 0 20px 40px rgba(0,107,50,0.12); }
                .exam-card { transition: transform 0.25s ease, box-shadow 0.25s ease; }
                .subject-chip { transition: all 0.2s ease; }
                .subject-chip:hover { transform: translateY(-1px); }
                .start-btn:hover { background: #005225; }
                .start-btn { transition: background 0.2s ease; }
                .scrollbar-hide::-webkit-scrollbar { display: none; }
                .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
                h1, h2, h3, h4 { font-family: 'Plus Jakarta Sans', sans-serif; }
            `}</style>

            <Header />

            {/* Hero Section */}
            <section style={{
                background: 'linear-gradient(135deg, #006b32 0%, #008740 60%, #00a84f 100%)',
                position: 'relative', overflow: 'hidden'
            }}>
                {/* Decorative blobs */}
                <div style={{
                    position: 'absolute', right: '-80px', top: '-80px',
                    width: '384px', height: '384px',
                    background: '#e8c41d', opacity: 0.15,
                    borderRadius: '9999px', filter: 'blur(60px)'
                }} />
                <div style={{
                    position: 'absolute', left: '-40px', bottom: '-60px',
                    width: '300px', height: '300px',
                    background: '#005fa0', opacity: 0.12,
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
                            }}>Scholastic Atelier · HSA</span>
                            <h1 style={{
                                fontSize: 'clamp(28px,5vw,48px)', fontWeight: 800,
                                color: '#fff', marginBottom: '16px', lineHeight: 1.15, letterSpacing: '-0.03em'
                            }}>Luyện thi HSA Toàn diện</h1>
                            <p style={{ fontSize: '17px', color: 'rgba(255,255,255,0.88)', lineHeight: 1.7, marginBottom: '32px' }}>
                                Chuẩn bị tốt nhất cho kỳ thi Đánh giá năng lực ĐHQG Hà Nội với lộ trình cá nhân hóa và kho đề thi thực tế khổng lồ.
                            </p>

                            {/* Stats */}
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '12px' }}>
                                {[
                                    { label: 'Đề thi thử', value: `${totalExamCount}+` },
                                    { label: 'Câu hỏi', value: '150' },
                                    { label: 'Phút làm bài', value: '195' },
                                    { label: 'Tỷ lệ đỗ', value: '98%' },
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
                                    background: '#fdd835', color: '#221b00',
                                    fontWeight: 800, fontSize: '15px', border: 'none', cursor: 'pointer',
                                    boxShadow: '0 8px 24px rgba(253,216,53,0.35)'
                                }}
                            >
                                <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>assignment</span>
                                Làm bộ đề hoàn chỉnh
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Loading */}
            {isLoading && (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '400px' }}>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{
                            width: '48px', height: '48px', border: '3px solid #e6f6ff',
                            borderTopColor: '#006b32', borderRadius: '50%',
                            animation: 'spin 0.8s linear infinite', margin: '0 auto 16px'
                        }} />
                        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                        <p style={{ color: '#3d4a3e', fontWeight: 500 }}>Đang tải đề thi...</p>
                    </div>
                </div>
            )}

            {/* Error */}
            {error && (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '400px' }}>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '48px', marginBottom: '16px' }}>⚠️</div>
                        <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#001f2a', marginBottom: '8px' }}>Lỗi tải đề thi</h2>
                        <p style={{ color: '#3d4a3e', marginBottom: '20px' }}>Đã có lỗi xảy ra. Vui lòng thử lại sau.</p>
                        <button
                            onClick={() => window.location.reload()}
                            style={{
                                background: '#006b32', color: '#fff',
                                padding: '10px 24px', borderRadius: '10px',
                                fontWeight: 600, border: 'none', cursor: 'pointer'
                            }}
                        >Thử lại</button>
                    </div>
                </div>
            )}

            {!isLoading && !error && (
                <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '40px 24px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '32px', alignItems: 'start' }}>

                        {/* LEFT: Filters + Exam List */}
                        <div>
                            {/* Filter Bar */}
                            <div style={{
                                background: '#fff', borderRadius: '20px',
                                padding: '20px 24px', marginBottom: '28px',
                                boxShadow: '0 2px 12px rgba(0,31,42,0.06)',
                                border: '1px solid #ceedfd'
                            }}>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'center' }}>
                                    {/* Subject filter */}
                                    <div style={{ flex: 1 }}>
                                        <p style={{ fontSize: '11px', fontWeight: 700, color: '#6d7b6d', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '10px' }}>Môn học</p>
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                            <button
                                                onClick={() => setSelectedSubjects('all')}
                                                className="subject-chip"
                                                style={{
                                                    padding: '6px 14px', borderRadius: '9999px', fontSize: '12px', fontWeight: 600,
                                                    border: '1.5px solid',
                                                    borderColor: selectedSubjects === 'all' ? '#006b32' : '#bccabb',
                                                    background: selectedSubjects === 'all' ? '#006b32' : 'transparent',
                                                    color: selectedSubjects === 'all' ? '#fff' : '#3d4a3e',
                                                    cursor: 'pointer'
                                                }}
                                            >Tất cả</button>
                                            {subjectsInData.map(({ info, count }) => {
                                                const isSelected = selectedSubjects !== 'all' && selectedSubjects.includes((info as any).id);
                                                return (
                                                    <button
                                                        key={(info as any).id}
                                                        onClick={() => toggleSubject((info as any).id)}
                                                        className="subject-chip"
                                                        style={{
                                                            padding: '6px 14px', borderRadius: '9999px', fontSize: '12px', fontWeight: 600,
                                                            border: '1.5px solid',
                                                            borderColor: isSelected ? '#006b32' : '#bccabb',
                                                            background: isSelected ? '#006b32' : 'transparent',
                                                            color: isSelected ? '#fff' : '#3d4a3e',
                                                            cursor: 'pointer'
                                                        }}
                                                    >
                                                        {info.name} <span style={{ opacity: 0.7 }}>({count})</span>
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    {/* Divider */}
                                    <div style={{ width: '1px', height: '40px', background: '#e6f6ff' }} />

                                    {/* Difficulty filter */}
                                    <div>
                                        <p style={{ fontSize: '11px', fontWeight: 700, color: '#6d7b6d', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '10px' }}>Độ khó</p>
                                        <div style={{ display: 'flex', gap: '6px' }}>
                                            {['all', 'Dễ', 'Trung bình', 'Khó', 'Rất khó'].map(d => (
                                                <button
                                                    key={d}
                                                    onClick={() => setSelectedDifficulty(d)}
                                                    className="subject-chip"
                                                    style={{
                                                        padding: '6px 12px', borderRadius: '9999px', fontSize: '12px', fontWeight: 600,
                                                        border: '1.5px solid',
                                                        borderColor: selectedDifficulty === d ? '#006b32' : '#bccabb',
                                                        background: selectedDifficulty === d ? '#006b32' : 'transparent',
                                                        color: selectedDifficulty === d ? '#fff' : '#3d4a3e',
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
                                    border: '2px dashed #bccabb'
                                }}>
                                    <span className="material-symbols-outlined" style={{ fontSize: '48px', color: '#bccabb', marginBottom: '16px' }}>search_off</span>
                                    <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#001f2a', marginBottom: '8px' }}>Không tìm thấy đề thi</h3>
                                    <p style={{ color: '#6d7b6d', marginBottom: '20px' }}>Hãy thử thay đổi bộ lọc tìm kiếm.</p>
                                    <button
                                        onClick={() => { setSelectedSubjects('all'); setSelectedDifficulty('all'); }}
                                        style={{
                                            padding: '8px 20px', borderRadius: '10px',
                                            background: '#e6f6ff', color: '#006b32',
                                            fontWeight: 600, fontSize: '14px', border: 'none', cursor: 'pointer'
                                        }}
                                    >Xóa bộ lọc</button>
                                </div>
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '36px' }}>
                                    {Object.entries(groupedExams)
                                        .sort((a, b) => {
                                            const subjectOrder = [
                                                SUBJECT_ID.MATH, SUBJECT_ID.PHYSICS, SUBJECT_ID.CHEMISTRY,
                                                SUBJECT_ID.BIOLOGY, SUBJECT_ID.LITERATURE, SUBJECT_ID.GEOGRAPHY,
                                                SUBJECT_ID.HISTORY, SUBJECT_ID.ENGLISH, SUBJECT_ID.SCIENCE,
                                            ];
                                            const aId = (a[1].subjectInfo as any).id ?? 0;
                                            const bId = (b[1].subjectInfo as any).id ?? 0;
                                            return subjectOrder.indexOf(aId) - subjectOrder.indexOf(bId);
                                        })
                                        .map(([subjectName, { subjectInfo, exams }]) => (
                                            <div key={subjectName}>
                                                {/* Subject Header */}
                                                <div style={{
                                                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                                    marginBottom: '20px', paddingBottom: '16px',
                                                    borderBottom: '2px solid #e6f6ff',
                                                    position: 'sticky', top: '72px',
                                                    background: '#f4faff', zIndex: 10, paddingTop: '8px'
                                                }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                        <div style={{
                                                            width: '10px', height: '10px', borderRadius: '50%',
                                                            background: '#006b32', boxShadow: '0 0 0 4px rgba(0,107,50,0.15)'
                                                        }} />
                                                        <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#001f2a', letterSpacing: '-0.02em' }}>{subjectName}</h2>
                                                        <span style={{
                                                            padding: '2px 10px', borderRadius: '9999px',
                                                            background: '#d9f2ff', color: '#005fa0',
                                                            fontSize: '12px', fontWeight: 700
                                                        }}>{exams.length}</span>
                                                    </div>
                                                </div>

                                                {/* Cards Grid */}
                                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: '20px' }}>
                                                    {exams.map(exam => {
                                                        const isCompleted = exam.userStatus?.isCompleted;
                                                        const diffConfig = getDifficultyConfig(exam.difficulty);

                                                        return (
                                                            <div key={exam.id} className="exam-card" style={{
                                                                background: '#fff', borderRadius: '20px',
                                                                border: '1px solid #ceedfd',
                                                                overflow: 'hidden', display: 'flex', flexDirection: 'column',
                                                                boxShadow: '0 2px 8px rgba(0,31,42,0.06)'
                                                            }}>
                                                                {/* Colored top bar */}
                                                                <div style={{
                                                                    height: '4px',
                                                                    background: isCompleted
                                                                        ? 'linear-gradient(90deg,#006b32,#00a84f)'
                                                                        : 'linear-gradient(90deg,#0078c8,#005fa0)'
                                                                }} />

                                                                <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                                                                    {/* Tags row */}
                                                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                                                                        <span style={{
                                                                            padding: '4px 10px', borderRadius: '9999px',
                                                                            fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em'
                                                                        }} className={diffConfig.cls}>{diffConfig.label}</span>

                                                                        {user && exam.userStatus && (
                                                                            <span style={{
                                                                                display: 'flex', alignItems: 'center', gap: '4px',
                                                                                padding: '4px 10px', borderRadius: '9999px', fontSize: '11px', fontWeight: 600,
                                                                                background: isCompleted ? '#e6f6ff' : '#f0fdf4',
                                                                                color: isCompleted ? '#005fa0' : '#006b32'
                                                                            }}>
                                                                                {isCompleted ? (
                                                                                    <><span className="material-symbols-outlined ms-fill" style={{ fontSize: '14px', color: '#006b32' }}>check_circle</span>Đã xong</>
                                                                                ) : 'Chưa làm'}
                                                                            </span>
                                                                        )}
                                                                        {exam.isFree && (
                                                                            <span style={{
                                                                                display: 'flex', alignItems: 'center', gap: '4px',
                                                                                padding: '4px 10px', borderRadius: '9999px', fontSize: '11px', fontWeight: 700,
                                                                                background: '#dcfce7', color: '#15803d',
                                                                                border: '1px solid #bbf7d0'
                                                                            }}>
                                                                                <span className="material-symbols-outlined ms-fill" style={{ fontSize: '14px' }}>lock_open</span>
                                                                                Miễn phí
                                                                            </span>
                                                                        )}
                                                                    </div>

                                                                    {/* Title */}
                                                                    <h3 style={{
                                                                        fontSize: '16px', fontWeight: 700, color: '#001f2a',
                                                                        marginBottom: '16px', lineHeight: 1.4,
                                                                        display: '-webkit-box', WebkitLineClamp: 2,
                                                                        WebkitBoxOrient: 'vertical', overflow: 'hidden'
                                                                    }}>{exam.name}</h3>

                                                                    {/* Meta */}
                                                                    <div style={{ display: 'flex', gap: '16px', marginBottom: '8px' }}>
                                                                        <span style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '13px', color: '#6d7b6d' }}>
                                                                            <span className="material-symbols-outlined" style={{ fontSize: '15px' }}>timer</span>
                                                                            {exam.duration}
                                                                        </span>
                                                                        <span style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '13px', color: '#6d7b6d' }}>
                                                                            <span className="material-symbols-outlined" style={{ fontSize: '15px' }}>help_outline</span>
                                                                            100 câu
                                                                        </span>
                                                                    </div>

                                                                    {/* Actions */}
                                                                    <div style={{ marginTop: 'auto', paddingTop: '16px', borderTop: '1px solid #e6f6ff' }}>
                                                                        {isCompleted ? (
                                                                            <div>
                                                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                                                                                    <span style={{ fontSize: '13px', color: '#6d7b6d' }}>Điểm tốt nhất</span>
                                                                                    <span style={{ fontSize: '18px', fontWeight: 800, color: '#006b32' }}>
                                                                                        {exam.userStatus.totalPoints}
                                                                                        <span style={{ fontSize: '11px', fontWeight: 400, color: '#6d7b6d', marginLeft: '2px' }}>đ</span>
                                                                                    </span>
                                                                                </div>
                                                                                <div style={{ display: 'grid', gridTemplateColumns: exam.lockView ? '1fr' : '1fr 1fr', gap: '8px', marginBottom: '8px' }}>
                                                                                    {!exam.lockView ? (
                                                                                        <Link
                                                                                            href={`/thi-hsa-tsa/ket-qua?examId=${exam.id}`}
                                                                                            style={{
                                                                                                display: 'block', textAlign: 'center',
                                                                                                padding: '10px', borderRadius: '12px',
                                                                                                fontSize: '13px', fontWeight: 600,
                                                                                                border: '1.5px solid #bccabb', color: '#3d4a3e',
                                                                                                textDecoration: 'none',
                                                                                                transition: 'background 0.15s'
                                                                                            }}
                                                                                        >Xem lại</Link>
                                                                                    ) : (
                                                                                        <span
                                                                                            title="Đề này đang khóa xem đáp án"
                                                                                            style={{
                                                                                                display: 'block', textAlign: 'center',
                                                                                                padding: '10px', borderRadius: '12px',
                                                                                                fontSize: '13px', fontWeight: 600,
                                                                                                border: '1.5px solid #e5e7eb', color: '#9ca3af',
                                                                                                background: '#f9fafb', cursor: 'not-allowed'
                                                                                            }}
                                                                                        >🔒 Khóa xem đáp án</span>
                                                                                    )}
                                                                                    <button
                                                                                        disabled={!isAuthenticated && !exam.isFree}
                                                                                        onClick={() => startExam(exam.id, exam.hasPassword, exam.isFree)}
                                                                                        className="start-btn"
                                                                                        style={{
                                                                                            padding: '10px', borderRadius: '12px',
                                                                                            fontSize: '13px', fontWeight: 700,
                                                                                            background: (isAuthenticated || exam.isFree) ? '#006b32' : '#9ca3af', color: '#fff',
                                                                                            border: 'none', cursor: (isAuthenticated || exam.isFree) ? 'pointer' : 'not-allowed'
                                                                                        }}
                                                                                        title={(!isAuthenticated && !exam.isFree) ? 'Vui lòng đăng nhập để làm bài' : ''}
                                                                                    >Làm lại</button>
                                                                                </div>
                                                                                <button
                                                                                    onClick={() => setLeaderboardExam({ id: exam.id, name: exam.name, password: exam.hasPassword ? '' : undefined })}
                                                                                    style={{
                                                                                        width: '100%', padding: '8px', borderRadius: '12px',
                                                                                        fontSize: '12px', fontWeight: 600,
                                                                                        background: '#f0fdf4', color: '#006b32',
                                                                                        border: '1.5px solid #bbf7d0', cursor: 'pointer'
                                                                                    }}
                                                                                >🏆 Bảng xếp hạng</button>
                                                                            </div>
                                                                        ) : (
                                                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                                                                <button
                                                                                    disabled={!isAuthenticated && !exam.isFree}
                                                                                    onClick={() => startExam(exam.id, exam.hasPassword, exam.isFree)}
                                                                                    className="start-btn"
                                                                                    style={{
                                                                                        width: '100%', padding: '12px',
                                                                                        borderRadius: '14px', fontSize: '14px', fontWeight: 700,
                                                                                        background: (isAuthenticated || exam.isFree) ? '#006b32' : '#9ca3af', color: '#fff',
                                                                                        border: 'none', cursor: (isAuthenticated || exam.isFree) ? 'pointer' : 'not-allowed',
                                                                                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
                                                                                    }}
                                                                                    title={(!isAuthenticated && !exam.isFree) ? 'Vui lòng đăng nhập để bắt đầu' : ''}
                                                                                >
                                                                                    {exam.isFree && !isAuthenticated ? 'Làm thử miễn phí' : 'Bắt đầu ngay'}
                                                                                    <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>arrow_forward</span>
                                                                                </button>
                                                                                <button
                                                                                    onClick={() => setLeaderboardExam({ id: exam.id, name: exam.name, password: exam.hasPassword ? '' : undefined })}
                                                                                    style={{
                                                                                        width: '100%', padding: '8px', borderRadius: '12px',
                                                                                        fontSize: '12px', fontWeight: 600,
                                                                                        background: '#f0fdf4', color: '#006b32',
                                                                                        border: '1.5px solid #bbf7d0', cursor: 'pointer'
                                                                                    }}
                                                                                >🏆 Bảng xếp hạng</button>
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        ))}
                                </div>
                            )}
                        </div>

                        {/* RIGHT: Sidebar */}
                        <aside style={{ display: 'flex', flexDirection: 'column', gap: '24px', position: 'sticky', top: '88px' }}>

                            {/* Top Performers Card */}
                            <div style={{
                                background: '#fff', borderRadius: '24px',
                                padding: '24px',
                                boxShadow: '0 4px 20px rgba(0,31,42,0.08)',
                                border: '1px solid #ceedfd'
                            }}>
                                <h3 style={{
                                    fontSize: '16px', fontWeight: 800, color: '#001f2a',
                                    marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px'
                                }}>
                                    <span className="material-symbols-outlined ms-fill" style={{ color: '#e8c41d', fontSize: '22px' }}>emoji_events</span>
                                    Top Performers
                                </h3>

                                {topPerformers.length === 0 ? (
                                    <p style={{ color: '#6d7b6d', fontSize: '13px', textAlign: 'center', padding: '16px 0' }}>
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
                                                        fontWeight: 800, fontSize: '14px',
                                                        background: idx === 0 ? '#fdd835' : idx === 1 ? '#d9f2ff' : idx === 2 ? '#ffedcc' : '#f4faff',
                                                        color: idx === 0 ? '#221b00' : idx === 1 ? '#005fa0' : idx === 2 ? '#8a5200' : '#3d4a3e',
                                                        flexShrink: 0
                                                    }}>{idx + 1}</div>
                                                    <div>
                                                        <p style={{ fontSize: '13px', fontWeight: 700, color: '#001f2a' }}>{entry.fullname}</p>
                                                        <p style={{ fontSize: '11px', color: '#6d7b6d' }}>{entry.class}</p>
                                                    </div>
                                                </div>
                                                <span style={{ fontSize: '16px', fontWeight: 800, color: '#006b32' }}>
                                                    {entry.totalPoints}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Quick Resources */}
                            <div style={{
                                background: 'linear-gradient(135deg,#e6f6ff 0%,#d9f2ff 100%)',
                                borderRadius: '24px', padding: '24px',
                                border: '1px solid #ceedfd'
                            }}>
                                <h4 style={{ fontSize: '13px', fontWeight: 800, color: '#005fa0', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '14px' }}>
                                    Tài nguyên học tập
                                </h4>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                    {['Cấu trúc HSA', 'Đề cương 2025', 'Mẹo giải Toán', 'Luyện đọc hiểu', 'Hóa hữu cơ'].map(tag => (
                                        <span key={tag} style={{
                                            padding: '6px 12px', background: '#fff',
                                            borderRadius: '8px', fontSize: '12px', fontWeight: 600,
                                            color: '#005fa0', boxShadow: '0 1px 4px rgba(0,95,160,0.1)',
                                            cursor: 'pointer'
                                        }}>{tag}</span>
                                    ))}
                                </div>
                            </div>

                            {/* Exam Structure Info */}
                            <div style={{
                                background: '#163440',
                                borderRadius: '24px', padding: '24px',
                                position: 'relative', overflow: 'hidden'
                            }}>
                                <div style={{
                                    position: 'absolute', bottom: '-24px', right: '-24px',
                                    width: '120px', height: '120px',
                                    background: 'rgba(0,107,50,0.25)', borderRadius: '50%', filter: 'blur(30px)'
                                }} />
                                <h3 style={{ fontSize: '11px', fontWeight: 700, color: '#5adf82', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '12px' }}>
                                    Cấu trúc đề HSA
                                </h3>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', position: 'relative', zIndex: 1 }}>
                                    {[
                                        { label: 'Định lượng', icon: 'functions', val: '50 câu' },
                                        { label: 'Định tính', icon: 'history_edu', val: '50 câu' },
                                        { label: 'Khoa học', icon: 'science', val: '50 câu' },
                                    ].map(item => (
                                        <div key={item.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                            <span style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'rgba(255,255,255,0.75)' }}>
                                                <span className="material-symbols-outlined" style={{ fontSize: '16px', color: '#5adf82' }}>{item.icon}</span>
                                                {item.label}
                                            </span>
                                            <span style={{ fontSize: '13px', fontWeight: 700, color: '#fff' }}>{item.val}</span>
                                        </div>
                                    ))}
                                    <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '10px', display: 'flex', justifyContent: 'space-between' }}>
                                        <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>Tổng thời gian</span>
                                        <span style={{ fontSize: '13px', fontWeight: 700, color: '#9ecaff' }}>195 phút</span>
                                    </div>
                                </div>
                            </div>
                        </aside>
                    </div>
                </div>
            )}

            {/* Guest Profile Modal */}
            <GuestProfileModal
                isOpen={!!guestModalExam}
                onConfirm={handleGuestProfileConfirm}
                onCancel={() => setGuestModalExam(null)}
            />

            {/* Modal Bộ đề hoàn chỉnh */}
            <ExamSetGroupModal
                isOpen={isGroupModalOpen}
                onClose={() => setIsGroupModalOpen(false)}
                onStartGroupExam={handleStartGroupExam}
                examType={ExamSetGroupExamType.HSA}
            />

            {/* Leaderboard Modal */}
            {leaderboardExam && (
                <ExamLeaderboardModal
                    examId={leaderboardExam.id}
                    examName={leaderboardExam.name}
                    password={leaderboardExam.password}
                    accentColor="#006b32"
                    onClose={() => setLeaderboardExam(null)}
                />
            )}
        </div>
    );
}
