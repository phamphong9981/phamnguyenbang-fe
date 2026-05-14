'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { Suspense, useState, useEffect } from 'react';
import axios from 'axios';
import Header from '@/components/Header';
import { useGenerateAiPractice, useSubmitAiPracticeMutation } from '@/hooks/useAiSelftPracice';
import { SubmitAIQuestionsResponseDto } from '@/hooks/interface/submit-ai-question';
import RichRenderer from '@/components/RichRenderer';

const AIGeneratingLoader = ({ kcTag }: { kcTag?: string }) => {
    const [step, setStep] = useState(0);
    const messages = [
        'Phân tích các câu em đã làm sai',
        'Tổng hợp các điểm yếu cần cải thiện',
        'Sinh đề bám sát lỗi của em',
        'Hoàn thiện 10 câu hỏi luyện tập'
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setStep(prev => (prev + 1) % messages.length);
        }, 1800);
        return () => clearInterval(interval);
    }, [messages.length]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/40 to-violet-50/30">
            <Header />
            <div className="max-w-2xl mx-auto px-4 py-20">
                <div className="bg-white rounded-xl border border-slate-200 p-10 shadow-sm overflow-hidden relative">
                    <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-500"></div>
                    <div className="flex items-center gap-3 mb-6 pt-1">
                        <div className="relative w-12 h-12">
                            <div className="absolute inset-0 border-2 border-violet-100 rounded-full"></div>
                            <div className="absolute inset-0 border-2 border-transparent border-t-violet-600 border-r-fuchsia-500 rounded-full animate-spin"></div>
                            <div className="absolute inset-0 flex items-center justify-center text-xl">🤖</div>
                        </div>
                        <div>
                            <div className="text-xs uppercase tracking-wider text-violet-700 font-bold">AI đang chuẩn bị đề luyện</div>
                            {kcTag && <div className="text-sm text-slate-500 font-mono">{kcTag}</div>}
                        </div>
                    </div>

                    <h2 className="text-xl font-semibold text-slate-900 mb-4">
                        Đang tạo bộ đề cá nhân hoá cho em
                    </h2>

                    <ul className="space-y-2.5">
                        {messages.map((msg, idx) => (
                            <li key={idx} className="flex items-center gap-3 text-sm">
                                <span className={`inline-block w-5 h-5 rounded-full border-2 flex-shrink-0 transition-all ${idx < step
                                    ? 'bg-emerald-500 border-emerald-500'
                                    : idx === step
                                        ? 'border-emerald-500 bg-white animate-pulse'
                                        : 'border-slate-300 bg-white'
                                    }`}>
                                    {idx < step && (
                                        <svg className="w-full h-full text-white p-0.5" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                    )}
                                </span>
                                <span className={idx === step ? 'text-slate-900 font-medium' : idx < step ? 'text-slate-500' : 'text-slate-400'}>
                                    {msg}
                                </span>
                            </li>
                        ))}
                    </ul>

                    <p className="mt-6 pt-6 border-t border-slate-100 text-xs text-slate-500 leading-relaxed">
                        Quá trình này có thể mất tới một phút. Bộ đề gồm <span className="font-semibold text-slate-700">5 câu nền tảng</span> bám sát các lỗi em đã mắc và <span className="font-semibold text-slate-700">5 câu nâng cao</span> để thử thách thêm.
                    </p>
                </div>
            </div>
        </div>
    );
};

const ErrorState = ({ title, message, kcTag }: { title: string; message: string; kcTag?: string }) => {
    const router = useRouter();
    return (
        <div className="min-h-screen bg-slate-50">
            <Header />
            <div className="max-w-2xl mx-auto px-4 py-20">
                <div className="bg-white rounded-xl border border-slate-200 p-10 text-center">
                    <h2 className="text-xl font-semibold text-slate-900 mb-2">{title}</h2>
                    {kcTag && (
                        <div className="text-xs font-mono text-slate-400 mb-3">{kcTag}</div>
                    )}
                    <p className="text-slate-600 mb-6 leading-relaxed">{message}</p>
                    <button
                        onClick={() => router.push('/ai-tu-luyen')}
                        className="inline-flex items-center justify-center px-5 py-2.5 rounded-md bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold transition-colors"
                    >
                        ← Chọn chủ đề khác
                    </button>
                </div>
            </div>
        </div>
    );
};

