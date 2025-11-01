'use client';

import { ExamConfirmCard } from './component/ExamConfirmCard';

function App() {
  const examInfo = {
    studentName: 'Hải Ninh',
    examType: 'Tư duy Toán học - Đợt 1',
    duration: '60 phút',
    questionCount: '40 câu',
  };

  const handleStartExam = () => {
    console.log('Bắt đầu thi');
  };

  const handleBack = () => {
    console.log('Quay lại');
  };

  const handleHelp = () => {
    console.log('Hướng dẫn');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <ExamConfirmCard
        examInfo={examInfo}
        onStartExam={handleStartExam}
        onBack={handleBack}
        onHelp={handleHelp}
      />
    </div>
  );
}

export default App;