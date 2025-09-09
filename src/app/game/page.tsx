'use client'

import { useEffect, useRef } from 'react'
import Header from '@/components/Header'
import SpaceShooterGame from '@/components/SpaceShooterGame'

export default function GamePage() {
    return (
        <div className="min-h-screen bg-gray-900">
            <Header />

            {/* Game Hero Section */}
            <section className="bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 py-12 relative overflow-hidden">
                <div className="absolute inset-0 bg-black/20"></div>
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
                            🚀 Asteroid Shooter
                        </h1>
                        <p className="text-xl text-purple-100 max-w-2xl mx-auto">
                            Một trò chơi không gian thú vị được xây dựng với PixiJS
                        </p>
                    </div>
                </div>
            </section>

            {/* Game Instructions */}
            <section className="py-8 bg-gray-800">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-gray-700 rounded-2xl p-6 mb-8">
                        <h2 className="text-2xl font-bold text-white mb-4">🎮 Cách chơi</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-gray-300">
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3.5M3 16.5h12" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-white">Di chuyển chuột</h3>
                                    <p className="text-sm">Điều khiển hướng tàu vũ trụ</p>
                                </div>
                            </div>

                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center">
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-white">Click chuột trái</h3>
                                    <p className="text-sm">Bắn đạn</p>
                                </div>
                            </div>

                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                                    <span className="text-white font-bold text-sm">SPACE</span>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-white">Phím Space</h3>
                                    <p className="text-sm">Kích hoạt động cơ đẩy</p>
                                </div>
                            </div>

                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-yellow-600 rounded-lg flex items-center justify-center">
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-white">Mục tiêu</h3>
                                    <p className="text-sm">Bắn vỡ càng nhiều thiên thạch càng tốt</p>
                                </div>
                            </div>

                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center">
                                    <span className="text-white text-lg">❤️</span>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-white">HP System</h3>
                                    <p className="text-sm">Bạn có 4 HP. Chạm thiên thạch sẽ mất 1 HP</p>
                                </div>
                            </div>

                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-white">Bất tử tạm thời</h3>
                                    <p className="text-sm">Sau khi bị damage, bạn bất tử trong 2 giây</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Game Container */}
            <section className="py-8 bg-gray-900">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-black rounded-2xl p-4 shadow-2xl">
                        <SpaceShooterGame />
                    </div>
                </div>
            </section>

            {/* Game Info */}
            <section className="py-12 bg-gray-800">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl font-bold text-white mb-6">Về trò chơi</h2>
                    <div className="bg-gray-700 rounded-2xl p-8">
                        <p className="text-gray-300 text-lg leading-relaxed mb-6">
                            Asteroid Shooter là một trò chơi không gian thú vị được phát triển với PixiJS.
                            Điều khiển tàu vũ trụ của bạn, bắn vỡ các thiên thạch và tận hưởng trải nghiệm game mượt mà.
                        </p>
                        <div className="flex justify-center items-center space-x-8 text-sm text-gray-400">
                            <div className="flex items-center space-x-2">
                                <span className="w-3 h-3 bg-blue-500 rounded-full"></span>
                                <span>Phát triển với PixiJS</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                                <span>Hoạt động tốt trên Chrome & Firefox</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}
