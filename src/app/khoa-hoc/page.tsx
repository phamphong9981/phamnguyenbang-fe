'use client'

import { useState } from 'react'
import Image from 'next/image'
import Header from '@/components/Header'
import VideoModal from '@/components/VideoModal'
import { mockSubjects, Video } from './mock-data'

export default function KhoaHocPage() {
    const [selectedSubject, setSelectedSubject] = useState<string>('toan')
    const [selectedGrade, setSelectedGrade] = useState<string>('lop10')
    const [selectedChapter, setSelectedChapter] = useState<string>('chuong1')
    const [selectedVideo, setSelectedVideo] = useState<Video | null>(null)
    const [isVideoModalOpen, setIsVideoModalOpen] = useState(false)

    const currentSubject = mockSubjects.find(subject => subject.id === selectedSubject)
    const currentGrade = currentSubject?.grades?.find(grade => grade.id === selectedGrade)
    const currentChapter = currentGrade?.chapters.find(chapter => chapter.id === selectedChapter)

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
                        {/* Khám phá các khóa học video chất lượng cao với phương pháp giảng dạy hiện đại,
                        giúp bạn nắm vững kiến thức và đạt kết quả tốt nhất. */}
                        Lộ trình học của trung tâm, ứng với mỗi phần Toán THPT, HSA, TSA sẽ có các lộ trình riêng (sẽ có file lộ trình gửi kèm để sửa)
                    </p>
                </div>
            </section>

            {/* Main Content */}
            <section className="py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col lg:flex-row gap-8">
                        {/* Sidebar Menu */}
                        <div className="lg:w-80 flex-shrink-0">
                            <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                                {/* Subject Selection */}
                                <div className="p-4 border-b border-gray-200">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Môn học</h3>
                                    <div className="space-y-2">
                                        {mockSubjects.map(subject => (
                                            <button
                                                key={subject.id}
                                                onClick={() => setSelectedSubject(subject.id)}
                                                className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 ${selectedSubject === subject.id
                                                    ? 'bg-green-600 text-white shadow-md'
                                                    : 'text-gray-700 hover:bg-green-50 hover:text-green-600'
                                                    }`}
                                            >
                                                <div className="flex items-center justify-between">
                                                    <span className="font-medium">{subject.name}</span>
                                                    {selectedSubject === subject.id && (
                                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                        </svg>
                                                    )}
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Grade and Chapter Navigation */}
                                {currentSubject?.grades && (
                                    <div className="p-4">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-3">Nội dung học</h3>
                                        <div className="space-y-3">
                                            {currentSubject.grades.map(grade => (
                                                <div key={grade.id} className="space-y-2">
                                                    {/* Grade Button */}
                                                    <button
                                                        onClick={() => {
                                                            setSelectedGrade(grade.id)
                                                            setSelectedChapter(grade.chapters[0]?.id || '')
                                                        }}
                                                        className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 ${selectedGrade === grade.id
                                                            ? 'bg-green-100 text-green-700 border-2 border-green-300'
                                                            : 'text-gray-700 hover:bg-gray-50'
                                                            }`}
                                                    >
                                                        <div className="flex items-center justify-between">
                                                            <span className="font-medium">{grade.name}</span>
                                                            <svg className={`w-5 h-5 transition-transform duration-200 ${selectedGrade === grade.id ? 'rotate-180' : ''
                                                                }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                            </svg>
                                                        </div>
                                                    </button>

                                                    {/* Chapter Submenu */}
                                                    {selectedGrade === grade.id && (
                                                        <div className="ml-4 space-y-1">
                                                            {grade.chapters.map(chapter => (
                                                                <button
                                                                    key={chapter.id}
                                                                    onClick={() => setSelectedChapter(chapter.id)}
                                                                    className={`w-full text-left px-4 py-2 rounded-lg transition-all duration-200 text-sm ${selectedChapter === chapter.id
                                                                        ? 'bg-green-600 text-white shadow-sm'
                                                                        : 'text-gray-600 hover:bg-green-50 hover:text-green-600'
                                                                        }`}
                                                                >
                                                                    <div className="flex items-center justify-between">
                                                                        <span className="truncate">{chapter.name}</span>
                                                                        {selectedChapter === chapter.id && (
                                                                            <div className="w-2 h-2 bg-white rounded-full"></div>
                                                                        )}
                                                                    </div>
                                                                </button>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Main Content Area */}
                        <div className="flex-1">
                            {/* Current Selection Info */}
                            {currentChapter && (
                                <div className="mb-8">
                                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
                                        <div className="flex items-center space-x-3 mb-2">
                                            <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                                                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                                </svg>
                                            </div>
                                            <h2 className="text-2xl font-bold text-gray-900">{currentChapter.name}</h2>
                                        </div>
                                        <p className="text-gray-600">
                                            {currentGrade?.name} • {currentSubject?.name}
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* Video Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                                {currentChapter?.theoryVideos.map(video => (
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
                                                    {currentChapter?.name}
                                                </span>
                                                <span>{video.created_at}</span>
                                            </div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
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
            <VideoModal
                isOpen={isVideoModalOpen}
                video={selectedVideo}
                currentChapterName={currentChapter?.name}
                onClose={closeVideoModal}
            />
        </div>
    )
} 