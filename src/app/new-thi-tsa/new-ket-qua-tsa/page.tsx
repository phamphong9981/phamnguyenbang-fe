'use client';

import Header from '@/components/Header';
import { useRouter } from 'next/navigation';

export default function TSAResultPage() {
  const router = useRouter();
  const siteName = 'Lớp toán phân hóa Hạ Long';

  const candidate = {
    name: 'Hải Ninh',
    testDate: '01/11/2025',
    id: 'AECKS41727',
  };

  const overall = {
    score: 6,
    max: 100,
  };

  const sections = [
    {
      key: 'math',
      title: 'Tư duy Toán học',
      sub: 'Mathematical thinking skills',
      correct: 6,
      range: '0 - 40',
    },
    {
      key: 'reading',
      title: 'Tư duy Đọc hiểu',
      sub: 'Reading comprehension skills',
      correct: 0,
      range: '0 - 20',
    },
    {
      key: 'science',
      title: 'Tư duy Khoa học/Giải quyết vấn đề',
      sub: 'Scientific thinking skills/Problem-solving thinking skills',
      correct: 0,
      range: '0 - 40',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Header />
      <main className="mx-auto max-w-5xl px-4 py-6">
        <h1 className="text-center text-lg md:text-xl font-semibold text-gray-900">
          KẾT QUẢ BÀI THI ĐÁNH GIÁ TƯ DUY TSA - {siteName.toUpperCase()}
        </h1>

        <section className="mt-4 rounded-xl border border-gray-200 bg-white p-4 md:p-5 shadow-sm">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="flex items-center justify-between md:block">
              <div className="text-sm text-gray-600">Người dự thi - <span className="italic">Candidate name:</span></div>
              <div className="mt-2 inline-flex items-center rounded-lg bg-green-50 px-3 py-2 text-sm font-medium text-green-700 ring-1 ring-green-200 shadow-sm">{candidate.name}</div>
            </div>
            <div className="flex items-center justify-between md:block">
              <div className="text-sm text-gray-600">Ngày thi - <span className="italic">Test date:</span></div>
              <div className="mt-2 inline-flex items-center rounded-lg bg-green-50 px-3 py-2 text-sm font-medium text-green-700 ring-1 ring-green-200 shadow-sm">{candidate.testDate}</div>
            </div>
            <div className="flex items-center justify-between md:block">
              <div className="text-sm text-gray-600">Số báo danh - <span className="italic">Candidate ID:</span></div>
              <div className="mt-2 inline-flex items-center rounded-lg bg-green-50 px-3 py-2 text-sm font-medium text-green-700 ring-1 ring-green-200 shadow-sm">{candidate.id}</div>
            </div>
          </div>
        </section>

        <section className="mt-5 grid grid-cols-1 lg:grid-cols-7 gap-3">
          <div className="lg:col-span-4 rounded-xl border border-gray-200 bg-gradient-to-br from-green-600 to-green-700 shadow-sm overflow-hidden">
            <div className="px-6 py-4 text-white">
              <div className="text-lg font-semibold">Điểm bài thi</div>
              <div className="text-xs opacity-90">Overall score</div>
            </div>
            <div className="px-6 py-8">
              <div className="flex items-end gap-3">
                <div className="text-6xl font-semibold text-white drop-shadow-sm">{overall.score}</div>
                <div className="pb-1 text-sm text-white">0 - {overall.max}</div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-3 rounded-xl overflow-hidden">
            <div className="px-6 pb-4">
              <div className="text-base font-semibold text-gray-900">Số câu đúng - <span className="italic text-gray-600">Correct answers:</span></div>
            </div>
            <div className="px-4 space-y-4">
              {sections.map((s) => (
                <div
                  key={s.key}
                  className="flex items-center justify-center gap-3 rounded-lg border border-gray-100 bg-gradient-to-br from-green-600 to-green-700 p-3"
                >
                  <div className="h-16 w-16 mr-4 md:mr-0 shrink-0 px-2 py-2 rounded-md bg-green-50 text-green-700 ring-1 ring-green-200">
                    <div className="text-lg font-semibold">{s.correct}</div>
                    <div className="text-[10px] text-green-700/80">{s.range}</div>
                  </div>
                  <div className="flex-1 flex flex-col justify-center">
                    <div className="text-base font-semibold text-white mb-1">{s.title}</div>
                    <div className="text-[11px] text-white">{s.sub}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <button
            onClick={() => router.back()}
            className="w-full md:w-auto inline-flex items-center justify-center rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 active:scale-[0.99] transition"
          >
            ← Quay lại
          </button>

          <div className="flex items-center gap-3">
            <div className="text-sm text-gray-600">Xem đáp án:</div>
            <select
              className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400"
            >
              <option value="all">Chọn môn thi</option>
              <option value="math">Tư duy Toán học</option>
              <option value="reading">Tư duy Đọc hiểu</option>
              <option value="science">Tư duy Khoa học/Giải quyết vấn đề</option>
            </select>
          </div>
        </section>
      </main>
    </div>
  );
}
