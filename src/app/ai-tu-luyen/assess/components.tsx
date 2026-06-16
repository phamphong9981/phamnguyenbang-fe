/* Ring (vòng tròn mastery) + RichText (render text + $latex$ inline). */
import React, { useMemo } from 'react';
import { InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';

export function Ring({
    value,
    size = 96,
    stroke = 11,
    color = 'var(--accent-300)',
    track = 'rgba(255,255,255,0.22)',
}: {
    value: number;
    size?: number;
    stroke?: number;
    color?: string;
    track?: string;
}) {
    const r = (size - stroke) / 2;
    const c = 2 * Math.PI * r;
    const dash = ((value || 0) / 100) * c;
    return (
        <svg viewBox={`0 0 ${size} ${size}`}>
            <circle className="track" cx={size / 2} cy={size / 2} r={r} fill="none" strokeWidth={stroke} stroke={track} />
            <circle
                className="fill" cx={size / 2} cy={size / 2} r={r} fill="none" strokeWidth={stroke}
                stroke={color} strokeDasharray={`${dash} ${c}`} strokeLinecap="round"
            />
        </svg>
    );
}

/** Render văn bản trộn LaTeX: "Tính $\\lim x$ và $y$" → text + công thức inline. */
export function RichText({ text }: { text: string }) {
    const parts = useMemo(() => {
        const out: { t: 't' | 'm'; v: string }[] = [];
        let i = 0;
        const re = /\$([^$]+)\$/g;
        let m: RegExpExecArray | null;
        while ((m = re.exec(text)) !== null) {
            if (m.index > i) out.push({ t: 't', v: text.slice(i, m.index) });
            out.push({ t: 'm', v: m[1] });
            i = m.index + m[0].length;
        }
        if (i < text.length) out.push({ t: 't', v: text.slice(i) });
        return out;
    }, [text]);
    return (
        <span>
            {parts.map((p, idx) =>
                p.t === 't'
                    ? <span key={idx}>{p.v}</span>
                    : <InlineMath key={idx} math={p.v} />,
            )}
        </span>
    );
}
