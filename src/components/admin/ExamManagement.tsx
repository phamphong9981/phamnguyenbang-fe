'use client';

import { ChangeEvent, useEffect, useMemo, useState } from 'react';
import { useGetExamHistory } from '@/hooks/useAdminExam';
import { useGetUsers } from '@/hooks/useAdmin';
import { ExamSetResponse, ExamSetType, useExamSets } from '@/hooks/useExam';

const GRADE_TO_YEAR_OF_BIRTH: Record<number, number> = {
    12: 2008,
    11: 2009,
    10: 2010,
};

const YEAR_OF_BIRTH_TO_GRADE_LABEL: Record<number, string> = {
    2008: 'Khối 12',
    2009: 'Khối 11',
    2010: 'Khối 10',
};

const EXAM_TYPE_LABEL: Record<ExamSetType, string> = {
    [ExamSetType.HSA]: 'Đề HSA',
    [ExamSetType.TSA]: 'Đề TSA',
    [ExamSetType.CHAPTER]: 'Đề chương',
};

interface FilterFormState {
    grade: string;
    examType: string;
    className: string;
    examSetId: string;
}

const ITEMS_PER_PAGE = 10;

const initialFilters: FilterFormState = {
    grade: '',
    examType: '',
    className: '',
    examSetId: '',
};

export default function ExamManagement() {
    const [filters, setFilters] = useState<FilterFormState>(initialFilters);
    const [currentPage, setCurrentPage] = useState(1);

    const selectedGradeValue = filters.grade ? Number(filters.grade) : undefined;
    const selectedExamType = filters.examType ? filters.examType as ExamSetType : undefined;

    const { data: usersData, isLoading: isUsersLoading } = useGetUsers(undefined, selectedGradeValue ? GRADE_TO_YEAR_OF_BIRTH[selectedGradeValue] : undefined);
    const hsaExamSets = useExamSets(ExamSetType.HSA, selectedGradeValue);
    const tsaExamSets = useExamSets(ExamSetType.TSA, selectedGradeValue);
    const chapterExamSets = useExamSets(ExamSetType.CHAPTER, selectedGradeValue);

    const allExamSets = useMemo(() => {
        const collect = (examSet?: ExamSetResponse[]) => examSet ?? [];
        return [
            ...collect(hsaExamSets.data),
            ...collect(tsaExamSets.data),
            ...collect(chapterExamSets.data),
        ];
    }, [hsaExamSets.data, tsaExamSets.data, chapterExamSets.data]);

    const examOptions = useMemo(() => {
        const filteredExamSets = selectedExamType
            ? allExamSets.filter((exam) => exam.type === selectedExamType)
            : allExamSets;

        return filteredExamSets
            .map((exam) => ({ id: exam.id, name: exam.name }))
            .sort((a, b) => a.name.localeCompare(b.name));
    }, [allExamSets, selectedExamType]);

    const classOptions = useMemo(() => {
        if (!usersData) return [];
        const uniqueClasses = Array.from(new Set(usersData.map((user) => user.class).filter(Boolean)));
        return uniqueClasses.sort((a, b) => a.localeCompare(b));
    }, [usersData]);

    const selectedYearOfBirth = selectedGradeValue ? GRADE_TO_YEAR_OF_BIRTH[selectedGradeValue] : undefined;

    const { data, isLoading, isError, refetch, isFetching } = useGetExamHistory(
        undefined,
        filters.className || undefined,
        filters.examSetId || undefined,
        selectedYearOfBirth ?? undefined,
        selectedExamType,
    );

    useEffect(() => {
        setCurrentPage(1);
    }, [filters.grade, filters.examType, filters.className, filters.examSetId]);

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

    const handleReset = () => {
        setFilters(initialFilters);
    };

    const handleInputChange = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = event.target;
        setFilters((prev) => {
            const next = { ...prev, [name]: value };
            if (name === 'grade') {
                next.className = '';
                next.examSetId = '';
            }
            if (name === 'examType') {
                next.examSetId = '';
            }
            return next;
        });
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

    const formatGradeFromYear = (year?: number | null) => {
        if (!year || Number.isNaN(year)) return '—';
        if (YEAR_OF_BIRTH_TO_GRADE_LABEL[year]) {
            return `${YEAR_OF_BIRTH_TO_GRADE_LABEL[year]} (${year})`;
        }
        return `Năm ${year}`;
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
                    {formatGradeFromYear(historyItem.yearOfBirth ?? null)}
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
                        {(filters.grade || filters.examType || filters.className || filters.examSetId) && (
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

            <div className="mb-6 grid grid-cols-1 md:grid-cols-5 gap-4 bg-gray-50 border border-gray-200 rounded-lg p-4">
                <div className="flex flex-col">
                    <label htmlFor="grade" className="text-sm font-medium text-gray-700 mb-1">
                        Khối
                    </label>
                    <select
                        id="grade"
                        name="grade"
                        value={filters.grade}
                        onChange={handleInputChange}
                        className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                        <option value="">Tất cả</option>
                        <option value="12">Khối 12</option>
                        <option value="11">Khối 11</option>
                        <option value="10">Khối 10</option>
                    </select>
                </div>
                <div className="flex flex-col">
                    <label htmlFor="examType" className="text-sm font-medium text-gray-700 mb-1">
                        Loại đề thi
                    </label>
                    <select
                        id="examType"
                        name="examType"
                        value={filters.examType}
                        onChange={handleInputChange}
                        className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                        <option value="">Tất cả</option>
                        {Object.values(ExamSetType).map((type) => (
                            <option key={type} value={type}>
                                {EXAM_TYPE_LABEL[type]}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="flex flex-col">
                    <label htmlFor="className" className="text-sm font-medium text-gray-700 mb-1">
                        Lớp học
                    </label>
                    <select
                        id="className"
                        name="className"
                        value={filters.className}
                        onChange={handleInputChange}
                        className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                        disabled={isUsersLoading}
                    >
                        <option value="">Tất cả</option>
                        {classOptions.map((className) => (
                            <option key={className} value={className}>
                                {className}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="flex flex-col">
                    <label htmlFor="examSetId" className="text-sm font-medium text-gray-700 mb-1">
                        Đề thi
                    </label>
                    <select
                        id="examSetId"
                        name="examSetId"
                        value={filters.examSetId}
                        onChange={handleInputChange}
                        className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                        disabled={hsaExamSets.isLoading || tsaExamSets.isLoading || chapterExamSets.isLoading}
                    >
                        <option value="">Tất cả</option>
                        {examOptions.map((exam) => (
                            <option key={exam.id} value={exam.id}>
                                {exam.name}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="flex items-end">
                    <button
                        type="button"
                        onClick={handleReset}
                        className="w-full inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition"
                    >
                        Xóa lọc
                    </button>
                </div>
            </div>

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

