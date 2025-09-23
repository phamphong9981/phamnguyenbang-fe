'use client';

import { useState, useCallback } from 'react';
import { useGetSubjects } from '@/hooks/useAdminCourse';
import SubjectManagement from './SubjectManagement';
import GradeManagement from './GradeManagement';
import ChapterManagement from './ChapterManagement';
import VideoManagement from './VideoManagement';

export default function CourseManagement() {
    const [activeTab, setActiveTab] = useState<'subjects' | 'grades' | 'chapters' | 'videos'>('subjects');
    const [selectedSubject, setSelectedSubject] = useState<string>('');
    const [selectedGrade, setSelectedGrade] = useState<{ name: string, id: string } | null>(null);
    const [selectedChapter, setSelectedChapter] = useState<{ name: string, id: string } | null>(null);

    const { data: subjects, isLoading, error } = useGetSubjects();

    const handleSubjectSelect = useCallback((subjectId: string) => {
        setSelectedSubject(subjectId);
        setSelectedGrade(null);
        setSelectedChapter(null);
        setActiveTab('grades');
    }, []);

    const handleGradeSelect = useCallback((gradeId: string, gradeName: string) => {
        setSelectedGrade({
            name: gradeName,
            id: gradeId
        });
        setSelectedChapter(null);
        setActiveTab('chapters');
    }, []);

    const handleChapterSelect = useCallback((chapterId: string, chapterName: string) => {
        setSelectedChapter({
            name: chapterName,
            id: chapterId
        });
        setActiveTab('videos');
    }, []);

    if (isLoading) {
        return (
            <div className="p-6">
                <div className="flex items-center justify-center py-12">
                    <div className="text-center">
                        <div className="w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-gray-600">Đang tải dữ liệu khóa học...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-6">
                <div className="text-center py-12">
                    <div className="text-red-500 text-4xl mb-4">⚠️</div>
                    <p className="text-red-600">Có lỗi xảy ra khi tải dữ liệu khóa học</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6">
            {/* Header */}
            <div className="mb-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">
                            Quản lý khóa học
                        </h2>
                        <p className="text-gray-600">
                            Quản lý môn học, cấp độ, chương học và video
                        </p>
                    </div>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="mb-6">
                <div className="bg-white rounded-lg border border-gray-200 p-2">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        <button
                            onClick={() => setActiveTab('subjects')}
                            className={`relative flex items-center justify-center space-x-2 py-3 px-4 rounded-lg font-semibold text-sm transition-all duration-200 ${activeTab === 'subjects'
                                ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg'
                                : 'text-gray-600 hover:bg-blue-50 hover:text-blue-600'
                                }`}
                        >
                            <div className={`w-6 h-6 rounded-lg flex items-center justify-center ${activeTab === 'subjects' ? 'bg-white/20' : 'bg-blue-100'
                                }`}>
                                <svg className={`w-4 h-4 ${activeTab === 'subjects' ? 'text-white' : 'text-blue-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                </svg>
                            </div>
                            <span>Môn học</span>
                            {activeTab === 'subjects' && (
                                <div className="absolute top-1 right-1 w-2 h-2 bg-white rounded-full"></div>
                            )}
                        </button>

                        <button
                            onClick={() => setActiveTab('grades')}
                            disabled={!selectedSubject}
                            className={`relative flex items-center justify-center space-x-2 py-3 px-4 rounded-lg font-semibold text-sm transition-all duration-200 ${activeTab === 'grades'
                                ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg'
                                : selectedSubject
                                    ? 'text-gray-600 hover:bg-green-50 hover:text-green-600'
                                    : 'text-gray-400 cursor-not-allowed'
                                }`}
                        >
                            <div className={`w-6 h-6 rounded-lg flex items-center justify-center ${activeTab === 'grades' ? 'bg-white/20' : selectedSubject ? 'bg-green-100' : 'bg-gray-100'
                                }`}>
                                <svg className={`w-4 h-4 ${activeTab === 'grades' ? 'text-white' : selectedSubject ? 'text-green-600' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                </svg>
                            </div>
                            <span>Cấp độ</span>
                            {activeTab === 'grades' && (
                                <div className="absolute top-1 right-1 w-2 h-2 bg-white rounded-full"></div>
                            )}
                        </button>

                        <button
                            onClick={() => setActiveTab('chapters')}
                            disabled={!selectedGrade}
                            className={`relative flex items-center justify-center space-x-2 py-3 px-4 rounded-lg font-semibold text-sm transition-all duration-200 ${activeTab === 'chapters'
                                ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg'
                                : selectedGrade
                                    ? 'text-gray-600 hover:bg-purple-50 hover:text-purple-600'
                                    : 'text-gray-400 cursor-not-allowed'
                                }`}
                        >
                            <div className={`w-6 h-6 rounded-lg flex items-center justify-center ${activeTab === 'chapters' ? 'bg-white/20' : selectedGrade ? 'bg-purple-100' : 'bg-gray-100'
                                }`}>
                                <svg className={`w-4 h-4 ${activeTab === 'chapters' ? 'text-white' : selectedGrade ? 'text-purple-600' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                </svg>
                            </div>
                            <span>Chương học</span>
                            {activeTab === 'chapters' && (
                                <div className="absolute top-1 right-1 w-2 h-2 bg-white rounded-full"></div>
                            )}
                        </button>

                        <button
                            onClick={() => setActiveTab('videos')}
                            disabled={!selectedChapter}
                            className={`relative flex items-center justify-center space-x-2 py-3 px-4 rounded-lg font-semibold text-sm transition-all duration-200 ${activeTab === 'videos'
                                ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg'
                                : selectedChapter
                                    ? 'text-gray-600 hover:bg-orange-50 hover:text-orange-600'
                                    : 'text-gray-400 cursor-not-allowed'
                                }`}
                        >
                            <div className={`w-6 h-6 rounded-lg flex items-center justify-center ${activeTab === 'videos' ? 'bg-white/20' : selectedChapter ? 'bg-orange-100' : 'bg-gray-100'
                                }`}>
                                <svg className={`w-4 h-4 ${activeTab === 'videos' ? 'text-white' : selectedChapter ? 'text-orange-600' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <span>Video</span>
                            {activeTab === 'videos' && (
                                <div className="absolute top-1 right-1 w-2 h-2 bg-white rounded-full"></div>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Breadcrumb */}
            {(selectedSubject || selectedGrade || selectedChapter) && (
                <div className="mb-6">
                    <div className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center space-x-2 text-sm">
                            <span className="text-gray-500">Đang xem:</span>
                            {selectedSubject && (
                                <>
                                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full font-medium">
                                        {subjects?.find(s => s.id === selectedSubject)?.name}
                                    </span>
                                    {selectedGrade && (
                                        <>
                                            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </svg>
                                            <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full font-medium">
                                                {selectedGrade.name}
                                            </span>
                                        </>
                                    )}
                                    {selectedChapter && (
                                        <>
                                            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </svg>
                                            <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full font-medium">
                                                {selectedChapter.name}
                                            </span>
                                        </>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Content */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                {activeTab === 'subjects' && (
                    <SubjectManagement
                        subjects={subjects || []}
                        onSubjectSelect={handleSubjectSelect}
                    />
                )}

                {activeTab === 'grades' && selectedSubject && (
                    <GradeManagement
                        subjectId={selectedSubject}
                        onGradeSelect={handleGradeSelect}
                    />
                )}

                {activeTab === 'chapters' && selectedGrade && (
                    <ChapterManagement
                        gradeId={selectedGrade.id}
                        onChapterSelect={handleChapterSelect}
                    />
                )}

                {activeTab === 'videos' && selectedChapter && (
                    <VideoManagement
                        chapterId={selectedChapter.id}
                    />
                )}
            </div>
        </div>
    );
}

