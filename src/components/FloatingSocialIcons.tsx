'use client';

export default function FloatingSocialIcons() {
    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
            {/* Facebook */}
            <a
                href="https://www.facebook.com/toanhocthaybang"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 sm:w-14 h-10 sm:h-14 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 group"
                title="Facebook"
            >
                <img
                    src="/facebook.png"
                    alt="Facebook"
                    className="w-10 sm:w-14 h-10 sm:h-14 object-contain"
                />
                <span className="absolute right-full mr-3 px-2 py-1 bg-gray-900 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                    Facebook
                </span>
            </a>

            {/* Messenger */}
            <a
                href="https://m.me/toanhocthaybang"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 sm:w-14 h-10 sm:h-14 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 group"
                title="Messenger"
            >
                <img
                    src="/messenger.webp"
                    alt="Messenger"
                    className="w-10 sm:w-14 h-10 sm:h-14 object-contain"
                />
                <span className="absolute right-full mr-3 px-2 py-1 bg-gray-900 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                    Messenger
                </span>
            </a>

            {/* Phone Call */}
            <a
                href="tel:0932701333"
                className="w-10 sm:w-14 h-10 sm:h-14 bg-green-600 hover:bg-green-700 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 group"
                title="Gọi điện"
            >
                <svg className="w-7 sm:w-10 h-7 sm:h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span className="absolute right-full mr-3 px-2 py-1 bg-gray-900 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                    Gọi điện
                </span>
            </a>
        </div>
    );
} 