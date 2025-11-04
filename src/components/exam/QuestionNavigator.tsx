'use client';

interface QuestionNavigatorProps {
    totalQuestions: number;
    getQuestionStatus: (index: number) => 'answered' | 'unanswered';
    answeredCount: number;
}

export default function QuestionNavigator({
    totalQuestions,
    getQuestionStatus,
    answeredCount
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

    return (
        <div className="bg-white rounded-lg shadow-lg p-6 sticky top-24">
            <h3 className="font-semibold text-gray-900 mb-4">Danh sách câu hỏi</h3>
            <div className="grid grid-cols-5 gap-2">
                {Array.from({ length: totalQuestions }).map((_, index) => {
                    const status = getQuestionStatus(index);
                    return (
                        <button
                            key={index}
                            onClick={() => scrollToQuestion(index)}
                            className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors ${
                                status === 'answered'
                                    ? 'bg-green-100 text-green-800 hover:bg-green-200'
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
                    <div className="w-4 h-4 bg-green-100 rounded mr-2"></div>
                    <span>Đã trả lời</span>
                </div>
                <div className="flex items-center text-sm">
                    <div className="w-4 h-4 bg-gray-100 rounded mr-2"></div>
                    <span>Chưa trả lời</span>
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
