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
import TSAExamPlayer from '@/components/exam/TSAExamPlayer';
import ExamAlertModal from '@/components/exam/ExamAlertModal';

interface UserAnswer {
    questionId: string;
    selectedAnswer: string[]; // Array to support multiple answers
    subAnswers?: { [key: string]: string[] }; // For group questions - also array
    isMarked?: boolean;
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
    const [examPassword, setExamPassword] = useState<string>('');
    const [passwordInput, setPasswordInput] = useState<string>('');
    const [passwordErrorText, setPasswordErrorText] = useState<string>('');
    const [examResult, setExamResult] = useState<ExamResultDto | null>(null);
    const finishExamRef = useRef<(() => void) | null>(null);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

    // Anti-cheat mechanisms
    const [warnings, setWarnings] = useState(0);
    const MAX_WARNINGS = 2;
    const isExamFinishedRef = useRef(false);

    // Pagination state for Default View
    const [currentPage, setCurrentPage] = useState(1);
    const QUESTIONS_PER_PAGE = 10;
    const [targetScrollQuestionId, setTargetScrollQuestionId] = useState<string | null>(null);

    // Modal state
    const [alertConfig, setAlertConfig] = useState<{
        isOpen: boolean;
        title: string;
        message: string | React.ReactNode;
        type: 'warning' | 'error' | 'info';
        onConfirm?: () => void;
        hideCloseButton?: boolean;
    }>({
        isOpen: false,
        title: '',
        message: '',
        type: 'info'
    });

    const closeAlert = () => {
        setAlertConfig(prev => ({ ...prev, isOpen: false }));
    };

