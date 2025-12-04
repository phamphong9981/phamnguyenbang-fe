'use client';

import { useState } from 'react';
import { useExamSetGroups, useExamSetGroup, ExamSetGroupResponseDto, ExamSetGroupType } from '@/hooks/useExam';
import { getSubjectInfo } from '@/app/thi-hsa-tsa/utils';

interface ExamSetGroupModalProps {
    isOpen: boolean;
    onClose: () => void;
    onStartGroupExam: (group: ExamSetGroupResponseDto) => void;
}

export default function ExamSetGroupModal({ isOpen, onClose, onStartGroupExam }: ExamSetGroupModalProps) {
    const [selectedType, setSelectedType] = useState<ExamSetGroupType | null>(null);
    const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
    const { data: examSetGroups, isLoading: isLoadingGroups } = useExamSetGroups();
    const { data: selectedGroup, isLoading: isLoadingSelectedGroup } = useExamSetGroup(
        selectedGroupId || '',
        selectedType || ExamSetGroupType.TO_HOP_1
    );

    const getDifficultyColor = (d: string) =>
        d === 'Dễ' ? 'bg-green-100 text-green-800'
            : d === 'Trung bình' ? 'bg-yellow-100 text-yellow-800'
                : d === 'Khó' ? 'bg-orange-100 text-orange-800'
                    : d === 'Rất khó' ? 'bg-red-100 text-red-800'
                        : 'bg-gray-100 text-gray-800';

    const handleStartGroupExam = () => {
        if (!selectedGroup || !selectedGroup.examSets || selectedGroup.examSets.length === 0) return;

        // Pass the entire group (not flattened)
        onStartGroupExam(selectedGroup);
        onClose();
        setSelectedGroupId(null);
        setSelectedType(null);
    };

    const handleClose = () => {
        onClose();
        setSelectedGroupId(null);
        setSelectedType(null);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
            <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-4 text-center sm:p-0">
                {/* Background overlay */}
                <div
                    className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
                    onClick={handleClose}
                ></div>

                {/* Modal panel */}
                <div className="inline-block align-middle bg-white rounded-xl text-left overflow-hidden shadow-xl transform transition-all w-full max-w-lg sm:max-w-xl relative z-10">
                    <div className="bg-white px-6 pt-6 pb-4">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                                {selectedGroupId && (
                                    <button
                                        onClick={() => setSelectedGroupId(null)}
                                        className="text-gray-500 hover:text-gray-700 transition-colors"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                        </svg>
                                    </button>
                                )}
                                <h3 className="text-xl font-bold text-gray-900" id="modal-title">
                                    {selectedGroupId ? (selectedGroup?.name || 'Đang tải...') : selectedType ? '📚 Bộ đề hoàn chỉnh' : '📚 Bộ đề hoàn chỉnh'}
                                </h3>
                            </div>
                            <button
                                onClick={handleClose}
                                className="text-gray-400 hover:text-gray-500 focus:outline-none transition-colors"
                            >
                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {!selectedType ? (
                            // Chọn loại bài thi
                            <>
                                <p className="text-sm text-gray-600 mb-4">
                                    Chọn loại bài thi bạn muốn làm:
                                </p>
                                <div className="grid grid-cols-1 gap-3">
                                    <button
                                        onClick={() => setSelectedType(ExamSetGroupType.TO_HOP_1)}
                                        className="w-full text-left bg-gradient-to-r from-blue-50 to-cyan-50 hover:from-blue-100 hover:to-cyan-100 rounded-lg p-6 border-2 border-blue-200 hover:border-blue-400 transition-all group"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center text-white text-xl font-bold">
                                                🔬
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="text-lg font-bold text-gray-900 group-hover:text-blue-700 mb-1">
                                                    Tổ hợp Toán-Văn-Anh
                                                </h4>
                                                <p className="text-sm text-gray-600">
                                                    Toán, Ngữ văn, Anh
                                                </p>
                                            </div>
                                            <svg className="w-6 h-6 text-blue-500 group-hover:text-blue-700 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </svg>
                                        </div>
                                    </button>
                                    <button
                                        onClick={() => setSelectedType(ExamSetGroupType.TO_HOP_2)}
                                        className="w-full text-left bg-gradient-to-r from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100 rounded-lg p-6 border-2 border-purple-200 hover:border-purple-400 transition-all group"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white text-xl font-bold">
                                                📚
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="text-lg font-bold text-gray-900 group-hover:text-purple-700 mb-1">
                                                    Tổ hợp Tự nhiên
                                                </h4>
                                                <p className="text-sm text-gray-600">
                                                    Toán, Ngữ Văn, Lý, Hóa, Sinh
                                                </p>
                                            </div>
                                            <svg className="w-6 h-6 text-purple-500 group-hover:text-purple-700 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </svg>
                                        </div>
                                    </button>
                                </div>
                            </>
                        ) : !selectedGroupId ? (
                            // Danh sách các bộ đề
                            <>
                                <div className="mb-4 flex items-center gap-2">
                                    <button
                                        onClick={() => setSelectedType(null)}
                                        className="text-gray-500 hover:text-gray-700 transition-colors"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                        </svg>
                                    </button>
                                    <span className="text-sm font-medium text-gray-700">
                                        {selectedType === ExamSetGroupType.TO_HOP_1 ? 'Tổ hợp Toán-Văn-Anh' : 'Tổ hợp Tự nhiên'}
                                    </span>
                                </div>
                                <p className="text-sm text-gray-600 mb-4">
                                    Chọn bộ đề hoàn chỉnh gồm đầy đủ các môn học.
                                </p>
                                {isLoadingGroups ? (
                                    <div className="flex items-center justify-center py-12">
                                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-600"></div>
                                    </div>
                                ) : examSetGroups && examSetGroups.length > 0 ? (
                                    <div className="space-y-2 max-h-[60vh] overflow-y-auto">
                                        {examSetGroups.map((group) => (
                                            <button
                                                key={group.id}
                                                onClick={() => setSelectedGroupId(group.id)}
                                                className="w-full text-left bg-gray-50 hover:bg-purple-50 rounded-lg p-4 border border-gray-200 hover:border-purple-300 transition-all group"
                                            >
                                                <div className="flex items-center justify-between">
                                                    <div className="flex-1 min-w-0">
                                                        <h4 className="text-base font-semibold text-gray-900 group-hover:text-purple-600">
                                                            {group.name}
                                                        </h4>
                                                        {group.description && (
                                                            <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                                                                {group.description}
                                                            </p>
                                                        )}
                                                    </div>
                                                    <svg className="w-5 h-5 text-gray-400 group-hover:text-purple-600 transition-colors flex-shrink-0 ml-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                    </svg>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-12">
                                        <div className="text-gray-400 text-5xl mb-3">📦</div>
                                        <h3 className="text-lg font-semibold text-gray-600 mb-1">Chưa có bộ đề hoàn chỉnh</h3>
                                        <p className="text-sm text-gray-500">Hiện tại chưa có bộ đề nào được tạo.</p>
                                    </div>
                                )}
                            </>
                        ) : (
                            // Chi tiết bộ đề đã chọn
                            <>
                                {isLoadingSelectedGroup ? (
                                    <div className="flex items-center justify-center py-12">
                                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-600"></div>
                                    </div>
                                ) : selectedGroup && selectedGroup.examSets && selectedGroup.examSets.length > 0 ? (
                                    <>
                                        <div className="mb-4 p-3 bg-purple-50 rounded-lg border border-purple-200">
                                            <p className="text-sm text-gray-700">
                                                Bộ đề này gồm <span className="font-semibold">{selectedGroup.examSets.length} đề thi</span> từ các môn học khác nhau.
                                                Mỗi đề thi sẽ được hiển thị trong một section riêng.
                                            </p>
                                        </div>
                                        <div className="space-y-2 max-h-[50vh] overflow-y-auto mb-4">
                                            {selectedGroup.examSets.map((exam) => {
                                                const subjectInfo = getSubjectInfo(exam.subject);
                                                const questionCount = exam.examQuestions?.length || 0;
                                                return (
                                                    <div
                                                        key={exam.id}
                                                        className="w-full text-left bg-gray-50 rounded-lg p-3 border border-gray-200"
                                                    >
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <span className={`w-2 h-2 rounded-full flex-shrink-0 ${subjectInfo.dot}`} />
                                                            <span className="text-xs font-medium text-gray-500">{subjectInfo.name}</span>
                                                        </div>
                                                        <h6 className="text-sm font-semibold text-gray-900">
                                                            {exam.name}
                                                        </h6>
                                                        <div className="flex items-center gap-2 mt-1">
                                                            <span className={`px-1.5 py-0.5 text-xs font-semibold rounded ${getDifficultyColor(exam.difficulty)}`}>
                                                                {exam.difficulty ?? '—'}
                                                            </span>
                                                            <span className="text-xs text-gray-500">{exam.duration}</span>
                                                            <span className="text-xs text-gray-500">• {questionCount} câu</span>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                        <button
                                            onClick={handleStartGroupExam}
                                            className="w-full py-3 px-4 rounded-lg font-semibold bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-700 hover:to-indigo-700 transition-all shadow-lg"
                                        >
                                            Bắt đầu làm bài (Tất cả câu hỏi)
                                        </button>
                                    </>
                                ) : (
                                    <div className="text-center py-8 text-sm text-gray-500">
                                        Chưa có đề thi trong bộ đề này
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

