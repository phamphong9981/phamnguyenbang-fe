'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { Suspense, useState, useEffect } from 'react';
import Header from '@/components/Header';
import { useGenerateAiPractice, GeneratedQuestion, useSubmitAiPracticeMutation } from '@/hooks/useAiSelftPracice';
import { SubmitAIQuestionsResponseDto } from '@/hooks/interface/submit-ai-question';
import RichRenderer from '@/components/RichRenderer';

// Loading component khi AI đang tạo đề
const AIGeneratingLoader = () => {
    const [dots, setDots] = useState('');
    const [message, setMessage] = useState('AI đang phân tích kiến thức của bạn');

    useEffect(() => {
        const dotsInterval = setInterval(() => {
            setDots(prev => prev.length >= 3 ? '' : prev + '.');
        }, 500);

        const messages = [
            'AI đang phân tích kiến thức của bạn',
            'Đang tạo các câu hỏi phù hợp',
            'Đang kiểm tra độ khó',
            'Sắp hoàn thành'
        ];
        let messageIndex = 0;

        const messageInterval = setInterval(() => {
            messageIndex = (messageIndex + 1) % messages.length;
            setMessage(messages[messageIndex]);
        }, 2000);

        return () => {
            clearInterval(dotsInterval);
            clearInterval(messageInterval);
        };
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center">
            <div className="text-center">
                {/* AI Brain Animation */}
                <div className="relative w-48 h-48 mx-auto mb-8">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full opacity-20 animate-pulse"></div>
                    <div className="absolute inset-4 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full opacity-30 animate-pulse delay-300"></div>
                    <div className="absolute inset-8 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full opacity-40 animate-pulse delay-500"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-7xl animate-bounce">🤖</span>
                    </div>
                </div>

                {/* Loading Text */}
                <div className="space-y-4">
                    <h2 className="text-3xl font-bold text-gray-800">
                        {message}{dots}
                    </h2>
                    <p className="text-gray-600 text-lg">
                        Vui lòng đợi trong giây lát
                    </p>
                </div>

                {/* Progress Bar */}
                <div className="mt-8 w-80 mx-auto">
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 animate-loading-bar"></div>
                    </div>
                </div>

                {/* Fun Facts */}
                <div className="mt-12 max-w-md mx-auto bg-white/50 backdrop-blur-sm rounded-2xl p-6 border-2 border-purple-200">
                    <p className="text-sm text-gray-700">
                        💡 <strong>Mẹo:</strong> AI sẽ tạo câu hỏi dựa trên độ thành thạo của bạn để giúp bạn học hiệu quả hơn!
                    </p>
                </div>
            </div>

            <style jsx>{`
        @keyframes loading-bar {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(400%); }
        }
        .animate-loading-bar {
          animation: loading-bar 1.5s ease-in-out infinite;
        }
        .delay-300 {
          animation-delay: 0.3s;
        }
        .delay-500 {
          animation-delay: 0.5s;
        }
      `}</style>
        </div>
    );
};

// Component làm bài
const PracticeContent = () => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const kcTag = searchParams.get('kc') || '';

    const { data: questions, isLoading, error } = useGenerateAiPractice(kcTag);
    const submitMutation = useSubmitAiPracticeMutation();
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState<Record<number, string>>({});
    const [isCompleted, setIsCompleted] = useState(false);
    const [selectedAnswer, setSelectedAnswer] = useState<string>('');
    const [submissionResult, setSubmissionResult] = useState<SubmitAIQuestionsResponseDto | null>(null);
    const [isReviewMode, setIsReviewMode] = useState(false);

    if (!kcTag) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 flex items-center justify-center">
                <div className="text-center bg-white rounded-2xl shadow-2xl p-12 border-2 border-red-200">
                    <div className="text-6xl mb-4">⚠️</div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Thiếu thông tin</h2>
                    <p className="text-gray-600 mb-6">Vui lòng chọn một chủ đề để bắt đầu luyện tập</p>
                    <button
                        onClick={() => router.push('/ai-tu-luyen')}
                        className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all"
                    >
                        Quay lại danh sách chủ đề
                    </button>
                </div>
            </div>
        );
    }

    if (isLoading) {
        return <AIGeneratingLoader />;
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
                <Header />
                <div className="flex items-center justify-center py-20">
                    <div className="text-center bg-white rounded-2xl shadow-2xl p-12 border-2 border-red-200 max-w-lg">
                        <div className="text-6xl mb-4">😞</div>
                        <h2 className="text-2xl font-bold text-red-800 mb-4">Có lỗi xảy ra</h2>
                        <p className="text-red-600 mb-6">{error.message}</p>
                        <button
                            onClick={() => router.push('/ai-tu-luyen')}
                            className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all"
                        >
                            Quay lại danh sách chủ đề
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (!questions || questions.length === 0) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
                <Header />
                <div className="flex items-center justify-center py-20">
                    <div className="text-center bg-white rounded-2xl shadow-2xl p-12 border-2 border-gray-200 max-w-lg">
                        <div className="text-6xl mb-4">📭</div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">Không có câu hỏi</h2>
                        <p className="text-gray-600 mb-6">Chưa có câu hỏi nào được tạo cho chủ đề này</p>
                        <button
                            onClick={() => router.push('/ai-tu-luyen')}
                            className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all"
                        >
                            Quay lại danh sách chủ đề
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const currentQ = questions[currentQuestion];
    const choiceKeys = Object.keys(currentQ.choices).sort();
    const totalQuestions = questions.length;
    const answeredCount = Object.keys(answers).length;
    const progress = (currentQuestion / totalQuestions) * 100;

    const handleAnswerSelect = (choice: string) => {
        setSelectedAnswer(choice);
        setAnswers(prev => ({ ...prev, [currentQuestion]: choice }));
    };

    const handleNextQuestion = () => {
        if (currentQuestion < totalQuestions - 1) {
            setCurrentQuestion(prev => prev + 1);
            setSelectedAnswer(answers[currentQuestion + 1] || '');
        } else {
            // Submit answers when reaching the last question
            handleSubmitAnswers();
        }
    };

    const handleSubmitAnswers = async () => {
        if (!questions) return;

        const submitData = {
            answers: questions.map((q, idx) => ({
                generatedQuestionId: q.id,
                userAnswer: answers[idx] ? [answers[idx]] : []
            }))
        };

        try {
            const result = await submitMutation.mutateAsync(submitData);
            setSubmissionResult(result);
            setIsCompleted(true);
        } catch (error) {
            console.error('Error submitting answers:', error);
            // Handle error appropriately
        }
    };

    const handlePreviousQuestion = () => {
        if (currentQuestion > 0) {
            setCurrentQuestion(prev => prev - 1);
            setSelectedAnswer(answers[currentQuestion - 1] || '');
        }
    };

    const getChoiceColor = (choice: string) => {
        const isSelected = selectedAnswer === choice;

        if (isReviewMode && submissionResult) {
            const result = submissionResult.results[currentQuestion];
            const userAnswered = result.userAnswer.includes(choice);
            const isCorrectAnswer = result.correctAnswer === choice;

            // In review mode, show correct answer and user's answer
            if (isCorrectAnswer) {
                // Correct answer - always show in green
                return 'bg-green-100 border-green-500 text-green-800 border-2';
            }
            if (userAnswered && !result.isCorrect) {
                // User's wrong answer - show in red
                return 'bg-red-100 border-red-500 text-red-800 border-2';
            }
            return 'bg-gray-50 border-gray-300 text-gray-600';
        }

        if (isSelected) {
            return 'bg-blue-100 border-blue-500 text-blue-800';
        }

        return 'bg-white border-gray-300 text-gray-800 hover:bg-blue-50 hover:border-blue-300';
    };

    const getChoiceIcon = (choice: string) => {
        if (!isReviewMode || !submissionResult) return '';

        const result = submissionResult.results[currentQuestion];
        const userAnswered = result.userAnswer.includes(choice);
        const isCorrectAnswer = result.correctAnswer === choice;

        // Show checkmark for correct answer
        if (isCorrectAnswer) return '✅';
        // Show X for user's wrong answer
        if (userAnswered && !result.isCorrect) return '❌';

        return '';
    };

    // Results Screen
    if (isCompleted && submissionResult) {
        const correctAnswers = submissionResult.correctAnswers;
        const score = Math.round(submissionResult.percentage);
        const isPerfect = score === 100;
        const isGood = score >= 70;
        const isOkay = score >= 50;

        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
                <Header />
                <div className="max-w-4xl mx-auto px-4 py-12">
                    <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border-2 border-purple-200">
                        {/* Results Header */}
                        <div className={`${isPerfect ? 'bg-gradient-to-r from-yellow-400 via-yellow-500 to-orange-500' : isGood ? 'bg-gradient-to-r from-green-500 to-green-600' : isOkay ? 'bg-gradient-to-r from-blue-500 to-blue-600' : 'bg-gradient-to-r from-gray-500 to-gray-600'} p-12 text-center text-white`}>
                            <div className="text-8xl mb-6 animate-bounce">
                                {isPerfect ? '🏆' : isGood ? '🎉' : isOkay ? '👍' : '💪'}
                            </div>
                            <h1 className="text-5xl font-bold mb-4">
                                {isPerfect ? 'Xuất sắc!' : isGood ? 'Tốt lắm!' : isOkay ? 'Khá tốt!' : 'Cố gắng hơn!'}
                            </h1>
                            <p className="text-2xl opacity-90">
                                Bạn đã hoàn thành bài tập
                            </p>
                        </div>

                        {/* Score Display */}
                        <div className="p-12">

                            {/* Stats */}
                            <div className="grid grid-cols-3 gap-6 mb-12">
                                <div className="bg-green-50 rounded-2xl p-6 text-center border-2 border-green-200">
                                    <div className="text-4xl font-bold text-green-600">{correctAnswers}</div>
                                    <div className="text-green-700 mt-2">Câu đúng</div>
                                </div>
                                <div className="bg-red-50 rounded-2xl p-6 text-center border-2 border-red-200">
                                    <div className="text-4xl font-bold text-red-600">{totalQuestions - correctAnswers}</div>
                                    <div className="text-red-700 mt-2">Câu sai</div>
                                </div>
                                <div className="bg-blue-50 rounded-2xl p-6 text-center border-2 border-blue-200">
                                    <div className="text-4xl font-bold text-blue-600">{totalQuestions}</div>
                                    <div className="text-blue-700 mt-2">Tổng số câu</div>
                                </div>
                            </div>

                            {/* Review Answers */}
                            <div className="space-y-4 mb-8">
                                <h3 className="text-2xl font-bold text-gray-800 mb-6">Xem lại đáp án</h3>
                                {submissionResult.results.map((result, idx) => {
                                    const isCorrect = result.isCorrect;
                                    return (
                                        <div
                                            key={idx}
                                            className={`p-4 rounded-xl border-2 ${isCorrect ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'} cursor-pointer hover:shadow-lg transition-all`}
                                            onClick={() => {
                                                setIsCompleted(false);
                                                setIsReviewMode(true);
                                                setCurrentQuestion(idx);
                                                setSelectedAnswer(answers[idx] || '');
                                            }}
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center space-x-3">
                                                    <span className="text-2xl">{isCorrect ? '✅' : '❌'}</span>
                                                    <span className="font-semibold text-gray-800">Câu {idx + 1}</span>
                                                </div>
                                                <span className="text-sm text-gray-600">Nhấn để xem chi tiết →</span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Actions */}
                            <div className="flex gap-4">
                                <button
                                    onClick={() => router.push('/ai-tu-luyen')}
                                    className="w-1/2 mx-auto border-2 border-gray-300 text-gray-700 py-4 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 hover:bg-gray-50"
                                >
                                    📚 Chọn chủ đề khác
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Practice Screen
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
            <Header />

            <div className="max-w-5xl mx-auto px-4 py-8">
                {/* Header with Progress */}
                <div className="mb-8">
                    <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-purple-200">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-800">
                                    🎯 {kcTag} {isReviewMode && <span className="text-sm text-blue-600">(Xem lại đáp án)</span>}
                                </h1>
                                <p className="text-gray-600">Câu hỏi {currentQuestion + 1} / {totalQuestions}</p>
                            </div>
                            {isReviewMode ? (
                                <button
                                    onClick={() => {
                                        setIsReviewMode(false);
                                        setIsCompleted(true);
                                    }}
                                    className="text-blue-600 hover:text-blue-800 transition-colors font-semibold"
                                >
                                    ← Quay lại kết quả
                                </button>
                            ) : (
                                <button
                                    onClick={() => router.push('/ai-tu-luyen')}
                                    className="text-gray-600 hover:text-gray-800 transition-colors"
                                >
                                    ✕ Thoát
                                </button>
                            )}
                        </div>

                        {/* Progress Bar */}
                        <div className="relative h-3">
                            <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transition-all duration-500 ease-out"
                                    style={{ width: `${isReviewMode ? 100 : progress}%` }}
                                ></div>
                            </div>
                            <div className="absolute -top-1 left-0 w-full h-5">
                                {questions.map((_, idx) => {
                                    const position = totalQuestions === 1 ? 50 : (idx / (totalQuestions - 1)) * 100;
                                    let dotColor = 'bg-gray-300 border-gray-400';

                                    if (isReviewMode && submissionResult) {
                                        // In review mode, show correct/incorrect
                                        const result = submissionResult.results[idx];
                                        dotColor = result.isCorrect
                                            ? 'bg-green-500 border-green-600'
                                            : 'bg-red-500 border-red-600';
                                        if (idx === currentQuestion) {
                                            dotColor = result.isCorrect
                                                ? 'bg-green-600 border-green-700 ring-2 ring-green-300'
                                                : 'bg-red-600 border-red-700 ring-2 ring-red-300';
                                        }
                                    } else {
                                        // In practice mode
                                        if (answers[idx]) {
                                            dotColor = 'bg-green-500 border-green-600';
                                        } else if (idx === currentQuestion) {
                                            dotColor = 'bg-blue-500 border-blue-600';
                                        }
                                    }

                                    return (
                                        <div
                                            key={idx}
                                            className={`absolute w-5 h-5 rounded-full border-2 ${dotColor} transition-all duration-300`}
                                            style={{ left: `calc(${position}% - 10px)` }}
                                        ></div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Question Card */}
                <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border-2 border-purple-200 mb-6">
                    {/* Question */}
                    <div className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 p-8 text-white">
                        <div className="flex items-start space-x-4">
                            <div className="flex-shrink-0 w-12 h-12 bg-white/20 rounded-full flex items-center justify-center font-bold text-2xl">
                                {currentQuestion + 1}
                            </div>
                            <div className="flex-1">
                                <div className="text-sm opacity-90 mb-2">Câu hỏi</div>
                                <RichRenderer
                                    content={currentQ.question}
                                    className="text-xl font-semibold leading-relaxed"
                                />
                                <div className="mt-4 inline-block px-4 py-2 bg-white/20 rounded-full text-sm">
                                    Độ khó: Level {currentQ.level}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Choices */}
                    <div className="p-8 space-y-4">
                        {choiceKeys.map((choice) => (
                            <button
                                key={choice}
                                onClick={() => !isReviewMode && handleAnswerSelect(choice)}
                                disabled={isReviewMode}
                                className={`w-full p-6 rounded-xl border-2 text-left transition-all duration-300 transform ${!isReviewMode ? 'hover:scale-102 cursor-pointer' : 'cursor-default'} ${getChoiceColor(choice)}`}
                            >
                                <div className="flex items-center space-x-4">
                                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-white/50 flex items-center justify-center font-bold text-lg">
                                        {choice}
                                    </div>
                                    <RichRenderer
                                        content={currentQ.choices[choice]}
                                        className="flex-1 font-medium"
                                    />
                                    {getChoiceIcon(choice) && (
                                        <div className="text-2xl">{getChoiceIcon(choice)}</div>
                                    )}
                                </div>
                            </button>
                        ))}
                    </div>

                    {/* Explanation - only show in review mode */}
                    {isReviewMode && submissionResult && submissionResult.results[currentQuestion].explanation && (
                        <div className="mx-8 mb-8 p-6 bg-blue-50 rounded-xl border-2 border-blue-200">
                            <div className="flex items-start space-x-3">
                                <div className="text-2xl">💡</div>
                                <div className="flex-1">
                                    <h4 className="font-bold text-blue-900 mb-2">Giải thích:</h4>
                                    <RichRenderer
                                        content={submissionResult.results[currentQuestion].explanation}
                                        className="text-blue-800 leading-relaxed"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Actions */}
                    <div className="p-8 bg-gray-50 border-t-2 border-gray-200">
                        {isReviewMode ? (
                            <div className="flex gap-4">
                                <button
                                    onClick={() => {
                                        setIsReviewMode(false);
                                        setIsCompleted(true);
                                    }}
                                    className="px-6 py-3 rounded-xl font-semibold transition-all bg-gray-200 text-gray-700 hover:bg-gray-300"
                                >
                                    ← Quay lại kết quả
                                </button>

                                <div className="flex-1"></div>
                            </div>
                        ) : (
                            <div className="flex gap-4">
                                <button
                                    onClick={handlePreviousQuestion}
                                    disabled={currentQuestion === 0}
                                    className="px-6 py-3 rounded-xl font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed bg-gray-200 text-gray-700 hover:bg-gray-300"
                                >
                                    ← Câu trước
                                </button>

                                <div className="flex-1"></div>

                                <button
                                    onClick={handleNextQuestion}
                                    disabled={!selectedAnswer && !answers[currentQuestion]}
                                    className="px-8 py-3 rounded-xl font-bold text-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:shadow-lg transform hover:scale-105"
                                >
                                    {currentQuestion < totalQuestions - 1 ? 'Câu tiếp theo →' : 'Hoàn thành và xem kết quả 🎉'}
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Quick Navigation */}
                <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-purple-200">
                    <h3 className="text-lg font-bold text-gray-800 mb-4">Chuyển nhanh đến câu:</h3>
                    <div className="grid grid-cols-10 gap-2">
                        {questions.map((_, idx) => {
                            let buttonClass = 'bg-gray-200 text-gray-700 hover:bg-gray-300';

                            if (isReviewMode && submissionResult) {
                                // In review mode, show correct/incorrect
                                const result = submissionResult.results[idx];
                                if (idx === currentQuestion) {
                                    buttonClass = result.isCorrect
                                        ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg ring-2 ring-green-300'
                                        : 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg ring-2 ring-red-300';
                                } else {
                                    buttonClass = result.isCorrect
                                        ? 'bg-green-500 text-white'
                                        : 'bg-red-500 text-white';
                                }
                            } else {
                                // In practice mode
                                if (idx === currentQuestion) {
                                    buttonClass = 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg';
                                } else if (answers[idx]) {
                                    buttonClass = 'bg-green-500 text-white';
                                }
                            }

                            return (
                                <button
                                    key={idx}
                                    onClick={() => {
                                        setCurrentQuestion(idx);
                                        setSelectedAnswer(answers[idx] || '');
                                    }}
                                    className={`aspect-square rounded-lg font-bold transition-all transform hover:scale-110 ${buttonClass}`}
                                >
                                    {idx + 1}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default function PracticePage() {
    return (
        <Suspense fallback={<AIGeneratingLoader />}>
            <PracticeContent />
        </Suspense>
    );
}

