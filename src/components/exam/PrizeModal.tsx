'use client';

import { getPrizeDetails } from '@/lib/prizes';

interface Prize {
    id: string;
    name: string;
    image: string;
}

interface PrizeModalProps {
    isOpen: boolean;
    prize: Prize | null;
    onClose: () => void;
}

export default function PrizeModal({ isOpen, prize, onClose }: PrizeModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
                {prize ? (
                    <div className="text-center">
                        <div className="text-6xl mb-4">🎉</div>
                        <h2 className="text-2xl font-bold text-green-600 mb-4">
                            Chúc mừng!
                        </h2>
                        <div className="mb-6">
                            <img
                                src={prize.image}
                                alt={prize.name}
                                className="w-24 h-24 object-cover rounded-lg mx-auto mb-4"
                            />
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                {getPrizeDetails(prize.id).title}
                            </h3>
                            <p className="text-gray-600 mb-2">
                                {getPrizeDetails(prize.id).description}
                            </p>
                            <p className="text-sm text-gray-500">
                                {getPrizeDetails(prize.id).instructions}
                            </p>
                        </div>
                        <button
                            onClick={onClose}
                            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                        >
                            Nhận phần thưởng
                        </button>
                    </div>
                ) : (
                    <div className="text-center">
                        <div className="text-6xl mb-4">😅</div>
                        <h2 className="text-2xl font-bold text-gray-600 mb-4">
                            Chúc bạn may mắn lần sau!
                        </h2>
                        <p className="text-gray-600 mb-6">
                            Không sao, hãy tiếp tục học tập và làm bài thi để có cơ hội nhận được phần thưởng hấp dẫn nhé!
                        </p>
                        <button
                            onClick={onClose}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                        >
                            Đóng
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
