'use client'

import { useState } from 'react'
import Image from 'next/image'
import Header from '@/components/Header'

interface Video {
    id: string
    s3_video: string
    s3_thumbnail: string
    title: string
    created_at: string
}

interface Subject {
    id: string
    name: string
    videos: Video[]
}

// Mock data cho 3 môn học
const mockSubjects: Subject[] = [
    {
        id: 'toan',
        name: 'Toán THPT',
        videos: [
            {
                id: 'toan-1',
                s3_video: 'https://tt-phamnguyenbang.s3.ap-southeast-2.amazonaws.com/video/L%C3%BD+thuy%E1%BA%BFt+%C4%91%C6%A1n+%C4%91i%E1%BB%87u+P1.mp4',
                s3_thumbnail: 'https://tt-phamnguyenbang.s3.ap-southeast-2.amazonaws.com/video/L%C3%BD+thuy%E1%BA%BFt+%C4%91%C6%A1n+%C4%91i%E1%BB%87u+P1.png',
                title: 'Lý thuyết đơn điệu Buổi 1',
                created_at: '18/07/2025'
            },
            {
                id: 'toan-2',
                s3_video: 'https://tt-phamnguyenbang.s3.ap-southeast-2.amazonaws.com/video/L%C3%BD+thuy%E1%BA%BFt+%C4%91%C6%A1n+%C4%91i%E1%BB%87u+P2.mp4',
                s3_thumbnail: 'https://tt-phamnguyenbang.s3.ap-southeast-2.amazonaws.com/video/L%C3%BD+thuy%E1%BA%BFt+%C4%91%C6%A1n+%C4%91i%E1%BB%87u+P2.png',
                title: 'Lý thuyết đơn điệu Buổi 2',
                created_at: '15/07/2025'
            },
            {
                id: 'toan-3',
                s3_video: 'https://tt-phamnguyenbang.s3.ap-southeast-2.amazonaws.com/video/C%E1%BB%B1c+tr%E1%BB%8B+h%C3%A0m+s%E1%BB%91.mp4',
                s3_thumbnail: 'https://tt-phamnguyenbang.s3.ap-southeast-2.amazonaws.com/video/C%E1%BB%B1c+tr%E1%BB%8B+h%C3%A0m+s%E1%BB%91.png',
                title: 'Cực trị hàm số',
                created_at: '12/07/2025'
            },
            {
                id: 'toan-4',
                s3_video: 'https://tt-phamnguyenbang.s3.ap-southeast-2.amazonaws.com/video/Gi%C3%A1+tr%E1%BB%8B+l%E1%BB%9Bn+nh%E1%BA%A5t+v%C3%A0+nh%E1%BB%8F+nh%E1%BA%A5t.mp4',
                s3_thumbnail: 'https://tt-phamnguyenbang.s3.ap-southeast-2.amazonaws.com/video/Gi%C3%A1+tr%E1%BB%8B+l%E1%BB%9Bn+nh%E1%BA%A5t+v%C3%A0+nh%E1%BB%8F+nh%E1%BA%A5t.png',
                title: 'Giá trị lớn nhất và nhỏ nhất',
                created_at: '12/07/2025'
            },
        ]
    },
    {
        id: 'tsa',
        name: 'TSA',
        videos: [
            {
                id: 'ly-1',
                s3_video: 'https://tt-phamnguyenbang.s3.ap-southeast-2.amazonaws.com/video/TSA+P1.mp4',
                s3_thumbnail: 'https://tt-phamnguyenbang.s3.ap-southeast-2.amazonaws.com/video/TSA+P1.png',
                title: 'TSA Buổi 1',
                created_at: '18/07/2025'
            },
        ]
    },
    {
        id: 'hsa',
        name: 'HSA',
        videos: [
            {
                id: 'hoa-1',
                s3_video: 'https://tt-phamnguyenbang.s3.ap-southeast-2.amazonaws.com/video/HSA+P1.mp4',
                s3_thumbnail: 'https://tt-phamnguyenbang.s3.ap-southeast-2.amazonaws.com/video/HSA+P1.png',
                title: 'HSA buổi 1',
                created_at: '18/07/2025'
            },
            {
                id: 'hoa-2',
                s3_video: 'https://tt-phamnguyenbang.s3.ap-southeast-2.amazonaws.com/video/HSA+P2.mp4',
                s3_thumbnail: 'https://tt-phamnguyenbang.s3.ap-southeast-2.amazonaws.com/video/HSA+P2.png',
                title: 'HSA buổi 2',
                created_at: '15/07/2025'
            },
        ]
    }
]

