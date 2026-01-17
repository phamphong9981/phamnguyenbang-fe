'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Header from '@/components/Header'
import VideoModal from '@/components/VideoModal'
import LockedVideoCard from '@/components/LockedVideoCard'
import { useSubjectsList, useChapterById, VideoResponseDto } from '@/hooks/useCourse'
import { useAuth } from '@/hooks/useAuth'

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

    // Get authentication state
    const { isAuthenticated, user } = useAuth()

    // Fetch subjects list
    const { data: subjects, isLoading: subjectsLoading, error: subjectsError } = useSubjectsList(user?.id)

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
            <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
                <Header />
                <div className="flex flex-col items-center justify-center min-h-[500px]">
                    <div className="text-center">
                        <div className="relative mb-6">
                            <div className="animate-spin rounded-full h-16 w-16 border-4 border-emerald-200 mx-auto"></div>
                            <div className="animate-spin rounded-full h-16 w-16 border-4 border-t-emerald-600 absolute top-0 left-1/2 -translate-x-1/2"></div>
                        </div>
                        <p className="text-gray-700 font-semibold text-lg mb-2">Đang tải khóa học</p>
                        <p className="text-gray-500 text-sm">Vui lòng chờ trong giây lát...</p>
                    </div>
                </div>
            </div>
        )
    }

    // Show error state
    if (subjectsError) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
                <Header />
                <div className="flex items-center justify-center min-h-[500px]">
                    <div className="text-center max-w-md mx-auto px-4">
                        <div className="bg-red-50 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                            <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Không thể tải khóa học</h3>
                        <p className="text-gray-600 mb-6">Đã xảy ra lỗi khi tải dữ liệu. Vui lòng thử lại sau hoặc liên hệ hỗ trợ.</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-600 to-green-600 text-white rounded-xl font-semibold hover:from-emerald-700 hover:to-green-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            Thử lại
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50">
            <Header />

            {/* Hero Section - Enhanced */}
            <section className="relative bg-gradient-to-br from-emerald-600 via-green-600 to-teal-600 py-12 overflow-hidden">
                {/* Decorative background */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-0 left-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-900/20 rounded-full blur-3xl"></div>
                </div>
                
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        {/* Badge */}
                        <div className="inline-block mb-4">
                            <div className="flex items-center justify-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full border border-white/30">
                                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z"></path>
                                </svg>
                                <span className="text-sm font-semibold text-white">Học tập không giới hạn</span>
                            </div>
                        </div>

                        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-3 leading-tight">
                            📚 Thư viện Video Học tập
                        </h1>
                        <p className="text-base sm:text-lg text-emerald-50 max-w-3xl mx-auto mb-6 leading-relaxed">
                            Lộ trình học có hệ thống cho <span className="font-bold text-white">Toán THPT, HSA, TSA</span>
                            <br />với hơn <span className="font-bold text-white">500+ video</span> chất lượng cao
                        </p>

                        {/* Breadcrumb - Enhanced */}
                        {currentSubject && currentGrade && currentChapter && (
                            <div className="flex items-center justify-center flex-wrap gap-2 text-sm">
                                <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full border border-white/30">
                                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                    </svg>
                                    <span className="font-semibold text-white">{currentSubject.name}</span>
                                </div>
                                <svg className="w-4 h-4 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                                <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full border border-white/30">
                                    <span className="font-semibold text-white">{currentGrade.name}</span>
                                </div>
                                <svg className="w-4 h-4 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                                <div className="flex items-center gap-2 bg-white/30 backdrop-blur-sm px-4 py-2 rounded-full border border-white/40">
                                    <span className="font-bold text-white">{currentChapter.name}</span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* Main Content */}
            <section className="py-10 relative">
                <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col xl:flex-row gap-6">
                        {/* Sidebar Menu - Enhanced */}
                        <div className="xl:w-[320px] flex-shrink-0">
                            <div className="sticky top-5">
                                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
                                    {/* Quick Stats */}
                                    {/* <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 border-b border-gray-100">
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
                                    </div> */}
                                    {/* Subject Selection - Enhanced */}
                                    <div className="p-5 bg-gradient-to-br from-emerald-50/50 to-green-50/50">
                                        <div className="flex items-center mb-4">
                                            <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-green-600 rounded-lg flex items-center justify-center mr-2 shadow-lg">
                                                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                                </svg>
                                            </div>
                                            <div>
                                                <h3 className="text-base font-bold text-gray-900">Chọn môn học</h3>
                                                <p className="text-xs text-gray-600">Khám phá nội dung học tập</p>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
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
                                                    className={`group relative w-full p-3 rounded-xl border-2 transition-all duration-300 text-left transform hover:scale-[1.02] ${
                                                        selectedSubject === subject.id
                                                            ? 'border-emerald-500 bg-gradient-to-r from-emerald-50 to-green-50 shadow-lg'
                                                            : 'border-gray-200 hover:border-emerald-300 hover:bg-emerald-50/30 bg-white'
                                                    }`}
                                                >
                                                    {selectedSubject === subject.id && (
                                                        <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/10 to-green-400/10 rounded-xl"></div>
                                                    )}
                                                    <div className="relative flex items-center justify-between">
                                                        <div className="flex items-center gap-2">
                                                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300 ${
                                                                selectedSubject === subject.id
                                                                    ? 'bg-gradient-to-br from-emerald-500 to-green-600 shadow-lg'
                                                                    : 'bg-gray-200 group-hover:bg-emerald-200'
                                                            }`}>
                                                                <svg className={`w-4 h-4 ${selectedSubject === subject.id ? 'text-white' : 'text-gray-600 group-hover:text-emerald-700'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                                                </svg>
                                                            </div>
                                                            <div>
                                                                <span className={`font-bold text-sm block ${selectedSubject === subject.id ? 'text-emerald-700' : 'text-gray-800 group-hover:text-emerald-700'}`}>
                                                                    {subject.name}
                                                                </span>
                                                                <span className="text-xs text-gray-500">
                                                                    {subject.grades?.length || 0} cấp độ học
                                                                </span>
                                                            </div>
                                                        </div>
                                                        {selectedSubject === subject.id && (
                                                            <svg className="w-4 h-4 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                            </svg>
                                                        )}
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Grade and Chapter Navigation - Enhanced */}
                                    {currentSubject?.grades && (
                                        <div className="border-t-2 border-gray-200">
                                            <div className="p-5 bg-gradient-to-br from-blue-50/50 to-indigo-50/50">
                                                <div className="flex items-center mb-4">
                                                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center mr-2 shadow-lg">
                                                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                                        </svg>
                                                    </div>
                                                    <div>
                                                        <h3 className="text-base font-bold text-gray-900">Chọn chương học</h3>
                                                        <p className="text-xs text-gray-600">Theo dõi tiến độ học tập</p>
                                                    </div>
                                                </div>
                                                <div className="space-y-2">
                                                    {currentSubject.grades.map(grade => (
                                                        <div key={grade.id} className="border-2 border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow duration-300">
                                                            {/* Grade Header */}
                                                            <button
                                                                onClick={() => {
                                                                    setSelectedGrade(grade.id)
                                                                    setSelectedChapter(grade.chapters[0]?.id || '')
                                                                }}
                                                                className={`w-full text-left p-3 transition-all duration-300 ${
                                                                    selectedGrade === grade.id
                                                                        ? 'bg-gradient-to-r from-blue-100 to-indigo-100 border-b-2 border-blue-300'
                                                                        : 'bg-gray-50 hover:bg-blue-50/50'
                                                                }`}
                                                            >
                                                                <div className="flex items-center justify-between">
                                                                    <div className="flex items-center gap-2">
                                                                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center shadow-md transition-all duration-300 ${
                                                                            selectedGrade === grade.id
                                                                                ? 'bg-gradient-to-br from-blue-500 to-indigo-600 text-white scale-110'
                                                                                : 'bg-gray-300 text-gray-700 hover:bg-blue-200'
                                                                        }`}>
                                                                            <span className="text-xs font-bold">{grade.name.charAt(0)}</span>
                                                                        </div>
                                                                        <div>
                                                                            <div className={`font-bold text-sm ${selectedGrade === grade.id ? 'text-blue-800' : 'text-gray-800'}`}>
                                                                                {grade.name}
                                                                            </div>
                                                                            <div className="text-xs text-gray-600">
                                                                                {grade.chapters?.length || 0} chương học
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <svg className={`w-5 h-5 transition-transform duration-300 ${
                                                                        selectedGrade === grade.id ? 'rotate-180 text-blue-700' : 'text-gray-400'
                                                                    }`}
                                                                        fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                                                    </svg>
                                                                </div>
                                                            </button>

                                                            {/* Chapter List */}
                                                            {selectedGrade === grade.id && (
                                                                <div className="bg-gradient-to-b from-white to-gray-50/50">
                                                                    {grade.chapters.map((chapter, index) => (
                                                                        <button
                                                                            key={chapter.id}
                                                                            onClick={() => setSelectedChapter(chapter.id)}
                                                                            className={`group w-full text-left p-3 pl-4 transition-all duration-300 border-l-4 hover:pl-5 ${
                                                                                selectedChapter === chapter.id
                                                                                    ? 'border-l-emerald-500 bg-gradient-to-r from-emerald-50 to-green-50'
                                                                                    : 'border-l-transparent hover:bg-blue-50/50 hover:border-l-blue-300'
                                                                            } ${index !== grade.chapters.length - 1 ? 'border-b border-gray-100' : ''}`}
                                                                        >
                                                                            <div className="flex items-center justify-between gap-2">
                                                                                <div className="flex items-center gap-2 flex-1 min-w-0">
                                                                                    <div className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold shadow-sm transition-all duration-300 flex-shrink-0 ${
                                                                                        selectedChapter === chapter.id
                                                                                            ? 'bg-gradient-to-br from-emerald-500 to-green-600 text-white scale-110'
                                                                                            : 'bg-gray-200 text-gray-700 group-hover:bg-blue-200 group-hover:scale-105'
                                                                                    }`}>
                                                                                        {index + 1}
                                                                                    </div>
                                                                                    <span className={`text-xs font-semibold truncate transition-colors duration-300 ${
                                                                                        selectedChapter === chapter.id
                                                                                            ? 'text-emerald-800'
                                                                                            : 'text-gray-800 group-hover:text-blue-700'
                                                                                    }`}>
                                                                                        {chapter.name}
                                                                                    </span>
                                                                                </div>
                                                                                {selectedChapter === chapter.id && (
                                                                                    <div className="flex items-center gap-1 flex-shrink-0">
                                                                                        <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                                                                                        <svg className="w-4 h-4 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
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

                        {/* Main Content Area - Enhanced */}
                        <div className="flex-1 min-w-0">
                            {/* Enhanced Chapter Info Header */}
                            {currentChapter && (
                                <div className="mb-6">
                                    <div className="relative bg-gradient-to-br from-indigo-100 via-blue-100 to-cyan-100 rounded-2xl p-6 border-2 border-indigo-200 shadow-xl overflow-hidden">
                                        {/* Decorative background */}
                                        <div className="absolute top-0 right-0 w-48 h-48 bg-white/30 rounded-full blur-3xl"></div>
                                        <div className="absolute bottom-0 left-0 w-36 h-36 bg-indigo-300/20 rounded-full blur-2xl"></div>
                                        
                                        <div className="relative">
                                            <div className="flex items-start justify-between mb-4">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 via-blue-600 to-indigo-700 rounded-xl flex items-center justify-center shadow-2xl transform hover:scale-110 transition-transform duration-300">
                                                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                                        </svg>
                                                    </div>
                                                    <div>
                                                        <h2 className="text-2xl font-bold text-gray-900 mb-2">{currentChapter.name}</h2>
                                                        <div className="flex items-center flex-wrap gap-2">
                                                            <span className="inline-flex items-center gap-1 bg-white/80 backdrop-blur-sm px-3 py-1.5 rounded-full text-sm font-semibold text-indigo-700 shadow-sm">
                                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                                                </svg>
                                                                {currentSubject?.name}
                                                            </span>
                                                            <span className="text-gray-400 text-lg">•</span>
                                                            <span className="inline-flex items-center gap-1 bg-white/80 backdrop-blur-sm px-3 py-1.5 rounded-full text-sm font-semibold text-blue-700 shadow-sm">
                                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                                                </svg>
                                                                {currentGrade?.name}
                                                            </span>
                                                        </div>
                                                        </div>
                                                    </div>
                                                    <div className="text-center bg-white/80 backdrop-blur-sm rounded-xl px-5 py-3 shadow-lg">
                                                        <div className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
                                                            {chapterData?.videos?.length || 0}
                                                        </div>
                                                        <div className="text-xs font-semibold text-indigo-600">Video</div>
                                                    </div>
                                                </div>

                                            {/* Progress Bar */}
                                            <div className="bg-white/60 backdrop-blur-sm rounded-full h-2 overflow-hidden shadow-inner">
                                                <div className="h-full bg-gradient-to-r from-indigo-500 via-blue-500 to-cyan-500 rounded-full transition-all duration-500" style={{ width: '0%' }}></div>
                                            </div>
                                            <div className="flex justify-between text-xs font-medium text-gray-700 mt-2">
                                                <span>Tiến độ học tập</span>
                                                <span>0% hoàn thành</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Enhanced Navigation Tabs */}
                            {currentChapter && (
                                <div className="mb-6">
                                    <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border-2 border-gray-200 p-2">
                                        <div className="grid grid-cols-2 gap-2">
                                            <button
                                                onClick={() => setActiveTab('theory')}
                                                className={`group relative flex items-center justify-center gap-3 py-4 px-5 rounded-xl font-bold text-sm transition-all duration-300 transform hover:scale-[1.02] ${
                                                    activeTab === 'theory'
                                                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-xl shadow-blue-300/50'
                                                        : 'text-gray-700 hover:bg-blue-50 bg-gray-50'
                                                }`}
                                            >
                                                {activeTab === 'theory' && (
                                                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl blur-lg opacity-50"></div>
                                                )}
                                                <div className={`relative w-10 h-10 rounded-lg flex items-center justify-center shadow-lg transition-all duration-300 ${
                                                    activeTab === 'theory'
                                                        ? 'bg-white/20'
                                                        : 'bg-blue-200 group-hover:bg-blue-300'
                                                }`}>
                                                    <svg className={`w-5 h-5 ${activeTab === 'theory' ? 'text-white' : 'text-blue-700'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                                    </svg>
                                                </div>
                                                <div className="relative text-left flex-1">
                                                    <div className="text-sm font-bold">Lý thuyết</div>
                                                    <div className={`text-xs font-semibold ${activeTab === 'theory' ? 'text-blue-100' : 'text-gray-600'}`}>
                                                        {getTheoryVideos().length} video
                                                    </div>
                                                </div>
                                                {activeTab === 'theory' && (
                                                    <div className="absolute top-2 right-2 w-2 h-2 bg-white rounded-full animate-pulse"></div>
                                                )}
                                            </button>
                                            <button
                                                onClick={() => setActiveTab('exercise')}
                                                className={`group relative flex items-center justify-center gap-3 py-4 px-5 rounded-xl font-bold text-sm transition-all duration-300 transform hover:scale-[1.02] ${
                                                    activeTab === 'exercise'
                                                        ? 'bg-gradient-to-r from-orange-600 to-red-600 text-white shadow-xl shadow-orange-300/50'
                                                        : 'text-gray-700 hover:bg-orange-50 bg-gray-50'
                                                }`}
                                            >
                                                {activeTab === 'exercise' && (
                                                    <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl blur-lg opacity-50"></div>
                                                )}
                                                <div className={`relative w-10 h-10 rounded-lg flex items-center justify-center shadow-lg transition-all duration-300 ${
                                                    activeTab === 'exercise'
                                                        ? 'bg-white/20'
                                                        : 'bg-orange-200 group-hover:bg-orange-300'
                                                }`}>
                                                    <svg className={`w-5 h-5 ${activeTab === 'exercise' ? 'text-white' : 'text-orange-700'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                </div>
                                                <div className="relative text-left flex-1">
                                                    <div className="text-sm font-bold">Bài tập</div>
                                                    <div className={`text-xs font-semibold ${activeTab === 'exercise' ? 'text-orange-100' : 'text-gray-600'}`}>
                                                        {getExerciseVideos().length} video
                                                    </div>
                                                </div>
                                                {activeTab === 'exercise' && (
                                                    <div className="absolute top-2 right-2 w-2 h-2 bg-white rounded-full animate-pulse"></div>
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
                                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 sm:gap-6">
                                            {getTheoryVideos().map((video, index) => {
                                                // Check if video is locked (not free and user not authenticated)
                                                const isVideoLocked = !video.isFree && !isAuthenticated

                                                if (isVideoLocked) {
                                                    return (
                                                        <LockedVideoCard
                                                            key={video.id}
                                                            video={video}
                                                            onLoginSuccess={() => {
                                                                // Refresh the page to update authentication state
                                                                window.location.reload()
                                                            }}
                                                        />
                                                    )
                                                }

                                                return (
                                                    <button
                                                        key={video.id}
                                                        onClick={() => openVideoModal(video)}
                                                        className="group bg-white rounded-2xl shadow-md border-2 border-gray-200 overflow-hidden hover:shadow-2xl hover:border-blue-400 transition-all duration-500 transform hover:-translate-y-1 text-left w-full"
                                                    >
                                                        <div className="relative aspect-video bg-gradient-to-br from-blue-200 via-indigo-200 to-blue-300 overflow-hidden">
                                                            <Image
                                                                src={video.s3Thumbnail}
                                                                alt={video.title}
                                                                fill
                                                                className="object-cover"
                                                            />
                                                            {/* Video number badge */}
                                                            {/* <div className="absolute top-3 left-3">
                                                            <div className="bg-blue-600 text-white px-2 py-1 rounded-lg text-xs font-bold">
                                                                #{index + 1}
                                                            </div>
                                                        </div> */}
                                                            {/* Duration badge */}
                                                            {/* <div className="absolute top-3 right-3">
                                                            <div className="bg-black/70 text-white px-2 py-1 rounded-lg text-xs font-medium">
                                                                {video.duration ? `${Math.round(video.duration / 60)}p` : 'N/A'}
                                                            </div>
                                                        </div> */}
                                                            {/* Play button overlay */}
                                                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500">
                                                                <div className="relative">
                                                                    <div className="absolute inset-0 bg-blue-500 rounded-full blur-xl opacity-50 animate-pulse"></div>
                                                                    <div className="relative w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-2xl transform scale-75 group-hover:scale-100 transition-transform duration-500">
                                                                        <svg className="w-7 h-7 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                                                                            <path d="M8 5v14l11-7z" />
                                                                        </svg>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="p-5">
                                                            <div className="mb-3">
                                                                <h3 className="text-base font-bold text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors leading-tight">
                                                                    {video.title}
                                                                </h3>
                                                            </div>
                                                            <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                                                                <div className="flex items-center gap-2">
                                                                    <div className="w-6 h-6 bg-blue-100 rounded-lg flex items-center justify-center">
                                                                        <svg className="w-3 h-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                                                        </svg>
                                                                    </div>
                                                                    <span className="text-xs text-blue-700 font-bold">Lý thuyết</span>
                                                                </div>
                                                                <div className="flex items-center gap-1 text-xs text-gray-500 font-medium">
                                                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                                    </svg>
                                                                    Chưa xem
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </button>
                                                )
                                            })}
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
                                            {getExerciseVideos().map((video, index) => {
                                                // Check if video is locked (not free and user not authenticated)
                                                const isVideoLocked = !video.isFree && !isAuthenticated

                                                if (isVideoLocked) {
                                                    return (
                                                        <LockedVideoCard
                                                            key={video.id}
                                                            video={video}
                                                            onLoginSuccess={() => {
                                                                // Refresh the page to update authentication state
                                                                window.location.reload()
                                                            }}
                                                        />
                                                    )
                                                }

                                                return (
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
                                                )
                                            })}
                                        </div>
                                    )}
                                </>
                            )}

                            {/* Empty States - Enhanced */}
                            {activeTab === 'theory' && !chapterLoading && getTheoryVideos().length === 0 && (
                                <div className="text-center py-16 bg-white/50 rounded-2xl border-2 border-dashed border-gray-300">
                                    <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-5">
                                        <svg className="w-10 h-10 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                        </svg>
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">Chưa có video lý thuyết</h3>
                                    <p className="text-sm text-gray-600 max-w-md mx-auto leading-relaxed">
                                        Chương này chưa có video lý thuyết. Hãy chọn chương khác hoặc chuyển sang tab <span className="font-semibold text-orange-600">Bài tập</span>.
                                    </p>
                                </div>
                            )}

                            {activeTab === 'exercise' && !chapterLoading && getExerciseVideos().length === 0 && (
                                <div className="text-center py-16 bg-white/50 rounded-2xl border-2 border-dashed border-gray-300">
                                    <div className="w-20 h-20 bg-gradient-to-br from-orange-100 to-red-100 rounded-full flex items-center justify-center mx-auto mb-5">
                                        <svg className="w-10 h-10 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">Chưa có video bài tập</h3>
                                    <p className="text-sm text-gray-600 max-w-md mx-auto leading-relaxed">
                                        Chương này chưa có video bài tập. Hãy chọn chương khác hoặc chuyển sang tab <span className="font-semibold text-blue-600">Lý thuyết</span>.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* Enhanced Stats Section */}
            <section className="relative bg-gradient-to-br from-emerald-600 via-green-600 to-teal-700 py-16 overflow-hidden">
                {/* Decorative background */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-0 left-1/4 w-72 h-72 bg-white/10 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-emerald-900/20 rounded-full blur-3xl"></div>
                </div>
                
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <div className="inline-block mb-3">
                            <div className="flex items-center justify-center gap-2 px-3 py-1.5 bg-white/20 backdrop-blur-sm rounded-full border border-white/30">
                                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                                </svg>
                                <span className="text-xs font-semibold text-white">Thành tích nổi bật</span>
                            </div>
                        </div>
                        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3">
                            🎯 Thành tích của chúng tôi
                        </h2>
                        <p className="text-emerald-50 text-base sm:text-lg max-w-2xl mx-auto">
                            Những con số ấn tượng từ hệ thống học tập trực tuyến
                        </p>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-5 sm:gap-6">
                        <div className="group bg-white/15 backdrop-blur-sm rounded-2xl p-6 text-center border-2 border-white/30 hover:bg-white/25 hover:border-white/50 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 shadow-xl hover:shadow-2xl">
                            <div className="w-12 h-12 bg-white/30 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <div className="text-3xl sm:text-4xl font-bold text-white mb-2">500+</div>
                            <div className="text-emerald-50 text-xs sm:text-sm font-semibold">Video bài giảng</div>
                        </div>
                        <div className="group bg-white/15 backdrop-blur-sm rounded-2xl p-6 text-center border-2 border-white/30 hover:bg-white/25 hover:border-white/50 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 shadow-xl hover:shadow-2xl">
                            <div className="w-12 h-12 bg-white/30 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                </svg>
                            </div>
                            <div className="text-3xl sm:text-4xl font-bold text-white mb-2">3</div>
                            <div className="text-emerald-50 text-xs sm:text-sm font-semibold">Môn học chính</div>
                        </div>
                        <div className="group bg-white/15 backdrop-blur-sm rounded-2xl p-6 text-center border-2 border-white/30 hover:bg-white/25 hover:border-white/50 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 shadow-xl hover:shadow-2xl">
                            <div className="w-12 h-12 bg-white/30 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                                </svg>
                            </div>
                            <div className="text-3xl sm:text-4xl font-bold text-white mb-2">1000+</div>
                            <div className="text-emerald-50 text-xs sm:text-sm font-semibold">Học viên</div>
                        </div>
                        <div className="group bg-white/15 backdrop-blur-sm rounded-2xl p-6 text-center border-2 border-white/30 hover:bg-white/25 hover:border-white/50 transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 shadow-xl hover:shadow-2xl">
                            <div className="w-12 h-12 bg-white/30 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                </svg>
                            </div>
                            <div className="text-3xl sm:text-4xl font-bold text-white mb-2">95%</div>
                            <div className="text-emerald-50 text-xs sm:text-sm font-semibold">Hài lòng</div>
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