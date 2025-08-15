'use client'

import React, { useState, useEffect } from 'react'

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
    const [comments, setComments] = useState<Comment[]>(video?.comments || [])

    // Update comments when video changes
    useEffect(() => {
        setComments(video?.comments || [])
    }, [video?.comments])

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
    `

    const handleSubmitComment = () => {
        if (!newComment.trim() || !video) return

        // Trong thực tế, đây sẽ là API call để lưu comment
        const newCommentObj: Comment = {
            id: Date.now().toString(),
            user_name: 'Bạn',
            user_avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face',
            content: newComment,
            created_at: 'Vừa xong',
            likes: 0
        }

        // Cập nhật state local thay vì mutate object gốc
        setComments(prevComments => [newCommentObj, ...prevComments])
        setNewComment('')
    }

    const handleLikeComment = (commentId: string) => {
        setComments(prevComments =>
            prevComments.map(comment =>
                comment.id === commentId
                    ? { ...comment, likes: comment.likes + 1 }
                    : comment
            )
        )
    }

    if (!isOpen || !video) return null

    return (
        <>
            <style dangerouslySetInnerHTML={{ __html: scrollbarStyles }} />
            <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full h-[85vh] lg:h-[90vh] max-h-[98vh] overflow-hidden">
                    {/* Modal Header */}
                    <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-green-700">
                        <div>
                            <h3 className="text-xl font-bold">{video.title}</h3>
                            <div className="flex items-center space-x-4 mt-2 text-sm text-gray-300">
                                <span>{video.created_at}</span>
                                {video.views && (
                                    <span className="flex items-center">
                                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                        {video.views.toLocaleString()}
                                    </span>
                                )}
                                {video.likes && (
                                    <span className="flex items-center">
                                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                        </svg>
                                        {video.likes}
                                    </span>
                                )}
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-amber-100 hover:text-amber-200 transition-colors"
                        >
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    <div className="flex flex-col lg:flex-row h-full">
                        {/* Video Player */}
                        <div className="lg:w-7/12 flex flex-col">
                            <div className="aspect-video bg-black flex-shrink-0">
                                <video
                                    className="w-full h-full object-cover"
                                    controls
                                    autoPlay
                                    poster={video.s3_thumbnail}
                                >
                                    <source src={video.s3_video} type="video/mp4" />
                                    Trình duyệt của bạn không hỗ trợ video.
                                </video>
                            </div>

                            {/* Video Info */}
                            <div className="p-6 flex-1 overflow-y-auto">
                                <div className="flex items-center space-x-4 mb-4">
                                    <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                                        {currentChapterName}
                                    </span>
                                </div>

                                {/* Description */}
                                <div className="prose max-w-none">
                                    <p className="text-gray-700 leading-relaxed">
                                        {video.description || 'Chưa có mô tả cho video này.'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Comments Section */}
                        <div className="lg:w-5/12 border-l border-gray-200 bg-gray-50 flex flex-col h-full">
                            <div className="p-3 flex-shrink-0 border-b border-gray-200">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                    Bình luận ({comments.length})
                                </h3>

                                {/* Comment Input */}
                                <div className="flex space-x-3">
                                    <div className="flex-shrink-0">
                                        <img
                                            className="h-10 w-10 rounded-full"
                                            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face"
                                            alt="Your avatar"
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <div className="border border-gray-300 rounded-lg shadow-sm overflow-hidden focus-within:border-green-500 focus-within:ring-1 focus-within:ring-green-500">
                                            <textarea
                                                rows={3}
                                                className="block w-full py-3 px-4 resize-none border-0 focus:ring-0 sm:text-sm"
                                                placeholder="Viết bình luận..."
                                                value={newComment}
                                                onChange={(e) => setNewComment(e.target.value)}
                                            />
                                            <div className="flex items-center justify-between px-4 py-3 bg-gray-50">
                                                <div className="flex items-center space-x-4">
                                                    <button
                                                        type="button"
                                                        className="text-gray-400 hover:text-gray-600"
                                                    >
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                                                        </svg>
                                                    </button>
                                                </div>
                                                <button
                                                    onClick={handleSubmitComment}
                                                    disabled={!newComment.trim()}
                                                    className="bg-green-600 hover:bg-green-700 disabled:bg-gray-300 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                                                >
                                                    Bình luận
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Comments List with Scroll */}
                            <div className="flex-1 overflow-y-auto custom-scrollbar">
                                <div className="p-6 space-y-4">
                                    {comments && comments.length > 0 ? (
                                        comments.map((comment) => (
                                            <div key={comment.id} className="flex space-x-3">
                                                <div className="flex-shrink-0">
                                                    <img
                                                        className="h-10 w-10 rounded-full"
                                                        src={comment.user_avatar}
                                                        alt={comment.user_name}
                                                    />
                                                </div>
                                                <div className="flex-1">
                                                    <div className="bg-white rounded-lg px-4 py-3 shadow-sm">
                                                        <div className="flex items-center justify-between">
                                                            <div className="flex items-center space-x-2">
                                                                <p className="text-sm font-medium text-gray-900">
                                                                    {comment.user_name}
                                                                </p>
                                                                <p className="text-sm text-gray-500">
                                                                    {comment.created_at}
                                                                </p>
                                                            </div>
                                                            <button
                                                                onClick={() => handleLikeComment(comment.id)}
                                                                className="flex items-center space-x-1 text-gray-500 hover:text-red-500 transition-colors"
                                                            >
                                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                                                </svg>
                                                                <span className="text-sm">{comment.likes}</span>
                                                            </button>
                                                        </div>
                                                        <p className="text-sm text-gray-700 mt-1">
                                                            {comment.content}
                                                        </p>
                                                    </div>

                                                    {/* Replies */}
                                                    {comment.replies && comment.replies.length > 0 && (
                                                        <div className="mt-3 ml-6 space-y-3">
                                                            {comment.replies.map((reply) => (
                                                                <div key={reply.id} className="flex space-x-3">
                                                                    <div className="flex-shrink-0">
                                                                        <img
                                                                            className="h-8 w-8 rounded-full"
                                                                            src={reply.user_avatar}
                                                                            alt={reply.user_name}
                                                                        />
                                                                    </div>
                                                                    <div className="flex-1">
                                                                        <div className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2">
                                                                            <div className="flex items-center justify-between">
                                                                                <div className="flex items-center space-x-2">
                                                                                    <p className="text-sm font-medium text-gray-900">
                                                                                        {reply.user_name}
                                                                                    </p>
                                                                                    <p className="text-sm text-gray-500">
                                                                                        {reply.created_at}
                                                                                    </p>
                                                                                </div>
                                                                                <button
                                                                                    onClick={() => handleLikeComment(reply.id)}
                                                                                    className="flex items-center space-x-1 text-gray-500 hover:text-red-500 transition-colors"
                                                                                >
                                                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                                                                    </svg>
                                                                                    <span className="text-sm">{reply.likes}</span>
                                                                                </button>
                                                                            </div>
                                                                            <p className="text-sm text-gray-700 mt-1">
                                                                                {reply.content}
                                                                            </p>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center py-8">
                                            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                            </svg>
                                            <h3 className="mt-2 text-sm font-medium text-gray-900">Chưa có bình luận</h3>
                                            <p className="mt-1 text-sm text-gray-500">
                                                Hãy là người đầu tiên bình luận về video này.
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