    const showAlert = useCallback((title: string, message: string | React.ReactNode, type: 'warning' | 'error' | 'info' = 'info', onConfirm?: () => void, hideCloseButton = false) => {
        setAlertConfig({
            isOpen: true,
            title,
            message,
            type,
            onConfirm,
            hideCloseButton
        });
    }, []);

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
        const passwordFromQuery = searchParams.get('password') || '';
        setExamId(id);
        if (typeof window !== 'undefined' && id) {
            const savedPassword = sessionStorage.getItem(`exam-password:${id}`) || '';
            const passwordToUse = passwordFromQuery || savedPassword;
            setExamPassword(passwordToUse);
            setPasswordInput(passwordToUse);
            if (passwordFromQuery) {
                sessionStorage.setItem(`exam-password:${id}`, passwordFromQuery);
            }
        }
        console.log('🚀 Exam ID:', id);
    }, [searchParams]);

    // Fetch exam data from API
    const { data: currentExam, isLoading: examLoading, error: examError } = useExamSet(examId, examPassword);

    const getApiErrorStatus = (error: unknown): number | undefined => {
        return (error as any)?.response?.status;
    };

    const getApiErrorMessage = (error: unknown): string => {
        const message = (error as any)?.response?.data?.message;
        if (typeof message === 'string') return message;
        return '';
    };

    const isExamPasswordError = (error: unknown): boolean => {
        const status = getApiErrorStatus(error);
        const message = getApiErrorMessage(error).toLowerCase();
        if (status === 403) return true;
        if (status !== 401) return false;
        return message.includes('password');
    };

    // Initialize user answers when exam changes
    useEffect(() => {
        if (currentExam) {
            const initialAnswers = currentExam.examQuestions.map(q => ({
                questionId: q.question_id,
                selectedAnswer: [] as string[],
                isMarked: false
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

    // Anti-cheat mechanism
    useEffect(() => {
        if (!isExamStarted || isExamFinished || !currentExam) return;

        const handleViolation = (reason: string) => {
            if (isExamFinishedRef.current) return;

            setWarnings(prev => {
                const newWarnings = prev + 1;
                if (newWarnings > MAX_WARNINGS) {
                    if (finishExamRef.current) finishExamRef.current();
                    showAlert(
                        'Vi phạm quy chế thi nghiêm trọng',
                        `Bạn đã vi phạm quy chế thi (${reason}) quá số lần quy định. Bài thi đã tự động nộp.`,
                        'error',
                        () => {
                            closeAlert();
                        },
                        true // Hide close button
                    );
                } else {
                    showAlert(
                        `CẢNH BÁO VI PHẠM (${newWarnings}/${MAX_WARNINGS})`,
                        `Bạn vừa ${reason}. Màn hình phải luôn giữ ở chế độ chờ và toàn màn hình.\n\nBài thi sẽ bị nộp tự động nếu vi phạm quá ${MAX_WARNINGS} lần.`,
                        'warning',
                        () => {
                            closeAlert();
                            try {
                                if (!document.fullscreenElement) {
                                    document.documentElement.requestFullscreen().catch(e => console.log(e));
                                }
                            } catch (e) {
                                console.error(e);
                            }
                        }
                    );
                }
                return newWarnings;
            });
        };

        const handleVisibilityChange = () => {
            if (document.hidden) {
                handleViolation("chuyển tab/ẩn trình duyệt");
            }
        };

        const handleFullscreenChange = () => {
            if (!document.fullscreenElement) {
                handleViolation("thoát toàn màn hình");
            }
        };

        const handleContextMenu = (e: MouseEvent) => {
            e.preventDefault();
        };

        const handleKeyDown = (e: KeyboardEvent) => {
            if (
                e.key === 'F12' ||
                (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J' || e.key === 'C')) ||
                (e.ctrlKey && e.key === 'u')
            ) {
                e.preventDefault();
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);
        document.addEventListener('fullscreenchange', handleFullscreenChange);
        document.addEventListener('contextmenu', handleContextMenu);
        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            document.removeEventListener('fullscreenchange', handleFullscreenChange);
            document.removeEventListener('contextmenu', handleContextMenu);
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [isExamStarted, isExamFinished, currentExam]);

    // Scroll to specific question after render/page switch
    useEffect(() => {
        if (targetScrollQuestionId) {
            // Include a small timeout to allow for rendering
            const timeoutId = setTimeout(() => {
                const element = document.getElementById(targetScrollQuestionId);
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    // Highlight effect could be added here
                }
                setTargetScrollQuestionId(null);
            }, 100);
            return () => clearTimeout(timeoutId);
        }
    }, [targetScrollQuestionId, currentPage]);

    const formatTime = (seconds: number) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    // Hook để submit bài thi
    const submitExamMutation = useSubmitExam();

    const finishExam = useCallback(async () => {
        if (isExamFinishedRef.current) return;
        setIsExamFinished(true);
        isExamFinishedRef.current = true;

        try {
            if (document.fullscreenElement) {
                await document.exitFullscreen();
            }
        } catch (err) {
            console.error("Error attempting to exit fullscreen:", err);
        }

        try {
            const flattenLeafSubQuestions = (
                subQuestions: any[] = [],
                prefix: string = ''
            ): Array<{ pathKey: string; leafId: string }> => {
                const results: Array<{ pathKey: string; leafId: string }> = [];

                for (const sq of subQuestions) {
                    const sqId = sq?.id;
                    if (!sqId) continue;

                    const nextPrefix = prefix ? `${prefix}_${sqId}` : `${sqId}`;
                    const sqType = sq?.question_type || sq?.questionType;
                    const hasChildren = Array.isArray(sq?.subQuestions) && sq.subQuestions.length > 0;

                    if (sqType === 'group_question' && hasChildren) {
                        results.push(...flattenLeafSubQuestions(sq.subQuestions, nextPrefix));
                    } else {
                        results.push({ pathKey: nextPrefix, leafId: sqId });
                    }
                }

                return results;
            };

            // Chuẩn bị dữ liệu để submit
            const answers = userAnswers.flatMap(answer => {
                const question = currentExam?.examQuestions.find(q => q.question_id === answer.questionId)?.question;

                if (question?.question_type === 'group_question') {
                    // For nested group questions
                    const leaves = flattenLeafSubQuestions(question.subQuestions || [], answer.questionId);
                    return leaves.map(({ pathKey }) => {
                        const picked = answer.subAnswers?.[pathKey];
                        return {
                            questionId: pathKey,
                            selectedAnswer: Array.isArray(picked) ? picked : []
                        };
                    });
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
            showAlert(
                'Lỗi nộp bài',
                'Có lỗi xảy ra khi nộp bài. Vui lòng thử lại!',
                'error',
                () => {
                    closeAlert();
                    setShowResults(true);
                },
                false
            );
        }
    }, [examId, userAnswers, currentExam, timeLeft, submitExamMutation, showAlert]);

    // Store the finishExam function in the ref
    useEffect(() => {
        finishExamRef.current = finishExam;
    }, [finishExam]);

    const startExam = async () => {
        try {
            if (!document.fullscreenElement) {
                await document.documentElement.requestFullscreen();
            }
        } catch (err) {
            console.error('Lỗi khi vào chế độ toàn màn hình:', err);
        }
        setIsExamStarted(true);
    };

    // Create handlers that are bound to specific question IDs
    const createHandleAnswerSelect = (questionId: string) =>
        (answer: string | string[], questionType: string, isMultiple: boolean) => {
            setUserAnswers(prev =>
                prev.map(ans => {
                    if (ans.questionId === questionId) {
                        // If answer is an array (e.g., from DragDropCloze), replace the entire selection
                        if (Array.isArray(answer)) {
                            return { ...ans, selectedAnswer: answer };
                        }

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
        (subQuestionId: string, answer: string | string[], questionType: string, isMultiple: boolean) => {
            setUserAnswers(prev =>
                prev.map(ans => {
                    if (ans.questionId === questionId) {
                        const currentSubAnswers = ans.subAnswers || {};

                        // If answer is an array, replace directly for that subQuestionId
                        if (Array.isArray(answer)) {
                            return {
                                ...ans,
                                subAnswers: {
                                    ...currentSubAnswers,
                                    [subQuestionId]: answer
                                }
                            };
                        }

                        const answerStr = answer.toString();
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

    const handleMarkQuestion = (questionId: string) => {
        setUserAnswers(prev => prev.map(ans =>
            ans.questionId === questionId ? { ...ans, isMarked: !ans.isMarked } : ans
        ));
    };

    const getQuestionMarkedStatus = (questionIndex: number) => {
        if (!currentExam) return false;
        const question = currentExam.examQuestions[questionIndex];
        const userAnswer = userAnswers.find(ans => ans.questionId === question.question_id);
        return userAnswer?.isMarked || false;
    };

    const getQuestionStatus = (questionIndex: number) => {
        if (!currentExam) return 'unanswered';

        const question = currentExam.examQuestions[questionIndex];
        const userAnswer = userAnswers.find(ans => ans.questionId === question.question_id);
        if (question.question.question_type === 'group_question') {
            if (userAnswer?.subAnswers) {
                const allAnswered = question.question.subQuestions?.every(subQ => {
                    const subAnswerId = Object.keys(userAnswer.subAnswers || {}).find(key => key.includes(subQ.id));
                    const subAnswer = subAnswerId ? userAnswer.subAnswers?.[subAnswerId] : undefined;
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
                if (question.question.question_type === 'drag_drop_cloze') {
                    return userAnswer.selectedAnswer.some(a => a && a.trim() !== '') ? 'answered' : 'unanswered';
                }
                return 'answered';
            }
            return 'unanswered';
        }
    };

    const calculateScore = () => {
        // ... (score calculation logic remains the same)
        if (!currentExam) return { correct: 0, total: 0, percentage: 0 };
        // Simplified for this editing block, assuming logic is unchanged
        // In real replacement, you'd keep the full function body

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
                        } else if (question.question_type === 'drag_drop_cloze') {
                            // For Drag & Drop, order matters and exact match
                            const userAnswerStrs = userAnswerArray;
                            const correctAnswerStrs = correctAnswerArray.map(a => a.toString());

                            if (userAnswerStrs.length === correctAnswerStrs.length &&
                                userAnswerStrs.every((val, idx) => val === correctAnswerStrs[idx])) {
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

    // Check if it's a TSA exam to use the new player
    const isTSA = currentExam?.type === ExamSetType.TSA;

    // Check if should use split view: Only for TSA with LITERATURE or SCIENCE subjects
    const shouldUseSplitView = currentExam?.type === ExamSetType.TSA &&
        (currentExam.subject === SUBJECT_ID.LITERATURE || currentExam.subject === SUBJECT_ID.SCIENCE);

    // Navigation handlers
    const handlePrevQuestion = () => {
        if (!currentExam) return;

        if (isTSA || shouldUseSplitView) {
            if (currentQuestionIndex > 0) {
                setCurrentQuestionIndex(currentQuestionIndex - 1);
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        } else {
            if (currentPage > 1) {
                setCurrentPage(currentPage - 1);
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        }
    };

    const handleNextQuestion = () => {
        if (!currentExam) return;

        if (isTSA || shouldUseSplitView) {
            if (currentQuestionIndex < currentExam.examQuestions.length - 1) {
                setCurrentQuestionIndex(currentQuestionIndex + 1);
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        } else {
            const totalPages = Math.ceil(currentExam.examQuestions.length / QUESTIONS_PER_PAGE);
            if (currentPage < totalPages) {
                setCurrentPage(currentPage + 1);
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        }
    };

    const handleNavigatorSelect = (index: number) => {
        if (isTSA || shouldUseSplitView) {
            setCurrentQuestionIndex(index);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
            const targetPage = Math.floor(index / QUESTIONS_PER_PAGE) + 1;
            if (targetPage !== currentPage) {
                setCurrentPage(targetPage);
            }
            // Trigger scroll after page update
            setTargetScrollQuestionId(`question-${index}`);
        }
    };

    // ... (Loading/Error states remain mostly the same, simplified for brevity in this tool call)
    if (!isClient) return <ExamPageLoading />;
    if (examLoading) return <ExamPageLoading />;
    if (examError && isExamPasswordError(examError)) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
                <div className="w-full max-w-md bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                    <div className="text-center mb-6">
                        <div className="text-4xl mb-2">🔒</div>
                        <h1 className="text-xl font-bold text-gray-900">Đề thi có mật khẩu</h1>
                        <p className="text-sm text-gray-600 mt-2">
                            Vui lòng nhập mật khẩu để truy cập đề thi này.
                        </p>
                    </div>

                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            const trimmedPassword = passwordInput.trim();
                            if (!trimmedPassword) {
                                setPasswordErrorText('Vui lòng nhập mật khẩu.');
                                return;
                            }
                            setPasswordErrorText('');
                            setExamPassword(trimmedPassword);
                            if (typeof window !== 'undefined' && examId) {
                                sessionStorage.setItem(`exam-password:${examId}`, trimmedPassword);
                            }
                        }}
                        className="space-y-4"
                    >
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Mật khẩu đề thi</label>
                            <input
                                type="password"
                                value={passwordInput}
                                onChange={(e) => setPasswordInput(e.target.value)}
                                placeholder="Nhập mật khẩu"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                autoFocus
                            />
                        </div>

                        {(passwordErrorText || getApiErrorMessage(examError)) && (
                            <p className="text-sm text-red-600">
                                {passwordErrorText || getApiErrorMessage(examError)}
                            </p>
                        )}

                        <div className="flex gap-3">
                            <button
                                type="button"
                                onClick={() => router.push('/thi-hsa-tsa')}
                                className="flex-1 px-4 py-2.5 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                            >
                                Quay lại
                            </button>
                            <button
                                type="submit"
                                className="flex-1 px-4 py-2.5 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors"
                            >
                                Xác nhận
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        );
    }
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
                examName={currentExam!.name}
                duration={currentExam!.duration}
                totalQuestions={currentExam!.examQuestions.length}
                examType={currentExam!.type}
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


    // --- Render Logic ---

    // Calculate pagination for default view
    const startIndex = (currentPage - 1) * QUESTIONS_PER_PAGE;
    const currentQuestionsPage = currentExam.examQuestions.slice(startIndex, startIndex + QUESTIONS_PER_PAGE);
    const totalPages = Math.ceil(currentExam.examQuestions.length / QUESTIONS_PER_PAGE);

    // Split view current question
    const splitViewQuestion = currentExam.examQuestions[currentQuestionIndex];

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Sticky Header */}
            <div className="sticky top-0 z-40 bg-white shadow-md border-b border-gray-200">
                <ExamHeader
                    examName={currentExam.name}
                    totalQuestions={currentExam.examQuestions.length}
                    timeLeft={timeLeft}
                    formatTime={formatTime}
                    onFinishExam={finishExam}
                />
            </div>

            {/* Main Content Area */}
            <div className="flex-1 max-w-[1920px] mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
                <ExamAlertModal
                    isOpen={alertConfig.isOpen}
                    title={alertConfig.title}
                    message={alertConfig.message}
                    type={alertConfig.type}
                    onClose={alertConfig.hideCloseButton ? undefined : closeAlert}
                    onConfirm={alertConfig.onConfirm}
                    hideCloseButton={alertConfig.hideCloseButton}
                    confirmText="Đã hiểu"
                    closeText="Quay lại"
                />
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                    {/* Left Column: Questions */}
                    <div className="lg:col-span-9 order-2 lg:order-1">
                        {isTSA ? (
                            <TSAExamPlayer
                                questions={currentExam.examQuestions}
                                currentIndex={currentQuestionIndex}
                                userAnswers={userAnswers}
                                onAnswerSelect={createHandleAnswerSelect}
                                onSubAnswerSelect={createHandleSubAnswerSelect}
                                onMarkQuestion={handleMarkQuestion}
                                onNext={handleNextQuestion}
                                onPrev={handlePrevQuestion}
                                isImageAnswer={isImageAnswer}
                            />
                        ) : shouldUseSplitView ? (
                            // --- SPLIT VIEW MODE (Single Question) ---
                            <div className="space-y-6">

                                {splitViewQuestion.question.question_type === 'group_question' ? (
                                    <GroupQuestionSplitView
                                        key={splitViewQuestion.question_id}
                                        question={splitViewQuestion.question}
                                        questionNumber={currentQuestionIndex + 1}
                                        questionId={splitViewQuestion.question_id}
                                        subAnswers={userAnswers.find(a => a.questionId === splitViewQuestion.question_id)?.subAnswers}
                                        onSubAnswerSelect={createHandleSubAnswerSelect(splitViewQuestion.question_id)}
                                        isImageAnswer={isImageAnswer}
                                        isMarked={userAnswers.find(a => a.questionId === splitViewQuestion.question_id)?.isMarked}
                                        onMarkQuestion={() => handleMarkQuestion(splitViewQuestion.question_id)}
                                    />
                                ) : (
                                    <QuestionCard
                                        key={splitViewQuestion.question_id}
                                        question={splitViewQuestion.question}
                                        questionNumber={currentQuestionIndex + 1}
                                        questionId={splitViewQuestion.question_id}
                                        selectedAnswer={userAnswers.find(a => a.questionId === splitViewQuestion.question_id)?.selectedAnswer || []}
                                        subAnswers={userAnswers.find(a => a.questionId === splitViewQuestion.question_id)?.subAnswers}
                                        onAnswerSelect={createHandleAnswerSelect(splitViewQuestion.question_id)}
                                        onSubAnswerSelect={createHandleSubAnswerSelect(splitViewQuestion.question_id)}
                                        isImageAnswer={isImageAnswer}
                                        isMarked={userAnswers.find(a => a.questionId === splitViewQuestion.question_id)?.isMarked}
                                        onMarkQuestion={() => handleMarkQuestion(splitViewQuestion.question_id)}
                                    />
                                )}

                                {/* Split View Navigation */}
                                <div className="flex items-center justify-between bg-white p-4 rounded-xl shadow-sm border border-gray-200">
                                    <button
                                        onClick={handlePrevQuestion}
                                        disabled={currentQuestionIndex === 0}
                                        className="px-6 py-2.5 rounded-lg font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50 transition-colors"
                                    >
                                        ← Câu trước
                                    </button>
                                    <span className="font-semibold text-gray-700">
                                        {currentQuestionIndex + 1} / {currentExam.examQuestions.length}
                                    </span>
                                    <button
                                        onClick={handleNextQuestion}
                                        disabled={currentQuestionIndex === currentExam.examQuestions.length - 1}
                                        className="px-6 py-2.5 rounded-lg font-medium bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 transition-colors"
                                    >
                                        Câu tiếp →
                                    </button>
                                </div>
                            </div>
                        ) : (
                            // --- DEFAULT PAGINATED VIEW (Multiple Questions) ---
                            <div className="space-y-8">
                                <div className="bg-white px-6 py-4 rounded-xl shadow-sm border border-gray-200 flex justify-between items-center mb-6">
                                    <h2 className="text-lg font-bold text-gray-800">
                                        Trang {currentPage} / {totalPages}
                                    </h2>
                                    <div className="text-sm text-gray-500">
                                        Hiển thị câu {startIndex + 1} - {Math.min(startIndex + QUESTIONS_PER_PAGE, currentExam.examQuestions.length)}
                                    </div>
                                </div>

                                {currentQuestionsPage.map((examQuestion, index) => {
                                    const actualIndex = startIndex + index;
                                    const userAnswer = userAnswers.find(ans => ans.questionId === examQuestion.question_id);

                                    return (
                                        <div key={examQuestion.question_id} id={`question-${actualIndex}`} className="scroll-mt-24">
                                            <QuestionCard
                                                question={examQuestion.question}
                                                questionNumber={actualIndex + 1}
                                                questionId={examQuestion.question_id}
                                                selectedAnswer={userAnswer?.selectedAnswer || []}
                                                subAnswers={userAnswer?.subAnswers}
                                                onAnswerSelect={createHandleAnswerSelect(examQuestion.question_id)}
                                                onSubAnswerSelect={createHandleSubAnswerSelect(examQuestion.question_id)}
                                                isImageAnswer={isImageAnswer}
                                                isMarked={userAnswer?.isMarked}
                                                onMarkQuestion={() => handleMarkQuestion(examQuestion.question_id)}
                                            />
                                        </div>
                                    );
                                })}

                                {/* Pagination Controls */}
                                <div className="flex items-center justify-between pt-6">
                                    <button
                                        onClick={handlePrevQuestion}
                                        disabled={currentPage === 1}
                                        className="px-6 py-3 rounded-xl font-semibold bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm transition-all"
                                    >
                                        ← Trang trước
                                    </button>

                                    {currentPage === totalPages ? (
                                        <button
                                            onClick={finishExam}
                                            className="px-8 py-3 rounded-xl font-bold bg-green-600 text-white hover:bg-green-700 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all"
                                        >
                                            Nộp bài thi
                                        </button>
                                    ) : (
                                        <button
                                            onClick={handleNextQuestion}
                                            className="px-6 py-3 rounded-xl font-semibold bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all"
                                        >
                                            Trang tiếp theo →
                                        </button>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right Column: Sticky Sidebar */}
                    <div className="lg:col-span-3 order-1 lg:order-2">
                        <div className="sticky top-24 space-y-6">
                            <QuestionNavigator
                                totalQuestions={currentExam.examQuestions.length}
                                getQuestionStatus={getQuestionStatus}
                                getQuestionMarkedStatus={getQuestionMarkedStatus}
                                answeredCount={answeredCount}
                                onQuestionSelect={handleNavigatorSelect}
                                currentQuestionIndex={(isTSA || shouldUseSplitView) ? currentQuestionIndex : undefined}
                            />

                            {/* Sidebar Action Buttons (Mobile/Backup) */}
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                                <button
                                    onClick={finishExam}
                                    className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span>Nộp bài ngay</span>
                                </button>
                                <p className="text-xs text-center text-gray-500 mt-2">
                                    Hãy kiểm tra kỹ bài làm trước khi nộp
                                </p>
                            </div>
                        </div>
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