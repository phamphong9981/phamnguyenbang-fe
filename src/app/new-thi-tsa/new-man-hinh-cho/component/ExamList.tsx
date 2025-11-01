import ExamCard from './ExamCard';
import { useTSAContext } from '../../lam-bai/hooks/TSAProvider';
export interface Exam {
  id: string;
  number: number;
  title: string;
  openTime: string;
  duration: string;
}

interface ExamListProps {
  exams: Exam[];
}

export default function ExamList({ exams }: ExamListProps) {
  const { stateConfirm, dispatchConfirm } = useTSAContext();
  const getStatus = (title: string) => {
    if (title === 'Tư duy Toán học') return stateConfirm.isMathDone;
    if (title === 'Tư duy Đọc hiểu') return stateConfirm.isReadingDone;
    if (title === 'Tư duy Khoa học & Giải quyết vấn đề') return stateConfirm.isScienceDone;
  }
  return (
    <div>
      <h2 className="text-xl font-bold text-gray-800 mb-4">Danh sách bài thi</h2>
      <div>
        {exams.map((exam) => (
          <ExamCard
            key={exam.id}
            number={exam.number}
            title={exam.title}
            openTime={exam.openTime}
            duration={exam.duration}
            status={getStatus(exam.title)}
            onContinue={() => {
              dispatchConfirm({type: "RESET_CONFIRM", payload: exam.title});
              dispatchConfirm({type: "RESET_CHOOSING"});
            }}
          />
        ))}
      </div>
    </div>
  );
}
