'use client';

import Header from '@/components/Header';
import { useState } from 'react';
import { hsaMockExam, hsaMockExam_2 } from './mock-data';

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

// Dữ liệu đề thi từ mock-data
const examData: ExamData = {
    "HSA (High School Assessment)": {
        [hsaMockExam.year.toString()]: [
            {
                id: "hsa-mock-exam",
                name: hsaMockExam.title,
                subject: "Toán học",
                duration: `${hsaMockExam.durationMinutes} phút`,
                questions: hsaMockExam.questions.length,
                difficulty: "Trung bình",
                status: "available",
                description: `Đề thi thử HSA môn Toán với ${hsaMockExam.questions.length} câu hỏi bao gồm: ${hsaMockExam.questions.filter(q => q.questionType === 'multiple_choice').length} câu trắc nghiệm, ${hsaMockExam.questions.filter(q => q.questionType === 'group_question').length} câu hỏi nhóm, ${hsaMockExam.questions.filter(q => q.questionType === 'short_answer').length} câu trả lời ngắn. Phù hợp cho học sinh lớp 12 ôn tập kiến thức toán học.`
            },
            {
                id: "hsa-mock-exam-2",
                name: hsaMockExam_2.title,
                subject: "Toán học",
                duration: `${hsaMockExam_2.durationMinutes} phút`,
                questions: hsaMockExam_2.questions.length,
                difficulty: "Trung bình",
                status: "available",
                description: `Đề thi thử HSA môn Toán với ${hsaMockExam_2.questions.length} câu hỏi bao gồm: ${hsaMockExam_2.questions.filter(q => q.questionType === 'multiple_choice').length} câu trắc nghiệm, ${hsaMockExam_2.questions.filter(q => q.questionType === 'group_question').length} câu hỏi nhóm, ${hsaMockExam_2.questions.filter(q => q.questionType === 'short_answer').length} câu trả lời ngắn. Phù hợp cho học sinh lớp 12 ôn tập kiến thức toán học.`
            }
        ]
    }
};

export default function ExamPage() {
    const [selectedExamType, setSelectedExamType] = useState("HSA (High School Assessment)");
    const [selectedYear, setSelectedYear] = useState(hsaMockExam.year.toString());
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
                        Thi HSA
                    </h1>
                    <p className="text-xl text-green-100 max-w-3xl mx-auto">
                        Luyện thi với đề thi thử chất lượng cao, giúp bạn chuẩn bị tốt nhất
                        cho kỳ thi HSA sắp tới với {hsaMockExam.questions.length} câu hỏi toán học đa dạng.
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
                                <div key={exam.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-100">
                                    {/* Header with gradient background */}
                                    <div className="bg-gradient-to-r from-green-500 to-green-600 px-6 py-4">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-3">

                                                <div>
                                                    <h3 className="text-lg font-bold text-white leading-tight">
                                                        {exam.name}
                                                    </h3>
                                                    <p className="text-green-100 text-sm">Môn {exam.subject}</p>
                                                </div>
                                            </div>
                                            <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getDifficultyColor(exam.difficulty)}`}>
                                                {exam.difficulty}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="p-6">
                                        {/* Stats Grid */}
                                        <div className="grid grid-cols-2 gap-4 mb-6">
                                            <div className="bg-gray-50 rounded-lg p-3">
                                                <div className="flex items-center space-x-2">
                                                    <svg className="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                                                    </svg>
                                                    <span className="text-sm font-medium text-gray-700">Thời gian</span>
                                                </div>
                                                <p className="text-lg font-bold text-gray-900 mt-1">{exam.duration}</p>
                                            </div>
                                            <div className="bg-gray-50 rounded-lg p-3">
                                                <div className="flex items-center space-x-2">
                                                    <svg className="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                                                    </svg>
                                                    <span className="text-sm font-medium text-gray-700">Câu hỏi</span>
                                                </div>
                                                <p className="text-lg font-bold text-gray-900 mt-1">
                                                    {exam.questions}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Description */}
                                        <div className="mb-6">
                                            <h4 className="text-sm font-semibold text-gray-900 mb-2">Mô tả đề thi:</h4>
                                            <p className="text-sm text-gray-600 leading-relaxed">
                                                {exam.description}
                                            </p>
                                        </div>

                                        {/* Action Button */}
                                        <button
                                            onClick={() => startExam(exam.id)}
                                            className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white py-3 px-4 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg"
                                        >
                                            <div className="flex items-center justify-center space-x-2">
                                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.293l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" />
                                                </svg>
                                                <span>Bắt đầu làm bài</span>
                                            </div>
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
                            <div className="text-4xl font-bold text-white mb-2">1</div>
                            <div className="text-green-100">Đề thi</div>
                        </div>
                        <div>
                            <div className="text-4xl font-bold text-white mb-2">1</div>
                            <div className="text-green-100">Loại thi</div>
                        </div>
                        <div>
                            <div className="text-4xl font-bold text-white mb-2">{hsaMockExam.questions.length}</div>
                            <div className="text-green-100">Câu hỏi</div>
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