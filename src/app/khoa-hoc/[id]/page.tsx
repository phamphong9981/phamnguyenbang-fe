'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Header from '@/components/Header'

interface Video {
    id: string
    s3_video: string
    s3_thumbnail: string
    title: string
    created_at: string
    subject: string
}

interface Comment {
    id: string
    user: string
    content: string
    timestamp: string
    replies?: Comment[]
}

// Mock data cho tất cả video
const mockVideos: Video[] = [
    {
        id: 'toan-1',
        s3_video: 'https://tt-phamnguyenbang.s3.ap-southeast-2.amazonaws.com/FSave.com_Facebook_Media_002_1454583192236390v.mp4',
        s3_thumbnail: 'https://tt-phamnguyenbang.s3.ap-southeast-2.amazonaws.com/7570ebd0-8983-48a3-875a-bb7ddcfd3c9a.jpg',
        title: 'Bài toán cây cầu ngắn nhất',
        created_at: '18/07/2025',
        subject: 'Toán'
    },
    {
        id: 'toan-2',
        s3_video: 'https://tt-phamnguyenbang.s3.ap-southeast-2.amazonaws.com/FSave.com_Facebook_Media_002_1454583192236390v.mp4',
        s3_thumbnail: 'https://tt-phamnguyenbang.s3.ap-southeast-2.amazonaws.com/7570ebd0-8983-48a3-875a-bb7ddcfd3c9a.jpg',
        title: 'Phương trình bậc hai và ứng dụng',
        created_at: '15/07/2025',
        subject: 'Toán'
    },
    {
        id: 'toan-3',
        s3_video: 'https://tt-phamnguyenbang.s3.ap-southeast-2.amazonaws.com/FSave.com_Facebook_Media_002_1454583192236390v.mp4',
        s3_thumbnail: 'https://tt-phamnguyenbang.s3.ap-southeast-2.amazonaws.com/7570ebd0-8983-48a3-875a-bb7ddcfd3c9a.jpg',
        title: 'Hình học không gian cơ bản',
        created_at: '12/07/2025',
        subject: 'Toán'
    },
    {
        id: 'ly-1',
        s3_video: 'https://tt-phamnguyenbang.s3.ap-southeast-2.amazonaws.com/FSave.com_Facebook_Media_002_1454583192236390v.mp4',
        s3_thumbnail: 'https://tt-phamnguyenbang.s3.ap-southeast-2.amazonaws.com/7570ebd0-8983-48a3-875a-bb7ddcfd3c9a.jpg',
        title: 'Định luật Newton và ứng dụng',
        created_at: '18/07/2025',
        subject: 'Lý'
    },
    {
        id: 'ly-2',
        s3_video: 'https://tt-phamnguyenbang.s3.ap-southeast-2.amazonaws.com/FSave.com_Facebook_Media_002_1454583192236390v.mp4',
        s3_thumbnail: 'https://tt-phamnguyenbang.s3.ap-southeast-2.amazonaws.com/7570ebd0-8983-48a3-875a-bb7ddcfd3c9a.jpg',
        title: 'Dao động cơ học',
        created_at: '15/07/2025',
        subject: 'Lý'
    },
    {
        id: 'ly-3',
        s3_video: 'https://tt-phamnguyenbang.s3.ap-southeast-2.amazonaws.com/FSave.com_Facebook_Media_002_1454583192236390v.mp4',
        s3_thumbnail: 'https://tt-phamnguyenbang.s3.ap-southeast-2.amazonaws.com/7570ebd0-8983-48a3-875a-bb7ddcfd3c9a.jpg',
        title: 'Điện trường và từ trường',
        created_at: '12/07/2025',
        subject: 'Lý'
    },
    {
        id: 'hoa-1',
        s3_video: 'https://tt-phamnguyenbang.s3.ap-southeast-2.amazonaws.com/FSave.com_Facebook_Media_002_1454583192236390v.mp4',
        s3_thumbnail: 'https://tt-phamnguyenbang.s3.ap-southeast-2.amazonaws.com/7570ebd0-8983-48a3-875a-bb7ddcfd3c9a.jpg',
        title: 'Phản ứng oxi hóa khử',
        created_at: '18/07/2025',
        subject: 'Hóa'
    },
    {
        id: 'hoa-2',
        s3_video: 'https://tt-phamnguyenbang.s3.ap-southeast-2.amazonaws.com/FSave.com_Facebook_Media_002_1454583192236390v.mp4',
        s3_thumbnail: 'https://tt-phamnguyenbang.s3.ap-southeast-2.amazonaws.com/7570ebd0-8983-48a3-875a-bb7ddcfd3c9a.jpg',
        title: 'Cân bằng hóa học',
        created_at: '15/07/2025',
        subject: 'Hóa'
    },
    {
        id: 'hoa-3',
        s3_video: 'https://tt-phamnguyenbang.s3.ap-southeast-2.amazonaws.com/FSave.com_Facebook_Media_002_1454583192236390v.mp4',
        s3_thumbnail: 'https://tt-phamnguyenbang.s3.ap-southeast-2.amazonaws.com/7570ebd0-8983-48a3-875a-bb7ddcfd3c9a.jpg',
        title: 'Hóa học hữu cơ cơ bản',
        created_at: '12/07/2025',
        subject: 'Hóa'
    }
]

