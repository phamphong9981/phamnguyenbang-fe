'use client';

import { useMemo, useState } from 'react';
import { SUBJECT_ID } from '@/hooks/useExam';
import {
    useOnlineCourses,
    useCreateOnlineCourse,
    useUpdateOnlineCourse,
    useDeleteOnlineCourse,
    type OnlineCourse,
    type OnlineCourseListFilters,
    type CreateOnlineCourseDto,
    type UpdateOnlineCourseDto,
} from '@/hooks/useOnlineCourse';
import DeleteConfirmModal from '@/components/admin/DeleteConfirmModal';
import CourseFormModal from './CourseFormModal';
import ManageCourseExamsModal from './ManageCourseExamsModal';
import { getSubjectLabel } from '../utils';

type ActiveFilter = 'all' | 'active' | 'inactive';

export default function CourseListSection() {
    const [gradeFilter, setGradeFilter] = useState<number | ''>('');
    const [subjectFilter, setSubjectFilter] = useState<number | ''>('');
    const [activeFilter, setActiveFilter] = useState<ActiveFilter>('all');

    const filters = useMemo<OnlineCourseListFilters>(() => {
        const f: OnlineCourseListFilters = {};
        if (gradeFilter !== '') f.grade = gradeFilter;
        if (subjectFilter !== '') f.subject = subjectFilter;
        if (activeFilter !== 'all') f.isActive = activeFilter === 'active';
        return f;
    }, [gradeFilter, subjectFilter, activeFilter]);

    const { data: courses, isLoading, error, refetch } = useOnlineCourses(filters);
    const createMutation = useCreateOnlineCourse();
    const updateMutation = useUpdateOnlineCourse();
    const deleteMutation = useDeleteOnlineCourse();

    const [formModal, setFormModal] = useState<{
        isOpen: boolean;
        mode: 'create' | 'edit';
        course: OnlineCourse | null;
    }>({ isOpen: false, mode: 'create', course: null });

    const [examsModal, setExamsModal] = useState<{ isOpen: boolean; course: OnlineCourse | null }>({
        isOpen: false,
        course: null,
    });

    const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; course: OnlineCourse | null }>({
        isOpen: false,
        course: null,
    });

    const handleSubmitForm = async (data: CreateOnlineCourseDto | UpdateOnlineCourseDto) => {
        if (formModal.mode === 'create') {
            await createMutation.mutateAsync(data as CreateOnlineCourseDto);
        } else if (formModal.course) {
            await updateMutation.mutateAsync({ id: formModal.course.id, data });
        }
    };

    const handleConfirmDelete = async () => {
        if (!deleteModal.course) return;
        try {
            await deleteMutation.mutateAsync(deleteModal.course.id);
            setDeleteModal({ isOpen: false, course: null });
        } catch (err) {
            console.error('Error deleting course:', err);
            alert('Không xóa được khóa học. Vui lòng thử lại.');
        }
    };

    return (
        <div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                <div className="flex flex-wrap gap-3 items-end">
                    <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Khối lớp</label>
                        <select
                            value={gradeFilter}
                            onChange={(e) =>
                                setGradeFilter(e.target.value === '' ? '' : parseInt(e.target.value, 10))
                            }
                            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                            <option value="">Tất cả lớp</option>
                            <option value={10}>Lớp 10</option>
                            <option value={11}>Lớp 11</option>
                            <option value={12}>Lớp 12</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Môn học</label>
                        <select
                            value={subjectFilter}
                            onChange={(e) =>
                                setSubjectFilter(e.target.value === '' ? '' : parseInt(e.target.value, 10))
                            }
                            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                            <option value="">Tất cả môn</option>
                            <option value={SUBJECT_ID.MATH}>Toán</option>
                            <option value={SUBJECT_ID.LITERATURE}>Ngữ văn</option>
                            <option value={SUBJECT_ID.ENGLISH}>Tiếng Anh</option>
                            <option value={SUBJECT_ID.PHYSICS}>Vật lý</option>
                            <option value={SUBJECT_ID.CHEMISTRY}>Hóa học</option>
                            <option value={SUBJECT_ID.BIOLOGY}>Sinh học</option>
                            <option value={SUBJECT_ID.HISTORY}>Lịch sử</option>
                            <option value={SUBJECT_ID.GEOGRAPHY}>Địa lý</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Trạng thái</label>
                        <select
                            value={activeFilter}
                            onChange={(e) => setActiveFilter(e.target.value as ActiveFilter)}
                            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                            <option value="all">Tất cả</option>
                            <option value="active">Đang kích hoạt</option>
                            <option value="inactive">Đã tắt</option>
                        </select>
                    </div>
                </div>

                <button
                    onClick={() => setFormModal({ isOpen: true, mode: 'create', course: null })}
                    className="px-5 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
                >
                    + Tạo khóa học
                </button>
            </div>

            {isLoading ? (
                <div className="py-12 text-center text-gray-500">
                    <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                    Đang tải danh sách khóa học...
                </div>
            ) : error ? (
                <div className="py-12 text-center">
                    <p className="text-red-600 mb-3">Có lỗi xảy ra khi tải danh sách khóa học.</p>
                    <button
                        onClick={() => refetch()}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                    >
                        Thử lại
                    </button>
                </div>
            ) : courses && courses.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {courses.map((course) => (
                        <CourseCard
                            key={course.id}
                            course={course}
                            onManageExams={() => setExamsModal({ isOpen: true, course })}
                            onEdit={() => setFormModal({ isOpen: true, mode: 'edit', course })}
                            onDelete={() => setDeleteModal({ isOpen: true, course })}
                        />
                    ))}
                </div>
            ) : (
                <div className="py-12 text-center bg-gray-50 rounded-lg border border-dashed border-gray-300">
                    <div className="text-4xl mb-2">🧑‍🏫</div>
                    <h3 className="font-medium text-gray-900 mb-1">Chưa có khóa học nào</h3>
                    <p className="text-sm text-gray-500 mb-4">Bắt đầu bằng cách tạo khóa học đầu tiên.</p>
                    <button
                        onClick={() => setFormModal({ isOpen: true, mode: 'create', course: null })}
                        className="px-5 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium"
                    >
                        + Tạo khóa học
                    </button>
                </div>
            )}

            {formModal.isOpen && (
                <CourseFormModal
                    mode={formModal.mode}
                    course={formModal.course}
                    onClose={() => setFormModal({ isOpen: false, mode: 'create', course: null })}
                    onSubmit={handleSubmitForm}
                    isSubmitting={createMutation.isPending || updateMutation.isPending}
                />
            )}

            {examsModal.isOpen && examsModal.course && (
                <ManageCourseExamsModal
                    course={examsModal.course}
                    onClose={() => setExamsModal({ isOpen: false, course: null })}
                />
            )}

            <DeleteConfirmModal
                isOpen={deleteModal.isOpen}
                title="Xóa khóa học"
                message={`Xóa khóa học "${deleteModal.course?.name ?? ''}"? Toàn bộ enrollment và liên kết bộ đề của khóa này sẽ bị xóa (cascade).`}
                isLoading={deleteMutation.isPending}
                onCancel={() => setDeleteModal({ isOpen: false, course: null })}
                onConfirm={handleConfirmDelete}
            />
        </div>
    );
}

