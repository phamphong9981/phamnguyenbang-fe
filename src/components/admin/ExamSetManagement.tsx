'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
    useExamSets,
    useDeleteExamSet,
    useUpdateExamSet,
    useChapterExamSets,
    useCreateChapterExamSet,
    useUpdateChapterExamSet,
    useDeleteChapterExamSet,
    useCreateSubChapterExamSet,
    useUpdateSubChapterExamSet,
    useDeleteSubChapterExamSet,
    ExamSetType,
    ExamSetStatus,
    ExamSetResponse,
    UpdateExamSetDto,
    SUBJECT_ID,
    ChapterExamSetResponse,
    SubChapterExamSetResponse,
    CreateChapterExamSetDto,
    UpdateChapterExamSetDto,
    CreateSubChapterExamSetDto,
    UpdateSubChapterExamSetDto,
    ExamSetGroupExamType,
} from '@/hooks/useExam';
import ImportExamSetModal from './ImportExamSetModal';
import ViewExamSetModal from './ViewExamSetModal';
import GroupManagementModal from './GroupManagementModal';

interface EditExamSetModalProps {
    examSet: ExamSetResponse;
    onClose: () => void;
    onSubmit: (data: UpdateExamSetDto) => void;
    isSubmitting: boolean;
}

function EditExamSetModal({ examSet, onClose, onSubmit, isSubmitting }: EditExamSetModalProps) {
    const [formData, setFormData] = useState<UpdateExamSetDto>({
        name: examSet.name,
        type: examSet.type,
        year: examSet.year,
        subject: examSet.subject,
        duration: examSet.duration,
        difficulty: examSet.difficulty,
        password: examSet.password,
        lockView: examSet.lockView ?? false,
        status: examSet.status,
        description: examSet.description,
        grade: examSet.grade,
        class: examSet.class || undefined,
        deadline: examSet.deadline ? new Date(examSet.deadline) : undefined,
        subChapterId: examSet.subChapterId || undefined,
    });

    // Get chapters for Chapter type
    const { data: chapters } = useChapterExamSets(examSet.grade);
    const [selectedChapterId, setSelectedChapterId] = useState<string>('');

    // Find current chapter and subchapter
    const currentChapterInfo = (() => {
        if (!examSet.subChapterId || !chapters) return null;
        for (const chapter of chapters) {
            const subChapter = chapter.subChapters?.find(sub => sub.id === examSet.subChapterId);
            if (subChapter) {
                return { chapter, subChapter };
            }
        }
        return null;
    })();

    // Set initial selected chapter
    useEffect(() => {
        if (currentChapterInfo) {
            setSelectedChapterId(currentChapterInfo.chapter.id);
        }
    }, [currentChapterInfo]);

    // Get subchapters for selected chapter
    const availableSubChapters = selectedChapterId
        ? chapters?.find(ch => ch.id === selectedChapterId)?.subChapters || []
        : [];

    // Update subChapterId when subchapter is selected
    const handleSubChapterChange = (subChapterId: string) => {
        setFormData(prev => ({ ...prev, subChapterId: subChapterId || undefined }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    const getSubjectLabel = (subjectId: number): string => {
        switch (subjectId) {
            case SUBJECT_ID.MATH: return 'Toán học';
            case SUBJECT_ID.GEOGRAPHY: return 'Địa lý';
            case SUBJECT_ID.LITERATURE: return 'Ngữ văn';
            case SUBJECT_ID.HISTORY: return 'Lịch sử';
            case SUBJECT_ID.ENGLISH: return 'Tiếng Anh';
            case SUBJECT_ID.PHYSICS: return 'Vật lý';
            case SUBJECT_ID.CHEMISTRY: return 'Hóa học';
            case SUBJECT_ID.BIOLOGY: return 'Sinh học';
            case SUBJECT_ID.SCIENCE: return 'Khoa học tự nhiên';
            default: return 'Môn học';
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                        Chỉnh sửa đề thi
                    </h3>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Tên đề thi
                            </label>
                            <input
                                type="text"
                                value={formData.name || ''}
                                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value || undefined }))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Nhập tên đề thi"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Loại đề thi
                                </label>
                                <select
                                    value={formData.type || ''}
                                    onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as ExamSetType || undefined }))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">Chọn loại đề thi</option>
                                    <option value={ExamSetType.HSA}>HSA</option>
                                    <option value={ExamSetType.TSA}>TSA</option>
                                    <option value={ExamSetType.CHAPTER}>Chapter</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Môn học
                                </label>
                                <select
                                    value={formData.subject || ''}
                                    onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value ? parseInt(e.target.value) : undefined }))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">Chọn môn học</option>
                                    <option value={SUBJECT_ID.MATH}>Toán học</option>
                                    <option value={SUBJECT_ID.GEOGRAPHY}>Địa lý</option>
                                    <option value={SUBJECT_ID.LITERATURE}>Ngữ văn</option>
                                    <option value={SUBJECT_ID.HISTORY}>Lịch sử</option>
                                    <option value={SUBJECT_ID.ENGLISH}>Tiếng Anh</option>
                                    <option value={SUBJECT_ID.PHYSICS}>Vật lý</option>
                                    <option value={SUBJECT_ID.CHEMISTRY}>Hóa học</option>
                                    <option value={SUBJECT_ID.BIOLOGY}>Sinh học</option>
                                    <option value={SUBJECT_ID.SCIENCE}>Khoa học tự nhiên</option>
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Năm học
                                </label>
                                <input
                                    type="text"
                                    value={formData.year || ''}
                                    onChange={(e) => setFormData(prev => ({ ...prev, year: e.target.value || undefined }))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="VD: 2023-2024"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Khối lớp
                                </label>
                                <select
                                    value={formData.grade || ''}
                                    onChange={(e) => setFormData(prev => ({ ...prev, grade: e.target.value ? parseInt(e.target.value) : undefined }))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">Chọn khối lớp</option>
                                    <option value={10}>Lớp 10</option>
                                    <option value={11}>Lớp 11</option>
                                    <option value={12}>Lớp 12</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Thời gian làm bài
                            </label>
                            <input
                                type="text"
                                value={formData.duration || ''}
                                onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value || undefined }))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="90 phút"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Mật khẩu đề thi (tùy chọn)
                            </label>
                            <input
                                type="text"
                                value={formData.password || ''}
                                onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Để trống nếu không đặt mật khẩu"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Độ khó
                                </label>
                                <select
                                    value={formData.difficulty || ''}
                                    onChange={(e) => setFormData(prev => ({ ...prev, difficulty: e.target.value || undefined }))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">Chọn độ khó</option>
                                    <option value="Dễ">Dễ</option>
                                    <option value="Trung bình">Trung bình</option>
                                    <option value="Khó">Khó</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Trạng thái
                                </label>
                                <select
                                    value={formData.status || ''}
                                    onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as ExamSetStatus || undefined }))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">Chọn trạng thái</option>
                                    <option value={ExamSetStatus.AVAILABLE}>Có sẵn</option>
                                    <option value="draft">Bản nháp</option>
                                    <option value="archived">Đã lưu trữ</option>
                                    <option value={ExamSetStatus.EXPIRED}>Đã hết hạn</option>
                                </select>
                            </div>
                        </div>

                        <div className="flex items-start gap-3 rounded-lg border border-gray-200 bg-gray-50/80 p-4">
                            <input
                                id="edit-exam-lockView"
                                type="checkbox"
                                checked={formData.lockView ?? false}
                                onChange={(e) =>
                                    setFormData((prev) => ({ ...prev, lockView: e.target.checked }))
                                }
                                className="mt-1 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <label htmlFor="edit-exam-lockView" className="text-sm text-gray-700 cursor-pointer">
                                <span className="font-medium text-gray-900">Khóa xem (lockView)</span>
                                <p className="mt-1 text-gray-500 leading-relaxed">
                                    Bật nếu đề này cần chế độ khóa xem nội dung theo cấu hình backend (ví dụ: hạn chế xem đáp án trước khi nộp bài).
                                </p>
                            </label>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Mô tả
                            </label>
                            <textarea
                                value={formData.description || ''}
                                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value || undefined }))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Nhập mô tả đề thi"
                                rows={3}
                            />
                        </div>

                        {/* Chapter/SubChapter selection for Chapter type */}
                        {formData.type === ExamSetType.CHAPTER && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Chương
                                    </label>
                                    <select
                                        value={selectedChapterId}
                                        onChange={(e) => {
                                            setSelectedChapterId(e.target.value);
                                            setFormData(prev => ({ ...prev, subChapterId: undefined })); // Reset subchapter when chapter changes
                                        }}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="">-- Chọn chương --</option>
                                        {chapters?.map((chapter) => (
                                            <option key={chapter.id} value={chapter.id}>
                                                {chapter.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Chương con
                                    </label>
                                    <select
                                        value={formData.subChapterId || ''}
                                        onChange={(e) => handleSubChapterChange(e.target.value)}
                                        disabled={!selectedChapterId || availableSubChapters.length === 0}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                                    >
                                        <option value="">-- Chọn chương con --</option>
                                        {availableSubChapters.map((subChapter) => (
                                            <option key={subChapter.id} value={subChapter.id}>
                                                {subChapter.name}
                                            </option>
                                        ))}
                                    </select>
                                    {selectedChapterId && availableSubChapters.length === 0 && (
                                        <p className="mt-1 text-xs text-gray-500">Chương này chưa có chương con</p>
                                    )}
                                </div>
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Lớp (tùy chọn)
                                </label>
                                <input
                                    type="text"
                                    value={formData.class || ''}
                                    onChange={(e) => setFormData(prev => ({ ...prev, class: e.target.value || undefined }))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="VD: 12a1, 11b2"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Deadline (tùy chọn)
                                </label>
                                <input
                                    type="datetime-local"
                                    value={formData.deadline ? new Date(formData.deadline).toISOString().slice(0, 16) : ''}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        setFormData(prev => ({
                                            ...prev,
                                            deadline: value ? new Date(value) : undefined
                                        }));
                                    }}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end space-x-3 mt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isSubmitting}
                            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Hủy
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                        >
                            {isSubmitting ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                    Đang lưu...
                                </>
                            ) : (
                                'Lưu thay đổi'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default function ExamSetManagement() {
    const router = useRouter();
    const [selectedType, setSelectedType] = useState<ExamSetType>(ExamSetType.HSA);
    const [selectedGrade, setSelectedGrade] = useState<number | undefined>(undefined);
    const [showImportModal, setShowImportModal] = useState(false);
    const [deleteModal, setDeleteModal] = useState<{
        isOpen: boolean;
        examSet: ExamSetResponse | null;
    }>({
        isOpen: false,
        examSet: null,
    });

    const [viewModal, setViewModal] = useState<{
        isOpen: boolean;
        examSetId: string | null;
    }>({
        isOpen: false,
        examSetId: null,
    });

    const [editModal, setEditModal] = useState<{
        isOpen: boolean;
        examSet: ExamSetResponse | null;
    }>({
        isOpen: false,
        examSet: null,
    });

    const [chapterManagementModal, setChapterManagementModal] = useState<{
        isOpen: boolean;
    }>({ isOpen: false });

    const [groupManagementModal, setGroupManagementModal] = useState<{
        isOpen: boolean;
    }>({ isOpen: false });

    const { data: examSets, isLoading, error, refetch } = useExamSets(selectedType, selectedGrade);
    const deleteExamSetMutation = useDeleteExamSet();
    const updateExamSetMutation = useUpdateExamSet();

    // Chapter management hooks
    const { data: chapters, refetch: refetchChapters } = useChapterExamSets(selectedGrade);

    // Helper function to find chapter and subchapter info for an exam set
    const getChapterInfo = (examSet: ExamSetResponse) => {
        if (!examSet.subChapterId || !chapters) return null;

        for (const chapter of chapters) {
            const subChapter = chapter.subChapters?.find(sub => sub.id === examSet.subChapterId);
            if (subChapter) {
                return {
                    chapter: chapter,
                    subChapter: subChapter
                };
            }
        }
        return null;
    };
    const createChapterMutation = useCreateChapterExamSet();
    const updateChapterMutation = useUpdateChapterExamSet();
    const deleteChapterMutation = useDeleteChapterExamSet();
    const createSubChapterMutation = useCreateSubChapterExamSet();
    const updateSubChapterMutation = useUpdateSubChapterExamSet();
    const deleteSubChapterMutation = useDeleteSubChapterExamSet();


    const getTypeLabel = (type: ExamSetType) => {
        switch (type) {
            case ExamSetType.HSA: return 'HSA';
            case ExamSetType.TSA: return 'TSA';
            case ExamSetType.CHAPTER: return 'Chapter';
            default: return type;
        }
    };

    const getTypeColor = (type: ExamSetType) => {
        switch (type) {
            case ExamSetType.HSA: return 'bg-blue-100 text-blue-800';
            case ExamSetType.TSA: return 'bg-green-100 text-green-800';
            case ExamSetType.CHAPTER: return 'bg-purple-100 text-purple-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getDifficultyColor = (difficulty: string) => {
        switch (difficulty) {
            case 'Dễ': return 'bg-green-100 text-green-800';
            case 'Trung bình': return 'bg-yellow-100 text-yellow-800';
            case 'Khó': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusColor = (status: ExamSetStatus | string) => {
        switch (status) {
            case ExamSetStatus.AVAILABLE:
            case 'available': return 'bg-green-100 text-green-800';
            case ExamSetStatus.EXPIRED:
            case 'expired': return 'bg-red-100 text-red-800';
            case 'draft': return 'bg-yellow-100 text-yellow-800';
            case 'archived': return 'bg-gray-100 text-gray-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusLabel = (status: ExamSetStatus | string) => {
        switch (status) {
            case ExamSetStatus.AVAILABLE:
            case 'available': return 'Có sẵn';
            case ExamSetStatus.EXPIRED:
            case 'expired': return 'Đã hết hạn';
            case 'draft': return 'Bản nháp';
            case 'archived': return 'Đã lưu trữ';
            default: return status;
        }
    };

    const handleDeleteClick = (examSet: ExamSetResponse) => {
        setDeleteModal({
            isOpen: true,
            examSet,
        });
    };

    const handleDeleteConfirm = async () => {
        if (!deleteModal.examSet) return;

        try {
            await deleteExamSetMutation.mutateAsync(deleteModal.examSet.id);
            setDeleteModal({
                isOpen: false,
                examSet: null,
            });
            // Refetch data to update the list
            refetch();
        } catch (error) {
            console.error('Error deleting exam set:', error);
        }
    };

    const handleDeleteCancel = () => {
        setDeleteModal({
            isOpen: false,
            examSet: null,
        });
    };

    const handleViewClick = (examSet: ExamSetResponse) => {
        setViewModal({
            isOpen: true,
            examSetId: examSet.id,
        });
    };

    const handleViewClose = () => {
        setViewModal({
            isOpen: false,
            examSetId: null,
        });
    };

    const handleEditClick = (examSet: ExamSetResponse) => {
        setEditModal({
            isOpen: true,
            examSet,
        });
    };

    const handleEditClose = () => {
        setEditModal({
            isOpen: false,
            examSet: null,
        });
    };

    const handleEditSubmit = async (data: UpdateExamSetDto) => {
        if (!editModal.examSet) return;

        try {
            await updateExamSetMutation.mutateAsync({
                id: editModal.examSet.id,
                data,
            });
            await refetch();
            handleEditClose();
        } catch (error) {
            console.error('Error updating exam set:', error);
        }
    };

    if (isLoading) {
        return (
            <div className="p-6">
                <div className="flex items-center justify-center py-12">
                    <div className="text-center">
                        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-gray-600">Đang tải danh sách đề thi...</p>
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
                    <p className="text-red-600">Có lỗi xảy ra khi tải danh sách đề thi</p>
                    <button
                        onClick={() => refetch()}
                        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
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
                            Quản lý đề thi
                        </h2>
                        <p className="text-gray-600">
                            Tạo và quản lý các đề thi HSA, TSA và Chapter
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={() => setGroupManagementModal({ isOpen: true })}
                            className="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-medium border-2 border-orange-200"
                        >
                            🗂️ Quản lý Bộ đề
                        </button>
                        {selectedType === ExamSetType.CHAPTER && (
                            <button
                                onClick={() => setChapterManagementModal({ isOpen: true })}
                                className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium shadow-sm"
                            >
                                📚 Quản lý Chương
                            </button>
                        )}
                        <button
                            onClick={() => setShowImportModal(true)}
                            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
                        >
                            📥 Import từ JSON
                        </button>
                        <button
                            onClick={() => router.push('/admin/create-exam-set')}
                            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                        >
                            + Tạo đề thi mới
                        </button>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="mb-6">
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Loại đề thi
                            </label>
                            <select
                                value={selectedType}
                                onChange={(e) => setSelectedType(e.target.value as ExamSetType)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value={ExamSetType.HSA}>HSA</option>
                                <option value={ExamSetType.TSA}>TSA</option>
                                <option value={ExamSetType.CHAPTER}>Chapter</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Khối lớp (tùy chọn)
                            </label>
                            <select
                                value={selectedGrade || ''}
                                onChange={(e) => setSelectedGrade(e.target.value ? parseInt(e.target.value) : undefined)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">Tất cả khối lớp</option>
                                <option value={10}>Lớp 10</option>
                                <option value={11}>Lớp 11</option>
                                <option value={12}>Lớp 12</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            {/* Exam Sets List */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                {examSets && examSets.length > 0 ? (
                    <div className="divide-y divide-gray-200">
                        {examSets.map((examSet) => (
                            <div key={examSet.id} className="p-6 hover:bg-gray-50 transition-colors">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center space-x-3 mb-2">
                                            <h3 className="text-lg font-semibold text-gray-900">
                                                {examSet.name}
                                            </h3>
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(examSet.type)}`}>
                                                {getTypeLabel(examSet.type)}
                                            </span>
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(examSet.difficulty)}`}>
                                                {examSet.difficulty}
                                            </span>
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(examSet.status)}`}>
                                                {getStatusLabel(examSet.status)}
                                            </span>
                                            {examSet.lockView && (
                                                <span className="px-2 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-900 border border-amber-200" title="Đề bật khóa xem">
                                                    🔒 Lock view
                                                </span>
                                            )}
                                        </div>

                                        <p className="text-gray-600 mb-3">
                                            {examSet.description}
                                        </p>

                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-500">
                                            <div>
                                                <span className="font-medium">Năm học:</span> {examSet.year}
                                            </div>
                                            <div>
                                                <span className="font-medium">Khối lớp:</span> {examSet.grade}
                                            </div>
                                            <div>
                                                <span className="font-medium">Thời gian:</span> {examSet.duration}
                                            </div>
                                            <div>
                                                <span className="font-medium">Môn học:</span> {examSet.subject}
                                            </div>
                                        </div>

                                        {/* Chapter/SubChapter info for Chapter type */}
                                        {selectedType === ExamSetType.CHAPTER && (() => {
                                            const chapterInfo = getChapterInfo(examSet);
                                            if (chapterInfo) {
                                                return (
                                                    <div className="mt-3 flex items-center space-x-2 text-sm">
                                                        <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                                                            📚 {chapterInfo.chapter.name}
                                                        </span>
                                                        <span className="text-gray-400">→</span>
                                                        <span className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-medium">
                                                            {chapterInfo.subChapter.name}
                                                        </span>
                                                    </div>
                                                );
                                            } else if (examSet.subChapterId) {
                                                return (
                                                    <div className="mt-3 text-sm text-gray-400 italic">
                                                        Chương con: {examSet.subChapterId}
                                                    </div>
                                                );
                                            }
                                            return null;
                                        })()}

                                        {(examSet.class || examSet.deadline) && (
                                            <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                                {examSet.class && (
                                                    <div className="text-gray-500">
                                                        <span className="font-medium">Lớp:</span> {examSet.class}
                                                    </div>
                                                )}
                                                {examSet.deadline && (
                                                    <div className={`${examSet.status === ExamSetStatus.EXPIRED ? 'text-red-600' : 'text-gray-500'}`}>
                                                        <span className="font-medium">Deadline:</span>{' '}
                                                        {new Date(examSet.deadline).toLocaleDateString('vi-VN', {
                                                            day: '2-digit',
                                                            month: '2-digit',
                                                            year: 'numeric',
                                                            hour: '2-digit',
                                                            minute: '2-digit'
                                                        })}
                                                        {new Date(examSet.deadline) < new Date() && (
                                                            <span className="ml-2 px-2 py-0.5 bg-red-100 text-red-700 rounded text-xs font-medium">
                                                                Đã hết hạn
                                                            </span>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex items-center space-x-2 ml-4">
                                        <button
                                            onClick={() => handleViewClick(examSet)}
                                            className="px-3 py-1 text-blue-600 hover:text-blue-800 text-sm font-medium"
                                            title="Xem chi tiết"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                            </svg>
                                        </button>
                                        <button
                                            onClick={() => handleEditClick(examSet)}
                                            className="px-3 py-1 text-orange-600 hover:text-orange-800 text-sm font-medium"
                                            title="Chỉnh sửa đề thi"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                            </svg>
                                        </button>
                                        <button
                                            onClick={() => handleDeleteClick(examSet)}
                                            className="px-3 py-1 text-red-600 hover:text-red-800 text-sm font-medium"
                                            title="Xóa"
                                            disabled={deleteExamSetMutation.isPending}
                                        >
                                            {deleteExamSetMutation.isPending ? (
                                                <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                                            ) : (
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <div className="text-gray-400 text-4xl mb-4">📝</div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                            Chưa có đề thi nào
                        </h3>
                        <p className="text-gray-600 mb-4">
                            Hãy tạo đề thi đầu tiên để bắt đầu quản lý.
                        </p>
                        <button
                            onClick={() => router.push('/admin/create-exam-set')}
                            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                        >
                            Tạo đề thi mới
                        </button>
                    </div>
                )}
            </div>

            {/* Import Modal */}
            <ImportExamSetModal
                isOpen={showImportModal}
                onClose={() => setShowImportModal(false)}
            />

            {/* View Exam Detail Modal */}
            <ViewExamSetModal
                examSetId={viewModal.examSetId || ''}
                isOpen={viewModal.isOpen}
                onClose={handleViewClose}
            />

            {/* Edit Class and Deadline Modal */}
            {editModal.isOpen && editModal.examSet && (
                <EditExamSetModal
                    examSet={editModal.examSet}
                    onClose={handleEditClose}
                    onSubmit={handleEditSubmit}
                    isSubmitting={updateExamSetMutation.isPending}
                />
            )}

            {/* Chapter Management Modal */}
            {chapterManagementModal.isOpen && (
                <ChapterManagementModal
                    chapters={chapters || []}
                    examSets={examSets || []}
                    selectedGrade={selectedGrade}
                    onClose={() => {
                        setChapterManagementModal({ isOpen: false });
                        refetch();
                        refetchChapters();
                    }}
                    onCreateChapter={async (data) => {
                        await createChapterMutation.mutateAsync(data);
                        refetchChapters();
                    }}
                    onUpdateChapter={async (id, data) => {
                        await updateChapterMutation.mutateAsync({ id, data });
                        refetchChapters();
                    }}
                    onDeleteChapter={async (id) => {
                        await deleteChapterMutation.mutateAsync(id);
                        refetchChapters();
                    }}
                    onCreateSubChapter={async (data) => {
                        await createSubChapterMutation.mutateAsync(data);
                        refetchChapters();
                    }}
                    onUpdateSubChapter={async (id, data) => {
                        await updateSubChapterMutation.mutateAsync({ id, data });
                        refetchChapters();
                    }}
                    onDeleteSubChapter={async (id) => {
                        await deleteSubChapterMutation.mutateAsync(id);
                        refetchChapters();
                    }}
                    onAssignExamToSubChapter={async (examId, subChapterId) => {
                        await updateExamSetMutation.mutateAsync({
                            id: examId,
                            data: { subChapterId }
                        });
                        refetch();
                        refetchChapters();
                    }}
                    isSubmitting={
                        createChapterMutation.isPending ||
                        updateChapterMutation.isPending ||
                        deleteChapterMutation.isPending ||
                        createSubChapterMutation.isPending ||
                        updateSubChapterMutation.isPending ||
                        deleteSubChapterMutation.isPending ||
                        updateExamSetMutation.isPending
                    }
                />
            )}

            {/* Group Management Modal */}
            {groupManagementModal.isOpen && (
                <GroupManagementModal
                    onClose={() => {
                        setGroupManagementModal({ isOpen: false });
                        refetch();
                    }}
                    onRefreshMainList={() => refetch()}
                />
            )}

            {/* Delete Confirmation Modal */}
            {deleteModal.isOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                        <div className="flex items-center mb-4">
                            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mr-4">
                                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">
                                    Xác nhận xóa đề thi
                                </h3>
                                <p className="text-sm text-gray-600">
                                    Hành động này không thể hoàn tác
                                </p>
                            </div>
                        </div>

                        <div className="mb-6">
                            <p className="text-gray-700">
                                Bạn có chắc chắn muốn xóa đề thi{' '}
                                <span className="font-semibold text-gray-900">
                                    "{deleteModal.examSet?.name}"
                                </span>
                                ?
                            </p>
                            <p className="text-sm text-gray-600 mt-2">
                                Tất cả dữ liệu liên quan đến đề thi này sẽ bị xóa vĩnh viễn.
                            </p>
                        </div>

                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={handleDeleteCancel}
                                disabled={deleteExamSetMutation.isPending}
                                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Hủy
                            </button>
                            <button
                                onClick={handleDeleteConfirm}
                                disabled={deleteExamSetMutation.isPending}
                                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                            >
                                {deleteExamSetMutation.isPending ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                        Đang xóa...
                                    </>
                                ) : (
                                    'Xóa đề thi'
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

// Chapter Management Modal Component
function ChapterManagementModal({
    chapters,
    examSets,
    selectedGrade,
    onClose,
    onCreateChapter,
    onUpdateChapter,
    onDeleteChapter,
    onCreateSubChapter,
    onUpdateSubChapter,
    onDeleteSubChapter,
    onAssignExamToSubChapter,
    isSubmitting
}: {
    chapters: ChapterExamSetResponse[];
    examSets: ExamSetResponse[];
    selectedGrade?: number;
    onClose: () => void;
    onCreateChapter: (data: CreateChapterExamSetDto) => Promise<void>;
    onUpdateChapter: (id: string, data: UpdateChapterExamSetDto) => Promise<void>;
    onDeleteChapter: (id: string) => Promise<void>;
    onCreateSubChapter: (data: CreateSubChapterExamSetDto) => Promise<void>;
    onUpdateSubChapter: (id: string, data: UpdateSubChapterExamSetDto) => Promise<void>;
    onDeleteSubChapter: (id: string) => Promise<void>;
    onAssignExamToSubChapter: (examId: string, subChapterId: string) => Promise<void>;
    isSubmitting: boolean;
}) {
    const [expandedChapters, setExpandedChapters] = useState<Set<string>>(new Set());
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
    const [assignExamModal, setAssignExamModal] = useState<{
        isOpen: boolean;
        subChapterId: string | null;
    }>({ isOpen: false, subChapterId: null });
    const [deleteChapterModal, setDeleteChapterModal] = useState<{
        isOpen: boolean;
        chapter: ChapterExamSetResponse | null;
    }>({ isOpen: false, chapter: null });
    const [deleteSubChapterModal, setDeleteSubChapterModal] = useState<{
        isOpen: boolean;
        subChapter: SubChapterExamSetResponse | null;
    }>({ isOpen: false, subChapter: null });

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

    // Get unassigned exam sets (not in any subchapter)
    const assignedExamIds = new Set(
        chapters.flatMap(ch =>
            ch.subChapters?.flatMap(sub => sub.examSets?.map(exam => exam.id) || []) || []
        )
    );
    const unassignedExams = examSets.filter(exam => !assignedExamIds.has(exam.id));

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">Quản lý Chương và Chương con</h2>
                        <p className="text-sm text-gray-600 mt-1">Tổ chức bài tập theo cấu trúc phân cấp</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    <div className="mb-4 flex justify-end">
                        <button
                            onClick={() => setChapterModal({ isOpen: true, mode: 'create', chapter: null })}
                            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
                        >
                            + Tạo chương mới
                        </button>
                    </div>

                    <div className="space-y-4">
                        {chapters.length > 0 ? (
                            chapters.map((chapter, chapterIndex) => (
                                <div key={chapter.id} className="bg-gray-50 rounded-lg border border-gray-200 overflow-hidden">
                                    {/* Chapter Header */}
                                    <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-purple-50 to-indigo-50">
                                        <button
                                            onClick={() => toggleChapter(chapter.id)}
                                            className="flex items-center space-x-3 flex-1 text-left"
                                        >
                                            <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center text-white font-bold">
                                                {chapterIndex + 1}
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-gray-900">{chapter.name}</h3>
                                                <p className="text-xs text-gray-500">
                                                    {chapter.subChapters?.length || 0} chương con
                                                    {chapter.grade && ` • Lớp ${chapter.grade}`}
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
                                        <div className="flex items-center space-x-2">
                                            <button
                                                onClick={() => setSubChapterModal({ isOpen: true, mode: 'create', parentChapterId: chapter.id, subChapter: null })}
                                                className="px-2 py-1 text-xs bg-indigo-100 text-indigo-700 rounded hover:bg-indigo-200 transition-colors"
                                            >
                                                + Chương con
                                            </button>
                                            <button
                                                onClick={() => setChapterModal({ isOpen: true, mode: 'edit', chapter })}
                                                className="p-1.5 text-orange-600 hover:bg-orange-50 rounded"
                                                title="Sửa"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                </svg>
                                            </button>
                                            <button
                                                onClick={() => setDeleteChapterModal({ isOpen: true, chapter })}
                                                className="p-1.5 text-red-600 hover:bg-red-50 rounded"
                                                title="Xóa"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>

                                    {/* SubChapters */}
                                    {expandedChapters.has(chapter.id) && (
                                        <div className="border-t border-gray-200">
                                            {chapter.subChapters && chapter.subChapters.length > 0 ? (
                                                chapter.subChapters.map((subChapter, subIndex) => (
                                                    <div key={subChapter.id} className="border-b border-gray-200 last:border-b-0 px-4 py-3 bg-white">
                                                        <div className="flex items-center justify-between mb-2">
                                                            <div className="flex items-center space-x-2">
                                                                <div className="w-6 h-6 bg-indigo-100 rounded flex items-center justify-center text-indigo-600 font-semibold text-xs">
                                                                    {chapterIndex + 1}.{subIndex + 1}
                                                                </div>
                                                                <h4 className="font-medium text-gray-800">{subChapter.name}</h4>
                                                                <span className="text-xs text-gray-400">
                                                                    ({subChapter.examSets?.length || 0} đề thi)
                                                                </span>
                                                            </div>
                                                            <div className="flex items-center space-x-1">
                                                                <button
                                                                    onClick={() => setAssignExamModal({ isOpen: true, subChapterId: subChapter.id })}
                                                                    className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
                                                                >
                                                                    + Thêm đề thi
                                                                </button>
                                                                <button
                                                                    onClick={() => setSubChapterModal({ isOpen: true, mode: 'edit', parentChapterId: chapter.id, subChapter })}
                                                                    className="p-1 text-orange-600 hover:bg-orange-50 rounded"
                                                                    title="Sửa"
                                                                >
                                                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                                    </svg>
                                                                </button>
                                                                <button
                                                                    onClick={() => setDeleteSubChapterModal({ isOpen: true, subChapter })}
                                                                    className="p-1 text-red-600 hover:bg-red-50 rounded"
                                                                    title="Xóa"
                                                                >
                                                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                                    </svg>
                                                                </button>
                                                            </div>
                                                        </div>
                                                        {subChapter.examSets && subChapter.examSets.length > 0 && (
                                                            <div className="ml-8 mt-2 space-y-1">
                                                                {subChapter.examSets.map((exam) => (
                                                                    <div key={exam.id} className="text-sm text-gray-600 flex items-center space-x-2">
                                                                        <span className="w-1.5 h-1.5 bg-gray-400 rounded-full"></span>
                                                                        <span>{exam.name}</span>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="px-4 py-6 text-center text-gray-400 text-sm">
                                                    Chưa có chương con. Nhấn "+ Chương con" để thêm.
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-12 text-gray-400">
                                <p>Chưa có chương nào. Nhấn "+ Tạo chương mới" để bắt đầu.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Chapter Form Modal */}
                {chapterModal.isOpen && (
                    <ChapterFormModal
                        mode={chapterModal.mode}
                        chapter={chapterModal.chapter}
                        selectedGrade={selectedGrade}
                        onClose={() => setChapterModal({ isOpen: false, mode: 'create', chapter: null })}
                        onSubmit={async (data) => {
                            if (chapterModal.mode === 'create') {
                                await onCreateChapter(data as CreateChapterExamSetDto);
                            } else {
                                await onUpdateChapter(chapterModal.chapter!.id, data as UpdateChapterExamSetDto);
                            }
                        }}
                        isSubmitting={isSubmitting}
                    />
                )}

                {/* SubChapter Form Modal */}
                {subChapterModal.isOpen && (
                    <SubChapterFormModal
                        mode={subChapterModal.mode}
                        parentChapterId={subChapterModal.parentChapterId}
                        subChapter={subChapterModal.subChapter}
                        onClose={() => setSubChapterModal({ isOpen: false, mode: 'create', parentChapterId: null, subChapter: null })}
                        onSubmit={async (data) => {
                            if (subChapterModal.mode === 'create') {
                                await onCreateSubChapter(data as CreateSubChapterExamSetDto);
                            } else {
                                await onUpdateSubChapter(subChapterModal.subChapter!.id, data as UpdateSubChapterExamSetDto);
                            }
                        }}
                        isSubmitting={isSubmitting}
                    />
                )}

                {/* Assign Exam Modal */}
                {assignExamModal.isOpen && (
                    <AssignExamModal
                        unassignedExams={unassignedExams}
                        onClose={() => setAssignExamModal({ isOpen: false, subChapterId: null })}
                        onAssign={async (examId) => {
                            if (assignExamModal.subChapterId) {
                                await onAssignExamToSubChapter(examId, assignExamModal.subChapterId);
                                setAssignExamModal({ isOpen: false, subChapterId: null });
                            }
                        }}
                        isSubmitting={isSubmitting}
                    />
                )}

                {/* Delete Modals */}
                {deleteChapterModal.isOpen && (
                    <DeleteConfirmModal
                        title="Xóa chương"
                        message={`Bạn có chắc chắn muốn xóa chương "${deleteChapterModal.chapter?.name}"? Tất cả chương con sẽ bị xóa theo.`}
                        onClose={() => setDeleteChapterModal({ isOpen: false, chapter: null })}
                        onConfirm={() => {
                            if (deleteChapterModal.chapter) {
                                onDeleteChapter(deleteChapterModal.chapter.id);
                                setDeleteChapterModal({ isOpen: false, chapter: null });
                            }
                        }}
                        isSubmitting={isSubmitting}
                    />
                )}

                {deleteSubChapterModal.isOpen && (
                    <DeleteConfirmModal
                        title="Xóa chương con"
                        message={`Bạn có chắc chắn muốn xóa chương con "${deleteSubChapterModal.subChapter?.name}"?`}
                        onClose={() => setDeleteSubChapterModal({ isOpen: false, subChapter: null })}
                        onConfirm={() => {
                            if (deleteSubChapterModal.subChapter) {
                                onDeleteSubChapter(deleteSubChapterModal.subChapter.id);
                                setDeleteSubChapterModal({ isOpen: false, subChapter: null });
                            }
                        }}
                        isSubmitting={isSubmitting}
                    />
                )}
            </div>
        </div>
    );
}

// Chapter Form Modal
function ChapterFormModal({
    mode,
    chapter,
    selectedGrade,
    onClose,
    onSubmit,
    isSubmitting
}: {
    mode: 'create' | 'edit';
    chapter: ChapterExamSetResponse | null;
    selectedGrade?: number;
    onClose: () => void;
    onSubmit: (data: CreateChapterExamSetDto | UpdateChapterExamSetDto) => Promise<void>;
    isSubmitting: boolean;
}) {
    const [formData, setFormData] = useState({
        name: chapter?.name || '',
        sortOrder: chapter?.sortOrder || 0,
        grade: chapter?.grade || selectedGrade || undefined,
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // Only include grade if it has a value
        const submitData = {
            ...formData,
            grade: formData.grade || undefined,
        };
        await onSubmit(submitData);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60] p-4">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    {mode === 'create' ? 'Tạo chương mới' : 'Chỉnh sửa chương'}
                </h3>
                <form onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Tên chương *</label>
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
                            <label className="block text-sm font-medium text-gray-700 mb-1">Thứ tự sắp xếp</label>
                            <input
                                type="number"
                                value={formData.sortOrder}
                                onChange={(e) => setFormData(prev => ({ ...prev, sortOrder: parseInt(e.target.value) || 0 }))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                                min={0}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Khối lớp</label>
                            <select
                                value={formData.grade || ''}
                                onChange={(e) => setFormData(prev => ({ ...prev, grade: e.target.value ? parseInt(e.target.value) : undefined }))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                            >
                                <option value="">Chọn khối lớp</option>
                                <option value={10}>Lớp 10</option>
                                <option value={11}>Lớp 11</option>
                                <option value={12}>Lớp 12</option>
                            </select>
                        </div>
                    </div>
                    <div className="flex justify-end space-x-3 mt-6">
                        <button type="button" onClick={onClose} disabled={isSubmitting} className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">
                            Hủy
                        </button>
                        <button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50">
                            {isSubmitting ? 'Đang lưu...' : (mode === 'create' ? 'Tạo mới' : 'Lưu')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

// SubChapter Form Modal
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
    onSubmit: (data: CreateSubChapterExamSetDto | UpdateSubChapterExamSetDto) => Promise<void>;
    isSubmitting: boolean;
}) {
    const [formData, setFormData] = useState({
        name: subChapter?.name || '',
        sortOrder: subChapter?.sortOrder || 0,
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (mode === 'create' && parentChapterId) {
            await onSubmit({
                name: formData.name,
                sortOrder: formData.sortOrder,
                chapterExamSetId: parentChapterId,
            } as CreateSubChapterExamSetDto);
        } else {
            await onSubmit(formData as UpdateSubChapterExamSetDto);
        }
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60] p-4">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    {mode === 'create' ? 'Tạo chương con mới' : 'Chỉnh sửa chương con'}
                </h3>
                <form onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Tên chương con *</label>
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
                            <label className="block text-sm font-medium text-gray-700 mb-1">Thứ tự sắp xếp</label>
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
                        <button type="button" onClick={onClose} disabled={isSubmitting} className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">
                            Hủy
                        </button>
                        <button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50">
                            {isSubmitting ? 'Đang lưu...' : (mode === 'create' ? 'Tạo mới' : 'Lưu')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

// Assign Exam Modal
function AssignExamModal({
    unassignedExams,
    onClose,
    onAssign,
    isSubmitting
}: {
    unassignedExams: ExamSetResponse[];
    onClose: () => void;
    onAssign: (examId: string) => Promise<void>;
    isSubmitting: boolean;
}) {
    const [selectedExamId, setSelectedExamId] = useState<string>('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (selectedExamId) {
            await onAssign(selectedExamId);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60] p-4">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Thêm đề thi vào chương con</h3>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Chọn đề thi</label>
                        {unassignedExams.length > 0 ? (
                            <select
                                value={selectedExamId}
                                onChange={(e) => setSelectedExamId(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            >
                                <option value="">-- Chọn đề thi --</option>
                                {unassignedExams.map((exam) => (
                                    <option key={exam.id} value={exam.id}>{exam.name}</option>
                                ))}
                            </select>
                        ) : (
                            <p className="text-sm text-gray-500">Tất cả đề thi đã được gán vào chương con.</p>
                        )}
                    </div>
                    <div className="flex justify-end space-x-3">
                        <button type="button" onClick={onClose} disabled={isSubmitting} className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">
                            Hủy
                        </button>
                        <button type="submit" disabled={isSubmitting || !selectedExamId || unassignedExams.length === 0} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50">
                            {isSubmitting ? 'Đang thêm...' : 'Thêm'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

// Delete Confirm Modal
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60] p-4">
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
                    <button onClick={onClose} disabled={isSubmitting} className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">
                        Hủy
                    </button>
                    <button onClick={onConfirm} disabled={isSubmitting} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50">
                        {isSubmitting ? 'Đang xóa...' : 'Xóa'}
                    </button>
                </div>
            </div>
        </div>
    );
}

