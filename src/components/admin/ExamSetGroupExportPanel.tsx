'use client';

import { useState } from 'react';
import {
    ExamSetGroupExamType,
    ExamSetGroupResponseDto,
    useExamSetGroups,
} from '@/hooks/useExam';
import { useExportExamSetGroupExcel } from '@/hooks/useAdmin';

export default function ExamSetGroupExportPanel() {
    const [activeTab, setActiveTab] = useState<ExamSetGroupExamType>(ExamSetGroupExamType.TSA);
    const [exportingGroupId, setExportingGroupId] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const { data: groups, isLoading } = useExamSetGroups(activeTab);
    const exportMutation = useExportExamSetGroupExcel();

    const handleExport = async (group: ExamSetGroupResponseDto) => {
        setErrorMessage(null);
        setExportingGroupId(group.id);
        try {
            await exportMutation.mutateAsync({ groupId: group.id, groupName: group.name });
        } catch {
            setErrorMessage(`Không thể xuất Excel cho "${group.name}". Vui lòng thử lại.`);
        } finally {
            setExportingGroupId(null);
        }
    };

    return (
        <div className="p-6 border-b border-gray-200">
            <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <span>📥</span>
                    Xuất Excel bài nộp đề gộp
                </h2>
                <p className="text-gray-600 mt-1 text-sm">
                    Tải file Excel gồm 3 sheet (Toán, Văn, Khoa học) — mỗi dòng là một câu đã nộp của học sinh,
                    kèm đáp án, đúng/sai, điểm và thời gian làm từng câu (nếu có).
                </p>
            </div>

            <div className="flex p-1 bg-gray-100 rounded-xl w-fit mb-6">
                <button
                    type="button"
                    onClick={() => setActiveTab(ExamSetGroupExamType.TSA)}
                    className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === ExamSetGroupExamType.TSA
                        ? 'bg-white text-green-600 shadow-sm'
                        : 'text-gray-500 hover:text-gray-700'
                        }`}
                >
                    TSA
                </button>
                <button
                    type="button"
                    onClick={() => setActiveTab(ExamSetGroupExamType.HSA)}
                    className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === ExamSetGroupExamType.HSA
                        ? 'bg-white text-blue-600 shadow-sm'
                        : 'text-gray-500 hover:text-gray-700'
                        }`}
                >
                    HSA
                </button>
            </div>

            {errorMessage && (
                <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {errorMessage}
                </div>
            )}

            {isLoading ? (
                <div className="flex items-center gap-3 text-gray-500 py-8">
                    <div className="w-8 h-8 border-2 border-green-600 border-t-transparent rounded-full animate-spin" />
                    Đang tải danh sách bộ đề...
                </div>
            ) : groups && groups.length > 0 ? (
                <div className="space-y-3">
                    {groups.map((group) => {
                        const isExporting = exportingGroupId === group.id;
                        return (
                            <div
                                key={group.id}
                                className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border border-gray-200 bg-gray-50/50 px-4 py-4"
                            >
                                <div className="min-w-0 flex-1">
                                    <p className="font-semibold text-gray-900 truncate">{group.name}</p>
                                    <p className="text-sm text-gray-500 mt-0.5">
                                        {group.examSets?.length || 0} đề trong nhóm
                                        {group.description ? ` · ${group.description}` : ''}
                                    </p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => handleExport(group)}
                                    disabled={isExporting || exportMutation.isPending}
                                    className="shrink-0 px-5 py-2.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors font-semibold text-sm flex items-center justify-center gap-2"
                                >
                                    {isExporting ? (
                                        <>
                                            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                            Đang xuất...
                                        </>
                                    ) : (
                                        <>
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                            </svg>
                                            Xuất Excel
                                        </>
                                    )}
                                </button>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <p className="text-gray-500 py-6 text-center">
                    Chưa có bộ đề {activeTab} nào. Tạo bộ đề trong tab Quản lý bài thi → Quản lý bộ đề.
                </p>
            )}
        </div>
    );
}
