'use client';

import { useState, useRef } from 'react';
import { useCreateExamSet, useUploadExamSetWithImage, CreateExamSetDto, CreateQuestionDto, ExamSetType, QuestionType, SUBJECT_ID } from '@/hooks/useExam';
import RichRenderer from '@/components/RichRenderer';
import ImageAnswer from '@/components/ImageAnswer';

interface ImportExamSetModalProps {
    isOpen: boolean;
    onClose: () => void;
}

interface ImportedQuestion {
    id: string;
    section: string;
    content: string;
    image?: string;
    questionType: string;
    options?: Record<string, string>;
    correctAnswer: string | string[]; // Support both string and array
    explanation: string;
    subQuestions?: {
        id: string;
        content: string;
        correctAnswer: string | string[]; // Support both string and array
        explanation: string;
        question_type?: string;
        questionType?: string; // Support both formats
        options?: Record<string, string>;
    }[];
}

export default function ImportExamSetModal({ isOpen, onClose }: ImportExamSetModalProps) {
    const [formData, setFormData] = useState<Omit<CreateExamSetDto, 'questions'>>({
        type: ExamSetType.HSA,
        name: '',
        year: '2025',
        subject: 1,
        duration: '90 phút',
        difficulty: 'Trung bình',
        status: 'available',
        description: '',
        grade: 12,
        class: undefined,
        deadline: undefined
    });

    const [jsonInput, setJsonInput] = useState('');
    const [parsedQuestions, setParsedQuestions] = useState<ImportedQuestion[]>([]);
    const [parseError, setParseError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [previewMode, setPreviewMode] = useState(false);
    const [showBasicInfo, setShowBasicInfo] = useState(false);
    const [questionImages, setQuestionImages] = useState<{ questionId: string; image: File }[]>([]);

    const createExamSetMutation = useCreateExamSet();
    const uploadExamSetMutation = useUploadExamSetWithImage();

    const handleInputChange = (field: keyof Omit<CreateExamSetDto, 'questions'>, value: string | number | Date | undefined) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleParseJson = () => {
        try {
            const parsed = JSON.parse(jsonInput);

            if (!Array.isArray(parsed)) {
                throw new Error('JSON phải là một mảng (array) các câu hỏi');
            }

            // Validate structure
            parsed.forEach((q, index) => {
                if (!q.id || !q.content || !q.questionType) {
                    throw new Error(`Câu hỏi ${index + 1} thiếu các trường bắt buộc: id, content, questionType`);
                }
            });

            setParsedQuestions(parsed);
            setParseError('');
            setPreviewMode(true);
            // Reset question images when parsing new JSON
            setQuestionImages([]);
        } catch (error) {
            setParseError(error instanceof Error ? error.message : 'Lỗi parse JSON');
            setParsedQuestions([]);
            setPreviewMode(false);
            setQuestionImages([]);
        }
    };

    const handleImageUpload = (questionId: string, file: File) => {
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
        if (questionImages.length >= 10) {
            alert('Tổng số file ảnh không được vượt quá 10');
            return;
        }

        // Remove existing image for this question if any and add new image
        const updatedImages = questionImages.filter(img => img.questionId !== questionId);
        setQuestionImages([...updatedImages, { questionId, image: file }]);
    };

    const handleRemoveImage = (questionId: string) => {
        setQuestionImages(questionImages.filter(img => img.questionId !== questionId));
    };

    const getQuestionImage = (questionId: string): File | undefined => {
        return questionImages.find(img => img.questionId === questionId)?.image;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (parsedQuestions.length === 0) {
            alert('Vui lòng parse JSON trước khi tạo đề thi');
            return;
        }

        setIsSubmitting(true);

        try {
            // Convert imported questions to CreateQuestionDto format
            const questions: CreateQuestionDto[] = parsedQuestions.map(q => {
                const uploadedImage = getQuestionImage(q.id);
                // Convert correctAnswer to array format
                const correctAnswerArray = Array.isArray(q.correctAnswer)
                    ? q.correctAnswer
                    : q.correctAnswer
                        ? [q.correctAnswer]
                        : [];

                return {
                    id: q.id,
                    section: q.section || 'Tổng hợp',
                    content: q.content,
                    image: uploadedImage ? uploadedImage.name : q.image, // Use uploaded file name or original image
                    questionType: q.questionType as QuestionType,
                    options: q.options,
                    correctAnswer: correctAnswerArray,
                    explanation: q.explanation,
                    subQuestions: q.subQuestions?.map(sq => {
                        // Convert subquestion correctAnswer to array format
                        const subCorrectAnswerArray = Array.isArray(sq.correctAnswer)
                            ? sq.correctAnswer
                            : sq.correctAnswer
                                ? [sq.correctAnswer]
                                : [];

                        return {
                            id: sq.id,
                            content: sq.content,
                            correctAnswer: subCorrectAnswerArray,
                            explanation: sq.explanation,
                            questionType: (sq.question_type || sq.questionType) as QuestionType,
                            options: sq.options
                        };
                    })
                };
            });

            const examSetData: CreateExamSetDto = {
                ...formData,
                questions
            };

            // Use upload mutation if there are images, otherwise use create mutation
            if (questionImages.length > 0) {
                // Ensure file names match image field in questions
                const validatedQuestionImages = questionImages.map(item => {
                    const question = questions.find(q => q.id === item.questionId);
                    if (question && question.image) {
                        // Create a new File object with the correct name to match image field
                        const renamedFile = new File([item.image], question.image, {
                            type: item.image.type,
                            lastModified: item.image.lastModified
                        });
                        return { questionId: item.questionId, image: renamedFile };
                    }
                    return item;
                });

                await uploadExamSetMutation.mutateAsync({
                    data: examSetData,
                    questionImages: validatedQuestionImages
                });
            } else {
                await createExamSetMutation.mutateAsync(examSetData);
            }

            alert('Tạo đề thi thành công!');
            handleClose();
        } catch (error) {
            console.error('Error creating exam set:', error);
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
            grade: 12,
            class: undefined,
            deadline: undefined
        });
        setJsonInput('');
        setParsedQuestions([]);
        setParseError('');
        setPreviewMode(false);
        setShowBasicInfo(false);
        setQuestionImages([]);
        onClose();
    };

    const isImageAnswer = (answer: string): boolean => {
        return answer.startsWith('http') || answer.startsWith('/') && (
            answer.endsWith('.png') ||
            answer.endsWith('.jpg') ||
            answer.endsWith('.jpeg') ||
            answer.endsWith('.gif') ||
            answer.endsWith('.webp') ||
            answer.endsWith('.svg')
        );
    };

    const getSubjectLabel = (subjectId: number): string => {
        switch (subjectId) {
            case SUBJECT_ID.MATH: return 'Toán học';
            case SUBJECT_ID.GEOGRAPHY: return 'Địa lý';
            case SUBJECT_ID.LITERATURE: return 'Ngữ văn';
            case SUBJECT_ID.HISTORY: return 'Lịch sử';
            case SUBJECT_ID.ENGLISH: return 'Tiếng Anh';
            case SUBJECT_ID.PHYSICS: return 'Vật lý';
            case SUBJECT_ID.CHEMISTRY: return 'Hóa học';
            case SUBJECT_ID.BIOLOGY: return 'Sinh học';
            default: return 'Môn học';
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg w-full h-[95vh] flex flex-col">
                {/* Header */}
                <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-bold text-gray-900">Import đề thi từ JSON</h2>
                        <button
                            onClick={handleClose}
                            className="text-gray-400 hover:text-gray-600"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Content - Split View */}
                <div className="flex-1 overflow-hidden flex">
                    {/* Left Side - JSON Input & Form */}
                    <div className="w-1/2 border-r border-gray-200 flex flex-col">
                        {/* Toggle Button for Basic Info */}
                        <div className="p-4 border-b border-gray-200 bg-gray-50">
                            <button
                                type="button"
                                onClick={() => setShowBasicInfo(!showBasicInfo)}
                                className="flex items-center space-x-2 text-sm font-medium text-gray-700 hover:text-gray-900"
                            >
                                <svg
                                    className={`w-4 h-4 transition-transform ${showBasicInfo ? 'rotate-90' : ''}`}
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                                <span>Thông tin đề thi</span>
                                <span className="text-xs text-gray-500">({showBasicInfo ? 'Ẩn' : 'Hiện'})</span>
                            </button>
                        </div>

                        {/* Basic Info - Collapsible */}
                        {showBasicInfo && (
                            <div className="p-4 border-b border-gray-200 bg-white">
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        <div>
                                            <label className="block text-xs font-medium text-gray-700 mb-1">
                                                Tên đề thi *
                                            </label>
                                            <input
                                                type="text"
                                                value={formData.name}
                                                onChange={(e) => handleInputChange('name', e.target.value)}
                                                className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                                                placeholder="Nhập tên đề thi"
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-xs font-medium text-gray-700 mb-1">
                                                Năm học *
                                            </label>
                                            <input
                                                type="text"
                                                value={formData.year}
                                                onChange={(e) => handleInputChange('year', e.target.value)}
                                                className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                                                placeholder="2025"
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-xs font-medium text-gray-700 mb-1">
                                                Loại đề thi *
                                            </label>
                                            <select
                                                value={formData.type}
                                                onChange={(e) => handleInputChange('type', e.target.value as ExamSetType)}
                                                className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                                            >
                                                <option value={ExamSetType.HSA}>HSA</option>
                                                <option value={ExamSetType.TSA}>TSA</option>
                                                <option value={ExamSetType.CHAPTER}>Chapter</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-xs font-medium text-gray-700 mb-1">
                                                Môn học *
                                            </label>
                                            <select
                                                value={formData.subject}
                                                onChange={(e) => handleInputChange('subject', parseInt(e.target.value))}
                                                className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                                            >
                                                <option value={SUBJECT_ID.MATH}>Toán học</option>
                                                <option value={SUBJECT_ID.GEOGRAPHY}>Địa lý</option>
                                                <option value={SUBJECT_ID.LITERATURE}>Ngữ văn</option>
                                                <option value={SUBJECT_ID.HISTORY}>Lịch sử</option>
                                                <option value={SUBJECT_ID.ENGLISH}>Tiếng Anh</option>
                                                <option value={SUBJECT_ID.PHYSICS}>Vật lý</option>
                                                <option value={SUBJECT_ID.CHEMISTRY}>Hóa học</option>
                                                <option value={SUBJECT_ID.BIOLOGY}>Sinh học</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-xs font-medium text-gray-700 mb-1">
                                                Khối lớp *
                                            </label>
                                            <select
                                                value={formData.grade}
                                                onChange={(e) => handleInputChange('grade', parseInt(e.target.value))}
                                                className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                                            >
                                                <option value={10}>Lớp 10</option>
                                                <option value={11}>Lớp 11</option>
                                                <option value={12}>Lớp 12</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-xs font-medium text-gray-700 mb-1">
                                                Thời gian làm bài *
                                            </label>
                                            <input
                                                type="text"
                                                value={formData.duration}
                                                onChange={(e) => handleInputChange('duration', e.target.value)}
                                                className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                                                placeholder="90 phút"
                                                required
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-xs font-medium text-gray-700 mb-1">
                                                Độ khó *
                                            </label>
                                            <select
                                                value={formData.difficulty}
                                                onChange={(e) => handleInputChange('difficulty', e.target.value)}
                                                className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                                            >
                                                <option value="Dễ">Dễ</option>
                                                <option value="Trung bình">Trung bình</option>
                                                <option value="Khó">Khó</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-xs font-medium text-gray-700 mb-1">
                                                Trạng thái *
                                            </label>
                                            <select
                                                value={formData.status}
                                                onChange={(e) => handleInputChange('status', e.target.value)}
                                                className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                                            >
                                                <option value="available">Có sẵn</option>
                                                <option value="draft">Bản nháp</option>
                                                <option value="archived">Đã lưu trữ</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-medium text-gray-700 mb-1">
                                            Mô tả *
                                        </label>
                                        <textarea
                                            value={formData.description}
                                            onChange={(e) => handleInputChange('description', e.target.value)}
                                            rows={2}
                                            className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                                            placeholder="Nhập mô tả đề thi"
                                            required
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        <div>
                                            <label className="block text-xs font-medium text-gray-700 mb-1">
                                                Lớp (tùy chọn)
                                            </label>
                                            <input
                                                type="text"
                                                value={formData.class || ''}
                                                onChange={(e) => handleInputChange('class', e.target.value || undefined)}
                                                className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                                                placeholder="VD: 12a1, 11b2"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-xs font-medium text-gray-700 mb-1">
                                                Deadline (tùy chọn)
                                            </label>
                                            <input
                                                type="datetime-local"
                                                value={formData.deadline ? new Date(formData.deadline).toISOString().slice(0, 16) : ''}
                                                onChange={(e) => {
                                                    const value = e.target.value;
                                                    handleInputChange('deadline', value ? new Date(value) : undefined);
                                                }}
                                                className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                                            />
                                        </div>
                                    </div>
                                </form>
                            </div>
                        )}

                        {/* Question Images Summary */}
                        {questionImages.length > 0 && (
                            <div className="p-4 border-b border-gray-200 bg-white">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Hình ảnh đã chọn
                                </label>
                                <div className="space-y-2">
                                    <div className="text-xs text-gray-500">
                                        {questionImages.length}/10 file ảnh cho các câu hỏi
                                    </div>
                                    {questionImages.map((item, index) => {
                                        const question = parsedQuestions.find(q => q.id === item.questionId);
                                        return (
                                            <div key={index} className="flex items-center justify-between bg-gray-50 rounded-lg p-2">
                                                <div className="flex-1">
                                                    <span className="text-xs text-blue-600 font-medium">
                                                        Câu hỏi {question ? parsedQuestions.indexOf(question) + 1 : item.questionId}
                                                    </span>
                                                    <span className="text-sm text-gray-600 truncate block">
                                                        {item.image.name}
                                                    </span>
                                                    <span className="text-xs text-gray-400">
                                                        {(item.image.size / 1024 / 1024).toFixed(2)} MB
                                                    </span>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveImage(item.questionId)}
                                                    className="text-red-600 hover:text-red-800 ml-2"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                    </svg>
                                                </button>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* JSON Input - Full Height */}
                        <div className="flex-1 flex flex-col">
                            <div className="p-4 border-b border-gray-200 bg-gray-50">
                                <div className="flex items-center justify-between">
                                    <label className="block text-sm font-medium text-gray-700">
                                        Dữ liệu JSON (Array of Questions) *
                                    </label>
                                    <div className="flex items-center space-x-3">
                                        <a
                                            href="/sample-exam-format.json"
                                            download="sample-exam-format.json"
                                            className="text-xs text-blue-600 hover:text-blue-800 underline"
                                        >
                                            📥 Tải file mẫu
                                        </a>
                                        <button
                                            type="button"
                                            onClick={handleParseJson}
                                            className="px-4 py-1 bg-purple-600 text-white rounded text-sm hover:bg-purple-700 transition-colors"
                                        >
                                            Parse & Preview
                                        </button>
                                    </div>
                                </div>
                                {parseError && (
                                    <p className="mt-1 text-xs text-red-600">{parseError}</p>
                                )}
                                <p className="mt-1 text-xs text-gray-500">
                                    💡 Hỗ trợ: multiple_choice, true_false, short_answer, group_question
                                </p>
                                {parsedQuestions.length > 0 && (
                                    <p className="mt-1 text-xs text-green-600">
                                        ✓ Đã parse {parsedQuestions.length} câu hỏi
                                    </p>
                                )}
                            </div>

                            <div className="flex-1 p-4">
                                <textarea
                                    value={jsonInput}
                                    onChange={(e) => setJsonInput(e.target.value)}
                                    className="w-full h-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm resize-none"
                                    placeholder='[{"id": "1", "section": "Toán học", "content": "...", ...}]'
                                    required
                                />
                            </div>
                        </div>

                        {/* Submit Buttons */}
                        <div className="p-4 border-t border-gray-200 bg-gray-50 flex justify-end space-x-3">
                            <button
                                type="button"
                                onClick={handleClose}
                                className="px-4 py-2 border border-gray-300 text-gray-700 rounded text-sm hover:bg-gray-50 transition-colors"
                            >
                                Hủy
                            </button>
                            <button
                                type="button"
                                onClick={handleSubmit}
                                disabled={isSubmitting || parsedQuestions.length === 0 || createExamSetMutation.isPending || uploadExamSetMutation.isPending}
                                className="px-4 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                {(isSubmitting || createExamSetMutation.isPending || uploadExamSetMutation.isPending) ? 'Đang tạo...' : 'Tạo đề thi'}
                            </button>
                        </div>
                    </div>

                    {/* Right Side - Preview */}
                    <div className="w-1/2 bg-gray-50 flex flex-col">
                        <div className="p-6 bg-white border-b border-gray-200">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-semibold text-gray-900">
                                    Preview ({parsedQuestions.length} câu hỏi)
                                </h3>
                                {questionImages.length > 0 && (
                                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                                        📷 {questionImages.length}/10 ảnh đã upload
                                    </span>
                                )}
                            </div>
                        </div>
                        <div className="flex-1 overflow-y-auto p-6">
                            {parsedQuestions.length === 0 ? (
                                <div className="flex items-center justify-center h-full text-gray-500">
                                    <div className="text-center">
                                        <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                        <p>Chưa có preview</p>
                                        <p className="text-sm mt-2">Nhập JSON và nhấn "Parse & Preview"</p>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    {parsedQuestions.map((question, index) => (
                                        <div key={question.id} className="bg-white rounded-lg shadow-md p-6">
                                            {/* Question Header */}
                                            <div className="mb-4">
                                                <div className="flex items-center justify-between mb-3">
                                                    <div className="flex items-center space-x-2">
                                                        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                                                            Câu {index + 1}
                                                        </span>
                                                        <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                                                            {question.questionType}
                                                        </span>
                                                    </div>

                                                    {/* Upload Image Button */}
                                                    <div className="flex items-center space-x-2">
                                                        {getQuestionImage(question.id) && (
                                                            <span className="text-xs text-green-600 font-medium">
                                                                ✓ Đã upload ảnh
                                                            </span>
                                                        )}
                                                        <input
                                                            type="file"
                                                            id={`image-upload-${question.id}`}
                                                            accept="image/*"
                                                            disabled={questionImages.length >= 10}
                                                            onChange={(e) => {
                                                                const file = e.target.files?.[0];
                                                                if (file) {
                                                                    handleImageUpload(question.id, file);
                                                                }
                                                            }}
                                                            className="hidden"
                                                        />
                                                        <label
                                                            htmlFor={`image-upload-${question.id}`}
                                                            className={`px-3 py-1 rounded text-xs font-medium transition-colors ${questionImages.length >= 10
                                                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                                : 'bg-purple-100 text-purple-700 cursor-pointer hover:bg-purple-200'
                                                                }`}
                                                        >
                                                            📷 Upload ảnh
                                                        </label>
                                                        {getQuestionImage(question.id) && (
                                                            <button
                                                                onClick={() => handleRemoveImage(question.id)}
                                                                className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs font-medium hover:bg-red-200 transition-colors"
                                                            >
                                                                ✕
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Question Content */}
                                            <div className="mb-4">
                                                {isImageAnswer(question.content) ? (
                                                    <div className="mb-6">
                                                        <img src={question.content} alt={`Câu ${index + 1}`} className="max-w-full rounded" />
                                                    </div>
                                                ) : (
                                                    <div className="text-xl font-bold text-gray-900 leading-relaxed mb-6">
                                                        <RichRenderer content={question.content} />
                                                    </div>
                                                )}

                                                {/* Uploaded Image Preview */}
                                                {getQuestionImage(question.id) && (
                                                    <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                                                        <p className="text-sm text-green-800 font-medium mb-2">Ảnh đã upload:</p>
                                                        <div className="relative inline-block">
                                                            <img
                                                                src={URL.createObjectURL(getQuestionImage(question.id)!)}
                                                                alt={`Uploaded image for question ${question.id}`}
                                                                className="max-w-xs rounded border border-green-300"
                                                            />
                                                        </div>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Question Image */}
                                            {question.image && (
                                                <div className="mb-4">
                                                    <img
                                                        src={question.image}
                                                        alt={`Hình ảnh câu ${index + 1}`}
                                                        className="w-full h-auto rounded-lg border border-gray-200"
                                                    />
                                                </div>
                                            )}

                                            {/* Answer Options */}
                                            {(question.questionType === 'multiple_choice' || question.questionType === 'single_choice') && question.options && (
                                                <div className="space-y-2">
                                                    {Object.entries(question.options).map(([option, text]) => {
                                                        const isImage = isImageAnswer(text);
                                                        // Check if this option is in correctAnswer (support both string and array)
                                                        const correctAnswerArray = Array.isArray(question.correctAnswer)
                                                            ? question.correctAnswer
                                                            : question.correctAnswer
                                                                ? [question.correctAnswer]
                                                                : [];
                                                        const isCorrect = correctAnswerArray.includes(option);

                                                        return (
                                                            <label
                                                                key={option}
                                                                className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${isCorrect
                                                                    ? 'border-green-500 bg-green-50'
                                                                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                                                                    }`}
                                                            >
                                                                <input
                                                                    type={question.questionType === 'multiple_choice' ? 'checkbox' : 'radio'}
                                                                    name={`question-${question.id}`}
                                                                    value={option}
                                                                    checked={isCorrect}
                                                                    readOnly
                                                                    className="mr-3"
                                                                />
                                                                <span className="font-semibold text-gray-700 mr-3">{option}.</span>
                                                                <div className="flex-1">
                                                                    {isImage ? (
                                                                        <img src={text} alt={`Đáp án ${option}`} className="max-w-full rounded" />
                                                                    ) : (
                                                                        <span className="text-gray-700">
                                                                            <RichRenderer content={text} />
                                                                        </span>
                                                                    )}
                                                                </div>
                                                                {isCorrect && (
                                                                    <span className="ml-2 text-green-600 font-semibold">✓</span>
                                                                )}
                                                            </label>
                                                        );
                                                    })}
                                                </div>
                                            )}

                                            {question.questionType === 'true_false' && (() => {
                                                const correctAnswerArray = Array.isArray(question.correctAnswer)
                                                    ? question.correctAnswer
                                                    : question.correctAnswer
                                                        ? [question.correctAnswer]
                                                        : [];
                                                const isTrue = correctAnswerArray.includes('true');
                                                const isFalse = correctAnswerArray.includes('false');

                                                return (
                                                    <div className="space-y-2">
                                                        <label className={`flex items-start p-3 border-2 rounded-lg cursor-pointer transition-colors ${isTrue
                                                            ? 'border-green-500 bg-green-50'
                                                            : 'border-gray-200 hover:border-gray-300'
                                                            }`}>
                                                            <input
                                                                type="radio"
                                                                name={`question-${question.id}`}
                                                                value="true"
                                                                checked={isTrue}
                                                                readOnly
                                                                className="mt-1 mr-3"
                                                            />
                                                            <div className="flex">
                                                                <span className="font-medium text-gray-900 mr-2">Đúng</span>
                                                                {isTrue && <span className="ml-2 text-green-600 font-semibold">✓</span>}
                                                            </div>
                                                        </label>
                                                        <label className={`flex items-start p-3 border-2 rounded-lg cursor-pointer transition-colors ${isFalse
                                                            ? 'border-green-500 bg-green-50'
                                                            : 'border-gray-200 hover:border-gray-300'
                                                            }`}>
                                                            <input
                                                                type="radio"
                                                                name={`question-${question.id}`}
                                                                value="false"
                                                                checked={isFalse}
                                                                readOnly
                                                                className="mt-1 mr-3"
                                                            />
                                                            <div className="flex">
                                                                <span className="font-medium text-gray-900 mr-2">Sai</span>
                                                                {isFalse && <span className="ml-2 text-green-600 font-semibold">✓</span>}
                                                            </div>
                                                        </label>
                                                    </div>
                                                );
                                            })()}

                                            {question.questionType === 'short_answer' && (
                                                <div className="space-y-2">
                                                    <div className="p-4 border-2 bg-gray-100 border-gray-200 rounded-lg">
                                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                                            Đáp án:
                                                        </label>
                                                        <div className="w-full text-black px-3 py-2 border font-bold bg-white border-gray-300 rounded-md">
                                                            {Array.isArray(question.correctAnswer)
                                                                ? <RichRenderer content={question.correctAnswer.join(', ')} />
                                                                : <RichRenderer content={question.correctAnswer} />}
                                                        </div>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Group Questions */}
                                            {question.questionType === 'group_question' && question.subQuestions && (
                                                <div className="space-y-4 mt-4">
                                                    {question.subQuestions.map((subQ) => {
                                                        const subQuestionType = subQ.question_type || subQ.questionType || 'true_false';
                                                        const isSubQuestionImage = isImageAnswer(subQ.content);

                                                        return (
                                                            <div key={subQ.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                                                                <div className="mb-4">
                                                                    {isSubQuestionImage ? (
                                                                        <div className="mb-4">
                                                                            <img src={subQ.content} alt={`Câu hỏi ${subQ.id}`} className="max-w-full rounded" />
                                                                        </div>
                                                                    ) : (
                                                                        <h5 className="font-medium text-gray-900 mb-2">
                                                                            <RichRenderer content={subQ.content} />
                                                                        </h5>
                                                                    )}
                                                                </div>

                                                                {/* Multiple choice and single choice subquestion */}
                                                                {(subQuestionType === 'multiple_choice' || subQuestionType === 'single_choice') && subQ.options && (
                                                                    <div className="space-y-3">
                                                                        {Object.entries(subQ.options).map(([option, text]) => {
                                                                            const isImage = isImageAnswer(text);
                                                                            // Check if this option is in correctAnswer (support both string and array)
                                                                            const correctAnswerArray = Array.isArray(subQ.correctAnswer)
                                                                                ? subQ.correctAnswer
                                                                                : subQ.correctAnswer
                                                                                    ? [subQ.correctAnswer]
                                                                                    : [];
                                                                            const isCorrect = correctAnswerArray.includes(option);

                                                                            return (
                                                                                <label
                                                                                    key={option}
                                                                                    className={`flex items-start p-4 border-2 rounded-lg cursor-pointer transition-colors ${isCorrect
                                                                                        ? 'border-green-500 bg-green-50'
                                                                                        : 'border-gray-200 hover:border-gray-300'
                                                                                        }`}
                                                                                >
                                                                                    <input
                                                                                        type={subQuestionType === 'multiple_choice' ? 'checkbox' : 'radio'}
                                                                                        name={`sub-question-${question.id}-${subQ.id}`}
                                                                                        value={option}
                                                                                        checked={isCorrect}
                                                                                        readOnly
                                                                                        className="mt-1 mr-3"
                                                                                    />
                                                                                    <div className="flex gap-1 w-full">
                                                                                        <span className="font-medium text-gray-900 mb-2">{option}.</span>
                                                                                        {isImage ? (
                                                                                            <img src={text} alt={`Đáp án ${option}`} className="max-w-full rounded" />
                                                                                        ) : (
                                                                                            <span className="text-gray-700">
                                                                                                <RichRenderer content={text} />
                                                                                            </span>
                                                                                        )}
                                                                                    </div>
                                                                                    {isCorrect && (
                                                                                        <span className="ml-2 text-green-600 font-semibold">✓</span>
                                                                                    )}
                                                                                </label>
                                                                            );
                                                                        })}
                                                                    </div>
                                                                )}

                                                                {/* True/False subquestion */}
                                                                {subQuestionType === 'true_false' && (() => {
                                                                    const correctAnswerArray = Array.isArray(subQ.correctAnswer)
                                                                        ? subQ.correctAnswer
                                                                        : subQ.correctAnswer
                                                                            ? [subQ.correctAnswer]
                                                                            : [];
                                                                    const isTrue = correctAnswerArray.includes('true');
                                                                    const isFalse = correctAnswerArray.includes('false');

                                                                    return (
                                                                        <div className="space-y-3">
                                                                            <label className={`flex items-start p-3 border-2 rounded-lg cursor-pointer transition-colors ${isTrue
                                                                                ? 'border-green-500 bg-green-50'
                                                                                : 'border-gray-200 hover:border-gray-300'
                                                                                }`}>
                                                                                <input
                                                                                    type="radio"
                                                                                    name={`sub-question-${question.id}-${subQ.id}`}
                                                                                    value="true"
                                                                                    checked={isTrue}
                                                                                    readOnly
                                                                                    className="mt-1 mr-3"
                                                                                />
                                                                                <div className="flex">
                                                                                    <span className="font-medium text-gray-900 mr-2">Đúng</span>
                                                                                    {isTrue && <span className="ml-2 text-green-600 font-semibold">✓</span>}
                                                                                </div>
                                                                            </label>
                                                                            <label className={`flex items-start p-3 border-2 rounded-lg cursor-pointer transition-colors ${isFalse
                                                                                ? 'border-green-500 bg-green-50'
                                                                                : 'border-gray-200 hover:border-gray-300'
                                                                                }`}>
                                                                                <input
                                                                                    type="radio"
                                                                                    name={`sub-question-${question.id}-${subQ.id}`}
                                                                                    value="false"
                                                                                    checked={isFalse}
                                                                                    readOnly
                                                                                    className="mt-1 mr-3"
                                                                                />
                                                                                <div className="flex">
                                                                                    <span className="font-medium text-gray-900 mr-2">Sai</span>
                                                                                    {isFalse && <span className="ml-2 text-green-600 font-semibold">✓</span>}
                                                                                </div>
                                                                            </label>
                                                                        </div>
                                                                    );
                                                                })()}

                                                                {/* Short answer subquestion */}
                                                                {subQuestionType === 'short_answer' && (
                                                                    <div className="space-y-2">
                                                                        <div className="p-4 border-2 bg-gray-100 border-gray-200 rounded-lg">
                                                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                                                Đáp án:
                                                                            </label>
                                                                            <div className="w-full text-black px-3 py-2 border font-bold bg-white border-gray-300 rounded-md">
                                                                                {Array.isArray(subQ.correctAnswer)
                                                                                    ? <RichRenderer content={subQ.correctAnswer.join(', ')} />
                                                                                    : <RichRenderer content={subQ.correctAnswer} />}
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                )}

                                                                {/* Explanation for subquestion */}
                                                                {subQ.explanation && (
                                                                    <div className="mt-3 p-2 bg-blue-50 border border-blue-200 rounded text-xs">
                                                                        <span className="font-semibold text-blue-800">Giải thích: </span>
                                                                        <span className="text-blue-700">
                                                                            <RichRenderer content={subQ.explanation} />
                                                                        </span>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            )}

                                            {/* Explanation */}
                                            {question.explanation && (
                                                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                                    <p className="text-sm text-blue-800">
                                                        <span className="font-semibold">Giải thích: </span>
                                                        <RichRenderer content={question.explanation} />
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

