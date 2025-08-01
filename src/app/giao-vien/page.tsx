import Header from '@/components/Header';
import Image from 'next/image';

// Dữ liệu giáo viên
const teachersData = {
    "Toán học": [
        {
            id: 1,
            name: "Thầy Phạm Nguyên Bằng",
            phone: "0123456789",
            image: "/teachers/1.jpg",
            achievements: "Thạc sĩ Toán học, 10+ năm kinh nghiệm luyện thi đại học, 95% học sinh đạt điểm cao",
            subjects: ["Toán 12", "Luyện thi Đại học", "Toán nâng cao"],
            experience: "12 năm"
        },
        {
            id: 2,
            name: "Thầy Cường",
            phone: "0987654321",
            image: "/teachers/2.jpg",
            achievements: "Cử nhân Sư phạm Toán, chuyên gia luyện thi THPT Quốc gia, nhiều học sinh đạt điểm 9-10",
            subjects: ["Toán 10", "Toán 11", "Toán cơ bản"],
            experience: "8 năm"
        },
        {
            id: 3,
            name: "Anh Tùng",
            phone: "0369852147",
            image: "/teachers/3.jpg",
            achievements: "Thạc sĩ Toán ứng dụng, chuyên gia giải tích và đại số, phương pháp giảng dạy hiện đại",
            subjects: ["Giải tích", "Đại số", "Toán nâng cao"],
            experience: "15 năm"
        },
        {
            id: 4,
            name: "Anh Hiếu",
            phone: "0521478963",
            image: "/teachers/4.jpg",
            achievements: "Cử nhân Toán học, chuyên gia luyện thi vào lớp 10, 90% học sinh đỗ trường chuyên",
            subjects: ["Toán 9", "Luyện thi vào 10", "Toán cơ bản"],
            experience: "6 năm"
        },
        {
            id: 5,
            name: "Hiếu nhạt",
            phone: "0147852369",
            image: "/teachers/5.jpeg",
            achievements: "Thạc sĩ Toán học, chuyên gia hình học và không gian, phương pháp trực quan sinh động",
            subjects: ["Hình học", "Không gian", "Toán nâng cao"],
            experience: "10 năm"
        },
        {
            id: 6,
            name: "A Duyệt",
            phone: "0963258741",
            image: "/teachers/6.jpg",
            achievements: "Cử nhân Sư phạm Toán, chuyên gia luyện thi chuyên, nhiều học sinh đạt giải cao",
            subjects: ["Toán chuyên", "Luyện thi chuyên", "Toán Olympic"],
            experience: "7 năm"
        },
        {
            id: 7,
            name: "Dũng",
            phone: "0321654987",
            image: "/teachers/7.jpg",
            achievements: "Thạc sĩ Toán học, chuyên gia xác suất thống kê, phương pháp giảng dạy hiện đại",
            subjects: ["Xác suất", "Thống kê", "Toán ứng dụng"],
            experience: "9 năm"
        },
        {
            id: 8,
            name: "Phong",
            phone: "0789456123",
            image: "/teachers/8.jpg",
            achievements: "Cử nhân Toán học, chuyên gia luyện thi đại học, 85% học sinh đạt điểm 8+",
            subjects: ["Toán 12", "Luyện thi Đại học", "Toán cơ bản"],
            experience: "5 năm"
        },
        {
            id: 9,
            name: "Hải Ninh",
            phone: "0456789123",
            image: "/teachers/9.jpg",
            achievements: "Thạc sĩ Toán học, chuyên gia đại số tuyến tính, phương pháp giảng dạy sáng tạo",
            subjects: ["Đại số tuyến tính", "Toán 11", "Toán nâng cao"],
            experience: "11 năm"
        },
        {
            id: 10,
            name: "Chị Linh Anh",
            phone: "0896321457",
            image: "/teachers/10.jpg",
            achievements: "Cử nhân Sư phạm Toán, chuyên gia luyện thi vào 10, 92% học sinh đỗ trường chuyên",
            subjects: ["Toán 9", "Luyện thi vào 10", "Toán cơ bản"],
            experience: "8 năm"
        },
        {
            id: 11,
            name: "Chị Hiền",
            phone: "0123456789",
            image: "/teachers/11.jpg",
            achievements: "Thạc sĩ Toán học, chuyên gia giải tích, nhiều học sinh đạt giải cao trong các kỳ thi",
            subjects: ["Giải tích", "Toán 12", "Luyện thi Đại học"],
            experience: "13 năm"
        },
        {
            id: 12,
            name: "Chị Diệu",
            phone: "0987654321",
            image: "/teachers/12.jpg",
            achievements: "Cử nhân Toán học, chuyên gia hình học phẳng, phương pháp giảng dạy trực quan",
            subjects: ["Hình học phẳng", "Toán 10", "Toán cơ bản"],
            experience: "6 năm"
        },
        {
            id: 13,
            name: "Minh Anh",
            phone: "0369852147",
            image: "/teachers/13.jpg",
            achievements: "Thạc sĩ Toán học, chuyên gia luyện thi chuyên, nhiều học sinh đạt giải Olympic",
            subjects: ["Toán chuyên", "Olympic", "Toán nâng cao"],
            experience: "14 năm"
        }
    ],
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
                            <div className="text-4xl font-bold text-white mb-2">30+</div>
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