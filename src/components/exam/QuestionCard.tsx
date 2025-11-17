'use client';

import React from 'react';
import RichRenderer from '@/components/RichRenderer';
import ImageAnswer from '@/components/ImageAnswer';
import QuestionOptions from './QuestionOptions';
import MathInput from './MathInput';

interface QuestionCardProps {
    question: {
        content: string;
        image?: string;
        images?: string[] | string;
        question_type?: string; // Optional, defaults to 'true_false' for subquestions
        options?: Record<string, string>;
        subQuestions?: Array<{
            id: string;
            content: string;
            images?: string[] | string;
            question_type?: string;
            options?: Record<string, string>;
        }>;
    };
    questionNumber?: number; // Optional for subquestions
    questionId: string; // Add questionId for unique radio button grouping
    selectedAnswer: string[];
    subAnswers?: { [key: string]: string[] };
    onAnswerSelect: (answer: string, questionType: string, isMultiple: boolean) => void;
    onSubAnswerSelect?: (subQuestionId: string, answer: string, questionType: string, isMultiple: boolean) => void;
    isImageAnswer: (answer: string) => boolean;
    isSubQuestion?: boolean; // Flag to render as subquestion (compact mode)
}

export default function QuestionCard({
    question,
    questionNumber,
    questionId,
    selectedAnswer,
    subAnswers,
    onAnswerSelect,
    onSubAnswerSelect,
    isImageAnswer,
    isSubQuestion = false
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
    const questionType = question.question_type || 'true_false';
    const isQuestionImage = isImageAnswer(question.content);

    // Determine wrapper className based on isSubQuestion
    const wrapperClassName = isSubQuestion
        ? 'border border-gray-200 rounded-lg p-4'
        : 'bg-white rounded-lg shadow-lg p-8';

    const contentClassName = isSubQuestion
        ? 'text-base text-gray-900 leading-relaxed mb-4 font-sans'
        : 'text-lg text-gray-900 leading-relaxed mb-6 font-sans';

    return (
        <div
            id={questionNumber ? `question-${questionNumber - 1}` : undefined}
            className={wrapperClassName}
        >
            {/* Question Header - Only for main questions */}
            {!isSubQuestion && questionNumber && (
                <div className="mb-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-2">
                            <h2 className="px-3 py-1 bg-green-100 text-blue-800 rounded-full text-sm font-medium">
                                Câu {questionNumber}
                            </h2>
                        </div>
                    </div>
                </div>
            )}

            {/* Question Content */}
            <div className={isSubQuestion ? 'mb-4' : 'mb-8'}>
                {isQuestionImage ? (
                    <div className={isSubQuestion ? 'mb-4' : 'mb-6'}>
                        <ImageAnswer
                            src={question.content}
                            alt={`Câu hỏi ${questionNumber || questionId}`}
                        />
                    </div>
                ) : (
                    <div className={contentClassName}>
                        {isSubQuestion ? (
                            <h4 className="font-medium text-gray-900 mb-2">
                                {renderContentWithImages(question.content, images)}
                            </h4>
                        ) : (
                            renderContentWithImages(question.content, images)
                        )}
                    </div>
                )}

                {/* Legacy Question Image - only show for main questions if no images array and content has no placeholders */}
                {!isSubQuestion && question.image && !question.images && !question.content.match(/image_placeholder/gi) && (
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

                {/* Regular Questions (non-group questions) */}
                {questionType !== 'group_question' && (
                    <>
                        {questionType === 'short_answer' ? (
                            <div className="space-y-3">
                                <MathInput
                                    value={Array.isArray(selectedAnswer) ? selectedAnswer[0] || '' : ''}
                                    onChange={(value) => {
                                        onAnswerSelect(value, questionType, false);
                                    }}
                                    placeholder="Nhập đáp án của bạn..."
                                />
                            </div>
                        ) : (
                            <QuestionOptions
                                questionType={questionType}
                                options={question.options}
                                selectedAnswer={Array.isArray(selectedAnswer) ? selectedAnswer : []}
                                onAnswerSelect={onAnswerSelect}
                                isImageAnswer={isImageAnswer}
                                questionId={questionId}
                            />
                        )}
                    </>
                )}

                {/* Group Questions - Recursive render subQuestions */}
                {questionType === 'group_question' && question.subQuestions && onSubAnswerSelect && (
                    <div className="space-y-6">
                        {question.subQuestions.map((subQuestion) => {
                            // For nested group questions (when isSubQuestion is true), 
                            // we need to construct the full path for the subQuestionId
                            // The key in subAnswers should be the path from the main question's perspective
                            let nestedSubQuestionId: string;
                            
                            if (isSubQuestion) {
                                // Extract the actual subquestion ID from questionId
                                // Examples:
                                // - "sub-sub-1" -> extract "sub-1" (remove first "sub-")
                                // - "question-1_sub-1" -> extract "sub-1" (get last segment after "_")
                                let baseId = questionId;
                                if (questionId.startsWith('sub-')) {
                                    // Handle case like "sub-sub-1" -> "sub-1"
                                    baseId = questionId.replace(/^sub-/, '');
                                } else if (questionId.includes('_')) {
                                    // Handle case like "question-1_sub-1" -> "sub-1"
                                    baseId = questionId.split('_').pop() || questionId;
                                }
                                // For nested subquestions, use: baseId_nestedId
                                nestedSubQuestionId = `${baseId}_${subQuestion.id}`;
                            } else {
                                // For top-level subquestions, use just the subquestion ID
                                nestedSubQuestionId = subQuestion.id;
                            }
                            
                            return (
                                <QuestionCard
                                    key={subQuestion.id}
                                    question={subQuestion}
                                    questionId={`${questionId}_${subQuestion.id}`}
                                    selectedAnswer={subAnswers?.[nestedSubQuestionId] || []}
                                    onAnswerSelect={(answer, questionType, isMultiple) =>
                                        onSubAnswerSelect(nestedSubQuestionId, answer, questionType, isMultiple)
                                    }
                                    onSubAnswerSelect={onSubAnswerSelect}
                                    subAnswers={subAnswers}
                                    isImageAnswer={isImageAnswer}
                                    isSubQuestion={true}
                                />
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
