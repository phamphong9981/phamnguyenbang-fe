'use client';

interface ExamHeaderProps {
    examName: string;
    totalQuestions: number;
    timeLeft: number;
    formatTime: (seconds: number) => string;
    onFinishExam: () => void;
}

export default function ExamHeader({
    examName,
    totalQuestions,
    timeLeft,
    formatTime,
    onFinishExam
}: ExamHeaderProps) {
    return (
        <div className="bg-white shadow-md sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 py-4">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-xl font-semibold text-gray-900">
                            {examName}
                        </h1>
                        <p className="text-sm text-gray-600">
                            Tổng cộng {totalQuestions} câu hỏi
                        </p>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl font-bold text-red-600">
                            {formatTime(timeLeft)}
                        </div>
                        <div className="text-sm text-gray-600">Thời gian còn lại</div>
                    </div>
                    <button
                        onClick={onFinishExam}
                        className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                    >
                        Nộp bài
                    </button>
                </div>
            </div>
        </div>
    );
}
