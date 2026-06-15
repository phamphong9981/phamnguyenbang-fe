'use client';

import {
    ACCESSIBLE_EXAM_TYPE_OPTIONS,
    AccessibleExamType,
    DEFAULT_ACCESSIBLE_EXAM_TYPES,
} from '@/utils/examAccess';

interface AccessibleExamTypesFieldProps {
    value: AccessibleExamType[];
    onChange: (types: AccessibleExamType[]) => void;
    error?: string;
}

export default function AccessibleExamTypesField({
    value,
    onChange,
    error,
}: AccessibleExamTypesFieldProps) {
    const toggleType = (type: AccessibleExamType) => {
        if (value.includes(type)) {
            if (value.length === 1) return;
            onChange(value.filter(item => item !== type));
            return;
        }
        onChange([...value, type]);
    };

    const selectAll = () => onChange([...DEFAULT_ACCESSIBLE_EXAM_TYPES]);

    return (
        <div>
            <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">
                    Loại đề được phép truy cập
                </label>
                <button
                    type="button"
                    onClick={selectAll}
                    className="text-xs font-medium text-green-700 hover:text-green-800"
                >
                    Chọn cả 3
                </button>
            </div>
            <p className="text-xs text-gray-500 mb-3">
                Học sinh chỉ thấy và mở được các loại đề được chọn. Mặc định là cả HSA, TSA và đề chương.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {ACCESSIBLE_EXAM_TYPE_OPTIONS.map(option => {
                    const checked = value.includes(option.value);
                    return (
                        <label
                            key={option.value}
                            className={`flex items-center gap-3 rounded-lg border px-4 py-3 cursor-pointer transition-colors ${
                                checked
                                    ? 'border-green-300 bg-green-50'
                                    : 'border-gray-200 bg-white hover:bg-gray-50'
                            }`}
                        >
                            <input
                                type="checkbox"
                                checked={checked}
                                onChange={() => toggleType(option.value)}
                                className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                            />
                            <span className="text-sm font-medium text-gray-800">{option.label}</span>
                        </label>
                    );
                })}
            </div>
            {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
        </div>
    );
}
