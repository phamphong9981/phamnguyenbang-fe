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
        achievement: "Á Khoa khối B Tỉnh Quảng Ninh",
        avatar: "/outstanding-students/1.jpg",
        description: "Theo học ngành Y Đa Khoa - ĐH Y Hà Nội"
    },
    {
        id: 2,
        name: "Nguyễn Duy Khánh",
        school: "THPT Chuyên Hạ Long",
        examYear: 2020,
        achievement: "Thủ Khoa Khối B Tỉnh Quảng Ninh",
        avatar: "/outstanding-students/2.jpg",
        description: "Theo học ngành Y Đa Khoa - ĐH Y Hà Nội"
    },
    {
        id: 3,
        name: "Nguyễn Mạnh Dũng",
        school: "THPT Chuyên Hạ Long",
        examYear: 2020,
        achievement: "Á Khoa Khối A Tỉnh Quảng Ninh",
        avatar: "/outstanding-students/3.jpg",
        description: "Theo học tại đại học Bách Khoa Hà Nội"
    },
    {
        id: 4,
        name: "Vân Trinh",
        school: "THPT Chuyên Hạ Long",
        examYear: 2019,
        achievement: "Thủ Khoa ngành RHM đại học Y Hải Phòng",
        avatar: "/outstanding-students/4.jpg",
        description: "Theo học ngành Răng Hàm Mặt ĐH Y Hải Phòng"
    },
    {
        id: 5,
        name: "Khánh Linh",
        school: "THPT Chuyên Hạ Long",
        examYear: 2020,
        achievement: "Thủ Khoa THPT Chuyên Hạ Long",
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
        achievement: "Á Khoa khối D Tỉnh Quảng Ninh",
        avatar: "/outstanding-students/11.jpg",
        description: "Theo học tại ĐH Ngoại Thương"
    },
    {
        id: 12,
        name: "Trần Thu Loan",
        school: "THPT Chuyên Hạ Long",
        examYear: 2018,
        achievement: "Á Khoa khối B Tỉnh Quảng Ninh",
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
        avatar: "/outstanding-students/14.jpg",
        description: "Theo học ngành IT1 - ĐH Bách Khoa Hà Nội"
    },
    {
        id: 15,
        name: "Nguyễn Thanh Bình",
        school: "THPT Chuyên Hạ Long",
        examYear: 2019,
        achievement: "Thủ Khoa Khối B Tỉnh Quảng Ninh",
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
        achievement: "Thủ Khoa khối C04 Toàn Quốc",
        avatar: "/outstanding-students/18.jpg",
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
        achievement: "Á Khoa Toàn Quốc",
        avatar: "/outstanding-students/20.jpg",
        description: "Theo học tại ĐH Bách Khoa Hà Nội"
    },
    {
        id: 21,
        name: "Nhật Mai",
        school: "THPT Chuyên Hạ Long",
        examYear: 2017,
        achievement: "Á Khoa khối A01 Tỉnh Quảng Ninh",
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
        achievement: "Thủ Khoa Khối D Chuyên Hạ Long",
        avatar: "/outstanding-students/23.jpg",
        description: "Theo học tại ĐH Kinh Tế Quốc Dân"
    },
    {
        id: 24,
        name: "Đức Hiếu",
        school: "THPT Chuyên Hạ Long",
        examYear: 2017,
        achievement: "Á Khoa Khối A Tỉnh Quảng Ninh",
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
        achievement: "Á Khoa khối C03 Tỉnh Quảng Ninh",
        avatar: "/outstanding-students/27.jpg",
        description: "Học sinh xuất sắc mới nhất"
    }
];

export default function OutstandingStudents() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);

    useEffect(() => {
        if (!isAutoPlaying) return;

        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % realStudents.length);
        }, 4000);

        return () => clearInterval(interval);
    }, [isAutoPlaying]);

    const nextSlide = () => {
        setCurrentIndex((prev) => (prev + 1) % realStudents.length);
        setIsAutoPlaying(false);
    };

    const prevSlide = () => {
        setCurrentIndex((prev) => (prev - 1 + realStudents.length) % realStudents.length);
        setIsAutoPlaying(false);
    };

    const goToSlide = (index: number) => {
        setCurrentIndex(index);
        setIsAutoPlaying(false);
    };

    // Calculate statistics from real data
    const totalStudents = realStudents.length;
    const thukhoaCount = realStudents.filter(s => s.achievement.includes('Thủ') || s.achievement.includes('thủ')).length;
    const akhoaCount = realStudents.filter(s => s.achievement.includes('Á') || s.achievement.includes('á')).length;
    const uniqueYears = new Set(realStudents.map(s => s.examYear)).size;

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
                    {/* Main slider */}
                    <div className="relative overflow-hidden rounded-3xl shadow-2xl bg-gradient-to-br from-gray-50 to-white">
                        <div
                            className="flex transition-transform duration-500 ease-in-out"
                            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
                        >
                            {realStudents.map((student) => (
                                <div key={student.id} className="w-full flex-shrink-0">
                                    <div className="p-8 lg:p-12">
                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-center">
                                            {/* Student info */}
                                            <div className="text-center lg:text-left order-2 lg:order-1">
                                                <div className="mb-6">
                                                    <h3 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-3">
                                                        {student.name}
                                                    </h3>
                                                    <p className="text-xl text-gray-600 mb-2">
                                                        {student.school}
                                                    </p>
                                                    <p className="text-base text-gray-500">
                                                        Năm thi: {student.examYear}
                                                    </p>
                                                </div>

                                                <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white px-8 py-4 rounded-2xl inline-block mb-6 shadow-lg">
                                                    <span className="font-bold text-xl block">
                                                        {student.achievement}
                                                    </span>
                                                </div>

                                                <p className="text-gray-700 leading-relaxed text-lg">
                                                    {student.description}
                                                </p>
                                            </div>

                                            {/* Student avatar */}
                                            <div className="flex justify-center lg:justify-end order-1 lg:order-2">
                                                <div className="relative">
                                                    <div className="w-80 h-64 lg:w-96 lg:h-80 rounded-2xl overflow-hidden border-4 border-green-500 shadow-2xl">
                                                        <Image
                                                            src={student.avatar}
                                                            alt={student.name}
                                                            width={384}
                                                            height={320}
                                                            className="w-full h-full object-cover"
                                                            style={{ objectPosition: 'center 20%' }}
                                                            priority={currentIndex === realStudents.findIndex(s => s.id === student.id)}
                                                        />
                                                    </div>
                                                    <div className="absolute -bottom-4 -right-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-2 rounded-full font-bold text-base shadow-xl">
                                                        {student.achievement.includes('Thủ') || student.achievement.includes('thủ') ? '🥇' : '🥈'}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Navigation arrows */}
                    <button
                        onClick={prevSlide}
                        className="absolute left-6 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 p-4 rounded-full shadow-xl transition-all duration-300 z-10 hover:scale-110"
                    >
                        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>

                    <button
                        onClick={nextSlide}
                        className="absolute right-6 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 p-4 rounded-full shadow-xl transition-all duration-300 z-10 hover:scale-110"
                    >
                        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>

                    {/* Dots indicator */}
                    <div className="flex justify-center mt-10 space-x-3">
                        {realStudents.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => goToSlide(index)}
                                className={`w-4 h-4 rounded-full transition-all duration-300 ${index === currentIndex
                                    ? 'bg-green-600 scale-125 shadow-lg'
                                    : 'bg-gray-300 hover:bg-gray-400 hover:scale-110'
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