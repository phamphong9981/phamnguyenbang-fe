interface ExamNoteBoxProps {
  children: React.ReactNode;
}

export function ExamNoteBox({ children }: ExamNoteBoxProps) {
  return (
    <div className="bg-gray-50 rounded-lg p-4 mt-4">
      <p className="text-gray-600 text-sm italic leading-relaxed">
        {children}
      </p>
    </div>
  );
}