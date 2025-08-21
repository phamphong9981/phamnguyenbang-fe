'use client'

import React, { useState } from 'react'
import { useVideoById, useCreateComment, CommentResponseDto } from '@/hooks/useVideo'
import { useAuth } from '@/hooks/useAuth'

interface Comment {
    id: string
    user_name: string
    user_avatar: string
    content: string
    created_at: string
    likes: number
    replies?: Comment[]
}

interface Video {
    id: string
    s3_video: string
    s3_thumbnail: string
    title: string
    created_at: string
    description?: string
    views?: number
    likes?: number
    comments?: Comment[]
}

interface VideoModalProps {
    isOpen: boolean
    video: Video | null
    currentChapterName?: string
    onClose: () => void
}

export default function VideoModal({ isOpen, video, currentChapterName, onClose }: VideoModalProps) {
    const [newComment, setNewComment] = useState('')
    const { user, isAuthenticated } = useAuth()

    // Fetch video details with comments
    const { data: videoDetails, isLoading: videoLoading, error: videoError } = useVideoById(video?.id || '')

    // Create comment mutation
    const createCommentMutation = useCreateComment(video?.id || '')

    // Convert API comments to local format
    const convertComment = (comment: CommentResponseDto): Comment => ({
        id: comment.id,
        user_name: comment.fullname,
        user_avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face',
        content: comment.content,
        created_at: new Date(comment.createdAt).toLocaleDateString('vi-VN'),
        likes: comment.likesCount,
        replies: comment.replies?.map(convertComment) || []
    })

    const comments = videoDetails?.comments.map(convertComment) || []

    // Custom scrollbar styles
    const scrollbarStyles = `
        .custom-scrollbar::-webkit-scrollbar {
            width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
            background: #f1f5f9;
            border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
            background: #cbd5e1;
            border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: #94a3b8;
        }
        
        /* Fixed modal height */
        .modal-container {
            height: 90vh !important;
            max-height: 90vh !important;
            min-height: 90vh !important;
        }
        
        /* Prevent content from expanding modal */
        .modal-content {
            flex: 1;
            min-height: 0;
            overflow: hidden;
        }
    `

    const handleSubmitComment = async () => {
        if (!newComment.trim() || !video || !isAuthenticated) return

        try {
            await createCommentMutation.mutateAsync({
                content: newComment,
                parentCommentId: undefined
            })
            setNewComment('')
        } catch (error) {
            console.error('Error creating comment:', error)
            // You could add a toast notification here
        }
    }

    // Note: Like functionality can be implemented later with a separate API endpoint

    if (!isOpen || !video) return null

    return (
        <>
            <style dangerouslySetInnerHTML={{ __html: scrollbarStyles }} />
            <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-2 sm:p-4">
                <div className="bg-white rounded-xl shadow-2xl max-w-7xl w-full h-[90vh] max-h-[90vh] overflow-hidden flex flex-col modal-container">
                    {/* Modal Header */}
                    <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 bg-green-600 flex-shrink-0">
                        <div className="flex-1 min-w-0">
                            <h3 className="text-lg sm:text-xl font-bold text-white truncate pr-4">{videoDetails?.title || video.title}</h3>
                            <div className="flex items-center flex-wrap gap-3 mt-2 text-xs sm:text-sm text-green-100">
                                <span className="flex items-center">
                                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    {videoDetails ? new Date(videoDetails.createdAt).toLocaleDateString('vi-VN') : video.created_at}
                                </span>
                                {videoDetails?.duration && (
                                    <span className="flex items-center">
                                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        {Math.round(videoDetails.duration / 60)} phút
                                    </span>
                                )}
                                <span className="flex items-center">
                                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                    </svg>
                                    {comments.length} bình luận
                                </span>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-white hover:text-green-200 transition-colors p-1 rounded-lg hover:bg-green-700"
                        >
                            <svg className="w-6 h-6 sm:w-8 sm:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    <div className="flex flex-col lg:flex-row flex-1 min-h-0 overflow-hidden modal-content">
                        {/* Video Player */}
                        <div className="lg:w-2/3 flex flex-col min-h-0 overflow-hidden">
                            <div className="relative bg-black flex-shrink-0" style={{ aspectRatio: '16/9' }}>
                                <video
                                    className="w-full h-full object-contain"
                                    controls
                                    autoPlay
                                    poster={video.s3_thumbnail}
                                >
                                    <source src={video.s3_video} type="video/mp4" />
                                    Trình duyệt của bạn không hỗ trợ video.
                                </video>
                            </div>

                            {/* Video Info */}
                            <div className="p-4 sm:p-6 flex-1 overflow-y-auto bg-gray-50 min-h-0" style={{ height: 'calc(90vh - 400px)' }}>
                                <div className="flex items-center flex-wrap gap-2 mb-4">
                                    {currentChapterName && (
                                        <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs sm:text-sm font-medium">
                                            {currentChapterName}
                                        </span>
                                    )}
                                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs sm:text-sm font-medium">
                                        {videoDetails?.videoType === 'theory' ? 'Lý thuyết' : 'Bài tập'}
                                    </span>
                                </div>

                                {/* Description */}
                                <div className="prose prose-sm max-w-none">
                                    <h4 className="text-base font-semibold text-gray-900 mb-2">Mô tả bài giảng</h4>
                                    <p className="text-gray-700 leading-relaxed text-sm">
                                        {videoDetails?.description || video.description || 'Chưa có mô tả cho video này.'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Comments Section */}
                        <div className="lg:w-1/3 border-l border-gray-200 bg-white flex flex-col min-h-0 overflow-hidden">
                            <div className="p-4 flex-shrink-0 border-b border-gray-200 bg-gray-50 w-full">
                                <h3 className="text-base font-semibold text-gray-900 mb-3 flex items-center">
                                    <svg className="w-5 h-5 mr-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                    </svg>
                                    Bình luận ({comments.length})
                                </h3>

                                {/* Comment Input */}
                                {isAuthenticated ? (
                                    <div className="space-y-3 w-full">
                                        <div className="flex items-center space-x-2 text-xs text-gray-600">
                                            <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center">
                                                <span className="text-white text-xs font-bold">{user?.username?.charAt(0).toUpperCase()}</span>
                                            </div>
                                            <span>Đăng nhập với tài khoản: <strong>{user?.username}</strong></span>
                                        </div>
                                        <div className="border border-gray-300 rounded-lg shadow-sm overflow-hidden focus-within:border-green-500 focus-within:ring-1 focus-within:ring-green-500 w-full max-w-full">
                                            <textarea
                                                rows={3}
                                                maxLength={500}
                                                className="block w-full py-3 px-3 resize-none border-0 focus:ring-0 text-sm placeholder-gray-500 min-h-[80px] max-h-[120px] overflow-y-auto"
                                                placeholder="Viết bình luận của bạn..."
                                                value={newComment}
                                                onChange={(e) => setNewComment(e.target.value)}
                                                disabled={createCommentMutation.isPending}
                                                style={{
                                                    height: '80px',
                                                    minHeight: '80px',
                                                    maxHeight: '120px'
                                                }}
                                            />
                                            <div className="flex items-center justify-between px-3 py-2 bg-gray-50 border-t border-gray-200">
                                                <div className="text-xs text-gray-500">
                                                    {newComment.length}/500 ký tự
                                                </div>
                                                <button
                                                    onClick={handleSubmitComment}
                                                    disabled={!newComment.trim() || createCommentMutation.isPending}
                                                    className="bg-green-600 hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-4 py-1.5 rounded-md text-sm font-medium transition-colors flex items-center space-x-2"
                                                >
                                                    {createCommentMutation.isPending && (
                                                        <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
                                                    )}
                                                    <span>{createCommentMutation.isPending ? 'Đang gửi...' : 'Gửi'}</span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-center py-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg border border-gray-200">
                                        <div className="mb-3">
                                            <svg className="w-12 h-12 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                            </svg>
                                        </div>
                                        <p className="text-sm text-gray-600 mb-4">Bạn cần đăng nhập để bình luận</p>
                                        <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm">
                                            Đăng nhập
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Comments List with Scroll */}
                            <div className="flex-1 overflow-y-auto custom-scrollbar bg-gray-50 min-h-0" style={{ height: 'calc(90vh - 200px)' }}>
                                <div className="p-4 space-y-3 w-full">
                                    {videoLoading ? (
                                        <div className="flex items-center justify-center py-12">
                                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-600"></div>
                                            <span className="ml-3 text-sm text-gray-600">Đang tải bình luận...</span>
                                        </div>
                                    ) : videoError ? (
                                        <div className="text-center py-12">
                                            <div className="mb-3">
                                                <svg className="w-10 h-10 mx-auto text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                                </svg>
                                            </div>
                                            <p className="text-sm text-red-600">Không thể tải bình luận. Vui lòng thử lại.</p>
                                        </div>
                                    ) : comments && comments.length > 0 ? (
                                        comments.map((comment) => (
                                            <div key={comment.id} className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 min-h-0">
                                                <div className="flex items-start space-x-3">
                                                    <div className="flex-shrink-0">
                                                        <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center">
                                                            <span className="text-white text-sm font-bold">
                                                                {comment.user_name.charAt(0).toUpperCase()}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center justify-between mb-1">
                                                            <div className="flex items-center space-x-2">
                                                                <p className="text-sm font-semibold text-gray-900 truncate">
                                                                    {comment.user_name}
                                                                </p>
                                                                <span className="text-xs text-gray-500">•</span>
                                                                <p className="text-xs text-gray-500">
                                                                    {comment.created_at}
                                                                </p>
                                                            </div>
                                                            <div className="flex items-center space-x-1 text-gray-400">
                                                                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                                                                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                                                                </svg>
                                                                <span className="text-xs">{comment.likes}</span>
                                                            </div>
                                                        </div>
                                                        <p className="text-sm text-gray-700 leading-relaxed break-words overflow-hidden">
                                                            {comment.content}
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* Replies */}
                                                {comment.replies && comment.replies.length > 0 && (
                                                    <div className="mt-3 pl-8 space-y-2 border-l-2 border-gray-100">
                                                        {comment.replies.map((reply) => (
                                                            <div key={reply.id} className="bg-gray-50 rounded-lg p-3">
                                                                <div className="flex items-start space-x-2">
                                                                    <div className="flex-shrink-0">
                                                                        <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                                                                            <span className="text-white text-xs font-bold">
                                                                                {reply.user_name.charAt(0).toUpperCase()}
                                                                            </span>
                                                                        </div>
                                                                    </div>
                                                                    <div className="flex-1 min-w-0">
                                                                        <div className="flex items-center justify-between mb-1">
                                                                            <div className="flex items-center space-x-1">
                                                                                <p className="text-xs font-semibold text-gray-900">
                                                                                    {reply.user_name}
                                                                                </p>
                                                                                <span className="text-xs text-gray-400">•</span>
                                                                                <p className="text-xs text-gray-500">
                                                                                    {reply.created_at}
                                                                                </p>
                                                                            </div>
                                                                            <div className="flex items-center space-x-1 text-gray-400">
                                                                                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                                                                                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                                                                                </svg>
                                                                                <span className="text-xs">{reply.likes}</span>
                                                                            </div>
                                                                        </div>
                                                                        <p className="text-xs text-gray-700 leading-relaxed break-words overflow-hidden">
                                                                            {reply.content}
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center py-12">
                                            <div className="mb-4">
                                                <svg className="mx-auto h-16 w-16 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                                </svg>
                                            </div>
                                            <h3 className="text-sm font-medium text-gray-900 mb-2">Chưa có bình luận nào</h3>
                                            <p className="text-xs text-gray-500 max-w-xs mx-auto leading-relaxed">
                                                Hãy là người đầu tiên chia sẻ suy nghĩ của bạn về video này.
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
