'use client';

import { useMemo, useState } from 'react';
import {
    useExamSets,
    useUpdateExamSet,
    ExamSetType,
    type ExamSetResponse,
} from '@/hooks/useExam';
import {
    useOnlineCourse,
    useAttachExamToCourse,
    useDetachExamFromCourse,
    type OnlineCourse,
    type CourseExamAccess,
} from '@/hooks/useOnlineCourse';
import { getSubjectLabel } from '../utils';

interface ManageCourseExamsModalProps {
    course: OnlineCourse;
    onClose: () => void;
}

export default function ManageCourseExamsModal({ course, onClose }: ManageCourseExamsModalProps) {
    const { data: courseDetail, isLoading: isLoadingCourse } = useOnlineCourse(course.id);
    const attachedAccesses = useMemo(
        () => courseDetail?.courseExamAccesses ?? course.courseExamAccesses ?? [],
        [courseDetail, course.courseExamAccesses],
    );
    const attachedExamIds = useMemo(
        () => new Set(attachedAccesses.map((a) => a.examSetId)),
        [attachedAccesses],
    );

    const [filterType, setFilterType] = useState<ExamSetType>(ExamSetType.CHAPTER);
    const [filterGrade, setFilterGrade] = useState<number | undefined>(course.grade);
    const [search, setSearch] = useState('');

    const { data: examSets, isLoading: isLoadingExamSets } = useExamSets(
        filterType,
        filterGrade,
        undefined,
        search || undefined,
    );

    const availableExamSets = useMemo(() => {
        if (!examSets) return [] as ExamSetResponse[];
        return examSets.filter((e) => !attachedExamIds.has(e.id));
    }, [examSets, attachedExamIds]);

    const attachMutation = useAttachExamToCourse();
    const detachMutation = useDetachExamFromCourse();
    const updateExamMutation = useUpdateExamSet();

    const [busyExamId, setBusyExamId] = useState<string | null>(null);

    const handleAttach = async (examSetId: string) => {
        setBusyExamId(examSetId);
        try {
            await attachMutation.mutateAsync({ courseId: course.id, examSetId });
        } catch (err: unknown) {
            const message =
                (err as { response?: { status?: number } }).response?.status === 409
                    ? 'Bộ đề này đã được gắn vào khóa rồi.'
                    : 'Không gắn được bộ đề. Vui lòng thử lại.';
            alert(message);
        } finally {
            setBusyExamId(null);
        }
    };

    const handleDetach = async (examSetId: string, examName: string) => {
        if (
            !confirm(
                `Gỡ bộ đề "${examName}" khỏi khóa? Học sinh đang học khóa này sẽ mất quyền vào bộ đề.`,
            )
        ) {
            return;
        }
        setBusyExamId(examSetId);
        try {
            await detachMutation.mutateAsync({ courseId: course.id, examSetId });
        } catch (err) {
            console.error('Detach failed', err);
            alert('Không gỡ được bộ đề. Vui lòng thử lại.');
        } finally {
            setBusyExamId(null);
        }
    };

    const handleEnableCourseAccess = async (examSetId: string) => {
        setBusyExamId(examSetId);
        try {
            await updateExamMutation.mutateAsync({
                id: examSetId,
                data: { isCourseAccessible: true },
            });
        } catch (err) {
            console.error('Update isCourseAccessible failed', err);
            alert('Không cập nhật được. Vui lòng thử lại.');
        } finally {
            setBusyExamId(null);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl w-full max-w-6xl max-h-[92vh] overflow-hidden flex flex-col">
                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                            Quản lý bộ đề trong khóa
                        </h3>
                        <p className="text-sm text-gray-600 mt-0.5">
                            Khóa: <span className="font-medium text-gray-900">{course.name}</span>
                            <span className="ml-2 text-xs text-gray-400">
                                Lớp {course.grade} • {getSubjectLabel(course.subject)}
                            </span>
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-hidden grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-gray-200">
                    {/* Attached column */}
                    <div className="flex flex-col overflow-hidden">
                        <div className="px-5 py-3 bg-indigo-50/60 border-b border-indigo-100">
                            <h4 className="font-semibold text-indigo-900">
                                Đã gắn ({attachedAccesses.length})
                            </h4>
                            <p className="text-xs text-indigo-700/80">
                                Học sinh đăng ký khóa này (còn hạn) sẽ mở được các bộ đề bên dưới.
                            </p>
                        </div>
                        <div className="flex-1 overflow-y-auto p-4 space-y-2">
                            {isLoadingCourse ? (
                                <p className="text-sm text-gray-500 text-center py-6">Đang tải...</p>
                            ) : attachedAccesses.length === 0 ? (
                                <p className="text-sm text-gray-500 text-center py-6">
                                    Chưa có bộ đề nào được gắn vào khóa.
                                </p>
                            ) : (
                                attachedAccesses.map((access) => (
                                    <AttachedExamRow
                                        key={access.id}
                                        access={access}
                                        isBusy={busyExamId === access.examSetId}
                                        onDetach={() =>
                                            handleDetach(access.examSetId, access.examSet?.name ?? 'bộ đề')
                                        }
                                        onEnableCourseAccess={() =>
                                            handleEnableCourseAccess(access.examSetId)
                                        }
                                    />
                                ))
                            )}
                        </div>
                    </div>

                    {/* Available column */}
                    <div className="flex flex-col overflow-hidden">
                        <div className="px-5 py-3 bg-gray-50 border-b border-gray-200">
                            <h4 className="font-semibold text-gray-900 mb-2">Bộ đề khả dụng</h4>
                            <div className="grid grid-cols-3 gap-2">
                                <select
                                    value={filterType}
                                    onChange={(e) => setFilterType(e.target.value as ExamSetType)}
                                    className="px-2 py-1.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                >
                                    <option value={ExamSetType.CHAPTER}>Chapter</option>
                                    <option value={ExamSetType.HSA}>HSA</option>
                                    <option value={ExamSetType.TSA}>TSA</option>
                                </select>
                                <select
                                    value={filterGrade ?? ''}
                                    onChange={(e) =>
                                        setFilterGrade(
                                            e.target.value === '' ? undefined : parseInt(e.target.value, 10),
                                        )
                                    }
                                    className="px-2 py-1.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                >
                                    <option value="">Mọi lớp</option>
                                    <option value={10}>Lớp 10</option>
                                    <option value={11}>Lớp 11</option>
                                    <option value={12}>Lớp 12</option>
                                </select>
                                <input
                                    type="text"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Tìm theo tên..."
                                    className="px-2 py-1.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>
                        </div>
                        <div className="flex-1 overflow-y-auto p-4 space-y-2">
                            {isLoadingExamSets ? (
                                <p className="text-sm text-gray-500 text-center py-6">
                                    Đang tải danh sách bộ đề...
                                </p>
                            ) : availableExamSets.length === 0 ? (
                                <p className="text-sm text-gray-500 text-center py-6">
                                    Không còn bộ đề khả dụng để gắn.
                                </p>
                            ) : (
                                availableExamSets.map((exam) => (
                                    <AvailableExamRow
                                        key={exam.id}
                                        exam={exam}
                                        isBusy={busyExamId === exam.id}
                                        onAttach={() => handleAttach(exam.id)}
                                    />
                                ))
                            )}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-3 border-t border-gray-200 flex justify-end bg-gray-50">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-100"
                    >
                        Đóng
                    </button>
                </div>
            </div>
        </div>
    );
}

interface AttachedExamRowProps {
    access: CourseExamAccess;
    isBusy: boolean;
    onDetach: () => void;
    onEnableCourseAccess: () => void;
}

function AttachedExamRow({ access, isBusy, onDetach, onEnableCourseAccess }: AttachedExamRowProps) {
    const exam = access.examSet;
    // Cảnh báo khi đề chưa bật `isCourseAccessible` và không phải đề free.
    // Trong trường hợp này, enrollment không có ý nghĩa cho riêng đề này — học sinh online sẽ bị 403.
    const needsEnableCourseFlag =
        !!exam && exam.isCourseAccessible === false && !exam.isFree;

    return (
        <div className="border border-indigo-100 rounded-lg p-3 bg-white">
            <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className="font-medium text-gray-900 truncate">
                            {exam?.name ?? `Exam ${access.examSetId.slice(0, 8)}`}
                        </span>
                        {exam?.type && (
                            <span className="px-1.5 py-0.5 text-[10px] font-semibold bg-purple-100 text-purple-700 rounded">
                                {exam.type.toUpperCase()}
                            </span>
                        )}
                        {exam?.isPremiumAccessible && exam?.isCourseAccessible && (
                            <span className="px-1.5 py-0.5 text-[10px] font-semibold bg-blue-100 text-blue-700 rounded">
                                🤝 Premium + Course
                            </span>
                        )}
                        {!exam?.isPremiumAccessible && exam?.isCourseAccessible && (
                            <span className="px-1.5 py-0.5 text-[10px] font-semibold bg-indigo-100 text-indigo-700 rounded">
                                🧑‍🏫 Course-only
                            </span>
                        )}
                    </div>
                    {exam && (
                        <div className="text-xs text-gray-500">
                            Lớp {exam.grade ?? '—'} • {getSubjectLabel(exam.subject)}
                        </div>
                    )}
                </div>
                <button
                    onClick={onDetach}
                    disabled={isBusy}
                    className="px-3 py-1 text-xs font-medium text-red-600 bg-red-50 border border-red-200 rounded-md hover:bg-red-100 disabled:opacity-50"
                >
                    {isBusy ? '...' : 'Gỡ'}
                </button>
            </div>
            {needsEnableCourseFlag && (
                <div className="mt-2 flex items-start gap-2 p-2 rounded bg-amber-50 border border-amber-200">
                    <span className="text-amber-700 text-xs flex-1">
                        ⚠️ Đề chưa bật <code className="font-mono">isCourseAccessible</code>. Học sinh
                        online dù có enrollment vẫn bị 403 khi mở đề.
                    </span>
                    <button
                        onClick={onEnableCourseAccess}
                        disabled={isBusy}
                        className="px-2 py-1 text-xs font-medium text-amber-800 bg-white border border-amber-300 rounded hover:bg-amber-100 disabled:opacity-50"
                    >
                        Bật course-accessible
                    </button>
                </div>
            )}
        </div>
    );
}

interface AvailableExamRowProps {
    exam: ExamSetResponse;
    isBusy: boolean;
    onAttach: () => void;
}

function AvailableExamRow({ exam, isBusy, onAttach }: AvailableExamRowProps) {
    return (
        <div className="border border-gray-200 rounded-lg p-3 bg-white hover:border-indigo-200 transition-colors">
            <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className="font-medium text-gray-900 truncate">{exam.name}</span>
                        <span className="px-1.5 py-0.5 text-[10px] font-semibold bg-gray-100 text-gray-700 rounded">
                            {exam.type.toUpperCase()}
                        </span>
                        {exam.isFree && (
                            <span className="px-1.5 py-0.5 text-[10px] font-semibold bg-emerald-100 text-emerald-700 rounded">
                                Free
                            </span>
                        )}
                        {exam.isPremiumAccessible && exam.isCourseAccessible && (
                            <span className="px-1.5 py-0.5 text-[10px] font-semibold bg-blue-100 text-blue-700 rounded">
                                🤝 Premium + Course
                            </span>
                        )}
                        {!exam.isPremiumAccessible && exam.isCourseAccessible && (
                            <span className="px-1.5 py-0.5 text-[10px] font-semibold bg-indigo-100 text-indigo-700 rounded">
                                Course-only
                            </span>
                        )}
                    </div>
                    <div className="text-xs text-gray-500">
                        Lớp {exam.grade} • {getSubjectLabel(exam.subject)}
                    </div>
                </div>
                <button
                    onClick={onAttach}
                    disabled={isBusy}
                    className="px-3 py-1 text-xs font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:opacity-50"
                >
                    {isBusy ? '...' : '+ Gắn'}
                </button>
            </div>
        </div>
    );
}
