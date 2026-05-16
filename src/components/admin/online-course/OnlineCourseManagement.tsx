'use client';

import { useState } from 'react';
import CourseListSection from './courses/CourseListSection';
import EnrollmentListSection from './enrollments/EnrollmentListSection';

type OnlineCourseTab = 'courses' | 'enrollments';

export default function OnlineCourseManagement() {
    const [activeTab, setActiveTab] = useState<OnlineCourseTab>('courses');

    const tabs: { id: OnlineCourseTab; name: string; icon: string }[] = [
        { id: 'courses', name: 'Khóa học', icon: '🎓' },
        { id: 'enrollments', name: 'Đăng ký học sinh', icon: '🧾' },
    ];

    return (
        <div className="p-6">
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-1">Khóa học Online</h2>
                <p className="text-gray-600">
                    Tạo khóa học, gắn bộ đề vào khóa, và đăng ký quyền truy cập cho học sinh.
                </p>
            </div>

            <div className="border-b border-gray-200 mb-6">
                <nav className="-mb-px flex space-x-6">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`py-3 px-1 border-b-2 text-sm font-medium transition-colors ${activeTab === tab.id
                                ? 'border-indigo-500 text-indigo-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                        >
                            <span className="mr-2">{tab.icon}</span>
                            {tab.name}
                        </button>
                    ))}
                </nav>
            </div>

            {activeTab === 'courses' && <CourseListSection />}
            {activeTab === 'enrollments' && <EnrollmentListSection />}
        </div>
    );
}
