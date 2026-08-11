'use client';

import React from 'react';
import RichRenderer from '@/components/RichRenderer';

interface FillBlankProps {
    content: string;
    images?: string[] | string;
    selectedAnswer: string[];
    onAnswerSelect: (answers: string[]) => void;
    readOnly?: boolean;
}

function renderTextPartWithImages(
    part: string,
    imagesArray: string[],
    imageCursor: { index: number },
    keyPrefix: string
): React.ReactNode[] {
    const segments = part.split(/(image_placeholder)/gi);
    const nodes: React.ReactNode[] = [];

    segments.forEach((segment, segIdx) => {
        if (segment.toLowerCase() === 'image_placeholder') {
            const imageUrl = imagesArray[imageCursor.index];
            imageCursor.index++;
            if (imageUrl) {
                nodes.push(
                    <div key={`${keyPrefix}-img-${segIdx}`} className="my-4 block">
                        <img
                            src={imageUrl}
                            alt={`Image ${imageCursor.index}`}
                            className="max-w-full rounded border border-gray-200"
                            onError={(e) => {
                                e.currentTarget.style.display = 'none';
                            }}
                        />
                    </div>
                );
            }
        } else if (segment) {
            nodes.push(
                <span key={`${keyPrefix}-text-${segIdx}`} className="inline">
                    <RichRenderer content={segment} inline />
                </span>
            );
        }
    });

    return nodes;
}

export default function FillBlank({
    content,
    images,
    selectedAnswer,
    onAnswerSelect,
    readOnly = false,
}: FillBlankProps) {
    const handleInputChange = (index: number, value: string) => {
        const newAnswers = [...selectedAnswer];
        while (newAnswers.length <= index) {
            newAnswers.push('');
        }
        newAnswers[index] = value;
        onAnswerSelect(newAnswers);
    };

    const renderContent = () => {
        const imagesArray = Array.isArray(images) ? images : (images ? [images] : []);
        const imageCursor = { index: 0 };
        const parts = content.split(/{{blank}}/g);
        const elements: React.ReactNode[] = [];

        parts.forEach((part, index) => {
            if (part) {
                elements.push(
                    <span key={`text-${index}`} className="inline align-middle">
                        {renderTextPartWithImages(part, imagesArray, imageCursor, `part-${index}`)}
                    </span>
                );
            }

            if (index < parts.length - 1) {
                const value = selectedAnswer[index] ?? '';

                elements.push(
                    <span key={`blank-${index}`} className="inline-flex items-center mx-1 align-middle">
                        {readOnly ? (
                            <span className="inline-flex min-w-[80px] px-2 py-0.5 border-b-2 border-blue-500 font-medium text-blue-700">
                                {value || '___'}
                            </span>
                        ) : (
                            <input
                                type="text"
                                value={value}
                                onChange={(e) => handleInputChange(index, e.target.value)}
                                placeholder="..."
                                className="inline-block min-w-[100px] max-w-[200px] px-2 py-1 text-base border-b-2 border-gray-300 bg-transparent focus:border-blue-500 focus:outline-none transition-colors"
                                aria-label={`Ô trống ${index + 1}`}
                            />
                        )}
                    </span>
                );
            }
        });

        if (imageCursor.index < imagesArray.length) {
            imagesArray.slice(imageCursor.index).forEach((imageUrl, idx) => {
                elements.push(
                    <div key={`unused-img-${idx}`} className="my-4 block">
                        <img
                            src={imageUrl}
                            alt={`Image ${imageCursor.index + idx + 1}`}
                            className="max-w-full rounded border border-gray-200"
                            onError={(e) => {
                                e.currentTarget.style.display = 'none';
                            }}
                        />
                    </div>
                );
            });
        }

        return <div className="leading-loose text-base">{elements}</div>;
    };

    return (
        <div className="p-4 bg-white rounded-xl border border-gray-100">
            {renderContent()}
        </div>
    );
}
