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

function getPriority(achievement: string): number {
    if (achievement.includes('Thủ khoa') && achievement.includes('Toàn Quốc')) return 1;
    if (achievement.includes('Á khoa') && achievement.includes('Toàn Quốc')) return 2;
    if (achievement.includes('Thủ khoa') && achievement.includes('Học Viện')) return 3;
    if (achievement.includes('Thủ khoa') && achievement.includes('Tỉnh')) return 3;
    if (achievement.includes('Á khoa') && achievement.includes('Tỉnh')) return 4;
    if (achievement.includes('Thủ khoa')) return 5;
    if (achievement.includes('Á khoa')) return 5;
    return 6;
}

function getMedalBadge(achievement: string) {
    if (achievement.includes('Thủ khoa') && achievement.includes('Toàn Quốc')) return { label: 'Thủ khoa Toàn Quốc', color: 'bg-amber-500' };
    if (achievement.includes('Á khoa') && achievement.includes('Toàn Quốc')) return { label: 'Á khoa Toàn Quốc', color: 'bg-slate-500' };
    if (achievement.includes('Thủ khoa')) return { label: 'Thủ khoa', color: 'bg-green-700' };
    if (achievement.includes('Á khoa')) return { label: 'Á khoa', color: 'bg-emerald-600' };
    return { label: 'Xuất sắc', color: 'bg-gray-600' };
}

