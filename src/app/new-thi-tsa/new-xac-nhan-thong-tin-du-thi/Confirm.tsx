'use client';

import { ExamConfirmCard } from './component/ExamConfirmCard';
import { useTSAContext } from '../lam-bai/hooks/TSAProvider';
const getExamInfo = (examType: string) => {
  switch (examType) {
    case 'Tư duy Toán học':
      return {
        studentName: 'Hải Ninh',
        examType: 'Tư duy Toán học',
        duration: '60 phút',
        questionCount: '40 câu',
      };
    case 'Tư duy Đọc hiểu':
      return {
        studentName: 'Hải Ninh',
        examType: 'Tư duy Đọc hiểu',
        duration: '30 phút',
        questionCount: '20 câu',
      };
    default:
      return {
        studentName: 'Hải Ninh',
        examType: 'Tư duy Khoa học & Giải quyết vấn đề',
        duration: '60 phút',
        questionCount: '40 câu',
      };
  }
};

function App() {
  
  const { stateConfirm, dispatchConfirm } = useTSAContext();
  const examInfo = getExamInfo(stateConfirm.isConfirmed);
  const handleStartExam = () => {
    dispatchConfirm({type:"RESET_CHOOSING"});
  };

  const handleBack = () => {
    dispatchConfirm({type: "RESET_CONFIRM", payload: 'none'});
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