'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useExamSets, ExamSetType } from '@/hooks/useExam';
import ImportExamSetModal from './ImportExamSetModal';

export default function ExamSetManagement() {
    const router = useRouter();
    const [selectedType, setSelectedType] = useState<ExamSetType>(ExamSetType.HSA);
    const [selectedGrade, setSelectedGrade] = useState<number | undefined>(undefined);
    const [showImportModal, setShowImportModal] = useState(false);

    const { data: examSets, isLoading, error, refetch } = useExamSets(selectedType, selectedGrade);

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
                                            className="px-3 py-1 text-red-600 hover:text-red-800 text-sm font-medium"
                                            title="Xóa"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
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
        </div>
    );
}
