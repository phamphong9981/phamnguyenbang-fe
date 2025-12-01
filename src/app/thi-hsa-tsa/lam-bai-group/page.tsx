'use client';

import { ExamResultDto, SubmitExamDto, useSubmitGroupAnswer, SubmitGroupAnswerDto, ExamSetType, SUBJECT_ID, ExamSetGroupResponseDto, ExamSetDetailResponse, GroupSubmitResponse } from '@/hooks/useExam';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState, Suspense, useRef, useMemo } from 'react';
import ExamIntroScreen from '@/components/exam/ExamIntroScreen';
import ExamHeader from '@/components/exam/ExamHeader';
import QuestionCard from '@/components/exam/QuestionCard';
import GroupQuestionSplitView from '@/components/exam/GroupQuestionSplitView';
import QuestionNavigator from '@/components/exam/QuestionNavigator';
import ExamResults from '@/components/exam/ExamResults';
import { getSubjectInfo } from '../utils';

interface UserAnswer {
    questionId: string;
    selectedAnswer: string[]; // Array to support multiple answers
    subAnswers?: { [key: string]: string[] }; // For group questions - also array
}

function GroupExamPageContent() {
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
    const [groupId, setGroupId] = useState<string | null>(null);
    const [groupData, setGroupData] = useState<ExamSetGroupResponseDto | null>(null);
    const [examResult, setExamResult] = useState<ExamResultDto | null>(null);
    const [groupSubmitResult, setGroupSubmitResult] = useState<GroupSubmitResponse | null>(null);
    const finishExamRef = useRef<(() => void) | null>(null);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [currentExamIndex, setCurrentExamIndex] = useState(0); // Index of current exam/subject being viewed

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

    // Get group ID from URL and load group data
    useEffect(() => {
        const group = searchParams.get('groupId') || null;
        setGroupId(group);

        if (group) {
            const stored = sessionStorage.getItem('examSetGroup');
            if (stored) {
                try {
                    const group: ExamSetGroupResponseDto = JSON.parse(stored);
                    setGroupData(group);
                } catch (e) {
                    console.error('Error parsing exam set group:', e);
                }
            }
        }

        console.log('📚 Group ID:', group);
    }, [searchParams]);

    // Calculate total questions and duration
    const totalQuestions = useMemo(() => {
        if (!groupData?.examSets) return 0;
        return groupData.examSets.reduce((sum, exam) => sum + (exam.examQuestions?.length || 0), 0);
    }, [groupData]);

    const totalDuration = useMemo(() => {
        if (!groupData?.examSets) return 0;
        return groupData.examSets.reduce((sum, exam) => sum + parseInt(exam.duration || '0'), 0);
    }, [groupData]);

    // Calculate total max points from all exams
    const totalMaxPoints = useMemo(() => {
        if (!groupData?.examSets) return 0;
        return groupData.examSets.reduce((sum, exam) => {
            const examPoints = exam.examQuestions?.reduce((examSum, q) => examSum + (q.points || 0), 0) || 0;
            return sum + examPoints;
        }, 0);
    }, [groupData]);

    // Initialize user answers when group data changes
    useEffect(() => {
        if (groupData?.examSets) {
            const initialAnswers: UserAnswer[] = [];
            groupData.examSets.forEach(exam => {
                if (exam.examQuestions) {
                    exam.examQuestions.forEach(q => {
                        initialAnswers.push({
                            questionId: q.question_id,
                            selectedAnswer: []
                        });
                    });
                }
            });
            setUserAnswers(initialAnswers);
            setTimeLeft(totalDuration * 60);
            // Reset to first exam when group data loads
            setCurrentExamIndex(0);
        }
    }, [groupData, totalDuration]);

    // Timer countdown
    useEffect(() => {
        if (!isExamStarted || isExamFinished || !groupData) return;

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
    }, [isExamStarted, isExamFinished, groupData]);

    const formatTime = (seconds: number) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    // Hook để submit bài thi group
    const submitGroupAnswerMutation = useSubmitGroupAnswer();

    const finishExam = useCallback(async () => {
        setIsExamFinished(true);

        if (!groupData?.examSets || !groupId) return;

        try {
            // Collect answers for each exam separately
            const examSubmissions: SubmitExamDto[] = [];

            groupData.examSets.forEach((exam) => {
                // Get all answers for this exam
                const examAnswers = userAnswers
                    .filter(answer => {
                        // Check if this answer belongs to this exam
                        return exam.examQuestions?.some(q => q.question_id === answer.questionId);
                    })
                    .flatMap(answer => {
                        // Find the question to check its type
                        const examQuestion = exam.examQuestions?.find(q => q.question_id === answer.questionId);
                        if (!examQuestion) return [];

                        const question = examQuestion.question;

                        if (question.question_type === 'group_question' && answer.subAnswers) {
                            // For group questions, expand sub-answers
                            return Object.entries(answer.subAnswers).map(([subId, subAnswerArray]) => ({
                                questionId: `${answer.questionId}_${subId}`,
                                selectedAnswer: Array.isArray(subAnswerArray) ? subAnswerArray : []
                            }));
                        } else {
                            // Regular question
                            return [{
                                questionId: answer.questionId,
                                selectedAnswer: Array.isArray(answer.selectedAnswer) ? answer.selectedAnswer : []
                            }];
                        }
                    });

                // Calculate time spent on this exam
                // For simplicity, we'll distribute total time proportionally based on exam duration
                const examDuration = parseInt(exam.duration || '0');
                const examTimeSpent = examDuration > 0
                    ? Math.round((totalDuration * 60 - timeLeft) * (examDuration / totalDuration))
                    : 0;

                examSubmissions.push({
                    examId: exam.id,
                    profileId: "user_profile_id", // TODO: Get actual profileId from user context
                    answers: examAnswers,
                    totalTime: examTimeSpent
                });
            });

            // Submit all exams together
            const submitData: SubmitGroupAnswerDto = {
                groupId: groupId,
                exams: examSubmissions
            };

            const result = await submitGroupAnswerMutation.mutateAsync(submitData);
            console.log('Submit group exam completed:', result);
            setGroupSubmitResult(result);

            // Calculate percentage based on total points and max points
            const percentage = totalMaxPoints > 0
                ? Math.round((result.totalPoint / totalMaxPoints) * 100)
                : 0;

            // Create result object for display
            setExamResult({
                totalPoints: result.totalPoint,
                maxPoints: totalMaxPoints,
                percentage: percentage,
                totalTime: totalDuration * 60 - timeLeft,
                message: `Bạn đã hoàn thành bộ đề với tổng điểm: ${result.totalPoint}/${totalMaxPoints} (${percentage}%)`,
                questionDetails: []
            });

            setShowResults(true);
        } catch (error) {
            console.error('Error submitting group exam:', error);
            alert('Có lỗi xảy ra khi nộp bài. Vui lòng thử lại!');
            setShowResults(true);
        }
    }, [groupData, groupId, userAnswers, timeLeft, totalDuration, totalMaxPoints, submitGroupAnswerMutation]);

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

    // Get current exam being viewed - must be calculated before early returns
    const currentExam = groupData?.examSets?.[currentExamIndex] || null;

    // Calculate answered count for current exam only - must be before early returns
    const answeredCount = useMemo(() => {
        if (!currentExam) return 0;
        const currentExamQuestionIds = new Set(currentExam.examQuestions?.map(q => q.question_id) || []);
        return userAnswers.filter(ans => {
            if (!currentExamQuestionIds.has(ans.questionId)) return false;
            return (Array.isArray(ans.selectedAnswer) && ans.selectedAnswer.length > 0) ||
                (ans.subAnswers && Object.keys(ans.subAnswers).length > 0);
        }).length;
    }, [currentExam, userAnswers]);

    // Calculate total questions for current exam - must be before early returns
    const currentExamTotalQuestions = currentExam?.examQuestions?.length || 0;

    // Get question by index within current exam - must be after currentExam is defined
    const getQuestionByIndex = useCallback((index: number): { questionId: string; question: any } | null => {
        if (!currentExam || !currentExam.examQuestions) return null;
        const examQuestion = currentExam.examQuestions[index];
        if (!examQuestion) return null;
        return {
            questionId: examQuestion.question_id,
            question: examQuestion.question
        };
    }, [currentExam]);

    const getQuestionStatus = useCallback((index: number): 'answered' | 'unanswered' => {
        const questionData = getQuestionByIndex(index);
        if (!questionData) return 'unanswered';

        const userAnswer = userAnswers.find(ans => ans.questionId === questionData.questionId);
        if (!userAnswer) return 'unanswered';

        const question = questionData.question;

        if (question.question_type === 'group_question') {
            if (userAnswer.subAnswers) {
                const allAnswered = question.subQuestions?.every((subQ: any) => {
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
            if (Array.isArray(userAnswer.selectedAnswer) && userAnswer.selectedAnswer.length > 0) {
                if (question.question_type === 'short_answer') {
                    return userAnswer.selectedAnswer[0]?.trim() !== '' ? 'answered' : 'unanswered';
                }
                return 'answered';
            }
            return 'unanswered';
        }
    }, [getQuestionByIndex, userAnswers]);


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
    if (!groupData) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Đang tải bộ đề...</p>
                </div>
            </div>
        );
    }

    // Error state
    if (!groupData.examSets || groupData.examSets.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="text-red-600 text-6xl mb-4">❌</div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Lỗi tải bộ đề</h1>
                    <p className="text-gray-600 mb-4">Không thể tải bộ đề. Vui lòng thử lại.</p>
                    <button
                        onClick={() => router.push('/thi-hsa-tsa/thi-hsa')}
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
                examName={groupData.name}
                duration={totalDuration.toString()}
                totalQuestions={totalQuestions}
                examType={ExamSetType.HSA}
                onStartExam={startExam}
            />
        );
    }

    if (showResults) {
        const score = { correct: 0, total: totalQuestions, percentage: 0 }; // Calculate if needed
        return (
            <ExamResults
                examResult={examResult}
                score={score}
                examId={groupId || ''}
            />
        );
    }

    const getDifficultyColor = (d: string) =>
        d === 'Dễ' ? 'bg-green-100 text-green-800'
            : d === 'Trung bình' ? 'bg-yellow-100 text-yellow-800'
                : d === 'Khó' ? 'bg-orange-100 text-orange-800'
                    : d === 'Rất khó' ? 'bg-red-100 text-red-800'
                        : 'bg-gray-100 text-gray-800';

    // Default view - one subject per page with navigation
    if (!currentExam) return null;

    const subjectInfo = getSubjectInfo(currentExam.subject);
    const totalExams = groupData.examSets.length;

    return (
        <div className="min-h-screen bg-gray-50">
            <ExamHeader
                examName={groupData.name}
                totalQuestions={totalQuestions}
                timeLeft={timeLeft}
                formatTime={formatTime}
                onFinishExam={finishExam}
            />

            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Subject Navigation Tabs */}
                <div className="mb-6">
                    <div className="bg-white rounded-lg shadow-md p-2 flex items-center gap-2 overflow-x-auto">
                        {groupData.examSets.map((exam, examIndex) => {
                            const examSubjectInfo = getSubjectInfo(exam.subject);
                            const isActive = examIndex === currentExamIndex;
                            const examQuestionIds = new Set(exam.examQuestions?.map(q => q.question_id) || []);
                            const examAnsweredCount = userAnswers.filter(ans => {
                                if (!examQuestionIds.has(ans.questionId)) return false;
                                return (Array.isArray(ans.selectedAnswer) && ans.selectedAnswer.length > 0) ||
                                    (ans.subAnswers && Object.keys(ans.subAnswers).length > 0);
                            }).length;
                            const examTotalQuestions = exam.examQuestions?.length || 0;

                            return (
                                <button
                                    key={exam.id}
                                    onClick={() => setCurrentExamIndex(examIndex)}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap ${isActive
                                        ? `bg-gradient-to-r ${examSubjectInfo.gradient} text-white shadow-lg`
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                >
                                    <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-white' : examSubjectInfo.dot}`} />
                                    <span>{examSubjectInfo.name}</span>
                                    <span className={`text-xs px-2 py-0.5 rounded-full ${isActive
                                        ? 'bg-white/20 text-white'
                                        : examAnsweredCount === examTotalQuestions
                                            ? 'bg-green-100 text-green-700'
                                            : examAnsweredCount > 0
                                                ? 'bg-yellow-100 text-yellow-700'
                                                : 'bg-gray-200 text-gray-600'
                                        }`}>
                                        {examAnsweredCount}/{examTotalQuestions}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-7 gap-8">
                    {/* Main Content - Current Exam Questions */}
                    <div className="lg:col-span-5">
                        <div className="space-y-6">
                            {/* Current Exam Header */}
                            <div className={`bg-gradient-to-r ${subjectInfo.gradient} rounded-xl px-6 py-4 shadow-lg`}>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className={`w-4 h-4 rounded-full ${subjectInfo.dot} border-2 border-white`} />
                                            <h2 className={`text-2xl font-bold text-white`}>
                                                {subjectInfo.name} ({currentExamIndex + 1}/{totalExams})
                                            </h2>
                                        </div>
                                        <h3 className="text-lg font-semibold text-white/90">{currentExam.name}</h3>
                                    </div>
                                    <div className="text-right">
                                        <span className={`px-3 py-1 text-xs font-semibold rounded-full bg-white/20 text-white`}>
                                            {currentExam.difficulty ?? '—'}
                                        </span>
                                        <p className="text-white/80 text-sm mt-1">{currentExam.duration}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Questions in current exam */}
                            <div className="space-y-8">
                                {currentExam.examQuestions?.map((examQuestion, questionIndex) => {
                                    const userAnswer = userAnswers.find(ans => ans.questionId === examQuestion.question_id);

                                    return (
                                        <QuestionCard
                                            key={examQuestion.question_id}
                                            question={examQuestion.question}
                                            questionNumber={questionIndex + 1}
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
                        </div>

                        {/* Navigation and Submit Buttons */}
                        <div className="mt-12 flex items-center justify-between gap-4">
                            <button
                                onClick={() => setCurrentExamIndex(prev => Math.max(0, prev - 1))}
                                disabled={currentExamIndex === 0}
                                className={`px-6 py-3 rounded-lg font-semibold transition-colors ${currentExamIndex === 0
                                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                    : 'bg-gray-600 hover:bg-gray-700 text-white'
                                    }`}
                            >
                                ← Môn trước
                            </button>

                            {currentExamIndex === totalExams - 1 ? (
                                <button
                                    onClick={finishExam}
                                    className="bg-green-600 hover:bg-green-700 text-white px-12 py-3 rounded-lg text-lg font-semibold transition-colors shadow-lg"
                                >
                                    Hoàn thành và nộp bài
                                </button>
                            ) : (
                                <button
                                    onClick={() => setCurrentExamIndex(prev => Math.min(totalExams - 1, prev + 1))}
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-12 py-3 rounded-lg text-lg font-semibold transition-colors shadow-lg"
                                >
                                    Môn tiếp theo →
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Sidebar - Question Navigator for current exam */}
                    <div className="lg:col-span-2">
                        <QuestionNavigator
                            totalQuestions={currentExamTotalQuestions}
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
function GroupExamPageLoading() {
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="text-center">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Đang tải bộ đề...</p>
            </div>
        </div>
    );
}

// Main component with Suspense boundary
export default function GroupExamPage() {
    return (
        <Suspense fallback={<GroupExamPageLoading />}>
            <GroupExamPageContent />
        </Suspense>
    );
}

