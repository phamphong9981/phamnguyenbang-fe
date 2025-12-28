'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
    useChapterExamSets,
    useCreateChapterExamSet,
    useUpdateChapterExamSet,
    useDeleteChapterExamSet,
    useCreateSubChapterExamSet,
    useUpdateSubChapterExamSet,
    useDeleteSubChapterExamSet,
    useDeleteExamSet,
    ChapterExamSetResponse,
    SubChapterExamSetResponse,
    ExamSetResponse,
    ExamSetStatus,
    CreateChapterExamSetDto,
    UpdateChapterExamSetDto,
    CreateSubChapterExamSetDto,
    UpdateSubChapterExamSetDto,
} from '@/hooks/useExam';
import ViewExamSetModal from './ViewExamSetModal';

export default function ChapterExamSetManagement() {
    const router = useRouter();
    const [selectedGrade, setSelectedGrade] = useState<number | undefined>(undefined);
    const [expandedChapters, setExpandedChapters] = useState<Set<string>>(new Set());

    // Modal states
    const [chapterModal, setChapterModal] = useState<{
        isOpen: boolean;
        mode: 'create' | 'edit';
        chapter: ChapterExamSetResponse | null;
    }>({ isOpen: false, mode: 'create', chapter: null });

    const [subChapterModal, setSubChapterModal] = useState<{
        isOpen: boolean;
        mode: 'create' | 'edit';
        parentChapterId: string | null;
        subChapter: SubChapterExamSetResponse | null;
    }>({ isOpen: false, mode: 'create', parentChapterId: null, subChapter: null });

    const [deleteChapterModal, setDeleteChapterModal] = useState<{
        isOpen: boolean;
        chapter: ChapterExamSetResponse | null;
    }>({ isOpen: false, chapter: null });

    const [deleteSubChapterModal, setDeleteSubChapterModal] = useState<{
        isOpen: boolean;
        subChapter: SubChapterExamSetResponse | null;
    }>({ isOpen: false, subChapter: null });

    const [viewExamModal, setViewExamModal] = useState<{
        isOpen: boolean;
        examSetId: string | null;
    }>({ isOpen: false, examSetId: null });

    const [deleteExamModal, setDeleteExamModal] = useState<{
        isOpen: boolean;
        exam: ExamSetResponse | null;
    }>({ isOpen: false, exam: null });

    // Hooks
    const { data: chapters, isLoading, error, refetch } = useChapterExamSets(selectedGrade);
    const createChapterMutation = useCreateChapterExamSet();
    const updateChapterMutation = useUpdateChapterExamSet();
    const deleteChapterMutation = useDeleteChapterExamSet();
    const createSubChapterMutation = useCreateSubChapterExamSet();
    const updateSubChapterMutation = useUpdateSubChapterExamSet();
    const deleteSubChapterMutation = useDeleteSubChapterExamSet();
    const deleteExamMutation = useDeleteExamSet();

    const toggleChapter = (chapterId: string) => {
        setExpandedChapters(prev => {
            const newSet = new Set(prev);
            if (newSet.has(chapterId)) {
                newSet.delete(chapterId);
            } else {
                newSet.add(chapterId);
            }
            return newSet;
        });
    };

    // Chapter handlers
    const handleCreateChapter = async (data: CreateChapterExamSetDto) => {
        try {
            await createChapterMutation.mutateAsync(data);
            setChapterModal({ isOpen: false, mode: 'create', chapter: null });
            refetch();
        } catch (error) {
            console.error('Error creating chapter:', error);
        }
    };

    const handleUpdateChapter = async (id: string, data: UpdateChapterExamSetDto) => {
        try {
            await updateChapterMutation.mutateAsync({ id, data });
            setChapterModal({ isOpen: false, mode: 'create', chapter: null });
            refetch();
        } catch (error) {
            console.error('Error updating chapter:', error);
        }
    };

    const handleDeleteChapter = async () => {
        if (!deleteChapterModal.chapter) return;
        try {
            await deleteChapterMutation.mutateAsync(deleteChapterModal.chapter.id);
            setDeleteChapterModal({ isOpen: false, chapter: null });
            refetch();
        } catch (error) {
            console.error('Error deleting chapter:', error);
        }
    };

    // SubChapter handlers
    const handleCreateSubChapter = async (data: CreateSubChapterExamSetDto) => {
        try {
            await createSubChapterMutation.mutateAsync(data);
            setSubChapterModal({ isOpen: false, mode: 'create', parentChapterId: null, subChapter: null });
            refetch();
        } catch (error) {
            console.error('Error creating subchapter:', error);
        }
    };

    const handleUpdateSubChapter = async (id: string, data: UpdateSubChapterExamSetDto) => {
        try {
            await updateSubChapterMutation.mutateAsync({ id, data });
            setSubChapterModal({ isOpen: false, mode: 'create', parentChapterId: null, subChapter: null });
            refetch();
        } catch (error) {
            console.error('Error updating subchapter:', error);
        }
    };

    const handleDeleteSubChapter = async () => {
        if (!deleteSubChapterModal.subChapter) return;
        try {
            await deleteSubChapterMutation.mutateAsync(deleteSubChapterModal.subChapter.id);
            setDeleteSubChapterModal({ isOpen: false, subChapter: null });
            refetch();
        } catch (error) {
            console.error('Error deleting subchapter:', error);
        }
    };

    // Exam handlers
    const handleDeleteExam = async () => {
        if (!deleteExamModal.exam) return;
        try {
            await deleteExamMutation.mutateAsync(deleteExamModal.exam.id);
            setDeleteExamModal({ isOpen: false, exam: null });
            refetch();
        } catch (error) {
            console.error('Error deleting exam:', error);
        }
    };

    const getStatusColor = (status: ExamSetStatus | string) => {
        switch (status) {
            case ExamSetStatus.AVAILABLE:
            case 'available': return 'bg-green-100 text-green-800';
            case ExamSetStatus.EXPIRED:
            case 'expired': return 'bg-red-100 text-red-800';
            case 'draft': return 'bg-yellow-100 text-yellow-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    if (isLoading) {
        return (
            <div className="p-6">
                <div className="flex items-center justify-center py-12">
                    <div className="text-center">
                        <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-gray-600">Đang tải danh sách chương...</p>
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
                    <p className="text-red-600">Có lỗi xảy ra khi tải danh sách chương</p>
                    <button
                        onClick={() => refetch()}
                        className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                    >
                        Thử lại
                    </button>
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
                            Quản lý Bài tập Chương
                        </h2>
                        <p className="text-gray-600">
                            Tổ chức bài tập theo cấu trúc: Chương → Chương con → Đề thi
                        </p>
                    </div>
                    <button
                        onClick={() => setChapterModal({ isOpen: true, mode: 'create', chapter: null })}
                        className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
                    >
                        + Tạo chương mới
                    </button>
                </div>
            </div>

            {/* Grade Filter */}
            <div className="mb-6">
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Khối lớp (tùy chọn)
                    </label>
                    <select
                        value={selectedGrade || ''}
                        onChange={(e) => setSelectedGrade(e.target.value ? parseInt(e.target.value) : undefined)}
                        className="w-full md:w-48 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                        <option value="">Tất cả khối lớp</option>
                        <option value={10}>Lớp 10</option>
                        <option value={11}>Lớp 11</option>
                        <option value={12}>Lớp 12</option>
                    </select>
                </div>
            </div>

            {/* Chapters List */}
            <div className="space-y-4">
                {chapters && chapters.length > 0 ? (
                    chapters.map((chapter, chapterIndex) => (
                        <div key={chapter.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                            {/* Chapter Header */}
                            <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-purple-50 to-indigo-50">
                                <button
                                    onClick={() => toggleChapter(chapter.id)}
                                    className="flex items-center space-x-4 flex-1"
                                >
                                    <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center text-white font-bold">
                                        {chapterIndex + 1}
                                    </div>
                                    <div className="text-left">
                                        <h3 className="font-semibold text-gray-900">{chapter.name}</h3>
                                        <p className="text-sm text-gray-500">
                                            {chapter.subChapters?.length || 0} chương con • Thứ tự: {chapter.sortOrder}
                                        </p>
                                    </div>
                                    <svg
                                        className={`w-5 h-5 text-gray-500 transform transition-transform ${expandedChapters.has(chapter.id) ? 'rotate-180' : ''}`}
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>
                                <div className="flex items-center space-x-2 ml-4">
                                    <button
                                        onClick={() => setSubChapterModal({ isOpen: true, mode: 'create', parentChapterId: chapter.id, subChapter: null })}
                                        className="px-3 py-1.5 text-sm bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition-colors"
                                    >
                                        + Chương con
                                    </button>
                                    <button
                                        onClick={() => setChapterModal({ isOpen: true, mode: 'edit', chapter })}
                                        className="p-2 text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                                        title="Sửa chương"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                        </svg>
                                    </button>
                                    <button
                                        onClick={() => setDeleteChapterModal({ isOpen: true, chapter })}
                                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                        title="Xóa chương"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                    </button>
                                </div>
                            </div>

                            {/* SubChapters */}
                            {expandedChapters.has(chapter.id) && (
                                <div className="border-t border-gray-100">
                                    {chapter.subChapters && chapter.subChapters.length > 0 ? (
                                        chapter.subChapters.map((subChapter, subIndex) => (
                                            <div key={subChapter.id} className="border-b border-gray-100 last:border-b-0">
                                                {/* SubChapter Header */}
                                                <div className="flex items-center justify-between px-6 py-3 bg-gray-50">
                                                    <div className="flex items-center space-x-3">
                                                        <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center text-indigo-600 font-semibold text-sm">
                                                            {chapterIndex + 1}.{subIndex + 1}
                                                        </div>
                                                        <div>
                                                            <h4 className="font-medium text-gray-800">{subChapter.name}</h4>
                                                            <p className="text-xs text-gray-500">
                                                                {subChapter.examSets?.length || 0} đề thi • Thứ tự: {subChapter.sortOrder}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center space-x-2">
                                                        <button
                                                            onClick={() => router.push(`/admin/create-exam-set?subChapterId=${subChapter.id}`)}
                                                            className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                                                        >
                                                            + Đề thi
                                                        </button>
                                                        <button
                                                            onClick={() => setSubChapterModal({ isOpen: true, mode: 'edit', parentChapterId: chapter.id, subChapter })}
                                                            className="p-1.5 text-orange-600 hover:bg-orange-50 rounded transition-colors"
                                                            title="Sửa chương con"
                                                        >
                                                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                            </svg>
                                                        </button>
                                                        <button
                                                            onClick={() => setDeleteSubChapterModal({ isOpen: true, subChapter })}
                                                            className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                                                            title="Xóa chương con"
                                                        >
                                                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                            </svg>
                                                        </button>
                                                    </div>
                                                </div>

                                                {/* Exam Sets */}
                                                {subChapter.examSets && subChapter.examSets.length > 0 && (
                                                    <div className="px-6 py-3 ml-11">
                                                        <table className="w-full text-sm">
                                                            <thead>
                                                                <tr className="text-left text-gray-500">
                                                                    <th className="pb-2 font-medium">Tên đề thi</th>
                                                                    <th className="pb-2 font-medium text-center">Thời gian</th>
                                                                    <th className="pb-2 font-medium text-center">Trạng thái</th>
                                                                    <th className="pb-2 font-medium text-right">Thao tác</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody className="divide-y divide-gray-100">
                                                                {subChapter.examSets.map((exam) => (
                                                                    <tr key={exam.id} className="hover:bg-gray-50">
                                                                        <td className="py-2">
                                                                            <span className="font-medium text-gray-900">{exam.name}</span>
                                                                        </td>
                                                                        <td className="py-2 text-center text-gray-600">
                                                                            {exam.duration || 'N/A'}
                                                                        </td>
                                                                        <td className="py-2 text-center">
                                                                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(exam.status)}`}>
                                                                                {exam.status}
                                                                            </span>
                                                                        </td>
                                                                        <td className="py-2 text-right">
                                                                            <div className="flex items-center justify-end space-x-1">
                                                                                <button
                                                                                    onClick={() => setViewExamModal({ isOpen: true, examSetId: exam.id })}
                                                                                    className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                                                                                    title="Xem chi tiết"
                                                                                >
                                                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                                                    </svg>
                                                                                </button>
                                                                                <button
                                                                                    onClick={() => setDeleteExamModal({ isOpen: true, exam })}
                                                                                    className="p-1 text-red-600 hover:bg-red-50 rounded"
                                                                                    title="Xóa"
                                                                                >
                                                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                                                    </svg>
                                                                                </button>
                                                                            </div>
                                                                        </td>
                                                                    </tr>
                                                                ))}
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                )}
                                            </div>
                                        ))
                                    ) : (
                                        <div className="px-6 py-8 text-center text-gray-400">
                                            <p>Chưa có chương con. Nhấn "+ Chương con" để thêm.</p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    ))
                ) : (
                    <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
                        <div className="text-gray-400 text-4xl mb-4">📚</div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Chưa có chương nào</h3>
                        <p className="text-gray-600 mb-4">Hãy tạo chương đầu tiên để bắt đầu tổ chức bài tập.</p>
                        <button
                            onClick={() => setChapterModal({ isOpen: true, mode: 'create', chapter: null })}
                            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
                        >
                            Tạo chương mới
                        </button>
                    </div>
                )}
            </div>

            {/* Chapter Modal */}
            {chapterModal.isOpen && (
                <ChapterFormModal
                    mode={chapterModal.mode}
                    chapter={chapterModal.chapter}
                    onClose={() => setChapterModal({ isOpen: false, mode: 'create', chapter: null })}
                    onSubmit={async (data) => {
                        if (chapterModal.mode === 'create') {
                            await handleCreateChapter(data as CreateChapterExamSetDto);
                        } else {
                            await handleUpdateChapter(chapterModal.chapter!.id, data as UpdateChapterExamSetDto);
                        }
                    }}
                    isSubmitting={createChapterMutation.isPending || updateChapterMutation.isPending}
                />
            )}

            {/* SubChapter Modal */}
            {subChapterModal.isOpen && (
                <SubChapterFormModal
                    mode={subChapterModal.mode}
                    parentChapterId={subChapterModal.parentChapterId}
                    subChapter={subChapterModal.subChapter}
                    onClose={() => setSubChapterModal({ isOpen: false, mode: 'create', parentChapterId: null, subChapter: null })}
                    onSubmit={async (data) => {
                        if (subChapterModal.mode === 'create') {
                            await handleCreateSubChapter(data as CreateSubChapterExamSetDto);
                        } else {
                            await handleUpdateSubChapter(subChapterModal.subChapter!.id, data as UpdateSubChapterExamSetDto);
                        }
                    }}
                    isSubmitting={createSubChapterMutation.isPending || updateSubChapterMutation.isPending}
                />
            )}

            {/* Delete Chapter Confirmation */}
            {deleteChapterModal.isOpen && (
                <DeleteConfirmModal
                    title="Xóa chương"
                    message={`Bạn có chắc chắn muốn xóa chương "${deleteChapterModal.chapter?.name}"? Tất cả chương con sẽ bị xóa theo.`}
                    onClose={() => setDeleteChapterModal({ isOpen: false, chapter: null })}
                    onConfirm={handleDeleteChapter}
                    isSubmitting={deleteChapterMutation.isPending}
                />
            )}

            {/* Delete SubChapter Confirmation */}
            {deleteSubChapterModal.isOpen && (
                <DeleteConfirmModal
                    title="Xóa chương con"
                    message={`Bạn có chắc chắn muốn xóa chương con "${deleteSubChapterModal.subChapter?.name}"?`}
                    onClose={() => setDeleteSubChapterModal({ isOpen: false, subChapter: null })}
                    onConfirm={handleDeleteSubChapter}
                    isSubmitting={deleteSubChapterMutation.isPending}
                />
            )}

            {/* Delete Exam Confirmation */}
            {deleteExamModal.isOpen && (
                <DeleteConfirmModal
                    title="Xóa đề thi"
                    message={`Bạn có chắc chắn muốn xóa đề thi "${deleteExamModal.exam?.name}"?`}
                    onClose={() => setDeleteExamModal({ isOpen: false, exam: null })}
                    onConfirm={handleDeleteExam}
                    isSubmitting={deleteExamMutation.isPending}
                />
            )}

            {/* View Exam Modal */}
            <ViewExamSetModal
                examSetId={viewExamModal.examSetId || ''}
                isOpen={viewExamModal.isOpen}
                onClose={() => setViewExamModal({ isOpen: false, examSetId: null })}
            />
        </div>
    );
}

// Chapter Form Modal Component
function ChapterFormModal({
    mode,
    chapter,
    onClose,
    onSubmit,
    isSubmitting
}: {
    mode: 'create' | 'edit';
    chapter: ChapterExamSetResponse | null;
    onClose: () => void;
    onSubmit: (data: CreateChapterExamSetDto | UpdateChapterExamSetDto) => void;
    isSubmitting: boolean;
}) {
    const [formData, setFormData] = useState({
        name: chapter?.name || '',
        sortOrder: chapter?.sortOrder || 0,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    {mode === 'create' ? 'Tạo chương mới' : 'Chỉnh sửa chương'}
                </h3>
                <form onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Tên chương *
                            </label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                                placeholder="VD: Chương 1: Đại số"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Thứ tự sắp xếp
                            </label>
                            <input
                                type="number"
                                value={formData.sortOrder}
                                onChange={(e) => setFormData(prev => ({ ...prev, sortOrder: parseInt(e.target.value) || 0 }))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                                min={0}
                            />
                        </div>
                    </div>
                    <div className="flex justify-end space-x-3 mt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isSubmitting}
                            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                        >
                            Hủy
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium disabled:opacity-50"
                        >
                            {isSubmitting ? 'Đang lưu...' : (mode === 'create' ? 'Tạo mới' : 'Lưu thay đổi')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

// SubChapter Form Modal Component
function SubChapterFormModal({
    mode,
    parentChapterId,
    subChapter,
    onClose,
    onSubmit,
    isSubmitting
}: {
    mode: 'create' | 'edit';
    parentChapterId: string | null;
    subChapter: SubChapterExamSetResponse | null;
    onClose: () => void;
    onSubmit: (data: CreateSubChapterExamSetDto | UpdateSubChapterExamSetDto) => void;
    isSubmitting: boolean;
}) {
    const [formData, setFormData] = useState({
        name: subChapter?.name || '',
        sortOrder: subChapter?.sortOrder || 0,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (mode === 'create' && parentChapterId) {
            onSubmit({
                name: formData.name,
                sortOrder: formData.sortOrder,
                chapterExamSetId: parentChapterId,
            } as CreateSubChapterExamSetDto);
        } else {
            onSubmit(formData as UpdateSubChapterExamSetDto);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    {mode === 'create' ? 'Tạo chương con mới' : 'Chỉnh sửa chương con'}
                </h3>
                <form onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Tên chương con *
                            </label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                placeholder="VD: 1.1 Phương trình bậc nhất"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Thứ tự sắp xếp
                            </label>
                            <input
                                type="number"
                                value={formData.sortOrder}
                                onChange={(e) => setFormData(prev => ({ ...prev, sortOrder: parseInt(e.target.value) || 0 }))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                min={0}
                            />
                        </div>
                    </div>
                    <div className="flex justify-end space-x-3 mt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isSubmitting}
                            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                        >
                            Hủy
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium disabled:opacity-50"
                        >
                            {isSubmitting ? 'Đang lưu...' : (mode === 'create' ? 'Tạo mới' : 'Lưu thay đổi')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

// Delete Confirmation Modal Component
function DeleteConfirmModal({
    title,
    message,
    onClose,
    onConfirm,
    isSubmitting
}: {
    title: string;
    message: string;
    onClose: () => void;
    onConfirm: () => void;
    isSubmitting: boolean;
}) {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
                <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mr-4">
                        <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
                        <p className="text-sm text-gray-600">Hành động này không thể hoàn tác</p>
                    </div>
                </div>
                <p className="text-gray-700 mb-6">{message}</p>
                <div className="flex justify-end space-x-3">
                    <button
                        onClick={onClose}
                        disabled={isSubmitting}
                        className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                    >
                        Hủy
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={isSubmitting}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium disabled:opacity-50"
                    >
                        {isSubmitting ? 'Đang xóa...' : 'Xóa'}
                    </button>
                </div>
            </div>
        </div>
    );
}
