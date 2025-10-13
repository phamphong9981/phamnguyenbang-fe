'use client';

import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';
import { Fragment } from 'react';

interface MathRendererProps {
    content: string;
    className?: string;
}

export default function MathRenderer({ content, className = '' }: MathRendererProps) {
    // Function to render math content with HTML support
    const renderMathContent = (text: string) => {
        // Split by math delimiters
        const parts = text.split(/(\$[^$]+\$|\\\([^)]+\\\)|\\\[[^\]]+\\\])/);

        return parts.map((part, index) => {
            // Inline math: $...$ or \(...\)
            if (part.match(/^\$[^$]+\$/)) {
                const math = part.slice(1, -1);
                return (
                    <InlineMath key={index} math={math} />
                );
            }

            // Display math: \[...\]
            if (part.match(/^\\\[[^\]]+\\\]$/)) {
                const math = part.slice(2, -2);
                return (
                    <BlockMath key={index} math={math} />
                );
            }

            // Check if part contains HTML tags
            if (part.match(/<[^>]+>/)) {
                // Render HTML content
                return (
                    <span
                        key={index}
                        dangerouslySetInnerHTML={{ __html: part }}
                    />
                );
            }

            // Regular text
            return <span key={index}>{part}</span>;
        });
    };

    return (
        <div className={className}>
            {renderMathContent(content)}
        </div>
    );
} 