'use client';

import { useState, useRef } from 'react';
import { useCreateExamSet, CreateExamSetDto, CreateQuestionDto, ExamSetType, QuestionType } from '@/hooks/useExam';
import MathRenderer from '@/components/MathRenderer';
import ImageAnswer from '@/components/ImageAnswer';

interface ImportExamSetModalProps {
    isOpen: boolean;
    onClose: () => void;
}

interface ImportedQuestion {
    id: string;
    section: string;
    content: string;
    imageFileName?: string;
    questionType: string;
    options?: Record<string, string>;
    correctAnswer: string;
    explanation: string;
    subQuestions?: {
        id: string;
        content: string;
        correctAnswer: string;
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
        grade: 12
    });

    const [jsonInput, setJsonInput] = useState('');
    const [parsedQuestions, setParsedQuestions] = useState<ImportedQuestion[]>([]);
    const [parseError, setParseError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [previewMode, setPreviewMode] = useState(false);
    const [showBasicInfo, setShowBasicInfo] = useState(false);

    const createExamSetMutation = useCreateExamSet();

    const handleInputChange = (field: keyof Omit<CreateExamSetDto, 'questions'>, value: string | number) => {
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
        } catch (error) {
            setParseError(error instanceof Error ? error.message : 'Lỗi parse JSON');
            setParsedQuestions([]);
            setPreviewMode(false);
        }
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
            const questions: CreateQuestionDto[] = parsedQuestions.map(q => ({
                id: q.id,
                section: q.section || 'Tổng hợp',
                content: q.content,
                imageFileName: q.imageFileName,
                questionType: q.questionType as QuestionType,
                options: q.options,
                correctAnswer: q.correctAnswer,
                explanation: q.explanation,
                subQuestions: q.subQuestions?.map(sq => ({
                    id: sq.id,
                    content: sq.content,
                    correctAnswer: sq.correctAnswer,
                    explanation: sq.explanation,
                    question_type: (sq.question_type || sq.questionType) as QuestionType,
                    options: sq.options
                }))
            }));

            const examSetData: CreateExamSetDto = {
                ...formData,
                questions
            };

            await createExamSetMutation.mutateAsync({ data: examSetData, questionImages: [] });
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
            grade: 12
        });
        setJsonInput('');
        setParsedQuestions([]);
        setParseError('');
        setPreviewMode(false);
        setShowBasicInfo(false);
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
                                                <option value={1}>Toán học</option>
                                                <option value={2}>Địa lý</option>
                                                <option value={3}>Lịch sử</option>
                                                <option value={4}>Vật lý</option>
                                                <option value={5}>Hóa học</option>
                                                <option value={6}>Sinh học</option>
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
                                </form>
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
                                disabled={isSubmitting || parsedQuestions.length === 0}
                                className="px-4 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                {isSubmitting ? 'Đang tạo...' : 'Tạo đề thi'}
                            </button>
                        </div>
                    </div>

                    {/* Right Side - Preview */}
                    <div className="w-1/2 bg-gray-50 flex flex-col">
                        <div className="p-6 bg-white border-b border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-900">
                                Preview ({parsedQuestions.length} câu hỏi)
                            </h3>
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
                                                <div className="flex items-center space-x-2 mb-3">
                                                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                                                        Câu {index + 1}
                                                    </span>
                                                    <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                                                        {question.questionType}
                                                    </span>
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
                                                        <MathRenderer content={question.content} />
                                                    </div>
                                                )}
                                            </div>

                                            {/* Question Image */}
                                            {question.imageFileName && (
                                                <div className="mb-4">
                                                    <img
                                                        src={question.imageFileName}
                                                        alt={`Hình ảnh câu ${index + 1}`}
                                                        className="w-full h-auto rounded-lg border border-gray-200"
                                                    />
                                                </div>
                                            )}

                                            {/* Answer Options */}
                                            {question.questionType === 'multiple_choice' && question.options && (
                                                <div className="space-y-2">
                                                    {Object.entries(question.options).map(([option, text]) => {
                                                        const isImage = isImageAnswer(text);
                                                        return (
                                                            <label
                                                                key={option}
                                                                className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${option === question.correctAnswer
                                                                    ? 'border-green-500 bg-green-50'
                                                                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                                                                    }`}
                                                            >
                                                                <input
                                                                    type="radio"
                                                                    name={`question-${question.id}`}
                                                                    value={option}
                                                                    checked={option === question.correctAnswer}
                                                                    readOnly
                                                                    className="mr-3"
                                                                />
                                                                <span className="font-semibold text-gray-700 mr-3">{option}.</span>
                                                                <div className="flex-1">
                                                                    {isImage ? (
                                                                        <img src={text} alt={`Đáp án ${option}`} className="max-w-full rounded" />
                                                                    ) : (
                                                                        <span className="text-gray-700">
                                                                            <MathRenderer content={text} />
                                                                        </span>
                                                                    )}
                                                                </div>
                                                                {option === question.correctAnswer && (
                                                                    <span className="ml-2 text-green-600 font-semibold">✓</span>
                                                                )}
                                                            </label>
                                                        );
                                                    })}
                                                </div>
                                            )}

                                            {question.questionType === 'true_false' && (
                                                <div className="space-y-2">
                                                    <label className={`flex items-start p-3 border-2 rounded-lg cursor-pointer transition-colors ${question.correctAnswer === 'true'
                                                        ? 'border-green-500 bg-green-50'
                                                        : 'border-gray-200 hover:border-gray-300'
                                                        }`}>
                                                        <input
                                                            type="radio"
                                                            name={`question-${question.id}`}
                                                            value="true"
                                                            checked={question.correctAnswer === 'true'}
                                                            readOnly
                                                            className="mt-1 mr-3"
                                                        />
                                                        <div className="flex">
                                                            <span className="font-medium text-gray-900 mr-2">Đúng</span>
                                                            {question.correctAnswer === 'true' && <span className="ml-2 text-green-600 font-semibold">✓</span>}
                                                        </div>
                                                    </label>
                                                    <label className={`flex items-start p-3 border-2 rounded-lg cursor-pointer transition-colors ${question.correctAnswer === 'false'
                                                        ? 'border-green-500 bg-green-50'
                                                        : 'border-gray-200 hover:border-gray-300'
                                                        }`}>
                                                        <input
                                                            type="radio"
                                                            name={`question-${question.id}`}
                                                            value="false"
                                                            checked={question.correctAnswer === 'false'}
                                                            readOnly
                                                            className="mt-1 mr-3"
                                                        />
                                                        <div className="flex">
                                                            <span className="font-medium text-gray-900 mr-2">Sai</span>
                                                            {question.correctAnswer === 'false' && <span className="ml-2 text-green-600 font-semibold">✓</span>}
                                                        </div>
                                                    </label>
                                                </div>
                                            )}

                                            {question.questionType === 'short_answer' && (
                                                <div className="space-y-2">
                                                    <div className="p-4 border-2 bg-gray-100 border-gray-200 rounded-lg">
                                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                                            Đáp án:
                                                        </label>
                                                        <div className="w-full text-black px-3 py-2 border font-bold bg-white border-gray-300 rounded-md">
                                                            {question.correctAnswer}
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

                                                        // Debug log
                                                        console.log('SubQuestion debug:', {
                                                            id: subQ.id,
                                                            questionType: subQ.questionType,
                                                            question_type: subQ.question_type,
                                                            resolvedType: subQuestionType,
                                                            correctAnswer: subQ.correctAnswer,
                                                            options: subQ.options
                                                        });

                                                        return (
                                                            <div key={subQ.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                                                                <div className="mb-4">
                                                                    {isSubQuestionImage ? (
                                                                        <div className="mb-4">
                                                                            <img src={subQ.content} alt={`Câu hỏi ${subQ.id}`} className="max-w-full rounded" />
                                                                        </div>
                                                                    ) : (
                                                                        <h5 className="font-medium text-gray-900 mb-2">
                                                                            <MathRenderer content={subQ.content} />
                                                                        </h5>
                                                                    )}
                                                                </div>

                                                                {/* Multiple choice subquestion */}
                                                                {subQuestionType === 'multiple_choice' && subQ.options && (
                                                                    <div className="space-y-3">
                                                                        {Object.entries(subQ.options).map(([option, text]) => {
                                                                            const isImage = isImageAnswer(text);
                                                                            const isCorrect = option === subQ.correctAnswer;
                                                                            console.log('Multiple choice option:', { option, text, correctAnswer: subQ.correctAnswer, isCorrect });
                                                                            return (
                                                                                <label
                                                                                    key={option}
                                                                                    className={`flex items-start p-4 border-2 rounded-lg cursor-pointer transition-colors ${isCorrect
                                                                                        ? 'border-green-500 bg-green-50'
                                                                                        : 'border-gray-200 hover:border-gray-300'
                                                                                        }`}
                                                                                >
                                                                                    <input
                                                                                        type="radio"
                                                                                        name={`sub-question-${question.id}-${subQ.id}`}
                                                                                        value={option}
                                                                                        checked={option === subQ.correctAnswer}
                                                                                        readOnly
                                                                                        className="mt-1 mr-3"
                                                                                    />
                                                                                    <div className="flex gap-1 w-full">
                                                                                        <span className="font-medium text-gray-900 mb-2">{option}.</span>
                                                                                        {isImage ? (
                                                                                            <img src={text} alt={`Đáp án ${option}`} className="max-w-full rounded" />
                                                                                        ) : (
                                                                                            <span className="text-gray-700">
                                                                                                <MathRenderer content={text} />
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
                                                                    console.log('True/False debug:', { correctAnswer: subQ.correctAnswer, type: typeof subQ.correctAnswer });
                                                                    return (
                                                                        <div className="space-y-3">
                                                                            <label className={`flex items-start p-3 border-2 rounded-lg cursor-pointer transition-colors ${subQ.correctAnswer === 'true'
                                                                                ? 'border-green-500 bg-green-50'
                                                                                : 'border-gray-200 hover:border-gray-300'
                                                                                }`}>
                                                                                <input
                                                                                    type="radio"
                                                                                    name={`sub-question-${question.id}-${subQ.id}`}
                                                                                    value="true"
                                                                                    checked={subQ.correctAnswer === 'true'}
                                                                                    readOnly
                                                                                    className="mt-1 mr-3"
                                                                                />
                                                                                <div className="flex">
                                                                                    <span className="font-medium text-gray-900 mr-2">Đúng</span>
                                                                                    {subQ.correctAnswer === 'true' && <span className="ml-2 text-green-600 font-semibold">✓</span>}
                                                                                </div>
                                                                            </label>
                                                                            <label className={`flex items-start p-3 border-2 rounded-lg cursor-pointer transition-colors ${subQ.correctAnswer === 'false'
                                                                                ? 'border-green-500 bg-green-50'
                                                                                : 'border-gray-200 hover:border-gray-300'
                                                                                }`}>
                                                                                <input
                                                                                    type="radio"
                                                                                    name={`sub-question-${question.id}-${subQ.id}`}
                                                                                    value="false"
                                                                                    checked={subQ.correctAnswer === 'false'}
                                                                                    readOnly
                                                                                    className="mt-1 mr-3"
                                                                                />
                                                                                <div className="flex">
                                                                                    <span className="font-medium text-gray-900 mr-2">Sai</span>
                                                                                    {subQ.correctAnswer === 'false' && <span className="ml-2 text-green-600 font-semibold">✓</span>}
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
                                                                                {subQ.correctAnswer}
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                )}

                                                                {/* Explanation for subquestion */}
                                                                {subQ.explanation && (
                                                                    <div className="mt-3 p-2 bg-blue-50 border border-blue-200 rounded text-xs">
                                                                        <span className="font-semibold text-blue-800">Giải thích: </span>
                                                                        <span className="text-blue-700">
                                                                            <MathRenderer content={subQ.explanation} />
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
                                                        <MathRenderer content={question.explanation} />
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

