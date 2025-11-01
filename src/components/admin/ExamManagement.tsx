'use client';

import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from 'react';
import { useGetExamHistory } from '@/hooks/useAdminExam';

interface FilterFormState {
    userId: string;
    className: string;
    examSetId: string;
}

const ITEMS_PER_PAGE = 10;

const initialFilters: FilterFormState = {
    userId: '',
    className: '',
    examSetId: '',
};

export default function ExamManagement() {
    const [filters, setFilters] = useState<FilterFormState>(initialFilters);
    const [appliedFilters, setAppliedFilters] = useState<FilterFormState>(initialFilters);
    const [currentPage, setCurrentPage] = useState(1);

    const { data, isLoading, isError, refetch, isFetching } = useGetExamHistory(
        appliedFilters.userId || undefined,
        appliedFilters.className || undefined,
        appliedFilters.examSetId || undefined,
    );

    useEffect(() => {
        setCurrentPage(1);
    }, [appliedFilters]);

    const totalRecords = data?.length ?? 0;
    const totalPages = Math.max(1, Math.ceil(totalRecords / ITEMS_PER_PAGE));
    const firstItemIndex = totalRecords === 0 ? 0 : (currentPage - 1) * ITEMS_PER_PAGE + 1;
    const lastItemIndex = totalRecords === 0 ? 0 : Math.min(currentPage * ITEMS_PER_PAGE, totalRecords);

    const paginatedData = useMemo(() => {
        if (!data) return [];
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        const endIndex = startIndex + ITEMS_PER_PAGE;
        return data.slice(startIndex, endIndex);
    }, [data, currentPage]);

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setAppliedFilters(filters);
    };

    const handleReset = () => {
        setFilters(initialFilters);
        setAppliedFilters(initialFilters);
    };

    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setFilters((prev) => ({ ...prev, [name]: value }));
    };

    const handlePageChange = (direction: 'prev' | 'next') => {
        setCurrentPage((prev) => {
            if (direction === 'prev') {
                return Math.max(1, prev - 1);
            }
            return Math.min(totalPages, prev + 1);
        });
    };

    const handleManualRefetch = () => {
        refetch();
    };

    const formatDateTime = (isoDate?: string | Date | null) => {
        if (!isoDate) return '—';
        const date = isoDate instanceof Date ? isoDate : new Date(isoDate);
        if (Number.isNaN(date.getTime())) return '—';
        return date.toLocaleString('vi-VN');
    };

    const formatPoints = (points: number | null | undefined) => {
        if (typeof points !== 'number' || Number.isNaN(points)) {
            return '—';
        }
        return `${points.toLocaleString('vi-VN')} điểm`;
    };

    const formatDuration = (duration?: string | null, totalTime?: number | null) => {
        if (duration) return duration;
        if (typeof totalTime === 'number' && !Number.isNaN(totalTime)) {
            return `${totalTime} phút`;
        }
        return '—';
    };

    const renderTableContent = () => {
        if (isLoading) {
            return (
                <tr>
                    <td colSpan={10} className="py-10 text-center text-gray-500">
                        <div className="flex flex-col items-center gap-3">
                            <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin" />
                            <span>Đang tải lịch sử bài thi...</span>
                        </div>
                    </td>
                </tr>
            );
        }

        if (isError) {
            return (
                <tr>
                    <td colSpan={10} className="py-10 text-center text-red-500">
                        Có lỗi xảy ra khi tải dữ liệu. Vui lòng thử lại sau.
                    </td>
                </tr>
            );
        }

        if (!paginatedData.length) {
            return (
                <tr>
                    <td colSpan={10} className="py-10 text-center text-gray-500">
                        Không tìm thấy dữ liệu phù hợp.
                    </td>
                </tr>
            );
        }

        return paginatedData.map((historyItem, index) => (
            <tr key={historyItem.submissionId || `${historyItem.examId}-${index}`} className="divide-x divide-gray-200">
                <td className="px-4 py-3 text-sm text-gray-600 text-center">
                    {(currentPage - 1) * ITEMS_PER_PAGE + index + 1}
                </td>
                <td className="px-4 py-3 text-sm text-gray-900 font-medium">
                    <div className="flex flex-col">
                        <span>{historyItem.examName ?? 'Không tên'}</span>
                        <span className="text-xs text-gray-500">
                            Mã đề: {historyItem.examId || '—'}
                        </span>
                    </div>
                </td>
                <td className="px-4 py-3 text-sm text-gray-900">
                    <div className="flex flex-col">
                        <span>{historyItem.fullName ?? historyItem.username ?? '—'}</span>
                        <span className="text-xs text-gray-500">
                            ID: {historyItem.userId ?? '—'}
                        </span>
                    </div>
                </td>
                <td className="px-4 py-3 text-sm text-gray-600 text-center">
                    {historyItem.class ?? '—'}
                </td>
                <td className="px-4 py-3 text-sm text-gray-600 text-center">
                    {historyItem.grade ?? '—'}
                </td>
                <td className="px-4 py-3 text-sm text-gray-900 text-right font-semibold">
                    {formatPoints(historyItem.totalPoints)}
                </td>
                <td className="px-4 py-3 text-sm text-gray-600 text-center">
                    {historyItem.examDifficulty ?? '—'}
                </td>
                <td className="px-4 py-3 text-sm text-gray-600 text-center">
                    {historyItem.examYear ?? '—'}
                </td>
                <td className="px-4 py-3 text-sm text-gray-600 text-center">
                    {formatDuration(historyItem.examDuration, historyItem.totalTime)}
                </td>
                <td className="px-4 py-3 text-sm text-gray-600 text-right">
                    {formatDateTime(historyItem.takenAt)}
                </td>
            </tr>
        ));
    };

    return (
        <div className="p-6">
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-1">
                        Quản lý bài thi
                    </h2>
                    <p className="text-gray-600">
                        Tổng cộng {totalRecords} lượt làm bài
                        {(appliedFilters.userId || appliedFilters.className || appliedFilters.examSetId) && (
                            <span className="ml-2 text-green-600">
                                (đang áp dụng bộ lọc)
                            </span>
                        )}
                    </p>
                </div>
                <button
                    onClick={handleManualRefetch}
                    className="inline-flex items-center justify-center px-4 py-2 border border-green-500 text-green-600 rounded-lg hover:bg-green-50 transition"
                    disabled={isFetching}
                >
                    {isFetching ? 'Đang đồng bộ...' : 'Đồng bộ dữ liệu'}
                </button>
            </div>

            <form
                onSubmit={handleSubmit}
                className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4 bg-gray-50 border border-gray-200 rounded-lg p-4"
            >
                <div className="flex flex-col">
                    <label htmlFor="userId" className="text-sm font-medium text-gray-700 mb-1">
                        Mã người dùng
                    </label>
                    <input
                        id="userId"
                        name="userId"
                        value={filters.userId}
                        onChange={handleInputChange}
                        placeholder="Nhập userId"
                        className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                </div>
                <div className="flex flex-col">
                    <label htmlFor="className" className="text-sm font-medium text-gray-700 mb-1">
                        Lớp học
                    </label>
                    <input
                        id="className"
                        name="className"
                        value={filters.className}
                        onChange={handleInputChange}
                        placeholder="VD: 12A1"
                        className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                </div>
                <div className="flex flex-col">
                    <label htmlFor="examSetId" className="text-sm font-medium text-gray-700 mb-1">
                        Mã đề thi
                    </label>
                    <input
                        id="examSetId"
                        name="examSetId"
                        value={filters.examSetId}
                        onChange={handleInputChange}
                        placeholder="Nhập examSetId"
                        className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                </div>
                <div className="flex items-end gap-2">
                    <button
                        type="submit"
                        className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                    >
                        Áp dụng
                    </button>
                    <button
                        type="button"
                        onClick={handleReset}
                        className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition"
                    >
                        Xóa lọc
                    </button>
                </div>
            </form>

            <div className="overflow-x-auto border border-gray-200 rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider text-center">#</th>
                            <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider text-left">Bài thi</th>
                            <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider text-left">Thí sinh</th>
                            <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider text-center">Lớp</th>
                            <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider text-center">Khối</th>
                            <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider text-right">Điểm</th>
                            <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider text-center">Độ khó</th>
                            <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider text-center">Năm thi</th>
                            <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider text-center">Thời lượng</th>
                            <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider text-right">Thời gian làm</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {renderTableContent()}
                    </tbody>
                </table>
            </div>

            <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between text-sm text-gray-600">
                <span>
                    {totalRecords === 0
                        ? 'Không có lượt làm bài nào'
                        : `Hiển thị ${firstItemIndex}–${lastItemIndex} trên tổng số ${totalRecords}`}
                </span>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => handlePageChange('prev')}
                        disabled={currentPage === 1}
                        className="px-3 py-1.5 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
                    >
                        Trước
                    </button>
                    <span className="font-medium">
                        Trang {currentPage}/{totalPages}
                    </span>
                    <button
                        onClick={() => handlePageChange('next')}
                        disabled={currentPage === totalPages}
                        className="px-3 py-1.5 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
                    >
                        Sau
                    </button>
                </div>
            </div>
        </div>
    );
}

