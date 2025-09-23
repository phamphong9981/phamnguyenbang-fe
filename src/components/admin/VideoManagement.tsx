'use client';

import { useState, useCallback } from 'react';
import { useGetVideos, useCreateVideo, useUpdateVideo, useDeleteVideo } from '@/hooks/useAdminCourse';
import CreateVideoModal from './CreateVideoModal';
import EditVideoModal from './EditVideoModal';
import DeleteConfirmModal from './DeleteConfirmModal';
import VideoPlayer from './VideoPlayer';

interface VideoManagementProps {
    chapterId: string;
}

export default function VideoManagement({ chapterId }: VideoManagementProps) {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [editingVideo, setEditingVideo] = useState<any>(null);
    const [deletingVideo, setDeletingVideo] = useState<any>(null);
    const [activeTab, setActiveTab] = useState<'all' | 'theory' | 'exercise'>('all');
    const [playingVideo, setPlayingVideo] = useState<any>(null);
    const [isFullscreen, setIsFullscreen] = useState(false);

    const { data: videos, isLoading, error } = useGetVideos(chapterId);
    const createMutation = useCreateVideo();
    const updateMutation = useUpdateVideo();
    const deleteMutation = useDeleteVideo();

    const handleCreateSuccess = useCallback(() => {
        setIsCreateModalOpen(false);
    }, []);

    const handleEditSuccess = useCallback(() => {
        setEditingVideo(null);
    }, []);

    const handleDeleteConfirm = useCallback(async () => {
        if (!deletingVideo) return;

        try {
            await deleteMutation.mutateAsync(deletingVideo.id);
            setDeletingVideo(null);
        } catch (error) {
            console.error('Error deleting video:', error);
        }
    }, [deletingVideo, deleteMutation]);

    const handlePlayVideo = useCallback((video: any) => {
        setPlayingVideo(video);
    }, []);

    const handleCloseVideo = useCallback(() => {
        setPlayingVideo(null);
        setIsFullscreen(false);
    }, []);

    const handleToggleFullscreen = useCallback(() => {
        setIsFullscreen(!isFullscreen);
    }, [isFullscreen]);

    const filteredVideos = videos?.filter(video => {
        if (activeTab === 'all') return true;
        return video.videoType === activeTab;
    }) || [];

    if (isLoading) {
        return (
            <div className="p-6">
                <div className="flex items-center justify-center py-12">
                    <div className="text-center">
                        <div className="w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-gray-600">Đang tải video...</p>
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
                    <p className="text-red-600">Có lỗi xảy ra khi tải video</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div>
                    <h3 className="text-xl font-bold text-gray-900">Quản lý video</h3>
                    <p className="text-gray-600">
                        Tổng cộng {videos?.length || 0} video
                    </p>
                </div>
                <button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-medium flex items-center gap-2"
                >
                    <span>➕</span>
                    Thêm video
                </button>
            </div>

            {/* Filter Tabs */}
            <div className="mb-6">
                <div className="bg-white rounded-lg border border-gray-200 p-2">
                    <div className="grid grid-cols-3 gap-2">
                        <button
                            onClick={() => setActiveTab('all')}
                            className={`py-2 px-4 rounded-lg font-semibold text-sm transition-all duration-200 ${activeTab === 'all'
                                ? 'bg-orange-600 text-white shadow-lg'
                                : 'text-gray-600 hover:bg-orange-50 hover:text-orange-600'
                                }`}
                        >
                            Tất cả ({videos?.length || 0})
                        </button>
                        <button
                            onClick={() => setActiveTab('theory')}
                            className={`py-2 px-4 rounded-lg font-semibold text-sm transition-all duration-200 ${activeTab === 'theory'
                                ? 'bg-blue-600 text-white shadow-lg'
                                : 'text-gray-600 hover:bg-blue-50 hover:text-blue-600'
                                }`}
                        >
                            Lý thuyết ({videos?.filter(v => v.videoType === 'theory').length || 0})
                        </button>
                        <button
                            onClick={() => setActiveTab('exercise')}
                            className={`py-2 px-4 rounded-lg font-semibold text-sm transition-all duration-200 ${activeTab === 'exercise'
                                ? 'bg-green-600 text-white shadow-lg'
                                : 'text-gray-600 hover:bg-green-50 hover:text-green-600'
                                }`}
                        >
                            Bài tập ({videos?.filter(v => v.videoType === 'exercise').length || 0})
                        </button>
                    </div>
                </div>
            </div>

            {/* Videos Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredVideos.map((video, index) => (
                    <div
                        key={video.id}
                        className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-200 group"
                    >
                        {/* Video Player */}
                        <div className="mb-4">
                            <div className="relative aspect-video bg-gray-900 rounded-lg overflow-hidden">
                                <VideoPlayer
                                    src={video.s3Video}
                                    poster={video.s3Thumbnail}
                                    title={video.title}
                                    isCompact={true}
                                />
                                {/* Play Button Overlay */}
                                <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                    <button
                                        onClick={() => handlePlayVideo(video)}
                                        className="w-12 h-12 bg-white bg-opacity-90 rounded-full flex items-center justify-center hover:bg-opacity-100 transition-all duration-200 shadow-lg"
                                    >
                                        <svg className="w-6 h-6 text-gray-800 ml-1" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M8 5v14l11-7z" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="mb-4">
                            <div className="flex items-center space-x-3 mb-3">
                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center shadow-md ${video.videoType === 'theory'
                                    ? 'bg-gradient-to-br from-blue-500 to-indigo-600'
                                    : 'bg-gradient-to-br from-green-500 to-emerald-600'
                                    }`}>
                                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <div className="flex-1">
                                    <h4 className="text-lg font-bold text-gray-900">
                                        {video.title}
                                    </h4>
                                    <p className={`text-sm font-medium ${video.videoType === 'theory' ? 'text-blue-600' : 'text-green-600'
                                        }`}>
                                        {video.videoType === 'theory' ? 'Lý thuyết' : 'Bài tập'}
                                    </p>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                <button
                                    onClick={() => setEditingVideo(video)}
                                    className="flex items-center justify-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
                                    title="Chỉnh sửa"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                    <span className="hidden sm:inline">Chỉnh sửa</span>
                                    <span className="sm:hidden">Sửa</span>
                                </button>
                                <button
                                    onClick={() => setDeletingVideo(video)}
                                    className="flex items-center justify-center space-x-2 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium text-sm"
                                    title="Xóa"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                    <span>Xóa</span>
                                </button>
                            </div>
                        </div>

                        {video.description && (
                            <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                                {video.description}
                            </p>
                        )}

                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                                <div className="flex items-center space-x-1">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <span>{video.duration ? `${Math.round(video.duration / 60)}p` : 'N/A'}</span>
                                </div>
                                <div className={`px-2 py-1 rounded-full text-xs font-medium ${video.isFree
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-yellow-100 text-yellow-800'
                                    }`}>
                                    {video.isFree ? 'Miễn phí' : 'Premium'}
                                </div>
                            </div>
                            <div className="text-xs text-gray-500">
                                #{video.sortOrder}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Empty State */}
            {filteredVideos.length === 0 && (
                <div className="text-center py-12">
                    <div className="text-gray-400 text-4xl mb-4">🎥</div>
                    <p className="text-gray-500">
                        {activeTab === 'all'
                            ? 'Chưa có video nào'
                            : `Chưa có video ${activeTab === 'theory' ? 'lý thuyết' : 'bài tập'}`
                        }
                    </p>
                    <button
                        onClick={() => setIsCreateModalOpen(true)}
                        className="mt-4 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                    >
                        Thêm video đầu tiên
                    </button>
                </div>
            )}

            {/* Modals */}
            <CreateVideoModal
                isOpen={isCreateModalOpen}
                chapterId={chapterId}
                onClose={() => setIsCreateModalOpen(false)}
                onSuccess={handleCreateSuccess}
            />

            {editingVideo && (
                <EditVideoModal
                    isOpen={!!editingVideo}
                    video={editingVideo}
                    onClose={() => setEditingVideo(null)}
                    onSuccess={handleEditSuccess}
                />
            )}

            {deletingVideo && (
                <DeleteConfirmModal
                    isOpen={!!deletingVideo}
                    title="Xóa video"
                    message={`Bạn có chắc chắn muốn xóa video "${deletingVideo.title}"?`}
                    onConfirm={handleDeleteConfirm}
                    onCancel={() => setDeletingVideo(null)}
                    isLoading={deleteMutation.isPending}
                />
            )}

            {/* Video Player Modal */}
            {playingVideo && (
                <div className={`fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4 ${isFullscreen ? 'p-0' : ''}`}>
                    <div className={`bg-black rounded-lg overflow-hidden ${isFullscreen ? 'w-full h-full' : 'max-w-4xl w-full max-h-[90vh]'}`}>
                        {/* Header */}
                        <div className="flex items-center justify-between p-4 bg-gray-900">
                            <div className="flex items-center space-x-3">
                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${playingVideo.videoType === 'theory'
                                    ? 'bg-blue-600'
                                    : 'bg-green-600'
                                    }`}>
                                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-white">{playingVideo.title}</h3>
                                    <p className="text-sm text-gray-300">
                                        {playingVideo.videoType === 'theory' ? 'Lý thuyết' : 'Bài tập'} •
                                        {playingVideo.duration ? ` ${Math.round(playingVideo.duration / 60)} phút` : ' N/A'}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-2">
                                <button
                                    onClick={handleToggleFullscreen}
                                    className="p-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
                                    title={isFullscreen ? 'Thoát toàn màn hình' : 'Toàn màn hình'}
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        {isFullscreen ? (
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 9V4.5M9 9H4.5M9 9L3.5 3.5M15 9h4.5M15 9V4.5M15 9l5.5-5.5M9 15v4.5M9 15H4.5M9 15l-5.5 5.5M15 15h4.5M15 15v4.5m0-4.5l5.5 5.5" />
                                        ) : (
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                                        )}
                                    </svg>
                                </button>
                                <button
                                    onClick={handleCloseVideo}
                                    className="p-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
                                    title="Đóng"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        {/* Video Player */}
                        <div className={`${isFullscreen ? 'h-[calc(100vh-80px)]' : 'aspect-video'}`}>
                            <VideoPlayer
                                src={playingVideo.s3Video}
                                poster={playingVideo.s3Thumbnail}
                                title={playingVideo.title}
                                isCompact={false}
                                autoPlay={true}
                            />
                        </div>

                        {/* Description */}
                        {playingVideo.description && (
                            <div className="p-4 bg-gray-900 border-t border-gray-700">
                                <p className="text-gray-300 text-sm">{playingVideo.description}</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

