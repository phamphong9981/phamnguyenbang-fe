'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Header from '@/components/Header'
import VideoModal from '@/components/VideoModal'
import LockedVideoCard from '@/components/LockedVideoCard'
import { useSubjectsList, useChapterById, VideoResponseDto } from '@/hooks/useCourse'
import { useAuth } from '@/hooks/useAuth'

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

    const { isAuthenticated, user } = useAuth()
    const { data: subjects, isLoading: subjectsLoading, error: subjectsError } = useSubjectsList(user?.id)
    const { data: chapterData, isLoading: chapterLoading } = useChapterById(selectedChapter)

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

    const currentSubject = subjects?.find(s => s.id === selectedSubject)
    const currentGrade = currentSubject?.grades?.find(g => g.id === selectedGrade)
    const currentChapter = currentGrade?.chapters.find(c => c.id === selectedChapter)

    const openVideoModal = (video: VideoResponseDto) => {
        setSelectedVideo({
            id: video.id,
            s3_video: video.s3Video,
            s3_thumbnail: video.s3Thumbnail,
            title: video.title,
            created_at: new Date().toLocaleDateString('vi-VN'),
            description: video.description
        })
        setIsVideoModalOpen(true)
    }

    const closeVideoModal = () => {
        setIsVideoModalOpen(false)
        setSelectedVideo(null)
    }

    const getTheoryVideos = () => chapterData?.videos.filter(v => v.videoType === 'theory') || []
    const getExerciseVideos = () => chapterData?.videos.filter(v => v.videoType === 'exercise') || []

    if (subjectsLoading) {
        return (
            <div className="min-h-screen bg-[#f4faff]">
                <Header />
                <div className="flex flex-col items-center justify-center min-h-[500px]">
                    <div className="relative w-14 h-14 mb-6">
                        <div className="absolute inset-0 border-4 border-gray-200 rounded-full" />
                        <div className="absolute inset-0 border-4 border-green-600 rounded-full border-t-transparent animate-spin" />
                    </div>
                    <p className="text-gray-700 font-semibold">Đang tải khóa học...</p>
                </div>
            </div>
        )
    }

    if (subjectsError) {
        return (
            <div className="min-h-screen bg-[#f4faff]">
                <Header />
                <div className="flex items-center justify-center min-h-[500px]">
                    <div className="text-center max-w-md px-4">
                        <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-2">Không thể tải khóa học</h3>
                        <p className="text-gray-500 text-sm mb-5">Đã xảy ra lỗi. Vui lòng thử lại.</p>
                        <button onClick={() => window.location.reload()} className="px-6 py-2.5 bg-green-600 text-white rounded-full font-semibold text-sm hover:bg-green-700 transition-colors">
                            Thử lại
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-[#f4faff]">
            <Header />

            {/* ─── Hero Banner ─── */}
            <section className="bg-gradient-to-br from-green-700 via-emerald-600 to-teal-600 pt-20 pb-10 px-4 sm:px-8">
                <div className="max-w-7xl mx-auto">
                    <span className="text-green-200 text-xs font-bold tracking-[0.2em] uppercase block mb-3">Thư viện bài giảng</span>
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-3 tracking-tight leading-tight">
                        Video Library
                    </h1>
                    <p className="text-emerald-100 text-base sm:text-lg max-w-2xl mb-6">
                        Lộ trình học có hệ thống cho <strong className="text-white">Toán THPT, HSA, TSA</strong> với hơn <strong className="text-white">500+ video</strong> chất lượng cao
                    </p>

                    {/* Breadcrumb */}
                    {currentSubject && currentGrade && currentChapter && (
                        <div className="flex flex-wrap items-center gap-2 text-sm">
                            <span className="bg-white/20 backdrop-blur-sm border border-white/30 px-3 py-1.5 rounded-full text-white font-semibold">{currentSubject.name}</span>
                            <svg className="w-3.5 h-3.5 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" /></svg>
                            <span className="bg-white/20 backdrop-blur-sm border border-white/30 px-3 py-1.5 rounded-full text-white font-semibold">{currentGrade.name}</span>
                            <svg className="w-3.5 h-3.5 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" /></svg>
                            <span className="bg-white/30 backdrop-blur-sm border border-white/40 px-3 py-1.5 rounded-full text-white font-bold">{currentChapter.name}</span>
                        </div>
                    )}
                </div>
            </section>

            {/* ─── Main Layout ─── */}
            <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex flex-col xl:flex-row gap-6">

                    {/* ─── Sidebar ─── */}
                    <aside className="xl:w-72 flex-shrink-0">
                        <div className="sticky top-5 bg-white rounded-3xl shadow-sm hover:shadow-md transition-shadow duration-300 border border-blue-50 overflow-hidden">

                            {/* Subject section */}
                            <div className="p-6 border-b border-gray-100">
                                <h3 className="text-green-700 font-bold text-xs tracking-[0.2em] uppercase mb-4">Môn Học</h3>
                                <div className="space-y-2">
                                    {subjects?.map(subject => (
                                        <button
                                            key={subject.id}
                                            onClick={() => {
                                                setSelectedSubject(subject.id)
                                                if (subject.grades?.length) {
                                                    const g = subject.grades[0]
                                                    setSelectedGrade(g.id)
                                                    if (g.chapters?.length) setSelectedChapter(g.chapters[0].id)
                                                }
                                            }}
                                            className={`w-full text-left px-4 py-3 rounded-2xl border-2 border-dashed transition-all duration-200 flex items-center justify-between group ${selectedSubject === subject.id
                                                ? 'border-green-500 bg-green-50'
                                                : 'border-transparent hover:border-green-200 hover:bg-green-50/40'
                                                }`}
                                        >
                                            <div>
                                                <div className={`font-bold text-sm ${selectedSubject === subject.id ? 'text-green-800' : 'text-gray-800'}`}>{subject.name}</div>
                                                <div className="text-xs text-gray-400 mt-0.5">{subject.grades?.length || 0} cấp độ</div>
                                            </div>
                                            {selectedSubject === subject.id && (
                                                <div className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0 ml-2" />
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Chapter section */}
                            {currentSubject?.grades && (
                                <div className="p-6">
                                    <h3 className="text-green-700 font-bold text-xs tracking-[0.2em] uppercase mb-4">Chọn chương</h3>
                                    <div className="space-y-2">
                                        {currentSubject.grades.map(grade => (
                                            <div key={grade.id}>
                                                <button
                                                    onClick={() => {
                                                        setSelectedGrade(grade.id)
                                                        setSelectedChapter(grade.chapters[0]?.id || '')
                                                    }}
                                                    className={`w-full text-left p-3 rounded-xl flex items-center justify-between transition-all duration-200 ${selectedGrade === grade.id
                                                        ? 'bg-green-600 text-white'
                                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                        }`}
                                                >
                                                    <div>
                                                        <div className="font-bold text-sm">{grade.name}</div>
                                                        <div className={`text-xs mt-0.5 ${selectedGrade === grade.id ? 'text-green-200' : 'text-gray-400'}`}>
                                                            {grade.chapters?.length || 0} chương
                                                        </div>
                                                    </div>
                                                    <svg className={`w-4 h-4 transition-transform ${selectedGrade === grade.id ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                                                    </svg>
                                                </button>

                                                {selectedGrade === grade.id && (
                                                    <div className="mt-1 ml-2 space-y-0.5 border-l-2 border-green-200 pl-3">
                                                        {grade.chapters.map((chapter, i) => (
                                                            <button
                                                                key={chapter.id}
                                                                onClick={() => setSelectedChapter(chapter.id)}
                                                                className={`group w-full text-left py-2.5 px-3 rounded-xl transition-all duration-200 flex items-center gap-3 ${selectedChapter === chapter.id
                                                                    ? 'bg-green-50 text-green-800'
                                                                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                                                    }`}
                                                            >
                                                                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0 ${selectedChapter === chapter.id
                                                                    ? 'bg-green-600 text-white'
                                                                    : 'bg-gray-200 text-gray-600'
                                                                    }`}>{i + 1}</span>
                                                                <span className="text-xs font-semibold line-clamp-2 leading-snug">{chapter.name}</span>
                                                                {selectedChapter === chapter.id && (
                                                                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse ml-auto flex-shrink-0" />
                                                                )}
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
                    </aside>

                    {/* ─── Main Content ─── */}
                    <main className="flex-1 min-w-0">

                        {/* Chapter header */}
                        {currentChapter && (
                            <div className="bg-white rounded-[2rem] border border-blue-50 shadow-sm hover:shadow-md transition-shadow duration-300 p-6 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div>
                                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                                        <span className="text-green-700 text-xs font-bold tracking-widest uppercase">{currentSubject?.name}</span>
                                        <span className="text-gray-300">•</span>
                                        <span className="text-gray-500 text-xs font-medium">{currentGrade?.name}</span>
                                    </div>
                                    <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 tracking-tight">{currentChapter.name}</h2>
                                </div>
                                <div className="bg-green-50 border border-green-100 rounded-2xl px-5 py-3 text-center flex-shrink-0">
                                    <div className="text-2xl font-bold text-green-700">{chapterData?.videos?.length || 0}</div>
                                    <div className="text-xs text-green-600 font-semibold">Video</div>
                                </div>
                            </div>
                        )}

                        {/* Tabs */}
                        {currentChapter && (
                            <div className="flex gap-3 mb-8">
                                <button
                                    onClick={() => setActiveTab('theory')}
                                    className={`flex items-center gap-2.5 px-6 py-3 rounded-full font-bold text-sm transition-all duration-200 ${activeTab === 'theory'
                                        ? 'bg-green-600 text-white shadow-lg shadow-green-200'
                                        : 'bg-white text-gray-600 border border-gray-200 hover:border-green-300 hover:text-green-700'
                                        }`}
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                    </svg>
                                    Lý thuyết
                                    <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${activeTab === 'theory' ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'}`}>
                                        {getTheoryVideos().length}
                                    </span>
                                </button>
                                <button
                                    onClick={() => setActiveTab('exercise')}
                                    className={`flex items-center gap-2.5 px-6 py-3 rounded-full font-bold text-sm transition-all duration-200 ${activeTab === 'exercise'
                                        ? 'bg-orange-500 text-white shadow-lg shadow-orange-200'
                                        : 'bg-white text-gray-600 border border-gray-200 hover:border-orange-300 hover:text-orange-600'
                                        }`}
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    Bài tập
                                    <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${activeTab === 'exercise' ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'}`}>
                                        {getExerciseVideos().length}
                                    </span>
                                </button>
                            </div>
                        )}

                        {/* Loading */}
                        {chapterLoading && (
                            <div className="flex items-center gap-3 justify-center py-20">
                                <div className="w-7 h-7 border-3 border-gray-200 border-t-green-600 rounded-full animate-spin" />
                                <span className="text-gray-500 text-sm font-medium">Đang tải video...</span>
                            </div>
                        )}

                        {/* Theory Videos */}
                        {activeTab === 'theory' && !chapterLoading && (
                            <>
                                {getTheoryVideos().length > 0 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                        {getTheoryVideos().map((video) => {
                                            if (!video.isFree && !isAuthenticated) {
                                                return (
                                                    <LockedVideoCard
                                                        key={video.id}
                                                        video={video}
                                                        onLoginSuccess={() => window.location.reload()}
                                                    />
                                                )
                                            }
                                            return (
                                                <div
                                                    key={video.id}
                                                    onClick={() => openVideoModal(video)}
                                                    className="group bg-white rounded-[2rem] overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-green-900/10 hover:border-green-100 transition-all duration-300 cursor-pointer flex flex-col hover:-translate-y-1 border border-gray-100"
                                                >
                                                    <div className="relative aspect-video bg-gray-100">
                                                        <Image src={video.s3Thumbnail} alt={video.title} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                                                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                                            <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-2xl scale-90 group-hover:scale-100 transition-transform">
                                                                <svg className="w-6 h-6 text-green-700 ml-1" fill="currentColor" viewBox="0 0 24 24">
                                                                    <path d="M8 5v14l11-7z" />
                                                                </svg>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="p-6 flex-1 flex flex-col">
                                                        <span className="text-green-700 text-[10px] font-bold uppercase tracking-widest mb-2 block">Lý thuyết</span>
                                                        <h3 className="font-extrabold text-gray-900 mb-4 line-clamp-2 leading-tight group-hover:text-green-700 transition-colors">{video.title}</h3>
                                                        <div className="mt-auto pt-4 border-t border-dashed border-gray-200 flex justify-between items-center">
                                                            <span className="text-[10px] font-bold tracking-widest text-gray-400 uppercase">Bài giảng</span>
                                                            <button className="text-green-700 font-bold text-sm">Xem ngay →</button>
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </div>
                                ) : (
                                    <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-200">
                                        <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                            </svg>
                                        </div>
                                        <h3 className="text-lg font-bold text-gray-900 mb-1">Chưa có video lý thuyết</h3>
                                        <p className="text-sm text-gray-500">Hãy chọn chương khác hoặc chuyển sang tab <span className="font-semibold text-orange-500">Bài tập</span>.</p>
                                    </div>
                                )}
                            </>
                        )}

                        {/* Exercise Videos */}
                        {activeTab === 'exercise' && !chapterLoading && (
                            <>
                                {getExerciseVideos().length > 0 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                        {getExerciseVideos().map((video, index) => {
                                            if (!video.isFree && !isAuthenticated) {
                                                return (
                                                    <LockedVideoCard
                                                        key={video.id}
                                                        video={video}
                                                        onLoginSuccess={() => window.location.reload()}
                                                    />
                                                )
                                            }
                                            return (
                                                <div
                                                    key={video.id}
                                                    onClick={() => openVideoModal(video)}
                                                    className="group bg-white rounded-[2rem] overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-orange-900/10 hover:border-orange-100 transition-all duration-300 cursor-pointer flex flex-col hover:-translate-y-1 border border-gray-100"
                                                >
                                                    <div className="relative aspect-video bg-gray-100">
                                                        <Image src={video.s3Thumbnail} alt={video.title} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                                                        <div className="absolute top-3 left-3 bg-orange-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full">
                                                            #{index + 1}
                                                        </div>
                                                        {video.duration && (
                                                            <div className="absolute bottom-2 right-2 bg-black/70 text-white text-[10px] px-2 py-1 rounded font-bold">
                                                                {Math.round(video.duration / 60)}p
                                                            </div>
                                                        )}
                                                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                                            <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-2xl scale-90 group-hover:scale-100 transition-transform">
                                                                <svg className="w-6 h-6 text-orange-500 ml-1" fill="currentColor" viewBox="0 0 24 24">
                                                                    <path d="M8 5v14l11-7z" />
                                                                </svg>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="p-6 flex-1 flex flex-col">
                                                        <span className="text-orange-600 text-[10px] font-bold uppercase tracking-widest mb-2 block">Bài tập</span>
                                                        <h3 className="font-extrabold text-gray-900 mb-4 line-clamp-2 leading-tight group-hover:text-orange-600 transition-colors">{video.title}</h3>
                                                        <div className="mt-auto pt-4 border-t border-dashed border-gray-200 flex justify-between items-center">
                                                            <span className="text-[10px] font-bold tracking-widest text-gray-400 uppercase">Video bài tập</span>
                                                            <button className="text-orange-600 font-bold text-sm">Xem ngay →</button>
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </div>
                                ) : (
                                    <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-200">
                                        <div className="w-16 h-16 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <svg className="w-8 h-8 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                        <h3 className="text-lg font-bold text-gray-900 mb-1">Chưa có video bài tập</h3>
                                        <p className="text-sm text-gray-500">Hãy chọn chương khác hoặc chuyển sang tab <span className="font-semibold text-green-600">Lý thuyết</span>.</p>
                                    </div>
                                )}
                            </>
                        )}
                    </main>
                </div>
            </div>

            {/* ─── Stats Section ─── */}
            <section className="bg-green-700 py-20 mt-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="mb-12">
                        <span className="text-green-300 text-xs font-bold tracking-[0.2em] uppercase block mb-3">Thành tích</span>
                        <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">Những con số ấn tượng</h2>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {[
                            { value: '500+', label: 'Video bài giảng' },
                            { value: '3', label: 'Môn học chính' },
                            { value: '1000+', label: 'Học viên' },
                            { value: '95%', label: 'Hài lòng' },
                        ].map((stat) => (
                            <div key={stat.label} className="relative group cursor-pointer">
                                <div className="bg-white p-8 rounded-2xl shadow-sm border-2 border-dashed border-green-300 flex flex-col items-center text-center transition-transform duration-300 hover:-translate-y-2">
                                    <div className="text-3xl sm:text-4xl font-extrabold text-green-700 mb-2">{stat.value}</div>
                                    <div className="text-sm text-gray-600 font-semibold">{stat.label}</div>
                                </div>
                                <div className="absolute top-1/2 -left-3 w-6 h-6 bg-green-700 rounded-full shadow-inner transform -translate-y-1/2" />
                                <div className="absolute top-1/2 -right-3 w-6 h-6 bg-green-700 rounded-full shadow-inner transform -translate-y-1/2" />
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <VideoModal
                isOpen={isVideoModalOpen}
                video={selectedVideo}
                currentChapterName={currentChapter?.name}
                onClose={closeVideoModal}
            />
        </div>
    )
}