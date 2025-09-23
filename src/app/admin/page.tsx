'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import Header from '@/components/Header';
import UserManagement from '@/components/admin/UserManagement';
import CourseManagement from '@/components/admin/CourseManagement';
import AdminLogin from '@/components/admin/AdminLogin';

export default function AdminPage() {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('users');
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    // Check if user is admin
    const isAdmin = user && user.username === 'admin';

    // Show login form if not logged in as admin
    if (!isAdmin && !isLoggedIn) {
        return <AdminLogin onLoginSuccess={() => setIsLoggedIn(true)} />;
    }

    const tabs = [
        { id: 'users', name: 'Quản lý tài khoản', icon: '👥' },
        { id: 'exams', name: 'Quản lý bài thi', icon: '📝' },
        { id: 'courses', name: 'Quản lý khóa học', icon: '🎓' },
        { id: 'reports', name: 'Báo cáo', icon: '📊' },
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">
                                🛠️ Trang quản trị
                            </h1>
                            <p className="text-gray-600">
                                Quản lý hệ thống và người dùng
                            </p>
                        </div>
                        <div className="text-right">
                            <p className="text-sm text-gray-500">Xin chào, Admin</p>
                            <button
                                onClick={() => {
                                    localStorage.removeItem('token');
                                    localStorage.removeItem('username');
                                    localStorage.removeItem('isPremium');
                                    localStorage.removeItem('userId');
                                    localStorage.removeItem('classname');
                                    localStorage.removeItem('yearOfBirth');
                                    window.location.reload();
                                }}
                                className="text-sm text-red-600 hover:text-red-800 transition-colors"
                            >
                                🚪 Đăng xuất
                            </button>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
                    <div className="border-b border-gray-200">
                        <nav className="-mb-px flex space-x-8 px-6">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === tab.id
                                        ? 'border-green-500 text-green-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                        }`}
                                >
                                    <span className="mr-2">{tab.icon}</span>
                                    {tab.name}
                                </button>
                            ))}
                        </nav>
                    </div>
                </div>

                {/* Tab Content */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                    {activeTab === 'users' && <UserManagement />}
                    {activeTab === 'exams' && (
                        <div className="p-6 text-center text-gray-500">
                            <div className="text-4xl mb-4">📝</div>
                            <p>Chức năng quản lý bài thi đang được phát triển</p>
                        </div>
                    )}
                    {activeTab === 'courses' && <CourseManagement />}
                    {activeTab === 'reports' && (
                        <div className="p-6 text-center text-gray-500">
                            <div className="text-4xl mb-4">📊</div>
                            <p>Chức năng báo cáo đang được phát triển</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
