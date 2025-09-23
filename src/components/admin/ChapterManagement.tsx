'use client';

import { useState, useCallback } from 'react';
import { useGetChapters, useCreateChapter, useUpdateChapter, useDeleteChapter } from '@/hooks/useAdminCourse';
import CreateChapterModal from './CreateChapterModal';
import EditChapterModal from './EditChapterModal';
import DeleteConfirmModal from './DeleteConfirmModal';

interface ChapterManagementProps {
    gradeId: string;
    onChapterSelect: (chapterId: string, chapterName: string) => void;
}

export default function ChapterManagement({ gradeId, onChapterSelect }: ChapterManagementProps) {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [editingChapter, setEditingChapter] = useState<any>(null);
    const [deletingChapter, setDeletingChapter] = useState<any>(null);

    const { data: chapters, isLoading, error } = useGetChapters(gradeId);
    const createMutation = useCreateChapter();
    const updateMutation = useUpdateChapter();
    const deleteMutation = useDeleteChapter();

    const handleCreateSuccess = useCallback(() => {
        setIsCreateModalOpen(false);
    }, []);

    const handleEditSuccess = useCallback(() => {
        setEditingChapter(null);
    }, []);

    const handleDeleteConfirm = useCallback(async () => {
        if (!deletingChapter) return;

        try {
            await deleteMutation.mutateAsync(deletingChapter.id);
            setDeletingChapter(null);
        } catch (error) {
            console.error('Error deleting chapter:', error);
        }
    }, [deletingChapter, deleteMutation]);

    if (isLoading) {
        return (
            <div className="p-6">
                <div className="flex items-center justify-center py-12">
                    <div className="text-center">
                        <div className="w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-gray-600">Đang tải chương học...</p>
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
                    <p className="text-red-600">Có lỗi xảy ra khi tải chương học</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div>
                    <h3 className="text-xl font-bold text-gray-900">Quản lý chương học</h3>
                    <p className="text-gray-600">
                        Tổng cộng {chapters?.length || 0} chương học
                    </p>
                </div>
                <button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium flex items-center gap-2"
                >
                    <span>➕</span>
                    Thêm chương học
                </button>
            </div>

            {/* Chapters Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {chapters?.map((chapter, index) => (
                    <div
                        key={chapter.id}
                        className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-200 cursor-pointer group"
                        onClick={() => onChapterSelect(chapter.id, chapter.name)}
                    >
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center space-x-3">
                                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-violet-600 rounded-xl flex items-center justify-center shadow-lg">
                                    <span className="text-white font-bold text-lg">{index + 1}</span>
                                </div>
                                <div>
                                    <h4 className="text-lg font-bold text-gray-900 group-hover:text-purple-600 transition-colors">
                                        {chapter.name}
                                    </h4>
                                    <p className="text-sm text-gray-500">
                                        {chapter.videos?.length || 0} video
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-1">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setEditingChapter(chapter);
                                    }}
                                    className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                </button>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setDeletingChapter(chapter);
                                    }}
                                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        {chapter.description && (
                            <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                                {chapter.description}
                            </p>
                        )}

                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                                <div className="flex items-center space-x-1">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                    </svg>
                                    <span>{chapter.videos?.filter(v => v.videoType === 'theory').length || 0} lý thuyết</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <span>{chapter.videos?.filter(v => v.videoType === 'exercise').length || 0} bài tập</span>
                                </div>
                            </div>
                            <div className="flex items-center text-purple-600 text-sm font-medium">
                                <span>Xem chi tiết</span>
                                <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Empty State */}
            {(!chapters || chapters.length === 0) && (
                <div className="text-center py-12">
                    <div className="text-gray-400 text-4xl mb-4">📚</div>
                    <p className="text-gray-500">Chưa có chương học nào</p>
                    <button
                        onClick={() => setIsCreateModalOpen(true)}
                        className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                    >
                        Thêm chương học đầu tiên
                    </button>
                </div>
            )}

            {/* Modals */}
            <CreateChapterModal
                isOpen={isCreateModalOpen}
                gradeId={gradeId}
                onClose={() => setIsCreateModalOpen(false)}
                onSuccess={handleCreateSuccess}
            />

            {editingChapter && (
                <EditChapterModal
                    isOpen={!!editingChapter}
                    chapter={editingChapter}
                    onClose={() => setEditingChapter(null)}
                    onSuccess={handleEditSuccess}
                />
            )}

            {deletingChapter && (
                <DeleteConfirmModal
                    isOpen={!!deletingChapter}
                    title="Xóa chương học"
                    message={`Bạn có chắc chắn muốn xóa chương học "${deletingChapter.name}"? Tất cả video liên quan sẽ bị xóa.`}
                    onConfirm={handleDeleteConfirm}
                    onCancel={() => setDeletingChapter(null)}
                    isLoading={deleteMutation.isPending}
                />
            )}
        </div>
    );
}

