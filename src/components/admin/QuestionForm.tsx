'use client';

import { useState, useRef } from 'react';
import { CreateQuestionDto, CreateSubQuestionDto, QuestionType } from '@/hooks/useExam';

interface QuestionFormProps {
    question: CreateQuestionDto;
    onUpdate: (question: CreateQuestionDto) => void;
    onRemove: () => void;
    index: number;
    onImageChange?: (file: File | null) => void;
}

export default function QuestionForm({ question, onUpdate, onRemove, index, onImageChange }: QuestionFormProps) {
    const [localQuestion, setLocalQuestion] = useState<CreateQuestionDto>(question);
    const [showSubQuestions, setShowSubQuestions] = useState(false);
    const imageInputRef = useRef<HTMLInputElement>(null);

    const handleUpdate = (updates: Partial<CreateQuestionDto>) => {
        const updated = { ...localQuestion, ...updates };
        setLocalQuestion(updated);
        onUpdate(updated);
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Validate file type
            if (!file.type.startsWith('image/')) {
                alert('Chỉ được phép upload file ảnh');
                return;
            }

            // Validate file size (e.g., max 10MB)
            if (file.size > 10 * 1024 * 1024) {
                alert('Kích thước file không được vượt quá 10MB');
                return;
            }

            handleUpdate({ image: file.name });

            // Notify parent component about the image
            if (onImageChange) {
                onImageChange(file);
            }
        } else {
            // Clear image
            handleUpdate({ image: undefined });
            if (onImageChange) {
                onImageChange(null);
            }
        }
    };

    const handleOptionChange = (key: string, value: string) => {
        const options = { ...localQuestion.options, [key]: value };
        handleUpdate({ options });
    };

    const handleRemoveOption = (key: string) => {
        const options = { ...localQuestion.options };
        delete options[key];
        handleUpdate({ options });
    };

    const addOption = () => {
        const keys = Object.keys(localQuestion.options || {});
        const lastKey = keys[keys.length - 1] || 'A';
        const nextKey = String.fromCharCode(lastKey.charCodeAt(0) + 1);
        const options = { ...localQuestion.options, [nextKey]: '' };
        handleUpdate({ options });
    };

    const handleSubQuestionUpdate = (subIndex: number, updates: Partial<CreateSubQuestionDto>) => {
        const subQuestions = [...(localQuestion.subQuestions || [])];
        subQuestions[subIndex] = { ...subQuestions[subIndex], ...updates };
        handleUpdate({ subQuestions });
    };

    const addSubQuestion = () => {
        const subQuestions = [...(localQuestion.subQuestions || [])];
        const newId = `${localQuestion.id}_${String.fromCharCode(97 + subQuestions.length)}`;
        subQuestions.push({
            id: newId,
            content: '',
            correctAnswer: '',
            explanation: ''
        });
        handleUpdate({ subQuestions });
    };

    const removeSubQuestion = (index: number) => {
        const subQuestions = [...(localQuestion.subQuestions || [])];
        subQuestions.splice(index, 1);
        handleUpdate({ subQuestions });
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                    Câu hỏi {index + 1}
                </h3>
                <button
                    onClick={onRemove}
                    className="text-red-600 hover:text-red-800 p-1"
                    title="Xóa câu hỏi"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                </button>
            </div>


            {/* Section */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phần thi
                </label>
                <select
                    value={localQuestion.section}
                    onChange={(e) => handleUpdate({ section: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="Toán học">Toán học</option>
                    <option value="Địa lý">Địa lý</option>
                    <option value="Lịch sử">Lịch sử</option>
                    <option value="Vật lý">Vật lý</option>
                    <option value="Hóa học">Hóa học</option>
                    <option value="Sinh học">Sinh học</option>
                </select>
            </div>

            {/* Content */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nội dung câu hỏi
                </label>
                <textarea
                    value={localQuestion.content}
                    onChange={(e) => handleUpdate({ content: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Nhập nội dung câu hỏi"
                />
            </div>

            {/* Image */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Hình ảnh (tùy chọn)
                </label>
                <div className="flex items-center space-x-3">
                    <input
                        ref={imageInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                    />
                    <button
                        onClick={() => imageInputRef.current?.click()}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Chọn hình ảnh
                    </button>
                    {localQuestion.image && (
                        <span className="text-sm text-gray-600">
                            {localQuestion.image}
                        </span>
                    )}
                </div>
            </div>

            {/* Question Type */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Loại câu hỏi
                </label>
                <select
                    value={localQuestion.questionType}
                    onChange={(e) => handleUpdate({ questionType: e.target.value as QuestionType })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="multiple_choice">Trắc nghiệm</option>
                    <option value="true_false">Đúng/Sai</option>
                    <option value="short_answer">Trả lời ngắn</option>
                    <option value="group_question">Câu hỏi nhóm</option>
                </select>
            </div>

            {/* Options for multiple choice */}
            {localQuestion.questionType === 'multiple_choice' && (
                <div>
                    <div className="flex items-center justify-between mb-2">
                        <label className="block text-sm font-medium text-gray-700">
                            Các lựa chọn
                        </label>
                        <button
                            onClick={addOption}
                            className="text-blue-600 hover:text-blue-800 text-sm"
                        >
                            + Thêm lựa chọn
                        </button>
                    </div>
                    <div className="space-y-2">
                        {Object.entries(localQuestion.options || {}).map(([key, value]) => (
                            <div key={key} className="flex items-center space-x-2">
                                <span className="w-8 text-sm font-medium">{key}.</span>
                                <input
                                    type="text"
                                    value={value}
                                    onChange={(e) => handleOptionChange(key, e.target.value)}
                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder={`Nhập lựa chọn ${key}`}
                                />
                                <button
                                    onClick={() => handleRemoveOption(key)}
                                    className="text-red-600 hover:text-red-800 p-1"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Correct Answer */}
            {(localQuestion.questionType === 'multiple_choice' || localQuestion.questionType === 'true_false') && (
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Đáp án đúng
                    </label>
                    {localQuestion.questionType === 'multiple_choice' ? (
                        <select
                            value={localQuestion.correctAnswer || ''}
                            onChange={(e) => handleUpdate({ correctAnswer: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">Chọn đáp án đúng</option>
                            {Object.keys(localQuestion.options || {}).map(key => (
                                <option key={key} value={key}>{key}</option>
                            ))}
                        </select>
                    ) : (
                        <select
                            value={localQuestion.correctAnswer || ''}
                            onChange={(e) => handleUpdate({ correctAnswer: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">Chọn đáp án đúng</option>
                            <option value="true">Đúng</option>
                            <option value="false">Sai</option>
                        </select>
                    )}
                </div>
            )}

            {/* Short Answer */}
            {localQuestion.questionType === 'short_answer' && (
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Đáp án đúng
                    </label>
                    <input
                        type="text"
                        value={localQuestion.correctAnswer || ''}
                        onChange={(e) => handleUpdate({ correctAnswer: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Nhập đáp án đúng"
                    />
                </div>
            )}

            {/* Group Questions */}
            {localQuestion.questionType === 'group_question' && (
                <div>
                    <div className="flex items-center justify-between mb-2">
                        <label className="block text-sm font-medium text-gray-700">
                            Câu hỏi con
                        </label>
                        <button
                            onClick={() => setShowSubQuestions(!showSubQuestions)}
                            className="text-blue-600 hover:text-blue-800 text-sm"
                        >
                            {showSubQuestions ? 'Ẩn' : 'Hiện'} câu hỏi con
                        </button>
                    </div>

                    {showSubQuestions && (
                        <div className="space-y-4">
                            {(localQuestion.subQuestions || []).map((subQ, subIndex) => (
                                <div key={subQ.id} className="bg-white p-4 rounded-lg border border-gray-200">
                                    <div className="flex items-center justify-between mb-2">
                                        <h4 className="font-medium">Câu hỏi con {subIndex + 1}</h4>
                                        <button
                                            onClick={() => removeSubQuestion(subIndex)}
                                            className="text-red-600 hover:text-red-800 p-1"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    </div>

                                    <div className="space-y-3">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Nội dung
                                            </label>
                                            <textarea
                                                value={subQ.content}
                                                onChange={(e) => handleSubQuestionUpdate(subIndex, { content: e.target.value })}
                                                rows={2}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                placeholder="Nhập nội dung câu hỏi con"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Đáp án đúng
                                            </label>
                                            <select
                                                value={subQ.correctAnswer}
                                                onChange={(e) => handleSubQuestionUpdate(subIndex, { correctAnswer: e.target.value })}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            >
                                                <option value="">Chọn đáp án đúng</option>
                                                <option value="true">Đúng</option>
                                                <option value="false">Sai</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Giải thích (tùy chọn)
                                            </label>
                                            <textarea
                                                value={subQ.explanation || ''}
                                                onChange={(e) => handleSubQuestionUpdate(subIndex, { explanation: e.target.value })}
                                                rows={2}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                placeholder="Nhập giải thích"
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}

                            <button
                                onClick={addSubQuestion}
                                className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-500 hover:text-blue-600 transition-colors"
                            >
                                + Thêm câu hỏi con
                            </button>
                        </div>
                    )}
                </div>
            )}

            {/* Explanation */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Giải thích (tùy chọn)
                </label>
                <textarea
                    value={localQuestion.explanation || ''}
                    onChange={(e) => handleUpdate({ explanation: e.target.value })}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Nhập giải thích cho câu hỏi"
                />
            </div>
        </div>
    );
}
