'use client';

import Header from '@/components/Header';
import { useState } from 'react';

// Type definitions
interface Exam {
    id: string;
    name: string;
    subject: string;
    duration: string;
    questions: number;
    difficulty: string;
    status: string;
    description: string;
}

type ExamData = {
    [examType: string]: {
        [year: string]: Exam[];
    };
};

// Dữ liệu đề thi
const examData: ExamData = {
    "HSA (High School Assessment)": {
        "2024": [
            {
                id: "hsa-2024-1",
                name: "Đề thi HSA 2024 - Đợt 1",
                subject: "Toán học",
                duration: "90 phút",
                questions: 40,
                difficulty: "Trung bình",
                status: "available",
                description: "Đề thi thử HSA môn Toán đợt 1 năm 2024, phù hợp cho học sinh lớp 12"
            },
            {
                id: "hsa-2024-2",
                name: "Đề thi HSA 2024 - Đợt 2",
                subject: "Văn học",
                duration: "120 phút",
                questions: 35,
                difficulty: "Khó",
                status: "available",
                description: "Đề thi thử HSA môn Văn đợt 2 năm 2024, tập trung vào văn học hiện đại"
            },
            {
                id: "hsa-2024-3",
                name: "Đề thi HSA 2024 - Đợt 3",
                subject: "Tiếng Anh",
                duration: "60 phút",
                questions: 50,
                difficulty: "Trung bình",
                status: "available",
                description: "Đề thi thử HSA môn Tiếng Anh đợt 3 năm 2024, bao gồm cả ngữ pháp và đọc hiểu"
            }
        ],
        "2023": [
            {
                id: "hsa-2023-1",
                name: "Đề thi HSA 2023 - Đợt 1",
                subject: "Toán học",
                duration: "90 phút",
                questions: 40,
                difficulty: "Dễ",
                status: "available",
                description: "Đề thi thử HSA môn Toán đợt 1 năm 2023, phù hợp cho học sinh mới bắt đầu"
            },
            {
                id: "hsa-2023-2",
                name: "Đề thi HSA 2023 - Đợt 2",
                subject: "Vật lý",
                duration: "90 phút",
                questions: 40,
                difficulty: "Trung bình",
                status: "available",
                description: "Đề thi thử HSA môn Vật lý đợt 2 năm 2023, tập trung vào cơ học và điện học"
            }
        ]
    },
    "TSA (Tertiary Student Assessment)": {
        "2024": [
            {
                id: "tsa-2024-1",
                name: "Đề thi TSA 2024 - Đợt 1",
                subject: "Toán học nâng cao",
                duration: "120 phút",
                questions: 50,
                difficulty: "Rất khó",
                status: "available",
                description: "Đề thi thử TSA môn Toán nâng cao đợt 1 năm 2024, dành cho học sinh xuất sắc"
            },
            {
                id: "tsa-2024-2",
                name: "Đề thi TSA 2024 - Đợt 2",
                subject: "Văn học nâng cao",
                duration: "150 phút",
                questions: 45,
                difficulty: "Khó",
                status: "available",
                description: "Đề thi thử TSA môn Văn nâng cao đợt 2 năm 2024, yêu cầu phân tích sâu"
            },
            {
                id: "tsa-2024-3",
                name: "Đề thi TSA 2024 - Đợt 3",
                subject: "Tiếng Anh nâng cao",
                duration: "90 phút",
                questions: 60,
                difficulty: "Rất khó",
                status: "available",
                description: "Đề thi thử TSA môn Tiếng Anh nâng cao đợt 3 năm 2024, bao gồm IELTS và TOEFL"
            }
        ],
        "2023": [
            {
                id: "tsa-2023-1",
                name: "Đề thi TSA 2023 - Đợt 1",
                subject: "Toán học nâng cao",
                duration: "120 phút",
                questions: 50,
                difficulty: "Khó",
                status: "available",
                description: "Đề thi thử TSA môn Toán nâng cao đợt 1 năm 2023, tập trung vào giải tích"
            },
            {
                id: "tsa-2023-2",
                name: "Đề thi TSA 2023 - Đợt 2",
                subject: "Hóa học nâng cao",
                duration: "120 phút",
                questions: 45,
                difficulty: "Trung bình",
                status: "available",
                description: "Đề thi thử TSA môn Hóa học nâng cao đợt 2 năm 2023, bao gồm hóa vô cơ và hữu cơ"
            }
        ]
    }
};

