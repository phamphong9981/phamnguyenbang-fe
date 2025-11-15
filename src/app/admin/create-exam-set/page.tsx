'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useUploadExamSetWithImage, CreateExamSetDto, CreateQuestionDto, ExamSetType, QuestionType } from '@/hooks/useExam';
import QuestionForm from '@/components/admin/QuestionForm';

export default function CreateExamSetPage() {
    const router = useRouter();
    const [formData, setFormData] = useState<Omit<CreateExamSetDto, 'questions'>>({
        type: ExamSetType.HSA,
        name: '',
        year: '2025',
        subject: 1,
        duration: '90 phút',
        difficulty: 'Trung bình',
        status: 'available',
        description: '',
        grade: 12
    });

    const [questions, setQuestions] = useState<CreateQuestionDto[]>([]);
    const [questionImages, setQuestionImages] = useState<{ questionId: string; images: File[] }[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [expandedQuestionIndex, setExpandedQuestionIndex] = useState<number | null>(null);

    const uploadExamSetWithImageMutation = useUploadExamSetWithImage();

    const handleInputChange = (field: keyof Omit<CreateExamSetDto, 'questions'>, value: string | number) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const addQuestion = () => {
        const newQuestion: CreateQuestionDto = {
            id: `q${questions.length + 1}`,
            section: 'Toán học',
            content: '',
            questionType: QuestionType.MULTIPLE_CHOICE,
            options: { A: '', B: '', C: '', D: '' },
            correctAnswer: [],
            explanation: ''
        };
        setQuestions(prev => [...prev, newQuestion]);
        // Auto-expand the new question and close others
        setExpandedQuestionIndex(questions.length);
    };

    const updateQuestion = (index: number, question: CreateQuestionDto) => {
        setQuestions(prev => prev.map((q, i) => i === index ? question : q));
    };

    const removeQuestion = (index: number) => {
        setQuestions(prev => prev.filter((_, i) => i !== index));
        // Adjust expanded index if needed
        if (expandedQuestionIndex === index) {
            setExpandedQuestionIndex(null);
        } else if (expandedQuestionIndex !== null && expandedQuestionIndex > index) {
            setExpandedQuestionIndex(expandedQuestionIndex - 1);
        }
    };

    const toggleQuestion = (index: number) => {
        setExpandedQuestionIndex(expandedQuestionIndex === index ? null : index);
    };

    const handleQuestionImageChange = (questionId: string, file: File | null) => {
        if (!file) {
            // Remove image for this question
            setQuestionImages(prev => prev.filter(item => item.questionId !== questionId));
            return;
        }

        // Validate file
        if (!file.type.startsWith('image/')) {
            alert(`File ${file.name} không phải là file ảnh`);
            return;
        }

        if (file.size > 10 * 1024 * 1024) {
            alert(`File ${file.name} có kích thước vượt quá 10MB`);
            return;
        }

        // Check total number of files (max 10 as per backend)
        const totalImages = questionImages.reduce((sum, item) => sum + item.images.length, 0);
        if (totalImages >= 10) {
            alert('Tổng số file ảnh không được vượt quá 10');
            return;
        }

        // Add or update image for this question
        setQuestionImages(prev => {
            const filtered = prev.filter(item => item.questionId !== questionId);
            const existing = prev.find(item => item.questionId === questionId);
            const images = existing ? [...existing.images, file] : [file];
            return [...filtered, { questionId, images }];
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (questions.length === 0) {
            alert('Vui lòng thêm ít nhất một câu hỏi');
            return;
        }

        // Validate questions
        for (const question of questions) {
            if (!question.content.trim()) {
                alert(`Vui lòng nhập nội dung cho câu hỏi ${question.id}`);
                return;
            }

            if (question.questionType === 'multiple_choice') {
                if (!question.options || Object.values(question.options).some(opt => !opt.trim())) {
                    alert(`Vui lòng nhập đầy đủ các lựa chọn cho câu hỏi ${question.id}`);
                    return;
                }
                if (!question.correctAnswer || question.correctAnswer.length === 0) {
                    alert(`Vui lòng chọn đáp án đúng cho câu hỏi ${question.id}`);
                    return;
                }
            }

            if (question.questionType === 'group_question') {
                if (!question.subQuestions || question.subQuestions.length === 0) {
                    alert(`Vui lòng thêm ít nhất một câu hỏi con cho câu hỏi ${question.id}`);
                    return;
                }
            }
        }

        setIsSubmitting(true);

        try {
            const examSetData: CreateExamSetDto = {
                ...formData,
                questions
            };

            console.log('Sending exam set data:', examSetData);
            console.log('Sending question images:', questionImages);
            console.log('Question images details:', questionImages.map(item => ({
                questionId: item.questionId,
                images: item.images.map(img => ({
                    name: img.name,
                    size: img.size,
                    type: img.type
                }))
            })));

            await uploadExamSetWithImageMutation.mutateAsync({ data: examSetData, questionImages });
            alert('Tạo đề thi thành công!');
            router.push('/admin');
        } catch (error) {
            console.error('Error creating exam set:', error);
            alert('Có lỗi xảy ra khi tạo đề thi. Vui lòng thử lại.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCancel = () => {
        if (confirm('Bạn có chắc chắn muốn hủy? Tất cả dữ liệu sẽ bị mất.')) {
            router.push('/admin');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow-sm border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={() => router.push('/admin')}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                            </button>
                            <h1 className="text-xl font-semibold text-gray-900">
                                Tạo đề thi mới
                            </h1>
                        </div>
                        <div className="flex items-center space-x-3">
                            <button
                                onClick={handleCancel}
                                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                Hủy
                            </button>
                            <button
                                onClick={handleSubmit}
                                disabled={isSubmitting || questions.length === 0}
                                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                {isSubmitting ? 'Đang tạo...' : 'Tạo đề thi'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Sidebar - Basic Info */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-8">
                            <h2 className="text-lg font-semibold text-gray-900 mb-6">
                                Thông tin cơ bản
                            </h2>

                            <form className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Tên đề thi *
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => handleInputChange('name', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Nhập tên đề thi"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Năm học *
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.year}
                                        onChange={(e) => handleInputChange('year', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="2025"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Loại đề thi *
                                    </label>
                                    <select
                                        value={formData.type}
                                        onChange={(e) => handleInputChange('type', e.target.value as ExamSetType)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value={ExamSetType.HSA}>HSA</option>
                                        <option value={ExamSetType.TSA}>TSA</option>
                                        <option value={ExamSetType.CHAPTER}>Chapter</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Môn học *
                                    </label>
                                    <select
                                        value={formData.subject}
                                        onChange={(e) => handleInputChange('subject', parseInt(e.target.value))}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value={1}>Toán học</option>
                                        <option value={2}>Địa lý</option>
                                        <option value={3}>Lịch sử</option>
                                        <option value={4}>Vật lý</option>
                                        <option value={5}>Hóa học</option>
                                        <option value={6}>Sinh học</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Khối lớp *
                                    </label>
                                    <select
                                        value={formData.grade}
                                        onChange={(e) => handleInputChange('grade', parseInt(e.target.value))}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value={10}>Lớp 10</option>
                                        <option value={11}>Lớp 11</option>
                                        <option value={12}>Lớp 12</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Thời gian làm bài *
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.duration}
                                        onChange={(e) => handleInputChange('duration', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="90 phút"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Độ khó *
                                    </label>
                                    <select
                                        value={formData.difficulty}
                                        onChange={(e) => handleInputChange('difficulty', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="Dễ">Dễ</option>
                                        <option value="Trung bình">Trung bình</option>
                                        <option value="Khó">Khó</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Trạng thái *
                                    </label>
                                    <select
                                        value={formData.status}
                                        onChange={(e) => handleInputChange('status', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="available">Có sẵn</option>
                                        <option value="draft">Bản nháp</option>
                                        <option value="archived">Đã lưu trữ</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Mô tả *
                                    </label>
                                    <textarea
                                        value={formData.description}
                                        onChange={(e) => handleInputChange('description', e.target.value)}
                                        rows={3}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Nhập mô tả đề thi"
                                        required
                                    />
                                </div>

                                {/* Question Images Summary */}
                                {questionImages.length > 0 && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Hình ảnh đã chọn
                                        </label>
                                        <div className="space-y-2">
                                            <div className="text-xs text-gray-500">
                                                {questionImages.reduce((sum, item) => sum + item.images.length, 0)}/10 file ảnh cho các câu hỏi
                                            </div>
                                            {questionImages.map((item, index) => (
                                                <div key={index} className="space-y-2">
                                                    <div className="text-xs text-blue-600 font-medium">
                                                        Câu hỏi {item.questionId} ({item.images.length} ảnh)
                                                    </div>
                                                    {item.images.map((image, imgIdx) => (
                                                        <div key={imgIdx} className="flex items-center justify-between bg-gray-50 rounded-lg p-2">
                                                            <div className="flex-1">
                                                                <span className="text-sm text-gray-600 truncate block">
                                                                    {image.name}
                                                                </span>
                                                                <span className="text-xs text-gray-400">
                                                                    {(image.size / 1024 / 1024).toFixed(2)} MB
                                                                </span>
                                                            </div>
                                                            <button
                                                                type="button"
                                                                onClick={() => {
                                                                    const newImages = item.images.filter((_, i) => i !== imgIdx);
                                                                    if (newImages.length === 0) {
                                                                        handleQuestionImageChange(item.questionId, null);
                                                                    } else {
                                                                        setQuestionImages(prev => {
                                                                            const filtered = prev.filter(q => q.questionId !== item.questionId);
                                                                            return [...filtered, { questionId: item.questionId, images: newImages }];
                                                                        });
                                                                    }
                                                                }}
                                                                className="text-red-600 hover:text-red-800 ml-2"
                                                            >
                                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                                </svg>
                                                            </button>
                                                        </div>
                                                    ))}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </form>
                        </div>
                    </div>

                    {/* Right Content - Questions */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-lg font-semibold text-gray-900">
                                    Câu hỏi ({questions.length})
                                </h2>
                                <button
                                    onClick={addQuestion}
                                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                                >
                                    + Thêm câu hỏi
                                </button>
                            </div>

                            <div className="space-y-4">
                                {questions.map((question, index) => (
                                    <div key={question.id} className="border border-gray-200 rounded-lg overflow-hidden">
                                        {/* Question Header */}
                                        <div
                                            className="bg-gray-50 px-4 py-3 cursor-pointer hover:bg-gray-100 transition-colors"
                                            onClick={() => toggleQuestion(index)}
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center space-x-3">
                                                    <span className="text-sm font-medium text-gray-500">
                                                        Câu {index + 1}
                                                    </span>
                                                    <span className="text-sm font-medium text-gray-900">
                                                        {question.content || 'Chưa có nội dung'}
                                                    </span>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${question.questionType === 'multiple_choice' ? 'bg-blue-100 text-blue-800' :
                                                        question.questionType === 'true_false' ? 'bg-orange-100 text-orange-800' :
                                                            question.questionType === 'short_answer' ? 'bg-purple-100 text-purple-800' :
                                                                'bg-red-100 text-red-800'
                                                        }`}>
                                                        {question.questionType === 'multiple_choice' && 'Trắc nghiệm'}
                                                        {question.questionType === 'true_false' && 'Đúng/Sai'}
                                                        {question.questionType === 'short_answer' && 'Trả lời ngắn'}
                                                        {question.questionType === 'group_question' && 'Câu hỏi nhóm'}
                                                    </span>
                                                    <svg
                                                        className={`w-4 h-4 text-gray-400 transform transition-transform ${expandedQuestionIndex === index ? 'rotate-180' : ''
                                                            }`}
                                                        fill="none"
                                                        stroke="currentColor"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                    </svg>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Question Content */}
                                        {expandedQuestionIndex === index && (
                                            <div className="p-4">
                                                <QuestionForm
                                                    question={question}
                                                    onUpdate={(updatedQuestion) => updateQuestion(index, updatedQuestion)}
                                                    onRemove={() => removeQuestion(index)}
                                                    index={index}
                                                    onImageChange={(file) => handleQuestionImageChange(question.id, file)}
                                                />
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>

                            {questions.length === 0 && (
                                <div className="text-center py-12 text-gray-500">
                                    <div className="text-4xl mb-4">📝</div>
                                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                                        Chưa có câu hỏi nào
                                    </h3>
                                    <p className="text-gray-600 mb-4">
                                        Hãy thêm câu hỏi đầu tiên để bắt đầu tạo đề thi.
                                    </p>
                                    <button
                                        onClick={addQuestion}
                                        className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                                    >
                                        Thêm câu hỏi đầu tiên
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
