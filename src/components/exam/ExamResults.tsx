'use client';

import { useRouter } from 'next/navigation';
import { ExamResultDto } from '@/hooks/useExam';
import { getPrizesBasedOnScore } from '@/lib/prizes';
import PrizeWheel from './PrizeWheel';
import PrizeModal from './PrizeModal';
import { useState } from 'react';

interface Prize {
    id: string;
    name: string;
    image: string;
    probability: number;
    color: string;
}

interface ExamResultsProps {
    examResult: ExamResultDto | null;
    score: { correct: number; total: number; percentage: number };
    examId: string;
    onSpinComplete: (prize: Prize | null) => void;
}

export default function ExamResults({
    examResult,
    score,
    examId,
    onSpinComplete
}: ExamResultsProps) {
    const router = useRouter();
    const [showPrizeModal, setShowPrizeModal] = useState(false);
    const [wonPrize, setWonPrize] = useState<Prize | null>(null);

    const prizes = getPrizesBasedOnScore(examResult?.percentage || score.percentage);

    const handleSpinComplete = (prize: Prize | null) => {
        setWonPrize(prize);
        setShowPrizeModal(true);
        onSpinComplete(prize);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-4xl mx-auto px-4 py-16">
                <div className="bg-white rounded-lg shadow-lg p-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">
                        Kết quả bài thi
                    </h1>

                    <div className="text-center mb-8">
                        <div className="text-6xl font-bold text-green-600 mb-4">
                            {examResult ? examResult.percentage : score.percentage}%
                        </div>
                        <div className="text-xl text-gray-600">
                            {examResult
                                ? `${examResult.totalPoints}/${examResult.maxPoints} điểm`
                                : `${score.correct}/${score.total} câu đúng`}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                        <div className="text-center p-4 bg-green-50 rounded-lg">
                            <div className="text-2xl font-bold text-green-600">
                                {examResult?.totalPoints}
                            </div>
                            <div className="text-sm text-gray-600">Điểm đạt được</div>
                        </div>
                        <div className="text-center p-4 bg-red-50 rounded-lg">
                            <div className="text-2xl font-bold text-red-600">
                                {examResult?.totalTime}s
                            </div>
                            <div className="text-sm text-gray-600">Thời gian làm bài</div>
                        </div>
                        <div className="text-center p-4 bg-blue-50 rounded-lg">
                            <div className="text-2xl font-bold text-blue-600">
                                {examResult?.maxPoints}
                            </div>
                            <div className="text-sm text-gray-600">Tổng điểm</div>
                        </div>
                    </div>

                    {/* Prize Wheel Section */}
                    <div className="mb-8">
                        <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg p-6 mb-6">
                            <h3 className="text-white text-xl font-bold mb-2 text-center">
                                🎁 Phần thưởng đặc biệt!
                            </h3>
                            <p className="text-white mb-4 text-center">
                                Bạn đã hoàn thành bài thi! Hãy thử vận may với vòng quay may mắn để nhận phần thưởng hấp dẫn!
                            </p>
                        </div>

                        <PrizeWheel
                            prizes={prizes}
                            onSpinComplete={handleSpinComplete}
                            giveAwayId={examResult?.giveAway}
                        />
                    </div>

                    <div className="flex justify-center space-x-4">
                        <button
                            onClick={() => router.push(`/thi-hsa-tsa/ket-qua?examId=${examId}`)}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                        >
                            Xem chi tiết kết quả
                        </button>
                        <button
                            onClick={() => router.push('/thi-hsa-tsa/bai-tap-chuong')}
                            className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                        >
                            Về trang đề thi
                        </button>
                        <button
                            onClick={() => router.refresh()}
                            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                        >
                            Làm lại
                        </button>
                    </div>
                </div>
            </div>

            <PrizeModal
                isOpen={showPrizeModal}
                prize={wonPrize}
                onClose={() => setShowPrizeModal(false)}
            />
        </div>
    );
}
