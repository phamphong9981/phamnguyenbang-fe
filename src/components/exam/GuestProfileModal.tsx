'use client';

import { useState } from 'react';
import { GuestProfileDto } from '@/hooks/useExam';

interface GuestProfileModalProps {
    isOpen: boolean;
    onConfirm: (profile: GuestProfileDto) => void;
    onCancel: () => void;
}

const CURRENT_YEAR = new Date().getFullYear();

export default function GuestProfileModal({ isOpen, onConfirm, onCancel }: GuestProfileModalProps) {
    const [form, setForm] = useState<GuestProfileDto>({
        fullname: '',
        phone: '',
        school: '',
        yearOfBirth: CURRENT_YEAR - 17,
    });
    const [errors, setErrors] = useState<Record<string, string>>({});

    if (!isOpen) return null;

    const validate = (): boolean => {
        const e: Record<string, string> = {};
        if (!form.fullname.trim()) e.fullname = 'Vui lòng nhập họ tên';
        if (!form.phone.trim()) e.phone = 'Vui lòng nhập số điện thoại';
        if (!form.school.trim()) e.school = 'Vui lòng nhập trường';
        if (!form.yearOfBirth || form.yearOfBirth < 1990 || form.yearOfBirth > CURRENT_YEAR)
            e.yearOfBirth = 'Năm sinh không hợp lệ';
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validate()) onConfirm(form);
    };

    const field = (
        id: keyof GuestProfileDto,
        label: string,
        type: string = 'text',
        placeholder: string = '',
        extra?: React.InputHTMLAttributes<HTMLInputElement>
    ) => (
        <div className="flex flex-col gap-1">
            <label htmlFor={id} className="text-sm font-semibold text-gray-700">{label}</label>
            <input
                id={id}
                type={type}
                placeholder={placeholder}
                value={form[id] as string | number}
                onChange={e => setForm(prev => ({ ...prev, [id]: type === 'number' ? Number(e.target.value) : e.target.value }))}
                className={`w-full px-3 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition
                    ${errors[id] ? 'border-red-400 bg-red-50' : 'border-gray-300 bg-white'}`}
                {...extra}
            />
            {errors[id] && <p className="text-xs text-red-500 mt-0.5">{errors[id]}</p>}
        </div>
    );

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-blue-500 px-6 py-5 text-white">
                    <div className="flex items-center gap-3 mb-1">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 opacity-90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <h2 className="text-lg font-bold">Thông tin thí sinh</h2>
                    </div>
                    <p className="text-blue-100 text-sm">Vui lòng điền thông tin trước khi bắt đầu làm bài</p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
                    {field('fullname', 'Họ và tên', 'text', 'Nguyễn Văn A', { autoFocus: true })}
                    {field('phone', 'Số điện thoại', 'tel', '0912 345 678')}
                    {field('school', 'Trường học', 'text', 'THPT...')}
                    {field('yearOfBirth', 'Năm sinh', 'number', String(CURRENT_YEAR - 17), { min: 1990, max: CURRENT_YEAR })}

                    <div className="flex gap-3 mt-2">
                        <button
                            type="button"
                            onClick={onCancel}
                            className="flex-1 py-2.5 rounded-xl border border-gray-300 text-gray-600 font-semibold text-sm hover:bg-gray-50 transition"
                        >
                            Hủy
                        </button>
                        <button
                            type="submit"
                            className="flex-1 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-sm hover:bg-blue-700 transition shadow-lg shadow-blue-600/20"
                        >
                            Bắt đầu làm bài →
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
