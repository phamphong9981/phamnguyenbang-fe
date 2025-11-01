import ExamCard from './ExamCard';

export interface Exam {
  id: string;
  number: number;
  title: string;
  openTime: string;
  duration: string;
  status: 'not-taken' | 'taken';
}

interface ExamListProps {
  exams: Exam[];
  onExamContinue: (examId: string) => void;
}

export default function ExamList({ exams, onExamContinue }: ExamListProps) {
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
            status={exam.status}
            onContinue={() => onExamContinue(exam.id)}
          />
        ))}
      </div>
    </div>
  );
}
