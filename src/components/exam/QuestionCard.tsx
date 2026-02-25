'use client';

import React from 'react';
import RichRenderer from '@/components/RichRenderer';
import ImageAnswer from '@/components/ImageAnswer';
import QuestionOptions from './QuestionOptions';
import DragDropCloze from './DragDropCloze';
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
    onAnswerSelect: (answer: string | string[], questionType: string, isMultiple: boolean) => void;
    onSubAnswerSelect?: (subQuestionId: string, answer: string | string[], questionType: string, isMultiple: boolean) => void;
    isImageAnswer: (answer: string) => boolean;
    isSubQuestion?: boolean; // Flag to render as subquestion (compact mode)
    isMarked?: boolean;
    onMarkQuestion?: () => void;
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
    isSubQuestion = false,
    isMarked,
    onMarkQuestion
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
                        {onMarkQuestion && (
                            <label className="flex items-center cursor-pointer space-x-2 text-sm text-gray-600 hover:text-orange-600 transition-colors">
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
                        {/* Only render content text if it's NOT a drag_drop_cloze question, because DragDropCloze handles the content rendering itself */}
                        {questionType !== 'drag_drop_cloze' && (
                            isSubQuestion ? (
                                <h4 className="font-medium text-gray-900 mb-2">
                                    {renderContentWithImages(question.content, images)}
                                </h4>
                            ) : (
                                renderContentWithImages(question.content, images)
                            )
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
                        {questionType === 'drag_drop_cloze' ? (
                            <DragDropCloze
                                content={question.content}
                                options={question.options || {}}
                                selectedAnswer={selectedAnswer}
                                onAnswerSelect={(answers) => onAnswerSelect(answers, questionType, false)}
                                isImageAnswer={isImageAnswer}
                            />
                        ) : questionType === 'short_answer' ? (
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
                            // For nested group questions, we need to construct the full path for the subQuestionId
                            // The key in subAnswers should be the path from the main question's perspective

                            // Extract the subId from questionId to find the current answer in subAnswers
                            // Examples:
                            // - "sub-sub1" -> "sub1" (remove "sub-" prefix)
                            // - "question-1_sub1" -> "sub1" (get part after last "_")
                            // - "sub-sub1_sub2" -> "sub1_sub2" (remove "sub-" prefix)
                            let currentSubId: string;
                            if (questionId.startsWith('sub-')) {
                                // Remove "sub-" prefix
                                currentSubId = questionId.replace(/^sub-/, '');
                            } else if (questionId.includes('_')) {
                                // Get everything after the first "_" (the subQuestion path)
                                const parts = questionId.split('_');
                                currentSubId = parts.slice(1).join('_');
                            } else {
                                currentSubId = questionId;
                            }

                            // For nested subquestions, append the subQuestion.id to the full path
                            const nestedSubQuestionId = `${questionId}_${subQuestion.id}`;

                            return (
                                <QuestionCard
                                    key={subQuestion.id}
                                    question={subQuestion}
                                    questionId={nestedSubQuestionId}
                                    selectedAnswer={subAnswers?.[nestedSubQuestionId] || []}
                                    onAnswerSelect={(answer, questionType, isMultiple) => {
                                        console.log('🔴 QuestionCard nested onAnswerSelect:', {
                                            subQuestionId: subQuestion.id,
                                            nestedSubQuestionId,
                                            answer,
                                            hasOnSubAnswerSelect: !!onSubAnswerSelect,
                                            onSubAnswerSelectType: typeof onSubAnswerSelect
                                        });
                                        // Call with full path
                                        if (onSubAnswerSelect) {
                                            console.log('🟢 Calling onSubAnswerSelect with:', { nestedSubQuestionId, answer, questionType, isMultiple });
                                            onSubAnswerSelect(nestedSubQuestionId, answer, questionType, isMultiple);
                                        } else {
                                            console.error('❌ onSubAnswerSelect is not defined!');
                                        }
                                    }}
                                    onSubAnswerSelect={(deeperNestedId, answer, questionType, isMultiple) => {
                                        // For deeper nested group questions, prefix with current path
                                        console.log('🔵 QuestionCard wrapping deeper nested call:', {
                                            subQuestionId: subQuestion.id,
                                            deeperNestedId
                                        });
                                        onSubAnswerSelect(deeperNestedId, answer, questionType, isMultiple);
                                    }}
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
