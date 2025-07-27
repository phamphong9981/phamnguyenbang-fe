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

            {/* Zalo */}
            <a
                href="https://zalo.me/0932701333"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 sm:w-14 h-10 sm:h-14 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 group"
                title="Zalo"
            >
                <img
                    src="/zalo.webp"
                    alt="Zalo"
                    className="w-10 sm:w-14 h-10 sm:h-14 object-contain"
                />
                <span className="absolute right-full mr-3 px-2 py-1 bg-gray-900 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                    Zalo
                </span>
            </a>
        </div>
    );
} 