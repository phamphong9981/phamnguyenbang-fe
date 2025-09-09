'use client'

import { useEffect, useRef } from 'react'
import Header from '@/components/Header'
import OriginalSpaceShooterGame from '@/components/OriginalSpaceShooterGame'

export default function GamePage() {
    return (
        <div className="fixed inset-0 bg-black overflow-hidden">
            {/* Game Hero Section - Overlay */}
            <div className="absolute top-0 left-0 right-0 z-20 bg-gradient-to-b from-purple-900/90 via-blue-900/70 to-transparent py-6">
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
                            🚀 Asteroid Shooter
                        </h1>
                        <p className="text-lg text-purple-100">
                            Một trò chơi không gian thú vị được xây dựng với PixiJS
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
