'use client';

import { useState, useEffect } from 'react';
import { SubjectDetailResponseDto } from '@/hooks/useCourse';
import { useUpdateSubject } from '@/hooks/useAdminCourse';

interface EditSubjectModalProps {
    isOpen: boolean;
    subject: SubjectDetailResponseDto | null;
    onClose: () => void;
    onSuccess: () => void;
}

export default function EditSubjectModal({ isOpen, subject, onClose, onSuccess }: EditSubjectModalProps) {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        sortOrder: 1
    });

    const updateMutation = useUpdateSubject();

    useEffect(() => {
        if (subject) {
            setFormData({
                name: subject.name,
                description: subject.description || '',
                sortOrder: subject?.sortOrder || 1
            });
        }
    }, [subject]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!subject || !formData.name.trim()) {
            return;
        }

        try {
            await updateMutation.mutateAsync({
                id: subject.id,
                ...formData
            });
            onSuccess();
        } catch (error) {
            console.error('Error updating subject:', error);
        }
    };

    const handleClose = () => {
        onClose();
    };

    if (!isOpen || !subject) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-hidden">
                <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 text-white">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-white bg-opacity-30 rounded-xl flex items-center justify-center">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="text-xl font-bold">Chỉnh sửa môn học</h3>
                                <p className="text-green-100 text-sm">Cập nhật thông tin môn học</p>
                            </div>
                        </div>
                        <button
                            onClick={handleClose}
                            className="w-8 h-8 bg-white bg-opacity-30 rounded-lg flex items-center justify-center hover:bg-opacity-40 transition-colors"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="p-6">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Tên môn học *
                            </label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                placeholder="Ví dụ: Toán học, Vật lý, Hóa học"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Mô tả
                            </label>
                            <textarea
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                placeholder="Mô tả ngắn về môn học"
                                rows={3}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Thứ tự sắp xếp
                            </label>
                            <input
                                type="number"
                                value={formData.sortOrder}
                                onChange={(e) => setFormData({ ...formData, sortOrder: parseInt(e.target.value) || 1 })}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                min="1"
                            />
                        </div>
                    </div>

                    {updateMutation.isError && (
                        <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-3">
                            <div className="flex items-center">
                                <div className="text-red-400 mr-2">⚠️</div>
                                <p className="text-red-700 text-sm">
                                    Có lỗi xảy ra khi cập nhật môn học. Vui lòng thử lại.
                                </p>
                            </div>
                        </div>
                    )}

                    <div className="flex justify-end space-x-3 mt-6">
                        <button
                            type="button"
                            onClick={handleClose}
                            disabled={updateMutation.isPending}
                            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors font-medium disabled:opacity-50"
                        >
                            Hủy
                        </button>
                        <button
                            type="submit"
                            disabled={updateMutation.isPending || !formData.name.trim()}
                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {updateMutation.isPending ? (
                                <div className="flex items-center">
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                    Đang cập nhật...
                                </div>
                            ) : (
                                'Cập nhật môn học'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

