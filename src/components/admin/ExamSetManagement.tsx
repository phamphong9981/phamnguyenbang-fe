'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useExamSets, useDeleteExamSet, useExamSet, ExamSetType, ExamSetResponse, ExamSetDetailResponse, QuestionType } from '@/hooks/useExam';
import ImportExamSetModal from './ImportExamSetModal';
import RichRenderer from '@/components/RichRenderer';

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

    const { data: examSets, isLoading, error, refetch } = useExamSets(selectedType, selectedGrade);
    const deleteExamSetMutation = useDeleteExamSet();
    const { data: examSetDetail, isLoading: isDetailLoading, error: detailError } = useExamSet(viewModal.examSetId || '');

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

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'available': return 'bg-green-100 text-green-800';
            case 'draft': return 'bg-yellow-100 text-yellow-800';
            case 'archived': return 'bg-gray-100 text-gray-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'available': return 'Có sẵn';
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

    const isImageAnswer = (answer: string): boolean => {
        return answer.startsWith('http') || answer.startsWith('/') && (
            answer.endsWith('.png') ||
            answer.endsWith('.jpg') ||
            answer.endsWith('.jpeg') ||
            answer.endsWith('.gif') ||
            answer.endsWith('.webp') ||
            answer.endsWith('.svg')
        );
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
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor('available')}`}>
                                                {getStatusLabel('available')}
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

                                        {examSet.userStatus && (
                                            <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                                                <div className="text-sm">
                                                    <span className="font-medium text-blue-900">Trạng thái người dùng:</span>
                                                    <div className="mt-1 grid grid-cols-2 md:grid-cols-4 gap-2">
                                                        <div>
                                                            <span className="text-blue-700">Hoàn thành:</span>
                                                            <span className={`ml-1 ${examSet.userStatus.isCompleted ? 'text-green-600' : 'text-gray-600'}`}>
                                                                {examSet.userStatus.isCompleted ? 'Có' : 'Chưa'}
                                                            </span>
                                                        </div>
                                                        <div>
                                                            <span className="text-blue-700">Điểm:</span>
                                                            <span className="ml-1 font-medium">{examSet.userStatus.totalPoints}/N/A</span>
                                                        </div>
                                                        <div>
                                                            <span className="text-blue-700">Thời gian:</span>
                                                            <span className="ml-1">{examSet.userStatus.totalTime}s</span>
                                                        </div>
                                                        <div>
                                                            <span className="text-blue-700">Phần thưởng:</span>
                                                            <span className="ml-1">{examSet.userStatus.giveAway || 'Chưa có'}</span>
                                                        </div>
                                                    </div>
                                                </div>
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
                                            className="px-3 py-1 text-orange-600 hover:text-orange-800 text-sm font-medium"
                                            title="Chỉnh sửa"
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
            {viewModal.isOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg w-full h-[95vh] flex flex-col">
                        {/* Header */}
                        <div className="p-6 border-b border-gray-200">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900">
                                        Chi tiết đề thi
                                    </h2>
                                    {examSetDetail && (
                                        <p className="text-gray-600 mt-1">{examSetDetail.name}</p>
                                    )}
                                </div>
                                <button
                                    onClick={handleViewClose}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto p-6">
                            {isDetailLoading ? (
                                <div className="flex items-center justify-center h-full">
                                    <div className="text-center">
                                        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                                        <p className="text-gray-600">Đang tải chi tiết đề thi...</p>
                                    </div>
                                </div>
                            ) : detailError ? (
                                <div className="flex items-center justify-center h-full">
                                    <div className="text-center">
                                        <div className="text-red-500 text-4xl mb-4">⚠️</div>
                                        <p className="text-red-600">Có lỗi xảy ra khi tải chi tiết đề thi</p>
                                    </div>
                                </div>
                            ) : examSetDetail ? (
                                <div className="space-y-6">
                                    {/* Exam Info */}
                                    <div className="bg-gray-50 rounded-lg p-6">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Thông tin đề thi</h3>
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                            <div>
                                                <span className="font-medium text-gray-700">Loại:</span>
                                                <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(examSetDetail.type)}`}>
                                                    {getTypeLabel(examSetDetail.type)}
                                                </span>
                                            </div>
                                            <div>
                                                <span className="font-medium text-gray-700">Năm học:</span>
                                                <span className="ml-2">{examSetDetail.year}</span>
                                            </div>
                                            <div>
                                                <span className="font-medium text-gray-700">Khối lớp:</span>
                                                <span className="ml-2">{examSetDetail.grade}</span>
                                            </div>
                                            <div>
                                                <span className="font-medium text-gray-700">Môn học:</span>
                                                <span className="ml-2">{examSetDetail.subject}</span>
                                            </div>
                                            <div>
                                                <span className="font-medium text-gray-700">Thời gian:</span>
                                                <span className="ml-2">{examSetDetail.duration}</span>
                                            </div>
                                            <div>
                                                <span className="font-medium text-gray-700">Độ khó:</span>
                                                <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(examSetDetail.difficulty)}`}>
                                                    {examSetDetail.difficulty}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="mt-4">
                                            <span className="font-medium text-gray-700">Mô tả:</span>
                                            <p className="mt-1 text-gray-600">{examSetDetail.description}</p>
                                        </div>
                                    </div>

                                    {/* Questions */}
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                            Danh sách câu hỏi ({examSetDetail.examQuestions.length} câu)
                                        </h3>
                                        <div className="space-y-6">
                                            {examSetDetail.examQuestions.map((examQuestion, index) => (
                                                <div key={examQuestion.id} className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
                                                    {/* Question Header */}
                                                    <div className="mb-4">
                                                        <div className="flex items-center space-x-2 mb-3">
                                                            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                                                                Câu {index + 1}
                                                            </span>
                                                            <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                                                                {examQuestion.question.question_type}
                                                            </span>
                                                            <span className="px-2 py-1 bg-green-100 text-green-600 rounded text-xs">
                                                                {examQuestion.points} điểm
                                                            </span>
                                                        </div>
                                                    </div>

                                                    {/* Question Content */}
                                                    <div className="mb-4">
                                                        {isImageAnswer(examQuestion.question.content) ? (
                                                            <div className="mb-6">
                                                                <img src={examQuestion.question.content} alt={`Câu ${index + 1}`} className="max-w-full rounded" />
                                                            </div>
                                                        ) : (
                                                            <div className="text-xl font-bold text-gray-900 leading-relaxed mb-6">
                                                                <RichRenderer content={examQuestion.question.content} />
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* Question Image */}
                                                    {examQuestion.question.image && (
                                                        <div className="mb-4">
                                                            <img
                                                                src={examQuestion.question.image}
                                                                alt={`Hình ảnh câu ${index + 1}`}
                                                                className="w-full h-auto rounded-lg border border-gray-200"
                                                            />
                                                        </div>
                                                    )}

                                                    {/* Answer Options */}
                                                    {(examQuestion.question.question_type === QuestionType.MULTIPLE_CHOICE || examQuestion.question.question_type === QuestionType.SINGLE_CHOICE) && examQuestion.question.options && (
                                                        <div className="space-y-2">
                                                            {Object.entries(examQuestion.question.options).map(([option, text]) => {
                                                                const isImage = isImageAnswer(text);
                                                                // Check if this option is in correctAnswer (support array)
                                                                const correctAnswerArray = Array.isArray(examQuestion.question.correct_answer)
                                                                    ? examQuestion.question.correct_answer
                                                                    : [];
                                                                const isCorrect = correctAnswerArray.includes(option);

                                                                return (
                                                                    <label
                                                                        key={option}
                                                                        className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${isCorrect
                                                                            ? 'border-green-500 bg-green-50'
                                                                            : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                                                                            }`}
                                                                    >
                                                                        <input
                                                                            type={examQuestion.question.question_type === QuestionType.MULTIPLE_CHOICE ? 'checkbox' : 'radio'}
                                                                            name={`question-${examQuestion.question.id}`}
                                                                            value={option}
                                                                            checked={isCorrect}
                                                                            readOnly
                                                                            className="mr-3"
                                                                        />
                                                                        <span className="font-semibold text-gray-700 mr-3">{option}.</span>
                                                                        <div className="flex-1">
                                                                            {isImage ? (
                                                                                <img src={text} alt={`Đáp án ${option}`} className="max-w-full rounded" />
                                                                            ) : (
                                                                                <span className="text-gray-700">
                                                                                    <RichRenderer content={text} />
                                                                                </span>
                                                                            )}
                                                                        </div>
                                                                        {isCorrect && (
                                                                            <span className="ml-2 text-green-600 font-semibold">✓</span>
                                                                        )}
                                                                    </label>
                                                                );
                                                            })}
                                                        </div>
                                                    )}

                                                    {examQuestion.question.question_type === QuestionType.TRUE_FALSE && (() => {
                                                        const correctAnswerArray = Array.isArray(examQuestion.question.correct_answer)
                                                            ? examQuestion.question.correct_answer
                                                            : [];
                                                        const isTrue = correctAnswerArray.includes('true');
                                                        const isFalse = correctAnswerArray.includes('false');

                                                        return (
                                                            <div className="space-y-2">
                                                                <label className={`flex items-start p-3 border-2 rounded-lg cursor-pointer transition-colors ${isTrue
                                                                    ? 'border-green-500 bg-green-50'
                                                                    : 'border-gray-200 hover:border-gray-300'
                                                                    }`}>
                                                                    <input
                                                                        type="radio"
                                                                        name={`question-${examQuestion.question.id}`}
                                                                        value="true"
                                                                        checked={isTrue}
                                                                        readOnly
                                                                        className="mt-1 mr-3"
                                                                    />
                                                                    <div className="flex">
                                                                        <span className="font-medium text-gray-900 mr-2">Đúng</span>
                                                                        {isTrue && <span className="ml-2 text-green-600 font-semibold">✓</span>}
                                                                    </div>
                                                                </label>
                                                                <label className={`flex items-start p-3 border-2 rounded-lg cursor-pointer transition-colors ${isFalse
                                                                    ? 'border-green-500 bg-green-50'
                                                                    : 'border-gray-200 hover:border-gray-300'
                                                                    }`}>
                                                                    <input
                                                                        type="radio"
                                                                        name={`question-${examQuestion.question.id}`}
                                                                        value="false"
                                                                        checked={isFalse}
                                                                        readOnly
                                                                        className="mt-1 mr-3"
                                                                    />
                                                                    <div className="flex">
                                                                        <span className="font-medium text-gray-900 mr-2">Sai</span>
                                                                        {isFalse && <span className="ml-2 text-green-600 font-semibold">✓</span>}
                                                                    </div>
                                                                </label>
                                                            </div>
                                                        );
                                                    })()}

                                                    {examQuestion.question.question_type === QuestionType.SHORT_ANSWER && (
                                                        <div className="space-y-2">
                                                            <div className="p-4 border-2 bg-gray-100 border-gray-200 rounded-lg">
                                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                                    Đáp án:
                                                                </label>
                                                                <div className="w-full text-black px-3 py-2 border font-bold bg-white border-gray-300 rounded-md">
                                                                    {Array.isArray(examQuestion.question.correct_answer)
                                                                        ? examQuestion.question.correct_answer.join(', ')
                                                                        : examQuestion.question.correct_answer}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}

                                                    {/* Group Questions */}
                                                    {examQuestion.question.question_type === QuestionType.GROUP_QUESTION && examQuestion.question.subQuestions && (
                                                        <div className="space-y-4 mt-4">
                                                            {examQuestion.question.subQuestions.map((subQ) => {
                                                                const subQuestionType = subQ.question_type || QuestionType.TRUE_FALSE;
                                                                const isSubQuestionImage = isImageAnswer(subQ.content);

                                                                return (
                                                                    <div key={subQ.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                                                                        <div className="mb-4">
                                                                            {isSubQuestionImage ? (
                                                                                <div className="mb-4">
                                                                                    <img src={subQ.content} alt={`Câu hỏi ${subQ.id}`} className="max-w-full rounded" />
                                                                                </div>
                                                                            ) : (
                                                                                <h5 className="font-medium text-gray-900 mb-2">
                                                                                    <RichRenderer content={subQ.content} />
                                                                                </h5>
                                                                            )}
                                                                        </div>

                                                                        {/* Multiple choice and single choice subquestion */}
                                                                        {(subQuestionType === QuestionType.MULTIPLE_CHOICE || subQuestionType === QuestionType.SINGLE_CHOICE) && subQ.options && (
                                                                            <div className="space-y-3">
                                                                                {Object.entries(subQ.options).map(([option, text]) => {
                                                                                    const isImage = isImageAnswer(text);
                                                                                    // Check if this option is in correctAnswer (support array)
                                                                                    const correctAnswerArray = Array.isArray(subQ.correct_answer)
                                                                                        ? subQ.correct_answer
                                                                                        : [];
                                                                                    const isCorrect = correctAnswerArray.includes(option);

                                                                                    return (
                                                                                        <label
                                                                                            key={option}
                                                                                            className={`flex items-start p-4 border-2 rounded-lg cursor-pointer transition-colors ${isCorrect
                                                                                                ? 'border-green-500 bg-green-50'
                                                                                                : 'border-gray-200 hover:border-gray-300'
                                                                                                }`}
                                                                                        >
                                                                                            <input
                                                                                                type={subQuestionType === QuestionType.MULTIPLE_CHOICE ? 'checkbox' : 'radio'}
                                                                                                name={`sub-question-${examQuestion.question.id}-${subQ.id}`}
                                                                                                value={option}
                                                                                                checked={isCorrect}
                                                                                                readOnly
                                                                                                className="mt-1 mr-3"
                                                                                            />
                                                                                            <div className="flex gap-1 w-full">
                                                                                                <span className="font-medium text-gray-900 mb-2">{option}.</span>
                                                                                                {isImage ? (
                                                                                                    <img src={text} alt={`Đáp án ${option}`} className="max-w-full rounded" />
                                                                                                ) : (
                                                                                                    <span className="text-gray-700">
                                                                                                        <RichRenderer content={text} />
                                                                                                    </span>
                                                                                                )}
                                                                                            </div>
                                                                                            {isCorrect && (
                                                                                                <span className="ml-2 text-green-600 font-semibold">✓</span>
                                                                                            )}
                                                                                        </label>
                                                                                    );
                                                                                })}
                                                                            </div>
                                                                        )}

                                                                        {/* True/False subquestion */}
                                                                        {subQuestionType === QuestionType.TRUE_FALSE && (() => {
                                                                            const correctAnswerArray = Array.isArray(subQ.correct_answer)
                                                                                ? subQ.correct_answer
                                                                                : [];
                                                                            const isTrue = correctAnswerArray.includes('true');
                                                                            const isFalse = correctAnswerArray.includes('false');

                                                                            return (
                                                                                <div className="space-y-3">
                                                                                    <label className={`flex items-start p-3 border-2 rounded-lg cursor-pointer transition-colors ${isTrue
                                                                                        ? 'border-green-500 bg-green-50'
                                                                                        : 'border-gray-200 hover:border-gray-300'
                                                                                        }`}>
                                                                                        <input
                                                                                            type="radio"
                                                                                            name={`sub-question-${examQuestion.question.id}-${subQ.id}`}
                                                                                            value="true"
                                                                                            checked={isTrue}
                                                                                            readOnly
                                                                                            className="mt-1 mr-3"
                                                                                        />
                                                                                        <div className="flex">
                                                                                            <span className="font-medium text-gray-900 mr-2">Đúng</span>
                                                                                            {isTrue && <span className="ml-2 text-green-600 font-semibold">✓</span>}
                                                                                        </div>
                                                                                    </label>
                                                                                    <label className={`flex items-start p-3 border-2 rounded-lg cursor-pointer transition-colors ${isFalse
                                                                                        ? 'border-green-500 bg-green-50'
                                                                                        : 'border-gray-200 hover:border-gray-300'
                                                                                        }`}>
                                                                                        <input
                                                                                            type="radio"
                                                                                            name={`sub-question-${examQuestion.question.id}-${subQ.id}`}
                                                                                            value="false"
                                                                                            checked={isFalse}
                                                                                            readOnly
                                                                                            className="mt-1 mr-3"
                                                                                        />
                                                                                        <div className="flex">
                                                                                            <span className="font-medium text-gray-900 mr-2">Sai</span>
                                                                                            {isFalse && <span className="ml-2 text-green-600 font-semibold">✓</span>}
                                                                                        </div>
                                                                                    </label>
                                                                                </div>
                                                                            );
                                                                        })()}

                                                                        {/* Short answer subquestion */}
                                                                        {subQuestionType === QuestionType.SHORT_ANSWER && (
                                                                            <div className="space-y-2">
                                                                                <div className="p-4 border-2 bg-gray-100 border-gray-200 rounded-lg">
                                                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                                                        Đáp án:
                                                                                    </label>
                                                                                    <div className="w-full text-black px-3 py-2 border font-bold bg-white border-gray-300 rounded-md">
                                                                                        {Array.isArray(subQ.correct_answer)
                                                                                            ? subQ.correct_answer.join(', ')
                                                                                            : subQ.correct_answer}
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        )}

                                                                        {/* Explanation for subquestion */}
                                                                        {subQ.explanation && (
                                                                            <div className="mt-3 p-2 bg-blue-50 border border-blue-200 rounded text-xs">
                                                                                <span className="font-semibold text-blue-800">Giải thích: </span>
                                                                                <span className="text-blue-700">
                                                                                    <RichRenderer content={subQ.explanation} />
                                                                                </span>
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                );
                                                            })}
                                                        </div>
                                                    )}

                                                    {/* Explanation */}
                                                    {examQuestion.question.explanation && (
                                                        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                                            <p className="text-sm text-blue-800">
                                                                <span className="font-semibold">Giải thích: </span>
                                                                <RichRenderer content={examQuestion.question.explanation} />
                                                            </p>
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ) : null}
                        </div>

                        {/* Footer */}
                        <div className="p-6 border-t border-gray-200 bg-gray-50 flex justify-end">
                            <button
                                onClick={handleViewClose}
                                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
                            >
                                Đóng
                            </button>
                        </div>
                    </div>
                </div>
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
