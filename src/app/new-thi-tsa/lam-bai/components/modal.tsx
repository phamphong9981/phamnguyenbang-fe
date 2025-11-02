import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';

type FullscreenModalProps = {
  visibility: boolean;
  setVisibility: React.Dispatch<React.SetStateAction<boolean>>;
  title?: string;
  description?: string;
  confirmText?: string;
};

const defaultTexts = {
  title: 'Yêu cầu bật chế độ toàn màn hình',
  description: 'Để tiếp tục làm bài, vui lòng chuyển sang chế độ toàn màn hình.',
  confirmText: 'Bật toàn màn hình',
};

export default function FullscreenModal({
  visibility,
  setVisibility,
  title,
  description,
  confirmText,
}: FullscreenModalProps) {
  useEffect(() => {
    if (!visibility) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [visibility]);

  if (typeof window === 'undefined' || !visibility) return null;

  const content = (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[9999] flex items-center justify-center p-6"
      style={{ background: 'rgba(0,0,0,0.8)' }}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="w-[92vw] max-w-[560px] mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-green-600 h-2 w-full" />
        <div className="p-5 sm:p-6 text-center">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900">
            {title ?? defaultTexts.title}
          </h2>
          <p className="mt-2 text-sm sm:text-base text-gray-600">
            {description ?? defaultTexts.description}
          </p>

          <button
            type="button"
            className="mt-4 inline-flex items-center justify-center w-full max-w-[280px] mx-auto rounded-lg bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-3 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
            onClick={() => setVisibility(false)}
          >
            {confirmText ?? defaultTexts.confirmText}
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(content, document.body);
}
