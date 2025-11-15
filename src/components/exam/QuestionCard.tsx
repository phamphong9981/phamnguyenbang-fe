'use client';

import React from 'react';
import RichRenderer from '@/components/RichRenderer';
import ImageAnswer from '@/components/ImageAnswer';
import QuestionOptions from './QuestionOptions';
import SubQuestionCard from './SubQuestionCard';

interface QuestionCardProps {
    question: {
        content: string;
        image?: string;
        images?: string[] | string;
        question_type: string;
        options?: Record<string, string>;
        subQuestions?: Array<{
            id: string;
            content: string;
            question_type?: string;
            options?: Record<string, string>;
        }>;
    };
    questionNumber: number;
    questionId: string; // Add questionId for unique radio button grouping
    selectedAnswer: string[];
    subAnswers?: { [key: string]: string[] };
    onAnswerSelect: (answer: string, questionType: string, isMultiple: boolean) => void;
    onSubAnswerSelect: (subQuestionId: string, answer: string, questionType: string, isMultiple: boolean) => void;
    isImageAnswer: (answer: string) => boolean;
}

export default function QuestionCard({
    question,
    questionNumber,
    questionId,
    selectedAnswer,
    subAnswers,
    onAnswerSelect,
    onSubAnswerSelect,
    isImageAnswer
}: QuestionCardProps) {
    // Helper function to render content with image placeholders
    const renderContentWithImages = (content: string, images?: string[] | string): React.ReactNode => {
        // Convert images to array if it's a string
        const imagesArray = Array.isArray(images) ? images : (images ? [images] : []);

        // Check if content contains image_placeholder
        const placeholders = content.match(/image_placeholder/gi) || [];

        if (placeholders.length === 0) {
            // No placeholders, render content normally, then add all images at the end if they exist
            return (
                <>
                    <RichRenderer content={content} />
                    {imagesArray.length > 0 && (
                        <div className="mt-4 space-y-4">
                            {imagesArray.map((imageUrl, idx) => (
                                <div key={`default-img-${idx}`} className="my-4">
                                    <img
                                        src={imageUrl}
                                        alt={`Image ${idx + 1}`}
                                        className="max-w-full rounded border border-gray-200"
                                        onError={(e) => {
                                            e.currentTarget.style.display = 'none';
                                        }}
                                    />
                                </div>
                            ))}
                        </div>
                    )}
                </>
            );
        }

        // Split content by placeholders and insert images
        const parts = content.split(/(image_placeholder)/gi);
        const elements: React.ReactNode[] = [];
        let imageIndex = 0;
        const unusedImages: string[] = [];

        parts.forEach((part, index) => {
            if (part.toLowerCase() === 'image_placeholder') {
                if (imageIndex < imagesArray.length) {
                    const imageUrl = imagesArray[imageIndex];
                    elements.push(
                        <div key={`img-${index}`} className="my-4">
                            <img
                                src={imageUrl}
                                alt={`Image ${imageIndex + 1}`}
                                className="max-w-full rounded border border-gray-200"
                                onError={(e) => {
                                    e.currentTarget.style.display = 'none';
                                }}
                            />
                        </div>
                    );
                    imageIndex++;
                } else {
                    // Placeholder without image - will be handled later
                    imageIndex++;
                }
            } else if (part.trim()) {
                elements.push(
                    <span key={`text-${index}`}>
                        <RichRenderer content={part} />
                    </span>
                );
            }
        });

        // Add unused images at the end
        if (imageIndex < imagesArray.length) {
            unusedImages.push(...imagesArray.slice(imageIndex));
        }

        return (
            <>
                {elements}
                {unusedImages.length > 0 && (
                    <div className="mt-4 space-y-4">
                        {unusedImages.map((imageUrl, idx) => (
                            <div key={`unused-img-${idx}`} className="my-4">
                                <img
                                    src={imageUrl}
                                    alt={`Image ${imageIndex + idx}`}
                                    className="max-w-full rounded border border-gray-200"
                                    onError={(e) => {
                                        e.currentTarget.style.display = 'none';
                                    }}
                                />
                            </div>
                        ))}
                    </div>
                )}
            </>
        );
    };

    // Get images - prefer images array over image string
    const images = question.images || (question.image ? question.image : undefined);

    return (
        <div
            id={`question-${questionNumber - 1}`}
            className="bg-white rounded-lg shadow-lg p-8"
        >
            {/* Question Header */}
            <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                        <h2 className="px-3 py-1 bg-green-100 text-blue-800 rounded-full text-sm font-medium">
                            Câu {questionNumber}
                        </h2>
                    </div>
                </div>
            </div>

            {/* Question Content */}
            <div className="mb-8">
                {isImageAnswer(question.content) ? (
                    <div className="mb-6">
                        <ImageAnswer
                            src={question.content}
                            alt={`Câu hỏi ${questionNumber}`}
                        />
                    </div>
                ) : (
                    <div className="text-lg text-gray-900 leading-relaxed mb-6 font-sans">
                        {renderContentWithImages(question.content, images)}
                    </div>
                )}

                {/* Legacy Question Image - only show if no images array and content has no placeholders */}
                {question.image && !question.images && !question.content.match(/image_placeholder/gi) && (
                    <div className="mb-6">
                        <img
                            src={question.image}
                            alt={`Hình ảnh câu hỏi ${questionNumber}`}
                            className="w-[50%] mx-auto h-auto rounded-lg border border-gray-200 shadow-sm"
                            onError={(e) => {
                                e.currentTarget.style.display = 'none';
                            }}
                            onLoad={(e) => {
                                e.currentTarget.style.display = 'block';
                            }}
                        />
                    </div>
                )}

                {/* Regular Questions */}
                {question.question_type !== 'group_question' && (
                    <QuestionOptions
                        questionType={question.question_type}
                        options={question.options}
                        selectedAnswer={selectedAnswer}
                        onAnswerSelect={onAnswerSelect}
                        isImageAnswer={isImageAnswer}
                        questionId={questionId}
                    />
                )}

                {/* Group Questions */}
                {question.question_type === 'group_question' && question.subQuestions && (
                    <div className="space-y-6">
                        {question.subQuestions.map((subQuestion) => (
                            <SubQuestionCard
                                key={subQuestion.id}
                                subQuestion={subQuestion}
                                subAnswer={subAnswers?.[subQuestion.id] || []}
                                onSubAnswerSelect={onSubAnswerSelect}
                                isImageAnswer={isImageAnswer}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
