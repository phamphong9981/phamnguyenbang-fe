import Header from '@/components/Header';
import Image from 'next/image';

// Dữ liệu giáo viên
const teachersData = {
    "Toán học": [
        {
            id: 1,
            name: "Phạm Nguyên Bằng",
            image: "/teachers/1.jpg",
            achievements: "Bộ môn Toán - Kinh nghiệm: 16 năm Luyện Thi THPT Quốc Gia bộ môn Toán. Đã dạy qua hàng ngàn học sinh trên khắp cả nước. 7 điểm 10 trong các kỳ thi Đại Học, Kỳ thi vào 10. 37 Thủ khoa – Á Khoa Tỉnh và các trường danh tiếng. Hàng trăm thủ khoa các trường THPT Chuyên Hạ Long, Hòn Gai, … trong kì thi THPT Quốc Gia hàng năm. Điểm 8+,9+ các lớp giảng dạy đạt trên 80% số lượng học sinh tham gia."
        },
        {
            id: 2,
            name: "Đinh Ngọc Tùng",
            image: "/teachers/2.jpg",
            achievements: "Bộ môn Toán - GV bộ môn Toán – THPT Chuyên Hạ Long. Tốt nghiệp loại Giỏi chuyên ngành Sư phạm Toán – ĐH Sư Phạm Hà Nội. Cựu thành viên Đội tuyển Quốc Gia bộ môn Toán học. Cựu học sinh chuyên Toán – THPT Chuyên Hạ Long. Có kinh nghiệm ôn thi vào chuyên Toán, các kì thi HSG các cấp và ôn thi THPT Quốc Gia."
        },
        {
            id: 3,
            name: "Cao Bá Duyệt",
            image: "/teachers/3.jpg",
            achievements: "Bộ môn Toán - Tốt nghiệp loại Xuất Sắc chuyên ngành sư phạm Toán – ĐH Sư phạm Hà Nội. Đạt giải Nhất kì thi HSG cấp Tỉnh bộ môn Toán. Có kinh nghiệm luyện thi kì thi THPT Quốc Gia, các kì thi HSG các cấp đạt thành tích cao."
        },
        {
            id: 4,
            name: "Trần Diệu",
            image: "/teachers/4.jpg",
            achievements: "Bộ môn Toán - Có kinh nghiệm nhiều năm giảng dạy bộ môn Toán THCS. Phương pháp giảng dạy phù hợp với từng học sinh giúp học sinh nắm chắc được kiến thức nền tảng và nâng cao phục vụ cho kì thi Tuyển sinh vào 10. Có nhiều học sinh đạt thành tích cao, đỗ vào trường THPT Chuyên Hạ Long và các trường THPT công lập."
        },
        {
            id: 5,
            name: "Đoàn Hiền",
            image: "/teachers/5.jpg",
            achievements: "Bộ môn Toán - Tốt nghiệp loại Giỏi chuyên ngành Sư phạm Toán – ĐH Sư phạm Hà Nội. Cựu thành viên đội tuyển Quốc Gia bộ môn Toán Học. Cựu học sinh chuyên Toán – THPT Chuyên Hạ Long. Có kinh nghiệm giảng dạy bộ môn Toán THCS. Có nhiều học sinh đạt thành tích cao trong kì thi vào 10, đỗ vào các trường THPT Chuyên và THPT công lập."
        },
        {
            id: 6,
            name: "Vũ Hùng Cường",
            image: "/teachers/6.jpg",
            achievements: "Bộ môn Toán - Giáo viên bộ môn Toán - Trường THPT Hòn Gai. Có nhiều kinh nghiệm luyện thi THPT Quốc Gia đạt thành tích cao."
        },
        {
            id: 7,
            name: "Nguyễn Tiến Dũng",
            image: "/teachers/7.jpg",
            achievements: "Bộ môn Toán - Sư Phạm Toán - Đại Học Sư Phạm Hà Nội 2. Cựu học sinh chuyên Tin – THPT Chuyên Hạ Long. Đạt điểm 9+ môn Toán trong kì thi THPT Quốc Gia."
        },
        {
            id: 8,
            name: "Nguyễn Đức Phong",
            image: "/teachers/8.jpg",
            achievements: "Bộ môn Toán - Sinh viên lớp Cử nhân Tài năng Khoa Toán - Đại Học Khoa Học Tự Nhiên. Đạt giải nhì bộ môn Toán kì thi Olympic sinh viên toàn quốc. Đạt giải Ba kì thi HSG Quốc Gia bộ môn Toán học. Cựu học sinh Chuyên Toán – THPT Chuyên Hạ Long. Tham gia giảng dạy các lớp ôn thi Chuyên Toán, ôn thi HSG bộ môn Toán Học các cấp."
        },
        {
            id: 9,
            name: "Trần Hải Ninh",
            image: "/teachers/9.jpg",
            achievements: "Bộ môn Toán học và Hóa học - Cựu thành viên đội tuyển Quốc Gia bộ môn Hóa học. Đạt giải Nhất và Nhì kì thi HSG cấp Tỉnh bộ môn Hóa học. Có kinh nghiệm ôn thi HSG các cấp bộ môn Hóa học. Hơn 4 năm kinh nghiệm giảng dạy, luyện thi bộ môn Toán học và Hóa học trong các kì thi Tuyển sinh vào 10, kì thi THPT Quốc Gia, HSA, TSA,…"
        },
        {
            id: 10,
            name: "Nguyễn Minh Anh",
            image: "/teachers/10.jpg",
            achievements: "Bộ môn Toán - Tốt nghiệp loại Giỏi chuyên ngành Sư phạm Toán – ĐH Sư phạm Hà Nội. Có kinh nghiệm giảng dạy bộ môn Toán THPT. Phương pháp giảng dạy bài bản, nghiệp vụ sư phạm vững vàng."
        },
        {
            id: 11,
            name: "Nguyễn Hiếu",
            image: "/teachers/11.jpg",
            achievements: "Bộ môn Toán - Đạt giải Nhì kì thi HSG cấp Tỉnh bộ môn Toán học. Hơn 5 năm kinh nghiệm giảng dạy bộ môn Toán THCS. Phương pháp giảng dạy phù hợp với từng học sinh giúp học sinh nắm vững kiến thức nền tảng và nâng cao phục vụ kì thi Tuyển sinh vào 10."
        },
        {
            id: 12,
            name: "Vũ Trung Hiếu",
            image: "/teachers/12.jpg",
            achievements: "Bộ môn Vật Lý và Toán học - Tốt nghiệp loại Giỏi chuyên ngành sư phạm Vật Lý – ĐH Sư Phạm Hà Nội. Có kinh nghiệm giảng dạy các môn Toán, Vật Lý phục vụ các kì thi tuyển sinh vào 10, kì thi THPT Quốc Gia."
        },
    ],
    "Tiếng Anh": [
        {
            id: 13,
            name: "Nguyễn Linh Anh",
            image: "/teachers/13.jpg",
            achievements: "Bộ môn Tiếng Anh - Tốt nghiệp loại Xuất sắc ngành Ngôn Ngữ Anh, Khoa Tiếng Anh - Đại Học Sư Phạm Hà Nội. Thạc sỹ Đại Học Birmingham. Cựu học sinh THPT Chuyên Hạ Long (2015-2018). Có kinh nghiệm luyện thi IELTS (có học sinh đạt 7+ IELTS), SAT, ôn thi Tuyển sinh vào 10 và THPT Quốc Gia bộ môn Tiếng Anh."
        }
    ],
    "Giáo viên chuyên Toán online": [
        {
            id: 14,
            name: "Đoàn Đức Mạnh",
            image: "/teachers/14.jpg",
            achievements: `Sinh viên lớp Chương trình tài năng Khoa học máy tính Đại học Bách khoa Hà Nội. Đạt giải Nhì kì thi HSG Quốc Gia bộ môn Toán học. Cựu học sinh Chuyên Toán THPT Chuyên Hạ Long. Có kinh nghiệm trong việc ôn thi Chuyên Toán, ôn thi HSG bộ môn Toán Học các cấp.`
        },
        {
            id: 15,
            name: "Đỗ Lê Hoàng",
            image: "/teachers/15.jpg",
            achievements: `Sinh viên ngành Khoa học máy tính - Đại học Bách Khoa Hà Nội. Cựu thành viên Đội tuyển Quốc Gia bộ môn Toán học. Cựu học sinh chuyên Toán – THPT Chuyên Hạ Long. Có kinh nghiệm ôn thi vào chuyên Toán, các kì thi HSG bộ môn Toán học các cấp.`
        }
    ]
};

