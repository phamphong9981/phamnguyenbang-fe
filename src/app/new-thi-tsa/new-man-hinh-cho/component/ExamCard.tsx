interface ExamCardProps {
  number: number;
  title: string;
  openTime: string;
  duration: string;
  status: boolean;
  onContinue: () => void;
}

export default function ExamCard({
  number,
  title,
  openTime,
  duration,
  status,
  onContinue
}: ExamCardProps) {
  return (
    <div className="border border-gray-200 rounded-lg p-5 mb-4 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-green-700 mb-3">
            {number}. {title}
          </h3>

          <div className="space-y-2 text-sm">
            <div className="flex gap-2">
              <span className="font-semibold text-gray-700">Giờ mở kíp:</span>
              <span className="text-gray-600">{openTime}</span>
            </div>

            <div className="flex gap-4">
              <div className="flex gap-2">
                <span className="font-semibold text-gray-700">Thời gian:</span>
                <span className="text-gray-600">{duration}</span>
              </div>

              <div className="flex gap-2">
                <span className="font-semibold text-gray-700">Trạng thái:</span>
                <span className={status ? "text-green-600 font-semibold" : "text-gray-600"}>
                  {status ? "Đã thi" : "Chưa thi"}
                </span>
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={onContinue}
          className={`ml-4 px-6 py-2 rounded-md font-medium transition-colors ${
            status
              ? 'bg-white text-green-700 border-2 border-green-300 hover:bg-blue-50'
              : 'bg-green-600 text-white hover:bg-green-700'
          }`}
        >
          {status ? "Hoàn thành" : "Tiếp tục"}
        </button>
      </div>
    </div>
  );
}
