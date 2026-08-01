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
    inline = false,
}: { content: string; className?: string; inline?: boolean }) {
    const normalized = normalizeMathDelimiters(content);
    const Wrapper = inline ? 'span' : 'div';
    const inlineComponents = inline
        ? {
            p: ({ children }: { children?: React.ReactNode }) => (
                <span className="inline">{children}</span>
            ),
            div: ({ children }: { children?: React.ReactNode }) => (
                <span className="inline">{children}</span>
            ),
        }
        : {};

    return (
        <Wrapper className={inline ? `inline ${className}`.trim() : className}>
            <ReactMarkdown
                remarkPlugins={[
                    remarkGfm,
                    [remarkMath, { singleDollarTextMath: true }],  // 👈 bật $...$
                ]}
                rehypePlugins={[rehypeRaw, rehypeKatex]}
                components={{
                    ...inlineComponents,
                    a: ({ node, ...props }) => <a {...props} target="_blank" rel="noreferrer" />,
                }}
            >
                {normalized}
            </ReactMarkdown>
        </Wrapper>
    );
}
