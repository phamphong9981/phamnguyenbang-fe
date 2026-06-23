'use client';

import React from 'react';
import RichRenderer from '@/components/RichRenderer';
import ImageAnswer from '@/components/ImageAnswer';
import QuestionCard from './QuestionCard';

interface GroupQuestionSplitViewProps {
    question: {
        content: string;
        image?: string;
        images?: string[] | string;
        question_type?: string;
        subQuestions?: Array<{
            id: string;
            content: string;
            images?: string[] | string;
            question_type?: string;
            options?: Record<string, string>;
            subQuestions?: Array<{
                id: string;
                content: string;
                images?: string[] | string;
                question_type?: string;
                options?: Record<string, string>;
            }>;
        }>;
    };
    questionNumber: number;
    questionId: string;
    subAnswers?: { [key: string]: string[] };
    onSubAnswerSelect: (subQuestionId: string, answer: string | string[], questionType: string, isMultiple: boolean) => void;
    isImageAnswer: (answer: string) => boolean;
    isMarked?: boolean;
    onMarkQuestion?: () => void;
    fillViewport?: boolean;
}

export default function GroupQuestionSplitView({
    question,
    questionNumber,
    questionId,
    subAnswers,
    onSubAnswerSelect,
    isImageAnswer,
    isMarked,
    onMarkQuestion,
    fillViewport = false,
}: GroupQuestionSplitViewProps) {
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
            className={`overflow-hidden bg-white border border-gray-200 ${fillViewport
                ? 'flex h-full min-h-0 flex-col rounded-none p-0 shadow-none'
                : 'rounded-lg shadow-lg p-2'}`}
        >
            {/* Question Header */}
            <div className={`border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50 shrink-0 ${fillViewport ? 'px-4 py-2' : 'px-8 py-4'}`}>
                <div className="flex items-center justify-between">
                    <span className="inline-flex h-6 min-w-6 items-center justify-center rounded bg-white px-1.5 text-xs font-semibold tabular-nums text-gray-700 shadow-sm">
                        {questionNumber}
                    </span>
                    {onMarkQuestion && (
                        <label className="flex items-center cursor-pointer space-x-2 text-sm text-gray-700 hover:text-orange-600 transition-colors bg-white/60 px-3 py-1.5 rounded-lg border border-gray-200">
                            <input
                                type="checkbox"
                                checked={!!isMarked}
                                onChange={onMarkQuestion}
                                className="w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
                            />
                            <span className="font-medium select-none">Đánh dấu kiểm tra lại</span>
                        </label>
                    )}
                </div>
            </div>

            {/* Split View Layout */}
            <div className={`grid min-h-0 ${fillViewport ? 'h-full flex-1 grid-cols-2' : 'min-h-[600px] grid-cols-1 lg:grid-cols-2'}`}>
                {/* Left Side - Question Content */}
                <div className={`overflow-y-auto border-r border-gray-200 bg-gradient-to-br from-gray-50 to-blue-50 ${fillViewport ? 'min-h-0 h-full p-4' : 'max-h-[800px] p-8'}`}>
                    <div className="sticky top-0">
                        <div className="mb-4">
                            <h3 className="text-lg font-bold text-gray-900 mb-2 flex items-center">
                                <svg className="w-5 h-5 mr-2 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                </svg>
                                Nội dung câu hỏi
                            </h3>
                        </div>

                        {/* Question Content */}
                        {isImageAnswer(question.content) ? (
                            <div className="mb-6">
                                <ImageAnswer
                                    src={question.content}
                                    alt={`Câu hỏi ${questionNumber}`}
                                />
                            </div>
                        ) : (
                            <div className="text-base text-gray-800 leading-relaxed mb-6 font-sans bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                                {renderContentWithImages(question.content, images)}
                            </div>
                        )}

                        {/* Legacy Question Image - only show if no images array and content has no placeholders */}
                        {question.image && !question.images && !question.content.match(/image_placeholder/gi) && (
                            <div className="mb-6">
                                <img
                                    src={question.image}
                                    alt={`Hình ảnh câu hỏi ${questionNumber}`}
                                    className="w-full h-auto rounded-lg border border-gray-200 shadow-md"
                                    onError={(e) => {
                                        e.currentTarget.style.display = 'none';
                                    }}
                                    onLoad={(e) => {
                                        e.currentTarget.style.display = 'block';
                                    }}
                                />
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Side - Sub Questions */}
                <div className={`overflow-y-auto bg-white ${fillViewport ? 'min-h-0 h-full' : 'max-h-[800px]'}`}>
                    <div className={`sticky top-0 z-10 border-b border-gray-100 bg-white ${fillViewport ? 'p-3' : 'p-8'}`}>
                        <h3 className="text-lg font-bold text-gray-900 flex items-center">
                            <svg className="w-5 h-5 mr-2 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                            </svg>
                            Các câu hỏi
                        </h3>
                    </div>

                    {/* Sub Questions List */}
                    {question.subQuestions && question.subQuestions.length > 0 ? (
                        <div className={`space-y-6 ${fillViewport ? 'p-3' : 'p-8'}`}>
                            {question.subQuestions.map((subQuestion, index) => (
                                <div key={subQuestion.id} className="relative">
                                    {/* Sub Question Number Badge */}
                                    <div className="absolute -left-4 top-0">
                                        <span className="inline-flex h-6 min-w-6 items-center justify-center rounded bg-gray-100 px-1.5 text-xs font-semibold tabular-nums text-gray-700">
                                            {index + 1}
                                        </span>
                                    </div>

                                    {(() => {
                                        // Build full path including parent questionId
                                        const pathKey = `${questionId}_${subQuestion.id}`;
                                        return (
                                            <QuestionCard
                                                question={subQuestion}
                                                questionId={pathKey}
                                                selectedAnswer={subAnswers?.[pathKey] || []}
                                                onAnswerSelect={(answer, questionType, isMultiple) =>
                                                    onSubAnswerSelect(pathKey, answer, questionType, isMultiple)
                                                }
                                                onSubAnswerSelect={(nestedSubQuestionId, answer, questionType, isMultiple) => {
                                                    // For nested group questions, nestedSubQuestionId is already a full path
                                                    // (e.g., "parent_child_grandchild"), so use it directly
                                                    console.log('🟣 GroupQuestionSplitView received nested call:', {
                                                        pathKey,
                                                        nestedSubQuestionId,
                                                        willUse: nestedSubQuestionId
                                                    });
                                                    onSubAnswerSelect(nestedSubQuestionId, answer, questionType, isMultiple);
                                                }}
                                                subAnswers={subAnswers}
                                                isImageAnswer={isImageAnswer}
                                                isSubQuestion={true}
                                            />
                                        );
                                    })()}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12 text-gray-500">
                            <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                            </svg>
                            <p>Không có câu hỏi con</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

