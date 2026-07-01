'use client';

import { ExamResultDto, SubmitExamDto, useExamSet, useSubmitExam, ExamSetType, SUBJECT_ID, GuestProfileDto } from '@/hooks/useExam';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';
import { useCallback, useEffect, useState, Suspense, useRef } from 'react';
import ExamIntroScreen from '@/components/exam/ExamIntroScreen';
import ExamResults from '@/components/exam/ExamResults';
import TSAExamLayout from '@/components/exam/TSAExamLayout';
import { getSubjectInfo, shouldHideTSAQuestionNavigator, isExamQuestionAnswered } from '../utils';
import HSAExamLayout from '@/components/exam/HSAExamLayout';
import { HSAExamQuestionItem } from '@/components/exam/HSAExamPlayer';
import { useQuestionSlideTimer } from '@/hooks/useQuestionSlideTimer';
import {
    getApiErrorMessage,
    getApiErrorStatus,
    getExamListRedirectPath,
    isExamAccessDeniedError,
    isExamNotFoundError,
    isExamPasswordError,
} from '@/utils/examAccess';

interface UserAnswer {
    questionId: string;
    selectedAnswer: string[]; // Array to support multiple answers
    subAnswers?: { [key: string]: string[] }; // For group questions - also array
    isMarked?: boolean;
}

function ExamPageContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { user, isAuthenticated, isLoading: isAuthLoading } = useAuth();

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
    const [examTypeParam, setExamTypeParam] = useState<string>('');
    const [examPassword, setExamPassword] = useState<string>('');
    const [passwordInput, setPasswordInput] = useState<string>('');
    const [passwordErrorText, setPasswordErrorText] = useState<string>('');
    const [examResult, setExamResult] = useState<ExamResultDto | null>(null);
    const finishExamRef = useRef<(() => void) | null>(null);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

    // Free exam & guest profile state
    const [isFreeExam, setIsFreeExam] = useState(false);
    const [showGuestProfileForm, setShowGuestProfileForm] = useState(false);
    const [guestProfile, setGuestProfile] = useState<GuestProfileDto>(() => {
        // Try to load from sessionStorage (set by list pages before navigation)
        if (typeof window !== 'undefined') {
            try {
                const stored = sessionStorage.getItem('guestProfile');
                if (stored) return JSON.parse(stored) as GuestProfileDto;
            } catch {}
        }
        return { fullname: '', school: '', yearOfBirth: 2007, phone: '' };
    });
    const [guestProfileErrors, setGuestProfileErrors] = useState<Record<string, string>>({});

    // Anti-cheat mechanisms
    const [warnings, setWarnings] = useState(0);
    const MAX_WARNINGS = 2;
    const isExamFinishedRef = useRef(false);
    // isGuestProfileFilledRef no longer needed: profile collected upfront

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
        const isFreeFromQuery = searchParams.get('isFree') === 'true';
        const examTypeFromQuery = searchParams.get('examType') || '';
        setExamId(id);
        setExamTypeParam(examTypeFromQuery);
        setIsFreeExam(isFreeFromQuery);
        if (typeof window !== 'undefined' && id) {
            const savedPassword = sessionStorage.getItem(`exam-password:${id}`) || '';
            const passwordToUse = passwordFromQuery || savedPassword;
            setExamPassword(passwordToUse);
            setPasswordInput(passwordToUse);
            if (passwordFromQuery) {
                sessionStorage.setItem(`exam-password:${id}`, passwordFromQuery);
            }
        }
        console.log('🚀 Exam ID:', id, 'isFree:', isFreeFromQuery);
    }, [searchParams]);

    // Fetch exam data from API
    // Enable fetching if authenticated OR if it's explicitly marked as a free exam in URL
    const isEffectivelyFree = isFreeExam || searchParams.get('isFree') === 'true';
    const { data: currentExam, isLoading: examLoading, error: examError } = useExamSet(examId, examPassword, isAuthenticated || isEffectivelyFree);

    const examListRedirectPath = getExamListRedirectPath(examTypeParam || currentExam?.type);

    const getTsaQuestionIdRef = useRef<(index: number) => string | null>(() => null);

    const {
        getCurrentSlideSeconds,
        slideTimerTick,
        finalizeCurrentSlideTime,
        questionTimeSpentRef,
    } = useQuestionSlideTimer(
        isExamStarted && !showResults && currentExam?.type === ExamSetType.TSA,
        currentQuestionIndex,
        (index) => getTsaQuestionIdRef.current(index),
    );

    useEffect(() => {
        if (!isExamStarted || showResults) return;
        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = previousOverflow;
        };
    }, [isExamStarted, showResults]);

    useEffect(() => {
        if (!isExamStarted || showResults || currentExam?.type !== ExamSetType.TSA) return;
        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = previousOverflow;
        };
    }, [isExamStarted, showResults, currentExam?.type]);

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

    // Validate guest profile form
    const validateGuestProfile = (): boolean => {
        const errors: Record<string, string> = {};
        if (!guestProfile.fullname.trim()) errors.fullname = 'Vui lòng nhập họ tên';
        if (!guestProfile.school.trim()) errors.school = 'Vui lòng nhập trường';
        if (!guestProfile.phone.trim()) errors.phone = 'Vui lòng nhập số điện thoại';
        if (guestProfile.yearOfBirth < 1900 || guestProfile.yearOfBirth > 2100) errors.yearOfBirth = 'Năm sinh không hợp lệ';
        setGuestProfileErrors(errors);
        return Object.keys(errors).length === 0;
    };

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

            const isTsaExam = currentExam?.type === ExamSetType.TSA;
            if (isTsaExam) {
                finalizeCurrentSlideTime();
            }
            const timesSnapshot = isTsaExam ? { ...questionTimeSpentRef.current } : {};

            // Chuẩn bị dữ liệu để submit
            const answers = userAnswers.flatMap(answer => {
                const question = currentExam?.examQuestions.find(q => q.question_id === answer.questionId)?.question;

                if (question?.question_type === 'group_question') {
                    // For nested group questions
                    const leaves = flattenLeafSubQuestions(question.subQuestions || [], answer.questionId);
                    const slideSeconds = timesSnapshot[answer.questionId] ?? 0;
                    return leaves.map(({ pathKey }) => {
                        const picked = answer.subAnswers?.[pathKey];
                        return {
                            questionId: pathKey,
                            selectedAnswer: Array.isArray(picked) ? picked : [],
                            ...(isTsaExam ? { completedInSeconds: slideSeconds } : {}),
                        };
                    });
                } else {
                    return [{
                        questionId: answer.questionId,
                        selectedAnswer: Array.isArray(answer.selectedAnswer) ? answer.selectedAnswer : [],
                        ...(isTsaExam ? { completedInSeconds: timesSnapshot[answer.questionId] ?? 0 } : {}),
                    }];
                }
            });

            const submitData: SubmitExamDto = {
                examId: examId,
                ...(user?.id ? { profileId: user.id } : {}),
                answers: answers,
                totalTime: parseInt(currentExam?.duration || '0') * 60 - timeLeft,
                // Include guestProfile for unauthenticated users on free exams
                ...((!isAuthenticated && isFreeExam) ? { guestProfile } : {})
            };

            const result = await submitExamMutation.mutateAsync(submitData);
            console.log('Submit exam completed:', result);
            setExamResult(result);
            // For guests: store result in sessionStorage so it can be shown without GET /exams/result
            if (!isAuthenticated && isFreeExam) {
                sessionStorage.setItem(`guest-exam-result:${examId}`, JSON.stringify(result));
            }
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
    }, [examId, userAnswers, currentExam, timeLeft, submitExamMutation, showAlert, isAuthenticated, isFreeExam, guestProfile, showGuestProfileForm, finalizeCurrentSlideTime, questionTimeSpentRef]);

    // Store the finishExam function in the ref
    useEffect(() => {
        finishExamRef.current = finishExam;
    }, [finishExam]);

    // Minimum 60 minutes before submission — only for course-accessible or free exams
    const MIN_EXAM_MINUTES = 60;
    const elapsedSeconds = currentExam ? parseInt(currentExam.duration) * 60 - timeLeft : 0;
    const enforcesMinExamTime = Boolean(
        currentExam &&
        (currentExam.isCourseAccessible === true ||
            currentExam.isFree === true ||
            isEffectivelyFree)
    );
    const hasMetMinExamTime = elapsedSeconds >= MIN_EXAM_MINUTES * 60;
    const canSubmit = !enforcesMinExamTime || hasMetMinExamTime;

    const handleAttemptFinish = useCallback(() => {
        if (enforcesMinExamTime && !hasMetMinExamTime) {
            const remaining = MIN_EXAM_MINUTES * 60 - elapsedSeconds;
            const remMin = Math.ceil(remaining / 60);
            showAlert(
                'Chưa đủ thời gian nộp bài',
                `Bạn cần làm bài ít nhất ${MIN_EXAM_MINUTES} phút trước khi nộp bài.\nVui lòng tiếp tục làm bài thêm khoảng ${remMin} phút nữa.`,
                'warning'
            );
            return;
        }
        finishExam();
    }, [enforcesMinExamTime, hasMetMinExamTime, elapsedSeconds, finishExam, showAlert]);

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

        const examQuestion = currentExam.examQuestions[questionIndex];
        const userAnswer = userAnswers.find(ans => ans.questionId === examQuestion.question_id);
        return isExamQuestionAnswered(
            examQuestion.question,
            examQuestion.question_id,
            userAnswer?.selectedAnswer,
            userAnswer?.subAnswers,
        ) ? 'answered' : 'unanswered';
    };

    getTsaQuestionIdRef.current = (index) => {
        if (!currentExam || currentExam.type !== ExamSetType.TSA) return null;
        return currentExam.examQuestions[index]?.question_id ?? null;
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

    // Check if it's a TSA exam to use the shared TSA layout
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

    if (examError && isExamAccessDeniedError(examError)) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
                <div className="w-full max-w-md bg-white rounded-2xl shadow-lg border border-gray-200 p-6 text-center">
                    <div className="text-4xl mb-3">🚫</div>
                    <h1 className="text-xl font-bold text-gray-900 mb-2">Không có quyền truy cập</h1>
                    <p className="text-sm text-gray-600 mb-6">
                        {getApiErrorMessage(examError) ||
                            'Bạn không có quyền truy cập bộ đề này (loại đề hoặc gói truy cập không phù hợp).'}
                    </p>
                    <button
                        type="button"
                        onClick={() => router.push(examListRedirectPath)}
                        className="w-full px-4 py-2.5 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors"
                    >
                        Quay lại danh sách đề
                    </button>
                </div>
            </div>
        );
    }

    if (examError && isExamNotFoundError(examError)) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
                <div className="w-full max-w-md bg-white rounded-2xl shadow-lg border border-gray-200 p-6 text-center">
                    <div className="text-4xl mb-3">📭</div>
                    <h1 className="text-xl font-bold text-gray-900 mb-2">Không tìm thấy đề thi</h1>
                    <p className="text-sm text-gray-600 mb-6">
                        {getApiErrorMessage(examError) || 'Đề thi không tồn tại hoặc đã hết hạn làm bài.'}
                    </p>
                    <button
                        type="button"
                        onClick={() => router.push(examListRedirectPath)}
                        className="w-full px-4 py-2.5 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors"
                    >
                        Quay lại danh sách đề
                    </button>
                </div>
            </div>
        );
    }

    // Only block non-free exams for unauthenticated users
    if (!isAuthLoading && !isAuthenticated && !isEffectivelyFree) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
                <div className="w-full max-w-md bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 p-10 text-center">
                    <div className="w-20 h-20 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-6 text-blue-600">
                        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-3">Yêu cầu đăng nhập</h2>
                    <p className="text-gray-600 mb-8 leading-relaxed">
                        Bạn cần đăng nhập để tham gia làm bài thi và lưu lại kết quả học tập.
                    </p>
                    <div className="flex flex-col gap-3">
                        <Link
                            href="/home"
                            className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-all"
                        >
                            Đăng nhập ngay
                        </Link>
                        <button
                            onClick={() => router.back()}
                            className="w-full py-4 bg-white text-gray-600 border border-gray-200 rounded-xl font-bold hover:bg-gray-50 transition-all"
                        >
                            Quay lại
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (examError || !currentExam) {
        const status = examError ? getApiErrorStatus(examError) : undefined;
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center px-4">
                    <div className="text-red-600 text-6xl mb-4">❌</div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Lỗi tải đề thi</h1>
                    <p className="text-gray-600 mb-4">
                        {examError ? getApiErrorMessage(examError) || `Không thể tải đề thi${status ? ` (${status})` : ''}.` : 'Không thể tải đề thi. Vui lòng thử lại.'}
                    </p>
                    <button
                        onClick={() => router.push(examListRedirectPath)}
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

    const answeredCount = currentExam.examQuestions.filter((examQuestion) => {
        const userAnswer = userAnswers.find(a => a.questionId === examQuestion.question_id);
        return isExamQuestionAnswered(
            examQuestion.question,
            examQuestion.question_id,
            userAnswer?.selectedAnswer,
            userAnswer?.subAnswers,
        );
    }).length;

    if (isTSA) {
        void slideTimerTick;
        const currentSlideSeconds = getCurrentSlideSeconds();
        const subjectInfo = getSubjectInfo(currentExam.subject);

        return (
            <TSAExamLayout
                alertConfig={alertConfig}
                closeAlert={closeAlert}
                headerTitle={currentExam.name}
                subjectDotClassName={subjectInfo.dot}
                totalQuestions={currentExam.examQuestions.length}
                timeLeft={timeLeft}
                formatTime={formatTime}
                onFinishExam={handleAttemptFinish}
                submitDisabled={!canSubmit}
                submitButtonTitle={enforcesMinExamTime && !canSubmit ? `Cần làm bài ít nhất ${MIN_EXAM_MINUTES} phút` : undefined}
                questions={currentExam.examQuestions}
                currentQuestionIndex={currentQuestionIndex}
                userAnswers={userAnswers}
                onAnswerSelect={createHandleAnswerSelect}
                onSubAnswerSelect={createHandleSubAnswerSelect}
                onMarkQuestion={handleMarkQuestion}
                onNext={handleNextQuestion}
                onPrev={handlePrevQuestion}
                isImageAnswer={isImageAnswer}
                questionTimeSeconds={currentSlideSeconds}
                getQuestionStatus={getQuestionStatus}
                answeredCount={answeredCount}
                onQuestionSelect={handleNavigatorSelect}
                getQuestionMarkedStatus={getQuestionMarkedStatus}
                hideQuestionNavigator={shouldHideTSAQuestionNavigator([currentExam.subject])}
            />
        );
    }

    // --- Render Logic (HSA) ---
    const subjectInfo = getSubjectInfo(currentExam.subject);
    const questionItems: HSAExamQuestionItem[] = currentExam.examQuestions.map((examQuestion, index) => ({
        questionId: examQuestion.question_id,
        questionNumber: index + 1,
        question: examQuestion.question,
    }));

    return (
        <HSAExamLayout
            alertConfig={alertConfig}
            closeAlert={closeAlert}
            headerTitle={currentExam.name}
            subjectDotClassName={subjectInfo.dot}
            totalQuestions={currentExam.examQuestions.length}
            timeLeft={timeLeft}
            formatTime={formatTime}
            onFinishExam={handleAttemptFinish}
            questionItems={questionItems}
            userAnswers={userAnswers}
            onAnswerSelect={createHandleAnswerSelect}
            onSubAnswerSelect={createHandleSubAnswerSelect}
            onMarkQuestion={handleMarkQuestion}
            isImageAnswer={isImageAnswer}
            getQuestionStatus={getQuestionStatus}
            getQuestionMarkedStatus={getQuestionMarkedStatus}
            isLastSubject
            submitDisabled={!canSubmit}
            submitButtonTitle={enforcesMinExamTime && !canSubmit ? `Cần làm bài ít nhất ${MIN_EXAM_MINUTES} phút` : undefined}
        />
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