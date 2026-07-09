'use client';

import React from 'react';
import RichRenderer from '@/components/RichRenderer';
import { QuestionDetailDto } from '@/hooks/useExam';

const formatQuestionDuration = (seconds?: number): string | null => {
    if (seconds == null || seconds < 0) return null;
    if (seconds < 60) return `${seconds} giây`;
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return secs > 0 ? `${minutes} phút ${secs} giây` : `${minutes} phút`;
};

const renderContentWithImages = (content: string, images?: string[] | string): React.ReactNode => {
    const imagesArray = Array.isArray(images) ? images : (images ? [images] : []);
    const placeholders = content.match(/image_placeholder/gi) || [];

    if (placeholders.length === 0) {
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
                                    onError={(e) => { e.currentTarget.style.display = 'none'; }}
                                />
                            </div>
                        ))}
                    </div>
                )}
            </>
        );
    }

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
                            onError={(e) => { e.currentTarget.style.display = 'none'; }}
                        />
                    </div>
                );
            }
            imageIndex++;
        } else if (part.trim()) {
            elements.push(
                <span key={`text-${index}`}>
                    <RichRenderer content={part} />
                </span>
            );
        }
    });

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
                                onError={(e) => { e.currentTarget.style.display = 'none'; }}
                            />
                        </div>
                    ))}
                </div>
            )}
        </>
    );
};

