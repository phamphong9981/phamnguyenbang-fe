'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypeRaw from 'rehype-raw';
import 'katex/dist/katex.min.css';
import 'katex/contrib/mhchem';

function normalizeMathDelimiters(s: string) {
    // vẫn giữ nếu bạn cần hỗ trợ \(..\) / \[..]
    return s
        ?.replace(/\\\(([\\s\\S]*?)\\\)/g, (_m, g1) => `$${g1}$`)
        ?.replace(/\\\[([\\s\\S]*?)\\\]/g, (_m, g1) => `$$${g1}$$`);
}

export default function RichRenderer({
    content,
    className = '',
}: { content: string; className?: string }) {
    const normalized = normalizeMathDelimiters(content);

    return (
        <div className={className}>
            <ReactMarkdown
                remarkPlugins={[
                    remarkGfm,
                    [remarkMath, { singleDollarTextMath: true }],  // 👈 bật $...$
                ]}
                rehypePlugins={[rehypeRaw, rehypeKatex]}
                components={{
                    a: ({ node, ...props }) => <a {...props} target="_blank" rel="noreferrer" />,
                }}
            >
                {normalized}
            </ReactMarkdown>
        </div>
    );
}
