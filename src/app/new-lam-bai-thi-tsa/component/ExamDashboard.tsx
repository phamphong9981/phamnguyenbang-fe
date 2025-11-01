'use client';

import { useState } from 'react';
import UserInfo from './UserInfo';
import ExamList, { Exam } from './ExamList';

interface ExamDashboardProps {
  userName: string;
  userId: string;
  accountStatus: string;
  title: string;
  exams: Exam[];
}

export default function ExamDashboard({
  userName,
  userId,
  accountStatus,
  title,
  exams
}: ExamDashboardProps) {
  const [activeTab, setActiveTab] = useState<'free' | 'auto'>('free');

  const handleExamContinue = (examId: string) => {
    console.log('Continue exam:', examId);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-4">
          {title}
        </h1>

        <div className="flex justify-center gap-3 mb-6">
          <button
            onClick={() => setActiveTab('free')}
            className={`px-6 py-2 rounded-md font-medium transition-colors ${
              activeTab === 'free'
                ? 'bg-green-100 text-green-700 border border-green-300'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Miễn phí
          </button>
          <button
            onClick={() => setActiveTab('auto')}
            className={`px-6 py-2 rounded-md font-medium transition-colors ${
              activeTab === 'auto'
                ? 'bg-green-100 text-green-700 border border-green-300'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Tự do
          </button>
        </div>

        <UserInfo
          name={userName}
          id={userId}
          accountStatus={accountStatus}
        />

        <ExamList
          exams={exams}
          onExamContinue={handleExamContinue}
        />
      </div>
    </div>
  );
}