interface CourseCardProps {
    course: OnlineCourse;
    onManageExams: () => void;
    onEdit: () => void;
    onDelete: () => void;
}

function CourseCard({ course, onManageExams, onEdit, onDelete }: CourseCardProps) {
    const examCount = course.courseExamAccesses?.length ?? 0;

    return (
        <div className="bg-white rounded-lg border border-gray-200 hover:border-indigo-300 transition-colors p-5">
            <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">{course.name}</h3>
                    <div className="flex flex-wrap gap-1.5">
                        <span
                            className={`px-2 py-0.5 rounded-full text-xs font-medium border ${course.isActive
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                : 'bg-gray-100 text-gray-600 border-gray-200'
                                }`}
                        >
                            {course.isActive ? 'Đang kích hoạt' : 'Đã tắt'}
                        </span>
                        <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-200">
                            Lớp {course.grade}
                        </span>
                        <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-purple-50 text-purple-700 border border-purple-200">
                            {getSubjectLabel(course.subject)}
                        </span>
                    </div>
                </div>
            </div>

            {course.description && (
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">{course.description}</p>
            )}

            <div className="text-sm text-gray-500 mb-4">
                <span className="font-medium text-gray-900">{examCount}</span> bộ đề đã gắn
            </div>

            <div className="flex flex-wrap gap-2">
                <button
                    onClick={onManageExams}
                    className="px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-md hover:bg-indigo-100 text-sm font-medium"
                >
                    📚 Quản lý bộ đề
                </button>
                <button
                    onClick={onEdit}
                    className="px-3 py-1.5 bg-orange-50 text-orange-700 rounded-md hover:bg-orange-100 text-sm font-medium"
                >
                    ✏️ Sửa
                </button>
                <button
                    onClick={onDelete}
                    className="px-3 py-1.5 bg-red-50 text-red-700 rounded-md hover:bg-red-100 text-sm font-medium ml-auto"
                >
                    🗑️ Xóa
                </button>
            </div>
        </div>
    );
}
