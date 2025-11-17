'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useExamSets, useDeleteExamSet, useUpdateExamSet, ExamSetType, ExamSetStatus, ExamSetResponse, UpdateExamSetDto, SUBJECT_ID } from '@/hooks/useExam';
import ImportExamSetModal from './ImportExamSetModal';
import ViewExamSetModal from './ViewExamSetModal';

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
        subject: examSet.subject,
        duration: examSet.duration,
        class: examSet.class || undefined,
        deadline: examSet.deadline ? new Date(examSet.deadline) : undefined,
    });

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
                                Tên đề thi *
                            </label>
                            <input
                                type="text"
                                value={formData.name || ''}
                                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value || undefined }))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Nhập tên đề thi"
                                required
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Loại đề thi *
                                </label>
                                <select
                                    value={formData.type || ''}
                                    onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as ExamSetType || undefined }))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                >
                                    <option value={ExamSetType.HSA}>HSA</option>
                                    <option value={ExamSetType.TSA}>TSA</option>
                                    <option value={ExamSetType.CHAPTER}>Chapter</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Môn học *
                                </label>
                                <select
                                    value={formData.subject || ''}
                                    onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value ? parseInt(e.target.value) : undefined }))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                >
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

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Thời gian làm bài *
                            </label>
                            <input
                                type="text"
                                value={formData.duration || ''}
                                onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value || undefined }))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="90 phút"
                                required
                            />
                        </div>

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

    const { data: examSets, isLoading, error, refetch } = useExamSets(selectedType, selectedGrade);
    const deleteExamSetMutation = useDeleteExamSet();
    const updateExamSetMutation = useUpdateExamSet();

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
            handleEditClose();
            refetch();
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
