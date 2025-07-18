'use client'

import { useState } from 'react'
import Link from 'next/link'
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
        name: 'Toán',
        videos: [
            {
                id: 'toan-1',
                s3_video: 'https://tt-phamnguyenbang.s3.ap-southeast-2.amazonaws.com/FSave.com_Facebook_Media_002_1454583192236390v.mp4',
                s3_thumbnail: 'https://tt-phamnguyenbang.s3.ap-southeast-2.amazonaws.com/7570ebd0-8983-48a3-875a-bb7ddcfd3c9a.jpg',
                title: 'Bài toán cây cầu ngắn nhất',
                created_at: '18/07/2025'
            },
            {
                id: 'toan-2',
                s3_video: 'https://tt-phamnguyenbang.s3.ap-southeast-2.amazonaws.com/FSave.com_Facebook_Media_002_1454583192236390v.mp4',
                s3_thumbnail: 'https://tt-phamnguyenbang.s3.ap-southeast-2.amazonaws.com/7570ebd0-8983-48a3-875a-bb7ddcfd3c9a.jpg',
                title: 'Phương trình bậc hai và ứng dụng',
                created_at: '15/07/2025'
            },
            {
                id: 'toan-3',
                s3_video: 'https://tt-phamnguyenbang.s3.ap-southeast-2.amazonaws.com/FSave.com_Facebook_Media_002_1454583192236390v.mp4',
                s3_thumbnail: 'https://tt-phamnguyenbang.s3.ap-southeast-2.amazonaws.com/7570ebd0-8983-48a3-875a-bb7ddcfd3c9a.jpg',
                title: 'Hình học không gian cơ bản',
                created_at: '12/07/2025'
            }
        ]
    },
    {
        id: 'ly',
        name: 'Lý',
        videos: [
            {
                id: 'ly-1',
                s3_video: 'https://tt-phamnguyenbang.s3.ap-southeast-2.amazonaws.com/FSave.com_Facebook_Media_002_1454583192236390v.mp4',
                s3_thumbnail: 'https://tt-phamnguyenbang.s3.ap-southeast-2.amazonaws.com/7570ebd0-8983-48a3-875a-bb7ddcfd3c9a.jpg',
                title: 'Định luật Newton và ứng dụng',
                created_at: '18/07/2025'
            },
            {
                id: 'ly-2',
                s3_video: 'https://tt-phamnguyenbang.s3.ap-southeast-2.amazonaws.com/FSave.com_Facebook_Media_002_1454583192236390v.mp4',
                s3_thumbnail: 'https://tt-phamnguyenbang.s3.ap-southeast-2.amazonaws.com/7570ebd0-8983-48a3-875a-bb7ddcfd3c9a.jpg',
                title: 'Dao động cơ học',
                created_at: '15/07/2025'
            },
            {
                id: 'ly-3',
                s3_video: 'https://tt-phamnguyenbang.s3.ap-southeast-2.amazonaws.com/FSave.com_Facebook_Media_002_1454583192236390v.mp4',
                s3_thumbnail: 'https://tt-phamnguyenbang.s3.ap-southeast-2.amazonaws.com/7570ebd0-8983-48a3-875a-bb7ddcfd3c9a.jpg',
                title: 'Điện trường và từ trường',
                created_at: '12/07/2025'
            }
        ]
    },
    {
        id: 'hoa',
        name: 'Hóa',
        videos: [
            {
                id: 'hoa-1',
                s3_video: 'https://tt-phamnguyenbang.s3.ap-southeast-2.amazonaws.com/FSave.com_Facebook_Media_002_1454583192236390v.mp4',
                s3_thumbnail: 'https://tt-phamnguyenbang.s3.ap-southeast-2.amazonaws.com/7570ebd0-8983-48a3-875a-bb7ddcfd3c9a.jpg',
                title: 'Phản ứng oxi hóa khử',
                created_at: '18/07/2025'
            },
            {
                id: 'hoa-2',
                s3_video: 'https://tt-phamnguyenbang.s3.ap-southeast-2.amazonaws.com/FSave.com_Facebook_Media_002_1454583192236390v.mp4',
                s3_thumbnail: 'https://tt-phamnguyenbang.s3.ap-southeast-2.amazonaws.com/7570ebd0-8983-48a3-875a-bb7ddcfd3c9a.jpg',
                title: 'Cân bằng hóa học',
                created_at: '15/07/2025'
            },
            {
                id: 'hoa-3',
                s3_video: 'https://tt-phamnguyenbang.s3.ap-southeast-2.amazonaws.com/FSave.com_Facebook_Media_002_1454583192236390v.mp4',
                s3_thumbnail: 'https://tt-phamnguyenbang.s3.ap-southeast-2.amazonaws.com/7570ebd0-8983-48a3-875a-bb7ddcfd3c9a.jpg',
                title: 'Hóa học hữu cơ cơ bản',
                created_at: '12/07/2025'
            }
        ]
    }
]

export default function KhoaHocPage() {
    const [selectedSubject, setSelectedSubject] = useState<string>('toan')

    const currentSubject = mockSubjects.find(subject => subject.id === selectedSubject)

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
                            <Link
                                key={video.id}
                                href={`/khoa-hoc/${video.id}`}
                                className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                            >
                                <div className="relative aspect-video bg-gray-200">
                                    <Image
                                        src={video.s3_thumbnail}
                                        alt={video.title}
                                        fill
                                        className="object-cover"
                                    />

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
                            </Link>
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
        </div>
    )
} 