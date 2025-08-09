'use client';

import { useEffect, useState } from 'react';
import notifyApi from '../hooks/useNotify';
import { CheckCircle2, XCircle, X } from 'lucide-react';

interface FormData {
    fullName: string;
    dateOfBirth: string;
    phoneNumber: string;
    school: string;
}

export default function TrialRegistrationForm() {
    const [formData, setFormData] = useState<FormData>({
        fullName: '',
        dateOfBirth: '',
        phoneNumber: '',
        school: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [toast, setToast] = useState<{ visible: boolean; type: 'success' | 'error'; message: string }>({
        visible: false,
        type: 'success',
        message: '',
    });

    useEffect(() => {
        if (!toast.visible) return;
        const id = setTimeout(() => setToast((t) => ({ ...t, visible: false })), 4000);
        return () => clearTimeout(id);
    }, [toast.visible]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (isSubmitting) return;
        setIsSubmitting(true);

        try {
            await notifyApi.sendNotify({
                name: formData.fullName,
                phone: formData.phoneNumber,
                date: formData.dateOfBirth,
                school: formData.school,
            });

            setToast({ visible: true, type: 'success', message: 'Cảm ơn bạn đã đăng ký! Chúng tôi sẽ liên hệ sớm nhất.' });
            setFormData({ fullName: '', dateOfBirth: '', phoneNumber: '', school: '' });
        } catch (error) {
            setToast({ visible: true, type: 'error', message: 'Đăng ký thất bại. Vui lòng thử lại sau.' });
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-xl overflow-hidden">
            {toast.visible && (
                <div className="fixed top-4 right-4 z-50">
                    <div
                        className={`flex items-start gap-3 rounded-lg border p-4 shadow-lg min-w-[280px] max-w-sm ${toast.type === 'success'
                            ? 'bg-green-50 border-green-200 text-green-800'
                            : 'bg-red-50 border-red-200 text-red-800'
                            }`}
                    >
                        <div className="mt-0.5">
                            {toast.type === 'success' ? (
                                <CheckCircle2 className="h-5 w-5" />
                            ) : (
                                <XCircle className="h-5 w-5" />
                            )}
                        </div>
                        <div className="flex-1 text-sm leading-6">{toast.message}</div>
                        <button
                            type="button"
                            aria-label="Đóng thông báo"
                            className="rounded p-1 hover:bg-black/5"
                            onClick={() => setToast((t) => ({ ...t, visible: false }))}
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            )}
            {/* Header */}
            <div className="bg-green-600 p-8 text-white text-center">
                <h1 className="text-3xl font-bold uppercase mb-2">Đăng ký học thử</h1>
                <p className="text-lg opacity-90">Khám phá tiềm năng của bạn ngay hôm nay</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                {/* Left Panel - Form */}
                <div className="p-8 bg-white">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="fullName" className="block text-sm font-semibold text-gray-700 mb-2">
                                Họ và tên *
                            </label>
                            <input
                                type="text"
                                id="fullName"
                                name="fullName"
                                value={formData.fullName}
                                onChange={handleInputChange}
                                required
                                className="w-full px-4 py-4 bg-gray-100 border border-gray-300 rounded-md text-base text-gray-900 placeholder-gray-500 focus:border-green-600 focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-opacity-20 transition-all"
                                placeholder="Nhập họ và tên của bạn"
                            />
                        </div>

                        <div>
                            <label htmlFor="dateOfBirth" className="block text-sm font-semibold text-gray-700 mb-2">
                                Ngày tháng năm sinh *
                            </label>
                            <input
                                type="date"
                                id="dateOfBirth"
                                name="dateOfBirth"
                                value={formData.dateOfBirth}
                                onChange={handleInputChange}
                                required
                                className="w-full px-4 py-4 bg-gray-100 border border-gray-300 rounded-md text-base text-gray-900 focus:border-green-600 focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-opacity-20 transition-all"
                            />
                        </div>

                        <div>
                            <label htmlFor="phoneNumber" className="block text-sm font-semibold text-gray-700 mb-2">
                                Số điện thoại *
                            </label>
                            <input
                                type="tel"
                                id="phoneNumber"
                                name="phoneNumber"
                                value={formData.phoneNumber}
                                onChange={handleInputChange}
                                required
                                className="w-full px-4 py-4 bg-gray-100 border border-gray-300 rounded-md text-base text-gray-900 placeholder-gray-500 focus:border-green-600 focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-opacity-20 transition-all"
                                placeholder="Nhập số điện thoại"
                            />
                        </div>

                        <div>
                            <label htmlFor="school" className="block text-sm font-semibold text-gray-700 mb-2">
                                Trường em đang học *
                            </label>
                            <input
                                type="text"
                                id="school"
                                name="school"
                                value={formData.school}
                                onChange={handleInputChange}
                                required
                                className="w-full px-4 py-4 bg-gray-100 border border-gray-300 rounded-md text-base text-gray-900 placeholder-gray-500 focus:border-green-600 focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-opacity-20 transition-all"
                                placeholder="Nhập tên trường"
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-[#FDD835] hover:bg-[#FBC02D] text-gray-900 font-bold text-xl uppercase py-4 px-6 rounded-md transition-all duration-200 transform hover:scale-105 shadow-lg disabled:opacity-60 disabled:hover:scale-100"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Đang gửi...' : 'Đăng ký học thử'}
                        </button>
                    </form>
                </div>

                {/* Right Panel - Information */}
                <div className="p-8 bg-gray-50">
                    <div className="space-y-6">
                        <div>
                            <h3 className="text-xl font-bold text-green-600 uppercase mb-4">
                                Thông tin liên hệ
                            </h3>

                            <div className="space-y-4">
                                <div className="flex items-start space-x-3">
                                    <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-gray-900 mb-1">Địa điểm học:</h4>
                                        <p className="text-gray-700 leading-relaxed">
                                            Số 23-24 lô B2, Lê Trọng Tấn, Hồng Hải, Phường Hạ Long<br />
                                            <span className="text-sm text-gray-600">(Gần cung Cá Heo)</span>
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start space-x-3">
                                    <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-gray-900 mb-1">Hotline:</h4>
                                        <p className="text-gray-700">
                                            <a href="tel:0932701333" className="hover:text-green-600 transition-colors">0932.701.333</a> /
                                            <a href="tel:0904878568" className="hover:text-green-600 transition-colors"> 0904.878.568</a>
                                        </p>
                                        <p className="text-sm text-gray-600 mt-1">
                                            (Inbox ngay để được tư vấn!)
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-lg border border-gray-200">
                            <h4 className="font-bold text-green-600 mb-3">Tại sao chọn chúng tôi?</h4>
                            <ul className="space-y-2 text-sm text-gray-700">
                                <li className="flex items-center space-x-2">
                                    <span className="w-2 h-2 bg-[#FDD835] rounded-full"></span>
                                    <span>Phương pháp giảng dạy hiện đại</span>
                                </li>
                                <li className="flex items-center space-x-2">
                                    <span className="w-2 h-2 bg-[#FDD835] rounded-full"></span>
                                    <span>Giảng viên giàu kinh nghiệm</span>
                                </li>
                                <li className="flex items-center space-x-2">
                                    <span className="w-2 h-2 bg-[#FDD835] rounded-full"></span>
                                    <span>Lớp học nhỏ, tương tác cao</span>
                                </li>
                                <li className="flex items-center space-x-2">
                                    <span className="w-2 h-2 bg-[#FDD835] rounded-full"></span>
                                    <span>Chứng chỉ được công nhận</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
} 