'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { hsaMockExam, Question } from '../mock-data';
import MathRenderer from '@/components/MathRenderer';

interface UserAnswer {
    questionId: number;
    selectedAnswer: keyof Question['options'] | null;
}

export default function ExamPage() {
    const router = useRouter();

    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);
    const [timeLeft, setTimeLeft] = useState(hsaMockExam.durationMinutes * 60); // seconds
    const [isExamStarted, setIsExamStarted] = useState(false);
    const [isExamFinished, setIsExamFinished] = useState(false);
    const [showResults, setShowResults] = useState(false);

    // Initialize user answers
    useEffect(() => {
        const initialAnswers = hsaMockExam.questions.map(q => ({
            questionId: q.id,
            selectedAnswer: null
        }));
        setUserAnswers(initialAnswers);
    }, []);

    // Timer countdown
    useEffect(() => {
        if (!isExamStarted || isExamFinished) return;

        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    clearInterval(timer);
                    finishExam();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [isExamStarted, isExamFinished]);

    const formatTime = (seconds: number) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const startExam = () => {
        setIsExamStarted(true);
    };

    const finishExam = () => {
        setIsExamFinished(true);
        setShowResults(true);
    };

    const handleAnswerSelect = (answer: keyof Question['options']) => {
        setUserAnswers(prev =>
            prev.map(ans =>
                ans.questionId === hsaMockExam.questions[currentQuestionIndex].id
                    ? { ...ans, selectedAnswer: answer }
                    : ans
            )
        );
    };

    const goToQuestion = (index: number) => {
        setCurrentQuestionIndex(index);
    };

    const nextQuestion = () => {
        if (currentQuestionIndex < hsaMockExam.questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        }
    };

    const prevQuestion = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(currentQuestionIndex - 1);
        }
    };

    const getQuestionStatus = (questionIndex: number) => {
        const question = hsaMockExam.questions[questionIndex];
        const userAnswer = userAnswers.find(ans => ans.questionId === question.id);

        if (userAnswer?.selectedAnswer) {
            return 'answered';
        }
        return 'unanswered';
    };

    const calculateScore = () => {
        let correctAnswers = 0;
        userAnswers.forEach(userAnswer => {
            const question = hsaMockExam.questions.find(q => q.id === userAnswer.questionId);
            if (question && userAnswer.selectedAnswer === question.correctAnswer) {
                correctAnswers++;
            }
        });
        return {
            correct: correctAnswers,
            total: hsaMockExam.questions.length,
            percentage: Math.round((correctAnswers / hsaMockExam.questions.length) * 100)
        };
    };

    const currentQuestion = hsaMockExam.questions[currentQuestionIndex];
    const userAnswer = userAnswers.find(ans => ans.questionId === currentQuestion.id);

    if (!isExamStarted) {
        return (
            <div className="min-h-screen bg-gray-50">
                <div className="max-w-4xl mx-auto px-4 py-16">
                    <div className="bg-white rounded-lg shadow-lg p-8">
                        <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">
                            {hsaMockExam.title}
                        </h1>

                        <div className="space-y-4 mb-8">
                            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                <span className="font-medium">Thời gian làm bài:</span>
                                <span className="text-lg font-semibold">{hsaMockExam.durationMinutes} phút</span>
                            </div>
                            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                <span className="font-medium">Số câu hỏi:</span>
                                <span className="text-lg font-semibold">{hsaMockExam.questions.length} câu</span>
                            </div>
                            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                <span className="font-medium">Loại đề:</span>
                                <span className="text-lg font-semibold">Đánh giá năng lực & Tư duy</span>
                            </div>
                        </div>

                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-8">
                            <h3 className="font-semibold text-yellow-800 mb-2">Lưu ý quan trọng:</h3>
                            <ul className="text-sm text-yellow-700 space-y-1">
                                <li>• Bài thi sẽ tự động nộp khi hết thời gian</li>
                                <li>• Bạn có thể quay lại sửa đáp án bất cứ lúc nào</li>
                                <li>• Đảm bảo kết nối internet ổn định trong quá trình làm bài</li>
                                <li>• Không được refresh trang trong khi làm bài</li>
                            </ul>
                        </div>

                        <div className="flex justify-center">
                            <button
                                onClick={startExam}
                                className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-colors"
                            >
                                Bắt đầu làm bài
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (showResults) {
        const score = calculateScore();
        return (
            <div className="min-h-screen bg-gray-50">
                <div className="max-w-4xl mx-auto px-4 py-16">
                    <div className="bg-white rounded-lg shadow-lg p-8">
                        <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">
                            Kết quả bài thi
                        </h1>

                        <div className="text-center mb-8">
                            <div className="text-6xl font-bold text-green-600 mb-4">
                                {score.percentage}%
                            </div>
                            <div className="text-xl text-gray-600">
                                {score.correct}/{score.total} câu đúng
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                            <div className="text-center p-4 bg-green-50 rounded-lg">
                                <div className="text-2xl font-bold text-green-600">{score.correct}</div>
                                <div className="text-sm text-gray-600">Câu đúng</div>
                            </div>
                            <div className="text-center p-4 bg-red-50 rounded-lg">
                                <div className="text-2xl font-bold text-red-600">{score.total - score.correct}</div>
                                <div className="text-sm text-gray-600">Câu sai</div>
                            </div>
                            <div className="text-center p-4 bg-blue-50 rounded-lg">
                                <div className="text-2xl font-bold text-blue-600">{score.total}</div>
                                <div className="text-sm text-gray-600">Tổng câu</div>
                            </div>
                        </div>

                        <div className="flex justify-center space-x-4">
                            <button
                                onClick={() => router.push('/thi-hsa-tsa')}
                                className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                            >
                                Về trang đề thi
                            </button>
                            <button
                                onClick={() => window.location.reload()}
                                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                            >
                                Làm lại
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header with Timer */}
            <div className="bg-white shadow-md sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 py-4">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-xl font-semibold text-gray-900">
                                {hsaMockExam.title}
                            </h1>
                            <p className="text-sm text-gray-600">
                                Câu {currentQuestionIndex + 1} / {hsaMockExam.questions.length}
                            </p>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold text-red-600">
                                {formatTime(timeLeft)}
                            </div>
                            <div className="text-sm text-gray-600">Thời gian còn lại</div>
                        </div>
                        <button
                            onClick={finishExam}
                            className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                        >
                            Nộp bài
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-3">
                        <div className="bg-white rounded-lg shadow-lg p-8">
                            {/* Question Header */}
                            <div className="mb-6">
                                <div className="flex items-center justify-between mb-4">
                                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                                        {currentQuestion.section}
                                    </span>
                                    <span className="text-sm text-gray-500">
                                        Câu {currentQuestion.id}
                                    </span>
                                </div>
                            </div>

                            {/* Question Content */}
                            <div className="mb-8">
                                <div className="text-lg text-gray-900 leading-relaxed mb-6">
                                    <MathRenderer content={currentQuestion.content} />
                                </div>

                                {/* Answer Options */}
                                <div className="space-y-3">
                                    {(['A', 'B', 'C', 'D'] as const).map((option) => (
                                        <label
                                            key={option}
                                            className={`flex items-start p-4 border-2 rounded-lg cursor-pointer transition-colors ${userAnswer?.selectedAnswer === option
                                                ? 'border-green-500 bg-green-50'
                                                : 'border-gray-200 hover:border-gray-300'
                                                }`}
                                        >
                                            <input
                                                type="radio"
                                                name={`question-${currentQuestion.id}`}
                                                value={option}
                                                checked={userAnswer?.selectedAnswer === option}
                                                onChange={() => handleAnswerSelect(option)}
                                                className="mt-1 mr-3"
                                            />
                                            <div className="flex">
                                                <span className="font-medium text-gray-900 mr-2">{option}.</span>
                                                <span className="text-gray-700">
                                                    <MathRenderer content={currentQuestion.options[option]} />
                                                </span>
                                            </div>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Navigation Buttons */}
                            <div className="flex justify-between">
                                <button
                                    onClick={prevQuestion}
                                    disabled={currentQuestionIndex === 0}
                                    className="px-6 py-2 bg-gray-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-700 transition-colors"
                                >
                                    Câu trước
                                </button>
                                <button
                                    onClick={nextQuestion}
                                    disabled={currentQuestionIndex === hsaMockExam.questions.length - 1}
                                    className="px-6 py-2 bg-green-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-green-700 transition-colors"
                                >
                                    Câu tiếp
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar - Question Navigator */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-lg shadow-lg p-6 sticky top-24">
                            <h3 className="font-semibold text-gray-900 mb-4">Danh sách câu hỏi</h3>
                            <div className="grid grid-cols-5 gap-2">
                                {hsaMockExam.questions.map((question, index) => {
                                    const status = getQuestionStatus(index);
                                    return (
                                        <button
                                            key={question.id}
                                            onClick={() => goToQuestion(index)}
                                            className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors ${index === currentQuestionIndex
                                                ? 'bg-blue-600 text-white'
                                                : status === 'answered'
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                                }`}
                                        >
                                            {index + 1}
                                        </button>
                                    );
                                })}
                            </div>

                            <div className="mt-6 space-y-2">
                                <div className="flex items-center text-sm">
                                    <div className="w-4 h-4 bg-blue-600 rounded mr-2"></div>
                                    <span>Đang làm</span>
                                </div>
                                <div className="flex items-center text-sm">
                                    <div className="w-4 h-4 bg-green-100 rounded mr-2"></div>
                                    <span>Đã trả lời</span>
                                </div>
                                <div className="flex items-center text-sm">
                                    <div className="w-4 h-4 bg-gray-100 rounded mr-2"></div>
                                    <span>Chưa trả lời</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
} 