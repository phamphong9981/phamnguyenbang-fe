'use client';

import { useState, useEffect } from 'react';
import { useUpdate, GetUsersResponse } from '@/hooks/useAdmin';

interface EditUserModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    user: GetUsersResponse | null;
}

export default function EditUserModal({ isOpen, onClose, onSuccess, user }: EditUserModalProps) {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        confirmPassword: '',
        fullname: '',
        phone: '',
        school: '',
        yearOfBirth: new Date().getFullYear() - 16,
        class: '',
        premiumExpiredAt: ''
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [changePassword, setChangePassword] = useState(false);

    const updateMutation = useUpdate();

    // Load user data when modal opens
    useEffect(() => {
        if (user && isOpen) {
            setFormData({
                username: user.username || '',
                password: '',
                confirmPassword: '',
                fullname: user.fullname || '',
                phone: user.phone || '', // Not available in GetUsersResponse
                school: user.school || '', // Not available in GetUsersResponse
                yearOfBirth: user.yearOfBirth ? parseInt(user.yearOfBirth) : new Date().getFullYear() - 16,
                class: user.class || '',
                premiumExpiredAt: user.premiumExpiredAt ? new Date(user.premiumExpiredAt).toISOString().split('T')[0] : ''
            });
            setChangePassword(false);
            setErrors({});
        }
    }, [user, isOpen]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        // Username validation
        if (formData.username.trim() && formData.username.length < 3) {
            newErrors.username = 'Tên đăng nhập phải có ít nhất 3 ký tự';
        }

        // Password validation (only if changing password)
        if (changePassword) {
            if (!formData.password) {
                newErrors.password = 'Mật khẩu là bắt buộc khi đổi mật khẩu';
            } else if (formData.password.length < 8 || formData.password.length > 24) {
                newErrors.password = 'Mật khẩu phải có từ 8 đến 24 ký tự';
            }

            if (!formData.confirmPassword) {
                newErrors.confirmPassword = 'Xác nhận mật khẩu là bắt buộc';
            } else if (formData.password !== formData.confirmPassword) {
                newErrors.confirmPassword = 'Mật khẩu xác nhận không khớp';
            }
        }

        // Fullname validation
        if (formData.fullname.trim() && formData.fullname.length < 2) {
            newErrors.fullname = 'Họ tên phải có ít nhất 2 ký tự';
        }

        // Year of birth validation
        if (formData.yearOfBirth && (formData.yearOfBirth < 2000 || formData.yearOfBirth > 2010)) {
            newErrors.yearOfBirth = 'Năm sinh phải từ 2000 đến 2010';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!user) return;

        if (!validateForm()) {
            return;
        }

        try {
            const updateData: any = {};

            // Only include fields that have been changed
            if (formData.username && formData.username !== user.username) {
                updateData.username = formData.username;
            }
            if (changePassword && formData.password) {
                updateData.password = formData.password;
            }
            if (formData.fullname && formData.fullname !== user.fullname) {
                updateData.fullname = formData.fullname;
            }
            if (formData.phone) {
                updateData.phone = formData.phone;
            }
            if (formData.school) {
                updateData.school = formData.school;
            }
            if (formData.yearOfBirth && formData.yearOfBirth !== parseInt(user.yearOfBirth)) {
                updateData.yearOfBirth = formData.yearOfBirth;
            }
            if (formData.class && formData.class !== user.class) {
                updateData.class = formData.class;
            }
            if (formData.premiumExpiredAt) {
                updateData.premiumExpiredAt = new Date(formData.premiumExpiredAt);
            }

            await updateMutation.mutateAsync({
                userId: user.id,
                data: updateData
            });

            // Reset form
            setFormData({
                username: '',
                password: '',
                confirmPassword: '',
                fullname: '',
                phone: '',
                school: '',
                yearOfBirth: new Date().getFullYear() - 16,
                class: '',
                premiumExpiredAt: ''
            });
            setErrors({});
            setChangePassword(false);

            onSuccess();
            onClose();
        } catch (error) {
            console.error('Error updating user:', error);
        }
    };

    const handleClose = () => {
        setFormData({
            username: '',
            password: '',
            confirmPassword: '',
            fullname: '',
            phone: '',
            school: '',
            yearOfBirth: new Date().getFullYear() - 16,
            class: '',
            premiumExpiredAt: ''
        });
        setErrors({});
        setChangePassword(false);
        onClose();
    };

    if (!isOpen || !user) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <h2 className="text-2xl font-bold text-gray-900">
                        ✏️ Chỉnh sửa tài khoản
                    </h2>
                    <button
                        onClick={handleClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Username and Class Row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                                Tên đăng nhập
                            </label>
                            <input
                                type="text"
                                id="username"
                                name="username"
                                value={formData.username}
                                onChange={handleInputChange}
                                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${errors.username ? 'border-red-300' : 'border-gray-300'
                                    }`}
                                placeholder="Nhập tên đăng nhập"
                            />
                            {errors.username && (
                                <p className="mt-1 text-sm text-red-600">{errors.username}</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="class" className="block text-sm font-medium text-gray-700 mb-2">
                                Lớp học
                            </label>
                            <input
                                type="text"
                                id="class"
                                name="class"
                                value={formData.class}
                                onChange={handleInputChange}
                                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${errors.class ? 'border-red-300' : 'border-gray-300'
                                    }`}
                                placeholder="Ví dụ: 12s, 11a1"
                            />
                            {errors.class && (
                                <p className="mt-1 text-sm text-red-600">{errors.class}</p>
                            )}
                        </div>
                    </div>

                    {/* Password Section */}
                    <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                        <div className="flex items-center mb-4">
                            <input
                                type="checkbox"
                                id="changePassword"
                                checked={changePassword}
                                onChange={(e) => {
                                    setChangePassword(e.target.checked);
                                    if (!e.target.checked) {
                                        setFormData(prev => ({ ...prev, password: '', confirmPassword: '' }));
                                        setErrors(prev => ({ ...prev, password: '', confirmPassword: '' }));
                                    }
                                }}
                                className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                            />
                            <label htmlFor="changePassword" className="ml-2 text-sm font-medium text-gray-700">
                                Đổi mật khẩu
                            </label>
                        </div>

                        {changePassword && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                                        Mật khẩu mới *
                                    </label>
                                    <input
                                        type="password"
                                        id="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${errors.password ? 'border-red-300' : 'border-gray-300'
                                            }`}
                                        placeholder="Nhập mật khẩu mới (8-24 ký tự)"
                                    />
                                    {errors.password && (
                                        <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                                    )}
                                </div>

                                <div>
                                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                                        Xác nhận mật khẩu *
                                    </label>
                                    <input
                                        type="password"
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={handleInputChange}
                                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${errors.confirmPassword ? 'border-red-300' : 'border-gray-300'
                                            }`}
                                        placeholder="Nhập lại mật khẩu"
                                    />
                                    {errors.confirmPassword && (
                                        <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Full Name */}
                    <div>
                        <label htmlFor="fullname" className="block text-sm font-medium text-gray-700 mb-2">
                            Họ và tên
                        </label>
                        <input
                            type="text"
                            id="fullname"
                            name="fullname"
                            value={formData.fullname}
                            onChange={handleInputChange}
                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${errors.fullname ? 'border-red-300' : 'border-gray-300'
                                }`}
                            placeholder="Nhập họ và tên đầy đủ"
                        />
                        {errors.fullname && (
                            <p className="mt-1 text-sm text-red-600">{errors.fullname}</p>
                        )}
                    </div>

                    {/* Phone and School Row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                                Số điện thoại
                            </label>
                            <input
                                type="tel"
                                id="phone"
                                name="phone"
                                value={formData.phone}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                placeholder="Nhập số điện thoại"
                            />
                        </div>

                        <div>
                            <label htmlFor="school" className="block text-sm font-medium text-gray-700 mb-2">
                                Trường học
                            </label>
                            <input
                                type="text"
                                id="school"
                                name="school"
                                value={formData.school}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                placeholder="Nhập tên trường học"
                            />
                        </div>
                    </div>

                    {/* Year of Birth and Premium Expired At Row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="yearOfBirth" className="block text-sm font-medium text-gray-700 mb-2">
                                Năm sinh
                            </label>
                            <select
                                id="yearOfBirth"
                                name="yearOfBirth"
                                value={formData.yearOfBirth}
                                onChange={handleInputChange}
                                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${errors.yearOfBirth ? 'border-red-300' : 'border-gray-300'
                                    }`}
                            >
                                <option value="">Chọn năm sinh</option>
                                {Array.from({ length: 11 }, (_, i) => 2010 - i).map(year => (
                                    <option key={year} value={year}>{year}</option>
                                ))}
                            </select>
                            {errors.yearOfBirth && (
                                <p className="mt-1 text-sm text-red-600">{errors.yearOfBirth}</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="premiumExpiredAt" className="block text-sm font-medium text-gray-700 mb-2">
                                Hạn Premium
                            </label>
                            <input
                                type="date"
                                id="premiumExpiredAt"
                                name="premiumExpiredAt"
                                value={formData.premiumExpiredAt}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            />
                        </div>
                    </div>

                    {/* Error Message */}
                    {updateMutation.isError && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                            <div className="flex items-center">
                                <div className="text-red-400 mr-3">⚠️</div>
                                <p className="text-red-700 text-sm">
                                    Có lỗi xảy ra khi cập nhật tài khoản. Vui lòng thử lại.
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Buttons */}
                    <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                        >
                            Hủy
                        </button>
                        <button
                            type="submit"
                            disabled={updateMutation.isPending}
                            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {updateMutation.isPending ? (
                                <div className="flex items-center">
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                    Đang cập nhật...
                                </div>
                            ) : (
                                '✅ Lưu thay đổi'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

