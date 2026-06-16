'use client';

/* ====================================================================
 * Đánh giá năng lực — 3 tầng drill-down (port từ prototype).
 * Tầng 1: Overview · Tầng 2: Topic detail · Tầng 3: KC wrong questions.
 * ==================================================================== */
import React, { useMemo, useState } from 'react';
import { Ico } from './icons';
import { Ring, RichText } from './components';
import { AssessData, CogLevel } from './types';

// ===================================================================
// TẦNG 1 — TỔNG QUAN
// ===================================================================
export function AssessOverview({
    data: D,
    onOpenTopic,
    onOpenKC,
}: {
    data: AssessData;
    onOpenTopic: (tag: string) => void;
    onOpenKC: (tag: string) => void;
}) {
    const [view, setView] = useState<'topic' | 'mach'>('topic');
    const s = D.summary;

    return (
        <div className="page">
            {/* Summary */}
            <div className="assess-summary">
                <div className="summary-ring">
                    <div className="ring">
                        <Ring value={s.overallMastery} />
                        <div className="c"><div className="n num">{s.overallMastery}%</div></div>
                    </div>
                    <div className="meta">
                        <div className="t">Đánh giá kỹ năng</div>
                        <div className="big">Bản đồ năng lực Toán của bạn</div>
                        <div className="sub">Tổng hợp từ {s.totalQ} câu đã làm trên cây kiến thức GDPT 2018</div>
                    </div>
                </div>
                <div className="summary-divider" />
                <div className="summary-stats">
                    <div className="summary-stat">
                        <div className="v num">{s.kcAssessed}<small>/{s.kcTotal}</small></div>
                        <div className="l">Phần kiến thức đã đánh giá</div>
                    </div>
                    <div className="summary-stat">
                        <div className="v num">{s.totalWrong}</div>
                        <div className="l">Câu sai cần ôn lại</div>
                    </div>
                    <div className="summary-stat">
                        <div className="v num">{D.priorities.length}</div>
                        <div className="l">Điểm yếu ưu tiên</div>
                    </div>
                    <div className="summary-stat">
                        <div className="v num">{D.recent.length}</div>
                        <div className="l">Phần đang tiến bộ</div>
                    </div>
                </div>
            </div>

            {/* Tiến bộ + ưu tiên */}
            <div className="insight-row">
                <div className="insight-card progress">
                    <div className="insight-head progress"><Ico.TrendUp /> Bạn đang tiến bộ ở</div>
                    <div className="insight-items">
                        {D.recent.map((kc) => (
                            <div key={kc.tag} className="insight-item" onClick={() => onOpenKC(kc.tag)}>
                                <span className="nm">{kc.name}</span>
                                <span className="badge up"><Ico.TrendUp /> +{kc.delta}%</span>
                                <span className="pct">{kc.mastery}%</span>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="insight-card priority">
                    <div className="insight-head priority"><Ico.Target /> Nên ưu tiên cải thiện</div>
                    <div className="insight-items">
                        {D.priorities.map((kc) => (
                            <div key={kc.tag} className="insight-item" onClick={() => onOpenKC(kc.tag)}>
                                <span className="nm">{kc.name}</span>
                                <span className="badge down">{kc.wrongTotal} câu sai</span>
                                <span className="pct">{kc.mastery}%</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Toolbar */}
            <div className="assess-toolbar">
                <div className="view-toggle">
                    <button className={view === 'topic' ? 'active' : ''} onClick={() => setView('topic')}>
                        <Ico.Grid /> Theo chủ đề ({s.topicTotal})
                    </button>
                    <button className={view === 'mach' ? 'active' : ''} onClick={() => setView('mach')}>
                        <Ico.Layers /> Theo mạch ({s.machTotal})
                    </button>
                </div>
                <div className="assess-legend">
                    <span className="lg"><span className="dot" style={{ background: '#16a34a' }} /> Vững</span>
                    <span className="lg"><span className="dot" style={{ background: '#d97706' }} /> Trung bình</span>
                    <span className="lg"><span className="dot" style={{ background: '#dc2626' }} /> Cần cải thiện</span>
                    <span className="lg"><span className="dot" style={{ background: '#9ca3af' }} /> Chưa đủ dữ liệu</span>
                </div>
            </div>

            {view === 'mach' ? (
                <div className="assess-grid mach-view">
                    {D.mach.map((m) => {
                        const band = D.masteryBand(m.mastery);
                        return (
                            <div key={m.tag} className="tile" onClick={() => setView('topic')}>
                                <div className="tile-accent" style={{ background: m.color }} />
                                <div className="tile-head">
                                    <div className="mach-chip" style={{ background: m.bg, color: m.color }}>
                                        <span className="ic" style={{ background: m.color }}><Ico.Layers /></span>
                                        {m.name}
                                    </div>
                                </div>
                                <div className="tile-mastery">
                                    <span className="pct num" style={{ color: band.color }}>{m.mastery == null ? '—' : m.mastery + '%'}</span>
                                    <span className="band" style={{ background: band.bg, color: band.color }}>{band.label}</span>
                                </div>
                                <div className="tile-bar"><div className="fill" style={{ width: (m.mastery || 0) + '%', background: band.color }} /></div>
                                <div className="tile-foot">
                                    <span className="wrong"><Ico.Alert /> {m.totalWrong} câu sai</span>
                                    <span>{m.kcWithData}/{m.kcCount} KC · {m.topicCount} chủ đề</span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                D.mach.map((m) => (
                    <div key={m.tag} className="mach-section">
                        <div className="mach-head">
                            <div className="mach-chip" style={{ background: m.bg, color: m.color }}>
                                <span className="ic" style={{ background: m.color }}><Ico.Layers /></span>
                                {m.name}
                            </div>
                            <div className="hr" />
                            <div className="agg">TB mạch: <b>{m.mastery == null ? 'chưa đủ DL' : m.mastery + '%'}</b></div>
                        </div>
                        <div className="assess-grid">
                            {m.topics.map((t) => {
                                const band = D.masteryBand(t.mastery);
                                const nodata = t.mastery == null;
                                return (
                                    <div key={t.tag} className={'tile' + (nodata ? ' nodata' : '')} onClick={() => onOpenTopic(t.tag)}>
                                        <div className="tile-accent" style={{ background: nodata ? 'var(--muted-2)' : band.color }} />
                                        <div className="tile-head">
                                            <div>
                                                <div className="tile-title">{t.name}</div>
                                                <div className="tile-sub">{t.kcCount} phần kiến thức</div>
                                            </div>
                                            <span className="tile-grade">{t.grade.toUpperCase()}</span>
                                        </div>

                                        {nodata ? (
                                            <>
                                                <div className="tile-nodata-msg">
                                                    <span className="ic"><Ico.Lock /></span>
                                                    Chưa đủ dữ liệu — làm thêm bài để mở khoá chỉ số
                                                </div>
                                                <div className="tile-foot">
                                                    <span style={{ color: 'var(--muted)' }}>{t.totalQ} câu đã làm</span>
                                                    <span className="drill">Khám phá <Ico.ChevronRight /></span>
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                                <div className="tile-mastery">
                                                    <span className="pct num" style={{ color: band.color }}>{t.mastery}%</span>
                                                    <span className="band" style={{ background: band.bg, color: band.color }}>{band.label}</span>
                                                    {t.delta !== 0 && (
                                                        <span className={'delta ' + (t.delta > 0 ? 'up' : 'down')}>
                                                            <Ico.TrendUp /> {t.delta > 0 ? '+' : ''}{t.delta}%
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="tile-bar"><div className="fill" style={{ width: t.mastery + '%', background: band.color }} /></div>
                                                <div className="tile-foot">
                                                    <span className="wrong"><Ico.Alert /> {t.totalWrong} câu sai</span>
                                                    <span className="drill">{t.kcCount} KC <Ico.ChevronRight /></span>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))
            )}
        </div>
    );
}

// ===================================================================
// TẦNG 2 — CHI TIẾT MỘT CHỦ ĐỀ
// ===================================================================
export function AssessTopic({
    data: D,
    topicTag,
    onBack,
    onOpenKC,
    onPractice,
}: {
    data: AssessData;
    topicTag: string;
    onBack: () => void;
    onOpenKC: (tag: string) => void;
    onPractice: (tag: string) => void;
}) {
    const topic = D.topics.find((t) => t.tag === topicTag);
    const kcs = useMemo(() => {
        if (!topic) return [];
        return [...topic.kcs].sort((a, b) => {
            if (a.mastery == null && b.mastery == null) return 0;
            if (a.mastery == null) return 1;
            if (b.mastery == null) return -1;
            return a.mastery - b.mastery;
        });
    }, [topic]);
    if (!topic) return null;
    const band = D.masteryBand(topic.mastery);

    return (
        <div className="page">
            <div className="breadcrumb">
                <a onClick={onBack}>Tổng quan</a>
                <span className="sep"><Ico.ChevronRight /></span>
                <span className="cur">{topic.name}</span>
            </div>

            <div className="detail-header">
                <div className="left">
                    <div className="detail-eyebrow" style={{ color: topic.machColor }}>
                        <span style={{ width: 8, height: 8, borderRadius: 2, background: topic.machColor, display: 'inline-block' }} />
                        {topic.machName} · Lớp {topic.grade.slice(1)}
                    </div>
                    <div className="detail-title">{topic.name}</div>
                    <div className="detail-desc">
                        Mức thành thạo dưới đây tổng hợp từ {topic.kcCount} phần kiến thức con.
                        Các phần yếu được đưa lên đầu để bạn ưu tiên.
                    </div>
                    <div className="detail-metrics">
                        <div className="detail-metric"><div className="v num">{topic.totalQ}</div><div className="l">Câu đã làm</div></div>
                        <div className="detail-metric"><div className="v num" style={{ color: 'var(--error)' }}>{topic.totalWrong}</div><div className="l">Câu sai</div></div>
                        <div className="detail-metric"><div className="v num">{topic.kcWithData}/{topic.kcCount}</div><div className="l">KC đã đánh giá</div></div>
                    </div>
                </div>
                <div className="detail-ring">
                    {topic.mastery == null ? (
                        <div className="c"><div><div className="n" style={{ color: 'var(--muted)' }}>—</div><div className="band" style={{ color: 'var(--muted)' }}>Chưa đủ DL</div></div></div>
                    ) : (
                        <>
                            <svg viewBox="0 0 120 120">
                                <circle className="track" cx="60" cy="60" r="52" fill="none" strokeWidth="12" />
                                <circle className="fill" cx="60" cy="60" r="52" fill="none" strokeWidth="12"
                                    stroke={band.color} strokeDasharray={`${(topic.mastery / 100) * 2 * Math.PI * 52} ${2 * Math.PI * 52}`} />
                            </svg>
                            <div className="c"><div><div className="n num" style={{ color: band.color }}>{topic.mastery}%</div><div className="band" style={{ color: band.color }}>{band.label}</div></div></div>
                        </>
                    )}
                </div>
            </div>

            <div className="kc-list">
                {kcs.map((kc) => {
                    const kb = D.masteryBand(kc.mastery);
                    const nodata = kc.mastery == null;
                    const weak = kc.mastery != null && kc.mastery < 45;
                    return (
                        <div key={kc.tag} className={'kc-row' + (nodata ? ' nodata' : weak ? ' weak' : '')}>
                            <div className="kc-info">
                                <div className="nm">
                                    {kc.name}
                                    <span className="difftag">Độ khó {kc.diff}/5</span>
                                </div>
                                <div className="ds">{kc.desc}</div>
                                <div className="stat">
                                    <span>{kc.q} câu đã làm</span>
                                    {kc.wrongTotal > 0 && <span className="wrong">{kc.wrongTotal} câu sai</span>}
                                </div>
                            </div>

                            <div className="kc-mastery-col">
                                {nodata ? (
                                    <span className="nodata-chip"><Ico.Lock /> Chưa đủ dữ liệu</span>
                                ) : (
                                    <>
                                        <div className="top">
                                            <span className="pct num" style={{ color: kb.color }}>{kc.mastery}%</span>
                                            <span className="band" style={{ background: kb.bg, color: kb.color }}>{kb.label}</span>
                                        </div>
                                        <div className="bar"><div className="fill" style={{ width: kc.mastery + '%', background: kb.color }} /></div>
                                    </>
                                )}
                            </div>

                            <div className="kc-actions">
                                {kc.wrongTotal > 0 && (
                                    <button className="btn btn-ghost btn-sm" onClick={() => onOpenKC(kc.tag)}>
                                        <Ico.Eye /> Xem câu sai
                                    </button>
                                )}
                                <button className="btn btn-primary btn-sm" onClick={() => onPractice(kc.tag)}>
                                    <Ico.Sparkle /> Luyện với AI
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

// ===================================================================
// TẦNG 3 — MỘT KC: CÁC CÂU ĐÃ SAI
// ===================================================================
export function AssessKC({
    data: D,
    kcTag,
    onBack,
    onBackTopic,
    onPractice,
}: {
    data: AssessData;
    kcTag: string;
    onBack: () => void;
    onBackTopic: (tag: string) => void;
    onPractice: (tag: string) => void;
}) {
    const kc = D.kcMap[kcTag];
    const [openId, setOpenId] = useState<string | null>(null);
    const [flagged, setFlagged] = useState<Record<string, boolean>>({});
    if (!kc) return null;
    const topic = D.topics.find((t) => t.tag === kc.topicTag)!;
    const targetCog = kc.targetCog;

    const cogStats = D.COG_ORDER.map((lv) => {
        const wrong = kc.cogCount[lv] || 0;
        return { lv, wrong, meta: D.COG[lv] };
    }).filter((c) => c.wrong > 0 || kc.wrong.some((w) => w.level === c.lv));

    const groups = D.COG_ORDER.map((lv) => ({
        lv,
        meta: D.COG[lv],
        items: kc.wrong.filter((w) => w.level === lv),
    })).filter((g) => g.items.length > 0);

    return (
        <div className="page">
            <div className="breadcrumb">
                <a onClick={onBack}>Tổng quan</a>
                <span className="sep"><Ico.ChevronRight /></span>
                <a onClick={() => onBackTopic(kc.topicTag)}>{topic.name}</a>
                <span className="sep"><Ico.ChevronRight /></span>
                <span className="cur">{kc.name}</span>
            </div>

            {/* AI CTA targeting weak cognitive level */}
            <div className="ai-cta-banner">
                <div className="txt">
                    <div className="h"><Ico.Sparkle /> Luyện với AI — {kc.name}</div>
                    <div className="s">
                        AI sẽ sinh loạt câu mới nhắm vào mức <b>{D.COG[targetCog].name}</b> — nơi bạn đang sai nhiều nhất ở phần này.
                    </div>
                </div>
                <button className="btn btn-onbrand btn-lg" onClick={() => onPractice(kcTag)}>
                    Bắt đầu luyện <Ico.ArrowRight />
                </button>
            </div>

            {/* Cognitive level summary */}
            {cogStats.length > 0 && (
                <div className="cog-summary">
                    {D.COG_ORDER.map((lv) => {
                        const meta = D.COG[lv];
                        const wrong = kc.cogCount[lv] || 0;
                        const isTarget = lv === targetCog;
                        const maxW = Math.max(1, ...D.COG_ORDER.map((l) => kc.cogCount[l] || 0));
                        return (
                            <div key={lv} className={'cog-card' + (isTarget ? ' target' : '')}>
                                {isTarget && <span className="targetlabel"><Ico.Target /> AI nhắm vào</span>}
                                <div className="lv">
                                    <span className="tag" style={{ background: meta.bg, color: meta.color }}>{meta.key}</span>
                                    {meta.name}
                                </div>
                                <div className="acc num" style={{ color: wrong > 0 ? meta.color : 'var(--muted)' }}>{wrong}</div>
                                <div className="det">câu sai ở mức này</div>
                                <div className="mini"><div className="fill" style={{ width: (wrong / maxW * 100) + '%', background: meta.color }} /></div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Wrong questions grouped by cognitive level */}
            <div className="section-head" style={{ marginBottom: 14 }}>
                <div>
                    <div className="section-title">Câu bạn đã làm sai</div>
                    <div className="section-sub">
                        Hiển thị {kc.wrongShown} câu {kc.wrongTotal > kc.wrongShown ? `(trong tổng ${kc.wrongTotal} câu sai)` : ''} · nhóm theo mức nhận thức
                    </div>
                </div>
            </div>

            {groups.length === 0 ? (
                <div className="empty-state">
                    <div className="ic"><Ico.Check /></div>
                    <div className="t">Chưa ghi nhận câu sai nào ở phần này</div>
                    <div className="s">Khi bạn làm bài và sai, các câu sẽ xuất hiện ở đây để ôn lại. Bạn có thể luyện thêm với AI để củng cố.</div>
                </div>
            ) : (
                groups.map((g) => (
                    <div key={g.lv} className="wrong-group">
                        <div className="wrong-group-head">
                            <span className="tag" style={{ background: g.meta.bg, color: g.meta.color }}>{g.meta.key}</span>
                            {g.meta.name}
                            <span className="ct">· {g.items.length} câu</span>
                        </div>
                        <div className="wrong-list">
                            {g.items.map((w, i) => {
                                const open = openId === w.id;
                                const wrongPick = Object.keys(w.choices).find((k) => k !== w.answer);
                                return (
                                    <div key={w.id} className={'wrong-card' + (open ? ' open' : '')}>
                                        <div className="wrong-card-head" onClick={() => setOpenId(open ? null : w.id)}>
                                            <span className="qno">{i + 1}</span>
                                            <span className="qtext"><RichText text={w.q} /></span>
                                            <span className="chev"><Ico.ChevronRight /></span>
                                        </div>
                                        {open && (
                                            <div className="wrong-card-body">
                                                <div className="qfull"><RichText text={w.q} /></div>
                                                <div className="wrong-opts">
                                                    {Object.entries(w.choices).map(([letter, text]) => {
                                                        let cls = 'wrong-opt';
                                                        if (letter === w.answer) cls += ' correct';
                                                        else if (letter === wrongPick) cls += ' picked';
                                                        return (
                                                            <div key={letter} className={cls}>
                                                                <span className="let">{letter}</span>
                                                                <span><RichText text={text} /></span>
                                                                {letter === w.answer && <span className="mk">Đáp án đúng</span>}
                                                                {letter === wrongPick && <span className="mk">Bạn đã chọn</span>}
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                                <div className="wrong-expl">
                                                    <span className="ic"><Ico.Sparkle /></span>
                                                    <div>
                                                        <h5>Lời giải</h5>
                                                        <p><RichText text={w.expl} /></p>
                                                    </div>
                                                </div>
                                                <div className="wrong-card-foot">
                                                    <button
                                                        className={'flag-btn' + (flagged[w.id] ? ' flagged' : '')}
                                                        onClick={() => setFlagged((f) => ({ ...f, [w.id]: !f[w.id] }))}>
                                                        <Ico.Flag /> {flagged[w.id] ? 'Đã báo: xếp sai chủ đề' : 'Câu này xếp sai chủ đề?'}
                                                    </button>
                                                    <button className="btn btn-primary btn-sm" onClick={() => onPractice(kcTag)}>
                                                        <Ico.Sparkle /> Luyện câu tương tự
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))
            )}
        </div>
    );
}

export type { CogLevel };
