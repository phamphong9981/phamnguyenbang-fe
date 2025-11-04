'use client';

interface ExamIntroScreenProps {
    examName: string;
    duration: string;
    totalQuestions: number;
    examType: string;
    onStartExam: () => void;
}

export default function ExamIntroScreen({
    examName,
    duration,
    totalQuestions,
    examType,
    onStartExam
}: ExamIntroScreenProps) {
    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-4xl mx-auto px-4 py-16">
                <div className="bg-white rounded-lg shadow-lg p-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">
                        {examName}
                    </h1>

                    <div className="space-y-4 mb-8">
                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                            <span className="font-medium">Thời gian làm bài:</span>
                            <span className="text-lg font-semibold">{duration} phút</span>
                        </div>
                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                            <span className="font-medium">Số câu hỏi:</span>
                            <span className="text-lg font-semibold">
                                {totalQuestions} câu
                            </span>
                        </div>
                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                            <span className="font-medium">Loại đề:</span>
                            <span className="text-lg font-semibold">{examType}</span>
                        </div>
                    </div>

                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-8">
                        <h3 className="font-semibold text-yellow-800 mb-2">Lưu ý quan trọng:</h3>
                        <ul className="text-sm text-yellow-700 space-y-1">
                            <li>• Bài thi sẽ tự động nộp khi hết thời gian</li>
                            <li>• Bạn có thể quay lại sửa đáp án bất cứ lúc nào</li>
                            <li>• Đảm bảo kết nối internet ổn định trong quá trình làm bài</li>
                            <li>• Không được refresh trang trong khi làm bài</li>
                        </ul>
                    </div>

                    <div className="flex justify-center">
                        <button
                            onClick={onStartExam}
                            className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-colors"
                        >
                            Bắt đầu làm bài
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
