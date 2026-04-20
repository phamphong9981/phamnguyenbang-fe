'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useProfile, useUpdateProfile } from '@/hooks/userUser';

// ── Types ─────────────────────────────────────────────────────────────────────

type Tab = 'info' | 'password';

// ── Error helper ──────────────────────────────────────────────────────────────

const API_ERROR_VI: Record<string, string> = {
    'Current password is incorrect': 'Mật khẩu hiện tại không đúng',
    'New password must be different from the current password':
        'Mật khẩu mới phải khác mật khẩu hiện tại',
    'currentPassword and newPassword must be provided together':
        'Phải nhập đủ cả mật khẩu hiện tại và mật khẩu mới',
};

function parseApiError(error: unknown): string {
    if (axios.isAxiosError(error)) {
        const msg = error.response?.data?.message;
        if (Array.isArray(msg))
            return msg.map((m) => (typeof m === 'string' ? API_ERROR_VI[m] ?? m : String(m))).join(', ');
        if (typeof msg === 'string') return API_ERROR_VI[msg] ?? msg;
    }
    return 'Đã có lỗi xảy ra. Vui lòng thử lại.';
}

// ── Sub-components ────────────────────────────────────────────────────────────

function InputField({
    label,
    error,
    children,
}: {
    label: string;
    error?: string;
    children: React.ReactNode;
}) {
    return (
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
            {children}
            {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
        </div>
    );
}

const inputCls = (hasError?: boolean) =>
    `w-full px-3 py-2 text-sm border rounded-lg text-gray-900 focus:ring-2 focus:ring-green-500 focus:border-transparent ${hasError ? 'border-red-300' : 'border-gray-300'}`;

// ── Tab: Thông tin cá nhân ────────────────────────────────────────────────────

function InfoTab({ onSuccess }: { onSuccess: () => void }) {
    const queryClient = useQueryClient();
    const { data: profile, isLoading } = useProfile();
    const mutation = useUpdateProfile();

    const [form, setForm] = useState({ fullname: '', phone: '', school: '' });
    const [serverError, setServerError] = useState('');
    const [success, setSuccess] = useState(false);

    // Pre-fill when profile data arrives
    useEffect(() => {
        if (profile?.profile) {
            setForm({
                fullname: profile.profile.fullname ?? '',
                phone: profile.profile.phone ?? '',
                school: profile.profile.school ?? '',
            });
        }
    }, [profile]);

    const set = (k: keyof typeof form) => (v: string) => {
        setForm((p) => ({ ...p, [k]: v }));
        setSuccess(false);
        setServerError('');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSuccess(false);
        setServerError('');

        const payload: Record<string, string> = {};
        if (form.fullname.trim()) payload.fullname = form.fullname.trim();
        if (form.phone.trim()) payload.phone = form.phone.trim();
        if (form.school.trim()) payload.school = form.school.trim();

        if (Object.keys(payload).length === 0) {
            setServerError('Vui lòng điền ít nhất một trường để cập nhật.');
            return;
        }

        try {
            await mutation.mutateAsync(payload);
            queryClient.invalidateQueries({ queryKey: ['userProfile'] });
            setSuccess(true);
            setTimeout(onSuccess, 1200);
        } catch (err) {
            setServerError(parseApiError(err));
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-12">
                <svg className="animate-spin h-6 w-6 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4 p-6">
            {success && (
                <div className="rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm px-4 py-3">
                    Cập nhật thông tin thành công.
                </div>
            )}
            {serverError && (
                <div className="rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3">
                    {serverError}
                </div>
            )}

            <InputField label="Họ và tên">
                <input
                    type="text"
                    autoComplete="name"
                    value={form.fullname}
                    onChange={(e) => set('fullname')(e.target.value)}
                    placeholder="Nguyễn Văn A"
                    className={inputCls()}
                />
            </InputField>

            <InputField label="Số điện thoại">
                <input
                    type="tel"
                    autoComplete="tel"
                    value={form.phone}
                    onChange={(e) => set('phone')(e.target.value)}
                    placeholder="0912 345 678"
                    className={inputCls()}
                />
            </InputField>

            <InputField label="Trường học">
                <input
                    type="text"
                    value={form.school}
                    onChange={(e) => set('school')(e.target.value)}
                    placeholder="THPT Chuyên Hạ Long"
                    className={inputCls()}
                />
            </InputField>

            <button
                type="submit"
                disabled={mutation.isPending}
                className="w-full py-2.5 rounded-lg bg-green-600 hover:bg-green-700 disabled:opacity-60 disabled:pointer-events-none text-white font-semibold text-sm transition-colors mt-2"
            >
                {mutation.isPending ? 'Đang lưu…' : 'Lưu thông tin'}
            </button>
        </form>
    );
}

// ── Tab: Đổi mật khẩu ────────────────────────────────────────────────────────

function PasswordTab({ onSuccess }: { onSuccess: () => void }) {
    const mutation = useUpdateProfile();
    const [form, setForm] = useState({ current: '', next: '', confirm: '' });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [serverError, setServerError] = useState('');
    const [success, setSuccess] = useState(false);

    const set = (k: keyof typeof form) => (v: string) => {
        setForm((p) => ({ ...p, [k]: v }));
        if (errors[k]) setErrors((p) => ({ ...p, [k]: '' }));
        setSuccess(false);
        setServerError('');
    };

    const validate = () => {
        const next: Record<string, string> = {};
        if (!form.current) next.current = 'Nhập mật khẩu hiện tại';
        if (!form.next) {
            next.next = 'Nhập mật khẩu mới';
        } else if (form.next.length < 8 || form.next.length > 24) {
            next.next = 'Mật khẩu mới phải từ 8–24 ký tự';
        }
        if (form.next !== form.confirm) next.confirm = 'Mật khẩu xác nhận không khớp';
        setErrors(next);
        return Object.keys(next).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSuccess(false);
        setServerError('');
        if (!validate()) return;
        try {
            await mutation.mutateAsync({ currentPassword: form.current, newPassword: form.next });
            setForm({ current: '', next: '', confirm: '' });
            setSuccess(true);
            setTimeout(onSuccess, 1200);
        } catch (err) {
            setServerError(parseApiError(err));
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 p-6">
            {success && (
                <div className="rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm px-4 py-3">
                    Đổi mật khẩu thành công.
                </div>
            )}
            {serverError && (
                <div className="rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3">
                    {serverError}
                </div>
            )}

            <InputField label="Mật khẩu hiện tại" error={errors.current}>
                <input
                    type="password"
                    autoComplete="current-password"
                    value={form.current}
                    onChange={(e) => set('current')(e.target.value)}
                    className={inputCls(!!errors.current)}
                />
            </InputField>

            <InputField label="Mật khẩu mới" error={errors.next}>
                <input
                    type="password"
                    autoComplete="new-password"
                    value={form.next}
                    onChange={(e) => set('next')(e.target.value)}
                    className={inputCls(!!errors.next)}
                />
            </InputField>

            <InputField label="Xác nhận mật khẩu mới" error={errors.confirm}>
                <input
                    type="password"
                    autoComplete="new-password"
                    value={form.confirm}
                    onChange={(e) => set('confirm')(e.target.value)}
                    className={inputCls(!!errors.confirm)}
                />
            </InputField>

            <p className="text-xs text-gray-400">Mật khẩu mới phải từ 8 đến 24 ký tự.</p>

            <button
                type="submit"
                disabled={mutation.isPending}
                className="w-full py-2.5 rounded-lg bg-green-600 hover:bg-green-700 disabled:opacity-60 disabled:pointer-events-none text-white font-semibold text-sm transition-colors mt-2"
            >
                {mutation.isPending ? 'Đang cập nhật…' : 'Cập nhật mật khẩu'}
            </button>
        </form>
    );
}

// ── Modal ─────────────────────────────────────────────────────────────────────

interface ProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
    username?: string;
}

export default function ProfileModal({ isOpen, onClose, username }: ProfileModalProps) {
    const [isMounted, setIsMounted] = useState(false);
    const [tab, setTab] = useState<Tab>('info');

    useEffect(() => {
        setIsMounted(true);
        return () => setIsMounted(false);
    }, []);

    // Reset tab when modal opens
    useEffect(() => {
        if (isOpen) setTab('info');
    }, [isOpen]);

    // Close on Escape
    useEffect(() => {
        if (!isOpen) return;
        const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
        document.addEventListener('keydown', handler);
        return () => document.removeEventListener('keydown', handler);
    }, [isOpen, onClose]);

    if (!isOpen || !isMounted) return null;

    const tabs: { key: Tab; label: string; icon: React.ReactNode }[] = [
        {
            key: 'info',
            label: 'Thông tin cá nhân',
            icon: (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
            ),
        },
        {
            key: 'password',
            label: 'Đổi mật khẩu',
            icon: (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
            ),
        },
    ];

    return createPortal(
        <div
            className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] flex flex-col overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-green-600 to-green-700 px-6 py-4 flex items-center justify-between flex-shrink-0">
                    <div>
                        <h2 className="text-lg font-bold text-white">Cập nhật tài khoản</h2>
                        {username && (
                            <p className="text-green-100 text-xs mt-0.5">{username}</p>
                        )}
                    </div>
                    <button
                        onClick={onClose}
                        className="text-white/80 hover:text-white p-1.5 hover:bg-white/15 rounded-full transition-colors"
                        aria-label="Đóng"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-gray-200 flex-shrink-0">
                    {tabs.map((t) => (
                        <button
                            key={t.key}
                            onClick={() => setTab(t.key)}
                            className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition-colors border-b-2 ${tab === t.key
                                ? 'border-green-600 text-green-700 bg-green-50'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                                }`}
                        >
                            {t.icon}
                            {t.label}
                        </button>
                    ))}
                </div>

                {/* Tab content */}
                <div className="overflow-y-auto flex-1">
                    {tab === 'info' && <InfoTab onSuccess={onClose} />}
                    {tab === 'password' && <PasswordTab onSuccess={onClose} />}
                </div>
            </div>
        </div>,
        document.body,
    );
}
