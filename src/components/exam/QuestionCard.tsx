'use client';

import RichRenderer from '@/components/RichRenderer';
import ImageAnswer from '@/components/ImageAnswer';
import ContentWithImages from '@/components/ContentWithImages';
import QuestionOptions from './QuestionOptions';
import SubQuestionCard from './SubQuestionCard';

interface QuestionCardProps {
    question: {
        content: string;
        images?: string[]; // Changed from image to images (array)
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

            {/* Question Content with Images */}
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
                        <ContentWithImages
                            content={question.content}
                            images={question.images}
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
