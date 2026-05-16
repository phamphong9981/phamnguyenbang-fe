'use client';

import { useState, useEffect } from 'react';
import { SUBJECT_ID } from '@/hooks/useExam';
import type {
    OnlineCourse,
    CreateOnlineCourseDto,
    UpdateOnlineCourseDto,
} from '@/hooks/useOnlineCourse';

interface CourseFormModalProps {
    mode: 'create' | 'edit';
    course?: OnlineCourse | null;
    onClose: () => void;
    onSubmit: (data: CreateOnlineCourseDto | UpdateOnlineCourseDto) => Promise<void>;
    isSubmitting: boolean;
}

const SUBJECT_OPTIONS: { value: number | ''; label: string }[] = [
    { value: '', label: 'Tất cả môn học' },
    { value: SUBJECT_ID.MATH, label: 'Toán học' },
    { value: SUBJECT_ID.GEOGRAPHY, label: 'Địa lý' },
    { value: SUBJECT_ID.LITERATURE, label: 'Ngữ văn' },
    { value: SUBJECT_ID.HISTORY, label: 'Lịch sử' },
    { value: SUBJECT_ID.ENGLISH, label: 'Tiếng Anh' },
    { value: SUBJECT_ID.PHYSICS, label: 'Vật lý' },
    { value: SUBJECT_ID.CHEMISTRY, label: 'Hóa học' },
    { value: SUBJECT_ID.BIOLOGY, label: 'Sinh học' },
    { value: SUBJECT_ID.SCIENCE, label: 'Khoa học tự nhiên' },
];

export default function CourseFormModal({
    mode,
    course,
    onClose,
    onSubmit,
    isSubmitting,
}: CourseFormModalProps) {
    const [formData, setFormData] = useState<{
        name: string;
        description: string;
        grade: number;
        subject: number | '';
        isActive: boolean;
    }>({
        name: '',
        description: '',
        grade: 12,
        subject: '',
        isActive: true,
    });

    useEffect(() => {
        if (mode === 'edit' && course) {
            setFormData({
                name: course.name,
                description: course.description ?? '',
                grade: course.grade,
                subject: course.subject ?? '',
                isActive: course.isActive,
            });
        }
    }, [mode, course]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name.trim()) return;

        const payload: CreateOnlineCourseDto = {
            name: formData.name.trim(),
            description: formData.description.trim() || undefined,
            grade: formData.grade,
            subject: formData.subject === '' ? null : formData.subject,
            isActive: formData.isActive,
        };

        try {
            await onSubmit(payload);
            onClose();
        } catch (error) {
            console.error('Error saving course:', error);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                        {mode === 'create' ? 'Tạo khóa học Online' : 'Chỉnh sửa khóa học'}
                    </h3>
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isSubmitting}
                        className="text-gray-400 hover:text-gray-600 disabled:opacity-50"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Tên khóa học *
                        </label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="VD: Toán 12 Online"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả</label>
                        <textarea
                            value={formData.description}
                            onChange={(e) =>
                                setFormData((prev) => ({ ...prev, description: e.target.value }))
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="Mô tả ngắn về khóa học (tùy chọn)"
                            rows={3}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Khối lớp *</label>
                            <select
                                value={formData.grade}
                                onChange={(e) =>
                                    setFormData((prev) => ({ ...prev, grade: parseInt(e.target.value, 10) }))
                                }
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            >
                                <option value={10}>Lớp 10</option>
                                <option value={11}>Lớp 11</option>
                                <option value={12}>Lớp 12</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Môn học</label>
                            <select
                                value={formData.subject}
                                onChange={(e) =>
                                    setFormData((prev) => ({
                                        ...prev,
                                        subject: e.target.value === '' ? '' : parseInt(e.target.value, 10),
                                    }))
                                }
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            >
                                {SUBJECT_OPTIONS.map((opt) => (
                                    <option key={opt.value === '' ? 'all' : opt.value} value={opt.value}>
                                        {opt.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="flex items-start gap-3 rounded-lg border border-gray-200 bg-gray-50/80 p-3">
                        <input
                            id="course-isActive"
                            type="checkbox"
                            checked={formData.isActive}
                            onChange={(e) =>
                                setFormData((prev) => ({ ...prev, isActive: e.target.checked }))
                            }
                            className="mt-1 h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        />
                        <label htmlFor="course-isActive" className="text-sm text-gray-700 cursor-pointer">
                            <span className="font-medium text-gray-900">Kích hoạt khóa học</span>
                            <p className="mt-1 text-gray-500 leading-relaxed">
                                Khi tắt, học sinh đã đăng ký vẫn xem được nhưng khóa không xuất hiện ở các lệnh
                                lọc <span className="font-medium">isActive=true</span>.
                            </p>
                        </label>
                    </div>

                    <div className="flex justify-end space-x-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isSubmitting}
                            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50"
                        >
                            Hủy
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting || !formData.name.trim()}
                            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                        >
                            {isSubmitting ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                    Đang lưu...
                                </>
                            ) : mode === 'create' ? (
                                'Tạo khóa học'
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
