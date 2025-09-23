'use client';

import { useState, useCallback } from 'react';
import { SubjectDetailResponseDto } from '@/hooks/useCourse';
import { useCreateSubject, useUpdateSubject, useDeleteSubject } from '@/hooks/useAdminCourse';
import CreateSubjectModal from './CreateSubjectModal';
import EditSubjectModal from './EditSubjectModal';
import DeleteConfirmModal from './DeleteConfirmModal';

interface SubjectManagementProps {
    subjects: SubjectDetailResponseDto[];
    onSubjectSelect: (subjectId: string) => void;
}

export default function SubjectManagement({ subjects, onSubjectSelect }: SubjectManagementProps) {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [editingSubject, setEditingSubject] = useState<SubjectDetailResponseDto | null>(null);
    const [deletingSubject, setDeletingSubject] = useState<SubjectDetailResponseDto | null>(null);

    const createMutation = useCreateSubject();
    const updateMutation = useUpdateSubject();
    const deleteMutation = useDeleteSubject();

    const handleCreateSuccess = useCallback(() => {
        setIsCreateModalOpen(false);
    }, []);

    const handleEditSuccess = useCallback(() => {
        setEditingSubject(null);
    }, []);

    const handleDeleteConfirm = useCallback(async () => {
        if (!deletingSubject) return;

        try {
            await deleteMutation.mutateAsync(deletingSubject.id);
            setDeletingSubject(null);
        } catch (error) {
            console.error('Error deleting subject:', error);
        }
    }, [deletingSubject, deleteMutation]);

    return (
        <div className="p-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div>
                    <h3 className="text-xl font-bold text-gray-900">Quản lý môn học</h3>
                    <p className="text-gray-600">
                        Tổng cộng {subjects.length} môn học
                    </p>
                </div>
                <button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center gap-2"
                >
                    <span>➕</span>
                    Thêm môn học
                </button>
            </div>

            {/* Subjects Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {subjects.map((subject) => (
                    <div
                        key={subject.id}
                        className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-200 cursor-pointer group"
                        onClick={() => onSubjectSelect(subject.id)}
                    >
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center space-x-3">
                                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                    </svg>
                                </div>
                                <div>
                                    <h4 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                                        {subject.name}
                                    </h4>
                                    <p className="text-sm text-gray-500">
                                        {subject.grades?.length || 0} cấp độ
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-1">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setEditingSubject(subject);
                                    }}
                                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                </button>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setDeletingSubject(subject);
                                    }}
                                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        {subject.description && (
                            <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                                {subject.description}
                            </p>
                        )}

                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                                <div className="flex items-center space-x-1">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                    </svg>
                                    <span>{subject.grades?.reduce((total, grade) => total + (grade.chapters?.length || 0), 0) || 0} chương</span>
                                </div>
                            </div>
                            <div className="flex items-center text-blue-600 text-sm font-medium">
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
            {subjects.length === 0 && (
                <div className="text-center py-12">
                    <div className="text-gray-400 text-4xl mb-4">📚</div>
                    <p className="text-gray-500">Chưa có môn học nào</p>
                    <button
                        onClick={() => setIsCreateModalOpen(true)}
                        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Thêm môn học đầu tiên
                    </button>
                </div>
            )}

            {/* Modals */}
            <CreateSubjectModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onSuccess={handleCreateSuccess}
            />

            {editingSubject && (
                <EditSubjectModal
                    isOpen={!!editingSubject}
                    subject={editingSubject}
                    onClose={() => setEditingSubject(null)}
                    onSuccess={handleEditSuccess}
                />
            )}

            {deletingSubject && (
                <DeleteConfirmModal
                    isOpen={!!deletingSubject}
                    title="Xóa môn học"
                    message={`Bạn có chắc chắn muốn xóa môn học "${deletingSubject.name}"? Tất cả cấp độ, chương học và video liên quan sẽ bị xóa.`}
                    onConfirm={handleDeleteConfirm}
                    onCancel={() => setDeletingSubject(null)}
                    isLoading={deleteMutation.isPending}
                />
            )}
        </div>
    );
}