export default function GroupResultQuestionDetails({ questions }: { questions: QuestionDetailDto[] }) {
    return (
        <div className="divide-y divide-gray-200">
            {questions.map((question, index) => {
                const hasCorrectness = typeof question.isCorrect === 'boolean';
                const questionDuration = formatQuestionDuration(question.completedInSeconds);

                return (
                    <div key={question.questionId} className="p-5">
                        <div className="flex items-start space-x-4">
                            <div className={`shrink-0 w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm ${hasCorrectness
                                ? question.isCorrect ? 'bg-green-500' : 'bg-red-500'
                                : 'bg-gray-500'
                                }`}>
                                {index + 1}
                            </div>

                            <div className="flex-1 min-w-0">
                                <div className="flex items-center flex-wrap gap-3 mb-3">
                                    {hasCorrectness && (
                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${question.isCorrect
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-red-100 text-red-800'
                                            }`}>
                                            {question.isCorrect ? 'Đúng' : 'Sai'}
                                        </span>
                                    )}
                                    <span className="text-sm text-gray-500">+{question.pointsEarned} điểm</span>
                                    {questionDuration && (
                                        <span className="text-sm text-gray-500">⏱ {questionDuration}</span>
                                    )}
                                </div>

                                <div className="mb-4 text-gray-800">
                                    {renderContentWithImages(question.content, question.images)}
                                </div>

                                {question.options && (
                                    <div className="mb-4 grid grid-cols-1 gap-2">
                                        {Object.entries(question.options).map(([key, value]) => {
                                            const isCorrectAnswer = Array.isArray(question.correctAnswer) && question.correctAnswer.includes(key);
                                            const isUserAnswer = Array.isArray(question.userAnswer) && question.userAnswer.includes(key);
                                            const isWrongUserAnswer = isUserAnswer && hasCorrectness && !question.isCorrect;

                                            return (
                                                <div
                                                    key={key}
                                                    className={`p-3 rounded-lg border-2 ${isCorrectAnswer
                                                        ? 'border-green-500 bg-green-50'
                                                        : isWrongUserAnswer
                                                            ? 'border-red-500 bg-red-50'
                                                            : 'border-gray-200 bg-gray-50'
                                                        }`}
                                                >
                                                    <div className="flex items-center space-x-3">
                                                        <span className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold ${isCorrectAnswer
                                                            ? 'bg-green-500 text-white'
                                                            : isWrongUserAnswer
                                                                ? 'bg-red-500 text-white'
                                                                : 'bg-gray-300 text-gray-600'
                                                            }`}>
                                                            {key}
                                                        </span>
                                                        <span className="text-gray-700">
                                                            <RichRenderer content={value} />
                                                        </span>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}

                                {!question.subQuestions || question.subQuestions.length === 0 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                        <div className="bg-gray-50 rounded-lg p-4">
                                            <h4 className="text-sm font-semibold text-gray-700 mb-2">Đáp án học sinh:</h4>
                                            <div className={`font-medium ${hasCorrectness
                                                ? question.isCorrect ? 'text-green-600' : 'text-red-600'
                                                : 'text-gray-700'
                                                }`}>
                                                {Array.isArray(question.userAnswer) && question.userAnswer.length > 0
                                                    ? <RichRenderer content={question.userAnswer.join(', ')} />
                                                    : 'Không trả lời'}
                                            </div>
                                        </div>
                                        <div className="bg-gray-50 rounded-lg p-4">
                                            <h4 className="text-sm font-semibold text-gray-700 mb-2">Đáp án đúng:</h4>
                                            <div className="font-medium text-green-600">
                                                {Array.isArray(question.correctAnswer)
                                                    ? <RichRenderer content={question.correctAnswer.join(', ')} />
                                                    : <RichRenderer content={question.correctAnswer} />}
                                            </div>
                                        </div>
                                    </div>
                                ) : null}

                                {question.explanation && (
                                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                        <h4 className="text-sm font-semibold text-blue-800 mb-2">Giải thích:</h4>
                                        <RichRenderer content={question.explanation} />
                                    </div>
                                )}

                                {question.subQuestions && question.subQuestions.length > 0 && (
                                    <div className="mt-4 space-y-4">
                                        <h4 className="text-base font-semibold text-gray-800 border-b border-gray-200 pb-2">
                                            Các câu hỏi con:
                                        </h4>
                                        {question.subQuestions.map((subQuestion, subIndex) => {
                                            const subHasCorrectness = typeof subQuestion.isCorrect === 'boolean';
                                            const subDuration = formatQuestionDuration(subQuestion.completedInSeconds);

                                            return (
                                                <div key={subQuestion.id} className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                                                    <div className="flex items-center flex-wrap gap-3 mb-3">
                                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm ${subHasCorrectness
                                                            ? subQuestion.isCorrect ? 'bg-green-500' : 'bg-red-500'
                                                            : 'bg-gray-500'
                                                            }`}>
                                                            {subIndex + 1}
                                                        </div>
                                                        {subHasCorrectness && (
                                                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${subQuestion.isCorrect
                                                                ? 'bg-green-100 text-green-800'
                                                                : 'bg-red-100 text-red-800'
                                                                }`}>
                                                                {subQuestion.isCorrect ? 'Đúng' : 'Sai'}
                                                            </span>
                                                        )}
                                                        <span className="text-xs text-gray-500">+{subQuestion.pointsEarned} điểm</span>
                                                        {subDuration && (
                                                            <span className="text-xs text-gray-500">⏱ {subDuration}</span>
                                                        )}
                                                    </div>

                                                    <div className="mb-4 text-gray-700 font-medium">
                                                        {renderContentWithImages(subQuestion.content, subQuestion.images)}
                                                    </div>

                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                                                        <div className="bg-white rounded-lg p-3 border border-amber-200">
                                                            <h5 className="text-xs font-semibold text-gray-600 mb-1">Đáp án học sinh:</h5>
                                                            <div className={`font-medium text-sm ${subHasCorrectness
                                                                ? subQuestion.isCorrect ? 'text-green-600' : 'text-red-600'
                                                                : 'text-gray-700'
                                                                }`}>
                                                                {Array.isArray(subQuestion.userAnswer) && subQuestion.userAnswer.length > 0
                                                                    ? <RichRenderer content={subQuestion.userAnswer.join(', ')} />
                                                                    : 'Không trả lời'}
                                                            </div>
                                                        </div>
                                                        <div className="bg-white rounded-lg p-3 border border-amber-200">
                                                            <h5 className="text-xs font-semibold text-gray-600 mb-1">Đáp án đúng:</h5>
                                                            <div className="font-medium text-green-600 text-sm">
                                                                {Array.isArray(subQuestion.correctAnswer)
                                                                    ? <RichRenderer content={subQuestion.correctAnswer.join(', ')} />
                                                                    : <RichRenderer content={subQuestion.correctAnswer} />}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {subQuestion.explanation && (
                                                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                                                            <h5 className="text-xs font-semibold text-blue-800 mb-2">Giải thích:</h5>
                                                            <div className="text-sm text-gray-700">
                                                                <RichRenderer content={subQuestion.explanation} />
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
