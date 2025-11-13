'use client';

import RichRenderer from '@/components/RichRenderer';
import ImageAnswer from '@/components/ImageAnswer';
import SubQuestionCard from './SubQuestionCard';

interface GroupQuestionSplitViewProps {
    question: {
        content: string;
        image?: string;
        question_type: string;
        subQuestions?: Array<{
            id: string;
            content: string;
            question_type?: string;
            options?: Record<string, string>;
        }>;
    };
    questionNumber: number;
    questionId: string;
    subAnswers?: { [key: string]: string[] };
    onSubAnswerSelect: (subQuestionId: string, answer: string, questionType: string, isMultiple: boolean) => void;
    isImageAnswer: (answer: string) => boolean;
}

export default function GroupQuestionSplitView({
    question,
    questionNumber,
    questionId,
    subAnswers,
    onSubAnswerSelect,
    isImageAnswer
}: GroupQuestionSplitViewProps) {
    return (
        <div
            id={`question-${questionNumber - 1}`}
            className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200 p-2"
        >
            {/* Question Header */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-8 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                    <h2 className="px-4 py-2 bg-blue-600 text-white rounded-full text-sm font-semibold shadow-md">
                        Câu {questionNumber}
                    </h2>
                    <span className="text-sm text-gray-600 font-medium">
                        Câu hỏi nhóm - {question.subQuestions?.length || 0} câu hỏi con
                    </span>
                </div>
            </div>

            {/* Split View Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[600px]">
                {/* Left Side - Question Content */}
                <div className="p-8 bg-gradient-to-br from-gray-50 to-blue-50 border-r border-gray-200 overflow-y-auto max-h-[800px]">
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
                                <RichRenderer content={question.content} />
                            </div>
                        )}

                        {/* Question Image */}
                        {question.image && (
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
                <div className=" bg-white overflow-y-auto max-h-[800px]">
                    <div className="mb-4 sticky top-0 bg-white z-10 border-b border-gray-100 p-8">
                        <h3 className="text-lg font-bold text-gray-900 flex items-center">
                            <svg className="w-5 h-5 mr-2 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                            </svg>
                            Các câu hỏi
                        </h3>
                    </div>

                    {/* Sub Questions List */}
                    {question.subQuestions && question.subQuestions.length > 0 ? (
                        <div className="space-y-6 p-8">
                            {question.subQuestions.map((subQuestion, index) => (
                                <div key={subQuestion.id} className="relative">
                                    {/* Sub Question Number Badge */}
                                    <div className="absolute -left-4 top-0">
                                        <span className="inline-flex items-center justify-center w-8 h-8 bg-green-500 text-white text-xs font-bold rounded-full shadow-md">
                                            {index + 1}
                                        </span>
                                    </div>

                                    <SubQuestionCard
                                        subQuestion={subQuestion}
                                        subAnswer={subAnswers?.[subQuestion.id] || []}
                                        onSubAnswerSelect={onSubAnswerSelect}
                                        isImageAnswer={isImageAnswer}
                                    />
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