export default function KhoaHocPage() {
    const [selectedSubject, setSelectedSubject] = useState<string>('toan')
    const [selectedVideo, setSelectedVideo] = useState<Video | null>(null)
    const [isVideoModalOpen, setIsVideoModalOpen] = useState(false)

    const currentSubject = mockSubjects.find(subject => subject.id === selectedSubject)

    const openVideoModal = (video: Video) => {
        setSelectedVideo(video)
        setIsVideoModalOpen(true)
    }

    const closeVideoModal = () => {
        setIsVideoModalOpen(false)
        setSelectedVideo(null)
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />

            {/* Hero Section */}
            <section className="bg-gradient-to-r from-green-600 to-green-700 py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
                        Khóa học Video
                    </h1>
                    <p className="text-xl text-green-100 max-w-3xl mx-auto">
                        Khám phá các khóa học video chất lượng cao với phương pháp giảng dạy hiện đại,
                        giúp bạn nắm vững kiến thức và đạt kết quả tốt nhất.
                    </p>
                </div>
            </section>

            {/* Main Content */}
            <section className="py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Subject Navigation */}
                    <div className="mb-8">
                        <div className="flex flex-wrap gap-4 justify-center border-b border-gray-200">
                            {mockSubjects.map(subject => (
                                <button
                                    key={subject.id}
                                    onClick={() => setSelectedSubject(subject.id)}
                                    className={`px-6 py-3 text-sm font-medium rounded-t-lg transition-all duration-200 ${selectedSubject === subject.id
                                        ? 'bg-green-600 text-white border-b-2 border-green-600'
                                        : 'text-gray-600 hover:text-green-600 hover:bg-green-50'
                                        }`}
                                >
                                    {subject.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Video Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {currentSubject?.videos.map(video => (
                            <button
                                key={video.id}
                                onClick={() => openVideoModal(video)}
                                className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 text-left w-full"
                            >
                                <div className="relative aspect-video bg-gray-200">
                                    <Image
                                        src={video.s3_thumbnail}
                                        alt={video.title}
                                        fill
                                        className="object-cover"
                                    />
                                    {/* Play button overlay */}
                                    <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
                                        <div className="w-16 h-16 bg-white bg-opacity-90 rounded-full flex items-center justify-center">
                                            <svg className="w-8 h-8 text-green-600 ml-1" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M8 5v14l11-7z" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-6">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                                        {video.title}
                                    </h3>
                                    <div className="flex items-center justify-between text-sm text-gray-600">
                                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                                            {currentSubject?.name}
                                        </span>
                                        <span>{video.created_at}</span>
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="bg-green-600 py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
                        <div>
                            <div className="text-4xl font-bold text-white mb-2">50+</div>
                            <div className="text-green-100">Video bài giảng</div>
                        </div>
                        <div>
                            <div className="text-4xl font-bold text-white mb-2">3</div>
                            <div className="text-green-100">Môn học chính</div>
                        </div>
                        <div>
                            <div className="text-4xl font-bold text-white mb-2">1000+</div>
                            <div className="text-green-100">Học viên</div>
                        </div>
                        <div>
                            <div className="text-4xl font-bold text-white mb-2">95%</div>
                            <div className="text-green-100">Hài lòng</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Video Modal */}
            {isVideoModalOpen && selectedVideo && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between p-6 border-b border-gray-200">
                            <div>
                                <h3 className="text-xl font-bold text-gray-900">{selectedVideo.title}</h3>
                                <p className="text-sm text-gray-600 mt-1">{selectedVideo.created_at}</p>
                            </div>
                            <button
                                onClick={closeVideoModal}
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Video Player */}
                        <div className="aspect-video bg-black">
                            <video
                                className="w-full h-full object-cover"
                                controls
                                autoPlay
                                poster={selectedVideo.s3_thumbnail}
                            >
                                <source src={selectedVideo.s3_video} type="video/mp4" />
                                Trình duyệt của bạn không hỗ trợ video.
                            </video>
                        </div>

                        {/* Modal Footer */}
                        <div className="p-6 bg-gray-50">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-4">
                                    <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                                        {currentSubject?.name}
                                    </span>
                                    <span className="text-sm text-gray-600">
                                        Video bài giảng chất lượng cao
                                    </span>
                                </div>
                                <button
                                    onClick={closeVideoModal}
                                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                                >
                                    Đóng
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
} 