export default function ExamPage() {
    const [selectedExamType, setSelectedExamType] = useState("HSA (High School Assessment)");
    const [selectedYear, setSelectedYear] = useState("2024");
    const [selectedDifficulty, setSelectedDifficulty] = useState("all");

    const examTypes = Object.keys(examData);
    const years = Object.keys(examData[selectedExamType] || {});
    const difficulties = ["all", "Dễ", "Trung bình", "Khó", "Rất khó"];

    const filteredExams = (examData[selectedExamType]?.[selectedYear] || []).filter(exam => {
        if (selectedDifficulty === "all") return true;
        return exam.difficulty === selectedDifficulty;
    });

    const getDifficultyColor = (difficulty: string) => {
        switch (difficulty) {
            case "Dễ": return "bg-green-100 text-green-800";
            case "Trung bình": return "bg-yellow-100 text-yellow-800";
            case "Khó": return "bg-orange-100 text-orange-800";
            case "Rất khó": return "bg-red-100 text-red-800";
            default: return "bg-gray-100 text-gray-800";
        }
    };

    const startExam = (examId: string) => {
        // Navigate to exam page
        window.location.href = `/thi-hsa-tsa/lam-bai?examId=${examId}`;
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />

            {/* Hero Section */}
            <section className="bg-gradient-to-r from-green-600 to-green-700 py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
                        Thi HSA/TSA
                    </h1>
                    <p className="text-xl text-green-100 max-w-3xl mx-auto">
                        Luyện thi với bộ đề thi thử chất lượng cao, giúp bạn chuẩn bị tốt nhất
                        cho kỳ thi HSA và TSA sắp tới.
                    </p>
                </div>
            </section>

            {/* Filters Section */}
            <section className="py-8 bg-white border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        {/* Exam Type Filter */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Loại thi
                            </label>
                            <select
                                value={selectedExamType}
                                onChange={(e) => setSelectedExamType(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                            >
                                {examTypes.map(type => (
                                    <option key={type} value={type}>{type}</option>
                                ))}
                            </select>
                        </div>

                        {/* Year Filter */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Năm
                            </label>
                            <select
                                value={selectedYear}
                                onChange={(e) => setSelectedYear(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                            >
                                {years.map(year => (
                                    <option key={year} value={year}>{year}</option>
                                ))}
                            </select>
                        </div>

                        {/* Difficulty Filter */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Độ khó
                            </label>
                            <select
                                value={selectedDifficulty}
                                onChange={(e) => setSelectedDifficulty(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                            >
                                <option value="all">Tất cả</option>
                                {difficulties.slice(1).map(difficulty => (
                                    <option key={difficulty} value={difficulty}>{difficulty}</option>
                                ))}
                            </select>
                        </div>

                        {/* Results Count */}
                        <div className="flex items-end">
                            <div className="w-full px-3 py-2 bg-gray-100 rounded-md">
                                <span className="text-sm text-gray-600">
                                    {filteredExams.length} đề thi
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Exams List */}
            <section className="py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {filteredExams.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="text-gray-400 text-6xl mb-4">📝</div>
                            <h3 className="text-xl font-semibold text-gray-600 mb-2">
                                Không tìm thấy đề thi
                            </h3>
                            <p className="text-gray-500">
                                Hãy thử thay đổi bộ lọc để tìm đề thi phù hợp.
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredExams.map((exam) => (
                                <div key={exam.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                                    <div className="p-6">
                                        <div className="flex justify-between items-start mb-4">
                                            <h3 className="text-lg font-semibold text-gray-900 leading-tight">
                                                {exam.name}
                                            </h3>
                                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getDifficultyColor(exam.difficulty)}`}>
                                                {exam.difficulty}
                                            </span>
                                        </div>

                                        <div className="space-y-3 mb-4">
                                            <div className="flex items-center text-sm text-gray-600">
                                                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                                </svg>
                                                {exam.subject}
                                            </div>
                                            <div className="flex items-center text-sm text-gray-600">
                                                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                                                </svg>
                                                {exam.duration}
                                            </div>
                                            <div className="flex items-center text-sm text-gray-600">
                                                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                                                </svg>
                                                {exam.questions} câu hỏi
                                            </div>
                                        </div>

                                        <p className="text-sm text-gray-600 mb-6 leading-relaxed">
                                            {exam.description}
                                        </p>

                                        <button
                                            onClick={() => startExam(exam.id)}
                                            className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg font-medium transition-colors duration-200"
                                        >
                                            Bắt đầu làm bài
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* Stats Section */}
            <section className="bg-green-600 py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
                        <div>
                            <div className="text-4xl font-bold text-white mb-2">10+</div>
                            <div className="text-green-100">Đề thi</div>
                        </div>
                        <div>
                            <div className="text-4xl font-bold text-white mb-2">2</div>
                            <div className="text-green-100">Loại thi</div>
                        </div>
                        <div>
                            <div className="text-4xl font-bold text-white mb-2">4</div>
                            <div className="text-green-100">Mức độ khó</div>
                        </div>
                        <div>
                            <div className="text-4xl font-bold text-white mb-2">100%</div>
                            <div className="text-green-100">Miễn phí</div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
} 