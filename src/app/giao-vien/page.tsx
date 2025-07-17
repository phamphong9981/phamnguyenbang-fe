import Header from '@/components/Header';
import Image from 'next/image';

// Dữ liệu giáo viên
const teachersData = {
    "Toán học": [
        {
            id: 1,
            name: "Phạm Nguyên Bằng",
            phone: "0123456789",
            image: "/phamnguyenbang.jpg",
            achievements: "Thạc sĩ Toán học, 10+ năm kinh nghiệm luyện thi đại học, 95% học sinh đạt điểm cao",
            subjects: ["Toán 12", "Luyện thi Đại học", "Toán nâng cao"],
            experience: "12 năm"
        },
        {
            id: 2,
            name: "Nguyễn Thị Hương",
            phone: "0987654321",
            image: "/phamnguyenbang.jpg",
            achievements: "Cử nhân Sư phạm Toán, chuyên gia luyện thi THPT Quốc gia, nhiều học sinh đạt điểm 9-10",
            subjects: ["Toán 10", "Toán 11", "Toán cơ bản"],
            experience: "8 năm"
        },
        {
            id: 3,
            name: "Trần Văn Minh",
            phone: "0369852147",
            image: "/phamnguyenbang.jpg",
            achievements: "Thạc sĩ Toán ứng dụng, chuyên gia giải tích và đại số, phương pháp giảng dạy hiện đại",
            subjects: ["Giải tích", "Đại số", "Toán nâng cao"],
            experience: "15 năm"
        },
        {
            id: 4,
            name: "Lê Thị Lan",
            phone: "0521478963",
            image: "/phamnguyenbang.jpg",
            achievements: "Cử nhân Toán học, chuyên gia luyện thi vào lớp 10, 90% học sinh đỗ trường chuyên",
            subjects: ["Toán 9", "Luyện thi vào 10", "Toán cơ bản"],
            experience: "6 năm"
        }
    ],
    "Văn học": [
        {
            id: 5,
            name: "Hoàng Thị Mai",
            phone: "0147852369",
            image: "/phamnguyenbang.jpg",
            achievements: "Thạc sĩ Văn học, chuyên gia văn học hiện đại, nhiều bài viết được đăng báo",
            subjects: ["Văn 12", "Văn học hiện đại", "Luyện viết"],
            experience: "10 năm"
        },
        {
            id: 6,
            name: "Phạm Văn Sơn",
            phone: "0963258741",
            image: "/phamnguyenbang.jpg",
            achievements: "Cử nhân Sư phạm Văn, chuyên gia văn học trung đại, phương pháp giảng dạy sáng tạo",
            subjects: ["Văn 11", "Văn học trung đại", "Nghị luận văn học"],
            experience: "9 năm"
        },
        {
            id: 7,
            name: "Nguyễn Thị Thảo",
            phone: "0321654987",
            image: "/phamnguyenbang.jpg",
            achievements: "Thạc sĩ Văn học, chuyên gia văn học nước ngoài, nhiều học sinh đạt giải văn học",
            subjects: ["Văn 10", "Văn học nước ngoài", "Luyện thi"],
            experience: "7 năm"
        }
    ],
    "Tiếng Anh": [
        {
            id: 8,
            name: "Sarah Johnson",
            phone: "0789456123",
            image: "/phamnguyenbang.jpg",
            achievements: "Native speaker, chứng chỉ TESOL, 8+ năm kinh nghiệm giảng dạy tiếng Anh",
            subjects: ["Tiếng Anh giao tiếp", "IELTS", "TOEIC"],
            experience: "8 năm"
        },
        {
            id: 9,
            name: "Trần Thị Hoa",
            phone: "0456789123",
            image: "/phamnguyenbang.jpg",
            achievements: "Thạc sĩ Ngôn ngữ Anh, chứng chỉ IELTS 8.5, chuyên gia luyện thi đại học",
            subjects: ["Tiếng Anh 12", "Luyện thi Đại học", "Ngữ pháp"],
            experience: "11 năm"
        },
        {
            id: 10,
            name: "Lê Văn Dũng",
            phone: "0896321457",
            image: "/phamnguyenbang.jpg",
            achievements: "Cử nhân Ngôn ngữ Anh, chứng chỉ TOEIC 950, chuyên gia phát âm",
            subjects: ["Tiếng Anh 10", "Tiếng Anh 11", "Phát âm"],
            experience: "6 năm"
        },
        {
            id: 11,
            name: "Nguyễn Thị Linh",
            phone: "0123456789",
            image: "/phamnguyenbang.jpg",
            achievements: "Thạc sĩ Ngôn ngữ Anh, chứng chỉ CELTA, chuyên gia luyện thi chứng chỉ quốc tế",
            subjects: ["TOEFL", "Cambridge", "Tiếng Anh trẻ em"],
            experience: "9 năm"
        }
    ],
    "Vật lý": [
        {
            id: 12,
            name: "Đỗ Văn Nam",
            phone: "0987654321",
            image: "/phamnguyenbang.jpg",
            achievements: "Thạc sĩ Vật lý, chuyên gia cơ học và điện học, nhiều học sinh đạt giải Vật lý",
            subjects: ["Vật lý 12", "Cơ học", "Điện học"],
            experience: "13 năm"
        },
        {
            id: 13,
            name: "Hoàng Thị Nga",
            phone: "0369852147",
            image: "/phamnguyenbang.jpg",
            achievements: "Cử nhân Sư phạm Vật lý, chuyên gia quang học và sóng, phương pháp thực nghiệm",
            subjects: ["Vật lý 11", "Quang học", "Sóng"],
            experience: "8 năm"
        }
    ],
    "Hóa học": [
        {
            id: 14,
            name: "Vũ Thị Hương",
            phone: "0521478963",
            image: "/phamnguyenbang.jpg",
            achievements: "Thạc sĩ Hóa học, chuyên gia hóa vô cơ và hữu cơ, nhiều năm nghiên cứu",
            subjects: ["Hóa 12", "Hóa vô cơ", "Hóa hữu cơ"],
            experience: "12 năm"
        },
        {
            id: 15,
            name: "Nguyễn Văn Tuấn",
            phone: "0147852369",
            image: "/phamnguyenbang.jpg",
            achievements: "Cử nhân Hóa học, chuyên gia hóa phân tích, chuyên luyện thi đại học",
            subjects: ["Hóa 11", "Hóa phân tích", "Luyện thi"],
            experience: "7 năm"
        }
    ],
    "Sinh học": [
        {
            id: 16,
            name: "Lê Thị Hà",
            phone: "0963258741",
            image: "/phamnguyenbang.jpg",
            achievements: "Thạc sĩ Sinh học, chuyên gia di truyền học, nhiều công trình nghiên cứu",
            subjects: ["Sinh 12", "Di truyền học", "Sinh học tế bào"],
            experience: "10 năm"
        },
        {
            id: 17,
            name: "Trần Văn Phúc",
            phone: "0321654987",
            image: "/phamnguyenbang.jpg",
            achievements: "Cử nhân Sư phạm Sinh học, chuyên gia sinh thái học, phương pháp trực quan",
            subjects: ["Sinh 11", "Sinh thái học", "Tiến hóa"],
            experience: "6 năm"
        }
    ],
    "Lịch sử": [
        {
            id: 18,
            name: "Phạm Thị Loan",
            phone: "0789456123",
            image: "/phamnguyenbang.jpg",
            achievements: "Thạc sĩ Lịch sử, chuyên gia lịch sử Việt Nam, nhiều bài viết nghiên cứu",
            subjects: ["Lịch sử 12", "Lịch sử Việt Nam", "Lịch sử thế giới"],
            experience: "9 năm"
        }
    ],
    "Địa lý": [
        {
            id: 19,
            name: "Nguyễn Văn Hùng",
            phone: "0456789123",
            image: "/phamnguyenbang.jpg",
            achievements: "Cử nhân Địa lý, chuyên gia địa lý tự nhiên và kinh tế, phương pháp bản đồ",
            subjects: ["Địa lý 12", "Địa lý tự nhiên", "Địa lý kinh tế"],
            experience: "8 năm"
        }
    ],
    "Tin học": [
        {
            id: 20,
            name: "Lê Văn Thành",
            phone: "0896321457",
            image: "/phamnguyenbang.jpg",
            achievements: "Thạc sĩ Công nghệ thông tin, chuyên gia lập trình, nhiều dự án phần mềm",
            subjects: ["Lập trình", "Cơ sở dữ liệu", "Web development"],
            experience: "11 năm"
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
                        <div key={subject} className="mb-16">
                            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
                                {subject}
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {teachers.map((teacher) => (
                                    <div key={teacher.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                                        <div className="relative h-48 bg-gray-200">
                                            <Image
                                                src={teacher.image}
                                                alt={teacher.name}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                        <div className="p-6">
                                            <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                                {teacher.name}
                                            </h3>
                                            <div className="space-y-2 text-sm text-gray-600 mb-4">
                                                <div className="flex items-center">
                                                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                                        <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                                                    </svg>
                                                    {teacher.phone}
                                                </div>
                                                <div className="flex items-center">
                                                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                                                    </svg>
                                                    Kinh nghiệm: {teacher.experience}
                                                </div>
                                            </div>

                                            <div className="mb-4">
                                                <h4 className="font-medium text-gray-900 mb-2">Môn giảng dạy:</h4>
                                                <div className="flex flex-wrap gap-2">
                                                    {teacher.subjects.map((subject, index) => (
                                                        <span
                                                            key={index}
                                                            className="px-3 py-1 bg-green-100 text-green-800 text-xs rounded-full"
                                                        >
                                                            {subject}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>

                                            <div>
                                                <h4 className="font-medium text-gray-900 mb-2">Thành tích:</h4>
                                                <p className="text-sm text-gray-600 leading-relaxed">
                                                    {teacher.achievements}
                                                </p>
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
                            <div className="text-4xl font-bold text-white mb-2">20+</div>
                            <div className="text-green-100">Giáo viên</div>
                        </div>
                        <div>
                            <div className="text-4xl font-bold text-white mb-2">9</div>
                            <div className="text-green-100">Môn học</div>
                        </div>
                        <div>
                            <div className="text-4xl font-bold text-white mb-2">10+</div>
                            <div className="text-green-100">Năm kinh nghiệm TB</div>
                        </div>
                        <div>
                            <div className="text-4xl font-bold text-white mb-2">95%</div>
                            <div className="text-green-100">Học sinh hài lòng</div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
} 