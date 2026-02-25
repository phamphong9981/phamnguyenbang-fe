'use client';

interface QuestionNavigatorProps {
    totalQuestions: number;
    getQuestionStatus: (index: number) => 'answered' | 'unanswered';
    answeredCount: number;
    onQuestionSelect?: (index: number) => void; // Optional callback for split view
    currentQuestionIndex?: number; // Optional current question index for split view
    getQuestionMarkedStatus: (index: number) => boolean;
}

export default function QuestionNavigator({
    totalQuestions,
    getQuestionStatus,
    answeredCount,
    onQuestionSelect,
    currentQuestionIndex,
    getQuestionMarkedStatus
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
        <div className="bg-white rounded-lg shadow-lg p-6 sticky top-24">
            <h3 className="font-semibold text-gray-900 mb-4">Danh sách câu hỏi</h3>
            <div className="grid grid-cols-5 gap-2">
                {Array.from({ length: totalQuestions }).map((_, index) => {
                    const status = getQuestionStatus(index);
                    const isMarked = getQuestionMarkedStatus(index);
                    const isCurrentQuestion = currentQuestionIndex !== undefined && currentQuestionIndex === index;
                    return (
                        <button
                            key={index}
                            onClick={() => handleQuestionClick(index)}
                            className={`relative flex items-center justify-center w-10 h-10 rounded-lg text-sm font-medium transition-all ${isCurrentQuestion
                                    ? 'bg-blue-600 text-white ring-2 ring-blue-300 ring-offset-2 shadow-lg scale-110'
                                    : status === 'answered'
                                        ? 'bg-green-100 text-green-800 hover:bg-green-200'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                } ${isMarked ? 'ring-2 ring-orange-400 ring-offset-1' : ''}`}
                        >
                            {index + 1}
                            {isMarked && (
                                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                                    <span className="relative inline-flex rounded-full h-3 w-3 bg-orange-500"></span>
                                </span>
                            )}
                        </button>
                    );
                })}
            </div>

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

            {/* Progress Stats */}
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
        </div>
    );
}
