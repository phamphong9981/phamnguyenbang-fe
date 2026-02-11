'use client';

import React, { useState, useEffect } from 'react';
import RichRenderer from '@/components/RichRenderer';
import { GripVertical, X } from 'lucide-react';
import ImageAnswer from '@/components/ImageAnswer';

interface DragDropClozeProps {
    content: string;
    options: Record<string, string>;
    selectedAnswer: string[];
    onAnswerSelect: (answers: string[]) => void;
    isImageAnswer?: (answer: string) => boolean;
}

export default function DragDropCloze({
    content,
    options,
    selectedAnswer,
    onAnswerSelect,
    isImageAnswer
}: DragDropClozeProps) {
    const [draggedOption, setDraggedOption] = useState<string | null>(null);
    const [placeholders, setPlaceholders] = useState<number>(0);

    // Calculate number of placeholders
    useEffect(() => {
        const matches = content.match(/{{drop_placeholder}}/g);
        setPlaceholders(matches ? matches.length : 0);
    }, [content]);

    // Handle drag start
    const handleDragStart = (e: React.DragEvent, optionKey: string) => {
        setDraggedOption(optionKey);
        e.dataTransfer.effectAllowed = 'copy';
        // Set drag image or data if needed
    };

    // Handle drop on a zone
    const handleDrop = (e: React.DragEvent, index: number) => {
        e.preventDefault();
        if (draggedOption) {
            const newAnswers = [...selectedAnswer];
            // Resize array if needed (fill with empty strings)
            while (newAnswers.length <= index) {
                newAnswers.push('');
            }
            newAnswers[index] = draggedOption;
            onAnswerSelect(newAnswers);
            setDraggedOption(null);
        }
    };

    // Handle clearing a zone
    const handleClearZone = (index: number) => {
        const newAnswers = [...selectedAnswer];
        if (index < newAnswers.length) {
            newAnswers[index] = '';
            onAnswerSelect(newAnswers);
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'copy';
    };

    // Split content by placeholder
    const renderContent = () => {
        const parts = content.split(/{{drop_placeholder}}/g);
        const elements: React.ReactNode[] = [];

        parts.forEach((part, index) => {
            // Add the text part
            if (part) {
                elements.push(
                    <span key={`text-${index}`} className="leading-loose inline">
                        <RichRenderer content={part} />
                    </span>
                );
            }

            // Add the drop zone (if not the last part, as split creates n+1 parts for n separators)
            if (index < parts.length - 1) {
                const filledOptionKey = selectedAnswer[index];
                const filledOptionContent = filledOptionKey ? options[filledOptionKey] : null;
                const isImage = filledOptionContent && isImageAnswer && isImageAnswer(filledOptionContent);

                elements.push(
                    <span
                        key={`zone-${index}`}
                        className={`inline-flex items-center justify-center min-w-[120px] min-h-[40px] mx-2 px-3 py-1 align-middle border-2 border-dashed rounded-lg transition-colors ${filledOptionKey
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-300 bg-gray-50 hover:border-gray-400'
                            }`}
                        onDragOver={handleDragOver}
                        onDrop={(e) => handleDrop(e, index)}
                    >
                        {filledOptionKey ? (
                            <div className="flex items-center gap-2 group">
                                <span className="font-medium text-blue-700">
                                    {isImage ? (
                                        <div className="w-16 h-16 relative">
                                            <ImageAnswer
                                                src={filledOptionContent!}
                                                alt={filledOptionKey}
                                            />
                                        </div>
                                    ) : (
                                        <RichRenderer content={filledOptionContent || ''} />
                                    )}
                                </span>
                                <button
                                    onClick={() => handleClearZone(index)}
                                    className="p-0.5 rounded-full hover:bg-blue-100 text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <X size={14} />
                                </button>
                            </div>
                        ) : (
                            <span className="text-gray-400 text-sm italic pointer-events-none select-none">
                                Kéo thả vào đây
                            </span>
                        )}
                    </span>
                );
            }
        });

        return <div className="leading-loose">{elements}</div>;
    };

    return (
        <div className="space-y-8 select-none">
            {/* Question Content Area with Drop Zones */}
            <div className="p-4 bg-white rounded-xl border border-gray-100">
                {renderContent()}
            </div>

            {/* Draggable Options Area */}
            <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                <h4 className="text-sm font-semibold text-gray-500 mb-4 uppercase tracking-wider">
                    Lựa chọn đáp án
                </h4>
                <div className="flex flex-wrap gap-3">
                    {Object.entries(options).map(([key, value]) => {
                        // Check if this option is already used in any zone
                        const isUsed = selectedAnswer.includes(key);
                        const isImage = isImageAnswer && isImageAnswer(value);

                        return (
                            <div
                                key={key}
                                draggable={!isUsed}
                                onDragStart={(e) => !isUsed && handleDragStart(e, key)}
                                className={`
                                    relative flex items-center gap-2 px-4 py-3 rounded-lg border-2 shadow-sm transition-all
                                    ${isUsed
                                        ? 'opacity-50 grayscale border-gray-200 bg-gray-100 cursor-not-allowed'
                                        : 'cursor-grab active:cursor-grabbing border-blue-100 bg-white hover:border-blue-300 hover:shadow-md'
                                    }
                                `}
                            >
                                <GripVertical size={16} className={isUsed ? 'text-gray-300' : 'text-gray-400'} />
                                <span className={isUsed ? 'text-gray-500' : 'text-gray-800 font-medium'}>
                                    {isImage ? (
                                        <div className="w-20 h-20 relative">
                                            <ImageAnswer
                                                src={value}
                                                alt={key}
                                            />
                                        </div>
                                    ) : (
                                        <RichRenderer content={value} />
                                    )}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
