'use client';

import { useState, useEffect } from 'react';
import {
    useExamSetGroups,
    useCreateExamSetGroup,
    useUpdateExamSetGroup,
    useDeleteExamSetGroup,
    useExamSets,
    ExamSetGroupExamType,
    ExamSetGroupResponseDto,
    CreateExamSetGroupDto,
    UpdateExamSetGroupDto,
    ExamSetResponse,
    ExamSetType,
    ExamSetStatus
} from '@/hooks/useExam';

interface GroupManagementModalProps {
    onClose: () => void;
    onRefreshMainList?: () => void;
}

export default function GroupManagementModal({ onClose, onRefreshMainList }: GroupManagementModalProps) {
    const [activeTab, setActiveTab] = useState<ExamSetGroupExamType>(ExamSetGroupExamType.HSA);

    // Lazy load groups based on active tab
    const { data: groups, refetch: refetchGroups, isLoading: isLoadingGroups } = useExamSetGroups(activeTab);

    const createGroupMutation = useCreateExamSetGroup();
    const updateGroupMutation = useUpdateExamSetGroup();
    const deleteGroupMutation = useDeleteExamSetGroup();

    const [groupModal, setGroupModal] = useState<{
        isOpen: boolean;
        mode: 'create' | 'edit';
        group: ExamSetGroupResponseDto | null;
    }>({
        isOpen: false,
        mode: 'create',
        group: null,
    });

    const [deleteModal, setDeleteModal] = useState<{
        isOpen: boolean;
        group: ExamSetGroupResponseDto | null;
    }>({
        isOpen: false,
        group: null,
    });

    const isSubmitting = createGroupMutation.isPending || updateGroupMutation.isPending || deleteGroupMutation.isPending;

    const handleCreateGroup = async (data: CreateExamSetGroupDto) => {
        await createGroupMutation.mutateAsync(data);
        refetchGroups();
        onRefreshMainList?.();
    };

    const handleUpdateGroup = async (id: string, data: UpdateExamSetGroupDto) => {
        await updateGroupMutation.mutateAsync({ id, data });
        refetchGroups();
        onRefreshMainList?.();
    };

    const handleDeleteGroup = async (id: string) => {
        await deleteGroupMutation.mutateAsync(id);
        refetchGroups();
        onRefreshMainList?.();
    };

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 md:p-8 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-white relative z-10 shadow-sm">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                            <span className="p-2 bg-orange-100 text-orange-600 rounded-lg">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                </svg>
                            </span>
                            Quản lý Bộ đề thi (Exam Groups)
                        </h2>
                        <p className="text-gray-500 mt-1 ml-10">Tạo và tổ chức các bộ đề thi theo đợt thi HSA hoặc TSA</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-full transition-all text-gray-400 hover:text-gray-600 hover:rotate-90"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Tabs & Actions */}
                <div className="px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-50 bg-gray-50/30">
                    <div className="flex p-1 bg-gray-100 rounded-xl w-fit">
                        <button
                            onClick={() => setActiveTab(ExamSetGroupExamType.HSA)}
                            className={`px-8 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === ExamSetGroupExamType.HSA
                                    ? 'bg-white text-blue-600 shadow-sm'
                                    : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            HSA Groups
                        </button>
                        <button
                            onClick={() => setActiveTab(ExamSetGroupExamType.TSA)}
                            className={`px-8 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === ExamSetGroupExamType.TSA
                                    ? 'bg-white text-green-600 shadow-sm'
                                    : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            TSA Groups
                        </button>
                    </div>

                    <button
                        onClick={() => setGroupModal({ isOpen: true, mode: 'create', group: null })}
                        className="px-6 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all font-bold flex items-center justify-center shadow-lg shadow-blue-200/50 active:scale-95"
                    >
                        <span className="mr-2 text-xl">+</span> Tạo bộ đề mới
                    </button>
                </div>

                {/* Content Area */}
                <div className="flex-1 overflow-y-auto p-6 bg-gray-50/30">
                    {isLoadingGroups ? (
                        <div className="flex flex-col items-center justify-center py-20">
                            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
                            <p className="text-gray-500 font-medium">Đang tải danh sách bộ đề...</p>
                        </div>
                    ) : groups && groups.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {groups.map((group) => (
                                <div
                                    key={group.id}
                                    className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
                                >
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors truncate text-lg" title={group.name}>
                                                {group.name}
                                            </h3>
                                            <div className="flex items-center gap-2 mt-2">
                                                <span className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider ${group.type === ExamSetGroupExamType.HSA
                                                        ? 'bg-blue-50 text-blue-600 border border-blue-100'
                                                        : 'bg-green-50 text-green-600 border border-green-100'
                                                    }`}>
                                                    {group.type}
                                                </span>
                                                <span className="text-xs text-gray-400 font-medium">
                                                    • {group.examSets?.length || 0} đề thi
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex gap-1 ml-2 shrink-0">
                                            <button
                                                onClick={() => setGroupModal({ isOpen: true, mode: 'edit', group })}
                                                className="p-2 text-orange-600 hover:bg-orange-50 rounded-xl transition-colors"
                                                title="Chỉnh sửa"
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                </svg>
                                            </button>
                                            <button
                                                onClick={() => setDeleteModal({ isOpen: true, group })}
                                                className="p-2 text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                                                title="Xóa"
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>

                                    <div className="bg-gray-50 rounded-xl p-3 mb-4">
                                        <p className="text-sm text-gray-600 line-clamp-2 h-10 italic">
                                            {group.description || 'Không có mô tả cho bộ đề này'}
                                        </p>
                                    </div>

                                    <div className="flex flex-wrap gap-1.5 min-h-[30px]">
                                        {(group.examSets || []).slice(0, 4).map((exam) => (
                                            <div
                                                key={exam.id}
                                                className="px-2 py-1 bg-white border border-gray-100 rounded-lg text-[10px] font-medium text-gray-500 shadow-sm"
                                                title={exam.name}
                                            >
                                                {exam.name.length > 15 ? exam.name.substring(0, 15) + '...' : exam.name}
                                            </div>
                                        ))}
                                        {(group.examSets || []).length > 4 && (
                                            <div className="px-2 py-1 bg-gray-100 rounded-lg text-[10px] font-bold text-gray-400">
                                                +{(group.examSets || []).length - 4}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-32 bg-white rounded-3xl border-2 border-dashed border-gray-100">
                            <div className="text-6xl mb-6 grayscale opacity-50">📂</div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Chưa có bộ đề {activeTab} nào</h3>
                            <p className="text-gray-500 max-w-xs text-center mb-8">
                                Nhấn nút "Tạo bộ đề mới" để bắt đầu nhóm các bài thi của bạn lại với nhau.
                            </p>
                            <button
                                onClick={() => setGroupModal({ isOpen: true, mode: 'create', group: null })}
                                className="px-8 py-3 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition-all font-bold"
                            >
                                + Tạo bộ đề đầu tiên
                            </button>
                        </div>
                    )}
                </div>

                {/* Footer Status */}
                <div className="p-4 px-6 bg-white border-t border-gray-100 flex items-center justify-between text-xs text-gray-400 font-medium">
                    <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-green-500"></span>
                            Hệ thống hoạt động bình thường
                        </span>
                        <span>•</span>
                        <span>Tổng số: {groups?.length || 0} bộ đề</span>
                    </div>
                </div>

                {/* Sub-Modals */}
                {groupModal.isOpen && (
                    <GroupFormModal
                        mode={groupModal.mode}
                        group={groupModal.group}
                        onClose={() => setGroupModal({ isOpen: false, mode: 'create', group: null })}
                        onSubmit={async (data) => {
                            if (groupModal.mode === 'create') {
                                await handleCreateGroup(data as CreateExamSetGroupDto);
                            } else {
                                await handleUpdateGroup(groupModal.group!.id, data as UpdateExamSetGroupDto);
                            }
                            setGroupModal({ isOpen: false, mode: 'create', group: null });
                        }}
                        isSubmitting={isSubmitting}
                    />
                )}

                {deleteModal.isOpen && (
                    <DeleteConfirmModal
                        title="Xác nhận xóa bộ đề"
                        message={`Bạn có chắc chắn muốn xóa bộ đề "${deleteModal.group?.name}"? Các bài thi bên trong sẽ KHÔNG bị xóa mà chỉ được tách ra khỏi nhóm.`}
                        onClose={() => setDeleteModal({ isOpen: false, group: null })}
                        onConfirm={async () => {
                            if (deleteModal.group) {
                                await handleDeleteGroup(deleteModal.group.id);
                                setDeleteModal({ isOpen: false, group: null });
                            }
                        }}
                        isSubmitting={isSubmitting}
                    />
                )}
            </div>
        </div>
    );
}

// Internal Sub-components for GroupManagementModal

function GroupFormModal({
    mode,
    group,
    onClose,
    onSubmit,
    isSubmitting,
}: {
    mode: 'create' | 'edit';
    group: ExamSetGroupResponseDto | null;
    onClose: () => void;
    onSubmit: (data: CreateExamSetGroupDto | UpdateExamSetGroupDto) => Promise<void>;
    isSubmitting: boolean;
}) {
    const [formData, setFormData] = useState<CreateExamSetGroupDto>({
        name: group?.name || '',
        description: group?.description || '',
        type: (group?.type as any) || ExamSetGroupExamType.HSA,
        examSetIds: (group?.examSets as any)?.map((e: any) => e.id) || [],
    });

    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');

    useEffect(() => {
        const timer = setTimeout(() => setDebouncedSearch(searchTerm), 500);
        return () => clearTimeout(timer);
    }, [searchTerm]);

    // Map Group type to ExamSet type
    const examSetType = formData.type as unknown as ExamSetType;
    const { data: searchedExamSets, isLoading: isSearching } = useExamSets(examSetType, undefined, undefined, debouncedSearch);

    // Also include currently selected exam sets in the list if not present in search results
    const [selectedExamSets, setSelectedExamSets] = useState<ExamSetResponse[]>((group?.examSets as any) || []);

    const combinedExamSets = debouncedSearch ? (searchedExamSets || []) : selectedExamSets;

    const toggleExamSelection = (exam: ExamSetResponse) => {
        setFormData(prev => {
            const currentIds = prev.examSetIds || [];
            if (currentIds.includes(exam.id)) {
                return { ...prev, examSetIds: currentIds.filter(id => id !== exam.id) };
            } else {
                if (!selectedExamSets.find(e => e.id === exam.id)) {
                    setSelectedExamSets(prevSets => [...prevSets, exam]);
                }
                return { ...prev, examSetIds: [...currentIds, exam.id] };
            }
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await onSubmit(formData);
    };

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[60] p-4 backdrop-blur-md animate-in fade-in duration-200">
            <div className="bg-white rounded-[2rem] shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in slide-in-from-bottom-8 duration-300">
                <div className="p-8 pb-4 border-b border-gray-100 flex items-center justify-between">
                    <div>
                        <h3 className="text-2xl font-black text-gray-900">
                            {mode === 'create' ? 'Tạo bộ đề mới' : 'Chỉnh sửa bộ đề'}
                        </h3>
                        <p className="text-gray-400 mt-1 text-sm">Điền thông tin và chọn các bài thi cho nhóm này</p>
                    </div>
                    <button onClick={onClose} className="p-2 bg-gray-50 text-gray-400 hover:text-gray-600 rounded-full transition-all">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-8 space-y-8 scrollbar-hide">
                    <div className="space-y-6">
                        <div className="group">
                            <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">Tên bộ đề <span className="text-red-500">*</span></label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full px-5 py-4 bg-gray-50 border-transparent rounded-[1.25rem] focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none text-lg font-medium"
                                placeholder="VD: Đề thi HSA đợt 1 - Năm 2026"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">Mô tả</label>
                            <textarea
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                className="w-full px-5 py-4 bg-gray-50 border-transparent rounded-[1.25rem] focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all outline-none h-32 resize-none"
                                placeholder="Nhập mô tả chi tiết về bộ đề này..."
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-3 ml-1">Loại kỳ thi <span className="text-red-500">*</span></label>
                            <div className="grid grid-cols-2 gap-4">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setFormData({ ...formData, type: ExamSetGroupExamType.HSA, examSetIds: [] });
                                        setSelectedExamSets([]);
                                    }}
                                    className={`px-6 py-4 rounded-2xl border-2 font-black transition-all flex items-center justify-center gap-3 ${formData.type === ExamSetGroupExamType.HSA
                                        ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-200'
                                        : 'bg-white border-gray-100 text-gray-400 hover:border-gray-200 hover:bg-gray-50'
                                        }`}
                                >
                                    <span className={`w-3 h-3 rounded-full ${formData.type === ExamSetGroupExamType.HSA ? 'bg-white' : 'bg-blue-400'}`}></span>
                                    HSA
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setFormData({ ...formData, type: ExamSetGroupExamType.TSA, examSetIds: [] });
                                        setSelectedExamSets([]);
                                    }}
                                    className={`px-6 py-4 rounded-2xl border-2 font-black transition-all flex items-center justify-center gap-3 ${formData.type === ExamSetGroupExamType.TSA
                                        ? 'bg-green-600 border-green-600 text-white shadow-lg shadow-green-200'
                                        : 'bg-white border-gray-100 text-gray-400 hover:border-gray-200 hover:bg-gray-50'
                                        }`}
                                >
                                    <span className={`w-3 h-3 rounded-full ${formData.type === ExamSetGroupExamType.TSA ? 'bg-white' : 'bg-green-400'}`}></span>
                                    TSA
                                </button>
                            </div>
                        </div>

                        <div className="pt-4 border-t border-gray-50">
                            <div className="flex items-center justify-between mb-4">
                                <label className="text-lg font-black text-gray-900">Danh sách đề thi</label>
                                <span className="px-4 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-black ring-1 ring-blue-100">
                                    {formData.examSetIds?.length || 0} bài đã chọn
                                </span>
                            </div>

                            <div className="relative mb-4 group">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </span>
                                <input
                                    type="text"
                                    placeholder="Tìm kiếm bài thi nhanh..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-12 pr-6 py-4 bg-gray-50 border-transparent rounded-2xl focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-medium"
                                />
                            </div>

                            <div className="border border-gray-100 rounded-[1.5rem] bg-gray-50/50 p-2 max-h-72 overflow-y-auto space-y-2 scrollbar-hide">
                                {isSearching ? (
                                    <div className="flex flex-col items-center justify-center py-10 scale-90 opacity-60">
                                        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-3"></div>
                                        <p className="text-sm font-bold text-gray-500">Đang tìm tài liệu...</p>
                                    </div>
                                ) : combinedExamSets.length > 0 ? (
                                    combinedExamSets.map((exam) => {
                                        const isSelected = formData.examSetIds?.includes(exam.id);
                                        return (
                                            <div
                                                key={exam.id}
                                                onClick={() => toggleExamSelection(exam)}
                                                className={`flex items-center p-4 rounded-2xl cursor-pointer transition-all border-2 ${isSelected
                                                    ? 'bg-white border-blue-500 shadow-md shadow-blue-100 scale-[1.01]'
                                                    : 'bg-white border-transparent hover:border-gray-200'
                                                    }`}
                                            >
                                                <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center mr-4 transition-all ${isSelected ? 'bg-blue-600 border-blue-600 text-white scale-110 shadow-lg shadow-blue-200' : 'bg-gray-100 border-gray-200'
                                                    }`}>
                                                    {isSelected && <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"></path></svg>}
                                                </div>
                                                <div className="flex-1">
                                                    <p className={`font-bold transition-colors ${isSelected ? 'text-blue-600' : 'text-gray-900'}`}>{exam.name}</p>
                                                    <div className="flex items-center gap-3 mt-1">
                                                        <span className="text-[10px] font-bold text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded uppercase">Năm {exam.year}</span>
                                                        <span className="text-[10px] font-bold text-blue-400 bg-blue-50 px-1.5 py-0.5 rounded uppercase">Khối {exam.grade}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })
                                ) : (
                                    <div className="text-center py-12 text-gray-400 font-medium">
                                        <div className="text-3xl mb-2 grayscale opacity-40">🔍</div>
                                        Không tìm thấy bài thi nào phù hợp
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </form>

                <div className="p-8 pt-4 border-t border-gray-100 flex justify-end gap-4 bg-white">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-8 py-4 text-gray-400 font-bold hover:bg-gray-50 rounded-2xl transition-all active:scale-95"
                    >
                        Hủy bỏ
                    </button>
                    <button
                        type="submit"
                        onClick={handleSubmit}
                        disabled={isSubmitting || !formData.name}
                        className="px-10 py-4 bg-blue-600 text-white font-black rounded-2xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-200 active:scale-95 disabled:opacity-30 disabled:shadow-none flex items-center"
                    >
                        {isSubmitting ? (
                            <>
                                <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
                                Đang xử lý...
                            </>
                        ) : (
                            mode === 'create' ? 'Tạo mới bộ đề' : 'Lưu thay đổi'
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}

function DeleteConfirmModal({
    title,
    message,
    onClose,
    onConfirm,
    isSubmitting
}: {
    title: string;
    message: string;
    onClose: () => void;
    onConfirm: () => void;
    isSubmitting: boolean;
}) {
    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[70] p-4 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-[2rem] p-10 max-w-md w-full shadow-2xl border border-red-50 animate-in slide-in-from-bottom-4 duration-300">
                <div className="flex flex-col items-center text-center">
                    <div className="w-20 h-20 bg-red-50 rounded-3xl flex items-center justify-center mb-6 animate-pulse">
                        <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                    </div>

                    <h3 className="text-2xl font-black text-gray-900 mb-3">{title}</h3>
                    <p className="text-gray-500 leading-relaxed font-medium mb-8">
                        {message}
                        <br />
                        <span className="text-red-500/60 text-sm mt-2 block italic font-bold">Hành động này không thể hoàn tác</span>
                    </p>

                    <div className="flex flex-col w-full gap-3">
                        <button
                            onClick={onConfirm}
                            disabled={isSubmitting}
                            className="w-full py-4 bg-red-500 text-white rounded-2xl hover:bg-red-600 font-black transition-all shadow-xl shadow-red-100 active:scale-95 disabled:opacity-50"
                        >
                            {isSubmitting ? 'Đang thực hiện xóa...' : 'Vẫn muốn xóa'}
                        </button>
                        <button
                            onClick={onClose}
                            disabled={isSubmitting}
                            className="w-full py-4 text-gray-400 font-bold hover:bg-gray-50 rounded-2xl transition-all active:scale-95"
                        >
                            Thoát
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
