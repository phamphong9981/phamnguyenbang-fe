'use client';

import { ExamResultDto, SubmitExamDto, useExamSet, useSubmitExam, ExamSetType, SUBJECT_ID } from '@/hooks/useExam';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState, Suspense, useRef } from 'react';
import ExamIntroScreen from '@/components/exam/ExamIntroScreen';
import ExamHeader from '@/components/exam/ExamHeader';
import QuestionCard from '@/components/exam/QuestionCard';
import GroupQuestionSplitView from '@/components/exam/GroupQuestionSplitView';
import QuestionNavigator from '@/components/exam/QuestionNavigator';
import ExamResults from '@/components/exam/ExamResults';

interface UserAnswer {
    questionId: string;
    selectedAnswer: string[]; // Array to support multiple answers
    subAnswers?: { [key: string]: string[] }; // For group questions - also array
}

function ExamPageContent() {
    const router = useRouter();
    const searchParams = useSearchParams();

    // Ensure this component only runs on the client side
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);
    const [timeLeft, setTimeLeft] = useState(0);
    const [isExamStarted, setIsExamStarted] = useState(false);
    const [isExamFinished, setIsExamFinished] = useState(false);
    const [showResults, setShowResults] = useState(false);
    const [examId, setExamId] = useState<string>('');
    const [examResult, setExamResult] = useState<ExamResultDto | null>(null);
    const finishExamRef = useRef<(() => void) | null>(null);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

    // Helper function to check if an answer is an image
    const isImageAnswer = (answer: string): boolean => {
        return answer.startsWith('/questions/') && (
            answer.endsWith('.png') ||
            answer.endsWith('.jpg') ||
            answer.endsWith('.jpeg') ||
            answer.endsWith('.gif') ||
            answer.endsWith('.webp') ||
            answer.endsWith('.svg')
        );
    };

    // Get exam ID from URL after component mounts
    useEffect(() => {
        const id = searchParams.get('examId') || '';
        setExamId(id);
        console.log('🚀 Exam ID:', id);
        console.log('🔍 All search params:', Object.fromEntries(searchParams.entries()));
    }, [searchParams]);

    // Fetch exam data from API
    const { data: currentExam, isLoading: examLoading, error: examError } = useExamSet(examId);

    // Initialize user answers when exam changes
    useEffect(() => {
        if (currentExam) {
            const initialAnswers = currentExam.examQuestions.map(q => ({
                questionId: q.question_id,
                selectedAnswer: [] as string[]
            }));
            setUserAnswers(initialAnswers);
            setTimeLeft(parseInt(currentExam.duration) * 60);
        }
    }, [currentExam]);

    // Timer countdown
    useEffect(() => {
        if (!isExamStarted || isExamFinished || !currentExam) return;

        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    clearInterval(timer);
                    finishExamRef.current?.();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [isExamStarted, isExamFinished, currentExam]);

    const formatTime = (seconds: number) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    // Hook để submit bài thi
    const submitExamMutation = useSubmitExam();

    const finishExam = useCallback(async () => {
        setIsExamFinished(true);

        try {
            // Chuẩn bị dữ liệu để submit
            const answers = userAnswers.flatMap(answer => {
                const question = currentExam?.examQuestions.find(q => q.question_id === answer.questionId)?.question;

                if (question?.question_type === 'group_question' && answer.subAnswers) {
                    return Object.entries(answer.subAnswers).map(([subId, subAnswerArray]) => ({
                        questionId: `${answer.questionId}_${subId}`,
                        selectedAnswer: Array.isArray(subAnswerArray) ? subAnswerArray : []
                    }));
                } else {
                    return [{
                        questionId: answer.questionId,
                        selectedAnswer: Array.isArray(answer.selectedAnswer) ? answer.selectedAnswer : []
                    }];
                }
            });

            const submitData: SubmitExamDto = {
                examId: examId,
                profileId: "user_profile_id",
                answers: answers,
                totalTime: parseInt(currentExam?.duration || '0') * 60 - timeLeft
            };

            const result = await submitExamMutation.mutateAsync(submitData);
            console.log('Submit exam completed:', result);
            setExamResult(result);
            setShowResults(true);
        } catch (error) {
            console.error('Error submitting exam:', error);
            alert('Có lỗi xảy ra khi nộp bài. Vui lòng thử lại!');
            setShowResults(true);
        }
    }, [examId, userAnswers, currentExam, timeLeft, submitExamMutation]);

    // Store the finishExam function in the ref
    useEffect(() => {
        finishExamRef.current = finishExam;
    }, [finishExam]);

    const startExam = () => {
        setIsExamStarted(true);
    };

    // Create handlers that are bound to specific question IDs
    const createHandleAnswerSelect = (questionId: string) =>
        (answer: string, questionType: string, isMultiple: boolean) => {
            setUserAnswers(prev =>
                prev.map(ans => {
                    if (ans.questionId === questionId) {
                        const answerStr = answer.toString();
                        if (isMultiple) {
                            // MULTIPLE_CHOICE: Toggle answer in array
                            const currentAnswers = ans.selectedAnswer || [];
                            const newAnswers = currentAnswers.includes(answerStr)
                                ? currentAnswers.filter(a => a !== answerStr)
                                : [...currentAnswers, answerStr];
                            return { ...ans, selectedAnswer: newAnswers };
                        } else {
                            // SINGLE_CHOICE or SHORT_ANSWER: Replace with single answer
                            return { ...ans, selectedAnswer: [answerStr] };
                        }
                    }
                    return ans;
                })
            );
        };

    const createHandleSubAnswerSelect = (questionId: string) =>
        (subQuestionId: string, answer: string, questionType: string, isMultiple: boolean) => {
            setUserAnswers(prev =>
                prev.map(ans => {
                    if (ans.questionId === questionId) {
                        const answerStr = answer.toString();
                        const currentSubAnswers = ans.subAnswers || {};
                        const currentAnswerArray = currentSubAnswers[subQuestionId] || [];

                        let newAnswerArray: string[];
                        if (isMultiple) {
                            newAnswerArray = currentAnswerArray.includes(answerStr)
                                ? currentAnswerArray.filter(a => a !== answerStr)
                                : [...currentAnswerArray, answerStr];
                        } else {
                            newAnswerArray = [answerStr];
                        }

                        return {
                            ...ans,
                            subAnswers: {
                                ...currentSubAnswers,
                                [subQuestionId]: newAnswerArray
                            }
                        };
                    }
                    return ans;
                })
            );
        };

    const getQuestionStatus = (questionIndex: number) => {
        if (!currentExam) return 'unanswered';

        const question = currentExam.examQuestions[questionIndex];
        const userAnswer = userAnswers.find(ans => ans.questionId === question.question_id);

        if (question.question.question_type === 'group_question') {
            if (userAnswer?.subAnswers) {
                const allAnswered = question.question.subQuestions?.every(subQ => {
                    const subAnswer = userAnswer.subAnswers?.[subQ.id];
                    if (Array.isArray(subAnswer)) {
                        if (subQ.question_type === 'short_answer') {
                            return subAnswer.length > 0 && subAnswer[0]?.trim() !== '';
                        }
                        return subAnswer.length > 0;
                    }
                    return false;
                });
                return allAnswered ? 'answered' : 'unanswered';
            }
            return 'unanswered';
        } else {
            if (Array.isArray(userAnswer?.selectedAnswer) && userAnswer.selectedAnswer.length > 0) {
                if (question.question.question_type === 'short_answer') {
                    return userAnswer.selectedAnswer[0]?.trim() !== '' ? 'answered' : 'unanswered';
                }
                return 'answered';
            }
            return 'unanswered';
        }
    };

    const calculateScore = () => {
        if (!currentExam) return { correct: 0, total: 0, percentage: 0 };

        let correctAnswers = 0;
        let totalSubQuestions = 0;

        userAnswers.forEach(userAnswer => {
            const examQuestion = currentExam.examQuestions.find(q => q.question_id === userAnswer.questionId);
            if (examQuestion) {
                const question = examQuestion.question;
                if (question.question_type === 'group_question') {
                    question.subQuestions?.forEach(subQ => {
                        totalSubQuestions++;
                        const userSubAnswer = userAnswer.subAnswers?.[subQ.id];
                        const subQuestionType = subQ.question_type || 'true_false';
                        const correctAnswerArray = Array.isArray(subQ.correct_answer) ? subQ.correct_answer : [subQ.correct_answer].filter(Boolean);

                        if (Array.isArray(userSubAnswer) && userSubAnswer.length > 0) {
                            const sortedUserAnswer = [...userSubAnswer].sort();
                            const sortedCorrectAnswer = [...correctAnswerArray].map(a => a.toString()).sort();

                            if (subQuestionType === 'short_answer') {
                                const userAnswerStr = userSubAnswer[0]?.toLowerCase().trim() || '';
                                const correctAnswerStr = correctAnswerArray[0]?.toString().toLowerCase().trim() || '';
                                if (userAnswerStr === correctAnswerStr) {
                                    correctAnswers++;
                                }
                            } else {
                                const userAnswerStrs = sortedUserAnswer.map(a => a.toString());
                                if (userAnswerStrs.length === sortedCorrectAnswer.length &&
                                    userAnswerStrs.every((val, idx) => val === sortedCorrectAnswer[idx])) {
                                    correctAnswers++;
                                }
                            }
                        }
                    });
                } else {
                    totalSubQuestions++;
                    const userAnswerArray = Array.isArray(userAnswer.selectedAnswer) ? userAnswer.selectedAnswer : [];
                    const correctAnswerArray = Array.isArray(question.correct_answer) ? question.correct_answer : [question.correct_answer].filter(Boolean);

                    if (userAnswerArray.length > 0) {
                        if (question.question_type === 'multiple_choice' || question.question_type === 'single_choice') {
                            const sortedUserAnswer = [...userAnswerArray].map(a => a.toString()).sort();
                            const sortedCorrectAnswer = [...correctAnswerArray].map(a => a.toString()).sort();
                            if (sortedUserAnswer.length === sortedCorrectAnswer.length &&
                                sortedUserAnswer.every((val, idx) => val === sortedCorrectAnswer[idx])) {
                                correctAnswers++;
                            }
                        } else if (question.question_type === 'true_false') {
                            const sortedUserAnswer = [...userAnswerArray].map(a => a.toString()).sort();
                            const sortedCorrectAnswer = [...correctAnswerArray].map(a => a.toString()).sort();
                            if (sortedUserAnswer.length === sortedCorrectAnswer.length &&
                                sortedUserAnswer.every((val, idx) => val === sortedCorrectAnswer[idx])) {
                                correctAnswers++;
                            }
                        } else if (question.question_type === 'short_answer') {
                            const userAnswerStr = userAnswerArray[0]?.toLowerCase().trim() || '';
                            const correctAnswerStr = correctAnswerArray[0]?.toString().toLowerCase().trim() || '';
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

    // Client-side hydration check
    if (!isClient) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Đang tải...</p>
                </div>
            </div>
        );
    }

    // Loading state
    if (examLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Đang tải đề thi...</p>
                </div>
            </div>
        );
    }

    // Error state
    if (examError || !currentExam) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="text-red-600 text-6xl mb-4">❌</div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Lỗi tải đề thi</h1>
                    <p className="text-gray-600 mb-4">Không thể tải đề thi. Vui lòng thử lại.</p>
                    <button
                        onClick={() => router.push('/thi-hsa-tsa')}
                        className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                    >
                        Về trang đề thi
                    </button>
                </div>
            </div>
        );
    }

    if (!isExamStarted) {
        return (
            <ExamIntroScreen
                examName={currentExam.name}
                duration={currentExam.duration}
                totalQuestions={currentExam.examQuestions.length}
                examType={currentExam.type}
                onStartExam={startExam}
            />
        );
    }

    if (showResults) {
        const score = calculateScore();
        return (
            <ExamResults
                examResult={examResult}
                score={score}
                examId={examId}
            />
        );
    }

    const answeredCount = userAnswers.filter(ans =>
        Array.isArray(ans.selectedAnswer) && ans.selectedAnswer.length > 0 ||
        ans.subAnswers && Object.keys(ans.subAnswers).length > 0
    ).length;

    // Check if should use split view: Only for TSA with LITERATURE or SCIENCE subjects
    const shouldUseSplitView = currentExam.type === ExamSetType.TSA &&
        (currentExam.subject === SUBJECT_ID.LITERATURE || currentExam.subject === SUBJECT_ID.SCIENCE);

    // Navigation handlers for split view
    const handlePrevQuestion = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(currentQuestionIndex - 1);
            // Scroll to top
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const handleNextQuestion = () => {
        if (currentQuestionIndex < currentExam.examQuestions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
            // Scroll to top
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const handleQuestionSelect = (index: number) => {
        setCurrentQuestionIndex(index);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Render split view only for TSA with LITERATURE or SCIENCE (one at a time)
    if (shouldUseSplitView) {
        const currentQuestion = currentExam.examQuestions[currentQuestionIndex];
        const userAnswer = userAnswers.find(ans => ans.questionId === currentQuestion.question_id);

        return (
            <div className="min-h-screen bg-gray-50">
                <ExamHeader
                    examName={currentExam.name}
                    totalQuestions={currentExam.examQuestions.length}
                    timeLeft={timeLeft}
                    formatTime={formatTime}
                    onFinishExam={finishExam}
                />

                <div className="max-w-[1600px] mx-auto px-4 py-8">
                    <div className="grid grid-cols-1 gap-8">
                        {/* Main Content - Current Question Only */}
                        <div className="lg:col-span-5 space-y-6">
                            {/* Question Display */}
                            {currentQuestion.question.question_type === 'group_question' ? (
                                <GroupQuestionSplitView
                                    key={currentQuestion.question_id}
                                    question={currentQuestion.question}
                                    questionNumber={currentQuestionIndex + 1}
                                    questionId={currentQuestion.question_id}
                                    subAnswers={userAnswer?.subAnswers}
                                    onSubAnswerSelect={createHandleSubAnswerSelect(currentQuestion.question_id)}
                                    isImageAnswer={isImageAnswer}
                                />
                            ) : (
                                <QuestionCard
                                    key={currentQuestion.question_id}
                                    question={currentQuestion.question}
                                    questionNumber={currentQuestionIndex + 1}
                                    questionId={currentQuestion.question_id}
                                    selectedAnswer={userAnswer?.selectedAnswer || []}
                                    subAnswers={userAnswer?.subAnswers}
                                    onAnswerSelect={createHandleAnswerSelect(currentQuestion.question_id)}
                                    onSubAnswerSelect={createHandleSubAnswerSelect(currentQuestion.question_id)}
                                    isImageAnswer={isImageAnswer}
                                />
                            )}

                            {/* Navigation Controls */}
                            <div className="bg-white w-[50%] mx-auto rounded-lg shadow-lg p-6">
                                <div className="flex items-center justify-between">
                                    <button
                                        onClick={handlePrevQuestion}
                                        disabled={currentQuestionIndex === 0}
                                        className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all ${currentQuestionIndex === 0
                                            ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                            : 'bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg'
                                            }`}
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                        </svg>
                                        <span>Câu trước</span>
                                    </button>

                                    <div className="text-center">
                                        <p className="text-sm text-gray-600">Câu hỏi</p>
                                        <p className="text-2xl font-bold text-gray-900">
                                            {currentQuestionIndex + 1} / {currentExam.examQuestions.length}
                                        </p>
                                    </div>

                                    {currentQuestionIndex === currentExam.examQuestions.length - 1 ? (
                                        <button
                                            onClick={finishExam}
                                            className="flex items-center space-x-2 px-6 py-3 rounded-lg font-medium bg-green-600 text-white hover:bg-green-700 shadow-md hover:shadow-lg transition-all"
                                        >
                                            <span>Nộp bài</span>
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </button>
                                    ) : (
                                        <button
                                            onClick={handleNextQuestion}
                                            className="flex items-center space-x-2 px-6 py-3 rounded-lg font-medium bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg transition-all"
                                        >
                                            <span>Câu tiếp</span>
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </svg>
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Default view for regular questions (all at once)
    return (
        <div className="min-h-screen bg-gray-50">
            <ExamHeader
                examName={currentExam.name}
                totalQuestions={currentExam.examQuestions.length}
                timeLeft={timeLeft}
                formatTime={formatTime}
                onFinishExam={finishExam}
            />

            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-7 gap-8">
                    {/* Main Content - All Questions */}
                    <div className="lg:col-span-5">
                        <div className="space-y-8">
                            {currentExam.examQuestions.map((examQuestion, index) => {
                                const userAnswer = userAnswers.find(ans => ans.questionId === examQuestion.question_id);

                                return (
                                    <QuestionCard
                                        key={examQuestion.question_id}
                                        question={examQuestion.question}
                                        questionNumber={index + 1}
                                        questionId={examQuestion.question_id}
                                        selectedAnswer={userAnswer?.selectedAnswer || []}
                                        subAnswers={userAnswer?.subAnswers}
                                        onAnswerSelect={createHandleAnswerSelect(examQuestion.question_id)}
                                        onSubAnswerSelect={createHandleSubAnswerSelect(examQuestion.question_id)}
                                        isImageAnswer={isImageAnswer}
                                    />
                                );
                            })}
                        </div>

                        {/* Submit Button */}
                        <div className="mt-12 text-center">
                            <button
                                onClick={finishExam}
                                className="bg-green-600 hover:bg-green-700 text-white px-12 py-4 rounded-lg text-lg font-semibold transition-colors shadow-lg"
                            >
                                Hoàn thành và nộp bài
                            </button>
                        </div>
                    </div>

                    {/* Sidebar - Question Navigator */}
                    <div className="lg:col-span-2">
                        <QuestionNavigator
                            totalQuestions={currentExam.examQuestions.length}
                            getQuestionStatus={getQuestionStatus}
                            answeredCount={answeredCount}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

// Loading component for Suspense
function ExamPageLoading() {
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="text-center">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Đang tải đề thi...</p>
            </div>
        </div>
    );
}

// Main component with Suspense boundary
export default function ExamPage() {
    return (
        <Suspense fallback={<ExamPageLoading />}>
            <ExamPageContent />
        </Suspense>
    );
}