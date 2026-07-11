'use client';

interface HSAQuestionStatusBarsProps {
    totalQuestions: number;
    getQuestionStatus: (index: number) => 'answered' | 'unanswered';
    getQuestionMarkedStatus?: (index: number) => boolean;
}

const HSA_EXAM_SCROLL_CONTAINER_ID = 'hsa-exam-scroll-container';
const SCROLL_TOP_OFFSET = 8;

function scrollToQuestion(index: number) {
    const questionElement = document.getElementById(`question-${index}`);
    const scrollContainer = document.getElementById(HSA_EXAM_SCROLL_CONTAINER_ID);
    if (!questionElement || !scrollContainer) return;

    const containerRect = scrollContainer.getBoundingClientRect();
    const elementRect = questionElement.getBoundingClientRect();
    const targetScrollTop =
        scrollContainer.scrollTop + (elementRect.top - containerRect.top) - SCROLL_TOP_OFFSET;

    scrollContainer.scrollTo({
        top: Math.max(0, targetScrollTop),
        behavior: 'smooth',
    });
}

function QuestionChip({
    index,
    variant,
    isMarked,
}: {
    index: number;
    variant: 'answered' | 'unanswered';
    isMarked: boolean;
}) {
    return (
        <button
            type="button"
            onClick={() => scrollToQuestion(index)}
            className={`relative flex h-7 min-w-7 shrink-0 items-center justify-center rounded-md px-1.5 text-xs font-medium transition-colors ${
                variant === 'answered'
                    ? 'bg-green-100 text-green-800 hover:bg-green-200'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            } ${isMarked ? 'ring-1 ring-orange-400' : ''}`}
        >
            {index + 1}
            {isMarked && (
                <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-orange-500" />
            )}
        </button>
    );
}

export default function HSAQuestionStatusBars({
    totalQuestions,
    getQuestionStatus,
    getQuestionMarkedStatus,
}: HSAQuestionStatusBarsProps) {
    const unanswered: number[] = [];
    const answered: number[] = [];

    for (let index = 0; index < totalQuestions; index++) {
        if (getQuestionStatus(index) === 'answered') {
            answered.push(index);
        } else {
            unanswered.push(index);
        }
    }

    return (
        <div className="shrink-0 border-b border-gray-200 bg-white">
            <div className="border-b border-gray-100 px-0 py-2">
                <div className="flex min-h-9 items-center gap-3">
                    <span className="w-24 shrink-0 whitespace-nowrap text-xs font-semibold text-gray-600">
                        Câu chưa làm
                    </span>
                    <div className="flex flex-1 gap-1.5 overflow-x-auto pb-0.5">
                        {unanswered.length === 0 ? (
                            <span className="text-xs text-gray-400">—</span>
                        ) : (
                            unanswered.map((index) => (
                                <QuestionChip
                                    key={index}
                                    index={index}
                                    variant="unanswered"
                                    isMarked={getQuestionMarkedStatus?.(index) ?? false}
                                />
                            ))
                        )}
                    </div>
                </div>
            </div>
            <div className="px-0 py-2">
                <div className="flex min-h-9 items-center gap-3">
                    <span className="w-24 shrink-0 whitespace-nowrap text-xs font-semibold text-gray-600">
                        Câu đã làm
                    </span>
                    <div className="flex flex-1 gap-1.5 overflow-x-auto pb-0.5">
                        {answered.length === 0 ? (
                            <span className="text-xs text-gray-400">—</span>
                        ) : (
                            answered.map((index) => (
                                <QuestionChip
                                    key={index}
                                    index={index}
                                    variant="answered"
                                    isMarked={getQuestionMarkedStatus?.(index) ?? false}
                                />
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
