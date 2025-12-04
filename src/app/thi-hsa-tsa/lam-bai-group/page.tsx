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
    const [currentTabIndex, setCurrentTabIndex] = useState(0); // Index of current tab being viewed
    const [tabTimes, setTabTimes] = useState<{ [tabId: string]: number }>({}); // Time left for each tab
    const [tabTimeSpent, setTabTimeSpent] = useState<{ [tabId: string]: number }>({}); // Time spent on each tab
    const [maxTabIndexReached, setMaxTabIndexReached] = useState(0); // Track the furthest tab reached
    const [examType, setExamType] = useState<ExamSetType>(ExamSetType.HSA); // HSA or TSA

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

            // Get exam type from sessionStorage
            const storedExamType = sessionStorage.getItem('examType');
            if (storedExamType && (storedExamType === ExamSetType.HSA || storedExamType === ExamSetType.TSA)) {
                setExamType(storedExamType as ExamSetType);
            }
        }

        console.log('📚 Group ID:', group);
    }, [searchParams]);

    // Group exams into tabs based on TO_HOP_2 structure
    // TO_HOP_2: Toán (1 tab), Văn (1 tab), Lý-Hóa-Sinh (1 tab chung)
    const examTabs = useMemo(() => {
        if (!groupData?.examSets) return [];

        // Check if this is TO_HOP_2 (has Physics, Chemistry, Biology)
        const subjectIds = new Set(groupData.examSets.map(exam => exam.subject));
        const hasPhysics = subjectIds.has(SUBJECT_ID.PHYSICS);
        const hasChemistry = subjectIds.has(SUBJECT_ID.CHEMISTRY);
        const hasBiology = subjectIds.has(SUBJECT_ID.BIOLOGY);
        const isToHop2 = hasPhysics && hasChemistry && hasBiology;

        if (!isToHop2) {
            // For TO_HOP_1 or other groups, each exam is a separate tab
            return groupData.examSets.map(exam => ({
                id: `tab-${exam.id}`,
                name: getSubjectInfo(exam.subject).name,
                exams: [exam],
                subjectIds: [exam.subject]
            }));
        }

        // For TO_HOP_2, group exams into tabs
        const tabs: Array<{
            id: string;
            name: string;
            exams: ExamSetDetailResponse[];
            subjectIds: number[];
        }> = [];

        // Find exams by subject
        const mathExam = groupData.examSets.find(e => e.subject === SUBJECT_ID.MATH);
        const literatureExam = groupData.examSets.find(e => e.subject === SUBJECT_ID.LITERATURE);
        const physicsExam = groupData.examSets.find(e => e.subject === SUBJECT_ID.PHYSICS);
        const chemistryExam = groupData.examSets.find(e => e.subject === SUBJECT_ID.CHEMISTRY);
        const biologyExam = groupData.examSets.find(e => e.subject === SUBJECT_ID.BIOLOGY);

        // Tab 1: Toán
        if (mathExam) {
            tabs.push({
                id: `tab-math`,
                name: getSubjectInfo(SUBJECT_ID.MATH).name,
                exams: [mathExam],
                subjectIds: [SUBJECT_ID.MATH]
            });
        }

        // Tab 2: Văn
        if (literatureExam) {
            tabs.push({
                id: `tab-literature`,
                name: getSubjectInfo(SUBJECT_ID.LITERATURE).name,
                exams: [literatureExam],
                subjectIds: [SUBJECT_ID.LITERATURE]
            });
        }

        // Tab 3: Lý-Hóa-Sinh (chung)
        const scienceExams = [physicsExam, chemistryExam, biologyExam].filter(Boolean) as ExamSetDetailResponse[];
        if (scienceExams.length > 0) {
            tabs.push({
                id: `tab-science`,
                name: 'Lý - Hóa - Sinh',
                exams: scienceExams,
                subjectIds: [SUBJECT_ID.PHYSICS, SUBJECT_ID.CHEMISTRY, SUBJECT_ID.BIOLOGY]
            });
        }

        return tabs;
    }, [groupData]);

    // Calculate duration for each tab
    const tabDurations = useMemo(() => {
        if (!examTabs.length) return {};
        const durations: { [tabId: string]: number } = {};
        const isTSA = examType === ExamSetType.TSA;

        examTabs.forEach(tab => {
            if (tab.subjectIds.length === 1) {
                // Single subject tab
                const subjectId = tab.subjectIds[0];
                if (subjectId === SUBJECT_ID.MATH) {
                    durations[tab.id] = isTSA ? 60 : 75; // TSA: 60 minutes, HSA: 75 minutes
                } else if (subjectId === SUBJECT_ID.LITERATURE) {
                    durations[tab.id] = isTSA ? 30 : 60; // TSA: 30 minutes, HSA: 60 minutes
                } else if (subjectId === SUBJECT_ID.ENGLISH) {
                    durations[tab.id] = 60; // 60 minutes for both
                } else {
                    // Other subjects - use duration from exam data
                    const exam = tab.exams[0];
                    durations[tab.id] = parseInt(exam.duration || '0');
                }
            } else {
                // Multi-subject tab (Lý-Hóa-Sinh or Khoa học) - 60 minutes shared
                durations[tab.id] = 60;
            }
        });

        return durations;
    }, [examTabs, examType]);

    // Calculate total questions and duration
    const totalQuestions = useMemo(() => {
        if (!groupData?.examSets) return 0;
        return groupData.examSets.reduce((sum, exam) => sum + (exam.examQuestions?.length || 0), 0);
    }, [groupData]);

    const totalDuration = useMemo(() => {
        if (!groupData?.examSets) return 0;

        const isTSA = examType === ExamSetType.TSA;

        // Check if Physics, Chemistry, and Biology are all present (they share 60 minutes)
        const subjectIds = new Set(groupData.examSets.map(exam => exam.subject));
        const hasPhysics = subjectIds.has(SUBJECT_ID.PHYSICS);
        const hasChemistry = subjectIds.has(SUBJECT_ID.CHEMISTRY);
        const hasBiology = subjectIds.has(SUBJECT_ID.BIOLOGY);
        const hasAllScienceSubjects = hasPhysics && hasChemistry && hasBiology;

        // Calculate based on individual subject durations
        // HSA: Toán 75 phút, Văn 60 phút, Anh 60 phút
        // TSA: Toán 60 phút, Văn 30 phút, Khoa học 60 phút
        // Bộ Lý Hóa Sinh: 60 phút (shared for all three)
        let totalMinutes = 0;
        let scienceSubjectsCounted = false;

        groupData.examSets.forEach(exam => {
            const subjectId = exam.subject;

            // If this is one of the science subjects and all three are present, count them once as 60 minutes
            if (hasAllScienceSubjects &&
                (subjectId === SUBJECT_ID.PHYSICS || subjectId === SUBJECT_ID.CHEMISTRY || subjectId === SUBJECT_ID.BIOLOGY)) {
                if (!scienceSubjectsCounted) {
                    totalMinutes += 60;
                    scienceSubjectsCounted = true;
                }
                // Skip individual counting for science subjects when all three are present
                return;
            }

            // Count other subjects individually
            if (subjectId === SUBJECT_ID.MATH) {
                totalMinutes += isTSA ? 60 : 75; // TSA: 60, HSA: 75
            } else if (subjectId === SUBJECT_ID.LITERATURE) {
                totalMinutes += isTSA ? 30 : 60; // TSA: 30, HSA: 60
            } else if (subjectId === SUBJECT_ID.ENGLISH) {
                totalMinutes += 60;
            } else {
                // For other subjects, use the duration from the exam data or default
                totalMinutes += parseInt(exam.duration || '0');
            }
        });

        return totalMinutes;
    }, [groupData, examType]);

    // Calculate total max points from all exams
    const totalMaxPoints = useMemo(() => {
        if (!groupData?.examSets) return 0;
        return groupData.examSets.reduce((sum, exam) => {
            const examPoints = exam.examQuestions?.reduce((examSum, q) => examSum + (q.points || 0), 0) || 0;
            return sum + examPoints;
        }, 0);
    }, [groupData]);

    // Initialize user answers and tab times when group data changes
    useEffect(() => {
        if (groupData?.examSets && examTabs.length > 0) {
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

            // Initialize time for each tab
            const initialTabTimes: { [tabId: string]: number } = {};
            examTabs.forEach(tab => {
                const duration = tabDurations[tab.id] || 0;
                initialTabTimes[tab.id] = duration * 60; // Convert to seconds
            });
            setTabTimes(initialTabTimes);

            // Set current tab time as the main timeLeft
            if (examTabs.length > 0) {
                const firstTabId = examTabs[0].id;
                setTimeLeft(initialTabTimes[firstTabId] || 0);
            }

            // Reset to first tab when group data loads
            setCurrentTabIndex(0);
            setMaxTabIndexReached(0);
            setTabTimeSpent({});
        }
    }, [groupData, examTabs, tabDurations]);

    // Get current tab being viewed - must be calculated before useEffects
    const currentTab = examTabs[currentTabIndex] || null;

    // Handle moving to next tab - save time spent and prevent going back
    const handleNextTab = useCallback(() => {
        if (!currentTab) return;

        // Calculate time spent on current tab
        const tabDuration = tabDurations[currentTab.id] || 0;
        const initialTime = tabDuration * 60;
        const currentTime = tabTimes[currentTab.id] || 0;
        const timeSpent = initialTime - currentTime;

        // Save time spent for current tab
        setTabTimeSpent(prev => ({
            ...prev,
            [currentTab.id]: timeSpent
        }));

        // Move to next tab
        const nextTabIndex = currentTabIndex + 1;
        if (nextTabIndex < examTabs.length) {
            setCurrentTabIndex(nextTabIndex);
            setMaxTabIndexReached(prev => Math.max(prev, nextTabIndex));

            // Set time for next tab
            const nextTab = examTabs[nextTabIndex];
            if (nextTab && tabTimes[nextTab.id] !== undefined) {
                setTimeLeft(tabTimes[nextTab.id]);
            }
        }
    }, [currentTab, currentTabIndex, examTabs, tabDurations, tabTimes]);

    // Timer countdown for current tab only
    useEffect(() => {
        if (!isExamStarted || isExamFinished || !currentTab) return;

        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    clearInterval(timer);
                    // If this is the last tab, finish exam
                    if (currentTabIndex === examTabs.length - 1) {
                        finishExamRef.current?.();
                    } else {
                        // Auto-advance to next tab when time runs out
                        handleNextTab();
                    }
                    return 0;
                }
                return prev - 1;
            });

            // Update tab time
            setTabTimes(prev => {
                const newTimes = { ...prev };
                if (newTimes[currentTab.id] !== undefined && newTimes[currentTab.id] > 0) {
                    newTimes[currentTab.id] = newTimes[currentTab.id] - 1;
                }
                return newTimes;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [isExamStarted, isExamFinished, currentTab, currentTabIndex, examTabs.length, handleNextTab]);

    // Update timeLeft when currentTab changes
    useEffect(() => {
        if (currentTab && tabTimes[currentTab.id] !== undefined) {
            setTimeLeft(tabTimes[currentTab.id]);
        }
    }, [currentTab, tabTimes]);

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

        if (!groupData?.examSets || !groupId || !currentTab) return;

        try {
            // Save time spent for current tab before finishing
            const tabDuration = tabDurations[currentTab.id] || 0;
            const initialTime = tabDuration * 60;
            const currentTime = tabTimes[currentTab.id] || 0;
            const timeSpent = initialTime - currentTime;

            setTabTimeSpent(prev => ({
                ...prev,
                [currentTab.id]: timeSpent
            }));

            // Collect answers for each exam separately
            const examSubmissions: SubmitExamDto[] = [];

            // Check if this is TO_HOP_2 (Lý, Hóa, Sinh) - they share the same time
            const subjectIds = new Set(groupData.examSets.map(exam => exam.subject));
            const hasPhysics = subjectIds.has(SUBJECT_ID.PHYSICS);
            const hasChemistry = subjectIds.has(SUBJECT_ID.CHEMISTRY);
            const hasBiology = subjectIds.has(SUBJECT_ID.BIOLOGY);
            const isToHop2 = hasPhysics && hasChemistry && hasBiology;

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

                // Calculate time spent on this exam using saved tab times
                let examTimeSpent = 0;
                const subjectId = exam.subject;

                // Find which tab this exam belongs to
                const examTab = examTabs.find(tab =>
                    tab.exams.some(e => e.id === exam.id)
                );

                if (examTab) {
                    // Use saved time spent for this tab
                    examTimeSpent = tabTimeSpent[examTab.id] || 0;

                    // For science subjects in TO_HOP_2, they all share the same time spent
                    // (the time allocated to the 60-minute science block)
                    if (isToHop2 && (subjectId === SUBJECT_ID.PHYSICS || subjectId === SUBJECT_ID.CHEMISTRY || subjectId === SUBJECT_ID.BIOLOGY)) {
                        // All three science subjects share the same time spent
                        examTimeSpent = tabTimeSpent[examTab.id] || 0;
                    }
                } else {
                    // Fallback: calculate based on individual duration
                    const isTSA = examType === ExamSetType.TSA;
                    let subjectDuration = 0;
                    if (subjectId === SUBJECT_ID.MATH) {
                        subjectDuration = isTSA ? 60 : 75; // TSA: 60, HSA: 75
                    } else if (subjectId === SUBJECT_ID.LITERATURE) {
                        subjectDuration = isTSA ? 30 : 60; // TSA: 30, HSA: 60
                    } else if (subjectId === SUBJECT_ID.ENGLISH) {
                        subjectDuration = 60;
                    } else {
                        subjectDuration = parseInt(exam.duration || '0');
                    }
                    examTimeSpent = subjectDuration * 60; // Use full duration as fallback
                }

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

            // Calculate total time spent from all tabs
            const totalTimeSpent = Object.values(tabTimeSpent).reduce((sum, time) => sum + time, 0);

            // Calculate percentage based on total points and max points
            const percentage = totalMaxPoints > 0
                ? Math.round((result.totalPoint / totalMaxPoints) * 100)
                : 0;

            // Create result object for display
            setExamResult({
                totalPoints: result.totalPoint,
                maxPoints: totalMaxPoints,
                percentage: percentage,
                totalTime: totalTimeSpent,
                message: `Bạn đã hoàn thành bộ đề với tổng điểm: ${result.totalPoint}/${totalMaxPoints} (${percentage}%)`,
                questionDetails: []
            });

            setShowResults(true);
        } catch (error) {
            console.error('Error submitting group exam:', error);
            alert('Có lỗi xảy ra khi nộp bài. Vui lòng thử lại!');
            setShowResults(true);
        }
    }, [groupData, groupId, userAnswers, tabTimeSpent, totalMaxPoints, submitGroupAnswerMutation, examTabs, tabDurations, currentTab, tabTimes, examType]);

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

    // Calculate answered count for current tab only - must be before early returns
    const answeredCount = useMemo(() => {
        if (!currentTab) return 0;
        // Get all question IDs from all exams in current tab
        const currentTabQuestionIds = new Set(
            currentTab.exams.flatMap(exam => exam.examQuestions?.map(q => q.question_id) || [])
        );
        return userAnswers.filter(ans => {
            if (!currentTabQuestionIds.has(ans.questionId)) return false;
            return (Array.isArray(ans.selectedAnswer) && ans.selectedAnswer.length > 0) ||
                (ans.subAnswers && Object.keys(ans.subAnswers).length > 0);
        }).length;
    }, [currentTab, userAnswers]);

    // Calculate total questions for current tab - must be before early returns
    const currentTabTotalQuestions = currentTab?.exams.reduce((sum, exam) => sum + (exam.examQuestions?.length || 0), 0) || 0;

    // Get question by index within current tab - must be after currentTab is defined
    // Flatten all questions from all exams in current tab
    const getQuestionByIndex = useCallback((index: number): { questionId: string; question: any; examId: string } | null => {
        if (!currentTab) return null;

        // Flatten all questions from all exams in current tab
        let currentIndex = 0;
        for (const exam of currentTab.exams) {
            if (!exam.examQuestions) continue;
            for (const examQuestion of exam.examQuestions) {
                if (currentIndex === index) {
                    return {
                        questionId: examQuestion.question_id,
                        question: examQuestion.question,
                        examId: exam.id
                    };
                }
                currentIndex++;
            }
        }
        return null;
    }, [currentTab]);

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
                examType={examType}
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

    // Default view - one tab per page with navigation
    if (!currentTab) return null;

    const totalTabs = examTabs.length;

    // Check if current tab should use fullscreen split view (TSA with LITERATURE or SCIENCE)
    const shouldUseFullscreenSplitView = examType === ExamSetType.TSA &&
        currentTab.exams.some(exam =>
            exam.subject === SUBJECT_ID.LITERATURE ||
            exam.subject === SUBJECT_ID.SCIENCE
        );

    // Fullscreen split view for TSA Văn/Khoa học
    if (shouldUseFullscreenSplitView) {
        return (
            <div className="min-h-screen bg-gray-50">
                <ExamHeader
                    examName={groupData.name}
                    totalQuestions={totalQuestions}
                    timeLeft={timeLeft}
                    formatTime={formatTime}
                    onFinishExam={finishExam}
                />

                <div className="max-w-[1600px] mx-auto px-4 py-8">
                    {/* Subject Navigation Tabs */}
                    <div className="mb-6">
                        <div className="bg-white rounded-lg shadow-md p-2 flex items-center gap-2 overflow-x-auto">
                            {examTabs.map((tab, tabIndex) => {
                                const isActive = tabIndex === currentTabIndex;
                                const isDisabled = tabIndex < maxTabIndexReached;
                                const canAccess = tabIndex <= maxTabIndexReached;

                                const tabQuestionIds = new Set(
                                    tab.exams.flatMap(exam => exam.examQuestions?.map(q => q.question_id) || [])
                                );
                                const tabAnsweredCount = userAnswers.filter(ans => {
                                    if (!tabQuestionIds.has(ans.questionId)) return false;
                                    return (Array.isArray(ans.selectedAnswer) && ans.selectedAnswer.length > 0) ||
                                        (ans.subAnswers && Object.keys(ans.subAnswers).length > 0);
                                }).length;
                                const tabTotalQuestions = tab.exams.reduce((sum, exam) => sum + (exam.examQuestions?.length || 0), 0);

                                let gradientClass = '';
                                let dotColor = '';
                                if (tab.subjectIds.length === 1) {
                                    const subjectInfo = getSubjectInfo(tab.subjectIds[0]);
                                    gradientClass = subjectInfo.gradient;
                                    dotColor = subjectInfo.dot;
                                } else {
                                    gradientClass = 'from-purple-500 to-pink-600';
                                    dotColor = 'bg-purple-500';
                                }

                                return (
                                    <button
                                        key={tab.id}
                                        onClick={() => {
                                            if (canAccess && !isDisabled) {
                                                if (currentTab && currentTabIndex !== tabIndex) {
                                                    const tabDuration = tabDurations[currentTab.id] || 0;
                                                    const initialTime = tabDuration * 60;
                                                    const currentTime = tabTimes[currentTab.id] || 0;
                                                    const timeSpent = initialTime - currentTime;

                                                    setTabTimeSpent(prev => ({
                                                        ...prev,
                                                        [currentTab.id]: timeSpent
                                                    }));
                                                }

                                                setCurrentTabIndex(tabIndex);
                                                setMaxTabIndexReached(Math.max(maxTabIndexReached, tabIndex));

                                                if (tabTimes[tab.id] !== undefined) {
                                                    setTimeLeft(tabTimes[tab.id]);
                                                }
                                            }
                                        }}
                                        disabled={!canAccess || isDisabled}
                                        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap ${isActive
                                            ? `bg-gradient-to-r ${gradientClass} text-white shadow-lg`
                                            : isDisabled
                                                ? 'bg-gray-50 text-gray-400 cursor-not-allowed opacity-50'
                                                : canAccess
                                                    ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                    : 'bg-gray-50 text-gray-400 cursor-not-allowed opacity-50'
                                            }`}
                                    >
                                        <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-white' : dotColor}`} />
                                        <span>{tab.name}</span>
                                        <span className={`text-xs px-2 py-0.5 rounded-full ${isActive
                                            ? 'bg-white/20 text-white'
                                            : tabAnsweredCount === tabTotalQuestions
                                                ? 'bg-green-100 text-green-700'
                                                : tabAnsweredCount > 0
                                                    ? 'bg-yellow-100 text-yellow-700'
                                                    : 'bg-gray-200 text-gray-600'
                                            }`}>
                                            {tabAnsweredCount}/{tabTotalQuestions}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Current Tab Header */}
                    {currentTab.exams.length === 1 ? (
                        (() => {
                            const exam = currentTab.exams[0];
                            const subjectInfo = getSubjectInfo(exam.subject);
                            return (
                                <div className={`bg-gradient-to-r ${subjectInfo.gradient} rounded-xl px-6 py-4 shadow-lg mb-6`}>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <div className="flex items-center gap-3 mb-2">
                                                <div className={`w-4 h-4 rounded-full ${subjectInfo.dot} border-2 border-white`} />
                                                <h2 className={`text-2xl font-bold text-white`}>
                                                    {subjectInfo.name} ({currentTabIndex + 1}/{totalTabs})
                                                </h2>
                                            </div>
                                            <h3 className="text-lg font-semibold text-white/90">{exam.name}</h3>
                                        </div>
                                        <div className="text-right">
                                            <span className={`px-3 py-1 text-xs font-semibold rounded-full bg-white/20 text-white`}>
                                                {exam.difficulty ?? '—'}
                                            </span>
                                            <p className="text-white/80 text-sm mt-1">{exam.duration}</p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })()
                    ) : (
                        <div className="bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl px-6 py-4 shadow-lg mb-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="w-4 h-4 rounded-full bg-purple-300 border-2 border-white" />
                                        <h2 className="text-2xl font-bold text-white">
                                            {currentTab.name} ({currentTabIndex + 1}/{totalTabs})
                                        </h2>
                                    </div>
                                    <h3 className="text-lg font-semibold text-white/90">
                                        {currentTab.exams.map(exam => getSubjectInfo(exam.subject).name).join(' - ')}
                                    </h3>
                                </div>
                                <div className="text-right">
                                    <span className="px-3 py-1 text-xs font-semibold rounded-full bg-white/20 text-white">
                                        60 phút
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Questions in current tab - fullscreen split view */}
                    <div className="space-y-8">
                        {(() => {
                            let questionNumber = 1;
                            const allQuestions: React.ReactElement[] = [];

                            currentTab.exams.forEach((exam) => {
                                exam.examQuestions?.forEach((examQuestion) => {
                                    const userAnswer = userAnswers.find(ans => ans.questionId === examQuestion.question_id);
                                    const qNum = questionNumber++;

                                    allQuestions.push(
                                        <div key={examQuestion.question_id} className="space-y-4">
                                            {currentTab.exams.length > 1 && (
                                                <div className="flex items-center gap-2 mb-2">
                                                    <div className={`w-2 h-2 rounded-full ${getSubjectInfo(exam.subject).dot}`} />
                                                    <span className="text-sm font-medium text-gray-600">
                                                        {getSubjectInfo(exam.subject).name}
                                                    </span>
                                                </div>
                                            )}
                                            {examQuestion.question.question_type === 'group_question' ? (
                                                <GroupQuestionSplitView
                                                    question={examQuestion.question}
                                                    questionNumber={qNum}
                                                    questionId={examQuestion.question_id}
                                                    subAnswers={userAnswer?.subAnswers}
                                                    onSubAnswerSelect={createHandleSubAnswerSelect(examQuestion.question_id)}
                                                    isImageAnswer={isImageAnswer}
                                                />
                                            ) : (
                                                <QuestionCard
                                                    question={examQuestion.question}
                                                    questionNumber={qNum}
                                                    questionId={examQuestion.question_id}
                                                    selectedAnswer={userAnswer?.selectedAnswer || []}
                                                    subAnswers={userAnswer?.subAnswers}
                                                    onAnswerSelect={createHandleAnswerSelect(examQuestion.question_id)}
                                                    onSubAnswerSelect={createHandleSubAnswerSelect(examQuestion.question_id)}
                                                    isImageAnswer={isImageAnswer}
                                                />
                                            )}
                                        </div>
                                    );
                                });
                            });

                            return allQuestions;
                        })()}
                    </div>

                    {/* Navigation and Submit Buttons */}
                    <div className="mt-12 flex items-center justify-between gap-4">
                        <div className="w-32"></div>

                        {currentTabIndex === totalTabs - 1 ? (
                            <button
                                onClick={finishExam}
                                className="bg-green-600 hover:bg-green-700 text-white px-12 py-3 rounded-lg text-lg font-semibold transition-colors shadow-lg"
                            >
                                Hoàn thành và nộp bài
                            </button>
                        ) : (
                            <button
                                onClick={handleNextTab}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-12 py-3 rounded-lg text-lg font-semibold transition-colors shadow-lg"
                            >
                                Môn tiếp theo →
                            </button>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    // Default view for other tabs (with sidebar)
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
                        {examTabs.map((tab, tabIndex) => {
                            const isActive = tabIndex === currentTabIndex;
                            const isDisabled = tabIndex < maxTabIndexReached; // Cannot go back to previous tabs
                            const canAccess = tabIndex <= maxTabIndexReached; // Can only access current or next tab

                            // Get all question IDs from all exams in this tab
                            const tabQuestionIds = new Set(
                                tab.exams.flatMap(exam => exam.examQuestions?.map(q => q.question_id) || [])
                            );
                            const tabAnsweredCount = userAnswers.filter(ans => {
                                if (!tabQuestionIds.has(ans.questionId)) return false;
                                return (Array.isArray(ans.selectedAnswer) && ans.selectedAnswer.length > 0) ||
                                    (ans.subAnswers && Object.keys(ans.subAnswers).length > 0);
                            }).length;
                            const tabTotalQuestions = tab.exams.reduce((sum, exam) => sum + (exam.examQuestions?.length || 0), 0);

                            // For multi-subject tab (Lý-Hóa-Sinh), use a combined gradient
                            let gradientClass = '';
                            let dotColor = '';
                            if (tab.subjectIds.length === 1) {
                                const subjectInfo = getSubjectInfo(tab.subjectIds[0]);
                                gradientClass = subjectInfo.gradient;
                                dotColor = subjectInfo.dot;
                            } else {
                                // Multi-subject tab - use a combined style
                                gradientClass = 'from-purple-500 to-pink-600';
                                dotColor = 'bg-purple-500';
                            }

                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => {
                                        if (canAccess && !isDisabled) {
                                            // Save time spent for current tab before switching
                                            if (currentTab && currentTabIndex !== tabIndex) {
                                                const tabDuration = tabDurations[currentTab.id] || 0;
                                                const initialTime = tabDuration * 60;
                                                const currentTime = tabTimes[currentTab.id] || 0;
                                                const timeSpent = initialTime - currentTime;

                                                setTabTimeSpent(prev => ({
                                                    ...prev,
                                                    [currentTab.id]: timeSpent
                                                }));
                                            }

                                            setCurrentTabIndex(tabIndex);
                                            setMaxTabIndexReached(Math.max(maxTabIndexReached, tabIndex));

                                            // Set time for new tab
                                            if (tabTimes[tab.id] !== undefined) {
                                                setTimeLeft(tabTimes[tab.id]);
                                            }
                                        }
                                    }}
                                    disabled={!canAccess || isDisabled}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap ${isActive
                                        ? `bg-gradient-to-r ${gradientClass} text-white shadow-lg`
                                        : isDisabled
                                            ? 'bg-gray-50 text-gray-400 cursor-not-allowed opacity-50'
                                            : canAccess
                                                ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                : 'bg-gray-50 text-gray-400 cursor-not-allowed opacity-50'
                                        }`}
                                >
                                    <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-white' : dotColor}`} />
                                    <span>{tab.name}</span>
                                    <span className={`text-xs px-2 py-0.5 rounded-full ${isActive
                                        ? 'bg-white/20 text-white'
                                        : tabAnsweredCount === tabTotalQuestions
                                            ? 'bg-green-100 text-green-700'
                                            : tabAnsweredCount > 0
                                                ? 'bg-yellow-100 text-yellow-700'
                                                : 'bg-gray-200 text-gray-600'
                                        }`}>
                                        {tabAnsweredCount}/{tabTotalQuestions}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-7 gap-8">
                    {/* Main Content - Current Tab Questions */}
                    <div className="lg:col-span-5">
                        <div className="space-y-6">
                            {/* Current Tab Header */}
                            {currentTab.exams.length === 1 ? (
                                // Single exam tab
                                (() => {
                                    const exam = currentTab.exams[0];
                                    const subjectInfo = getSubjectInfo(exam.subject);
                                    return (
                                        <div className={`bg-gradient-to-r ${subjectInfo.gradient} rounded-xl px-6 py-4 shadow-lg`}>
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <div className="flex items-center gap-3 mb-2">
                                                        <div className={`w-4 h-4 rounded-full ${subjectInfo.dot} border-2 border-white`} />
                                                        <h2 className={`text-2xl font-bold text-white`}>
                                                            {subjectInfo.name} ({currentTabIndex + 1}/{totalTabs})
                                                        </h2>
                                                    </div>
                                                    <h3 className="text-lg font-semibold text-white/90">{exam.name}</h3>
                                                </div>
                                                <div className="text-right">
                                                    <span className={`px-3 py-1 text-xs font-semibold rounded-full bg-white/20 text-white`}>
                                                        {exam.difficulty ?? '—'}
                                                    </span>
                                                    <p className="text-white/80 text-sm mt-1">{exam.duration}</p>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })()
                            ) : (
                                // Multi-exam tab (Lý-Hóa-Sinh)
                                <div className="bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl px-6 py-4 shadow-lg">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <div className="flex items-center gap-3 mb-2">
                                                <div className="w-4 h-4 rounded-full bg-purple-300 border-2 border-white" />
                                                <h2 className="text-2xl font-bold text-white">
                                                    {currentTab.name} ({currentTabIndex + 1}/{totalTabs})
                                                </h2>
                                            </div>
                                            <h3 className="text-lg font-semibold text-white/90">
                                                {currentTab.exams.map(exam => getSubjectInfo(exam.subject).name).join(' - ')}
                                            </h3>
                                        </div>
                                        <div className="text-right">
                                            <span className="px-3 py-1 text-xs font-semibold rounded-full bg-white/20 text-white">
                                                60 phút
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Questions in current tab - show all questions from all exams in the tab */}
                            <div className="space-y-8">
                                {(() => {
                                    let questionNumber = 1;
                                    const allQuestions: React.ReactElement[] = [];

                                    currentTab.exams.forEach((exam) => {
                                        exam.examQuestions?.forEach((examQuestion) => {
                                            const userAnswer = userAnswers.find(ans => ans.questionId === examQuestion.question_id);
                                            const qNum = questionNumber++;

                                            allQuestions.push(
                                                <div key={examQuestion.question_id} className="space-y-4">
                                                    {currentTab.exams.length > 1 && (
                                                        <div className="flex items-center gap-2 mb-2">
                                                            <div className={`w-2 h-2 rounded-full ${getSubjectInfo(exam.subject).dot}`} />
                                                            <span className="text-sm font-medium text-gray-600">
                                                                {getSubjectInfo(exam.subject).name}
                                                            </span>
                                                        </div>
                                                    )}
                                                    <QuestionCard
                                                        question={examQuestion.question}
                                                        questionNumber={qNum}
                                                        questionId={examQuestion.question_id}
                                                        selectedAnswer={userAnswer?.selectedAnswer || []}
                                                        subAnswers={userAnswer?.subAnswers}
                                                        onAnswerSelect={createHandleAnswerSelect(examQuestion.question_id)}
                                                        onSubAnswerSelect={createHandleSubAnswerSelect(examQuestion.question_id)}
                                                        isImageAnswer={isImageAnswer}
                                                    />
                                                </div>
                                            );
                                        });
                                    });

                                    return allQuestions;
                                })()}
                            </div>
                        </div>

                        {/* Navigation and Submit Buttons */}
                        <div className="mt-12 flex items-center justify-between gap-4">
                            {/* Hide previous button - cannot go back to previous tabs */}
                            <div className="w-32"></div>

                            {currentTabIndex === totalTabs - 1 ? (
                                <button
                                    onClick={finishExam}
                                    className="bg-green-600 hover:bg-green-700 text-white px-12 py-3 rounded-lg text-lg font-semibold transition-colors shadow-lg"
                                >
                                    Hoàn thành và nộp bài
                                </button>
                            ) : (
                                <button
                                    onClick={handleNextTab}
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-12 py-3 rounded-lg text-lg font-semibold transition-colors shadow-lg"
                                >
                                    Môn tiếp theo →
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Sidebar - Question Navigator for current tab */}
                    <div className="lg:col-span-2">
                        <QuestionNavigator
                            totalQuestions={currentTabTotalQuestions}
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

