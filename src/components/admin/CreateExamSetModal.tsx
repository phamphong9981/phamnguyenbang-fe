'use client';

import { useState, useRef } from 'react';
import { useUploadExamSetWithImage, CreateExamSetDto, CreateQuestionDto, ExamSetType, QuestionType } from '@/hooks/useExam';
import QuestionForm from './QuestionForm';

interface CreateExamSetModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function CreateExamSetModal({ isOpen, onClose }: CreateExamSetModalProps) {
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
    };

    const updateQuestion = (index: number, question: CreateQuestionDto) => {
        setQuestions(prev => prev.map((q, i) => i === index ? question : q));
    };

    const removeQuestion = (index: number) => {
        setQuestions(prev => prev.filter((_, i) => i !== index));
    };

    const handleQuestionImageChange = (questionId: string, files: File[] | null) => {
        if (!files || files.length === 0) {
            // Remove images for this question
            setQuestionImages(prev => prev.filter(item => item.questionId !== questionId));
            return;
        }

        // Validate files
        for (const file of files) {
            if (!file.type.startsWith('image/')) {
                alert(`File ${file.name} không phải là file ảnh`);
                return;
            }

            if (file.size > 10 * 1024 * 1024) {
                alert(`File ${file.name} có kích thước vượt quá 10MB`);
                return;
            }
        }

        // Check total number of files across all questions (max 50)
        const totalFiles = questionImages.reduce((sum, item) => sum + item.images.length, 0) -
            (questionImages.find(item => item.questionId === questionId)?.images.length || 0);

        if (totalFiles + files.length > 50) {
            alert('Tổng số file ảnh không được vượt quá 50');
            return;
        }

        // Add or update images for this question
        setQuestionImages(prev => {
            const filtered = prev.filter(item => item.questionId !== questionId);
            return [...filtered, { questionId, images: files }];
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

            await uploadExamSetWithImageMutation.mutateAsync({ data: examSetData, questionImages });
            alert('Tạo đề thi thành công!');
            handleClose();
        } catch (error) {
            console.error('Error uploading exam set with image:', error);
            alert('Có lỗi xảy ra khi tạo đề thi. Vui lòng thử lại.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleClose = () => {
        setFormData({
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
        setQuestions([]);
        setQuestionImages([]);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-gray-900">Tạo đề thi mới</h2>
                        <button
                            onClick={handleClose}
                            className="text-gray-400 hover:text-gray-600"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Basic Info */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                        </div>

                        {/* Description */}
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
                                        {questionImages.reduce((sum, item) => sum + item.images.length, 0)}/50 file ảnh cho các câu hỏi
                                    </div>
                                    {questionImages.map((item, index) => (
                                        <div key={index} className="bg-gray-50 rounded-lg p-2">
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="text-xs text-blue-600 font-medium">
                                                    Câu hỏi {item.questionId} ({item.images.length} ảnh)
                                                </span>
                                                <button
                                                    type="button"
                                                    onClick={() => handleQuestionImageChange(item.questionId, null)}
                                                    className="text-red-600 hover:text-red-800"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                    </svg>
                                                </button>
                                            </div>
                                            <div className="space-y-1">
                                                {item.images.map((img, imgIndex) => (
                                                    <div key={imgIndex} className="text-xs text-gray-600 pl-2">
                                                        {imgIndex + 1}. {img.name} ({(img.size / 1024 / 1024).toFixed(2)} MB)
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Questions */}
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold text-gray-900">
                                    Câu hỏi ({questions.length})
                                </h3>
                                <button
                                    type="button"
                                    onClick={addQuestion}
                                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                                >
                                    + Thêm câu hỏi
                                </button>
                            </div>

                            <div className="space-y-4">
                                {questions.map((question, index) => (
                                    <QuestionForm
                                        key={question.id}
                                        question={question}
                                        onUpdate={(updatedQuestion) => updateQuestion(index, updatedQuestion)}
                                        onRemove={() => removeQuestion(index)}
                                        index={index}
                                        onImageChange={(file) => handleQuestionImageChange(question.id, file)}
                                    />
                                ))}
                            </div>

                            {questions.length === 0 && (
                                <div className="text-center py-8 text-gray-500">
                                    <p>Chưa có câu hỏi nào. Hãy thêm câu hỏi đầu tiên.</p>
                                </div>
                            )}
                        </div>

                        {/* Submit Buttons */}
                        <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                            <button
                                type="button"
                                onClick={handleClose}
                                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                Hủy
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting || questions.length === 0}
                                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                {isSubmitting ? 'Đang tạo...' : 'Tạo đề thi'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
