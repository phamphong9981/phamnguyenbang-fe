'use client'

import { useState } from 'react'
import Image from 'next/image'
import { VideoResponseDto } from '@/hooks/useCourse'
import LoginButton from './LoginButton'

interface LockedVideoCardProps {
    video: VideoResponseDto
    onLoginSuccess?: () => void
}

export default function LockedVideoCard({ video, onLoginSuccess }: LockedVideoCardProps) {
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)

    const handleClick = () => {
        setIsLoginModalOpen(true)
    }

    const handleLoginSuccess = () => {
        setIsLoginModalOpen(false)
        if (onLoginSuccess) {
            onLoginSuccess()
        }
    }

    return (
        <>
            <div
                onClick={handleClick}
                className="group bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg hover:border-orange-200 transition-all duration-300 transform hover:-translate-y-1 text-left w-full cursor-pointer relative"
            >
                {/* Lock overlay */}
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center z-10">
                    <div className="bg-white/90 backdrop-blur-sm rounded-full p-4 shadow-lg">
                        <svg
                            className="w-8 h-8 text-gray-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                            />
                        </svg>
                    </div>
                </div>

                {/* Video thumbnail */}
                <div className="relative aspect-video bg-gray-100">
                    <Image
                        src={video.s3Thumbnail}
                        alt={video.title}
                        fill
                        className="object-cover"
                    />
                </div>

                {/* Video info */}
                <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-orange-600 transition-colors">
                        {video.title}
                    </h3>

                    {video.description && (
                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                            {video.description}
                        </p>
                    )}

                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                                {video.videoType === 'theory' ? 'Lý thuyết' : 'Bài tập'}
                            </span>
                            {video.duration && (
                                <span className="text-xs text-gray-500">
                                    {Math.floor(video.duration / 60)}:{(video.duration % 60).toString().padStart(2, '0')}
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Login Modal */}
            {isLoginModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl p-6 max-w-md w-full mx-4">
                        <div className="text-center">
                            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-orange-100 mb-4">
                                <svg className="h-6 w-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">
                                Video này yêu cầu đăng nhập
                            </h3>
                            <p className="text-sm text-gray-600 mb-6">
                                Vui lòng đăng nhập để xem video {video.title}
                            </p>

                            <div className="flex space-x-3">
                                <button
                                    onClick={() => setIsLoginModalOpen(false)}
                                    className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                                >
                                    Hủy
                                </button>
                                <LoginButton
                                    className="flex-1"
                                    onLoginSuccess={handleLoginSuccess}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}
