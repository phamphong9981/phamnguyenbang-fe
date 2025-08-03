'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface Student {
    id: number;
    name: string;
    school: string;
    examYear: number;
    achievement: string;
    avatar: string;
    description: string;
}

const realStudents: Student[] = [
    {
        id: 1,
        name: "Hải Linh",
        school: "THPT Chuyên Hạ Long",
        examYear: 2019,
        achievement: "Á khoa khối B Tỉnh Quảng Ninh",
        avatar: "/outstanding-students/1.jpg",
        description: "Theo học ngành Y Đa Khoa - ĐH Y Hà Nội"
    },
    {
        id: 2,
        name: "Nguyễn Duy Khánh",
        school: "THPT Chuyên Hạ Long",
        examYear: 2020,
        achievement: "Thủ khoa Khối B Tỉnh Quảng Ninh",
        avatar: "/outstanding-students/2.jpg",
        description: "Theo học ngành Y Đa Khoa - ĐH Y Hà Nội"
    },
    {
        id: 3,
        name: "Nguyễn Mạnh Dũng",
        school: "THPT Chuyên Hạ Long",
        examYear: 2020,
        achievement: "Á khoa Khối A Tỉnh Quảng Ninh",
        avatar: "/outstanding-students/3.jpg",
        description: "Theo học tại đại học Bách Khoa Hà Nội"
    },
    {
        id: 4,
        name: "Vân Trinh",
        school: "THPT Chuyên Hạ Long",
        examYear: 2019,
        achievement: "Thủ khoa ngành RHM đại học Y Hải Phòng",
        avatar: "/outstanding-students/4.jpg",
        description: "Theo học ngành Răng Hàm Mặt ĐH Y Hải Phòng"
    },
    {
        id: 5,
        name: "Khánh Linh",
        school: "THPT Chuyên Hạ Long",
        examYear: 2020,
        achievement: "Thủ khoa THPT Chuyên Hạ Long",
        avatar: "/outstanding-students/5.jpg",
        description: "Theo học tại ĐH Ngoại Thương"
    },
    {
        id: 6,
        name: "Bùi Mạnh Tường",
        school: "THPT Chuyên Hạ Long",
        examYear: 2021,
        achievement: "Thủ khoa khối B tỉnh Quảng Ninh",
        avatar: "/outstanding-students/6.jpg",
        description: "Theo học ngành Y Đa khoa ĐH Y Hà Nội"
    },
    {
        id: 7,
        name: "Nguyễn Văn Hoàng",
        school: "THPT Bạch Đằng",
        examYear: 2016,
        achievement: "Thủ khoa khối A Tỉnh Quảng Ninh",
        avatar: "/outstanding-students/7.jpg",
        description: "Theo học tại ĐH Bách Khoa Hà Nội, nhận được học bổng ngành Kĩ thuật Hàng Không tại Hàn Quốc"
    },
    {
        id: 8,
        name: "Mạnh Tuấn Hưng",
        school: "THPT Chuyên Hạ Long",
        examYear: 2019,
        achievement: "Nhận được học bổng đại học tại Mỹ",
        avatar: "/outstanding-students/8.jpg",
        description: "Nhận được học bổng ĐH tại Mỹ năm 2019"
    },
    {
        id: 9,
        name: "Đào Xuân Hùng",
        school: "THPT Chuyên Hạ Long",
        examYear: 2023,
        achievement: "Thủ khoa khối A Tỉnh Quảng Ninh",
        avatar: "/outstanding-students/9.jpg",
        description: "Theo học ngành IT1 - ĐH Bách Khoa Hà Nội"
    },
    {
        id: 10,
        name: "Đường Thanh Mai",
        school: "THPT Chuyên Hạ Long",
        examYear: 2017,
        achievement: "Thủ khoa khối A01 Tỉnh Quảng Ninh - Thủ khoa Học Viện Cảnh Sát",
        avatar: "/outstanding-students/10.jpg",
        description: "Theo học Học Viện Cảnh Sát"
    },
    {
        id: 11,
        name: "Ngọc Ánh",
        school: "THPT Chuyên Hạ Long",
        examYear: 2019,
        achievement: "Á khoa khối D Tỉnh Quảng Ninh",
        avatar: "/outstanding-students/11.jpg",
        description: "Theo học tại ĐH Ngoại Thương"
    },
    {
        id: 12,
        name: "Trần Thu Loan",
        school: "THPT Chuyên Hạ Long",
        examYear: 2018,
        achievement: "Á khoa khối B Tỉnh Quảng Ninh",
        avatar: "/outstanding-students/12.jpg",
        description: "Theo học ngành Y Đa khoa ĐH Y Hà Nội"
    },
    {
        id: 13,
        name: "Nguyễn Hiếu",
        school: "THPT Chuyên Hạ Long",
        examYear: 2021,
        achievement: "Thủ khoa khối D07 Tỉnh Quảng Ninh",
        avatar: "/outstanding-students/13.jpg",
        description: "Theo học tại ĐH Ngoại Thương"
    },
    {
        id: 14,
        name: "Vũ Thắng",
        school: "THPT Bạch Đằng",
        examYear: 2018,
        achievement: "Á khoa khối A Tỉnh Quảng Ninh",
        avatar: "/outstanding-students/14.png",
        description: "Theo học ngành IT1 - ĐH Bách Khoa Hà Nội"
    },
    {
        id: 15,
        name: "Nguyễn Thanh Bình",
        school: "THPT Chuyên Hạ Long",
        examYear: 2019,
        achievement: "Thủ khoa Khối B Tỉnh Quảng Ninh",
        avatar: "/outstanding-students/15.jpg",
        description: "Theo học ngành Y Đa khoa ĐH Y Hà Nội"
    },
    {
        id: 16,
        name: "Phạm Quang Long",
        school: "THPT Chuyên Hạ Long",
        examYear: 2018,
        achievement: "Thủ khoa khối A01 Tỉnh Quảng Ninh",
        avatar: "/outstanding-students/16.jpg",
        description: "Theo học tại ĐH Bách Khoa Hà Nội"
    },
    {
        id: 17,
        name: "Bùi Lê Thành An",
        school: "THPT Chuyên Hạ Long",
        examYear: 2021,
        achievement: "Thủ khoa khối D07 Tỉnh Quảng Ninh",
        avatar: "/outstanding-students/17.jpg",
        description: "Theo học tại ĐH Ngoại Thương"
    },
    {
        id: 18,
        name: "Nguyễn Thanh Thái",
        school: "THPT Chuyên Hạ Long",
        examYear: 2019,
        achievement: "Thủ khoa khối C04 Toàn Quốc",
        avatar: "/outstanding-students/18.png",
        description: "Theo học tại ĐH Kinh Tế Quốc Dân"
    },
    {
        id: 19,
        name: "Đặng Duy Long",
        school: "THPT Chuyên Hạ Long",
        examYear: 2018,
        achievement: "Á khoa khối A Tỉnh Quảng Ninh",
        avatar: "/outstanding-students/19.jpg",
        description: "Theo học tại ĐH Bách Khoa Hà Nội"
    },
    {
        id: 20,
        name: "Xuân Mai",
        school: "THPT Hòn Gai",
        examYear: 2020,
        achievement: "Á khoa Toàn Quốc",
        avatar: "/outstanding-students/20.jpg",
        description: "Theo học tại ĐH Bách Khoa Hà Nội"
    },
    {
        id: 21,
        name: "Nhật Mai",
        school: "THPT Chuyên Hạ Long",
        examYear: 2017,
        achievement: "Á khoa khối A01 Tỉnh Quảng Ninh",
        avatar: "/outstanding-students/21.jpg",
        description: "Theo học tại ĐH Ngoại Thương"
    },
    {
        id: 22,
        name: "Anh Tuấn",
        school: "THPT Chuyên Hạ Long",
        examYear: 2021,
        achievement: "Thủ khoa khối A Tỉnh",
        avatar: "/outstanding-students/22.jpg",
        description: "Theo học tại ĐH Bách Khoa Hà Nội"
    },
    {
        id: 23,
        name: "Hiền Mai",
        school: "THPT Chuyên Hạ Long",
        examYear: 2022,
        achievement: "Thủ khoa Khối D Chuyên Hạ Long",
        avatar: "/outstanding-students/23.jpg",
        description: "Theo học tại ĐH Kinh Tế Quốc Dân"
    },
    {
        id: 24,
        name: "Đức Hiếu",
        school: "THPT Chuyên Hạ Long",
        examYear: 2017,
        achievement: "Á khoa Khối A Tỉnh Quảng Ninh",
        avatar: "/outstanding-students/24.jpg",
        description: "Theo học tại ĐHSP Hà Nội"
    },
    {
        id: 25,
        name: "Hoàng Minh Hiếu",
        school: "THPT Chuyên Hạ Long",
        examYear: 2024,
        achievement: "Thủ khoa khối D07 Tỉnh Quảng Ninh",
        avatar: "/outstanding-students/25.jpg",
        description: "Theo học tại ĐH Bách Khoa Hà Nội"
    },
    {
        id: 26,
        name: "Phạm Trường Phát",
        school: "THPT Chuyên Hạ Long",
        examYear: 2023,
        achievement: "Thủ khoa khối D07 Tỉnh Quảng Ninh",
        avatar: "/outstanding-students/26.jpg",
        description: "Theo học tại ĐH Kinh Tế Quốc Dân"
    },
    {
        id: 27,
        name: "Châu Bùi Minh Phong",
        school: "THPT Chuyên Hạ Long",
        examYear: 2025,
        achievement: "Á khoa khối C03 Tỉnh Quảng Ninh",
        avatar: "/outstanding-students/27.jpg",
        description: "Học sinh xuất sắc mới nhất"
    }
];

