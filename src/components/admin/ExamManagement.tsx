'use client';

import { ChangeEvent, useEffect, useMemo, useState } from 'react';
import { useDeleteExamSubmission, useGetExamHistory, useUpdateExamSubmission } from '@/hooks/useAdminExam';
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
    const [editingSubmissionId, setEditingSubmissionId] = useState<string | null>(null);
    const [editingPoints, setEditingPoints] = useState<string>('');

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

    // Get students of the selected class when className filter is active
    const { data: classStudentsData, isLoading: isClassStudentsLoading } = useGetUsers(
        undefined,
        selectedYearOfBirth,
        filters.className || undefined
    );

    // Merge exam history with students who haven't taken the exam
    const mergedData = useMemo(() => {
        if (!filters.className) {
            // If no class filter, return only exam history
            return data || [];
        }

        const examHistory = data || [];
        const classStudents = classStudentsData || [];

        // Create a map of students who have taken exams (by userId)
        const studentsWithExams = new Set(
            examHistory
                .map((item) => item.userId)
                .filter((id): id is string => id !== null && id !== undefined)
        );

        // Find students who haven't taken any exam
        const studentsWithoutExams = classStudents
            .filter((student) => !studentsWithExams.has(student.id))
            .map((student) => ({
                submissionId: `no-exam-${student.id}`,
                examId: '',
                examName: null,
                examType: null,
                subject: null,
                grade: selectedGradeValue || null,
                totalPoints: null,
                totalTime: null,
                giveAway: null,
                takenAt: null as any,
                examYear: null,
                examDuration: null,
                examDifficulty: null,
                userId: student.id,
                username: student.username,
                profileId: null,
                fullName: student.fullname,
                phoneNumber: student.phone || null,
                yearOfBirth: student.yearOfBirth ? Number(student.yearOfBirth) : null,
                class: student.class,
            }));

        // Combine exam history with students who haven't taken exams
        return [...examHistory, ...studentsWithoutExams];
    }, [data, classStudentsData, filters.className, selectedGradeValue]);

    useEffect(() => {
        setCurrentPage(1);
    }, [filters.grade, filters.examType, filters.className, filters.examSetId]);

    const { mutate: deleteSubmission, isPending: isDeleting } = useDeleteExamSubmission();
    const { mutate: updateSubmission, isPending: isUpdating } = useUpdateExamSubmission();

    const handleDeleteSubmission = (submissionId: string) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa bài làm này không?')) {
            deleteSubmission(submissionId);
        }
    };

    const handleStartEdit = (submissionId: string, currentPoints: number | null) => {
        setEditingSubmissionId(submissionId);
        setEditingPoints(currentPoints != null ? String(currentPoints) : '');
    };

    const handleCancelEdit = () => {
        setEditingSubmissionId(null);
        setEditingPoints('');
    };

    const handleSaveEdit = (submissionId: string) => {
        const parsed = parseFloat(editingPoints);
        if (Number.isNaN(parsed) || parsed < 0) return;
        updateSubmission({ submissionId, totalPoints: parsed }, {
            onSuccess: () => handleCancelEdit(),
        });
    };

    const totalRecords = mergedData?.length ?? 0;
    const totalPages = Math.max(1, Math.ceil(totalRecords / ITEMS_PER_PAGE));
    const firstItemIndex = totalRecords === 0 ? 0 : (currentPage - 1) * ITEMS_PER_PAGE + 1;
    const lastItemIndex = totalRecords === 0 ? 0 : Math.min(currentPage * ITEMS_PER_PAGE, totalRecords);

    const paginatedData = useMemo(() => {
        if (!mergedData || mergedData.length === 0) return [];
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        const endIndex = startIndex + ITEMS_PER_PAGE;
        return mergedData.slice(startIndex, endIndex);
    }, [mergedData, currentPage]);

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

    const formatTotalTime = (seconds: number | null | undefined) => {
        if (typeof seconds !== 'number' || Number.isNaN(seconds) || seconds < 0) return '—';
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
        if (h > 0) return `${h}g ${m.toString().padStart(2, '0')}p ${s.toString().padStart(2, '0')}s`;
        if (m > 0) return `${m}p ${s.toString().padStart(2, '0')}s`;
        return `${s}s`;
    };

    const formatGradeFromYear = (year?: number | null) => {
        if (!year || Number.isNaN(year)) return '—';
        if (YEAR_OF_BIRTH_TO_GRADE_LABEL[year]) {
            return `${YEAR_OF_BIRTH_TO_GRADE_LABEL[year]} (${year})`;
        }
        return `Năm ${year}`;
    };

    const renderTableContent = () => {
        if (isLoading || (filters.className && isClassStudentsLoading)) {
            return (
                <tr>
                    <td colSpan={9} className="py-10 text-center text-gray-500">
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
                    <td colSpan={9} className="py-10 text-center text-red-500">
                        Có lỗi xảy ra khi tải dữ liệu. Vui lòng thử lại sau.
                    </td>
                </tr>
            );
        }

        if (!paginatedData.length) {
            return (
                <tr>
                    <td colSpan={9} className="py-10 text-center text-gray-500">
                        Không tìm thấy dữ liệu phù hợp.
                    </td>
                </tr>
            );
        }

        return paginatedData.map((historyItem, index) => {
            const isNoExam = historyItem.submissionId?.startsWith('no-exam-') || !historyItem.examId;

            return (
                <tr
                    key={historyItem.submissionId || `${historyItem.examId}-${index}`}
                    className={`divide-x divide-gray-200 ${isNoExam ? 'bg-gray-50' : ''}`}
                >
                    <td className="px-4 py-3 text-sm text-gray-600 text-center">
                        {(currentPage - 1) * ITEMS_PER_PAGE + index + 1}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900 font-medium">
                        <span>{historyItem.examName ?? (isNoExam ? 'Chưa làm bài' : 'Không tên')}</span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                        <div className="flex flex-col">
                            <span>{historyItem.fullName ?? historyItem.username ?? '—'}</span>
                            {historyItem.phoneNumber && (
                                <span className="text-xs text-gray-500">
                                    SĐT: {historyItem.phoneNumber}
                                </span>
                            )}
                        </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600 text-center">
                        {historyItem.class ?? '—'}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600 text-center">
                        {formatGradeFromYear(historyItem.yearOfBirth ?? null)}
                    </td>
                    <td className={`px-4 py-3 text-sm text-right font-semibold ${isNoExam ? 'text-gray-400 italic' : 'text-gray-900'}`}>
                        {isNoExam ? 'Chưa làm bài' : (
                            editingSubmissionId === historyItem.submissionId ? (
                                <div className="flex items-center justify-end gap-1">
                                    <input
                                        type="number"
                                        min={0}
                                        step={0.25}
                                        value={editingPoints}
                                        onChange={(e) => setEditingPoints(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') handleSaveEdit(historyItem.submissionId);
                                            if (e.key === 'Escape') handleCancelEdit();
                                        }}
                                        autoFocus
                                        className="w-20 border border-green-400 rounded px-2 py-0.5 text-sm text-right focus:outline-none focus:ring-2 focus:ring-green-500"
                                    />
                                    <button
                                        onClick={() => handleSaveEdit(historyItem.submissionId)}
                                        disabled={isUpdating}
                                        className="text-green-600 hover:text-green-800 disabled:opacity-50"
                                        title="Lưu"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414L8.414 15l-4.121-4.121a1 1 0 011.414-1.414L8.414 12.172l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                    </button>
                                    <button
                                        onClick={handleCancelEdit}
                                        className="text-gray-400 hover:text-gray-600"
                                        title="Hủy"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 011.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                        </svg>
                                    </button>
                                </div>
                            ) : (
                                <button
                                    onClick={() => handleStartEdit(historyItem.submissionId, historyItem.totalPoints)}
                                    className="group inline-flex items-center gap-1 hover:text-green-700 transition"
                                    title="Click để sửa điểm"
                                >
                                    {formatPoints(historyItem.totalPoints)}
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                    </svg>
                                </button>
                            )
                        )}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600 text-center">
                        {isNoExam ? '—' : formatTotalTime(historyItem.totalTime)}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600 text-right">
                        {isNoExam ? '—' : formatDateTime(historyItem.takenAt)}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600 text-right">
                        {!isNoExam && historyItem.submissionId && (
                            <button
                                onClick={() => handleDeleteSubmission(historyItem.submissionId)}
                                disabled={isDeleting}
                                className="text-red-500 hover:text-red-700 transition disabled:opacity-50"
                                title="Xóa bài nộp"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-auto" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                            </button>
                        )}
                    </td>
                </tr>
            );
        });
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
                            <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider text-center">Thời gian làm bài</th>
                            <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider text-right">Thời gian nộp</th>
                            <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider text-right">Thao tác</th>
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

