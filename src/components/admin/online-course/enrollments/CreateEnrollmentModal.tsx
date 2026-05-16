'use client';

import { useMemo, useState } from 'react';
import type { GetUsersResponse } from '@/hooks/useAdmin';
import {
    useOnlineCourses,
    useCreateEnrollment,
} from '@/hooks/useOnlineCourse';
import UserSearchAutocomplete from './UserSearchAutocomplete';
import { toDatetimeLocalValue } from '../utils';

interface CreateEnrollmentModalProps {
    onClose: () => void;
    defaultCourseId?: string;
    defaultUser?: GetUsersResponse | null;
}

type ExpiryPreset = '1m' | '3m' | '6m' | '1y' | 'permanent';

function addMonths(date: Date, months: number): Date {
    const d = new Date(date);
    d.setMonth(d.getMonth() + months);
    return d;
}

export default function CreateEnrollmentModal({
    onClose,
    defaultCourseId,
    defaultUser,
}: CreateEnrollmentModalProps) {
    const [selectedUser, setSelectedUser] = useState<GetUsersResponse | null>(defaultUser ?? null);
    const [courseId, setCourseId] = useState<string>(defaultCourseId ?? '');
    const [expiresAt, setExpiresAt] = useState<string>(toDatetimeLocalValue(addMonths(new Date(), 12)));
    const [permanent, setPermanent] = useState(false);
    const [note, setNote] = useState('');
    const [submitError, setSubmitError] = useState<string | null>(null);

    const { data: courses, isLoading: isLoadingCourses } = useOnlineCourses({ isActive: true });
    const createMutation = useCreateEnrollment();

    const activeCourses = useMemo(() => courses ?? [], [courses]);

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

        if (!selectedUser) {
            setSubmitError('Vui lòng chọn học sinh.');
            return;
        }
        if (!courseId) {
            setSubmitError('Vui lòng chọn khóa học.');
            return;
        }

        try {
            await createMutation.mutateAsync({
                profileId: selectedUser.id,
                courseId,
                expiresAt: permanent ? null : new Date(expiresAt).toISOString(),
                note: note.trim() || undefined,
            });
            onClose();
        } catch (err: unknown) {
            const status = (err as { response?: { status?: number } }).response?.status;
            if (status === 409) {
                setSubmitError('Học sinh này đã đăng ký khóa này rồi.');
            } else if (status === 404) {
                setSubmitError('Không tìm thấy khóa học.');
            } else {
                setSubmitError('Đăng ký thất bại. Vui lòng thử lại.');
            }
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
                <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">Đăng ký khóa học cho học sinh</h3>
                    <button
                        onClick={onClose}
                        disabled={createMutation.isPending}
                        className="text-gray-400 hover:text-gray-600 disabled:opacity-50"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Học sinh *</label>
                        <UserSearchAutocomplete
                            selected={selectedUser}
                            onChange={setSelectedUser}
                            autoFocus
                        />
                        <p className="mt-1 text-xs text-gray-500">
                            Gõ tên hoặc username để tìm. Chọn từ dropdown.
                        </p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Khóa học *</label>
                        <select
                            value={courseId}
                            onChange={(e) => setCourseId(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            required
                        >
                            <option value="">
                                {isLoadingCourses ? 'Đang tải khóa học...' : '-- Chọn khóa học --'}
                            </option>
                            {activeCourses.map((c) => (
                                <option key={c.id} value={c.id}>
                                    {c.name} (Lớp {c.grade})
                                </option>
                            ))}
                        </select>
                    </div>

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
                                    className={`px-2.5 py-1 text-xs rounded-full border transition-colors ${(preset.id === 'permanent' && permanent) || (preset.id !== 'permanent' && !permanent)
                                        ? 'border-indigo-300 bg-indigo-50 text-indigo-700 hover:bg-indigo-100'
                                        : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                                        }`}
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
                                ? 'Học sinh sẽ truy cập vĩnh viễn (expiresAt = null).'
                                : 'Sau thời điểm này, học sinh mất quyền vào các bộ đề trong khóa.'}
                        </p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Ghi chú</label>
                        <textarea
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="VD: Thanh toán qua Zalo Pay, hóa đơn #..."
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
                            disabled={createMutation.isPending}
                            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50"
                        >
                            Hủy
                        </button>
                        <button
                            type="submit"
                            disabled={createMutation.isPending || !selectedUser || !courseId}
                            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                        >
                            {createMutation.isPending ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                                    Đang đăng ký...
                                </>
                            ) : (
                                'Đăng ký'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
