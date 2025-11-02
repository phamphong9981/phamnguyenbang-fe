"use client";

import React from 'react';
// Adjust the import path to your actual MathRenderer component
import MathRenderer from '@/components/MathRenderer';
import { useTSAContext } from '../lam-bai/hooks/TSAProvider';
function MathPage() {
  const {dispatchConfirm} = useTSAContext();
  // dùng hằng số thay vì state
  const selectedIndex: number | null = null;

  const totalQuestions = 40;
  const current = 1; // ví dụ đang ở câu 1
  const answered = new Set([2, 3, 5, 10, 12, 17, 26, 33]); // demo
  const flagged = new Set([8, 15]); // demo
  const percent = Math.round((answered.size / totalQuestions) * 100);

  const options = [
    '$y = x^3 - x$',
    '$y = \\frac{-6x + 2}{x + 1}$',
    '$y = \\tan x$',
    'Đáp án khác',
  ];

  const remainingTime = "52:19"; // Tổng thời gian còn lại (to, trong box)
  const currentQuestionTime = "07:40"; // Thời gian làm câu hiện tại (dưới, thanh dính đáy)
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {/* Header */}
      <header className="w-full border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-3 px-4 py-4 md:flex-row md:items-center">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-md bg-green-600 font-bold text-white">A</div>
            <div className="text-lg font-semibold">
              <span className="text-gray-800">AECK PREMIUM</span>
              <span className="mx-2 hidden text-gray-400 md:inline">|</span>
              <span className="block text-sm text-gray-600 md:inline">
                Tư duy Toán học - Đợt 1
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="rounded-full bg-green-50 px-3 py-1 text-sm font-medium text-green-700">
              Mã đề: AECK541727
            </span>
            {/* Đã bỏ đồng hồ tổng thể khỏi header; chuyển vào box Thông tin thí sinh */}
            <button 
              className="rounded-md bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700 active:bg-green-800"
              onClick = {() => {
                dispatchConfirm({type: "RESET_CHOOSING"});
                dispatchConfirm({type: "RESET_CONFIRM", payload: 'none'});
                dispatchConfirm({type: "MATH_DONE"});
              }}
            >
              Nộp bài
            </button>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-4 py-6 md:grid-cols-3">
        {/* Left: Question panel */}
        <section className="md:col-span-2">
          <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-gray-100 p-4">
              <div className="flex items-center gap-2">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-green-600 text-sm font-semibold text-white">
                  1
                </span>
                <h2 className="text-base font-semibold text-gray-800">
                  Câu hỏi
                </h2>
              </div>
              <div className="flex items-center gap-2">
                {/* Bỏ đồng hồ câu khỏi header câu hỏi */}
                <button
                  title="Đánh dấu"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-md text-gray-500 hover:bg-gray-50 hover:text-green-600"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    className="h-5 w-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.6}
                      d="M5 5v14l7-4 7 4V5a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2Z"
                    />
                  </svg>
                </button>
              </div>
            </div>

            <div className="space-y-6 p-4">
              <div className="text-base leading-relaxed">
                <MathRenderer content="Hàm số nào sau đây không luôn nghịch biến trên từng khoảng xác định?" />
              </div>

              <div className="space-y-3">
                {options.map((opt, idx) => {
                  const active = selectedIndex === idx;
                  return (
                    <label
                      key={idx}
                      className={[
                        'flex cursor-pointer items-start gap-3 rounded-lg border p-3 transition',
                        active
                          ? 'border-green-600 bg-green-50'
                          : 'border-gray-200 hover:border-green-300 hover:bg-green-50/60',
                      ].join(' ')}
                    >
                      <input
                        type="radio"
                        name="q1"
                        className="mt-1 h-4 w-4 cursor-pointer text-green-600 focus:ring-green-600"
                        defaultChecked={active}
                        readOnly
                      />
                      <div className="select-none text-sm md:text-base">
                        <MathRenderer content={opt} />
                      </div>
                    </label>
                  );
                })}
              </div>
              {/* Thanh dính đáy: Prev/Next + đồng hồ câu hiện tại (hiển thị mọi kích thước) */}
              <div className="sticky bottom-0 z-10 mt-6 bg-white/95 backdrop-blur">
                <div className="mx-auto flex max-w-3xl items-center justify-between gap-3 px-3 py-3">
                  <div className="flex items-center gap-2">
                    <button className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:border-green-400 hover:text-green-700">
                      Câu trước
                    </button>
                    <button className="rounded-md bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700 active:bg-green-800">
                      Câu tiếp
                    </button>
                  </div>
                  <div className="flex items-end gap-3">
                    <span className="text-sm text-gray-600">Thời gian làm câu hiện tại</span>
                    <span className="tabular-nums text-2xl font-bold text-gray-900">
                      {currentQuestionTime}
                    </span>
                  </div>
                </div>
              </div>
              {/* Bỏ cụm nút điều hướng trong card (đưa xuống thanh dính đáy) */}
            </div>
          </div>

          
        </section>

        {/* Right: Sidebar */}
        <aside className="space-y-6">
          {/* Candidate info */}
          <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
            <h3 className="mb-3 text-sm font-semibold text-gray-800">Thông tin thí sinh</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Họ tên:</span>
                <span className="font-medium">Hải Ninh</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Mã dự thi:</span>
                <span className="rounded bg-green-50 px-2 py-0.5 font-semibold text-green-700">
                  AECK541727
                </span>
              </div>
            </div>

            {/* Đồng hồ tổng thể (to) */}
            <div className="mt-4 flex items-center justify-between rounded-md bg-gray-50 px-3 py-2">
              <span className="text-sm text-gray-600">Thời gian còn lại</span>
              <span className="tabular-nums text-3xl font-bold text-gray-900">
                {remainingTime}
              </span>
            </div>

            <button className="mt-4 w-full rounded-md bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700">
              Nộp bài
            </button>
          </div>

          {/* Question grid */}
          <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-800">Danh sách câu hỏi</h3>
              <div className="flex items-center gap-2 text-xs">
                <span className="inline-flex h-3 w-3 rounded-full bg-green-600" /> Đã trả lời
                <span className="ml-3 inline-flex h-3 w-3 rounded-full border border-green-600" /> Đang làm
                <span className="ml-3 inline-flex h-3 w-3 rounded-full bg-orange-400" /> Đánh dấu
              </div>
            </div>

            {/* Scrollable + responsive grid, items always circle */}
            <div className="max-h-72 overflow-auto pr-1">
              <div
                className="grid gap-2"
                style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(44px, 1fr))' }}
              >
                {Array.from({ length: totalQuestions }, (_, i) => i + 1).map((n) => {
                  const isCurrent = n === current;
                  const isAnswered = answered.has(n);
                  const isFlagged = flagged.has(n);

                  const base =
                    'flex items-center justify-center w-full rounded-full text-sm font-semibold transition tabular-nums';
                  const cls = isCurrent
                    ? 'border-2 border-green-600 text-green-700 bg-white'
                    : isAnswered
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-700';

                  return (
                    <button
                      key={n}
                      className={`${base} ${cls} relative`}
                      title={`Câu ${n}`}
                      style={{ aspectRatio: '1 / 1' }} // luôn vuông => tròn hoàn hảo với rounded-full
                    >
                      {n}
                      {isFlagged && (
                        <span className="absolute -right-1 -top-1 inline-flex h-2.5 w-2.5 rounded-full bg-orange-400 ring-2 ring-white" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Progress */}
          <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
            <div className="mb-2 flex items-center justify-between text-sm">
              <span className="text-gray-600">Hoàn thành</span>
              <span className="font-semibold text-green-700">
                {percent}%
              </span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
              <div
                className="h-full bg-green-600"
                style={{ width: `${percent}%` }}
              />
            </div>
          </div>
        </aside>
      </main>
    </div>
  );
}

export default MathPage;