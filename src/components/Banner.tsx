import Image from 'next/image';
import Link from 'next/link';

export default function Banner() {
    return (
        <>
            {/* Banner Image Section */}
            <section className="relative w-full bg-gray-100 p-4 sm:p-6 lg:p-8">
                <Image
                    src="/banner.jpg"
                    alt="Banner Trung tâm Giáo dục"
                    width={1920}
                    height={1080}
                    className="w-full h-auto object-contain"
                    priority
                />
            </section>

            {/* Content Section with Green Background */}
            <section className="bg-gradient-to-br from-green-600 via-green-700 to-green-800 py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center text-white">
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                            Khám phá Tiềm năng
                            <span className="block text-yellow-300">Của Bạn</span>
                        </h1>

                        <p className="text-lg sm:text-xl lg:text-2xl mb-8 text-gray-100 leading-relaxed max-w-4xl mx-auto">
                            Chúng tôi cam kết mang đến những khóa học chất lượng cao,
                            giúp bạn phát triển kỹ năng và đạt được mục tiêu trong sự nghiệp
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
                            <Link
                                href="/khoa-hoc"
                                className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg"
                            >
                                Khám phá khóa học
                            </Link>

                            <Link
                                href="/ve-chung-toi"
                                className="border-2 border-white text-white hover:bg-white hover:text-green-700 px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-300 transform hover:scale-105"
                            >
                                Tìm hiểu thêm
                            </Link>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-4xl mx-auto">
                            <div className="text-center">
                                <div className="text-3xl sm:text-4xl font-bold text-yellow-300 mb-2">500+</div>
                                <div className="text-gray-100">Học viên đã tốt nghiệp</div>
                            </div>
                            <div className="text-center">
                                <div className="text-3xl sm:text-4xl font-bold text-yellow-300 mb-2">50+</div>
                                <div className="text-gray-100">Khóa học đa dạng</div>
                            </div>
                            <div className="text-center">
                                <div className="text-3xl sm:text-4xl font-bold text-yellow-300 mb-2">95%</div>
                                <div className="text-gray-100">Tỷ lệ hài lòng</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
} 