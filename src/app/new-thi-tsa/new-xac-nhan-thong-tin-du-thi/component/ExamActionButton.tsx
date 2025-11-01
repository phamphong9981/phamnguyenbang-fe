import { ArrowLeft, HelpCircle } from 'lucide-react';

interface ExamActionButtonsProps {
  onBack?: () => void;
  onHelp?: () => void;
}

export function ExamActionButtons({ onBack, onHelp }: ExamActionButtonsProps) {
  return (
    <div className="flex justify-between items-center mt-8">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-red-600 font-medium hover:text-red-700 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Quay lại
      </button>
      <button
        onClick={onHelp}
        className="flex items-center gap-2 text-gray-500 font-medium hover:text-gray-600 transition-colors"
      >
        <HelpCircle className="w-4 h-4" />
        Hướng dẫn
      </button>
    </div>
  );
}