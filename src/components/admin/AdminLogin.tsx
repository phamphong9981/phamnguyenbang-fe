'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useLogin } from '@/hooks/userUser';

interface AdminLoginProps {
    onLoginSuccess: () => void;
}

export default function AdminLogin({ onLoginSuccess }: AdminLoginProps) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const loginMutation = useLogin();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        try {
            const result = await loginMutation.mutateAsync({ username, password });

            // Check if the logged in user is admin
            if (result.username === 'admin') {
                // Create admin user object for useAuth
                const adminUser = {
                    id: result.userId,
                    username: result.username,
                    token: result.token,
                    isPremium: result.isPremium,
                    classname: result.classname,
                    yearOfBirth: result.yearOfBirth
                };

                login(adminUser);
                onLoginSuccess();
            } else {
                setError('Bạn không có quyền truy cập trang quản trị');
            }
        } catch (err) {
            console.error('Admin login error:', err);
            setError('Tên đăng nhập hoặc mật khẩu không đúng');
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
            <div className="max-w-md w-full">
                {/* Logo/Header */}
                <div className="text-center mb-8">
                    <div className="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-3xl">🛠️</span>
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        Admin Login
                    </h1>
                    <p className="text-gray-600">
                        Đăng nhập để truy cập trang quản trị
                    </p>
                </div>

                {/* Login Form */}
                <div className="bg-white rounded-2xl shadow-xl p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Username Field */}
                        <div>
                            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                                Tên đăng nhập
                            </label>
                            <input
                                id="username"
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                                placeholder="Nhập tên đăng nhập"
                                required
                                disabled={loginMutation.isPending}
                            />
                        </div>

                        {/* Password Field */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                                Mật khẩu
                            </label>
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                                placeholder="Nhập mật khẩu"
                                required
                                disabled={loginMutation.isPending}
                            />
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                <div className="flex items-center">
                                    <div className="text-red-400 mr-3">⚠️</div>
                                    <p className="text-red-700 text-sm">{error}</p>
                                </div>
                            </div>
                        )}

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loginMutation.isPending}
                            className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loginMutation.isPending ? (
                                <div className="flex items-center justify-center">
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                    Đang đăng nhập...
                                </div>
                            ) : (
                                '🔐 Đăng nhập'
                            )}
                        </button>
                    </form>

                    {/* Admin Info */}
                    <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                        <h3 className="text-sm font-medium text-gray-700 mb-2">Thông tin admin:</h3>
                        <div className="text-xs text-gray-600 space-y-1">
                            <p><strong>Tên đăng nhập:</strong> admin</p>
                            <p><strong>Mật khẩu:</strong> [Sử dụng mật khẩu admin thực tế]</p>
                            <p className="text-red-600"><strong>Lưu ý:</strong> Chỉ tài khoản admin mới có quyền truy cập</p>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="text-center mt-8">
                    <p className="text-sm text-gray-500">
                        © 2024 Lớp Toán Phân Hoá Hạ Long
                    </p>
                </div>
            </div>
        </div>
    );
}
