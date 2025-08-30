'use client';

import MathRenderer from '@/components/MathRenderer';
import { ExamResultDto, SubmitExamDto, useExamSet, useSubmitExam } from '@/hooks/useExam';
import { getPrizeDetails, getPrizesBasedOnScore } from '@/lib/prizes';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

const Wheel = dynamic(() => import('react-custom-roulette').then(mod => ({ default: mod.Wheel })), {
    ssr: false,
    loading: () => <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
});

interface UserAnswer {
    questionId: string;
    selectedAnswer: string | boolean | number | null;
    subAnswers?: { [key: string]: string | boolean | number | null }; // For group questions
}

interface Prize {
    id: string;
    name: string;
    image: string;
    probability: number;
    color: string;
}

export default function ExamPage() {
    const router = useRouter();
    const searchParams = useSearchParams();

    // Ensure this component only runs on the client side
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);
    const [timeLeft, setTimeLeft] = useState(0);
    const [isExamStarted, setIsExamStarted] = useState(false);
    const [isExamFinished, setIsExamFinished] = useState(false);
    const [showResults, setShowResults] = useState(false);
    const [examId, setExamId] = useState<string>('');
    const [isSpinning, setIsSpinning] = useState(false);
    const [wonPrize, setWonPrize] = useState<Prize | null>(null);
    const [showPrizeModal, setShowPrizeModal] = useState(false);
    const [examResult, setExamResult] = useState<ExamResultDto | null>(null);

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
                selectedAnswer: null
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
                    finishExam();
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

    const startExam = () => {
        setIsExamStarted(true);
    };

    // Hook để submit bài thi
    const submitExamMutation = useSubmitExam();

    const finishExam = useCallback(async () => {
        setIsExamFinished(true);

        try {
            // Chuẩn bị dữ liệu để submit
            // Chuẩn bị danh sách câu trả lời
            const answers = userAnswers.flatMap(answer => {
                const question = currentExam?.examQuestions.find(q => q.question_id === answer.questionId)?.question;

                if (question?.question_type === 'group_question' && answer.subAnswers) {
                    // Với câu hỏi nhóm, tạo một mảng câu trả lời cho từng câu con
                    return Object.entries(answer.subAnswers).map(([subId, subAnswer]) => ({
                        questionId: `${answer.questionId}_${subId}`,
                        selectedAnswer: subAnswer?.toString() || ''
                    }));
                } else {
                    // Với câu hỏi thường
                    return [{
                        questionId: answer.questionId,
                        selectedAnswer: answer.selectedAnswer?.toString() || ''
                    }];
                }
            });

            const submitData: SubmitExamDto = {
                examId: examId,
                profileId: "user_profile_id", // TODO: Thay thế bằng ID thực tế của user
                answers: answers,
                totalTime: parseInt(currentExam?.duration || '0') * 60 - timeLeft // Thời gian làm bài thực tế
            };

            // Gọi API submit bài thi sử dụng mutation
            const result = await submitExamMutation.mutateAsync(submitData);
            console.log('Submit exam completed:', result);
            setExamResult(result);

            // Hiển thị kết quả
            setShowResults(true);
        } catch (error) {
            console.error('Error submitting exam:', error);
            // TODO: Hiển thị thông báo lỗi cho người dùng
            alert('Có lỗi xảy ra khi nộp bài. Vui lòng thử lại!');
            setShowResults(true); // Vẫn hiển thị kết quả ngay cả khi có lỗi
        }
    }, [examId, userAnswers, currentExam, timeLeft, submitExamMutation]);

    const handleAnswerSelect = (answer: string | boolean | number) => {
        if (!currentExam) return;

        setUserAnswers(prev =>
            prev.map(ans =>
                ans.questionId === currentExam.examQuestions[currentQuestionIndex].question_id
                    ? { ...ans, selectedAnswer: answer }
                    : ans
            )
        );
    };

    const handleSubAnswerSelect = (subQuestionId: string, answer: string | boolean | number) => {
        if (!currentExam) return;

        setUserAnswers(prev =>
            prev.map(ans =>
                ans.questionId === currentExam.examQuestions[currentQuestionIndex].question_id
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
        if (!currentExam) return;

        if (currentQuestionIndex < currentExam.examQuestions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        }
    };

    const prevQuestion = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(currentQuestionIndex - 1);
        }
    };

    const getQuestionStatus = (questionIndex: number) => {
        if (!currentExam) return 'unanswered';

        const question = currentExam.examQuestions[questionIndex];
        const userAnswer = userAnswers.find(ans => ans.questionId === question.question_id);

        if (question.question.question_type === 'group_question') {
            // For group questions, check if all sub-questions are answered
            if (userAnswer?.subAnswers) {
                const allAnswered = question.question.subQuestions?.every(subQ =>
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
        if (!currentExam) return { correct: 0, total: 0, percentage: 0 };

        let correctAnswers = 0;
        let totalSubQuestions = 0;

        userAnswers.forEach(userAnswer => {
            const examQuestion = currentExam.examQuestions.find(q => q.question_id === userAnswer.questionId);
            if (examQuestion) {
                const question = examQuestion.question;
                if (question.question_type === 'group_question') {
                    // For group questions, count each sub-question
                    question.subQuestions?.forEach(subQ => {
                        totalSubQuestions++;
                        const userSubAnswer = userAnswer.subAnswers?.[subQ.id];
                        if (userSubAnswer !== null && userSubAnswer !== undefined) {
                            if (userSubAnswer === subQ.correct_answer) {
                                correctAnswers++;
                            }
                        }
                    });
                } else {
                    // For regular questions
                    totalSubQuestions++;
                    if (userAnswer.selectedAnswer !== null) {
                        if (question.question_type === 'multiple_choice') {
                            if (userAnswer.selectedAnswer === question.correct_answer) {
                                correctAnswers++;
                            }
                        } else if (question.question_type === 'true_false') {
                            if (userAnswer.selectedAnswer === question.correct_answer) {
                                correctAnswers++;
                            }
                        } else if (question.question_type === 'short_answer') {
                            // For short answer, compare as strings (case insensitive)
                            const userAnswerStr = userAnswer.selectedAnswer.toString().toLowerCase().trim();
                            const correctAnswerStr = question.correct_answer?.toString().toLowerCase().trim() || '';
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

    const handleSpinComplete = (prize: Prize | null) => {
        setIsSpinning(false);
        setWonPrize(prize);

        // Log the prize selection method for debugging
        if (examResult?.giveAway && prize?.id === examResult.giveAway) {
            console.log('🎯 Prize selected from exam result giveAway:', prize);
        } else {
            console.log('🎲 Prize selected randomly:', prize);
        }

        setShowPrizeModal(true);
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

    const currentQuestion = currentExam.examQuestions[currentQuestionIndex];
    const userAnswer = userAnswers.find(ans => ans.questionId === currentQuestion.question_id);

    if (!isExamStarted) {
        return (
            <div className="min-h-screen bg-gray-50">
                <div className="max-w-4xl mx-auto px-4 py-16">
                    <div className="bg-white rounded-lg shadow-lg p-8">
                        <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">
                            {currentExam.name}
                        </h1>

                        <div className="space-y-4 mb-8">
                            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                <span className="font-medium">Thời gian làm bài:</span>
                                <span className="text-lg font-semibold">{currentExam.duration} phút</span>
                            </div>
                            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                <span className="font-medium">Số câu hỏi:</span>
                                <span className="text-lg font-semibold">
                                    {currentExam.examQuestions.length} câu
                                </span>
                            </div>
                            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                <span className="font-medium">Loại đề:</span>
                                <span className="text-lg font-semibold">{currentExam.type}</span>
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
        const prizes = getPrizesBasedOnScore(score.percentage);

        return (
            <div className="min-h-screen bg-gray-50">
                <div className="max-w-4xl mx-auto px-4 py-16">
                    <div className="bg-white rounded-lg shadow-lg p-8">
                        <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">
                            Kết quả bài thi
                        </h1>

                        <div className="text-center mb-8">
                            <div className="text-6xl font-bold text-green-600 mb-4">
                                {examResult ? examResult.percentage : score.percentage}%
                            </div>
                            <div className="text-xl text-gray-600">
                                {examResult ? `${examResult.totalPoints}/${examResult.maxPoints} điểm` : `${score.correct}/${score.total} câu đúng`}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                            <div className="text-center p-4 bg-green-50 rounded-lg">
                                <div className="text-2xl font-bold text-green-600">
                                    {examResult?.totalPoints}
                                </div>
                                <div className="text-sm text-gray-600">
                                    Điểm đạt được
                                </div>
                            </div>
                            <div className="text-center p-4 bg-red-50 rounded-lg">
                                <div className="text-2xl font-bold text-red-600">
                                    {examResult?.totalTime}s
                                </div>
                                <div className="text-sm text-gray-600">
                                    Thời gian làm bài
                                </div>
                            </div>
                            <div className="text-center p-4 bg-blue-50 rounded-lg">
                                <div className="text-2xl font-bold text-blue-600">
                                    {examResult?.maxPoints}
                                </div>
                                <div className="text-sm text-gray-600">
                                    Tổng điểm
                                </div>
                            </div>
                        </div>

                        {/* Vòng quay may mắn */}
                        <div className="mb-8">
                            <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg p-6 mb-6">
                                <h3 className="text-white text-xl font-bold mb-2 text-center">🎁 Phần thưởng đặc biệt!</h3>
                                <p className="text-white mb-4 text-center">
                                    Bạn đã hoàn thành bài thi! Hãy thử vận may với vòng quay may mắn để nhận phần thưởng hấp dẫn!
                                </p>
                            </div>

                            {/* Vòng quay */}
                            <div className="flex flex-col items-center space-y-6">
                                <div className="relative flex justify-center">
                                    <Wheel
                                        mustStartSpinning={isSpinning}
                                        prizeNumber={0}
                                        data={prizes.map(prize => ({
                                            option: prize.name,
                                            image: prize.image && prize.image !== '/vounchers/no-prize.png' ? {
                                                uri: prize.image,
                                                sizeMultiplier: 0.6,
                                                offsetX: 0,
                                                offsetY: 0
                                            } : undefined,
                                            style: {
                                                backgroundColor: prize.color,
                                                fontSize: 12,
                                                textColor: prize.color === '#f3f4f6' ? '#000' : '#fff',
                                            },
                                        }))}
                                        onStopSpinning={() => {
                                            setIsSpinning(false);

                                            console.log('🎯 Wheel stopped spinning. Exam result:', examResult);
                                            console.log('🎁 Available prizes:', prizes);

                                            // Use the giveAway from exam result if available
                                            let selectedPrize: Prize | null = null;
                                            // Find the prize that matches the giveAway ID
                                            selectedPrize = prizes.find(prize => prize.id === examResult?.giveAway) || null;
                                            console.log('🎯 Prize found from giveAway:', selectedPrize);

                                            console.log('🏆 Final selected prize:', selectedPrize);
                                            handleSpinComplete(selectedPrize);
                                        }}
                                        backgroundColors={prizes.map(prize => prize.color)}
                                        textColors={['#000', '#fff']}
                                        fontSize={12}
                                        fontWeight="bold"
                                        textDistance={70}
                                        innerRadius={25}
                                        outerBorderWidth={3}
                                        outerBorderColor="#f59e0b"
                                        innerBorderWidth={2}
                                        innerBorderColor="#f59e0b"
                                        spinDuration={0.8}
                                        radiusLineColor="#f59e0b"
                                        radiusLineWidth={1}
                                    />
                                </div>

                                <button
                                    onClick={() => setIsSpinning(true)}
                                    disabled={isSpinning}
                                    className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold py-4 px-12 rounded-full shadow-xl transition-all duration-300 text-lg transform hover:scale-105 disabled:transform-none border-2 border-yellow-400 hover:border-yellow-500"
                                >
                                    {isSpinning ? (
                                        <div className="flex items-center space-x-2">
                                            <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                                            <span>Đang quay...</span>
                                        </div>
                                    ) : (
                                        '🎯 Quay vòng quay! 🎯'
                                    )}
                                </button>



                                {/* Danh sách phần thưởng */}
                                <div className="bg-white rounded-lg p-6 shadow-lg w-full max-w-md">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">
                                        Danh sách phần thưởng
                                    </h3>
                                    <div className="space-y-3">
                                        {prizes.map((prize) => (
                                            <div
                                                key={prize.id}
                                                className={`flex gap-2 items-center justify-between p-3 rounded-lg transition-all duration-200`}
                                                style={{ backgroundColor: prize.color }}
                                            >
                                                <div className="flex items-center space-x-3">
                                                    {prize.image ? (
                                                        <img
                                                            src={prize.image}
                                                            alt={prize.name}
                                                            className="w-12 h-12 object-cover rounded-lg shadow-sm"
                                                            onError={(e) => {
                                                                e.currentTarget.style.display = 'none';
                                                                e.currentTarget.nextElementSibling?.classList.remove('hidden');
                                                            }}
                                                        />
                                                    ) : null}
                                                    <div className={`w-12 h-12 bg-gray-300 rounded-lg flex items-center justify-center ${prize.image ? 'hidden' : ''}`}>
                                                        <span className="text-white text-lg">🎁</span>
                                                    </div>
                                                    <span className="font-medium text-gray-800 text-sm flex-1">
                                                        {prize.name}
                                                    </span>
                                                </div>
                                                <span className="text-sm font-semibold text-gray-600 bg-white px-2 py-1 rounded">
                                                    {prize.probability}%
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-center space-x-4">
                            <button
                                onClick={() => router.push('/thi-hsa-tsa/bai-tap-chuong')}
                                className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                            >
                                Về trang đề thi
                            </button>
                            <button
                                onClick={() => router.refresh()}
                                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                            >
                                Làm lại
                            </button>
                        </div>
                    </div>
                </div>

                {/* Modal hiển thị phần thưởng */}
                {showPrizeModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
                            {wonPrize ? (
                                <div className="text-center">
                                    <div className="text-6xl mb-4">🎉</div>
                                    <h2 className="text-2xl font-bold text-green-600 mb-4">
                                        Chúc mừng!
                                    </h2>
                                    <div className="mb-6">
                                        <img
                                            src={wonPrize.image}
                                            alt={wonPrize.name}
                                            className="w-24 h-24 object-cover rounded-lg mx-auto mb-4"
                                        />
                                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                            {getPrizeDetails(wonPrize.id).title}
                                        </h3>
                                        <p className="text-gray-600 mb-2">
                                            {getPrizeDetails(wonPrize.id).description}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            {getPrizeDetails(wonPrize.id).instructions}
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => setShowPrizeModal(false)}
                                        className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                                    >
                                        Nhận phần thưởng
                                    </button>
                                </div>
                            ) : (
                                <div className="text-center">
                                    <div className="text-6xl mb-4">😅</div>
                                    <h2 className="text-2xl font-bold text-gray-600 mb-4">
                                        Chúc bạn may mắn lần sau!
                                    </h2>
                                    <p className="text-gray-600 mb-6">
                                        Không sao, hãy tiếp tục học tập và làm bài thi để có cơ hội nhận được phần thưởng hấp dẫn nhé!
                                    </p>
                                    <button
                                        onClick={() => setShowPrizeModal(false)}
                                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                                    >
                                        Đóng
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                )}
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
                                {currentExam.name}
                            </h1>
                            <p className="text-sm text-gray-600">
                                Câu {currentQuestionIndex + 1} / {currentExam.examQuestions.length}
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
                                            {currentQuestion.question.section}
                                        </span>
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${currentQuestion.question.question_type === 'multiple_choice'
                                            ? 'bg-green-100 text-green-800'
                                            : currentQuestion.question.question_type === 'true_false'
                                                ? 'bg-orange-100 text-orange-800'
                                                : currentQuestion.question.question_type === 'short_answer'
                                                    ? 'bg-purple-100 text-purple-800'
                                                    : 'bg-red-100 text-red-800'
                                            }`}>
                                            {currentQuestion.question.question_type === 'multiple_choice' && 'Trắc nghiệm'}
                                            {currentQuestion.question.question_type === 'true_false' && 'Đúng/Sai'}
                                            {currentQuestion.question.question_type === 'short_answer' && 'Trả lời ngắn'}
                                            {currentQuestion.question.question_type === 'group_question' && 'Câu hỏi nhóm'}
                                        </span>
                                    </div>
                                    <span className="text-sm text-gray-500">
                                        Câu {currentQuestion.question_order}
                                    </span>
                                </div>
                            </div>

                            {/* Question Content */}
                            <div className="mb-8 rounded-lg p-4">
                                <div className="text-lg text-gray-900 leading-relaxed mb-6 font-sans">
                                    <MathRenderer content={currentQuestion.question.content} />
                                </div>

                                {/* Question Image */}
                                {currentQuestion.question.image && (
                                    <div className="mb-6">
                                        <img
                                            src={currentQuestion.question.image}
                                            alt={`Hình ảnh câu hỏi ${currentQuestion.question_order}`}
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
                                {currentQuestion.question.question_type === 'multiple_choice' && currentQuestion.question.options && (
                                    <div className="space-y-3">
                                        {Object.entries(currentQuestion.question.options).map(([option, text]) => (
                                            <label
                                                key={option}
                                                className={`flex items-start p-4 border-2 rounded-lg cursor-pointer transition-colors ${userAnswer?.selectedAnswer === option
                                                    ? 'border-green-500 bg-green-50'
                                                    : 'border-gray-200 hover:border-gray-300'
                                                    }`}
                                            >
                                                <input
                                                    type="radio"
                                                    name={`question-${currentQuestion.question_id}`}
                                                    value={option}
                                                    checked={userAnswer?.selectedAnswer === option}
                                                    onChange={() => handleAnswerSelect(option)}
                                                    className="mt-1 mr-3"
                                                />
                                                <div className="flex">
                                                    <span className="font-medium text-gray-900 mr-2">{option}.</span>
                                                    <span className="text-gray-700">
                                                        <MathRenderer content={text} />
                                                    </span>
                                                </div>
                                            </label>
                                        ))}
                                    </div>
                                )}

                                {currentQuestion.question.question_type === 'true_false' && (
                                    <div className="space-y-3">
                                        <label
                                            className={`flex items-start p-4 border-2 rounded-lg cursor-pointer transition-colors ${userAnswer?.selectedAnswer === true
                                                ? 'border-green-500 bg-green-50'
                                                : 'border-gray-200 hover:border-gray-300'
                                                }`}
                                        >
                                            <input
                                                type="radio"
                                                name={`question-${currentQuestion.question_id}`}
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
                                                name={`question-${currentQuestion.question_id}`}
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

                                {currentQuestion.question.question_type === 'short_answer' && (
                                    <div className="space-y-3">
                                        <div className="p-4 border-2 bg-gray-100 border-gray-200 rounded-lg">
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Nhập đáp án:
                                            </label>
                                            <input
                                                type="text"
                                                value={userAnswer?.selectedAnswer?.toString() || ''}
                                                onChange={(e) => handleAnswerSelect(e.target.value)}
                                                className="w-full text-black px-3 py-2 border font-bold bg-white border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                placeholder="Nhập đáp án của bạn..."
                                            />
                                        </div>
                                    </div>
                                )}

                                {currentQuestion.question.question_type === 'group_question' && currentQuestion.question.subQuestions && (
                                    <div className="space-y-6">
                                        {currentQuestion.question.subQuestions.map((subQuestion) => (
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
                                                            name={`sub-question-${currentQuestion.question_id}-${subQuestion.id}`}
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
                                                            name={`sub-question-${currentQuestion.question_id}-${subQuestion.id}`}
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
                                    disabled={currentQuestionIndex === currentExam.examQuestions.length - 1}
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
                                {currentExam.examQuestions.map((question, index) => {
                                    const status = getQuestionStatus(index);
                                    return (
                                        <button
                                            key={question.question_id}
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