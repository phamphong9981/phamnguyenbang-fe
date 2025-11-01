interface ExamInfoRowProps {
  label: string;
  value: string;
}

export function ExamInfoRow({ label, value }: ExamInfoRowProps) {
  return (
    <div className="flex justify-between items-center py-3 border-b border-gray-200 last:border-b-0">
      <span className="text-gray-600 font-normal">{label}</span>
      <span className="text-gray-900 font-semibold text-right">{value}</span>
    </div>
  );
}