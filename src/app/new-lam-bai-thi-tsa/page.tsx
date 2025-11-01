import Header from './component/Header';
import ExamDashboard from './component/ExamDashboard';
import { Exam } from './component/ExamList';

function App() {
  const examData: Exam[] = [
    {
      id: '1',
      number: 1,
      title: 'Tự duy Toán học',
      openTime: '09:13 13/08/2025 – 09:13 15/08/2025',
      duration: '60 phút',
      status: 'not-taken'
    },
    {
      id: '2',
      number: 2,
      title: 'Tự duy Đọc hiểu',
      openTime: '20:16 19/08/2025 – 20:16 25/08/2025',
      duration: '30 phút',
      status: 'taken'
    },
    {
      id: '3',
      number: 3,
      title: 'Tự duy Khoa học & Giải quyết vấn đề',
      openTime: '22:29 20/08/2025 – 22:29 26/08/2025',
      duration: '60 phút',
      status: 'taken'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-pink-50">
      <Header
        title="LỚP TOÁN PHÂN HÓA HẠ LONG"
        subtitle="Thi thử Đánh giá Tư duy - Đợt 1"
      />

      <ExamDashboard
        userName="Hải Ninh"
        userId="AECK541727"
        accountStatus="Premium"
        title="Thi thử Đánh giá Tư duy - Đợt 1"
        exams={examData}
      />
    </div>
  );
}

export default App;
