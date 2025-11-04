'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';

const Wheel = dynamic(
    () => import('react-custom-roulette').then((mod) => ({ default: mod.Wheel })),
    {
        ssr: false,
        loading: () => (
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
        )
    }
);

interface Prize {
    id: string;
    name: string;
    image: string;
    probability: number;
    color: string;
}

interface PrizeWheelProps {
    prizes: Prize[];
    onSpinComplete: (prize: Prize | null) => void;
    giveAwayId?: string;
}

export default function PrizeWheel({ prizes, onSpinComplete, giveAwayId }: PrizeWheelProps) {
    const [isSpinning, setIsSpinning] = useState(false);

    const handleSpinComplete = () => {
        setIsSpinning(false);
        const selectedPrize = prizes.find((prize) => prize.id === giveAwayId) || null;
        onSpinComplete(selectedPrize);
    };

    return (
        <div className="flex flex-col items-center space-y-6">
            <div className="relative flex justify-center">
                <Wheel
                    mustStartSpinning={isSpinning}
                    prizeNumber={0}
                    data={prizes.map((prize) => ({
                        option: prize.name,
                        image:
                            prize.image && prize.image !== '/vounchers/no-prize.png'
                                ? {
                                      uri: prize.image,
                                      sizeMultiplier: 0.6,
                                      offsetX: 0,
                                      offsetY: 0
                                  }
                                : undefined,
                        style: {
                            backgroundColor: prize.color,
                            fontSize: 12,
                            textColor: prize.color === '#f3f4f6' ? '#000' : '#fff'
                        }
                    }))}
                    onStopSpinning={handleSpinComplete}
                    backgroundColors={prizes.map((prize) => prize.color)}
                    textColors={['#000', '#fff']}
                    fontSize={12}
                    fontWeight="bold"
                    textDistance={70}
                    innerRadius={25}
                    outerBorderWidth={3}
                    outerBorderColor="#f59e0b"
                    innerBorderWidth={2}
                    innerBorderColor="#f59e0b"
                    spinDuration={0.8}
                    radiusLineColor="#f59e0b"
                    radiusLineWidth={1}
                />
            </div>

            <button
                onClick={() => setIsSpinning(true)}
                disabled={isSpinning}
                className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold py-4 px-12 rounded-full shadow-xl transition-all duration-300 text-lg transform hover:scale-105 disabled:transform-none border-2 border-yellow-400 hover:border-yellow-500"
            >
                {isSpinning ? (
                    <div className="flex items-center space-x-2">
                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                        <span>Đang quay...</span>
                    </div>
                ) : (
                    '🎯 Quay vòng quay! 🎯'
                )}
            </button>

            {/* Prize List */}
            <div className="bg-white rounded-lg p-6 shadow-lg w-full max-w-md">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">
                    Danh sách phần thưởng
                </h3>
                <div className="space-y-3">
                    {prizes.map((prize) => (
                        <div
                            key={prize.id}
                            className={`flex gap-2 items-center justify-between p-3 rounded-lg transition-all duration-200`}
                            style={{ backgroundColor: prize.color }}
                        >
                            <div className="flex items-center space-x-3">
                                {prize.image ? (
                                    <img
                                        src={prize.image}
                                        alt={prize.name}
                                        className="w-12 h-12 object-cover rounded-lg shadow-sm"
                                        onError={(e) => {
                                            e.currentTarget.style.display = 'none';
                                            e.currentTarget.nextElementSibling?.classList.remove('hidden');
                                        }}
                                    />
                                ) : null}
                                <div
                                    className={`w-12 h-12 bg-gray-300 rounded-lg flex items-center justify-center ${
                                        prize.image ? 'hidden' : ''
                                    }`}
                                >
                                    <span className="text-white text-lg">🎁</span>
                                </div>
                                <span className="font-medium text-gray-800 text-sm flex-1">
                                    {prize.name}
                                </span>
                            </div>
                            <span className="text-sm font-semibold text-gray-600 bg-white px-2 py-1 rounded">
                                {prize.probability}%
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
