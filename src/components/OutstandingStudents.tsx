'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface Student {
    id: number;
    name: string;
    school: string;
    examYear: number;
    achievement: string;
    score?: number;
    avatar: string;
    description: string;
}

const mockStudents: Student[] = [
    {
        id: 1,
        name: "Nguyễn Văn An",
        school: "THPT Chuyên Hạ Long",
        examYear: 2024,
        achievement: "Thủ khoa tỉnh Quảng Ninh",
        score: 29.5,
        avatar: "/hs1.png",
        description: "Đạt điểm cao nhất tỉnh với 29.5 điểm, hiện đang theo học ĐH Bách Khoa Hà Nội"
    },
    {
        id: 2,
        name: "Trần Thị Bình",
        school: "THPT Uông Bí",
        examYear: 2024,
        achievement: "Á khoa tỉnh Quảng Ninh",
        score: 28.75,
        avatar: "/hs2.png",
        description: "Á khoa tỉnh với 28.75 điểm, trúng tuyển ĐH Y Hà Nội"
    },
    {
        id: 3,
        name: "Lê Hoàng Cường",
        school: "THPT Cẩm Phả",
        examYear: 2023,
        achievement: "Thủ khoa tỉnh Quảng Ninh",
        score: 29.25,
        avatar: "/hs3.png",
        description: "Thủ khoa năm 2023, hiện là sinh viên ĐH Kinh tế Quốc dân"
    },
    {
        id: 4,
        name: "Phạm Thị Dung",
        school: "THPT Chuyên Hạ Long",
        examYear: 2023,
        achievement: "Á khoa tỉnh Quảng Ninh",
        score: 28.5,
        avatar: "/hs4.png",
        description: "Á khoa tỉnh, trúng tuyển ĐH Ngoại thương Hà Nội"
    },
    {
        id: 5,
        name: "Vũ Minh Đức",
        school: "THPT Móng Cái",
        examYear: 2022,
        achievement: "Thủ khoa tỉnh Quảng Ninh",
        score: 29.0,
        avatar: "/hs5.png",
        description: "Thủ khoa năm 2022, hiện theo học ĐH Công nghệ - ĐHQG Hà Nội"
    },
    {
        id: 6,
        name: "Hoàng Thị Hương",
        school: "THPT Uông Bí",
        examYear: 2022,
        achievement: "Á khoa tỉnh Quảng Ninh",
        score: 28.25,
        avatar: "/hs6.png",
        description: "Á khoa tỉnh, sinh viên ĐH Luật Hà Nội"
    }
];

export default function OutstandingStudents() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);

    useEffect(() => {
        if (!isAutoPlaying) return;

        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % mockStudents.length);
        }, 4000);

        return () => clearInterval(interval);
    }, [isAutoPlaying]);

    const nextSlide = () => {
        setCurrentIndex((prev) => (prev + 1) % mockStudents.length);
        setIsAutoPlaying(false);
    };

    const prevSlide = () => {
        setCurrentIndex((prev) => (prev - 1 + mockStudents.length) % mockStudents.length);
        setIsAutoPlaying(false);
    };

    const goToSlide = (index: number) => {
        setCurrentIndex(index);
        setIsAutoPlaying(false);
    };

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
                            {mockStudents.map((student) => (
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
                                                    {student.score && (
                                                        <span className="text-lg opacity-95">
                                                            Điểm: {student.score}/30
                                                        </span>
                                                    )}
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
                                                        />
                                                    </div>
                                                    <div className="absolute -bottom-4 -right-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-2 rounded-full font-bold text-base shadow-xl">
                                                        {student.achievement.includes('Thủ khoa') ? '🥇' : '🥈'}
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
                        {mockStudents.map((_, index) => (
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
                        <div className="text-4xl font-bold text-green-600 mb-3">50+</div>
                        <div className="text-gray-700 font-semibold">Thủ khoa</div>
                    </div>
                    <div className="text-center p-8 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl shadow-lg border border-blue-200">
                        <div className="text-4xl font-bold text-blue-600 mb-3">100+</div>
                        <div className="text-gray-700 font-semibold">Á khoa</div>
                    </div>
                    <div className="text-center p-8 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-2xl shadow-lg border border-yellow-200">
                        <div className="text-4xl font-bold text-yellow-600 mb-3">1000+</div>
                        <div className="text-gray-700 font-semibold">Học sinh đỗ đại học</div>
                    </div>
                    <div className="text-center p-8 bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl shadow-lg border border-purple-200">
                        <div className="text-4xl font-bold text-purple-600 mb-3">15+</div>
                        <div className="text-gray-700 font-semibold">Năm kinh nghiệm</div>
                    </div>
                </div>
            </div>
        </section>
    );
} 