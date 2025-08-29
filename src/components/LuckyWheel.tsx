'use client';

import React, { useState, useRef } from 'react';

export interface Prize {
    id: string;
    name: string;
    image: string;
    probability: number; // Tỷ lệ trúng thưởng (0-100)
    color: string; // Màu sắc của phần trong vòng quay
}

interface LuckyWheelProps {
    prizes: Prize[];
    onSpinComplete: (prize: Prize | null) => void;
    isSpinning: boolean;
    onSpinStart?: () => void;
}

export default function LuckyWheel({ prizes, onSpinComplete, isSpinning, onSpinStart }: LuckyWheelProps) {
    const [rotation, setRotation] = useState(0);
    const wheelRef = useRef<HTMLDivElement>(null);

    // Tạo danh sách tất cả các options với tỉ lệ bằng nhau
    const allOptions = [
        ...prizes,
        {
            id: 'no-prize',
            name: 'Chúc bạn may mắn lần sau',
            image: '/vounchers/no-prize.png', // Sẽ sử dụng icon mặc định
            probability: 0, // Không cần thiết khi chia đều
            color: '#f3f4f6'
        }
    ];

    const totalSegments = allOptions.length;
    const segmentAngle = 360 / totalSegments; // Mỗi segment sẽ có góc bằng nhau

    const spinWheel = () => {
        if (isSpinning) return;

        // Gọi callback khi bắt đầu quay
        onSpinStart?.();

        // Tính toán phần thưởng dựa trên tỷ lệ thực tế
        const random = Math.random() * 100;
        let cumulativeProbability = 0;
        let selectedPrize: Prize | null = null;
        let selectedIndex = 0;

        // Tính tổng tỷ lệ của các phần thưởng thực tế
        const totalPrizeProbability = prizes.reduce((sum, prize) => sum + prize.probability, 0);

        // Tạo danh sách với tỷ lệ thực tế
        const weightedOptions = [
            ...prizes.map(prize => ({ ...prize, isPrize: true })),
            {
                id: 'no-prize',
                name: 'Chúc bạn may mắn lần sau',
                image: '',
                probability: Number(100 - totalPrizeProbability),
                color: '#f3f4f6',
                isPrize: false
            }
        ];

        // Chọn phần thưởng dựa trên tỷ lệ
        for (let i = 0; i < weightedOptions.length; i++) {
            cumulativeProbability += weightedOptions[i].probability;
            if (random <= cumulativeProbability) {
                selectedPrize = weightedOptions[i].isPrize ? weightedOptions[i] as Prize : null;
                // Tìm index tương ứng trong allOptions để tính góc quay
                selectedIndex = allOptions.findIndex(option => option.id === weightedOptions[i].id);
                break;
            }
        }

        // Tính toán góc quay để dừng tại phần thưởng được chọn
        const targetAngle = (selectedIndex * segmentAngle) + (segmentAngle / 2);
        const spins = 5; // Số vòng quay
        const finalRotation = (spins * 360) + (360 - targetAngle);

        setRotation(prev => prev + finalRotation);

        // Gọi callback sau khi animation hoàn thành
        setTimeout(() => {
            onSpinComplete(selectedPrize);
        }, 3000);
    };

    return (
        <div className="flex flex-col items-center space-y-8">
            <h2 className="text-2xl font-bold text-gray-900 text-center">
                🎉 Vòng quay may mắn 🎉
            </h2>

            <div className="relative">
                {/* Vòng quay */}
                <div
                    ref={wheelRef}
                    className="relative w-64 h-64"
                    style={{
                        transform: `rotate(${rotation}deg)`,
                        transition: isSpinning ? 'transform 3s cubic-bezier(0.17, 0.67, 0.12, 0.99)' : 'none'
                    }}
                >
                    {/* Background vòng quay */}
                    <div className="absolute inset-0 rounded-full border-8 border-yellow-400 shadow-2xl overflow-hidden">
                        <div
                            className="absolute inset-0"
                            style={{
                                background: `conic-gradient(${allOptions.map((option, index) =>
                                    `${option.color} ${index * (360 / totalSegments)}deg ${(index + 1) * (360 / totalSegments)}deg`
                                ).join(', ')})`
                            }}
                        />

                        {/* Đường phân cách rõ ràng */}
                        {allOptions.map((_, index) => (
                            <div
                                key={`divider-${index}`}
                                className="absolute top-0 left-1/2 w-1 h-1/2 bg-white"
                                style={{
                                    transform: `rotate(${index * (360 / totalSegments)}deg)`,
                                    transformOrigin: 'bottom center',
                                    opacity: 0.9,
                                    boxShadow: '0 0 4px rgba(255,255,255,0.8)'
                                }}
                            />
                        ))}
                    </div>

                    {/* Phần thưởng - chỉ hiển thị hình ảnh */}
                    {allOptions.map((option, index) => {
                        const angle = index * (360 / totalSegments);
                        const centerAngle = angle + (360 / totalSegments) / 2;
                        const radius = 75; // Điều chỉnh radius để hình ảnh lớn hơn vẫn nằm gọn trong phân vùng

                        // Tính toán vị trí cho hình ảnh
                        const x = Math.cos((centerAngle - 90) * (Math.PI / 180)) * radius;
                        const y = Math.sin((centerAngle - 90) * (Math.PI / 180)) * radius;

                        return (
                            <div
                                key={option.id}
                                className="absolute"
                                style={{
                                    left: '40%',
                                    top: '40%',
                                    transform: `translate(${x}px, ${y}px)`,
                                    transformOrigin: 'center'
                                }}
                            >
                                {/* Hiển thị hình ảnh hoặc icon mặc định */}
                                {option.image && option.image !== '/vounchers/no-prize.png' ? (
                                    <img
                                        src={option.image}
                                        alt={option.name}
                                        className="w-14 h-14 object-cover rounded-full shadow-md"
                                    />
                                ) : option.id === 'no-prize' ? (
                                    <div className="w-14 h-14 bg-gray-400 rounded-full flex items-center justify-center shadow-md">
                                        <span className="text-2xl">😅</span>
                                    </div>
                                ) : (
                                    <div className="w-14 h-14 bg-gray-300 rounded-full flex items-center justify-center shadow-md">
                                        <span className="text-2xl">🎁</span>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* Mũi tên chỉ */}
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1 z-10">
                    <div className="w-4 h-4 bg-red-500 rotate-45 transform origin-bottom"></div>
                </div>

                {/* Nút quay ở giữa */}
                <button
                    onClick={spinWheel}
                    disabled={isSpinning}
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-yellow-500 hover:bg-yellow-600 disabled:bg-gray-400 text-white font-bold rounded-full shadow-xl transition-colors z-20 flex items-center justify-center border-4 border-white"
                >
                    {isSpinning ? (
                        <div className="animate-spin rounded-full h-6 w-6 border-4 border-white border-t-transparent"></div>
                    ) : (
                        <span className="text-sm font-bold tracking-wider">QUAY</span>
                    )}
                </button>
            </div>

            {/* Danh sách phần thưởng */}
            <div className="bg-white rounded-lg p-6 shadow-lg w-full max-w-md">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">
                    Danh sách phần thưởng
                </h3>
                <div className="space-y-3">
                    {allOptions.map((option) => (
                        <div key={option.id} className="flex gap-2 items-center justify-between p-3 rounded-lg" style={{ backgroundColor: option.color }}>
                            <div className="flex items-center space-x-3">
                                {/* Hiển thị hình ảnh hoặc icon mặc định */}
                                {option.image && option.image !== '/vounchers/no-prize.png' ? (
                                    <img
                                        src={option.image}
                                        alt={option.name}
                                        className="w-10 h-10 object-cover rounded"
                                    />
                                ) : option.id === 'no-prize' ? (
                                    <div className="w-10 h-10 bg-gray-400 rounded-full flex items-center justify-center">
                                        <span className="text-white text-base">😅</span>
                                    </div>
                                ) : (
                                    <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                                        <span className="text-white text-base">🎁</span>
                                    </div>
                                )}
                                <span className="font-medium text-gray-800 text-sm">
                                    {option.name}
                                </span>
                            </div>
                            <span className="text-sm font-semibold text-gray-600">
                                {option.id === 'no-prize'
                                    ? `${(100 - prizes.reduce((sum, prize) => sum + prize.probability, 0)).toFixed(1)}%`
                                    : `${prizes.find(p => p.id === option.id)?.probability || 0}%`
                                }
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
