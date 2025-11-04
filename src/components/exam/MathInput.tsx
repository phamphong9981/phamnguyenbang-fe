'use client';

import { useState } from 'react';
import { InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';

interface MathInputProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    className?: string;
}

// Các ký hiệu toán học phổ biến
const mathSymbols = [
    { label: '√', latex: '\\sqrt{ }' },
    { label: '√x', latex: '\\sqrt{x}' },
    { label: '²', latex: '^2' },
    { label: '³', latex: '^3' },
    { label: 'ⁿ', latex: '^{n}' },
    { label: '×', latex: '\\times' },
    { label: '÷', latex: '\\div' },
    { label: '±', latex: '\\pm' },
    { label: '≤', latex: '\\leq' },
    { label: '≥', latex: '\\geq' },
    { label: '≠', latex: '\\neq' },
    { label: '≈', latex: '\\approx' },
    { label: '∞', latex: '\\infty' },
    { label: 'π', latex: '\\pi' },
    { label: 'α', latex: '\\alpha' },
    { label: 'β', latex: '\\beta' },
    { label: 'θ', latex: '\\theta' },
    { label: '∑', latex: '\\sum' },
    { label: '∫', latex: '\\int' },
    { label: '∂', latex: '\\partial' },
    { label: 'Δ', latex: '\\Delta' },
    { label: '°', latex: '^{\\circ}' },
    { label: '°C', latex: '^{\\circ}C' },
    { label: '°F', latex: '^{\\circ}F' },
    { label: '½', latex: '\\frac{1}{2}' },
    { label: '¼', latex: '\\frac{1}{4}' },
    { label: '¾', latex: '\\frac{3}{4}' },
];

export default function MathInput({
    value,
    onChange,
    placeholder = 'Nhập đáp án của bạn...',
    className = ''
}: MathInputProps) {
    const [inputRef, setInputRef] = useState<HTMLInputElement | null>(null);
    const [showPreview, setShowPreview] = useState(true);

    const insertSymbol = (latex: string) => {
        if (!inputRef) return;

        const start = inputRef.selectionStart || 0;
        const end = inputRef.selectionEnd || 0;
        const before = value.substring(0, start);
        const after = value.substring(end);

        // Find placeholder position in latex (usually { } or space)
        let newCursorPos = start;
        if (latex.includes('{ }')) {
            // Place cursor inside { }
            const placeholderIndex = latex.indexOf('{ }');
            newCursorPos = start + placeholderIndex + 1;
            latex = latex.replace('{ }', '{}');
        } else if (latex.includes(' ')) {
            // Place cursor at space position
            const spaceIndex = latex.indexOf(' ');
            newCursorPos = start + spaceIndex;
            latex = latex.replace(' ', '');
        } else {
            // Place cursor at end of inserted text
            newCursorPos = start + latex.length;
        }

        const newValue = before + latex + after;
        onChange(newValue);

        // Set cursor position after insertion
        setTimeout(() => {
            if (inputRef) {
                inputRef.setSelectionRange(newCursorPos, newCursorPos);
                inputRef.focus();
            }
        }, 0);
    };

    // Check if value contains LaTeX math delimiters or common math symbols
    const hasMath = (text: string): boolean => {
        return /[\$\\\{\}\^_\{\}]|sqrt|frac|sum|int|alpha|beta|pi|theta|Delta|infty/.test(text);
    };

    // Extract math content from text
    const extractMathParts = (text: string) => {
        // Support both $...$ and inline LaTeX
        const parts: Array<{ type: 'text' | 'math'; content: string }> = [];
        const regex = /\$([^$]+)\$/g;
        let lastIndex = 0;
        let match;

        while ((match = regex.exec(text)) !== null) {
            // Add text before math
            if (match.index > lastIndex) {
                parts.push({
                    type: 'text',
                    content: text.substring(lastIndex, match.index)
                });
            }
            // Add math
            parts.push({
                type: 'math',
                content: match[1]
            });
            lastIndex = regex.lastIndex;
        }

        // Add remaining text
        if (lastIndex < text.length) {
            parts.push({
                type: 'text',
                content: text.substring(lastIndex)
            });
        }

        // If no math found but contains math-like content, treat entire as math
        if (parts.length === 1 && parts[0].type === 'text' && hasMath(parts[0].content)) {
            return [{ type: 'math', content: text }];
        }

        return parts.length > 0 ? parts : [{ type: 'text', content: text }];
    };

    const mathParts = extractMathParts(value);

    return (
        <div className={`space-y-2 ${className}`}>
            <div className="p-4 border-2 bg-gray-50 border-gray-200 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-gray-700">
                        Nhập đáp án:
                    </label>
                    <button
                        type="button"
                        onClick={() => setShowPreview(!showPreview)}
                        className="text-xs text-blue-600 hover:text-blue-800"
                    >
                        {showPreview ? 'Ẩn' : 'Hiện'} preview
                    </button>
                </div>

                <input
                    ref={setInputRef}
                    type="text"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="w-full text-black px-3 py-2 border font-bold bg-white border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder={placeholder}
                />

                {/* Math Symbols Toolbar */}
                <div className="mt-2 flex flex-wrap gap-1 p-2 bg-white border border-gray-200 rounded">
                    {mathSymbols.map((symbol, index) => (
                        <button
                            key={index}
                            type="button"
                            onClick={() => insertSymbol(symbol.latex)}
                            className="px-2 py-1 text-sm bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded transition-colors"
                            title={symbol.latex}
                        >
                            {symbol.label}
                        </button>
                    ))}
                </div>

                {/* Preview */}
                {showPreview && value && (
                    <div className="mt-3 p-3 bg-white border border-gray-200 rounded">
                        <div className="text-xs text-gray-500 mb-1">Preview:</div>
                        <div className="min-h-[40px] flex items-center">
                            {mathParts.map((part, index) => {
                                if (part.type === 'math') {
                                    try {
                                        return (
                                            <span key={index} className="inline-block mx-1">
                                                <InlineMath math={part.content} />
                                            </span>
                                        );
                                    } catch {
                                        return (
                                            <span key={index} className="text-red-500 text-sm">
                                                {`$${part.content}$`}
                                            </span>
                                        );
                                    }
                                } else {
                                    return part.content ? (
                                        <span key={index}>{part.content}</span>
                                    ) : null;
                                }
                            })}
                        </div>
                    </div>
                )}

                {/* Helper text */}
                <div className="mt-2 text-xs text-gray-500">
                    💡 Tip: Sử dụng $...$ để nhập công thức toán học, ví dụ: $x^2 + 2x + 1 = 0$
                </div>
            </div>
        </div>
    );
}
