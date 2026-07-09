'use client';

import { useState } from 'react';
import { ExamSetDetailResponse } from '@/hooks/useExam';
import { getSubjectInfo } from '@/app/thi-hsa-tsa/utils';

interface ExamSetPasswordGateProps {
    /** Tên môn / phần hiển thị ở tiêu đề (VD: "Lý - Hóa - Sinh") */
    sectionTitle: string;
    /** Các bài (exam set) trong phần này đang bị khóa, cần nhập mật khẩu */
    lockedExams: ExamSetDetailResponse[];
    /** Gọi khi một bài được mở khóa thành công */
    onUnlock: (examId: string) => void;
}

/**
 * Màn chặn nhập mật khẩu cho từng bài (exam set) trong bộ đề.
 * So khớp cục bộ ở FE với `exam.password` trả về từ API.
 */
export default function ExamSetPasswordGate({
    sectionTitle,
    lockedExams,
    onUnlock,
}: ExamSetPasswordGateProps) {
    const [inputs, setInputs] = useState<{ [examId: string]: string }>({});
    const [errors, setErrors] = useState<{ [examId: string]: boolean }>({});

    const handleSubmit = (exam: ExamSetDetailResponse) => {
        const value = (inputs[exam.id] || '').trim();
        if (value.length === 0) {
            setErrors(prev => ({ ...prev, [exam.id]: true }));
            return;
        }
        if (value === (exam.password ?? '')) {
            setErrors(prev => ({ ...prev, [exam.id]: false }));
            onUnlock(exam.id);
        } else {
            setErrors(prev => ({ ...prev, [exam.id]: true }));
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-16">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
                <div className="text-center mb-6">
                    <div className="text-5xl mb-3">🔒</div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-1">Phần thi bị khóa</h1>
                    <p className="text-gray-600">
                        Nhập mật khẩu để làm phần <span className="font-semibold">{sectionTitle}</span>
                    </p>
                </div>

                <div className="space-y-5">
                    {lockedExams.map((exam) => {
                        const showSubjectLabel = lockedExams.length > 1;
                        const subjectName = getSubjectInfo(exam.subject).name;
                        return (
                            <form
                                key={exam.id}
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    handleSubmit(exam);
                                }}
                            >
                                {showSubjectLabel && (
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                                        {subjectName}
                                    </label>
                                )}
                                <div className="flex gap-2">
                                    <input
                                        type="password"
                                        autoFocus={!showSubjectLabel}
                                        value={inputs[exam.id] || ''}
                                        onChange={(e) => {
                                            setInputs(prev => ({ ...prev, [exam.id]: e.target.value }));
                                            if (errors[exam.id]) {
                                                setErrors(prev => ({ ...prev, [exam.id]: false }));
                                            }
                                        }}
                                        placeholder="Nhập mật khẩu"
                                        className={`flex-1 px-4 py-2.5 border rounded-lg outline-none focus:ring-2 ${errors[exam.id]
                                            ? 'border-red-400 focus:ring-red-400'
                                            : 'border-gray-300 focus:ring-green-500 focus:border-green-500'
                                            }`}
                                    />
                                    <button
                                        type="submit"
                                        className="px-5 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold whitespace-nowrap"
                                    >
                                        Mở khóa
                                    </button>
                                </div>
                                {errors[exam.id] && (
                                    <p className="mt-1.5 text-sm text-red-600">Mật khẩu không đúng. Vui lòng thử lại.</p>
                                )}
                            </form>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
