'use client';

import { useEffect, useMemo, useState } from 'react';
import {
    useEnrollments,
    useOnlineCourses,
    useDeleteEnrollment,
    getEnrollmentStatus,
    type CourseEnrollment,
    type EnrollmentListFilters,
} from '@/hooks/useOnlineCourse';
import type { GetUsersResponse } from '@/hooks/useAdmin';
import DeleteConfirmModal from '@/components/admin/DeleteConfirmModal';
import CreateEnrollmentModal from './CreateEnrollmentModal';
import EditEnrollmentModal from './EditEnrollmentModal';
import UserSearchAutocomplete from './UserSearchAutocomplete';
import { daysUntil, formatDate } from '../utils';

const PAGE_SIZE = 20;

export default function EnrollmentListSection() {
    const [courseFilter, setCourseFilter] = useState<string>('');
    const [profileFilter, setProfileFilter] = useState<GetUsersResponse | null>(null);
    const [page, setPage] = useState(1);

    const { data: courses } = useOnlineCourses({});

    const filters = useMemo<EnrollmentListFilters>(() => {
        const f: EnrollmentListFilters = { page, limit: PAGE_SIZE };
        if (courseFilter) f.courseId = courseFilter;
        if (profileFilter) f.profileId = profileFilter.id;
        return f;
    }, [courseFilter, profileFilter, page]);

    const { data, isLoading, error, refetch } = useEnrollments(filters);
    const deleteMutation = useDeleteEnrollment();

    const [createOpen, setCreateOpen] = useState(false);
    const [editEnrollment, setEditEnrollment] = useState<CourseEnrollment | null>(null);
    const [deleteEnrollment, setDeleteEnrollment] = useState<CourseEnrollment | null>(null);

    useEffect(() => {
        setPage(1);
    }, [courseFilter, profileFilter]);

    const totalPages = Math.max(1, Math.ceil((data?.total ?? 0) / PAGE_SIZE));

    const handleConfirmDelete = async () => {
        if (!deleteEnrollment) return;
        try {
            await deleteMutation.mutateAsync(deleteEnrollment.id);
            setDeleteEnrollment(null);
        } catch (err) {
            console.error('Error deleting enrollment:', err);
            alert('Không thu hồi được. Vui lòng thử lại.');
        }
    };

    return (
        <div>
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-3 mb-4">
                <div className="flex flex-wrap gap-3 items-end flex-1">
                    <div className="min-w-[220px]">
                        <label className="block text-xs font-medium text-gray-600 mb-1">Khóa học</label>
                        <select
                            value={courseFilter}
                            onChange={(e) => setCourseFilter(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                            <option value="">Tất cả khóa</option>
                            {courses?.map((c) => (
                                <option key={c.id} value={c.id}>
                                    {c.name} (Lớp {c.grade})
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="min-w-[260px] flex-1">
                        <label className="block text-xs font-medium text-gray-600 mb-1">Học sinh</label>
                        <UserSearchAutocomplete
                            selected={profileFilter}
                            onChange={setProfileFilter}
                            placeholder="Tìm theo tên/username..."
                        />
                    </div>
                </div>

                <button
                    onClick={() => setCreateOpen(true)}
                    className="px-5 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium whitespace-nowrap"
                >
                    + Đăng ký mới
                </button>
            </div>

            {isLoading ? (
                <div className="py-12 text-center text-gray-500">
                    <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                    Đang tải...
                </div>
            ) : error ? (
                <div className="py-12 text-center">
                    <p className="text-red-600 mb-3">Có lỗi xảy ra khi tải danh sách đăng ký.</p>
                    <button
                        onClick={() => refetch()}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                    >
                        Thử lại
                    </button>
                </div>
            ) : !data || data.data.length === 0 ? (
                <div className="py-12 text-center bg-gray-50 rounded-lg border border-dashed border-gray-300">
                    <div className="text-4xl mb-2">🧾</div>
                    <p className="text-gray-600 mb-1">Chưa có đăng ký nào khớp bộ lọc.</p>
                    <p className="text-sm text-gray-500">Nhấn &quot;+ Đăng ký mới&quot; để thêm.</p>
                </div>
            ) : (
                <>
                    <div className="bg-white rounded-lg border border-gray-200 overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        Học sinh
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        Khóa học
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        Hạn truy cập
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        Ghi chú
                                    </th>
                                    <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        Hành động
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-100">
                                {data.data.map((enrollment) => (
                                    <EnrollmentRow
                                        key={enrollment.id}
                                        enrollment={enrollment}
                                        onEdit={() => setEditEnrollment(enrollment)}
                                        onDelete={() => setDeleteEnrollment(enrollment)}
                                    />
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="flex items-center justify-between mt-4 text-sm text-gray-600">
                        <span>
                            Tổng <span className="font-semibold text-gray-900">{data.total}</span> đăng ký
                            • Trang {page}/{totalPages}
                        </span>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setPage((p) => Math.max(1, p - 1))}
                                disabled={page <= 1}
                                className="px-3 py-1.5 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                            >
                                ← Trước
                            </button>
                            <button
                                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                                disabled={page >= totalPages}
                                className="px-3 py-1.5 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                            >
                                Sau →
                            </button>
                        </div>
                    </div>
                </>
            )}

            {createOpen && (
                <CreateEnrollmentModal
                    onClose={() => setCreateOpen(false)}
                    defaultCourseId={courseFilter || undefined}
                />
            )}

            {editEnrollment && (
                <EditEnrollmentModal
                    enrollment={editEnrollment}
                    onClose={() => setEditEnrollment(null)}
                />
            )}

            <DeleteConfirmModal
                isOpen={!!deleteEnrollment}
                title="Thu hồi quyền truy cập"
                message={`Thu hồi enrollment của "${deleteEnrollment?.profile?.fullname ?? 'học sinh'
                    }" khỏi khóa "${deleteEnrollment?.course?.name ?? ''}"?`}
                isLoading={deleteMutation.isPending}
                onCancel={() => setDeleteEnrollment(null)}
                onConfirm={handleConfirmDelete}
            />
        </div>
    );
}

interface EnrollmentRowProps {
    enrollment: CourseEnrollment;
    onEdit: () => void;
    onDelete: () => void;
}

function EnrollmentRow({ enrollment, onEdit, onDelete }: EnrollmentRowProps) {
    const status = getEnrollmentStatus(enrollment.expiresAt);

    return (
        <tr className="hover:bg-gray-50">
            <td className="px-4 py-3">
                <div className="text-sm font-medium text-gray-900">
                    {enrollment.profile?.fullname ?? enrollment.profileId}
                </div>
                {enrollment.profile?.username && (
                    <div className="text-xs text-gray-500">
                        @{enrollment.profile.username}
                        {enrollment.profile.class && ` • ${enrollment.profile.class}`}
                    </div>
                )}
            </td>
            <td className="px-4 py-3">
                <div className="text-sm text-gray-900">{enrollment.course?.name ?? '—'}</div>
                {enrollment.course?.grade && (
                    <div className="text-xs text-gray-500">Lớp {enrollment.course.grade}</div>
                )}
            </td>
            <td className="px-4 py-3">
                {status === 'permanent' && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700 border border-emerald-200">
                        ∞ Vĩnh viễn
                    </span>
                )}
                {status === 'active' && enrollment.expiresAt && (
                    <div>
                        <div className="text-sm text-gray-900">{formatDate(enrollment.expiresAt)}</div>
                        <div className="text-xs text-gray-500">Còn {daysUntil(enrollment.expiresAt)} ngày</div>
                    </div>
                )}
                {status === 'expired' && enrollment.expiresAt && (
                    <div>
                        <div className="text-sm text-red-600 font-medium">
                            {formatDate(enrollment.expiresAt)}
                        </div>
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700 border border-red-200 mt-0.5">
                            Đã hết hạn
                        </span>
                    </div>
                )}
            </td>
            <td className="px-4 py-3 text-sm text-gray-700 max-w-xs">
                <span className="line-clamp-2">{enrollment.note || '—'}</span>
            </td>
            <td className="px-4 py-3 text-right">
                <div className="flex justify-end gap-1">
                    <button
                        onClick={onEdit}
                        className="p-1.5 text-orange-600 hover:bg-orange-50 rounded"
                        title="Sửa hạn / ghi chú"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                    </button>
                    <button
                        onClick={onDelete}
                        className="p-1.5 text-red-600 hover:bg-red-50 rounded"
                        title="Thu hồi quyền truy cập"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                    </button>
                </div>
            </td>
        </tr>
    );
}