export default function OutstandingStudents() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);
    const [showAll, setShowAll] = useState(false);

    const sortedStudents = [...realStudents].sort((a, b) => {
        const diff = getPriority(a.achievement) - getPriority(b.achievement);
        return diff !== 0 ? diff : b.examYear - a.examYear;
    });

    // Statistics
    const thukhoaCount = sortedStudents.filter(s => s.achievement.toLowerCase().includes('thủ')).length;
    const akhoaCount = sortedStudents.filter(s => s.achievement.toLowerCase().includes('á khoa')).length;
    const uniqueYears = new Set(sortedStudents.map(s => s.examYear)).size;

    useEffect(() => {
        if (!isAutoPlaying) return;
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % sortedStudents.length);
        }, 4500);
        return () => clearInterval(interval);
    }, [isAutoPlaying, sortedStudents.length]);

    const nextSlide = () => { setCurrentIndex((p) => (p + 1) % sortedStudents.length); setIsAutoPlaying(false); };
    const prevSlide = () => { setCurrentIndex((p) => (p - 1 + sortedStudents.length) % sortedStudents.length); setIsAutoPlaying(false); };
    const goToSlide = (i: number) => { setCurrentIndex(i); setIsAutoPlaying(false); };

    // Grid items to display
    const gridCount = showAll ? sortedStudents.length : Math.min(7, sortedStudents.length);
    const gridStudents = sortedStudents.slice(0, gridCount);

    const featured = sortedStudents[currentIndex];
    const badge = getMedalBadge(featured.achievement);

    return (
        <section className="py-28 bg-slate-50 overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Header */}
                <div className="mb-16">
                    <span className="text-green-700 text-xs font-bold tracking-[0.2em] uppercase mb-5 block">
                        Thành tích xuất sắc
                    </span>
                    <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
                        <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight">
                            Học Sinh <span className="italic text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-500">Nổi Bật</span>
                        </h2>
                        <p className="text-sm text-gray-500 max-w-xs leading-relaxed">
                            Những thành tích đáng tự hào của các học sinh xuất sắc từ trung tâm chúng tôi.
                        </p>
                    </div>
                </div>

                {/* Main spotlight + grid layout */}
                <div className="flex flex-col lg:flex-row gap-6 mb-16 lg:h-[580px]">

                    {/* Side grid of featured cards (Moved to left) */}
                    <div className="w-full lg:w-5/12 grid grid-cols-2 grid-rows-2 gap-4 order-2 lg:order-1 h-[480px] sm:h-[600px] lg:h-full">
                        {sortedStudents.slice(0, 4).map((student, i) => {
                            const b = getMedalBadge(student.achievement);
                            const isActive = sortedStudents[currentIndex]?.id === student.id;
                            return (
                                <div
                                    key={student.id}
                                    onClick={() => goToSlide(sortedStudents.indexOf(student))}
                                    className={`group relative overflow-hidden rounded-2xl cursor-pointer transition-all duration-300 w-full h-full ${isActive ? 'ring-2 ring-green-500 ring-offset-2 scale-[0.98]' : 'hover:-translate-y-1 hover:shadow-lg'}`}
                                >
                                    <Image
                                        src={student.avatar}
                                        alt={student.name}
                                        fill
                                        className="object-cover object-center transition-transform duration-700 group-hover:scale-110"
                                        sizes="(max-width: 1024px) 50vw, 22vw"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                                    <div className="absolute bottom-0 left-0 right-0 p-3">
                                        <span className={`inline-block ${b.color} text-white text-[8px] sm:text-[10px] lg:text-[8px] font-bold tracking-wider uppercase px-2 py-1 rounded-full mb-1 sm:mb-2 lg:mb-1`}>
                                            {b.label}
                                        </span>
                                        <p className="text-white font-bold text-sm sm:text-base lg:text-sm leading-tight line-clamp-2">{student.name}</p>
                                        <p className="text-white/60 text-xs sm:text-sm lg:text-xs">{student.examYear}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Large Spotlight Card (Moved to right, Centered content) */}
                    <div className="w-full lg:w-7/12 group relative overflow-hidden rounded-3xl bg-white shadow-xl shadow-gray-200/50 border border-gray-100 order-1 lg:order-2 h-[480px] sm:h-[600px] lg:h-full flex flex-col">
                        {/* Carousel container */}
                        <div className="relative overflow-hidden w-full h-full flex-1 rounded-3xl">
                            <div
                                className="flex transition-all duration-700 ease-in-out h-full w-full"
                                style={{ transform: `translateX(-${currentIndex * 100}%)` }}
                            >
                                {sortedStudents.map((student) => {
                                    const b = getMedalBadge(student.achievement);
                                    return (
                                        <div key={student.id} className="w-full h-full flex-shrink-0 relative flex flex-col justify-end">
                                            <Image
                                                src={student.avatar}
                                                alt={student.name}
                                                fill
                                                className="object-cover object-center"
                                                sizes="(max-width: 1024px) 100vw, 58vw"
                                                priority={currentIndex === sortedStudents.indexOf(student)}
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-90" />
                                            {/* Centered text content */}
                                            <div className="relative z-10 p-8 sm:p-12 w-full flex flex-col items-center text-center pb-20">
                                                <span className={`inline-block ${b.color} text-white text-[10px] sm:text-xs font-bold tracking-widest uppercase px-4 py-1.5 rounded-full mb-4 shadow-lg`}>
                                                    {b.label}
                                                </span>
                                                <h3 className="text-3xl sm:text-5xl font-extrabold text-white mb-2 leading-tight drop-shadow-md">{student.name}</h3>
                                                <p className="text-white/90 text-sm sm:text-lg font-medium mb-3">{student.school} · {student.examYear}</p>
                                                <p className="text-white text-lg sm:text-2xl font-bold mb-3 text-green-300 drop-shadow">{student.achievement}</p>
                                                <p className="text-white/70 text-sm sm:text-base max-w-md mx-auto line-clamp-2">{student.description}</p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Counter (Top Left/Right) */}
                            <div className="absolute top-5 right-5 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full text-white text-xs font-bold z-20">
                                {currentIndex + 1} / {sortedStudents.length}
                            </div>

                            {/* Nav arrows - Centered vertically on sides */}
                            <button
                                onClick={prevSlide}
                                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 sm:w-12 h-10 sm:h-12 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white hover:bg-white/40 transition-all z-20"
                            >
                                <svg className="w-5 sm:w-6 h-5 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                                </svg>
                            </button>
                            <button
                                onClick={nextSlide}
                                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 sm:w-12 h-10 sm:h-12 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white hover:bg-white/40 transition-all z-20"
                            >
                                <svg className="w-5 sm:w-6 h-5 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                                </svg>
                            </button>

                            {/* Dot indicators - Centered inside at the bottom */}
                            <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-2 z-20">
                                {sortedStudents.map((_, i) => (
                                    <button
                                        key={i}
                                        onClick={() => goToSlide(i)}
                                        className={`rounded-full transition-all duration-300 ${i === currentIndex ? 'w-8 h-2 bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]' : 'w-2 h-2 bg-white/50 hover:bg-white'}`}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-20 pt-16 border-t border-gray-200">
                    {[
                        { value: thukhoaCount, label: 'Thủ khoa', color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-100' },
                        { value: akhoaCount, label: 'Á khoa', color: 'text-slate-600', bg: 'bg-slate-50', border: 'border-slate-100' },
                        { value: sortedStudents.length, label: 'Học sinh xuất sắc', color: 'text-green-700', bg: 'bg-green-50', border: 'border-green-100' },
                        { value: uniqueYears, label: 'Năm liên tiếp', color: 'text-emerald-700', bg: 'bg-emerald-50', border: 'border-emerald-100' },
                    ].map((stat) => (
                        <div key={stat.label} className={`${stat.bg} border ${stat.border} rounded-2xl p-8 text-center`}>
                            <div className={`text-4xl font-extrabold ${stat.color} mb-2`}>{stat.value}</div>
                            <div className="text-sm text-gray-600 font-semibold">{stat.label}</div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}