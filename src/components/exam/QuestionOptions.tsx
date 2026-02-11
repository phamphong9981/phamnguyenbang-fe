'use client';

import RichRenderer from '@/components/RichRenderer';
import ImageAnswer from '@/components/ImageAnswer';
import MathInput from '@/components/exam/MathInput';

interface QuestionOptionsProps {
    questionType: string;
    options?: Record<string, string>;
    selectedAnswer: string[];
    onAnswerSelect: (answer: string | string[], questionType: string, isMultiple: boolean) => void;
    isImageAnswer: (answer: string) => boolean;
    questionId?: string; // Unique identifier for radio button grouping
}

export default function QuestionOptions({
    questionType,
    options,
    selectedAnswer,
    onAnswerSelect,
    isImageAnswer,
    questionId = 'default'
}: QuestionOptionsProps) {
    // Single choice or Multiple choice
    if ((questionType === 'single_choice' || questionType === 'multiple_choice') && options) {
        const isMultiple = questionType === 'multiple_choice';
        return (
            <div className="space-y-3">
                {Object.entries(options).map(([option, text]) => {
                    const isImage = isImageAnswer(text);
                    const isChecked = selectedAnswer.includes(option);
                    return (
                        <label
                            key={option}
                            className={`flex items-start p-4 border-2 rounded-lg cursor-pointer transition-colors ${isChecked
                                ? 'border-green-500 bg-green-50'
                                : 'border-gray-200 hover:border-gray-300'
                                }`}
                        >
                            <input
                                type={isMultiple ? 'checkbox' : 'radio'}
                                name={`question-${questionId}`}
                                value={option}
                                checked={isChecked}
                                onChange={() => onAnswerSelect(option, questionType, isMultiple)}
                                className="mt-1 mr-3"
                            />
                            <div className="flex gap-1 w-full">
                                <span className="font-medium text-gray-900 mb-2">{option}.</span>
                                {isImage ? (
                                    <ImageAnswer
                                        src={text}
                                        alt={`Đáp án ${option}`}
                                        isSelected={isChecked}
                                        onClick={() => onAnswerSelect(option, questionType, isMultiple)}
                                    />
                                ) : (
                                    <span className="text-gray-700">
                                        <RichRenderer content={text} />
                                    </span>
                                )}
                            </div>
                        </label>
                    );
                })}
            </div>
        );
    }

    // True/False
    if (questionType === 'true_false') {
        return (
            <div className="space-y-3">
                <label
                    className={`flex items-start p-4 border-2 rounded-lg cursor-pointer transition-colors ${selectedAnswer.includes('true')
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-200 hover:border-gray-300'
                        }`}
                >
                    <input
                        type="radio"
                        name={`true-false-${questionId}`}
                        value="true"
                        checked={selectedAnswer.includes('true')}
                        onChange={() => onAnswerSelect('true', questionType, false)}
                        className="mt-1 mr-3"
                    />
                    <div className="flex">
                        <span className="font-medium text-gray-900 mr-2">Đúng</span>
                    </div>
                </label>
                <label
                    className={`flex items-start p-4 border-2 rounded-lg cursor-pointer transition-colors ${selectedAnswer.includes('false')
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-200 hover:border-gray-300'
                        }`}
                >
                    <input
                        type="radio"
                        name={`true-false-${questionId}`}
                        value="false"
                        checked={selectedAnswer.includes('false')}
                        onChange={() => onAnswerSelect('false', questionType, false)}
                        className="mt-1 mr-3"
                    />
                    <div className="flex">
                        <span className="font-medium text-gray-900 mr-2">Sai</span>
                    </div>
                </label>
            </div>
        );
    }

    // Short answer
    if (questionType === 'short_answer') {
        return (
            <div className="space-y-3">
                <MathInput
                    value={selectedAnswer[0] || ''}
                    onChange={(value) => {
                        // For short answer, we pass the value directly
                        // Parent will handle setting it as array[0]
                        onAnswerSelect(value, questionType, false);
                    }}
                    placeholder="Nhập đáp án của bạn..."
                />
            </div>
        );
    }

    return null;
}
