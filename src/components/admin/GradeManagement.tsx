'use client';

import { useState, useCallback } from 'react';
import { useGetGrades, useCreateGrade, useUpdateGrade, useDeleteGrade } from '@/hooks/useAdminCourse';
import CreateGradeModal from './CreateGradeModal';
import EditGradeModal from './EditGradeModal';
import DeleteConfirmModal from './DeleteConfirmModal';

interface GradeManagementProps {
    subjectId: string;
    onGradeSelect: (gradeId: string, gradeName: string) => void;
}

export default function GradeManagement({ subjectId, onGradeSelect }: GradeManagementProps) {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [editingGrade, setEditingGrade] = useState<any>(null);
    const [deletingGrade, setDeletingGrade] = useState<any>(null);

    const { data: grades, isLoading, error } = useGetGrades(subjectId);
    const createMutation = useCreateGrade();
    const updateMutation = useUpdateGrade();
    const deleteMutation = useDeleteGrade();

    // Group grades by grade number and sort by sortOrder
    const groupedGrades = grades?.reduce((acc, grade) => {
        const gradeNumber = grade.grade || 10;
        if (!acc[gradeNumber]) {
            acc[gradeNumber] = [];
        }
        acc[gradeNumber].push(grade);
        return acc;
    }, {} as Record<number, any[]>) || {};

    // Sort each group by sortOrder
    Object.keys(groupedGrades).forEach(gradeNumber => {
        groupedGrades[parseInt(gradeNumber)].sort((a, b) => a.sortOrder - b.sortOrder);
    });

    const handleCreateSuccess = useCallback(() => {
        setIsCreateModalOpen(false);
    }, []);

    const handleEditSuccess = useCallback(() => {
        setEditingGrade(null);
    }, []);

    const handleDeleteConfirm = useCallback(async () => {
        if (!deletingGrade) return;

        try {
            await deleteMutation.mutateAsync(deletingGrade.id);
            setDeletingGrade(null);
        } catch (error) {
            console.error('Error deleting grade:', error);
        }
    }, [deletingGrade, deleteMutation]);

    if (isLoading) {
        return (
            <div className="p-6">
                <div className="flex items-center justify-center py-12">
                    <div className="text-center">
                        <div className="w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-gray-600">Đang tải cấp độ...</p>
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
                    <p className="text-red-600">Có lỗi xảy ra khi tải cấp độ</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div>
                    <h3 className="text-xl font-bold text-gray-900">Quản lý cấp độ</h3>
                    <p className="text-gray-600">
                        Tổng cộng {grades?.length || 0} cấp độ
                    </p>
                </div>
                <button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center gap-2"
                >
                    <span>➕</span>
                    Thêm cấp độ
                </button>
            </div>

            {/* Grouped Grades */}
            <div className="space-y-8">
                {Object.entries(groupedGrades)
                    .sort(([a], [b]) => parseInt(a) - parseInt(b))
                    .map(([gradeNumber, gradeList]) => (
                        <div key={gradeNumber} className="space-y-4">
                            {/* Grade Header */}
                            <div className="flex items-center space-x-3 mb-4">
                                <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                                    <span className="text-white font-bold text-sm">{gradeNumber}</span>
                                </div>
                                <h3 className="text-lg font-bold text-gray-900">Lớp {gradeNumber}</h3>
                                <span className="text-sm text-gray-500">({gradeList.length} cấp độ)</span>
                            </div>

                            {/* Grades Grid for this grade */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {gradeList.map((grade) => (
                                    <div
                                        key={grade.id}
                                        className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-200 cursor-pointer group"
                                        onClick={() => onGradeSelect(grade.id, grade.name)}
                                    >
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="flex items-center space-x-3">
                                                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                                                    <span className="text-white font-bold text-lg">{grade.name.charAt(0)}</span>
                                                </div>
                                                <div>
                                                    <h4 className="text-lg font-bold text-gray-900 group-hover:text-green-600 transition-colors">
                                                        {grade.name}
                                                    </h4>
                                                    <p className="text-sm text-gray-500">
                                                        {grade.chapters?.length || 0} chương
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center space-x-1">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setEditingGrade(grade);
                                                    }}
                                                    className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                    </svg>
                                                </button>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setDeletingGrade(grade);
                                                    }}
                                                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>

                                        {grade.description && (
                                            <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                                                {grade.description}
                                            </p>
                                        )}

                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                                                <div className="flex items-center space-x-1">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                                    </svg>
                                                    <span>{grade.chapters?.reduce((total: number, chapter: any) => total + (chapter.videos?.length || 0), 0) || 0} video</span>
                                                </div>
                                                <div className="flex items-center space-x-1">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                                    </svg>
                                                    <span>Thứ tự: {grade.sortOrder}</span>
                                                </div>
                                            </div>
                                            <div className="flex items-center text-green-600 text-sm font-medium">
                                                <span>Xem chi tiết</span>
                                                <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                </svg>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
            </div>

            {/* Empty State */}
            {(!grades || grades.length === 0) && (
                <div className="text-center py-12">
                    <div className="text-gray-400 text-4xl mb-4">📚</div>
                    <p className="text-gray-500">Chưa có cấp độ nào</p>
                    <button
                        onClick={() => setIsCreateModalOpen(true)}
                        className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                        Thêm cấp độ đầu tiên
                    </button>
                </div>
            )}

            {/* Modals */}
            <CreateGradeModal
                isOpen={isCreateModalOpen}
                subjectId={subjectId}
                onClose={() => setIsCreateModalOpen(false)}
                onSuccess={handleCreateSuccess}
            />

            {editingGrade && (
                <EditGradeModal
                    isOpen={!!editingGrade}
                    grade={editingGrade}
                    onClose={() => setEditingGrade(null)}
                    onSuccess={handleEditSuccess}
                />
            )}

            {deletingGrade && (
                <DeleteConfirmModal
                    isOpen={!!deletingGrade}
                    title="Xóa cấp độ"
                    message={`Bạn có chắc chắn muốn xóa cấp độ "${deletingGrade.name}"? Tất cả chương học và video liên quan sẽ bị xóa.`}
                    onConfirm={handleDeleteConfirm}
                    onCancel={() => setDeletingGrade(null)}
                    isLoading={deleteMutation.isPending}
                />
            )}
        </div>
    );
}

