'use client';

import { useExamSetLeaderboard, ExamLeaderboardEntryDto } from '@/hooks/useLeaderboard';

interface ExamLeaderboardModalProps {
    examId: string;
    examName: string;
    password?: string;
    onClose: () => void;
    accentColor?: string;
}

const formatTime = (seconds: number): string => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    if (h > 0) return `${h}g ${String(m).padStart(2, '0')}p`;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
};

const PODIUM_ORDER = [1, 0, 2]; // display: 2nd, 1st, 3rd
const PODIUM_HEIGHT = ['64px', '88px', '52px'];
const RANK_ICONS = ['🥇', '🥈', '🥉'];

const RANK_STYLE = [
    { bg: 'linear-gradient(160deg,#ffe97d,#f5a623)', text: '#7a4500', ring: '#f5a623', shadow: 'rgba(245,166,35,0.4)' },
    { bg: 'linear-gradient(160deg,#dce8f5,#b0c9e8)', text: '#2c4f73', ring: '#8aaed1', shadow: 'rgba(138,174,209,0.3)' },
    { bg: 'linear-gradient(160deg,#ffd3b5,#e8845a)', text: '#7a2e0a', ring: '#e8845a', shadow: 'rgba(232,132,90,0.3)' },
];

export default function ExamLeaderboardModal({
    examId, examName, password, onClose, accentColor = '#4f46e5'
}: ExamLeaderboardModalProps) {
    const { data, isLoading, error } = useExamSetLeaderboard(examId, password, 20, true);
    const top3 = data?.entries?.slice(0, 3) ?? [];
    const rest = data?.entries?.slice(3) ?? [];
    const hasTop3 = top3.length === 3;

    return (
        <div
            style={{
                position: 'fixed', inset: 0, zIndex: 9999,
                background: 'rgba(10,10,30,0.65)',
                backdropFilter: 'blur(10px)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                padding: '12px',
                fontFamily: "'Plus Jakarta Sans','Inter',sans-serif",
            }}
            onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');
                @keyframes lb-in { from { opacity:0; transform:translateY(24px) scale(0.97); } to { opacity:1; transform:translateY(0) scale(1); } }
                @keyframes lb-spin { to { transform:rotate(360deg); } }
                @keyframes lb-fade { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
                .lb-row { animation: lb-fade 0.3s ease both; }
                .lb-row:nth-child(1){animation-delay:0.05s}
                .lb-row:nth-child(2){animation-delay:0.1s}
                .lb-row:nth-child(3){animation-delay:0.15s}
                .lb-row:nth-child(n+4){animation-delay:0.18s}
                .lb-close:hover { background: rgba(255,255,255,0.35) !important; transform: scale(1.1); }
                .lb-close { transition: all 0.15s; }
            `}</style>

            <div style={{
                background: '#fff',
                borderRadius: '28px',
                width: '100%', maxWidth: '540px',
                maxHeight: '92vh', display: 'flex', flexDirection: 'column',
                boxShadow: `0 40px 100px rgba(0,0,0,0.35), 0 0 0 1px rgba(255,255,255,0.08)`,
                overflow: 'hidden',
                animation: 'lb-in 0.35s cubic-bezier(0.22,1,0.36,1) both',
            }}>

                {/* ── HEADER ── */}
                <div style={{
                    background: `linear-gradient(145deg, ${accentColor} 0%, ${accentColor}bb 100%)`,
                    padding: '24px 24px 20px',
                    position: 'relative', overflow: 'hidden', flexShrink: 0,
                }}>
                    {/* Decorative circles */}
                    <div style={{ position:'absolute', right:'-48px', top:'-48px', width:'180px', height:'180px', background:'rgba(255,255,255,0.07)', borderRadius:'50%' }} />
                    <div style={{ position:'absolute', left:'-24px', bottom:'-48px', width:'130px', height:'130px', background:'rgba(255,255,255,0.06)', borderRadius:'50%' }} />

                    <div style={{ position:'relative', zIndex:1, display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:'12px' }}>
                        <div style={{ flex:1, minWidth:0 }}>
                            {/* Label */}
                            <div style={{
                                display:'inline-flex', alignItems:'center', gap:'6px',
                                background:'rgba(255,255,255,0.18)', backdropFilter:'blur(6px)',
                                borderRadius:'9999px', padding:'3px 12px 3px 8px',
                                fontSize:'11px', fontWeight:700, color:'rgba(255,255,255,0.95)',
                                textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:'12px'
                            }}>
                                <span style={{ fontSize:'16px' }}>🏆</span> Bảng xếp hạng
                            </div>

                            {/* Exam name */}
                            <h2 style={{
                                fontSize:'17px', fontWeight:800, color:'#fff', lineHeight:1.3,
                                display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical', overflow:'hidden',
                                marginBottom:'10px',
                            }}>{examName}</h2>
                        </div>

                        {/* Close button */}
                        <button
                            onClick={onClose}
                            className="lb-close"
                            style={{
                                background:'rgba(255,255,255,0.2)', border:'none',
                                borderRadius:'14px', width:'38px', height:'38px',
                                display:'flex', alignItems:'center', justifyContent:'center',
                                cursor:'pointer', color:'#fff', fontSize:'16px', flexShrink:0,
                            }}
                        >✕</button>
                    </div>
                </div>

                {/* ── BODY ── */}
                <div style={{ flex:1, overflowY:'auto', padding:'20px 20px 24px', background:'#f8faff' }}>

                    {/* Loading */}
                    {isLoading && (
                        <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'60px 0', gap:'16px' }}>
                            <div style={{
                                width:'44px', height:'44px', borderRadius:'50%',
                                border:'3px solid #e2e8f0', borderTopColor: accentColor,
                                animation:'lb-spin 0.8s linear infinite'
                            }} />
                            <p style={{ color:'#94a3b8', fontSize:'14px', fontWeight:500 }}>Đang tải bảng xếp hạng…</p>
                        </div>
                    )}

                    {/* Error */}
                    {error && !isLoading && (
                        <div style={{
                            display:'flex', flexDirection:'column', alignItems:'center',
                            padding:'56px 0', gap:'10px', textAlign:'center'
                        }}>
                            <div style={{
                                width:'60px', height:'60px', borderRadius:'20px',
                                background:'#fef2f2', display:'flex', alignItems:'center', justifyContent:'center',
                                fontSize:'28px', marginBottom:'4px'
                            }}>⚠️</div>
                            <p style={{ fontSize:'15px', fontWeight:800, color:'#991b1b' }}>Không thể tải bảng xếp hạng</p>
                            <p style={{ fontSize:'13px', color:'#94a3b8', maxWidth:'280px', lineHeight:1.6 }}>
                                Bạn cần đăng nhập hoặc đề thi này không có sẵn bảng xếp hạng.
                            </p>
                        </div>
                    )}

                    {/* Empty */}
                    {data && data.entries.length === 0 && (
                        <div style={{
                            display:'flex', flexDirection:'column', alignItems:'center',
                            padding:'56px 0', gap:'10px', textAlign:'center'
                        }}>
                            <div style={{
                                width:'72px', height:'72px', borderRadius:'24px',
                                background:`${accentColor}18`,
                                display:'flex', alignItems:'center', justifyContent:'center',
                                fontSize:'36px', marginBottom:'4px'
                            }}>🎯</div>
                            <p style={{ fontSize:'16px', fontWeight:800, color:'#1e293b' }}>Chưa có ai cán đích</p>
                            <p style={{ fontSize:'13px', color:'#94a3b8', lineHeight:1.6 }}>
                                Hãy là người đầu tiên chinh phục đề thi này!
                            </p>
                        </div>
                    )}

                    {/* Data */}
                    {data && data.entries.length > 0 && (
                        <div>
                            {/* ── PODIUM ── */}
                            {hasTop3 && (
                                <div style={{
                                    display:'grid', gridTemplateColumns:'1fr 1fr 1fr',
                                    gap:'10px', alignItems:'flex-end',
                                    marginBottom:'20px',
                                    padding:'20px 8px 0',
                                }}>
                                    {PODIUM_ORDER.map((dataIdx, podiumSlot) => {
                                        const entry = top3[dataIdx];
                                        const rank = dataIdx + 1;
                                        const rs = RANK_STYLE[dataIdx];
                                        const isFirst = rank === 1;
                                        return (
                                            <div key={entry.profileId} style={{
                                                display:'flex', flexDirection:'column', alignItems:'center',
                                            }}>
                                                {/* Crown for #1 */}
                                                {isFirst && (
                                                    <div style={{ fontSize:'24px', lineHeight:1, marginBottom:'4px', filter:'drop-shadow(0 2px 4px rgba(0,0,0,0.2))' }}>👑</div>
                                                )}
                                                {/* Avatar */}
                                                <div style={{
                                                    width: isFirst ? '56px' : '48px',
                                                    height: isFirst ? '56px' : '48px',
                                                    borderRadius:'50%', marginBottom:'8px',
                                                    background: rs.bg,
                                                    border: `3px solid ${rs.ring}`,
                                                    boxShadow: `0 6px 20px ${rs.shadow}`,
                                                    display:'flex', alignItems:'center', justifyContent:'center',
                                                    fontSize: isFirst ? '22px' : '18px',
                                                    fontWeight:900, color: rs.text,
                                                    transition:'transform 0.2s',
                                                }}>
                                                    {entry.fullname.charAt(0).toUpperCase()}
                                                </div>

                                                {/* Podium base */}
                                                <div style={{
                                                    width:'100%', minHeight: PODIUM_HEIGHT[podiumSlot],
                                                    background: isFirst
                                                        ? `linear-gradient(160deg,${accentColor},${accentColor}aa)`
                                                        : 'linear-gradient(160deg,#e2e8f0,#cbd5e1)',
                                                    borderRadius:'14px 14px 8px 8px',
                                                    padding:'10px 8px 12px',
                                                    display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'flex-start',
                                                    boxShadow: isFirst ? `0 8px 24px ${accentColor}44` : '0 4px 12px rgba(0,0,0,0.08)',
                                                    position:'relative', overflow:'hidden',
                                                }}>
                                                    {/* Shine */}
                                                    <div style={{
                                                        position:'absolute', top:0, left:'-50%',
                                                        width:'60%', height:'50%',
                                                        background:'linear-gradient(135deg,rgba(255,255,255,0.25),transparent)',
                                                        borderRadius:'0 0 100% 0',
                                                    }} />

                                                    <span style={{ fontSize:'18px', lineHeight:1, marginBottom:'4px' }}>{RANK_ICONS[rank-1]}</span>
                                                    <p style={{
                                                        fontSize:'11px', fontWeight:800,
                                                        color: isFirst ? '#fff' : '#475569',
                                                        textAlign:'center', lineHeight:1.2,
                                                        display:'-webkit-box', WebkitLineClamp:2,
                                                        WebkitBoxOrient:'vertical', overflow:'hidden',
                                                        width:'100%'
                                                    }}>{entry.fullname}</p>
                                                    <p style={{
                                                        fontSize:'18px', fontWeight:900, lineHeight:1, marginTop:'6px',
                                                        color: isFirst ? '#fff' : '#1e293b',
                                                    }}>{entry.totalPoints}<span style={{ fontSize:'10px', fontWeight:500, opacity:0.7, marginLeft:'2px' }}>đ</span></p>
                                                    <p style={{ fontSize:'10px', color: isFirst ? 'rgba(255,255,255,0.7)' : '#94a3b8', marginTop:'3px' }}>
                                                        ⏱ {formatTime(entry.totalTime)}
                                                    </p>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}

                            {/* ── FULL LIST ── */}
                            <div style={{ display:'flex', flexDirection:'column', gap:'8px' }}>
                                {data.entries.map((entry: ExamLeaderboardEntryDto, idx: number) => {
                                    const isTop = entry.rank <= 3;
                                    const rs = isTop ? RANK_STYLE[entry.rank - 1] : null;

                                    // colour bar left side for rank 1-3
                                    const barColor = isTop ? rs!.ring : '#e2e8f0';

                                    return (
                                        <div
                                            key={entry.profileId}
                                            className="lb-row"
                                            style={{
                                                display:'flex', alignItems:'center', gap:'12px',
                                                padding:'12px 14px',
                                                background: isTop ? `${rs!.ring}18` : '#fff',
                                                borderRadius:'16px',
                                                border: `1.5px solid ${isTop ? rs!.ring + '55' : '#e9eef7'}`,
                                                position:'relative', overflow:'hidden',
                                                animationDelay: `${idx * 0.04}s`,
                                            }}
                                        >
                                            {/* Left colour accent bar */}
                                            <div style={{
                                                position:'absolute', left:0, top:0, bottom:0,
                                                width:'4px', borderRadius:'0 2px 2px 0',
                                                background: barColor,
                                            }} />

                                            {/* Rank */}
                                            <div style={{
                                                width:'36px', height:'36px', flexShrink:0,
                                                borderRadius:'50%', marginLeft:'4px',
                                                background: isTop ? rs!.bg : '#f1f5f9',
                                                border: isTop ? `2px solid ${rs!.ring}` : '2px solid #e2e8f0',
                                                display:'flex', alignItems:'center', justifyContent:'center',
                                                fontWeight:900, fontSize: isTop ? '16px' : '13px',
                                                color: isTop ? rs!.text : '#64748b',
                                                boxShadow: isTop ? `0 2px 8px ${rs!.shadow}` : 'none',
                                            }}>
                                                {isTop ? RANK_ICONS[entry.rank - 1] : entry.rank}
                                            </div>

                                            {/* Info */}
                                            <div style={{ flex:1, minWidth:0 }}>
                                                <p style={{
                                                    fontSize:'14px', fontWeight:700,
                                                    color: isTop && entry.rank === 1 ? accentColor : '#1e293b',
                                                    whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis',
                                                }}>{entry.fullname}</p>
                                                <p style={{ fontSize:'12px', color:'#94a3b8', marginTop:'2px', display:'flex', alignItems:'center', gap:'4px' }}>
                                                    <span style={{ fontSize:'10px' }}>🏫</span>
                                                    <span style={{ whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>
                                                        {entry.school || entry.class || 'Học sinh'}
                                                    </span>
                                                </p>
                                            </div>

                                            {/* Score + time */}
                                            <div style={{ textAlign:'right', flexShrink:0 }}>
                                                <p style={{
                                                    fontSize:'20px', fontWeight:900,
                                                    color: entry.rank === 1 ? accentColor : entry.rank <= 3 ? rs!.text : '#334155',
                                                    lineHeight:1,
                                                }}>
                                                    {entry.totalPoints}
                                                    <span style={{ fontSize:'11px', fontWeight:500, color:'#94a3b8', marginLeft:'2px' }}>đ</span>
                                                </p>
                                                <p style={{ fontSize:'11px', color:'#94a3b8', marginTop:'3px', fontWeight:500 }}>
                                                    ⏱ {formatTime(entry.totalTime)}
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Footer note */}
                            <p style={{
                                textAlign:'center', fontSize:'11px', color:'#cbd5e1',
                                marginTop:'16px', fontWeight:500
                            }}>
                                Xếp hạng theo điểm cao → thời gian ngắn
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
