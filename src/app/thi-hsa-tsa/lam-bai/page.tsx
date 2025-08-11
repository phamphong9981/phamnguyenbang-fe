'use client';

import MathRenderer from '@/components/MathRenderer';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { hsaMockExam, hsaMockExam_2 } from '../mock-data';

interface UserAnswer {
    questionId: number;
    selectedAnswer: string | boolean | number | null;
    subAnswers?: { [key: string]: string | boolean | number | null }; // For group questions
}

export default function ExamPage() {
    const router = useRouter();

    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);
    const [timeLeft, setTimeLeft] = useState(hsaMockExam.durationMinutes * 60); // seconds
    const [currentExam, setCurrentExam] = useState(hsaMockExam);
    const [isExamStarted, setIsExamStarted] = useState(false);
    const [isExamFinished, setIsExamFinished] = useState(false);
    const [showResults, setShowResults] = useState(false);

    // Pick exam by URL
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const examId = params.get('examId');
        setCurrentExam(examId === 'hsa-mock-exam-2' ? hsaMockExam_2 : hsaMockExam);
    }, []);

    // Initialize user answers when exam changes
    useEffect(() => {
        const initialAnswers = currentExam.questions.map(q => ({
            questionId: q.id,
            selectedAnswer: null
        }));
        setUserAnswers(initialAnswers);
        setTimeLeft(currentExam.durationMinutes * 60);
    }, [currentExam]);

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

    const handleAnswerSelect = (answer: string | boolean | number) => {
        setUserAnswers(prev =>
            prev.map(ans =>
                ans.questionId === currentExam.questions[currentQuestionIndex].id
                    ? { ...ans, selectedAnswer: answer }
                    : ans
            )
        );
    };

    const handleSubAnswerSelect = (subQuestionId: string, answer: string | boolean | number) => {
        setUserAnswers(prev =>
            prev.map(ans =>
                ans.questionId === currentExam.questions[currentQuestionIndex].id
                    ? {
                        ...ans,
                        subAnswers: {
                            ...ans.subAnswers,
                            [subQuestionId]: answer
                        }
                    }
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
        const question = currentExam.questions[questionIndex];
        const userAnswer = userAnswers.find(ans => ans.questionId === question.id);

        if (question.questionType === 'group_question') {
            // For group questions, check if all sub-questions are answered
            if (userAnswer?.subAnswers) {
                const allAnswered = question.subQuestions?.every(subQ =>
                    userAnswer.subAnswers?.[subQ.id] !== null && userAnswer.subAnswers?.[subQ.id] !== undefined
                );
                return allAnswered ? 'answered' : 'unanswered';
            }
            return 'unanswered';
        } else {
            // For regular questions
            if (userAnswer?.selectedAnswer !== null && userAnswer?.selectedAnswer !== '') {
                return 'answered';
            }
            return 'unanswered';
        }
    };

    const calculateScore = () => {
        let correctAnswers = 0;
        let totalSubQuestions = 0;

        userAnswers.forEach(userAnswer => {
            const question = currentExam.questions.find(q => q.id === userAnswer.questionId);
            if (question) {
                if (question.questionType === 'group_question') {
                    // For group questions, count each sub-question
                    question.subQuestions?.forEach(subQ => {
                        totalSubQuestions++;
                        const userSubAnswer = userAnswer.subAnswers?.[subQ.id];
                        if (userSubAnswer !== null && userSubAnswer !== undefined) {
                            if (userSubAnswer === subQ.correctAnswer) {
                                correctAnswers++;
                            }
                        }
                    });
                } else {
                    // For regular questions
                    totalSubQuestions++;
                    if (userAnswer.selectedAnswer !== null) {
                        if (question.questionType === 'multiple_choice') {
                            if (userAnswer.selectedAnswer === question.correctAnswer) {
                                correctAnswers++;
                            }
                        } else if (question.questionType === 'true_false') {
                            if (userAnswer.selectedAnswer === question.correctAnswer) {
                                correctAnswers++;
                            }
                        } else if (question.questionType === 'short_answer') {
                            // For short answer, compare as strings (case insensitive)
                            const userAnswerStr = userAnswer.selectedAnswer.toString().toLowerCase().trim();
                            const correctAnswerStr = question.correctAnswer?.toString().toLowerCase().trim() || '';
                            if (userAnswerStr === correctAnswerStr) {
                                correctAnswers++;
                            }
                        }
                    }
                }
            }
        });

        return {
            correct: correctAnswers,
            total: totalSubQuestions,
            percentage: Math.round((correctAnswers / totalSubQuestions) * 100)
        };
    };

    const currentQuestion = currentExam.questions[currentQuestionIndex];
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
                                <span className="text-lg font-semibold">
                                    {hsaMockExam.questions.length} câu
                                    <span className="text-sm text-gray-500 ml-2">
                                        ({hsaMockExam.questions.reduce((total, q) =>
                                            total + (q.questionType === 'group_question' ? (q.subQuestions?.length || 0) : 1), 0
                                        )} ý)
                                    </span>
                                </span>
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

                        {/* Question Type Statistics */}
                        <div className="mb-8">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Thống kê theo loại câu hỏi:</h3>
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <div className="text-center p-4 bg-green-50 rounded-lg">
                                    <div className="text-lg font-bold text-green-600">
                                        {currentExam.questions.filter(q => q.questionType === 'multiple_choice').length}
                                    </div>
                                    <div className="text-sm text-gray-600">Trắc nghiệm</div>
                                </div>
                                <div className="text-center p-4 bg-red-50 rounded-lg">
                                    <div className="text-lg font-bold text-red-600">
                                        {currentExam.questions.filter(q => q.questionType === 'group_question').length}
                                    </div>
                                    <div className="text-sm text-gray-600">Câu hỏi nhóm</div>
                                </div>
                                <div className="text-center p-4 bg-purple-50 rounded-lg">
                                    <div className="text-lg font-bold text-purple-600">
                                        {currentExam.questions.filter(q => q.questionType === 'short_answer').length}
                                    </div>
                                    <div className="text-sm text-gray-600">Trả lời ngắn</div>
                                </div>
                            </div>
                        </div>

                        {/* Detailed Results */}
                        <div className="mb-8">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Kết quả chi tiết:</h3>
                            <div className="space-y-4">
                                {currentExam.questions.map((question) => {
                                    const userAnswer = userAnswers.find(ans => ans.questionId === question.id);
                                    if (question.questionType === 'group_question') {
                                        return (
                                            <div key={question.id} className="border border-gray-200 rounded-lg p-4">
                                                <div className="mb-3">
                                                    <h4 className="font-medium text-gray-900">
                                                        Câu {question.id}: <MathRenderer content={question.content} />
                                                    </h4>
                                                </div>
                                                <div className="space-y-2">
                                                    {question.subQuestions?.map((subQ) => {
                                                        const userSubAnswer = userAnswer?.subAnswers?.[subQ.id];
                                                        const isCorrect = userSubAnswer === subQ.correctAnswer;
                                                        return (
                                                            <div key={subQ.id} className={`p-3 rounded-lg ${isCorrect ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                                                                <div className="flex items-start justify-between">
                                                                    <div className="flex-1">
                                                                        <div className="font-medium text-gray-900 mb-1">
                                                                            <MathRenderer content={subQ.content} />
                                                                        </div>
                                                                        <div className="text-sm text-gray-600">
                                                                            Đáp án của bạn: <span className={`font-medium ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                                                                                {userSubAnswer === true ? 'Đúng' : userSubAnswer === false ? 'Sai' : 'Chưa trả lời'}
                                                                            </span>
                                                                        </div>
                                                                        <div className="text-sm text-gray-600">
                                                                            Đáp án đúng: <span className="font-medium text-green-600">
                                                                                {subQ.correctAnswer === true ? 'Đúng' : 'Sai'}
                                                                            </span>
                                                                        </div>
                                                                        {subQ.explanation && (
                                                                            <div className="mt-2 text-sm text-gray-700">
                                                                                <MathRenderer content={subQ.explanation} />
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                    <div className={`ml-3 px-2 py-1 rounded-full text-xs font-medium ${isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                                        {isCorrect ? 'Đúng' : 'Sai'}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        );
                                    } else {
                                        const isCorrect = userAnswer?.selectedAnswer === question.correctAnswer;
                                        return (
                                            <div key={question.id} className={`p-4 rounded-lg ${isCorrect ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                                                <div className="flex items-start justify-between">
                                                    <div className="flex-1">
                                                        <div className="font-medium text-gray-900 mb-2">
                                                            Câu {question.id}: <MathRenderer content={question.content} />
                                                        </div>
                                                        <div className="text-sm text-gray-600">
                                                            Đáp án của bạn: <span className={`font-medium ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                                                                {userAnswer?.selectedAnswer?.toString() || 'Chưa trả lời'}
                                                            </span>
                                                        </div>
                                                        <div className="text-sm text-gray-600">
                                                            Đáp án đúng: <span className="font-medium text-green-600">
                                                                {question.correctAnswer?.toString()}
                                                            </span>
                                                        </div>
                                                        {question.explanation && (
                                                            <div className="mt-2 text-sm text-gray-700">
                                                                <MathRenderer content={question.explanation} />
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className={`ml-3 px-2 py-1 rounded-full text-xs font-medium ${isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                        {isCorrect ? 'Đúng' : 'Sai'}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    }
                                })}
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
                                {currentExam.title}
                            </h1>
                            <p className="text-sm text-gray-600">
                                Câu {currentQuestionIndex + 1} / {currentExam.questions.length}
                                {currentQuestion.questionType === 'group_question' && currentQuestion.subQuestions && (
                                    <span className="ml-2 text-xs text-gray-500">
                                        ({currentQuestion.subQuestions.length} ý)
                                    </span>
                                )}
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
                                    <div className="flex items-center space-x-2">
                                        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                                            {currentQuestion.section}
                                        </span>
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${currentQuestion.questionType === 'multiple_choice'
                                            ? 'bg-green-100 text-green-800'
                                            : currentQuestion.questionType === 'true_false'
                                                ? 'bg-orange-100 text-orange-800'
                                                : currentQuestion.questionType === 'short_answer'
                                                    ? 'bg-purple-100 text-purple-800'
                                                    : 'bg-red-100 text-red-800'
                                            }`}>
                                            {currentQuestion.questionType === 'multiple_choice' && 'Trắc nghiệm'}
                                            {currentQuestion.questionType === 'true_false' && 'Đúng/Sai'}
                                            {currentQuestion.questionType === 'short_answer' && 'Trả lời ngắn'}
                                            {currentQuestion.questionType === 'group_question' && 'Câu hỏi nhóm'}
                                        </span>
                                    </div>
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

                                {/* Question Image */}
                                {currentQuestion.image && (
                                    <div className="mb-6">
                                        <img
                                            src={currentQuestion.image}
                                            alt={`Hình ảnh câu hỏi ${currentQuestion.id}`}
                                            className="max-w-full h-auto rounded-lg border border-gray-200 shadow-sm"
                                            onError={(e) => {
                                                e.currentTarget.style.display = 'none';
                                            }}
                                            onLoad={(e) => {
                                                e.currentTarget.style.display = 'block';
                                            }}
                                        />
                                    </div>
                                )}

                                {/* Answer Options based on question type */}
                                {currentQuestion.questionType === 'multiple_choice' && currentQuestion.options && (
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
                                                        <MathRenderer content={currentQuestion.options?.[option] || ''} />
                                                    </span>
                                                </div>
                                            </label>
                                        ))}
                                    </div>
                                )}

                                {currentQuestion.questionType === 'true_false' && (
                                    <div className="space-y-3">
                                        <label
                                            className={`flex items-start p-4 border-2 rounded-lg cursor-pointer transition-colors ${userAnswer?.selectedAnswer === true
                                                ? 'border-green-500 bg-green-50'
                                                : 'border-gray-200 hover:border-gray-300'
                                                }`}
                                        >
                                            <input
                                                type="radio"
                                                name={`question-${currentQuestion.id}`}
                                                value="true"
                                                checked={userAnswer?.selectedAnswer === true}
                                                onChange={() => handleAnswerSelect(true)}
                                                className="mt-1 mr-3"
                                            />
                                            <div className="flex">
                                                <span className="font-medium text-gray-900 mr-2">Đúng</span>
                                            </div>
                                        </label>
                                        <label
                                            className={`flex items-start p-4 border-2 rounded-lg cursor-pointer transition-colors ${userAnswer?.selectedAnswer === false
                                                ? 'border-green-500 bg-green-50'
                                                : 'border-gray-200 hover:border-gray-300'
                                                }`}
                                        >
                                            <input
                                                type="radio"
                                                name={`question-${currentQuestion.id}`}
                                                value="false"
                                                checked={userAnswer?.selectedAnswer === false}
                                                onChange={() => handleAnswerSelect(false)}
                                                className="mt-1 mr-3"
                                            />
                                            <div className="flex">
                                                <span className="font-medium text-gray-900 mr-2">Sai</span>
                                            </div>
                                        </label>
                                    </div>
                                )}

                                {currentQuestion.questionType === 'short_answer' && (
                                    <div className="space-y-3">
                                        <div className="p-4 border-2 border-gray-200 rounded-lg">
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Nhập đáp án:
                                            </label>
                                            <input
                                                type="text"
                                                value={userAnswer?.selectedAnswer?.toString() || ''}
                                                onChange={(e) => handleAnswerSelect(e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                placeholder="Nhập đáp án của bạn..."
                                            />
                                        </div>
                                    </div>
                                )}

                                {currentQuestion.questionType === 'group_question' && currentQuestion.subQuestions && (
                                    <div className="space-y-6">
                                        {currentQuestion.subQuestions.map((subQuestion) => (
                                            <div key={subQuestion.id} className="border border-gray-200 rounded-lg p-4">
                                                <div className="mb-4">
                                                    <h4 className="font-medium text-gray-900 mb-2">
                                                        <MathRenderer content={subQuestion.content} />
                                                    </h4>
                                                </div>

                                                <div className="space-y-3">
                                                    <label
                                                        className={`flex items-start p-3 border-2 rounded-lg cursor-pointer transition-colors ${userAnswer?.subAnswers?.[subQuestion.id] === true
                                                            ? 'border-green-500 bg-green-50'
                                                            : 'border-gray-200 hover:border-gray-300'
                                                            }`}
                                                    >
                                                        <input
                                                            type="radio"
                                                            name={`sub-question-${currentQuestion.id}-${subQuestion.id}`}
                                                            value="true"
                                                            checked={userAnswer?.subAnswers?.[subQuestion.id] === true}
                                                            onChange={() => handleSubAnswerSelect(subQuestion.id, true)}
                                                            className="mt-1 mr-3"
                                                        />
                                                        <div className="flex">
                                                            <span className="font-medium text-gray-900 mr-2">Đúng</span>
                                                        </div>
                                                    </label>
                                                    <label
                                                        className={`flex items-start p-3 border-2 rounded-lg cursor-pointer transition-colors ${userAnswer?.subAnswers?.[subQuestion.id] === false
                                                            ? 'border-green-500 bg-green-50'
                                                            : 'border-gray-200 hover:border-gray-300'
                                                            }`}
                                                    >
                                                        <input
                                                            type="radio"
                                                            name={`sub-question-${currentQuestion.id}-${subQuestion.id}`}
                                                            value="false"
                                                            checked={userAnswer?.subAnswers?.[subQuestion.id] === false}
                                                            onChange={() => handleSubAnswerSelect(subQuestion.id, false)}
                                                            className="mt-1 mr-3"
                                                        />
                                                        <div className="flex">
                                                            <span className="font-medium text-gray-900 mr-2">Sai</span>
                                                        </div>
                                                    </label>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
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
                                    disabled={currentQuestionIndex === currentExam.questions.length - 1}
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
                                {currentExam.questions.map((question, index) => {
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