// Mock comments data
const mockComments: Comment[] = [
    {
        id: '1',
        user: 'Học sinh A',
        content: 'Bài giảng rất hay và dễ hiểu. Cảm ơn thầy!',
        timestamp: '2 giờ trước',
        replies: [
            {
                id: '1-1',
                user: 'Giáo viên',
                content: 'Cảm ơn em! Chúc em học tốt',
                timestamp: '1 giờ trước'
            }
        ]
    },
    {
        id: '2',
        user: 'Học sinh B',
        content: 'Có thể giải thích thêm về phần cuối không ạ? Em chưa hiểu lắm',
        timestamp: '3 giờ trước'
    },
    {
        id: '3',
        user: 'Học sinh C',
        content: 'Video chất lượng tốt, âm thanh rõ ràng. Rất hữu ích cho việc ôn tập!',
        timestamp: '5 giờ trước'
    }
]

export default function VideoDetailPage() {
    const params = useParams()
    const router = useRouter()
    const [video, setVideo] = useState<Video | null>(null)
    const [comments, setComments] = useState<Comment[]>(mockComments)
    const [newComment, setNewComment] = useState('')
    const [replyingTo, setReplyingTo] = useState<string | null>(null)
    const [replyContent, setReplyContent] = useState('')

    useEffect(() => {
        const videoId = params.id as string
        const foundVideo = mockVideos.find(v => v.id === videoId)
        if (foundVideo) {
            setVideo(foundVideo)
        }
    }, [params.id])

    const handleAddComment = () => {
        if (newComment.trim()) {
            const comment: Comment = {
                id: Date.now().toString(),
                user: 'Bạn',
                content: newComment,
                timestamp: 'Vừa xong'
            }
            setComments([comment, ...comments])
            setNewComment('')
        }
    }

    const handleAddReply = (commentId: string) => {
        if (replyContent.trim()) {
            const reply: Comment = {
                id: Date.now().toString(),
                user: 'Bạn',
                content: replyContent,
                timestamp: 'Vừa xong'
            }

            setComments(comments.map(comment => {
                if (comment.id === commentId) {
                    return {
                        ...comment,
                        replies: [...(comment.replies || []), reply]
                    }
                }
                return comment
            }))

            setReplyContent('')
            setReplyingTo(null)
        }
    }

    if (!video) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Header />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
                    <div className="text-gray-400 text-6xl mb-4">📹</div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Video không tồn tại</h1>
                    <p className="text-gray-600 mb-8">Video bạn đang tìm kiếm không có sẵn.</p>
                    <button
                        onClick={() => router.push('/khoa-hoc')}
                        className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                    >
                        Quay lại khóa học
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />

            {/* Hero Section */}
            <section className="bg-gradient-to-r from-green-600 to-green-700 py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <button
                        onClick={() => router.back()}
                        className="flex items-center text-white hover:text-green-100 transition-colors mb-4"
                    >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Quay lại
                    </button>
                    <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                        {video.title}
                    </h1>
                    <div className="flex items-center text-green-100">
                        <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium mr-4">
                            {video.subject}
                        </span>
                        <span className="text-sm">{video.created_at}</span>
                    </div>
                </div>
            </section>

            {/* Main Content */}
            <section className="py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Video Player Section */}
                        <div className="lg:col-span-2">
                            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                                <div className="aspect-video bg-black">
                                    <video
                                        className="w-full h-full object-cover"
                                        controls
                                        poster={video.s3_thumbnail}
                                    >
                                        <source src={video.s3_video} type="video/mp4" />
                                        Trình duyệt của bạn không hỗ trợ video.
                                    </video>
                                </div>
                            </div>
                        </div>

                        {/* Comments Section */}
                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-lg shadow-lg p-6">
                                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                                    Bình luận ({comments.length})
                                </h2>

                                {/* Add Comment Form */}
                                <div className="mb-6">
                                    <textarea
                                        value={newComment}
                                        onChange={(e) => setNewComment(e.target.value)}
                                        placeholder="Viết bình luận..."
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                                        rows={3}
                                    />
                                    <button
                                        onClick={handleAddComment}
                                        className="mt-3 bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                                    >
                                        Gửi bình luận
                                    </button>
                                </div>

                                {/* Comments List */}
                                <div className="space-y-6">
                                    {comments.map(comment => (
                                        <div key={comment.id} className="border-b border-gray-200 pb-6 last:border-b-0">
                                            <div className="flex items-start space-x-3">
                                                <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                                                    <span className="text-white font-medium text-sm">
                                                        {comment.user[0]}
                                                    </span>
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center space-x-2 mb-2">
                                                        <span className="font-medium text-gray-900">{comment.user}</span>
                                                        <span className="text-sm text-gray-500">{comment.timestamp}</span>
                                                    </div>
                                                    <p className="text-gray-700 mb-3">{comment.content}</p>

                                                    <button
                                                        onClick={() => setReplyingTo(comment.id)}
                                                        className="text-sm text-green-600 hover:text-green-700 font-medium"
                                                    >
                                                        Trả lời
                                                    </button>

                                                    {/* Reply Form */}
                                                    {replyingTo === comment.id && (
                                                        <div className="mt-4">
                                                            <textarea
                                                                value={replyContent}
                                                                onChange={(e) => setReplyContent(e.target.value)}
                                                                placeholder="Viết trả lời..."
                                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none text-sm"
                                                                rows={2}
                                                            />
                                                            <div className="flex space-x-2 mt-2">
                                                                <button
                                                                    onClick={() => handleAddReply(comment.id)}
                                                                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-1 rounded text-sm font-medium transition-colors"
                                                                >
                                                                    Gửi
                                                                </button>
                                                                <button
                                                                    onClick={() => setReplyingTo(null)}
                                                                    className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-1 rounded text-sm font-medium transition-colors"
                                                                >
                                                                    Hủy
                                                                </button>
                                                            </div>
                                                        </div>
                                                    )}

                                                    {/* Replies */}
                                                    {comment.replies && comment.replies.length > 0 && (
                                                        <div className="mt-4 space-y-3">
                                                            {comment.replies.map(reply => (
                                                                <div key={reply.id} className="flex items-start space-x-3 ml-4">
                                                                    <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center flex-shrink-0">
                                                                        <span className="text-white font-medium text-xs">
                                                                            {reply.user[0]}
                                                                        </span>
                                                                    </div>
                                                                    <div className="flex-1 min-w-0">
                                                                        <div className="flex items-center space-x-2 mb-1">
                                                                            <span className="font-medium text-gray-900 text-sm">{reply.user}</span>
                                                                            <span className="text-xs text-gray-500">{reply.timestamp}</span>
                                                                        </div>
                                                                        <p className="text-gray-700 text-sm">{reply.content}</p>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
} 