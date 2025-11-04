'use client';

import RichRenderer from '@/components/RichRenderer';
import ImageAnswer from '@/components/ImageAnswer';
import QuestionOptions from './QuestionOptions';

interface SubQuestionCardProps {
    subQuestion: {
        id: string;
        content: string;
        question_type?: string;
        options?: Record<string, string>;
    };
    subAnswer: string[];
    onSubAnswerSelect: (subQuestionId: string, answer: string, questionType: string, isMultiple: boolean) => void;
    isImageAnswer: (answer: string) => boolean;
}

export default function SubQuestionCard({
    subQuestion,
    subAnswer,
    onSubAnswerSelect,
    isImageAnswer
}: SubQuestionCardProps) {
    const subQuestionType = subQuestion.question_type || 'true_false';
    const isSubQuestionImage = isImageAnswer(subQuestion.content);

    // Handle short answer separately since it needs special onChange handler
    if (subQuestionType === 'short_answer') {
        return (
            <div className="border border-gray-200 rounded-lg p-4">
                <div className="mb-4">
                    {isSubQuestionImage ? (
                        <div className="mb-4">
                            <ImageAnswer
                                src={subQuestion.content}
                                alt={`Câu hỏi ${subQuestion.id}`}
                            />
                        </div>
                    ) : (
                        <h4 className="font-medium text-gray-900 mb-2">
                            <RichRenderer content={subQuestion.content} />
                        </h4>
                    )}
                </div>

                <div className="space-y-3">
                    <div className="p-4 border-2 bg-gray-100 border-gray-200 rounded-lg">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Nhập đáp án:
                        </label>
                        <input
                            type="text"
                            value={Array.isArray(subAnswer) ? subAnswer[0] || '' : ''}
                            onChange={(e) => {
                                // For short answer, we need to set the array directly
                                // This is handled by parent through onSubAnswerSelect
                                onSubAnswerSelect(subQuestion.id, e.target.value, subQuestionType, false);
                            }}
                            className="w-full text-black px-3 py-2 border font-bold bg-white border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Nhập đáp án của bạn..."
                        />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="border border-gray-200 rounded-lg p-4">
            <div className="mb-4">
                {isSubQuestionImage ? (
                    <div className="mb-4">
                        <ImageAnswer
                            src={subQuestion.content}
                            alt={`Câu hỏi ${subQuestion.id}`}
                        />
                    </div>
                ) : (
                    <h4 className="font-medium text-gray-900 mb-2">
                        <RichRenderer content={subQuestion.content} />
                    </h4>
                )}
            </div>

            <QuestionOptions
                questionType={subQuestionType}
                options={subQuestion.options}
                selectedAnswer={Array.isArray(subAnswer) ? subAnswer : []}
                onAnswerSelect={(answer, questionType, isMultiple) =>
                    onSubAnswerSelect(subQuestion.id, answer, questionType, isMultiple)
                }
                isImageAnswer={isImageAnswer}
                questionId={`sub-${subQuestion.id}`}
            />
        </div>
    );
}
