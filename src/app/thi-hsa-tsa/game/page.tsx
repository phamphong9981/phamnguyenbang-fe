'use client'

import { useEffect, useRef, useState } from 'react'
import dynamic from 'next/dynamic'
import Header from '@/components/Header'

// Dynamic import to avoid SSR issues with PixiJS
const OriginalSpaceShooterGame = dynamic(() => import('@/components/OriginalSpaceShooterGame'), {
    ssr: false,
    loading: () => (
        <div className="flex items-center justify-center h-full">
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
                <p className="text-white text-lg">Đang tải game...</p>
            </div>
        </div>
    )
})

export default function GamePage() {
    return (
        <div className="fixed inset-0 bg-black overflow-hidden">
            {/* Game Hero Section - Overlay */}
            <div className="absolute top-0 left-0 right-0 z-20 bg-gradient-to-b from-purple-900/90 via-blue-900/70 to-transparent py-6">
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
                            🚀 Phi thuyền toán học
                        </h1>
                        <p className="text-lg text-purple-100">
                            Trò chơi không gian giúp rèn luyện tư duy toán học
                        </p>
                    </div>
                </div>
            </div>

            {/* Full Screen Game Container */}
            <div className="absolute inset-0 z-10">
                <OriginalSpaceShooterGame />
            </div>
        </div>
    )
}
