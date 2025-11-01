import { ExamHeader } from './ExamHeader';
import { ExamInfoRow } from './ExamInfoRow';
import { ExamNoteBox } from './ExamNoteBox';
import { ExamActionButtons } from './ExamActionButton';

interface ExamInfo {
  studentName: string;
  examType: string;
  duration: string;
  questionCount: string;
}

interface ExamConfirmCardProps {
  examInfo: ExamInfo;
  onStartExam: () => void;
  onBack?: () => void;
  onHelp?: () => void;
}

export function ExamConfirmCard({ 
  examInfo, 
  onStartExam, 
  onBack, 
  onHelp 
}: ExamConfirmCardProps) {
  return (
    <div className="bg-white rounded-2xl shadow-xl p-10 w-full max-w-2xl">
      <ExamHeader />
      
      <h2 className="text-2xl font-bold text-gray-900 text-center mb-8 mt-7">
        Xác nhận thông tin dự thi
      </h2>

      <div className="space-y-0">
        <ExamInfoRow label="Họ tên" value={examInfo.studentName} />
        <ExamInfoRow label="Kíp thi" value={examInfo.examType} />
        <ExamInfoRow label="Thời gian làm bài" value={examInfo.duration} />
        <ExamInfoRow label="Số lượng câu hỏi" value={examInfo.questionCount} />
      </div>

      <ExamNoteBox>
        <span className="font-semibold">Lưu ý:</span> Bằng việc nhấn nút{' '}
        <span className="font-bold">"Bắt đầu thi"</span> hệ thống sẽ bắt đầu tính giờ cho bài thi của bạn
      </ExamNoteBox>

      <button
        onClick={onStartExam}
        className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-6 rounded-lg mt-6 transition-colors duration-200 shadow-md hover:shadow-lg"
      >
        Bắt đầu thi
      </button>

      <ExamActionButtons onBack={onBack} onHelp={onHelp} />
    </div>
  );
}