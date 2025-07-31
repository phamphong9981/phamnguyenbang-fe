'use client';

import { useState } from 'react';
import { useRegister } from '@/hooks/userUser';

interface RegisterPopupProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function RegisterPopup({ isOpen, onClose }: RegisterPopupProps) {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        fullname: '',
        phone: '',
        school: '',
        birthday: ''
    });

    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const registerMutation = useRegister();

    // Email validation function
    const isValidEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const validateForm = () => {
        const newErrors: { [key: string]: string } = {};

        // Validate username (email)
        if (!formData.username) {
            newErrors.username = 'Email là bắt buộc';
        } else if (!isValidEmail(formData.username)) {
            newErrors.username = 'Email không hợp lệ';
        }

        // Validate other fields
        if (!formData.fullname) newErrors.fullname = 'Họ và tên là bắt buộc';
        if (!formData.password) newErrors.password = 'Mật khẩu là bắt buộc';
        if (!formData.phone) newErrors.phone = 'Số điện thoại là bắt buộc';
        if (!formData.school) newErrors.school = 'Trường học là bắt buộc';
        if (!formData.birthday) newErrors.birthday = 'Ngày sinh là bắt buộc';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        try {
            await registerMutation.mutateAsync({
                ...formData,
                birthday: new Date(formData.birthday)
            });

            // Reset form and close popup on success
            setFormData({
                username: '',
                password: '',
                fullname: '',
                phone: '',
                school: '',
                birthday: ''
            });
            setErrors({});
            onClose();

            // Show success message
            alert('Đăng ký thành công!');
        } catch (error) {
            console.error('Registration error:', error);
            alert('Có lỗi xảy ra khi đăng ký. Vui lòng thử lại.');
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

        // Real-time email validation
        if (name === 'username' && value) {
            if (!isValidEmail(value)) {
                setErrors(prev => ({
                    ...prev,
                    username: 'Email không hợp lệ'
                }));
            } else {
                setErrors(prev => ({
                    ...prev,
                    username: ''
                }));
            }
        }
    };

    const handleBackdropClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 bg-gradient-to-br from-black/60 via-gray-900/70 to-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4"
            onClick={handleBackdropClick}
        >
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm sm:max-w-md md:max-w-lg max-h-[98vh] sm:max-h-[95vh] overflow-hidden transform transition-all duration-300 scale-100">
                {/* Header with gradient background */}
                <div className="bg-gradient-to-r from-green-600 via-green-700 to-green-800 text-white p-3 sm:p-4 relative">
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-green-600/90 to-blue-600/90 rounded-t-3xl"></div>
                    <div className="relative z-10 flex items-center justify-between">
                        <div>
                            <h2 className="text-lg sm:text-xl font-bold">Đăng ký tài khoản</h2>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-white/80 hover:text-white transition-colors p-1.5 hover:bg-white/10 rounded-full"
                        >
                            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-3 sm:p-4 space-y-2.5 sm:space-y-3 bg-gradient-to-b from-gray-50 to-white">
                    {/* Full Name */}
                    <div>
                        <label htmlFor="fullname" className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1">
                            Họ và tên *
                        </label>
                        <input
                            type="text"
                            id="fullname"
                            name="fullname"
                            value={formData.fullname}
                            onChange={handleInputChange}
                            required
                            className={`w-full px-3 py-2 border-2 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 bg-white shadow-sm text-sm ${errors.fullname ? 'border-red-500' : 'border-gray-200'
                                }`}
                            placeholder="Nhập họ và tên"
                        />
                        {errors.fullname && (
                            <p className="text-red-500 text-xs mt-1">{errors.fullname}</p>
                        )}
                    </div>

                    {/* Username (Email) */}
                    <div>
                        <label htmlFor="username" className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1">
                            Username *
                        </label>
                        <input
                            type="email"
                            id="username"
                            name="username"
                            value={formData.username}
                            onChange={handleInputChange}
                            required
                            className={`w-full px-3 py-2 border-2 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 bg-white shadow-sm text-sm ${errors.username ? 'border-red-500' : 'border-gray-200'
                                }`}
                            placeholder="Nhập username của bạn"
                        />
                        {errors.username && (
                            <p className="text-red-500 text-xs mt-1">{errors.username}</p>
                        )}
                    </div>

                    {/* Password */}
                    <div>
                        <label htmlFor="password" className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1">
                            Mật khẩu *
                        </label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            required
                            className={`w-full px-3 py-2 border-2 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 bg-white shadow-sm text-sm ${errors.password ? 'border-red-500' : 'border-gray-200'
                                }`}
                            placeholder="Nhập mật khẩu"
                        />
                        {errors.password && (
                            <p className="text-red-500 text-xs mt-1">{errors.password}</p>
                        )}
                    </div>

                    {/* Phone */}
                    <div>
                        <label htmlFor="phone" className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1">
                            Số điện thoại *
                        </label>
                        <input
                            type="tel"
                            id="phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            required
                            className={`w-full px-3 py-2 border-2 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 bg-white shadow-sm text-sm ${errors.phone ? 'border-red-500' : 'border-gray-200'
                                }`}
                            placeholder="Nhập số điện thoại"
                        />
                        {errors.phone && (
                            <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
                        )}
                    </div>

                    {/* School */}
                    <div>
                        <label htmlFor="school" className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1">
                            Trường học *
                        </label>
                        <input
                            type="text"
                            id="school"
                            name="school"
                            value={formData.school}
                            onChange={handleInputChange}
                            required
                            className={`w-full px-3 py-2 border-2 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 bg-white shadow-sm text-sm ${errors.school ? 'border-red-500' : 'border-gray-200'
                                }`}
                            placeholder="Nhập tên trường"
                        />
                        {errors.school && (
                            <p className="text-red-500 text-xs mt-1">{errors.school}</p>
                        )}
                    </div>

                    {/* Birthday */}
                    <div>
                        <label htmlFor="birthday" className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1">
                            Ngày sinh *
                        </label>
                        <input
                            type="date"
                            id="birthday"
                            name="birthday"
                            value={formData.birthday}
                            onChange={handleInputChange}
                            required
                            className={`w-full px-3 py-2 border-2 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 bg-white shadow-sm text-sm ${errors.birthday ? 'border-red-500' : 'border-gray-200'
                                }`}
                        />
                        {errors.birthday && (
                            <p className="text-red-500 text-xs mt-1">{errors.birthday}</p>
                        )}
                    </div>
                </form>

                {/* Footer with Submit Button */}
                <button
                    type="submit"
                    disabled={registerMutation.isPending}
                    onClick={handleSubmit}
                    className="w-full bg-gradient-to-r from-green-600 via-green-700 to-green-800 hover:from-green-700 hover:via-green-800 hover:to-green-900 disabled:from-gray-400 disabled:via-gray-500 disabled:to-gray-600 text-white font-bold py-3 sm:py-4 px-4 sm:px-6 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl disabled:scale-100 disabled:shadow-lg shadow-lg flex items-center justify-center text-sm sm:text-base relative overflow-hidden group border-t border-green-200"
                >
                    {/* Background gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                    {/* Button content */}
                    <div className="relative z-10 flex items-center justify-center">
                        {registerMutation.isPending ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 sm:h-5 sm:w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                <span>Đang đăng ký...</span>
                            </>
                        ) : (
                            <>
                                <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                                <span>Đăng ký ngay</span>
                            </>
                        )}
                    </div>
                </button>
            </div>
        </div>
    );
} 