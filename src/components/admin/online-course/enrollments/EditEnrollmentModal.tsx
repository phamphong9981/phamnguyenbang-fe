'use client';

import { useState } from 'react';
import {
    useUpdateEnrollment,
    type CourseEnrollment,
} from '@/hooks/useOnlineCourse';
import { toDatetimeLocalValue } from '../utils';

interface EditEnrollmentModalProps {
    enrollment: CourseEnrollment;
    onClose: () => void;
}

type ExpiryPreset = '1m' | '3m' | '6m' | '1y' | 'permanent';

function addMonths(date: Date, months: number): Date {
    const d = new Date(date);
    d.setMonth(d.getMonth() + months);
    return d;
}

export default function EditEnrollmentModal({ enrollment, onClose }: EditEnrollmentModalProps) {
    const [permanent, setPermanent] = useState<boolean>(!enrollment.expiresAt);
    const [expiresAt, setExpiresAt] = useState<string>(
        enrollment.expiresAt ? toDatetimeLocalValue(enrollment.expiresAt) : toDatetimeLocalValue(addMonths(new Date(), 12)),
    );
    const [note, setNote] = useState<string>(enrollment.note ?? '');
    const [submitError, setSubmitError] = useState<string | null>(null);

    const updateMutation = useUpdateEnrollment();

    const applyPreset = (preset: ExpiryPreset) => {
        if (preset === 'permanent') {
            setPermanent(true);
            return;
        }
        setPermanent(false);
        const now = new Date();
        const months = preset === '1m' ? 1 : preset === '3m' ? 3 : preset === '6m' ? 6 : 12;
        setExpiresAt(toDatetimeLocalValue(addMonths(now, months)));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitError(null);

        try {
            await updateMutation.mutateAsync({
                id: enrollment.id,
                data: {
                    expiresAt: permanent ? null : new Date(expiresAt).toISOString(),
                    note: note.trim() ? note.trim() : null,
                },
            });
            onClose();
        } catch (err) {
            console.error('Update enrollment failed', err);
            setSubmitError('Cập nhật thất bại. Vui lòng thử lại.');
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
                <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900">Sửa đăng ký</h3>
                        <p className="text-xs text-gray-500 mt-0.5">
                            {enrollment.profile?.fullname ?? enrollment.profileId} •{' '}
                            {enrollment.course?.name ?? enrollment.courseId}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        disabled={updateMutation.isPending}
                        className="text-gray-400 hover:text-gray-600 disabled:opacity-50"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Hạn truy cập
                        </label>
                        <div className="flex flex-wrap gap-2 mb-2">
                            {([
                                { id: '1m', label: '+1 tháng' },
                                { id: '3m', label: '+3 tháng' },
                                { id: '6m', label: '+6 tháng' },
                                { id: '1y', label: '+1 năm' },
                                { id: 'permanent', label: '∞ Vĩnh viễn' },
                            ] as { id: ExpiryPreset; label: string }[]).map((preset) => (
                                <button
                                    key={preset.id}
                                    type="button"
                                    onClick={() => applyPreset(preset.id)}
                                    className="px-2.5 py-1 text-xs rounded-full border border-gray-200 text-gray-600 hover:bg-gray-50"
                                >
                                    {preset.label}
                                </button>
                            ))}
                        </div>
                        <input
                            type="datetime-local"
                            value={permanent ? '' : expiresAt}
                            disabled={permanent}
                            onChange={(e) => setExpiresAt(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-100 disabled:text-gray-400"
                        />
                        <p className="mt-1 text-xs text-gray-500">
                            {permanent
                                ? 'Học sinh sẽ truy cập vĩnh viễn.'
                                : 'Sau thời điểm này, học sinh mất quyền vào bộ đề trong khóa.'}
                        </p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Ghi chú</label>
                        <textarea
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="Để trống nếu muốn xóa ghi chú"
                        />
                    </div>

                    {submitError && (
                        <div className="rounded-md bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-700">
                            {submitError}
                        </div>
                    )}

                    <div className="flex justify-end gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={updateMutation.isPending}
                            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50"
                        >
                            Hủy
                        </button>
                        <button
                            type="submit"
                            disabled={updateMutation.isPending}
                            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                        >
                            {updateMutation.isPending ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
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
