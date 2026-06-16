'use client';

import Header from '@/components/Header';
import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCompetency } from '@/hooks/useAiSelftPracice';
import { composeAssessData } from './assess/compose';
import { buildAssessData } from './assess/buildAssessData';
import { AssessOverview, AssessTopic, AssessKC } from './assess/screens';
import './assess/assess.css';

type View =
    | { tier: 'overview' }
    | { tier: 'topic'; topicTag: string }
    | { tier: 'kc'; kcTag: string };

export default function AssessPage() {
    const router = useRouter();
    const { data: raw, isLoading, error } = useCompetency();
    // Ưu tiên dữ liệu thật từ /kc/competency; khi backend chưa sẵn (lỗi) thì dùng
    // dữ liệu mẫu để vẫn xem được giao diện.
    const data = useMemo(() => (raw ? composeAssessData(raw) : buildAssessData()), [raw]);
    const [view, setView] = useState<View>({ tier: 'overview' });

    const goTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });
    const openTopic = (topicTag: string) => { setView({ tier: 'topic', topicTag }); goTop(); };
    const openKC = (kcTag: string) => { setView({ tier: 'kc', kcTag }); goTop(); };
    const backOverview = () => { setView({ tier: 'overview' }); goTop(); };
    const practice = (kcTag: string) => router.push(`/ai-tu-luyen/practice?kc=${encodeURIComponent(kcTag)}`);

    return (
        <div className="min-h-screen bg-slate-50">
            <Header />
            <div className="assess-root">
                {isLoading && !raw ? (
                    <div className="page" style={{ display: 'flex', justifyContent: 'center', padding: '80px 0' }}>
                        <div style={{ textAlign: 'center', color: 'var(--muted)' }}>
                            <div className="ring-spinner" />
                            <div style={{ marginTop: 12, fontSize: 14, fontWeight: 600 }}>Đang tổng hợp hồ sơ năng lực…</div>
                        </div>
                    </div>
                ) : (
                    <>
                        {error && (
                            <div className="page" style={{ paddingBottom: 0 }}>
                                <div style={{
                                    background: 'var(--accent-50)', border: '1px solid var(--accent-200)',
                                    color: 'var(--accent-700)', borderRadius: 'var(--r-md)', padding: '10px 14px',
                                    fontSize: 13, fontWeight: 600,
                                }}>
                                    Chưa kết nối được máy chủ — đang hiển thị dữ liệu mẫu.
                                </div>
                            </div>
                        )}
                        {view.tier === 'overview' && (
                            <AssessOverview data={data} onOpenTopic={openTopic} onOpenKC={openKC} />
                        )}
                        {view.tier === 'topic' && (
                            <AssessTopic
                                data={data}
                                topicTag={view.topicTag}
                                onBack={backOverview}
                                onOpenKC={openKC}
                                onPractice={practice}
                            />
                        )}
                        {view.tier === 'kc' && (
                            <AssessKC
                                data={data}
                                kcTag={view.kcTag}
                                onBack={backOverview}
                                onBackTopic={openTopic}
                                onPractice={practice}
                            />
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
