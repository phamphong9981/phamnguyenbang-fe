import Image from 'next/image';

interface ExamHeaderProps {
  subtitle?: string;
}

export function ExamHeader({ 
  subtitle = "Khám phá tiềm năng của Bạn"
}: ExamHeaderProps) {
  return (
    <div className="flex flex-row justify-center flex-1 gap-7">
      <Image 
        src = '/logo.jpg'
        alt = 'logo'
        width={70}
        height={60}
        className = 'rounded-full'
      />
      <div className="flex flex-col justify-center">
        <p className="text-2xl font-bold text-gray-800">
          LỚP TOÁN PHÂN HÓA HẠ LONG
        </p>
        <p className="text-xl text-gray-600 mt-[-1]">{subtitle}</p>
      </div>
    </div>
  );
}