export default function TeachersPage() {
    return (
        <div className="min-h-screen bg-gray-50">
            <Header />

            {/* Hero Section */}
            <section className="bg-gradient-to-r from-green-600 to-green-700 py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
                        Đội ngũ Giáo viên
                    </h1>
                    <p className="text-xl text-green-100 max-w-3xl mx-auto">
                        Đội ngũ giáo viên giàu kinh nghiệm, tận tâm với nghề, cam kết mang đến
                        những bài giảng chất lượng cao và phương pháp giảng dạy hiện đại.
                    </p>
                </div>
            </section>

            {/* Teachers List */}
            <section className="py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {Object.entries(teachersData).map(([subject, teachers]) => (
                        <div key={subject} className="mb-20">
                            <div className="text-center mb-12">
                                <h2 className="text-4xl font-bold text-gray-900 mb-4">
                                    {subject}
                                </h2>
                                <div className="w-24 h-1 bg-green-500 mx-auto rounded-full"></div>
                            </div>
                            <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
                                {teachers.map((teacher) => (
                                    <div key={teacher.id} className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100">
                                        {/* Header with image and name */}
                                        <div className="relative h-64 bg-gradient-to-br from-green-400 to-green-600">
                                            <div className="absolute inset-0 bg-green-800 bg-opacity-20"></div>
                                            <div className="relative h-full flex items-center justify-center">
                                                <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg">
                                                    <Image
                                                        src={teacher.image}
                                                        alt={teacher.name}
                                                        fill
                                                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                                                    />
                                                </div>
                                            </div>
                                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
                                                <h3 className="text-2xl font-bold text-white text-center">
                                                    {teacher.name}
                                                </h3>
                                            </div>
                                        </div>

                                        {/* Content */}
                                        <div className="p-8">
                                            <div className="space-y-4">
                                                {teacher.achievements.split('. ').map((achievement, index) => (
                                                    <div key={index} className="flex items-start space-x-3">
                                                        <div className="flex-shrink-0 w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                                                        <p className="text-gray-700 leading-relaxed text-sm">
                                                            {achievement.trim()}
                                                        </p>
                                                    </div>
                                                ))}
                                            </div>

                                            {/* Decorative element */}
                                            <div className="mt-8 pt-6 border-t border-gray-100">
                                                <div className="flex justify-center">
                                                    <div className="w-16 h-1 bg-gradient-to-r from-green-400 to-green-600 rounded-full"></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Stats Section */}
            <section className="bg-green-600 py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
                        <div>
                            <div className="text-4xl font-bold text-white mb-2">13</div>
                            <div className="text-green-100">Giáo viên</div>
                        </div>
                        <div>
                            <div className="text-4xl font-bold text-white mb-2">3</div>
                            <div className="text-green-100">Môn học</div>
                        </div>
                        <div>
                            <div className="text-4xl font-bold text-white mb-2">16+</div>
                            <div className="text-green-100">Năm kinh nghiệm TB</div>
                        </div>
                        <div>
                            <div className="text-4xl font-bold text-white mb-2">80%+</div>
                            <div className="text-green-100">Học sinh đạt điểm cao</div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
} 