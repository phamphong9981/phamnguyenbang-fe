'use client';

import { useMemo, useState } from 'react';
import { ExamSetGroupExamType, useExamSetGroups } from '@/hooks/useExam';
import {
    ExamSetGroupResultDto,
    useDeleteGroupResult,
    useGroupResultDetail,
    useGroupResults,
    useUpdateGroupResult,
} from '@/hooks/useAdmin';
import DeleteConfirmModal from './DeleteConfirmModal';
import GroupResultQuestionDetails from './GroupResultQuestionDetails';

const PAGE_SIZE = 20;

function formatDate(value: string): string {
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return '—';
    return d.toLocaleString('vi-VN', {
        day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit',
    });
}

// ---- Detail modal ----
function ResultDetailModal({ resultId, onClose }: { resultId: string; onClose: () => void }) {
    const { data, isLoading, error } = useGroupResultDetail(resultId);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] flex flex-col">
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 shrink-0">
                    <h3 className="text-lg font-semibold text-gray-900">Chi tiết kết quả</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">×</button>
                </div>

                <div className="overflow-y-auto">
                    {isLoading ? (
                        <div className="flex items-center justify-center gap-3 text-gray-500 py-16">
                            <div className="w-8 h-8 border-2 border-green-600 border-t-transparent rounded-full animate-spin" />
                            Đang tải chi tiết...
                        </div>
                    ) : error || !data ? (
                        <div className="p-8 text-center text-red-600">Không thể tải chi tiết kết quả.</div>
                    ) : (
                        <>
                            <div className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 border-b border-gray-200">
                                <div className="flex flex-wrap items-center justify-between gap-4">
                                    <div>
                                        <p className="text-xl font-bold text-gray-900">{data.fullname}</p>
                                        <p className="text-sm text-gray-600 mt-1">
                                            {data.phone || '—'} · Lớp {data.class || '—'} · {data.groupName}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-3xl font-bold text-emerald-600">{data.percentage}%</div>
                                        <div className="text-sm text-gray-600">
                                            {data.totalPoint}/{data.maxPoints} điểm
                                        </div>
                                    </div>
                                </div>
                                {data.message && <p className="mt-3 text-sm text-gray-700">{data.message}</p>}
                            </div>

                            <GroupResultQuestionDetails questions={data.questionDetails} />
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

// ---- Edit points modal ----
function EditPointsModal({ result, onClose }: { result: ExamSetGroupResultDto; onClose: () => void }) {
    const [totalPoint, setTotalPoint] = useState<string>(String(result.totalPoint));
    const [maxPoints, setMaxPoints] = useState<string>(String(result.maxPoints));
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const updateMutation = useUpdateGroupResult();

    const handleSubmit = async () => {
        setErrorMessage(null);
        const tp = totalPoint.trim() === '' ? undefined : Number(totalPoint);
        const mp = maxPoints.trim() === '' ? undefined : Number(maxPoints);

        if (tp === undefined && mp === undefined) {
            setErrorMessage('Cần nhập ít nhất một trong hai trường.');
            return;
        }
        if ((tp !== undefined && (Number.isNaN(tp) || tp < 0)) || (mp !== undefined && (Number.isNaN(mp) || mp < 0))) {
            setErrorMessage('Điểm phải là số không âm.');
            return;
        }

        try {
            await updateMutation.mutateAsync({ resultId: result.id, totalPoint: tp, maxPoints: mp });
            onClose();
        } catch {
            setErrorMessage('Không thể cập nhật điểm. Vui lòng thử lại.');
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-md w-full">
                <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900">Sửa điểm</h3>
                    <p className="text-sm text-gray-500 mt-0.5">{result.fullname} · {result.groupName}</p>
                </div>

                <div className="p-6 space-y-4">
                    {errorMessage && (
                        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                            {errorMessage}
                        </div>
                    )}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Tổng điểm đạt được</label>
                        <input
                            type="number" min={0} step="any" value={totalPoint}
                            onChange={(e) => setTotalPoint(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Điểm tối đa</label>
                        <input
                            type="number" min={0} step="any" value={maxPoints}
                            onChange={(e) => setMaxPoints(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                        />
                    </div>
                </div>

                <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-200">
                    <button
                        onClick={onClose} disabled={updateMutation.isPending}
                        className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors font-medium disabled:opacity-50"
                    >
                        Hủy
                    </button>
                    <button
                        onClick={handleSubmit} disabled={updateMutation.isPending}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium disabled:opacity-50 flex items-center gap-2"
                    >
                        {updateMutation.isPending && (
                            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        )}
                        Lưu
                    </button>
                </div>
            </div>
        </div>
    );
}

// ---- Main panel ----
export default function ExamSetGroupResultsPanel() {
    const [examType, setExamType] = useState<ExamSetGroupExamType>(ExamSetGroupExamType.TSA);
    const [groupId, setGroupId] = useState<string>('');
    const [classFilter, setClassFilter] = useState<string>('');
    const [searchInput, setSearchInput] = useState<string>('');
    const [search, setSearch] = useState<string>('');
    const [page, setPage] = useState<number>(1);

    const [viewId, setViewId] = useState<string | null>(null);
    const [editResult, setEditResult] = useState<ExamSetGroupResultDto | null>(null);
    const [deleteResult, setDeleteResult] = useState<ExamSetGroupResultDto | null>(null);

    const { data: groups } = useExamSetGroups(examType);
    const deleteMutation = useDeleteGroupResult();

    const params = useMemo(() => ({
        groupId: groupId || undefined,
        class: classFilter.trim() || undefined,
        search: search.trim() || undefined,
        page,
        limit: PAGE_SIZE,
    }), [groupId, classFilter, search, page]);

    const { data, isLoading, isFetching } = useGroupResults(params);

    const total = data?.total ?? 0;
    const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
    const results = data?.data ?? [];

    const resetToFirstPage = () => setPage(1);

    const handleExamTypeChange = (t: ExamSetGroupExamType) => {
        setExamType(t);
        setGroupId('');
        resetToFirstPage();
    };

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSearch(searchInput);
        resetToFirstPage();
    };

    const handleConfirmDelete = async () => {
        if (!deleteResult) return;
        try {
            await deleteMutation.mutateAsync(deleteResult.id);
            setDeleteResult(null);
        } catch {
            // error logged in hook; keep modal open
        }
    };

    return (
        <div className="p-6 border-b border-gray-200">
            <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <span>🗂️</span>
                    Quản lý kết quả bài thi bộ đề
                </h2>
                <p className="text-gray-600 mt-1 text-sm">
                    Xem, sửa điểm và xóa bài nộp bộ đề gộp của học sinh. Xóa kết quả cho phép học sinh nộp lại bộ đề đó.
                </p>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap items-end gap-3 mb-5">
                <div className="flex p-1 bg-gray-100 rounded-xl w-fit">
                    {[ExamSetGroupExamType.TSA, ExamSetGroupExamType.HSA].map((t) => (
                        <button
                            key={t}
                            type="button"
                            onClick={() => handleExamTypeChange(t)}
                            className={`px-5 py-2 rounded-lg text-sm font-bold transition-all ${examType === t
                                ? 'bg-white text-green-600 shadow-sm'
                                : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            {t}
                        </button>
                    ))}
                </div>

                <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Bộ đề</label>
                    <select
                        value={groupId}
                        onChange={(e) => { setGroupId(e.target.value); resetToFirstPage(); }}
                        className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none min-w-[200px]"
                    >
                        <option value="">Tất cả bộ đề</option>
                        {groups?.map((g) => (
                            <option key={g.id} value={g.id}>{g.name}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Lớp</label>
                    <input
                        value={classFilter}
                        onChange={(e) => { setClassFilter(e.target.value); resetToFirstPage(); }}
                        placeholder="VD: 12A1"
                        className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none w-28"
                    />
                </div>

                <form onSubmit={handleSearchSubmit} className="flex items-end gap-2">
                    <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">Tìm kiếm</label>
                        <input
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            placeholder="Họ tên hoặc SĐT"
                            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none w-48"
                        />
                    </div>
                    <button
                        type="submit"
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-semibold"
                    >
                        Tìm
                    </button>
                </form>
            </div>

            {/* Table */}
            {isLoading ? (
                <div className="flex items-center gap-3 text-gray-500 py-12">
                    <div className="w-8 h-8 border-2 border-green-600 border-t-transparent rounded-full animate-spin" />
                    Đang tải kết quả...
                </div>
            ) : results.length === 0 ? (
                <p className="text-gray-500 py-10 text-center">Không có kết quả nào khớp bộ lọc.</p>
            ) : (
                <>
                    <div className="overflow-x-auto border border-gray-200 rounded-xl">
                        <table className="min-w-full divide-y divide-gray-200 text-sm">
                            <thead className="bg-gray-50">
                                <tr className="text-left text-gray-500">
                                    <th className="px-4 py-3 font-semibold">Học sinh</th>
                                    <th className="px-4 py-3 font-semibold">SĐT</th>
                                    <th className="px-4 py-3 font-semibold">Lớp</th>
                                    <th className="px-4 py-3 font-semibold">Bộ đề</th>
                                    <th className="px-4 py-3 font-semibold text-right">Điểm</th>
                                    <th className="px-4 py-3 font-semibold text-right">%</th>
                                    <th className="px-4 py-3 font-semibold">Nộp lúc</th>
                                    <th className="px-4 py-3 font-semibold text-right">Thao tác</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 bg-white">
                                {results.map((r) => (
                                    <tr key={r.id} className="hover:bg-gray-50">
                                        <td className="px-4 py-3 font-medium text-gray-900">{r.fullname}</td>
                                        <td className="px-4 py-3 text-gray-600">{r.phone || '—'}</td>
                                        <td className="px-4 py-3 text-gray-600">{r.class || '—'}</td>
                                        <td className="px-4 py-3 text-gray-600">{r.groupName}</td>
                                        <td className="px-4 py-3 text-right text-gray-900 whitespace-nowrap">
                                            {r.totalPoint}/{r.maxPoints}
                                        </td>
                                        <td className="px-4 py-3 text-right font-semibold text-emerald-600">{r.percentage}%</td>
                                        <td className="px-4 py-3 text-gray-500 whitespace-nowrap">{formatDate(r.createdAt)}</td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center justify-end gap-1.5">
                                                <button
                                                    onClick={() => setViewId(r.id)}
                                                    className="px-2.5 py-1.5 rounded-lg text-xs font-semibold text-blue-600 hover:bg-blue-50 transition-colors"
                                                    title="Xem chi tiết"
                                                >
                                                    Chi tiết
                                                </button>
                                                <button
                                                    onClick={() => setEditResult(r)}
                                                    className="px-2.5 py-1.5 rounded-lg text-xs font-semibold text-amber-600 hover:bg-amber-50 transition-colors"
                                                    title="Sửa điểm"
                                                >
                                                    Sửa điểm
                                                </button>
                                                <button
                                                    onClick={() => setDeleteResult(r)}
                                                    className="px-2.5 py-1.5 rounded-lg text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors"
                                                    title="Xóa"
                                                >
                                                    Xóa
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="flex items-center justify-between mt-4 text-sm">
                        <p className="text-gray-500">
                            Tổng <span className="font-semibold text-gray-700">{total}</span> kết quả
                            {isFetching && <span className="ml-2 text-gray-400">· đang cập nhật...</span>}
                        </p>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setPage((p) => Math.max(1, p - 1))}
                                disabled={page <= 1}
                                className="px-3 py-1.5 rounded-lg border border-gray-300 disabled:opacity-40 hover:bg-gray-50 transition-colors"
                            >
                                Trước
                            </button>
                            <span className="text-gray-600">Trang {page}/{totalPages}</span>
                            <button
                                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                                disabled={page >= totalPages}
                                className="px-3 py-1.5 rounded-lg border border-gray-300 disabled:opacity-40 hover:bg-gray-50 transition-colors"
                            >
                                Sau
                            </button>
                        </div>
                    </div>
                </>
            )}

            {/* Modals */}
            {viewId && <ResultDetailModal resultId={viewId} onClose={() => setViewId(null)} />}
            {editResult && <EditPointsModal result={editResult} onClose={() => setEditResult(null)} />}
            <DeleteConfirmModal
                isOpen={!!deleteResult}
                title="Xóa kết quả bài thi"
                message={deleteResult
                    ? `Xóa kết quả của "${deleteResult.fullname}" cho bộ đề "${deleteResult.groupName}"? Học sinh sẽ có thể nộp lại bộ đề này.`
                    : ''}
                onConfirm={handleConfirmDelete}
                onCancel={() => setDeleteResult(null)}
                isLoading={deleteMutation.isPending}
            />
        </div>
    );
}