export default function OutstandingStudents() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);

    // Sắp xếp học sinh theo thứ tự ưu tiên achievement
    const sortedStudents = [...realStudents].sort((a, b) => {
        const getPriority = (achievement: string) => {
            if (achievement.includes('Thủ khoa') && achievement.includes('Toàn Quốc')) return 1;
            if (achievement.includes('Á khoa') && achievement.includes('Toàn Quốc')) return 2;
            if (achievement.includes('Thủ khoa') && achievement.includes('Tỉnh')) return 3;
            if (achievement.includes('Á khoa') && achievement.includes('Tỉnh')) return 4;
            if (achievement.includes('Thủ khoa') && achievement.includes('trường')) return 5;
            if (achievement.includes('Thủ khoa') && achievement.includes('Chuyên')) return 5;
            if (achievement.includes('Thủ khoa') && achievement.includes('Học Viện')) return 3;
            if (achievement.includes('Thủ khoa')) return 5; // Mặc định cho thủ khoa
            if (achievement.includes('Á khoa')) return 5; // Mặc định cho á khoa
            return 6; // Các trường hợp khác
        };

        const priorityA = getPriority(a.achievement);
        const priorityB = getPriority(b.achievement);

        if (priorityA !== priorityB) {
            return priorityA - priorityB;
        }

        // Nếu cùng priority, sắp xếp theo năm thi (mới nhất trước)
        return b.examYear - a.examYear;
    });

    useEffect(() => {
        if (!isAutoPlaying) return;

        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % sortedStudents.length);
        }, 4000);

        return () => clearInterval(interval);
    }, [isAutoPlaying, sortedStudents.length]);

    const nextSlide = () => {
        setCurrentIndex((prev) => (prev + 1) % sortedStudents.length);
        setIsAutoPlaying(false);
    };

    const prevSlide = () => {
        setCurrentIndex((prev) => (prev - 1 + sortedStudents.length) % sortedStudents.length);
        setIsAutoPlaying(false);
    };

    const goToSlide = (index: number) => {
        setCurrentIndex(index);
        setIsAutoPlaying(false);
    };

    // Calculate statistics from sorted data
    const totalStudents = sortedStudents.length;
    const thukhoaCount = sortedStudents.filter(s => s.achievement.includes('Thủ') || s.achievement.includes('thủ')).length;
    const akhoaCount = sortedStudents.filter(s => s.achievement.includes('Á') || s.achievement.includes('á')).length;
    const uniqueYears = new Set(sortedStudents.map(s => s.examYear)).size;

    return (
        <section className="py-16 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                        Học sinh nổi bật
                    </h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Những thành tích đáng tự hào của các học sinh xuất sắc từ trung tâm chúng tôi
                    </p>
                </div>

                <div className="relative">
                    {/* Book container */}
                    <div className="relative mx-auto max-w-6xl px-4">
                        {/* Book spine shadow - hidden on mobile */}
                        <div className="hidden lg:block absolute inset-0 bg-gradient-to-r from-gray-800 via-gray-600 to-gray-800 rounded-3xl transform rotate-y-12 scale-95 opacity-20 blur-sm"></div>

                        {/* Main book */}
                        <div className="relative bg-gradient-to-br from-emerald-50 via-white to-emerald-100 rounded-2xl lg:rounded-3xl shadow-xl lg:shadow-2xl border-4 lg:border-8 border-green-200 overflow-hidden">
                            {/* Book cover texture */}
                            <div className="absolute inset-0 bg-gradient-to-br from-emerald-200/20 to-transparent"></div>

                            {/* Page content */}
                            <div className="relative">
                                {/* Page flip animation container */}
                                <div className="relative h-[500px] sm:h-[550px] lg:h-[600px] overflow-hidden">
                                    <div
                                        className="flex transition-all duration-700 ease-in-out"
                                        style={{
                                            transform: `translateX(-${currentIndex * 100}%)`,
                                            perspective: '1000px'
                                        }}
                                    >
                                        {sortedStudents.map((student, index) => (
                                            <div key={student.id} className="w-full flex-shrink-0">
                                                <div className="p-4 sm:p-6 lg:p-12 h-full">
                                                    {/* Page number */}
                                                    <div className="absolute top-2 right-4 lg:top-4 lg:right-6 text-emerald-600 font-serif text-xs lg:text-sm">
                                                        {index + 1} / {sortedStudents.length}
                                                    </div>

                                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 items-center h-full">
                                                        {/* Left page - Student info */}
                                                        <div className="text-center lg:text-left order-2 lg:order-1">
                                                            <div className="mb-4 sm:mb-6 lg:mb-8">
                                                                <h3 className="text-2xl sm:text-3xl lg:text-5xl font-bold text-gray-900 mb-2 sm:mb-4">
                                                                    {student.name}
                                                                </h3>
                                                                <div className="w-16 sm:w-20 lg:w-24 h-1 bg-gradient-to-r from-emerald-400 to-emerald-500 mx-auto lg:mx-0 mb-2 sm:mb-4 rounded-full"></div>
                                                                <p className="text-base sm:text-lg lg:text-xl text-gray-600 mb-1 sm:mb-2 font-medium">
                                                                    {student.school}
                                                                </p>
                                                                <p className="text-sm sm:text-base lg:text-lg text-emerald-600 font-semibold">
                                                                    Năm thi: {student.examYear}
                                                                </p>
                                                            </div>

                                                            {/* Achievement badge */}
                                                            <div className="relative mb-4 sm:mb-6 lg:mb-8">
                                                                <div className="bg-gradient-to-r from-emerald-500 to-green-600 text-white px-4 sm:px-6 lg:px-8 py-3 sm:py-4 lg:py-6 rounded-xl lg:rounded-2xl shadow-lg lg:shadow-xl transform hover:scale-105 transition-transform duration-300">
                                                                    <div className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 w-6 h-6 sm:w-8 sm:h-8 bg-emerald-400 rounded-full flex items-center justify-center shadow-lg">
                                                                        <span className="text-xs sm:text-sm">
                                                                            {student.achievement.includes('Thủ') || student.achievement.includes('thủ') ? '🥇' : '🥈'}
                                                                        </span>
                                                                    </div>
                                                                    <span className="font-bold text-sm sm:text-lg lg:text-xl block leading-tight">
                                                                        {student.achievement}
                                                                    </span>
                                                                </div>
                                                            </div>

                                                            <p className="text-gray-700 leading-relaxed text-sm sm:text-base lg:text-lg font-medium">
                                                                {student.description}
                                                            </p>
                                                        </div>

                                                        {/* Right page - Student avatar */}
                                                        <div className="flex justify-center lg:justify-end order-1 lg:order-2">
                                                            <div className="relative group">
                                                                {/* Photo frame */}
                                                                <div className="relative w-48 h-60 sm:w-64 sm:h-80 lg:w-96 lg:h-[500px] rounded-xl lg:rounded-2xl overflow-hidden border-4 lg:border-8 border-emerald-300 shadow-lg lg:shadow-2xl transform group-hover:scale-105 transition-transform duration-500">
                                                                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-200/20 to-transparent z-10"></div>
                                                                    <Image
                                                                        src={student.avatar}
                                                                        alt={student.name}
                                                                        width={384}
                                                                        height={500}
                                                                        className="w-full h-full object-cover"
                                                                        style={{ objectPosition: 'center 20%' }}
                                                                        priority={currentIndex === sortedStudents.findIndex(s => s.id === student.id)}
                                                                    />
                                                                </div>

                                                                {/* Decorative corner - smaller on mobile */}
                                                                <div className="absolute -top-2 -right-2 sm:-top-4 sm:-right-4 w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16 bg-gradient-to-br from-emerald-400 to-green-500 rounded-full flex items-center justify-center shadow-lg lg:shadow-xl transform rotate-12">
                                                                    <div className="w-7 h-7 sm:w-9 sm:h-9 lg:w-12 lg:h-12 bg-white rounded-full flex items-center justify-center">
                                                                        <span className="text-emerald-600 font-bold text-xs sm:text-sm lg:text-lg">
                                                                            {index + 1}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Book navigation */}
                    <div className="flex justify-center mt-8 sm:mt-10 lg:mt-12 space-x-4 sm:space-x-6">
                        <button
                            onClick={prevSlide}
                            className="group bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white p-3 sm:p-4 rounded-full shadow-lg lg:shadow-xl transition-all duration-300 transform hover:scale-110 hover:rotate-12"
                        >
                            <svg className="w-6 h-6 sm:w-8 sm:h-8 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>

                        <button
                            onClick={nextSlide}
                            className="group bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white p-3 sm:p-4 rounded-full shadow-lg lg:shadow-xl transition-all duration-300 transform hover:scale-110 hover:-rotate-12"
                        >
                            <svg className="w-6 h-6 sm:w-8 sm:h-8 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    </div>

                    {/* Page indicators */}
                    <div className="flex justify-center mt-6 sm:mt-8 space-x-2 sm:space-x-3">
                        {sortedStudents.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => goToSlide(index)}
                                className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-300 transform hover:scale-125 ${index === currentIndex
                                    ? 'bg-gradient-to-r from-emerald-500 to-green-600 scale-125 sm:scale-150 shadow-lg'
                                    : 'bg-emerald-300 hover:bg-green-400'
                                    }`}
                            />
                        ))}
                    </div>
                </div>

                {/* Stats section */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16">
                    <div className="text-center p-8 bg-gradient-to-br from-green-50 to-green-100 rounded-2xl shadow-lg border border-green-200">
                        <div className="text-4xl font-bold text-green-600 mb-3">{thukhoaCount}</div>
                        <div className="text-gray-700 font-semibold">Thủ khoa</div>
                    </div>
                    <div className="text-center p-8 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl shadow-lg border border-blue-200">
                        <div className="text-4xl font-bold text-blue-600 mb-3">{akhoaCount}</div>
                        <div className="text-gray-700 font-semibold">Á khoa</div>
                    </div>
                    <div className="text-center p-8 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-2xl shadow-lg border border-yellow-200">
                        <div className="text-4xl font-bold text-yellow-600 mb-3">{totalStudents}</div>
                        <div className="text-gray-700 font-semibold">Học sinh xuất sắc</div>
                    </div>
                    <div className="text-center p-8 bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl shadow-lg border border-purple-200">
                        <div className="text-4xl font-bold text-purple-600 mb-3">{uniqueYears}</div>
                        <div className="text-gray-700 font-semibold">Năm liên tiếp</div>
                    </div>
                </div>
            </div>
        </section>
    );
} 