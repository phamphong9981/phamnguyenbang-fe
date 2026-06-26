'use client';

interface QuestionNavigatorProps {
    totalQuestions: number;
    getQuestionStatus: (index: number) => 'answered' | 'unanswered';
    answeredCount: number;
    onQuestionSelect?: (index: number) => void;
    currentQuestionIndex?: number;
    getQuestionMarkedStatus?: (index: number) => boolean;
    compact?: boolean;
    narrow?: boolean;
    fillHeight?: boolean;
}

export default function QuestionNavigator({
    totalQuestions,
    getQuestionStatus,
    answeredCount,
    onQuestionSelect,
    currentQuestionIndex,
    getQuestionMarkedStatus,
    compact = false,
    narrow = false,
    fillHeight = false,
}: QuestionNavigatorProps) {
    const scrollToQuestion = (index: number) => {
        const questionElement = document.getElementById(`question-${index}`);
        if (questionElement) {
            questionElement.scrollIntoView({
                behavior: 'smooth',
                block: 'start',
                inline: 'nearest'
            });
        }
    };

    const handleQuestionClick = (index: number) => {
        if (onQuestionSelect) {
            // Split view mode - use callback
            onQuestionSelect(index);
        } else {
            // Default mode - scroll to question
            scrollToQuestion(index);
        }
    };

    return (
        <div className={`bg-white ${fillHeight ? `flex h-full min-h-0 flex-col overflow-hidden ${narrow ? 'p-1.5' : 'p-2'}` : compact ? 'sticky top-20 p-3' : 'sticky top-24 p-6 shadow-lg rounded-lg'}`}>
            <h3 className={`font-semibold text-gray-900 shrink-0 leading-tight ${narrow ? 'text-[11px] mb-1.5' : compact ? 'text-sm mb-2' : 'mb-4'}`}>Danh sách câu hỏi</h3>
            <div className={`grid ${narrow ? 'grid-cols-4 gap-1' : compact ? 'grid-cols-8 gap-1.5' : 'grid-cols-5 gap-2'} ${fillHeight ? 'min-h-0 flex-1 overflow-y-auto content-start' : ''}`}>
                {Array.from({ length: totalQuestions }).map((_, index) => {
                    const status = getQuestionStatus(index);
                    const isMarked = getQuestionMarkedStatus ? getQuestionMarkedStatus(index) : false;
                    const isCurrentQuestion = currentQuestionIndex !== undefined && currentQuestionIndex === index;
                    return (
                        <button
                            key={index}
                            onClick={() => handleQuestionClick(index)}
                            className={`relative flex items-center justify-center rounded-md font-medium transition-all ${narrow ? 'w-6 h-6 text-[10px]' : compact ? 'w-7 h-7 text-[11px]' : 'w-10 h-10 rounded-lg text-sm'} ${isCurrentQuestion
                                ? compact || narrow
                                    ? 'bg-blue-600 text-white ring-1 ring-blue-300 scale-105'
                                    : 'bg-blue-600 text-white ring-2 ring-blue-300 ring-offset-2 shadow-lg scale-110'
                                : status === 'answered'
                                    ? 'bg-green-100 text-green-800 hover:bg-green-200'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                } ${isMarked ? (compact || narrow) ? 'ring-1 ring-orange-400' : 'ring-2 ring-orange-400 ring-offset-1' : ''}`}
                        >
                            {index + 1}
                            {isMarked && (
                                <span className={`absolute flex ${compact ? '-top-0.5 -right-0.5 h-2 w-2' : '-top-1 -right-1 h-3 w-3'}`}>
                                    <span className={`relative inline-flex rounded-full bg-orange-500 ${compact ? 'h-2 w-2' : 'h-3 w-3'}`}></span>
                                </span>
                            )}
                        </button>
                    );
                })}
            </div>

            {!compact && (
            <div className="mt-6 space-y-2">
                {currentQuestionIndex !== undefined && (
                    <div className="flex items-center text-sm">
                        <div className="w-4 h-4 bg-blue-600 rounded mr-2"></div>
                        <span>Câu hiện tại</span>
                    </div>
                )}
                <div className="flex items-center text-sm">
                    <div className="w-4 h-4 bg-green-100 rounded mr-2"></div>
                    <span>Đã trả lời</span>
                </div>
                <div className="flex items-center text-sm">
                    <div className="w-4 h-4 bg-gray-100 rounded mr-2"></div>
                    <span>Chưa trả lời</span>
                </div>
                <div className="flex items-center text-sm">
                    <div className="w-4 h-4 bg-orange-500 rounded mr-2"></div>
                    <span>Kiểm tra lại</span>
                </div>
            </div>
            )}

            {compact ? (
                <div className={`text-center text-gray-500 shrink-0 mt-2 ${narrow ? 'text-[10px] leading-tight' : 'text-xs'}`}>
                    <span className="font-semibold text-green-600">{answeredCount}</span>/{totalQuestions} đã trả lời
                </div>
            ) : (
                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                    <div className="text-center">
                        <div className="text-lg font-semibold text-green-600">
                            {answeredCount}
                        </div>
                        <div className="text-sm text-gray-600">
                            / {totalQuestions} câu đã trả lời
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
