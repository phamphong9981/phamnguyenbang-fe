'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Header from '@/components/Header'
import VideoModal from '@/components/VideoModal'
import { useSubjectsList, useChapterById, VideoResponseDto } from '@/hooks/useCourse'

// Video interface for modal compatibility
interface Video {
    id: string
    s3_video: string
    s3_thumbnail: string
    title: string
    created_at: string
    description?: string
    views?: number
    likes?: number
}

export default function KhoaHocPage() {
    const [selectedSubject, setSelectedSubject] = useState<string>('')
    const [selectedGrade, setSelectedGrade] = useState<string>('')
    const [selectedChapter, setSelectedChapter] = useState<string>('')
    const [selectedVideo, setSelectedVideo] = useState<Video | null>(null)
    const [isVideoModalOpen, setIsVideoModalOpen] = useState(false)
    const [activeTab, setActiveTab] = useState<'theory' | 'exercise'>('theory')

    // Fetch subjects list
    const { data: subjects, isLoading: subjectsLoading, error: subjectsError } = useSubjectsList()

    // Fetch chapter details when selectedChapter changes
    const { data: chapterData, isLoading: chapterLoading, error: chapterError } = useChapterById(selectedChapter)

    // Initialize selections when subjects are loaded
    useEffect(() => {
        if (subjects && subjects.length > 0 && !selectedSubject) {
            const firstSubject = subjects[0]
            setSelectedSubject(firstSubject.id)

            if (firstSubject.grades && firstSubject.grades.length > 0) {
                const firstGrade = firstSubject.grades[0]
                setSelectedGrade(firstGrade.id)

                if (firstGrade.chapters && firstGrade.chapters.length > 0) {
                    setSelectedChapter(firstGrade.chapters[0].id)
                }
            }
        }
    }, [subjects, selectedSubject])

    const currentSubject = subjects?.find(subject => subject.id === selectedSubject)
    const currentGrade = currentSubject?.grades?.find(grade => grade.id === selectedGrade)
    const currentChapter = currentGrade?.chapters.find(chapter => chapter.id === selectedChapter)

    const openVideoModal = (video: VideoResponseDto) => {
        // Convert VideoResponseDto to Video interface for modal compatibility
        const modalVideo: Video = {
            id: video.id,
            s3_video: video.s3Video,
            s3_thumbnail: video.s3Thumbnail,
            title: video.title,
            created_at: new Date().toLocaleDateString('vi-VN'),
            description: video.description
        }
        setSelectedVideo(modalVideo)
        setIsVideoModalOpen(true)
    }

    const closeVideoModal = () => {
        setIsVideoModalOpen(false)
        setSelectedVideo(null)
    }

    // Helper functions to get videos by type
    const getTheoryVideos = () => {
        return chapterData?.videos.filter(video => video.videoType === 'theory') || []
    }

    const getExerciseVideos = () => {
        return chapterData?.videos.filter(video => video.videoType === 'exercise') || []
    }

    // Show loading state
    if (subjectsLoading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Header />
                <div className="flex items-center justify-center min-h-[400px]">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
                        <p className="text-gray-600">Đang tải khóa học...</p>
                    </div>
                </div>
            </div>
        )
    }

    // Show error state
    if (subjectsError) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Header />
                <div className="flex items-center justify-center min-h-[400px]">
                    <div className="text-center">
                        <div className="text-red-600 mb-4">
                            <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                            </svg>
                        </div>
                        <p className="text-gray-600">Không thể tải khóa học. Vui lòng thử lại sau.</p>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />

            {/* Hero Section - More compact and focused */}
            <section className="bg-gradient-to-br from-green-600 via-green-700 to-emerald-800 py-12 relative overflow-hidden">
                <div className="absolute inset-0 bg-black/10"></div>
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">
                            📚 Thư viện Video Học tập
                        </h1>
                        <p className="text-lg text-green-100 max-w-2xl mx-auto">
                            Lộ trình học có hệ thống cho Toán THPT, HSA, TSA
                        </p>
                    </div>

                    {/* Breadcrumb */}
                    {currentSubject && currentGrade && currentChapter && (
                        <div className="flex items-center justify-center space-x-2 text-green-100 text-sm">
                            <span className="bg-white/20 px-3 py-1 rounded-full">{currentSubject.name}</span>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                            <span className="bg-white/20 px-3 py-1 rounded-full">{currentGrade.name}</span>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                            <span className="bg-white/30 px-3 py-1 rounded-full font-medium">{currentChapter.name}</span>
                        </div>
                    )}
                </div>
            </section>

            {/* Main Content */}
            <section className="py-8">
                <div className="xl:max-w-9/12 mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col xl:flex-row gap-6">
                        {/* Sidebar Menu - Redesigned */}
                        <div className="xl:w-100 flex-shrink-0">
                            <div className="sticky top-4">
                                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                                    {/* Quick Stats */}
                                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 border-b border-gray-100">
                                        <div className="flex items-center justify-between text-sm">
                                            <div className="text-center">
                                                <div className="text-lg font-bold text-blue-600">{subjects?.length || 0}</div>
                                                <div className="text-blue-600">Môn học</div>
                                            </div>
                                            <div className="text-center">
                                                <div className="text-lg font-bold text-indigo-600">
                                                    {currentSubject?.grades?.reduce((total, grade) => total + (grade.chapters?.length || 0), 0) || 0}
                                                </div>
                                                <div className="text-indigo-600">Chương</div>
                                            </div>
                                            <div className="text-center">
                                                <div className="text-lg font-bold text-purple-600">
                                                    {chapterData?.videos?.length || 0}
                                                </div>
                                                <div className="text-purple-600">Video</div>
                                            </div>
                                        </div>
                                    </div>
                                    {/* Subject Selection - Improved */}
                                    <div className="p-6">
                                        <div className="flex items-center mb-4">
                                            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                                                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                                </svg>
                                            </div>
                                            <h3 className="text-lg font-bold text-gray-900">Chọn môn học</h3>
                                        </div>
                                        <div className="grid grid-cols-1 gap-3">
                                            {subjects?.map(subject => (
                                                <button
                                                    key={subject.id}
                                                    onClick={() => {
                                                        setSelectedSubject(subject.id)
                                                        // Reset grade and chapter when subject changes
                                                        if (subject.grades && subject.grades.length > 0) {
                                                            const firstGrade = subject.grades[0]
                                                            setSelectedGrade(firstGrade.id)
                                                            if (firstGrade.chapters && firstGrade.chapters.length > 0) {
                                                                setSelectedChapter(firstGrade.chapters[0].id)
                                                            }
                                                        }
                                                    }}
                                                    className={`group relative p-4 rounded-xl border-2 transition-all duration-200 text-left ${selectedSubject === subject.id
                                                        ? 'border-green-500 bg-green-50 shadow-md'
                                                        : 'border-gray-200 hover:border-green-300 hover:bg-green-50/50'
                                                        }`}
                                                >
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center">
                                                            <div className={`w-3 h-3 rounded-full mr-3 ${selectedSubject === subject.id ? 'bg-green-500' : 'bg-gray-300 group-hover:bg-green-400'}`}></div>
                                                            <span className={`font-semibold ${selectedSubject === subject.id ? 'text-green-700' : 'text-gray-700'}`}>
                                                                {subject.name}
                                                            </span>
                                                        </div>
                                                        <div className="text-xs text-gray-500">
                                                            {subject.grades?.length || 0} cấp độ
                                                        </div>
                                                    </div>

                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Grade and Chapter Navigation - Redesigned */}
                                    {currentSubject?.grades && (
                                        <div className="border-t border-gray-100">
                                            <div className="p-6">
                                                <div className="flex items-center mb-4">
                                                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                                                        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                                        </svg>
                                                    </div>
                                                    <h3 className="text-lg font-bold text-gray-900">Chọn chương học</h3>
                                                </div>
                                                <div className="space-y-4">
                                                    {currentSubject.grades.map(grade => (
                                                        <div key={grade.id} className="border border-gray-200 rounded-xl overflow-hidden">
                                                            {/* Grade Header */}
                                                            <button
                                                                onClick={() => {
                                                                    setSelectedGrade(grade.id)
                                                                    setSelectedChapter(grade.chapters[0]?.id || '')
                                                                }}
                                                                className={`w-full text-left p-4 transition-all duration-200 ${selectedGrade === grade.id
                                                                    ? 'bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-200'
                                                                    : 'bg-gray-50 hover:bg-blue-50'
                                                                    }`}
                                                            >
                                                                <div className="flex items-center justify-between">
                                                                    <div className="flex items-center">
                                                                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center mr-3 ${selectedGrade === grade.id
                                                                            ? 'bg-blue-500 text-white'
                                                                            : 'bg-gray-300 text-gray-600'
                                                                            }`}>
                                                                            <span className="text-sm font-bold">{grade.name.charAt(0)}</span>
                                                                        </div>
                                                                        <div>
                                                                            <div className={`font-semibold ${selectedGrade === grade.id ? 'text-blue-700' : 'text-gray-700'}`}>
                                                                                {grade.name}
                                                                            </div>
                                                                            <div className="text-xs text-gray-500">
                                                                                {grade.chapters?.length || 0} chương
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <svg className={`w-5 h-5 transition-transform duration-200 ${selectedGrade === grade.id ? 'rotate-180 text-blue-600' : 'text-gray-400'}`}
                                                                        fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                                    </svg>
                                                                </div>
                                                            </button>

                                                            {/* Chapter List */}
                                                            {selectedGrade === grade.id && (
                                                                <div className="bg-white">
                                                                    {grade.chapters.map((chapter, index) => (
                                                                        <button
                                                                            key={chapter.id}
                                                                            onClick={() => setSelectedChapter(chapter.id)}
                                                                            className={`w-full text-left p-3 pl-6 transition-all duration-200 border-l-4 ${selectedChapter === chapter.id
                                                                                ? 'border-l-green-500 bg-green-50 text-green-700'
                                                                                : 'border-l-transparent hover:bg-gray-50 hover:border-l-gray-300'
                                                                                } ${index !== grade.chapters.length - 1 ? 'border-b border-gray-100' : ''}`}
                                                                        >
                                                                            <div className="flex items-center justify-between">
                                                                                <div className="flex items-center">
                                                                                    <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-3 text-xs font-bold ${selectedChapter === chapter.id
                                                                                        ? 'bg-green-500 text-white'
                                                                                        : 'bg-gray-200 text-gray-600'
                                                                                        }`}>
                                                                                        {index + 1}
                                                                                    </div>
                                                                                    <span className="text-sm font-medium truncate">{chapter.name}</span>
                                                                                </div>
                                                                                {selectedChapter === chapter.id && (
                                                                                    <div className="flex items-center">
                                                                                        <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                                                                                        <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                                                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                                                        </svg>
                                                                                    </div>
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
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Main Content Area - Redesigned */}
                        <div className="flex-1 min-w-0">
                            {/* Enhanced Chapter Info Header */}
                            {currentChapter && (
                                <div className="mb-6">
                                    <div className="bg-gradient-to-br from-indigo-50 via-blue-50 to-cyan-50 rounded-2xl p-6 border border-indigo-100 shadow-sm">
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="flex items-center space-x-4">
                                                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                                    </svg>
                                                </div>
                                                <div>
                                                    <h2 className="text-2xl font-bold text-gray-900 mb-1">{currentChapter.name}</h2>
                                                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                                                        <span className="bg-white/60 px-3 py-1 rounded-full font-medium">{currentSubject?.name}</span>
                                                        <span className="text-gray-400">•</span>
                                                        <span className="bg-white/60 px-3 py-1 rounded-full font-medium">{currentGrade?.name}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-2xl font-bold text-indigo-600">{chapterData?.videos?.length || 0}</div>
                                                <div className="text-sm text-indigo-600">Video</div>
                                            </div>
                                        </div>

                                        {/* Progress Bar */}
                                        <div className="bg-white/60 rounded-full h-2 overflow-hidden">
                                            <div className="h-full bg-gradient-to-r from-indigo-500 to-blue-500 rounded-full" style={{ width: '0%' }}></div>
                                        </div>
                                        <div className="flex justify-between text-xs text-gray-600 mt-1">
                                            <span>Tiến độ học tập</span>
                                            <span>0% hoàn thành</span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Enhanced Navigation Tabs */}
                            {currentChapter && (
                                <div className="mb-6">
                                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-2">
                                        <div className="grid grid-cols-2 gap-2">
                                            <button
                                                onClick={() => setActiveTab('theory')}
                                                className={`relative flex items-center justify-center space-x-3 py-4 px-6 rounded-xl font-semibold text-sm transition-all duration-300 ${activeTab === 'theory'
                                                    ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-200'
                                                    : 'text-gray-600 hover:bg-blue-50 hover:text-blue-600'
                                                    }`}
                                            >
                                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${activeTab === 'theory'
                                                    ? 'bg-white/20'
                                                    : 'bg-blue-100'
                                                    }`}>
                                                    <svg className={`w-5 h-5 ${activeTab === 'theory' ? 'text-white' : 'text-blue-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                                    </svg>
                                                </div>
                                                <div className="text-left">
                                                    <div>📚 Lý thuyết</div>
                                                    <div className={`text-xs ${activeTab === 'theory' ? 'text-blue-100' : 'text-gray-500'}`}>
                                                        {getTheoryVideos().length} video
                                                    </div>
                                                </div>
                                                {activeTab === 'theory' && (
                                                    <div className="absolute top-2 right-2 w-2 h-2 bg-white rounded-full"></div>
                                                )}
                                            </button>
                                            <button
                                                onClick={() => setActiveTab('exercise')}
                                                className={`relative flex items-center justify-center space-x-3 py-4 px-6 rounded-xl font-semibold text-sm transition-all duration-300 ${activeTab === 'exercise'
                                                    ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-200'
                                                    : 'text-gray-600 hover:bg-orange-50 hover:text-orange-600'
                                                    }`}
                                            >
                                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${activeTab === 'exercise'
                                                    ? 'bg-white/20'
                                                    : 'bg-orange-100'
                                                    }`}>
                                                    <svg className={`w-5 h-5 ${activeTab === 'exercise' ? 'text-white' : 'text-orange-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                </div>
                                                <div className="text-left">
                                                    <div>🎯 Bài tập</div>
                                                    <div className={`text-xs ${activeTab === 'exercise' ? 'text-orange-100' : 'text-gray-500'}`}>
                                                        {getExerciseVideos().length} video
                                                    </div>
                                                </div>
                                                {activeTab === 'exercise' && (
                                                    <div className="absolute top-2 right-2 w-2 h-2 bg-white rounded-full"></div>
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Theory Videos Section */}
                            {activeTab === 'theory' && (
                                <>
                                    {chapterLoading && (
                                        <div className="flex items-center justify-center py-12">
                                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                                            <span className="ml-3 text-gray-600">Đang tải video...</span>
                                        </div>
                                    )}

                                    {!chapterLoading && getTheoryVideos().length > 0 && (
                                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                            {getTheoryVideos().map((video, index) => (
                                                <button
                                                    key={video.id}
                                                    onClick={() => openVideoModal(video)}
                                                    className="group bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg hover:border-blue-200 transition-all duration-300 transform hover:-translate-y-1 text-left w-full"
                                                >
                                                    <div className="relative aspect-video bg-gradient-to-br from-blue-100 to-indigo-100">
                                                        <Image
                                                            src={video.s3Thumbnail}
                                                            alt={video.title}
                                                            fill
                                                            className="object-cover"
                                                        />
                                                        {/* Video number badge */}
                                                        <div className="absolute top-3 left-3">
                                                            <div className="bg-blue-600 text-white px-2 py-1 rounded-lg text-xs font-bold">
                                                                #{index + 1}
                                                            </div>
                                                        </div>
                                                        {/* Duration badge */}
                                                        <div className="absolute top-3 right-3">
                                                            <div className="bg-black/70 text-white px-2 py-1 rounded-lg text-xs font-medium">
                                                                {video.duration ? `${Math.round(video.duration / 60)}p` : 'N/A'}
                                                            </div>
                                                        </div>
                                                        {/* Play button overlay */}
                                                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                                                            <div className="w-16 h-16 bg-white/95 rounded-full flex items-center justify-center shadow-xl transform scale-90 group-hover:scale-100 transition-transform duration-300">
                                                                <svg className="w-7 h-7 text-blue-600 ml-1" fill="currentColor" viewBox="0 0 24 24">
                                                                    <path d="M8 5v14l11-7z" />
                                                                </svg>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="p-5">
                                                        <div className="flex items-start justify-between mb-3">
                                                            <h3 className="text-lg font-bold text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors">
                                                                {video.title}
                                                            </h3>
                                                        </div>
                                                        <div className="flex items-center justify-between">
                                                            <div className="flex items-center space-x-2">
                                                                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                                                <span className="text-sm text-blue-600 font-medium">Lý thuyết</span>
                                                            </div>
                                                            <div className="flex items-center text-xs text-gray-500">
                                                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                                </svg>
                                                                Chưa xem
                                                            </div>
                                                        </div>
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </>
                            )}

                            {/* Exercise Videos Section */}
                            {activeTab === 'exercise' && (
                                <>
                                    {chapterLoading && (
                                        <div className="flex items-center justify-center py-12">
                                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                                            <span className="ml-3 text-gray-600">Đang tải video...</span>
                                        </div>
                                    )}

                                    {!chapterLoading && getExerciseVideos().length > 0 && (
                                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                            {getExerciseVideos().map((video, index) => (
                                                <button
                                                    key={video.id}
                                                    onClick={() => openVideoModal(video)}
                                                    className="group bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg hover:border-orange-200 transition-all duration-300 transform hover:-translate-y-1 text-left w-full"
                                                >
                                                    <div className="relative aspect-video bg-gradient-to-br from-orange-100 to-red-100">
                                                        <Image
                                                            src={video.s3Thumbnail}
                                                            alt={video.title}
                                                            fill
                                                            className="object-cover"
                                                        />
                                                        {/* Video number badge */}
                                                        <div className="absolute top-3 left-3">
                                                            <div className="bg-orange-600 text-white px-2 py-1 rounded-lg text-xs font-bold">
                                                                #{index + 1}
                                                            </div>
                                                        </div>
                                                        {/* Duration badge */}
                                                        <div className="absolute top-3 right-3">
                                                            <div className="bg-black/70 text-white px-2 py-1 rounded-lg text-xs font-medium">
                                                                {video.duration ? `${Math.round(video.duration / 60)}p` : 'N/A'}
                                                            </div>
                                                        </div>
                                                        {/* Play button overlay */}
                                                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                                                            <div className="w-16 h-16 bg-white/95 rounded-full flex items-center justify-center shadow-xl transform scale-90 group-hover:scale-100 transition-transform duration-300">
                                                                <svg className="w-7 h-7 text-orange-600 ml-1" fill="currentColor" viewBox="0 0 24 24">
                                                                    <path d="M8 5v14l11-7z" />
                                                                </svg>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="p-5">
                                                        <div className="flex items-start justify-between mb-3">
                                                            <h3 className="text-lg font-bold text-gray-900 line-clamp-2 group-hover:text-orange-600 transition-colors">
                                                                {video.title}
                                                            </h3>
                                                        </div>
                                                        <div className="flex items-center justify-between">
                                                            <div className="flex items-center space-x-2">
                                                                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                                                                <span className="text-sm text-orange-600 font-medium">Bài tập</span>
                                                            </div>
                                                            <div className="flex items-center text-xs text-gray-500">
                                                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                                </svg>
                                                                Chưa xem
                                                            </div>
                                                        </div>
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </>
                            )}

                            {/* Empty States */}
                            {activeTab === 'theory' && !chapterLoading && getTheoryVideos().length === 0 && (
                                <div className="text-center py-12">
                                    <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                    </svg>
                                    <h3 className="mt-4 text-lg font-medium text-gray-900">Chưa có video lý thuyết</h3>
                                    <p className="mt-2 text-gray-500">
                                        Chương này chưa có video lý thuyết. Vui lòng chọn chương khác hoặc chuyển sang tab bài tập.
                                    </p>
                                </div>
                            )}

                            {activeTab === 'exercise' && !chapterLoading && getExerciseVideos().length === 0 && (
                                <div className="text-center py-12">
                                    <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <h3 className="mt-4 text-lg font-medium text-gray-900">Chưa có video bài tập</h3>
                                    <p className="mt-2 text-gray-500">
                                        Chương này chưa có video bài tập. Vui lòng chọn chương khác hoặc chuyển sang tab lý thuyết.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* Enhanced Stats Section */}
            <section className="bg-gradient-to-br from-green-600 via-emerald-600 to-teal-700 py-16 relative overflow-hidden">
                <div className="absolute inset-0 bg-black/10"></div>
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-white mb-4">🎯 Thành tích của chúng tôi</h2>
                        <p className="text-green-100 text-lg">Những con số ấn tượng từ hệ thống học tập</p>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center border border-white/20">
                            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <div className="text-3xl font-bold text-white mb-2">50+</div>
                            <div className="text-green-100 text-sm">Video bài giảng</div>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center border border-white/20">
                            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                </svg>
                            </div>
                            <div className="text-3xl font-bold text-white mb-2">3</div>
                            <div className="text-green-100 text-sm">Môn học chính</div>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center border border-white/20">
                            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                                </svg>
                            </div>
                            <div className="text-3xl font-bold text-white mb-2">1000+</div>
                            <div className="text-green-100 text-sm">Học viên</div>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center border border-white/20">
                            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                </svg>
                            </div>
                            <div className="text-3xl font-bold text-white mb-2">95%</div>
                            <div className="text-green-100 text-sm">Hài lòng</div>
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