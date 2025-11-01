'use client';

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



  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-4">
          {title}
        </h1>

        <div className="flex justify-center gap-3 mb-6">
          <div
            className='px-6 py-2 rounded-md font-medium transition-colors bg-green-100 text-green-700 border border-green-300'
          >
            Miễn phí
          </div>
          <div
            className='px-6 py-2 rounded-md font-medium transition-colors bg-green-100 text-green-700 border border-green-300'
          >
            Tự do
          </div>
        </div>

        <UserInfo
          name={userName}
          id={userId}
          accountStatus={accountStatus}
        />

        <ExamList
          exams={exams}
        />
      </div>
    </div>
  );
}