const LevelBadge = ({ level }: { level: number }) => {
    const isChallenge = level >= 6;
    return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold border ${isChallenge
            ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
            : 'bg-emerald-50 text-emerald-700 border-emerald-200'
            }`}>
            {isChallenge ? 'Nâng cao' : 'Nền tảng'}
            <span className="text-[10px] font-mono opacity-70">Lv {level}</span>
        </span>
    );
};

const PracticeContent = () => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const kcTag = searchParams.get('kc') || '';

    const { data, isLoading, error } = useGenerateAiPractice(kcTag);
    const submitMutation = useSubmitAiPracticeMutation();

    const questions = data?.questions;
    const kcDescription = data?.kc_description;
    const totalQuestions = questions?.length ?? 0;

    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState<Record<number, string>>({});
    const [isCompleted, setIsCompleted] = useState(false);
    const [selectedAnswer, setSelectedAnswer] = useState<string>('');
    const [submissionResult, setSubmissionResult] = useState<SubmitAIQuestionsResponseDto | null>(null);
    const [isReviewMode, setIsReviewMode] = useState(false);

    if (!kcTag) {
        return (
            <ErrorState
                title="Thiếu thông tin chủ đề"
                message="Vui lòng quay lại danh sách và chọn một chủ đề để bắt đầu luyện tập."
            />
        );
    }

    if (isLoading) {
        return <AIGeneratingLoader kcTag={kcTag} />;
    }

    if (error) {
        const is404 = axios.isAxiosError(error) && error.response?.status === 404;
        if (is404) {
            return (
                <ErrorState
                    kcTag={kcTag}
                    title="Chưa có dữ liệu lỗi cho chủ đề này"
                    message="Em chưa làm sai câu nào trong chủ đề này, nên AI chưa thể sinh đề luyện điểm yếu. Hãy hoàn thành thêm một đề kiểm tra hoặc chọn chủ đề khác mà em đã có câu sai."
                />
            );
        }
        const message = axios.isAxiosError(error)
            ? (typeof error.response?.data?.message === 'string' ? error.response.data.message : error.message)
            : error.message;
        return (
            <ErrorState
                kcTag={kcTag}
                title="Không tạo được đề luyện"
                message={message || 'Đã có lỗi xảy ra khi gọi AI. Vui lòng thử lại sau.'}
            />
        );
    }

    if (!questions || questions.length === 0) {
        return (
            <ErrorState
                kcTag={kcTag}
                title="Không có câu hỏi"
                message="AI chưa sinh được câu hỏi nào cho chủ đề này. Em hãy thử lại sau ít phút."
            />
        );
    }

    const currentQ = questions[currentQuestion];
    const choiceKeys = Object.keys(currentQ.choices).sort();
    const answeredCount = Object.keys(answers).length;
    const progress = (currentQuestion / totalQuestions) * 100;

    const handleAnswerSelect = (choice: string) => {
        setSelectedAnswer(choice);
        setAnswers(prev => ({ ...prev, [currentQuestion]: choice }));
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
        } catch (err) {
            console.error('Error submitting answers:', err);
        }
    };

    const handleNextQuestion = () => {
        if (currentQuestion < totalQuestions - 1) {
            setCurrentQuestion(prev => prev + 1);
            setSelectedAnswer(answers[currentQuestion + 1] || '');
        } else {
            handleSubmitAnswers();
        }
    };

    const handlePreviousQuestion = () => {
        if (currentQuestion > 0) {
            setCurrentQuestion(prev => prev - 1);
            setSelectedAnswer(answers[currentQuestion - 1] || '');
        }
    };

    const getChoiceClass = (choice: string) => {
        const isSelected = selectedAnswer === choice;

        if (isReviewMode && submissionResult) {
            const result = submissionResult.results[currentQuestion];
            const userAnswered = result.userAnswer.includes(choice);
            const isCorrectAnswer = result.correctAnswer === choice;

            if (isCorrectAnswer) {
                return 'bg-emerald-50 border-emerald-500 text-emerald-900';
            }
            if (userAnswered && !result.isCorrect) {
                return 'bg-rose-50 border-rose-500 text-rose-900';
            }
            return 'bg-white border-slate-200 text-slate-600';
        }

        if (isSelected) {
            return 'bg-emerald-50 border-emerald-500 text-emerald-900 ring-1 ring-emerald-500';
        }
        return 'bg-white border-slate-200 text-slate-800 hover:border-slate-400 hover:bg-slate-50';
    };

    const getChoiceIcon = (choice: string) => {
        if (!isReviewMode || !submissionResult) return null;
        const result = submissionResult.results[currentQuestion];
        const userAnswered = result.userAnswer.includes(choice);
        const isCorrectAnswer = result.correctAnswer === choice;
        if (isCorrectAnswer) {
            return (
                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-500 text-white text-sm flex-shrink-0">
                    ✓
                </span>
            );
        }
        if (userAnswered && !result.isCorrect) {
            return (
                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-rose-500 text-white text-sm flex-shrink-0">
                    ✕
                </span>
            );
        }
        return null;
    };

    if (isCompleted && submissionResult) {
        const correctAnswers = submissionResult.correctAnswers;
        const score = Math.round(submissionResult.percentage);
        const isPerfect = score === 100;
        const isGood = score >= 70;
        const isOkay = score >= 50;

        const headline = isPerfect ? 'Xuất sắc!' : isGood ? 'Tốt lắm!' : isOkay ? 'Khá ổn' : 'Cần cố gắng thêm';
        const subline = isPerfect
            ? 'Em đã nắm vững toàn bộ chủ đề này.'
            : isGood
                ? 'Em đã tiến bộ rõ rệt. Hãy luyện thêm để bứt phá.'
                : isOkay
                    ? 'Em đã nắm được phần nền. Tiếp tục luyện để vững hơn.'
                    : 'Đừng nản – hãy xem kỹ phần giải thích và luyện lại.';

        const headerGradient = isPerfect
            ? 'from-amber-400 via-orange-500 to-rose-500'
            : isGood
                ? 'from-emerald-500 via-teal-500 to-cyan-500'
                : isOkay
                    ? 'from-sky-500 via-indigo-500 to-violet-500'
                    : 'from-slate-500 via-slate-600 to-slate-700';
        const emoji = isPerfect ? '🏆' : isGood ? '🎉' : isOkay ? '👍' : '💪';

        return (
            <div className="min-h-screen bg-slate-50">
                <Header />
                <div className="max-w-4xl mx-auto px-4 py-8">
                    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
                        <div className={`relative bg-gradient-to-br ${headerGradient} p-8 text-white overflow-hidden`}>
                            <div className="absolute inset-0 opacity-20 pointer-events-none">
                                <div className="absolute -top-16 -right-16 w-64 h-64 bg-white rounded-full blur-3xl"></div>
                                <div className="absolute -bottom-20 -left-10 w-72 h-72 bg-white rounded-full blur-3xl"></div>
                            </div>
                            <div className="relative flex items-start justify-between gap-6 flex-wrap">
                                <div className="flex-1 min-w-[200px]">
                                    <div className="text-xs uppercase tracking-wider text-white/80 font-bold mb-1">Kết quả luyện tập</div>
                                    <h1 className="text-3xl sm:text-4xl font-bold flex items-center gap-3">
                                        <span className="text-4xl">{emoji}</span>
                                        {headline}
                                    </h1>
                                    <p className="mt-2 text-white/90 leading-relaxed">{subline}</p>
                                </div>
                                <div className="bg-white/15 backdrop-blur-md border border-white/30 rounded-xl px-6 py-4 text-center">
                                    <div className="text-4xl font-bold tabular-nums">{score}%</div>
                                    <div className="text-xs font-medium mt-1 text-white/85">{correctAnswers}/{totalQuestions} câu đúng</div>
                                </div>
                            </div>
                        </div>

                        <div className="px-8 py-6 grid grid-cols-3 gap-3 border-b border-slate-100">
                            <div className="text-center p-3 rounded-lg bg-emerald-50 border border-emerald-200">
                                <div className="text-3xl font-bold text-emerald-700">{correctAnswers}</div>
                                <div className="text-xs text-emerald-700/80 mt-1 font-medium">Câu đúng</div>
                            </div>
                            <div className="text-center p-3 rounded-lg bg-rose-50 border border-rose-200">
                                <div className="text-3xl font-bold text-rose-700">{totalQuestions - correctAnswers}</div>
                                <div className="text-xs text-rose-700/80 mt-1 font-medium">Câu sai</div>
                            </div>
                            <div className="text-center p-3 rounded-lg bg-violet-50 border border-violet-200">
                                <div className="text-3xl font-bold text-violet-700">{totalQuestions}</div>
                                <div className="text-xs text-violet-700/80 mt-1 font-medium">Tổng số câu</div>
                            </div>
                        </div>

                        <div className="p-8">
                            <h3 className="text-base font-semibold text-slate-900 mb-4">Xem lại từng câu</h3>
                            <div className="space-y-2.5">
                                {submissionResult.results.map((result, idx) => {
                                    const q = questions[idx];
                                    const correctContent = q.choices[result.correctAnswer];
                                    const userLetter = result.userAnswer[0];
                                    const userContent = userLetter ? q.choices[userLetter] : null;
                                    return (
                                        <div
                                            key={idx}
                                            role="button"
                                            tabIndex={0}
                                            onClick={() => {
                                                setIsCompleted(false);
                                                setIsReviewMode(true);
                                                setCurrentQuestion(idx);
                                                setSelectedAnswer(answers[idx] || '');
                                            }}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter' || e.key === ' ') {
                                                    e.preventDefault();
                                                    setIsCompleted(false);
                                                    setIsReviewMode(true);
                                                    setCurrentQuestion(idx);
                                                    setSelectedAnswer(answers[idx] || '');
                                                }
                                            }}
                                            className={`w-full text-left p-3.5 rounded-lg border transition-all hover:shadow-sm cursor-pointer ${result.isCorrect
                                                ? 'bg-emerald-50/50 border-emerald-200 hover:border-emerald-400'
                                                : 'bg-rose-50/50 border-rose-200 hover:border-rose-400'
                                                }`}
                                        >
                                            <div className="flex items-start gap-3">
                                                <span className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-white text-sm font-semibold flex-shrink-0 mt-0.5 ${result.isCorrect ? 'bg-emerald-500' : 'bg-rose-500'
                                                    }`}>
                                                    {result.isCorrect ? '✓' : '✕'}
                                                </span>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                                                        <span className="text-sm font-semibold text-slate-900">Câu {idx + 1}</span>
                                                        <LevelBadge level={q.level} />
                                                    </div>
                                                    <div className="text-sm text-slate-800 mb-2 line-clamp-2">
                                                        <RichRenderer content={q.question} />
                                                    </div>
                                                    <div className="space-y-1 text-xs">
                                                        <div className="flex items-start gap-1.5">
                                                            <span className="text-slate-500 flex-shrink-0 font-medium pt-0.5">Đáp án đúng:</span>
                                                            <span className="inline-flex items-center justify-center w-5 h-5 rounded bg-emerald-500 text-white font-bold text-[11px] flex-shrink-0">
                                                                {result.correctAnswer}
                                                            </span>
                                                            <div className="text-slate-700 flex-1 min-w-0">
                                                                <RichRenderer content={correctContent} />
                                                            </div>
                                                        </div>
                                                        {userContent && (
                                                            <div className="flex items-start gap-1.5">
                                                                <span className="text-slate-500 flex-shrink-0 font-medium pt-0.5">Em chọn:</span>
                                                                <span className={`inline-flex items-center justify-center w-5 h-5 rounded font-bold text-[11px] flex-shrink-0 text-white ${result.isCorrect ? 'bg-emerald-500' : 'bg-rose-500'}`}>
                                                                    {userLetter}
                                                                </span>
                                                                <div className={`flex-1 min-w-0 ${result.isCorrect ? 'text-slate-700' : 'text-rose-700'}`}>
                                                                    <RichRenderer content={userContent} />
                                                                </div>
                                                            </div>
                                                        )}
                                                        {!userContent && (
                                                            <div className="text-slate-400 italic">Chưa trả lời</div>
                                                        )}
                                                    </div>
                                                </div>
                                                <span className="text-xs text-slate-400 font-medium flex-shrink-0 mt-0.5">Xem chi tiết →</span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            <div className="mt-8 flex gap-3">
                                <button
                                    onClick={() => router.push('/ai-tu-luyen')}
                                    className="flex-1 px-5 py-3 rounded-md border-2 border-slate-300 text-slate-700 font-semibold hover:bg-slate-50 hover:border-slate-400 transition-all"
                                >
                                    📚 Chọn chủ đề khác
                                </button>
                                <button
                                    onClick={() => window.location.reload()}
                                    className="flex-1 px-5 py-3 rounded-md bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600 hover:from-indigo-700 hover:via-violet-700 hover:to-fuchsia-700 text-white font-semibold transition-all shadow-md hover:shadow-lg"
                                >
                                    ✨ Luyện thêm 10 câu
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const isSubmitting = submitMutation.isPending;
    const isLastQuestion = currentQuestion === totalQuestions - 1;
    const hasAnswer = !!selectedAnswer || !!answers[currentQuestion];

    return (
        <div className="min-h-screen bg-slate-50">
            <Header />

            <div className="max-w-4xl mx-auto px-4 py-6">
                <div className="relative bg-white rounded-xl border border-slate-200 p-5 mb-4 overflow-hidden shadow-sm">
                    <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-500"></div>
                    <div className="flex items-start justify-between gap-4 mb-4 pt-1">
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1.5">
                                <span className="text-[11px] font-mono text-violet-500 bg-violet-50 px-1.5 py-0.5 rounded tracking-wider font-semibold">{kcTag}</span>
                                {isReviewMode && (
                                    <span className="text-[11px] px-2 py-0.5 rounded bg-sky-50 text-sky-700 border border-sky-200 font-semibold">
                                        Đang xem lại
                                    </span>
                                )}
                            </div>
                            <div className="text-lg font-semibold text-slate-900 leading-snug">
                                {kcDescription ? (
                                    <RichRenderer content={kcDescription} />
                                ) : (
                                    'Đề luyện điểm yếu'
                                )}
                            </div>
                            <p className="text-sm text-slate-500 mt-0.5">
                                Câu {currentQuestion + 1} / {totalQuestions}
                                {!isReviewMode && answeredCount > 0 && (
                                    <> · Đã trả lời <span className="font-semibold text-emerald-700">{answeredCount}</span></>
                                )}
                            </p>
                        </div>
                        {isReviewMode ? (
                            <button
                                onClick={() => {
                                    setIsReviewMode(false);
                                    setIsCompleted(true);
                                }}
                                className="text-sm text-emerald-700 hover:text-emerald-800 font-semibold whitespace-nowrap"
                            >
                                ← Quay lại kết quả
                            </button>
                        ) : (
                            <button
                                onClick={() => {
                                    if (window.confirm('Em chắc chắn muốn thoát? Tiến độ chưa nộp sẽ bị mất.')) {
                                        router.push('/ai-tu-luyen');
                                    }
                                }}
                                className="text-sm text-slate-500 hover:text-slate-700 whitespace-nowrap"
                            >
                                Thoát
                            </button>
                        )}
                    </div>

                    <div className="relative h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div
                            className="absolute inset-y-0 left-0 bg-gradient-to-r from-emerald-400 via-emerald-500 to-teal-500 transition-all duration-500 ease-out"
                            style={{ width: `${isReviewMode ? 100 : progress}%` }}
                        ></div>
                    </div>

                    <div className="mt-3 grid grid-cols-10 gap-1.5">
                        {questions.map((_, idx) => {
                            let cls = 'bg-slate-200 text-slate-500 hover:bg-slate-300';
                            if (isReviewMode && submissionResult) {
                                const result = submissionResult.results[idx];
                                cls = result.isCorrect ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white';
                                if (idx === currentQuestion) {
                                    cls += ' ring-2 ring-offset-1 ' + (result.isCorrect ? 'ring-emerald-600' : 'ring-rose-600');
                                }
                            } else {
                                if (idx === currentQuestion) {
                                    cls = 'bg-slate-900 text-white';
                                } else if (answers[idx]) {
                                    cls = 'bg-emerald-100 text-emerald-700 border border-emerald-300';
                                }
                            }
                            return (
                                <button
                                    key={idx}
                                    onClick={() => {
                                        setCurrentQuestion(idx);
                                        setSelectedAnswer(answers[idx] || '');
                                    }}
                                    className={`h-8 rounded text-xs font-semibold transition-all ${cls}`}
                                >
                                    {idx + 1}
                                </button>
                            );
                        })}
                    </div>
                </div>

                <div className="bg-white rounded-xl border border-slate-200 overflow-hidden mb-4 shadow-sm">
                    <div className={`px-6 py-5 border-b border-slate-100 ${currentQ.level >= 6 ? 'bg-gradient-to-r from-indigo-50 via-violet-50 to-fuchsia-50' : 'bg-gradient-to-r from-emerald-50 via-teal-50 to-cyan-50'}`}>
                        <div className="flex items-center justify-between gap-3 flex-wrap">
                            <div className="flex items-center gap-3">
                                <span className={`inline-flex items-center justify-center w-10 h-10 rounded-full font-bold text-sm shadow-md ${currentQ.level >= 6 ? 'bg-gradient-to-br from-indigo-500 to-violet-600 text-white' : 'bg-gradient-to-br from-emerald-500 to-teal-600 text-white'}`}>
                                    {currentQuestion + 1}
                                </span>
                                <span className="text-xs uppercase tracking-wider text-slate-600 font-bold">Câu hỏi</span>
                            </div>
                            <LevelBadge level={currentQ.level} />
                        </div>
                    </div>

                    <div className="px-6 py-6">
                        <RichRenderer
                            content={currentQ.question}
                            className="text-base sm:text-lg text-slate-900 leading-relaxed font-medium"
                        />
                    </div>

                    <div className="px-6 pb-6 space-y-2.5">
                        {choiceKeys.map((choice) => {
                            const handleClick = () => !isReviewMode && handleAnswerSelect(choice);
                            return (
                                <div
                                    key={choice}
                                    role="button"
                                    tabIndex={isReviewMode ? -1 : 0}
                                    aria-disabled={isReviewMode}
                                    onClick={handleClick}
                                    onKeyDown={(e) => {
                                        if (!isReviewMode && (e.key === 'Enter' || e.key === ' ')) {
                                            e.preventDefault();
                                            handleClick();
                                        }
                                    }}
                                    className={`w-full p-4 rounded-lg border text-left transition-all ${!isReviewMode ? 'cursor-pointer' : 'cursor-default'} ${getChoiceClass(choice)}`}
                                >
                                    <div className="flex items-start gap-4">
                                        <span className={`flex-shrink-0 inline-flex items-center justify-center w-8 h-8 rounded-md font-bold text-sm border mt-0.5 ${selectedAnswer === choice && !isReviewMode
                                            ? 'bg-emerald-600 text-white border-emerald-600'
                                            : isReviewMode && submissionResult?.results[currentQuestion].correctAnswer === choice
                                                ? 'bg-emerald-600 text-white border-emerald-600'
                                                : 'bg-white border-slate-300 text-slate-700'
                                            }`}>
                                            {choice}
                                        </span>
                                        <div className="flex-1 min-w-0 text-sm sm:text-base">
                                            <RichRenderer content={currentQ.choices[choice]} />
                                        </div>
                                        {getChoiceIcon(choice)}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {isReviewMode && submissionResult && submissionResult.results[currentQuestion].explanation && (
                        <div className="mx-6 mb-6 p-5 bg-indigo-50/60 rounded-lg border border-indigo-200">
                            <div className="flex items-start gap-3">
                                <div className="w-7 h-7 rounded-full bg-indigo-600 text-white flex items-center justify-center flex-shrink-0 text-sm font-bold">
                                    i
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-semibold text-indigo-900 mb-2 text-sm">Giải thích</h4>
                                    <RichRenderer
                                        content={submissionResult.results[currentQuestion].explanation!}
                                        className="text-sm text-indigo-900/90 leading-relaxed"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="px-6 py-4 bg-slate-50/60 border-t border-slate-100">
                        {isReviewMode ? (
                            <div className="flex items-center justify-between gap-3">
                                <button
                                    onClick={handlePreviousQuestion}
                                    disabled={currentQuestion === 0}
                                    className="px-4 py-2 rounded-md text-sm font-semibold border border-slate-300 text-slate-700 hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed"
                                >
                                    ← Câu trước
                                </button>
                                <button
                                    onClick={() => setCurrentQuestion(prev => Math.min(prev + 1, totalQuestions - 1))}
                                    disabled={currentQuestion === totalQuestions - 1}
                                    className="px-4 py-2 rounded-md text-sm font-semibold border border-slate-300 text-slate-700 hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed"
                                >
                                    Câu sau →
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center justify-between gap-3">
                                <button
                                    onClick={handlePreviousQuestion}
                                    disabled={currentQuestion === 0}
                                    className="px-4 py-2 rounded-md text-sm font-semibold border border-slate-300 text-slate-700 hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed"
                                >
                                    ← Câu trước
                                </button>
                                <button
                                    onClick={handleNextQuestion}
                                    disabled={!hasAnswer || isSubmitting}
                                    className={`px-6 py-2.5 rounded-md text-sm font-bold transition-all text-white disabled:opacity-40 disabled:cursor-not-allowed inline-flex items-center gap-2 shadow-md hover:shadow-lg ${isLastQuestion
                                        ? 'bg-gradient-to-r from-fuchsia-600 to-rose-600 hover:from-fuchsia-700 hover:to-rose-700'
                                        : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700'
                                        }`}
                                >
                                    {isSubmitting && isLastQuestion ? (
                                        <>
                                            <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"></span>
                                            Đang chấm điểm…
                                        </>
                                    ) : isLastQuestion ? (
                                        <>Nộp bài & xem kết quả</>
                                    ) : (
                                        <>Câu tiếp theo →</>
                                    )}
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {!isReviewMode && (
                    <p className="text-xs text-slate-500 text-center">
                        Mẹo: 5 câu đầu (Lv 1–5) là <span className="font-semibold text-emerald-700">nền tảng</span> bám sát lỗi cũ của em, 5 câu sau (Lv 6–10) là <span className="font-semibold text-indigo-700">nâng cao</span>.
                    </p>
                )}
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
