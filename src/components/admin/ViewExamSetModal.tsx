'use client';

import { useState, useEffect } from 'react';
import { useExamSet, useUpdateQuestion, useUpdateQuestionWithImages, ExamSetDetailResponse, QuestionType, UpdateQuestionDto, UpdateQuestionWithImagesDto, SUBJECT_ID } from '@/hooks/useExam';
import RichRenderer from '@/components/RichRenderer';

interface ViewExamSetModalProps {
    examSetId: string;
    isOpen: boolean;
    onClose: () => void;
}

interface EditQuestionModalProps {
    question: any;
    onClose: () => void;
    onSubmit: (data: UpdateQuestionDto) => void;
    isSubmitting: boolean;
}

function EditQuestionModal({ question, onClose, onSubmit, isSubmitting }: EditQuestionModalProps) {
    const [formData, setFormData] = useState<UpdateQuestionDto>({
        content: question.content,
        section: question.section || '',
        images: question.images || [],
        questionType: question.question_type,
        options: question.options || {},
        correctAnswer: question.correct_answer || [],
        explanation: question.explanation || '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    const handleAddOption = () => {
        const optionKeys = Object.keys(formData.options || {});
        const nextKey = optionKeys.length > 0
            ? String.fromCharCode(optionKeys[optionKeys.length - 1].charCodeAt(0) + 1)
            : 'A';
        setFormData(prev => ({
            ...prev,
            options: { ...prev.options, [nextKey]: '' }
        }));
    };

    const handleRemoveOption = (key: string) => {
        const newOptions = { ...formData.options };
        delete newOptions[key];
        setFormData(prev => ({
            ...prev,
            options: newOptions,
            correctAnswer: prev.correctAnswer?.filter(ans => ans !== key)
        }));
    };

    const handleOptionChange = (key: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            options: { ...prev.options, [key]: value }
        }));
    };

    const handleCorrectAnswerToggle = (key: string) => {
        const currentAnswers = formData.correctAnswer || [];
        const isMultiple = formData.questionType === QuestionType.MULTIPLE_CHOICE;

        if (isMultiple) {
            setFormData(prev => ({
                ...prev,
                correctAnswer: currentAnswers.includes(key)
                    ? currentAnswers.filter(ans => ans !== key)
                    : [...currentAnswers, key]
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                correctAnswer: [key]
            }));
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60] p-4">
            <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                        Chỉnh sửa câu hỏi
                    </h3>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Phần / Section
                            </label>
                            <input
                                type="text"
                                value={formData.section || ''}
                                onChange={(e) => setFormData(prev => ({ ...prev, section: e.target.value }))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="VD: Toán học, Địa lý..."
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Nội dung câu hỏi *
                            </label>
                            <textarea
                                value={formData.content || ''}
                                onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                                rows={4}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Nhập nội dung câu hỏi..."
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Loại câu hỏi *
                            </label>
                            <select
                                value={formData.questionType || ''}
                                onChange={(e) => setFormData(prev => ({ ...prev, questionType: e.target.value as QuestionType }))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            >
                                <option value={QuestionType.SINGLE_CHOICE}>Single Choice</option>
                                <option value={QuestionType.MULTIPLE_CHOICE}>Multiple Choice</option>
                                <option value={QuestionType.TRUE_FALSE}>True/False</option>
                                <option value={QuestionType.SHORT_ANSWER}>Short Answer</option>
                                <option value={QuestionType.GROUP_QUESTION}>Group Question</option>
                            </select>
                        </div>

                        {/* Options for single/multiple choice */}
                        {(formData.questionType === QuestionType.SINGLE_CHOICE || formData.questionType === QuestionType.MULTIPLE_CHOICE) && (
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <label className="block text-sm font-medium text-gray-700">
                                        Các đáp án
                                    </label>
                                    <button
                                        type="button"
                                        onClick={handleAddOption}
                                        className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700"
                                    >
                                        + Thêm đáp án
                                    </button>
                                </div>
                                <div className="space-y-2">
                                    {Object.entries(formData.options || {}).map(([key, value]) => (
                                        <div key={key} className="flex items-center space-x-2">
                                            <input
                                                type={formData.questionType === QuestionType.MULTIPLE_CHOICE ? 'checkbox' : 'radio'}
                                                checked={formData.correctAnswer?.includes(key) || false}
                                                onChange={() => handleCorrectAnswerToggle(key)}
                                                className="mt-1"
                                            />
                                            <span className="font-medium text-gray-700">{key}.</span>
                                            <input
                                                type="text"
                                                value={value}
                                                onChange={(e) => handleOptionChange(key, e.target.value)}
                                                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                placeholder={`Đáp án ${key}`}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveOption(key)}
                                                className="px-2 py-1 text-red-600 hover:text-red-800"
                                                title="Xóa đáp án"
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Correct answer for short answer */}
                        {formData.questionType === QuestionType.SHORT_ANSWER && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Đáp án đúng *
                                </label>
                                <input
                                    type="text"
                                    value={formData.correctAnswer?.[0] || ''}
                                    onChange={(e) => setFormData(prev => ({ ...prev, correctAnswer: [e.target.value] }))}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Nhập đáp án đúng"
                                    required
                                />
                            </div>
                        )}

                        {/* Correct answer for true/false */}
                        {formData.questionType === QuestionType.TRUE_FALSE && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Đáp án đúng *
                                </label>
                                <div className="space-y-2">
                                    <label className="flex items-center">
                                        <input
                                            type="radio"
                                            checked={formData.correctAnswer?.includes('true') || false}
                                            onChange={() => setFormData(prev => ({ ...prev, correctAnswer: ['true'] }))}
                                            className="mr-2"
                                        />
                                        <span>Đúng</span>
                                    </label>
                                    <label className="flex items-center">
                                        <input
                                            type="radio"
                                            checked={formData.correctAnswer?.includes('false') || false}
                                            onChange={() => setFormData(prev => ({ ...prev, correctAnswer: ['false'] }))}
                                            className="mr-2"
                                        />
                                        <span>Sai</span>
                                    </label>
                                </div>
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Giải thích
                            </label>
                            <textarea
                                value={formData.explanation || ''}
                                onChange={(e) => setFormData(prev => ({ ...prev, explanation: e.target.value }))}
                                rows={3}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Nhập giải thích cho câu trả lời..."
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                URLs hình ảnh (mỗi dòng một URL)
                            </label>
                            <textarea
                                value={formData.images?.join('\n') || ''}
                                onChange={(e) => setFormData(prev => ({ ...prev, images: e.target.value.split('\n').filter(url => url.trim()) }))}
                                rows={3}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="https://example.com/image1.jpg&#10;https://example.com/image2.jpg"
                            />
                        </div>
                    </div>

                    <div className="flex justify-end space-x-3 mt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isSubmitting}
                            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Hủy
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                        >
                            {isSubmitting ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                    Đang lưu...
                                </>
                            ) : (
                                'Lưu thay đổi'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default function ViewExamSetModal({ examSetId, isOpen, onClose }: ViewExamSetModalProps) {
    const { data: examSetDetail, isLoading, error, refetch } = useExamSet(examSetId);
    const updateQuestionMutation = useUpdateQuestion();
    const updateQuestionWithImagesMutation = useUpdateQuestionWithImages();
    // Use path string to support nested subquestions: "0" for main question, "0_0" for first subquestion, etc.
    const [selectedQuestionPath, setSelectedQuestionPath] = useState<string | null>(null);
    const [showExamInfo, setShowExamInfo] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editFormData, setEditFormData] = useState<UpdateQuestionDto | null>(null);
    const [questionImages, setQuestionImages] = useState<{ questionId: string; image: File; imageIndex: number }[]>([]);

    // Auto-select first question when data loads
    useEffect(() => {
        if (examSetDetail && selectedQuestionPath === null && examSetDetail.examQuestions.length > 0) {
            setSelectedQuestionPath('0');
        }
    }, [examSetDetail, selectedQuestionPath]);

    // Reset edit mode when question changes
    useEffect(() => {
        setIsEditing(false);
        setEditFormData(null);
        setQuestionImages([]);
    }, [selectedQuestionPath]);

    // Helper function to get question by path
    const getQuestionByPath = (path: string): { question: any; isSubQuestion: boolean; parentPath?: string } | null => {
        if (!examSetDetail) return null;

        const parts = path.split('_').map(Number);
        const mainIndex = parts[0];

        if (mainIndex < 0 || mainIndex >= examSetDetail.examQuestions.length) return null;

        const mainQuestion = examSetDetail.examQuestions[mainIndex];

        // If path is just main question index
        if (parts.length === 1) {
            return { question: mainQuestion.question, isSubQuestion: false };
        }

        // Navigate through subquestions
        let currentSubQuestions = mainQuestion.question.subQuestions || [];
        let currentQuestion = null;

        for (let i = 1; i < parts.length; i++) {
            const subIndex = parts[i];
            if (subIndex < 0 || subIndex >= currentSubQuestions.length) return null;

            currentQuestion = currentSubQuestions[subIndex];
            currentSubQuestions = currentQuestion.subQuestions || [];
        }

        if (!currentQuestion) return null;

        return {
            question: currentQuestion,
            isSubQuestion: true,
            parentPath: parts.slice(0, -1).join('_')
        };
    };

    // Helper function to get question label from path
    const getQuestionLabel = (path: string): string => {
        const parts = path.split('_').map(Number);
        if (parts.length === 1) {
            return `Câu ${parts[0] + 1}`;
        }
        // For subquestions, show path like "Câu 1 > Câu con 1 > Câu con 2"
        let label = `Câu ${parts[0] + 1}`;
        for (let i = 1; i < parts.length; i++) {
            label += ` > Câu con ${parts[i] + 1}`;
        }
        return label;
    };

    // Helper function to create full image ID
    const getFullImageId = (questionId: string, subPath?: string): string => {
        return subPath ? `${questionId}|||${subPath}` : questionId;
    };

    const handleStartEdit = (question: any) => {
        setEditFormData({
            content: question.content,
            section: question.section || '',
            images: question.images || [],
            questionType: question.question_type,
            options: question.options || {},
            correctAnswer: question.correct_answer || [],
            explanation: question.explanation || '',
        });
        setQuestionImages([]);
        setIsEditing(true);
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
        setEditFormData(null);
        setQuestionImages([]);
    };

    const handleImageUpload = (questionId: string, files: FileList | null, subPath?: string) => {
        if (!files?.length) return;

        const fullId = getFullImageId(questionId, subPath);

        const existing = questionImages.filter(i => i.questionId === fullId);
        const nextIndex = existing.length ? Math.max(...existing.map(i => i.imageIndex)) + 1 : 0;

        const newImgs = Array.from(files).map((file, i) => ({
            questionId: fullId,
            image: file,
            imageIndex: nextIndex + i
        })).filter(f => {
            if (!f.image.type.startsWith('image/')) {
                alert(`File ${f.image.name} không phải là file ảnh`);
                return false;
            }
            if (f.image.size > 10 * 1024 * 1024) {
                alert(`File ${f.image.name} có kích thước vượt quá 10MB`);
                return false;
            }
            return true;
        });

        setQuestionImages(prev => [
            ...prev.filter(i => i.questionId !== fullId),
            ...newImgs
        ]);
    };

    // Replace image at specific position
    const handleReplaceImage = (questionId: string, oldImageIndex: number, files: FileList | null, subPath?: string) => {
        if (!files?.length) return;

        const fullId = getFullImageId(questionId, subPath);
        const file = files[0]; // Only take first file when replacing

        // Validate file
        if (!file.type.startsWith('image/')) {
            alert(`File ${file.name} không phải là file ảnh`);
            return;
        }
        if (file.size > 10 * 1024 * 1024) {
            alert(`File ${file.name} có kích thước vượt quá 10MB`);
            return;
        }

        // Replace image at the same index
        setQuestionImages(prev => prev.map(img => {
            if (img.questionId === fullId && img.imageIndex === oldImageIndex) {
                return { ...img, image: file };
            }
            return img;
        }));
    };

    const handleRemoveImage = (questionId: string, imageIndex: number, subPath?: string) => {
        const fullId = getFullImageId(questionId, subPath);
        setQuestionImages(prev => prev.filter(i => !(i.questionId === fullId && i.imageIndex === imageIndex)));
    };

    const getQuestionImages = (questionId: string, subPath?: string) => {
        const fullId = getFullImageId(questionId, subPath);
        return questionImages
            .filter(i => i.questionId === fullId)
            .sort((a, b) => a.imageIndex - b.imageIndex);
    };

    const getQuestionImageCount = (questionId: string, subPath?: string): number => {
        const fullId = getFullImageId(questionId, subPath);
        return questionImages.filter(img => img.questionId === fullId).length;
    };

    // Count image_placeholder in content
    const countImagePlaceholders = (content: string | undefined | null): number => {
        if (!content || typeof content !== 'string') return 0;
        const regex = /image_placeholder/gi;
        const matches = content.match(regex);
        return matches ? matches.length : 0;
    };

    const handleSaveEdit = async () => {
        if (!selectedQuestion || !editFormData) return;

        try {
            const questionId = selectedQuestion.question.id;
            const placeholderCount = countImagePlaceholders(editFormData.content);
            const uploadedImagesForQuestion = getQuestionImages(questionId);

            // If there are uploaded images, use updateQuestionWithImages
            if (uploadedImagesForQuestion.length > 0) {
                // Filter images to only include those with valid imageIndex (0 to placeholderCount - 1)
                // and ensure we have exactly placeholderCount images in order
                const validImages = uploadedImagesForQuestion
                    .filter(img => img.imageIndex >= 0 && img.imageIndex < placeholderCount)
                    .sort((a, b) => a.imageIndex - b.imageIndex);

                // If we have placeholders, ensure we have the right number of images
                if (placeholderCount > 0) {
                    // Create array with placeholderCount slots, initialized with undefined
                    const orderedImages: (File | undefined)[] = new Array(placeholderCount).fill(undefined);
                    const orderedImageNames: (string | undefined)[] = new Array(placeholderCount).fill(undefined);

                    // Fill in uploaded images at their correct positions (preserve order)
                    validImages.forEach(img => {
                        if (img.imageIndex >= 0 && img.imageIndex < placeholderCount) {
                            orderedImages[img.imageIndex] = img.image;
                            orderedImageNames[img.imageIndex] = img.image.name;
                        }
                    });

                    // Fill remaining slots with existing URLs if available (maintain order)
                    const existingImageUrls = (editFormData.images || []).filter(url =>
                        url.startsWith('http://') || url.startsWith('https://')
                    );

                    for (let i = 0; i < placeholderCount; i++) {
                        if (!orderedImages[i] && existingImageUrls[i]) {
                            orderedImageNames[i] = existingImageUrls[i];
                        }
                    }

                    // Build final arrays maintaining order (0 to placeholderCount - 1)
                    // Ensure we have exactly placeholderCount images to match placeholders
                    const finalImageNames: string[] = new Array(placeholderCount).fill('');
                    const finalImages: File[] = [];

                    // Fill in images at their correct positions (preserve order)
                    for (let i = 0; i < placeholderCount; i++) {
                        // Priority: uploaded image > existing URL
                        if (orderedImageNames[i]) {
                            finalImageNames[i] = orderedImageNames[i]!;
                            // Add File object if it's an uploaded image
                            if (orderedImages[i]) {
                                finalImages.push(orderedImages[i]!);
                            }
                        } else if (existingImageUrls[i]) {
                            // Use existing URL if no uploaded image at this position
                            finalImageNames[i] = existingImageUrls[i];
                        }
                        // If no image at position i, finalImageNames[i] remains empty string
                    }

                    // Ensure we have exactly placeholderCount images
                    // Fill any empty positions with existing URLs to maintain count and order
                    for (let i = 0; i < placeholderCount; i++) {
                        if (finalImageNames[i] === '') {
                            // Try to use existing URL at this position first
                            if (existingImageUrls[i]) {
                                finalImageNames[i] = existingImageUrls[i];
                            } else if (existingImageUrls.length > 0) {
                                // If no URL at this position, use the last available URL
                                finalImageNames[i] = existingImageUrls[existingImageUrls.length - 1];
                            }
                        }
                    }

                    // Now finalImageNames should have exactly placeholderCount elements
                    // (some may be empty strings if no images/URLs available)
                    // Filter out empty strings but this may reduce count
                    // To maintain count = placeholderCount, we should keep empty strings
                    // But backend may not accept empty strings, so we filter them
                    const imagesToSend = finalImageNames.filter(name => name !== '');

                    // Validate: we should have exactly placeholderCount images
                    if (imagesToSend.length !== placeholderCount && imagesToSend.length > 0) {
                        // Show warning but allow submit
                        console.warn(`Warning: Expected ${placeholderCount} images but have ${imagesToSend.length}. Order may not be preserved.`);
                    }

                    // If we have valid images, use them (order is preserved by array indices)
                    // If count doesn't match, order is still preserved for the images we have

                    const updateData: UpdateQuestionWithImagesDto = {
                        content: editFormData.content,
                        section: editFormData.section,
                        images: imagesToSend.length > 0 ? imagesToSend : undefined,
                        questionType: editFormData.questionType,
                        options: editFormData.options,
                        correctAnswer: editFormData.correctAnswer,
                        explanation: editFormData.explanation,
                    };

                    await updateQuestionWithImagesMutation.mutateAsync({
                        id: questionId,
                        data: updateData,
                        images: finalImages,
                    });
                } else {
                    // No placeholders, but we have uploaded images - add them at the end
                    const imageFileNames = validImages.map(img => img.image.name);
                    const existingImageUrls = (editFormData.images || []).filter(url =>
                        url.startsWith('http://') || url.startsWith('https://')
                    );
                    const allImages = [...imageFileNames, ...existingImageUrls];

                    const updateData: UpdateQuestionWithImagesDto = {
                        content: editFormData.content,
                        section: editFormData.section,
                        images: allImages.length > 0 ? allImages : undefined,
                        questionType: editFormData.questionType,
                        options: editFormData.options,
                        correctAnswer: editFormData.correctAnswer,
                        explanation: editFormData.explanation,
                    };

                    await updateQuestionWithImagesMutation.mutateAsync({
                        id: questionId,
                        data: updateData,
                        images: validImages.map(img => img.image),
                    });
                }
            } else {
                // No new images, use regular update
                await updateQuestionMutation.mutateAsync({
                    id: questionId,
                    data: editFormData,
                });
            }

            setIsEditing(false);
            setEditFormData(null);
            setQuestionImages([]);
            refetch();
        } catch (error) {
            console.error('Error updating question:', error);
            alert('Có lỗi xảy ra khi cập nhật câu hỏi. Vui lòng thử lại.');
        }
    };

    const handleAddOption = () => {
        if (!editFormData) return;
        const optionKeys = Object.keys(editFormData.options || {});
        const nextKey = optionKeys.length > 0
            ? String.fromCharCode(optionKeys[optionKeys.length - 1].charCodeAt(0) + 1)
            : 'A';
        setEditFormData(prev => prev ? ({
            ...prev,
            options: { ...prev.options, [nextKey]: '' }
        }) : null);
    };

    const handleRemoveOption = (key: string) => {
        if (!editFormData) return;
        const newOptions = { ...editFormData.options };
        delete newOptions[key];
        setEditFormData(prev => prev ? ({
            ...prev,
            options: newOptions,
            correctAnswer: prev.correctAnswer?.filter(ans => ans !== key)
        }) : null);
    };

    const handleOptionChange = (key: string, value: string) => {
        if (!editFormData) return;
        setEditFormData(prev => prev ? ({
            ...prev,
            options: { ...prev.options, [key]: value }
        }) : null);
    };

    const handleCorrectAnswerToggle = (key: string) => {
        if (!editFormData) return;
        const currentAnswers = editFormData.correctAnswer || [];
        const isMultiple = editFormData.questionType === QuestionType.MULTIPLE_CHOICE;

        if (isMultiple) {
            setEditFormData(prev => prev ? ({
                ...prev,
                correctAnswer: currentAnswers.includes(key)
                    ? currentAnswers.filter(ans => ans !== key)
                    : [...currentAnswers, key]
            }) : null);
        } else {
            setEditFormData(prev => prev ? ({
                ...prev,
                correctAnswer: [key]
            }) : null);
        }
    };

    const getTypeLabel = (type: string) => {
        switch (type) {
            case 'HSA': return 'HSA';
            case 'TSA': return 'TSA';
            case 'chapter': return 'Chapter';
            default: return type;
        }
    };

    const getTypeColor = (type: string) => {
        switch (type) {
            case 'HSA': return 'bg-blue-100 text-blue-800';
            case 'TSA': return 'bg-green-100 text-green-800';
            case 'chapter': return 'bg-purple-100 text-purple-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getDifficultyColor = (difficulty: string) => {
        switch (difficulty) {
            case 'Dễ': return 'bg-green-100 text-green-800';
            case 'Trung bình': return 'bg-yellow-100 text-yellow-800';
            case 'Khó': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
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

    // Render content with images replacing placeholders
    // Similar to ImportExamSetModal.tsx
    const renderContentWithImages = (questionId: string, content: string, subPath?: string, existingImages?: string[] | string): React.ReactNode => {
        // Get uploaded images from state
        const uploadedImages = getQuestionImages(questionId, subPath);

        // Convert existing images to array if it's a string
        const existingImagesArray = Array.isArray(existingImages) ? existingImages : (existingImages ? [existingImages] : []);

        const placeholders = content.match(/image_placeholder/gi) || [];

        // Create a map of placeholder index to image
        // Priority: uploaded images (by imageIndex) > existing images (by array index)
        const imageMap = new Map<number, File | string>();

        // First, map uploaded images by their imageIndex
        uploadedImages.forEach(imgItem => {
            imageMap.set(imgItem.imageIndex, imgItem.image);
        });

        // Then, fill remaining positions with existing images
        existingImagesArray.forEach((imgUrl, idx) => {
            if (!imageMap.has(idx)) {
                imageMap.set(idx, imgUrl);
            }
        });

        // Create array of images in order (for unused images)
        const allImages: (File | string)[] = Array.from(imageMap.values());

        if (placeholders.length === 0) {
            // No placeholders, render content normally, then add all images at the end if they exist
            return (
                <>
                    <div className="text-xl font-bold text-gray-900 leading-relaxed">
                        <RichRenderer content={content} />
                    </div>
                    {allImages.length > 0 && (
                        <div className="mt-4 space-y-4">
                            {allImages.map((img, idx) => (
                                <div key={`default-img-${idx}`} className="my-4">
                                    {img instanceof File ? (
                                        <img
                                            src={URL.createObjectURL(img)}
                                            alt={`Image ${idx + 1}`}
                                            className="max-w-full rounded border border-gray-200"
                                        />
                                    ) : (
                                        <img
                                            src={img}
                                            alt={`Image ${idx + 1}`}
                                            className="max-w-full rounded border border-gray-200"
                                            onError={(e) => {
                                                e.currentTarget.style.display = 'none';
                                            }}
                                        />
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </>
            );
        }

        // Split content by placeholders and insert images
        const parts = content.split(/(image_placeholder)/gi);
        const elements: React.ReactNode[] = [];
        let imageIndex = 0;
        const unusedImages: (File | string)[] = [];

        parts.forEach((part, index) => {
            if (part.toLowerCase() === 'image_placeholder') {
                const placeholderIndex = imageIndex;
                const inputId = `image-placeholder-${questionId}${subPath ? `-${subPath}` : ''}-${placeholderIndex}`;

                // Get image for this placeholder position
                const img = imageMap.get(placeholderIndex);

                if (img) {
                    const isUploadedFile = img instanceof File;
                    const imgSrc = isUploadedFile ? URL.createObjectURL(img) : img;

                    // Find the uploaded image index if it's an uploaded file
                    const uploadedImageItem = isUploadedFile
                        ? uploadedImages.find(u => u.image === img)
                        : null;
                    const targetImageIndex = uploadedImageItem?.imageIndex ?? placeholderIndex;

                    elements.push(
                        <div key={`img-${index}`} className="my-4 relative group">
                            <input
                                type="file"
                                id={inputId}
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => {
                                    if (e.target.files && e.target.files.length > 0) {
                                        // Only take first file to ensure 1 image per placeholder
                                        const file = e.target.files[0];

                                        if (!file.type.startsWith('image/')) {
                                            alert(`File ${file.name} không phải là file ảnh`);
                                            e.target.value = '';
                                            return;
                                        }
                                        if (file.size > 10 * 1024 * 1024) {
                                            alert(`File ${file.name} có kích thước vượt quá 10MB`);
                                            e.target.value = '';
                                            return;
                                        }

                                        const fullId = getFullImageId(questionId, subPath);

                                        if (isUploadedFile && uploadedImageItem) {
                                            // Replace existing uploaded image at the same position
                                            handleReplaceImage(questionId, uploadedImageItem.imageIndex, e.target.files, subPath);
                                        } else {
                                            // Check if there's already an image at this placeholder position
                                            const existingAtPosition = questionImages.find(
                                                i => i.questionId === fullId && i.imageIndex === placeholderIndex
                                            );

                                            if (existingAtPosition) {
                                                // Replace at the same position
                                                handleReplaceImage(questionId, placeholderIndex, e.target.files, subPath);
                                            } else {
                                                // Add new image at placeholder position
                                                setQuestionImages(prev => [
                                                    ...prev,
                                                    { questionId: fullId, image: file, imageIndex: placeholderIndex }
                                                ]);
                                            }
                                        }
                                    }
                                    e.target.value = '';
                                }}
                            />
                            <label
                                htmlFor={inputId}
                                className="cursor-pointer block"
                            >
                                <img
                                    src={imgSrc}
                                    alt={`Image ${imageIndex + 1}`}
                                    className="max-w-full rounded border border-green-300 hover:border-blue-500 transition-colors"
                                />
                            </label>
                            {isUploadedFile && (
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        e.preventDefault();
                                        if (uploadedImageItem) {
                                            handleRemoveImage(questionId, uploadedImageItem.imageIndex, subPath);
                                        }
                                    }}
                                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 z-10"
                                    title="Xóa ảnh"
                                >
                                    ✕
                                </button>
                            )}
                            <div className="absolute bottom-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                                Ảnh {imageIndex + 1} (Click để thay đổi)
                            </div>
                        </div>
                    );
                    imageIndex++;
                } else {
                    // Placeholder without image - clickable to upload
                    elements.push(
                        <label
                            key={`placeholder-${index}`}
                            htmlFor={inputId}
                            className="inline-block px-3 py-2 my-2 bg-yellow-100 text-yellow-800 rounded text-sm border-2 border-yellow-300 font-medium cursor-pointer hover:bg-yellow-200 hover:border-yellow-400 transition-colors"
                        >
                            [Click để upload ảnh {imageIndex + 1}]
                        </label>
                    );
                    elements.push(
                        <input
                            key={`input-${index}`}
                            type="file"
                            id={inputId}
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                                if (e.target.files && e.target.files.length > 0) {
                                    // Only take first file to ensure 1 image per placeholder
                                    const file = e.target.files[0];

                                    if (!file.type.startsWith('image/')) {
                                        alert(`File ${file.name} không phải là file ảnh`);
                                        e.target.value = '';
                                        return;
                                    }
                                    if (file.size > 10 * 1024 * 1024) {
                                        alert(`File ${file.name} có kích thước vượt quá 10MB`);
                                        e.target.value = '';
                                        return;
                                    }

                                    const fullId = getFullImageId(questionId, subPath);
                                    // Check if there's already an image at this placeholder position
                                    const existingAtPosition = questionImages.find(
                                        i => i.questionId === fullId && i.imageIndex === placeholderIndex
                                    );

                                    if (existingAtPosition) {
                                        // Replace at the same position
                                        handleReplaceImage(questionId, placeholderIndex, e.target.files, subPath);
                                    } else {
                                        // Add new image at placeholder position
                                        setQuestionImages(prev => [
                                            ...prev,
                                            { questionId: fullId, image: file, imageIndex: placeholderIndex }
                                        ]);
                                    }
                                }
                                e.target.value = '';
                            }}
                        />
                    );
                    imageIndex++;
                }
            } else if (part.trim()) {
                elements.push(
                    <span key={`text-${index}`}>
                        <RichRenderer content={part} />
                    </span>
                );
            }
        });

        // Add unused images at the end (images with imageIndex >= number of placeholders)
        const placeholderCount = placeholders.length;
        imageMap.forEach((img, idx) => {
            if (idx >= placeholderCount) {
                unusedImages.push(img);
            }
        });

        return (
            <>
                <div className="text-xl font-bold text-gray-900 leading-relaxed">{elements}</div>
                {unusedImages.length > 0 && (
                    <div className="mt-4 space-y-4">
                        {unusedImages.map((img, idx) => (
                            <div key={`unused-img-${idx}`} className="my-4">
                                {img instanceof File ? (
                                    <img
                                        src={URL.createObjectURL(img)}
                                        alt={`Image ${imageIndex + idx}`}
                                        className="max-w-full rounded border border-gray-200"
                                    />
                                ) : (
                                    <img
                                        src={img}
                                        alt={`Image ${imageIndex + idx}`}
                                        className="max-w-full rounded border border-gray-200"
                                        onError={(e) => {
                                            e.currentTarget.style.display = 'none';
                                        }}
                                    />
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </>
        );
    };

    // Recursive function to render question tree (directory-like structure)
    const renderQuestionTree = (examQuestion: any, path: string, depth: number = 0): React.ReactNode => {
        const question = examQuestion.question || examQuestion;
        const isSelected = selectedQuestionPath === path;
        const isGroupQuestion = question.question_type === QuestionType.GROUP_QUESTION;
        const hasSubQuestions = question.subQuestions && question.subQuestions.length > 0;

        // Get question number/label
        const pathParts = path.split('_');
        const questionNumber = depth === 0
            ? `Câu ${parseInt(pathParts[0]) + 1}`
            : `Câu con ${pathParts[pathParts.length - 1] + 1}`;

        // Directory-like indentation
        const indentStyle = { paddingLeft: `${depth * 20}px` };

        return (
            <div key={path} className="mb-1">
                <button
                    onClick={() => setSelectedQuestionPath(path)}
                    className={`w-full text-left p-2.5 rounded-lg border-2 transition-all ${isSelected
                        ? 'border-blue-500 bg-blue-50 shadow-md'
                        : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
                        }`}
                    style={indentStyle}
                >
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2 flex-1 min-w-0">
                            {/* Tree connector lines */}
                            {depth > 0 && (
                                <div className="flex items-center space-x-1 text-gray-300">
                                    <span className="text-xs">│</span>
                                    <span className="text-xs">└─</span>
                                </div>
                            )}
                            {/* Folder/File icon */}
                            {isGroupQuestion && hasSubQuestions ? (
                                <span className="text-base">📁</span>
                            ) : (
                                <span className="text-base">📄</span>
                            )}
                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium whitespace-nowrap ${isSelected
                                ? 'bg-blue-600 text-white'
                                : 'bg-blue-100 text-blue-800'
                                }`}>
                                {questionNumber}
                            </span>
                            <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs whitespace-nowrap">
                                {question.question_type}
                            </span>
                            {depth === 0 && examQuestion.points && (
                                <span className="px-2 py-0.5 bg-green-100 text-green-600 rounded text-xs whitespace-nowrap">
                                    {examQuestion.points} điểm
                                </span>
                            )}
                        </div>
                        {isGroupQuestion && hasSubQuestions && (
                            <span className="text-xs text-gray-500 whitespace-nowrap ml-2">
                                {question.subQuestions.length} câu con
                            </span>
                        )}
                    </div>
                    <div className="mt-2 text-sm text-gray-700 line-clamp-2">
                        {isImageAnswer(question.content) ? (
                            <span className="text-gray-500 italic">[Hình ảnh]</span>
                        ) : (
                            <RichRenderer content={question.content?.substring(0, 100) || ''} />
                        )}
                        {question.content && question.content.length > 100 && '...'}
                    </div>
                </button>

                {/* Render subquestions recursively */}
                {hasSubQuestions && (
                    <div className="mt-0.5">
                        {question.subQuestions.map((subQuestion: any, subIndex: number) => {
                            const subPath = `${path}_${subIndex}`;
                            return renderQuestionTree(subQuestion, subPath, depth + 1);
                        })}
                    </div>
                )}
            </div>
        );
    };

    if (!isOpen) return null;

    // Get selected question using path
    const selectedQuestionData = selectedQuestionPath ? getQuestionByPath(selectedQuestionPath) : null;
    const selectedQuestion = selectedQuestionData ? {
        question: selectedQuestionData.question,
        isSubQuestion: selectedQuestionData.isSubQuestion,
        parentPath: selectedQuestionData.parentPath
    } : null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg w-full h-[95vh] flex flex-col">
                {/* Header */}
                <div className="p-6 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">
                                Chi tiết đề thi
                            </h2>
                            {examSetDetail && (
                                <p className="text-gray-600 mt-1">{examSetDetail.name}</p>
                            )}
                        </div>
                        <button
                            onClick={onClose}
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
                    {/* Left Side - Exam Info & Question List or Edit Form */}
                    <div className="w-1/2 border-r border-gray-200 flex flex-col bg-gray-50 overflow-hidden">
                        {isEditing && editFormData && selectedQuestionPath ? (
                            /* Edit Mode - Full Screen Form */
                            <div className="flex-1 overflow-y-auto bg-white">
                                <div className="p-6 space-y-4">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-lg font-semibold text-gray-900">Chỉnh sửa {getQuestionLabel(selectedQuestionPath)}</h3>
                                        <div className="flex space-x-2">
                                            <button
                                                onClick={handleSaveEdit}
                                                disabled={updateQuestionMutation.isPending || updateQuestionWithImagesMutation.isPending}
                                                className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                                            >
                                                {(updateQuestionMutation.isPending || updateQuestionWithImagesMutation.isPending) ? (
                                                    <>
                                                        <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                                        Đang lưu...
                                                    </>
                                                ) : (
                                                    'Lưu'
                                                )}
                                            </button>
                                            <button
                                                onClick={handleCancelEdit}
                                                disabled={updateQuestionMutation.isPending || updateQuestionWithImagesMutation.isPending}
                                                className="px-3 py-1 bg-gray-200 text-gray-700 rounded text-sm hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                Hủy
                                            </button>
                                        </div>
                                    </div>

                                    <div>
                                        <div className="flex items-center justify-between mb-2">
                                            <label className="block text-sm font-medium text-gray-700">Nội dung *</label>
                                        </div>
                                        <textarea
                                            value={editFormData.content || ''}
                                            onChange={(e) => setEditFormData(prev => prev ? ({ ...prev, content: e.target.value }) : null)}
                                            rows={4}
                                            className="w-full h-[500px] px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                            required
                                        />
                                        {(() => {
                                            const questionId = selectedQuestion?.question.id || '';
                                            const placeholderCount = countImagePlaceholders(editFormData.content);
                                            const uploadedCount = getQuestionImageCount(questionId);
                                            if (placeholderCount > 0 && uploadedCount < placeholderCount) {
                                                return (
                                                    <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded-lg">
                                                        <p className="text-xs text-yellow-800 font-medium">
                                                            ⚠️ Cần upload thêm {placeholderCount - uploadedCount} ảnh để thay thế các placeholder
                                                        </p>
                                                    </div>
                                                );
                                            }
                                            return null;
                                        })()}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Loại câu hỏi *</label>
                                        <select
                                            value={editFormData.questionType || ''}
                                            onChange={(e) => setEditFormData(prev => prev ? ({ ...prev, questionType: e.target.value as QuestionType }) : null)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                            required
                                        >
                                            <option value={QuestionType.SINGLE_CHOICE}>Single Choice</option>
                                            <option value={QuestionType.MULTIPLE_CHOICE}>Multiple Choice</option>
                                            <option value={QuestionType.TRUE_FALSE}>True/False</option>
                                            <option value={QuestionType.SHORT_ANSWER}>Short Answer</option>
                                        </select>
                                    </div>

                                    {/* Options for single/multiple choice */}
                                    {(editFormData.questionType === QuestionType.SINGLE_CHOICE || editFormData.questionType === QuestionType.MULTIPLE_CHOICE) && (
                                        <div>
                                            <div className="flex items-center justify-between mb-2">
                                                <label className="block text-sm font-medium text-gray-700">Các đáp án</label>
                                                <button
                                                    type="button"
                                                    onClick={handleAddOption}
                                                    className="px-2 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700"
                                                >
                                                    + Thêm
                                                </button>
                                            </div>
                                            <div className="space-y-2">
                                                {Object.entries(editFormData.options || {}).map(([key, value]) => (
                                                    <div key={key} className="flex items-center space-x-2">
                                                        <input
                                                            type={editFormData.questionType === QuestionType.MULTIPLE_CHOICE ? 'checkbox' : 'radio'}
                                                            checked={editFormData.correctAnswer?.includes(key) || false}
                                                            onChange={() => handleCorrectAnswerToggle(key)}
                                                            className="mt-1"
                                                        />
                                                        <span className="font-medium text-gray-700 text-sm">{key}.</span>
                                                        <input
                                                            type="text"
                                                            value={value}
                                                            onChange={(e) => handleOptionChange(key, e.target.value)}
                                                            className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm"
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={() => handleRemoveOption(key)}
                                                            className="px-2 py-1 text-red-600 hover:text-red-800 text-sm"
                                                        >
                                                            ✕
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Correct answer for short answer */}
                                    {editFormData.questionType === QuestionType.SHORT_ANSWER && (
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Đáp án đúng *</label>
                                            <input
                                                type="text"
                                                value={editFormData.correctAnswer?.[0] || ''}
                                                onChange={(e) => setEditFormData(prev => prev ? ({ ...prev, correctAnswer: [e.target.value] }) : null)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                                required
                                            />
                                        </div>
                                    )}

                                    {/* Correct answer for true/false */}
                                    {editFormData.questionType === QuestionType.TRUE_FALSE && (
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Đáp án đúng *</label>
                                            <div className="space-y-2">
                                                <label className="flex items-center">
                                                    <input
                                                        type="radio"
                                                        checked={editFormData.correctAnswer?.includes('true') || false}
                                                        onChange={() => setEditFormData(prev => prev ? ({ ...prev, correctAnswer: ['true'] }) : null)}
                                                        className="mr-2"
                                                    />
                                                    <span className="text-sm">Đúng</span>
                                                </label>
                                                <label className="flex items-center">
                                                    <input
                                                        type="radio"
                                                        checked={editFormData.correctAnswer?.includes('false') || false}
                                                        onChange={() => setEditFormData(prev => prev ? ({ ...prev, correctAnswer: ['false'] }) : null)}
                                                        className="mr-2"
                                                    />
                                                    <span className="text-sm">Sai</span>
                                                </label>
                                            </div>
                                        </div>
                                    )}

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Giải thích</label>
                                        <textarea
                                            value={editFormData.explanation || ''}
                                            onChange={(e) => setEditFormData(prev => prev ? ({ ...prev, explanation: e.target.value }) : null)}
                                            rows={3}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                        />
                                    </div>
                                </div>
                            </div>
                        ) : (
                            /* View Mode - Exam Info & Question List */
                            <>
                                {/* Exam Info Toggle */}
                                <div className="p-4 border-b border-gray-200 bg-white">
                                    <button
                                        type="button"
                                        onClick={() => setShowExamInfo(!showExamInfo)}
                                        className="flex items-center space-x-2 text-sm font-medium text-gray-700 hover:text-gray-900"
                                    >
                                        <svg
                                            className={`w-4 h-4 transition-transform ${showExamInfo ? 'rotate-90' : ''}`}
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                        <span>Thông tin đề thi</span>
                                        <span className="text-xs text-gray-500">({showExamInfo ? 'Ẩn' : 'Hiện'})</span>
                                    </button>
                                </div>

                                {/* Exam Info - Collapsible */}
                                {showExamInfo && examSetDetail && (
                                    <div className="p-4 border-b border-gray-200 bg-white">
                                        <div className="grid grid-cols-2 gap-3 text-xs">
                                            <div>
                                                <span className="font-medium text-gray-700">Loại:</span>
                                                <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(examSetDetail.type)}`}>
                                                    {getTypeLabel(examSetDetail.type)}
                                                </span>
                                            </div>
                                            <div>
                                                <span className="font-medium text-gray-700">Năm học:</span>
                                                <span className="ml-2">{examSetDetail.year}</span>
                                            </div>
                                            <div>
                                                <span className="font-medium text-gray-700">Khối lớp:</span>
                                                <span className="ml-2">{examSetDetail.grade}</span>
                                            </div>
                                            <div>
                                                <span className="font-medium text-gray-700">Môn học:</span>
                                                <span className="ml-2">{examSetDetail.subject}</span>
                                            </div>
                                            <div>
                                                <span className="font-medium text-gray-700">Thời gian:</span>
                                                <span className="ml-2">{examSetDetail.duration}</span>
                                            </div>
                                            <div>
                                                <span className="font-medium text-gray-700">Độ khó:</span>
                                                <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(examSetDetail.difficulty)}`}>
                                                    {examSetDetail.difficulty}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="mt-3">
                                            <span className="font-medium text-gray-700 text-xs">Mô tả:</span>
                                            <p className="mt-1 text-gray-600 text-xs">{examSetDetail.description}</p>
                                        </div>
                                    </div>
                                )}

                                {/* Question List */}
                                <div className="flex-1 overflow-y-auto p-4 min-h-0">
                                    {isLoading ? (
                                        <div className="flex items-center justify-center h-full">
                                            <div className="text-center">
                                                <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                                                <p className="text-gray-600 text-sm">Đang tải...</p>
                                            </div>
                                        </div>
                                    ) : error ? (
                                        <div className="flex items-center justify-center h-full">
                                            <div className="text-center">
                                                <div className="text-red-500 text-4xl mb-4">⚠️</div>
                                                <p className="text-red-600 text-sm">Có lỗi xảy ra</p>
                                            </div>
                                        </div>
                                    ) : examSetDetail ? (
                                        <div className="space-y-2">
                                            <h3 className="text-sm font-semibold text-gray-900 mb-3">
                                                Danh sách câu hỏi ({examSetDetail.examQuestions.length} câu)
                                            </h3>
                                            {examSetDetail.examQuestions.map((examQuestion, index) => {
                                                const path = String(index);
                                                return renderQuestionTree(examQuestion, path, 0);
                                            })}
                                        </div>
                                    ) : null}
                                </div>
                            </>
                        )}
                    </div>

                    {/* Right Side - Preview Only */}
                    <div className="w-1/2 bg-white flex flex-col" id="preview-panel">
                        <div className="flex-1 overflow-y-auto p-6">
                            {isEditing && editFormData ? (
                                /* Preview Mode - Show editFormData preview */
                                <div className="space-y-6">
                                    <div className="mb-4">
                                        <div className="flex items-center justify-between mb-3">
                                            <div className="flex items-center space-x-2">
                                                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                                                    {selectedQuestionPath ? getQuestionLabel(selectedQuestionPath) : 'Câu hỏi'} (Đang chỉnh sửa)
                                                </span>
                                                <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                                                    {editFormData.questionType}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Preview Content with Images */}
                                    <div className="mb-4">
                                        {isImageAnswer(editFormData.content || '') ? (
                                            <div className="mb-6">
                                                <img src={editFormData.content} alt="Preview" className="max-w-full rounded" />
                                            </div>
                                        ) : (
                                            <div className="mb-6">
                                                {renderContentWithImages(selectedQuestion?.question.id || '', editFormData.content || '', undefined, editFormData.images)}
                                            </div>
                                        )}
                                    </div>

                                    {/* Preview Answer Options */}
                                    {(editFormData.questionType === QuestionType.MULTIPLE_CHOICE || editFormData.questionType === QuestionType.SINGLE_CHOICE) && editFormData.options && (
                                        <div className="space-y-2">
                                            {Object.entries(editFormData.options).map(([option, text]) => {
                                                const isImage = isImageAnswer(text);
                                                const isCorrect = editFormData.correctAnswer?.includes(option) || false;
                                                return (
                                                    <label
                                                        key={option}
                                                        className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${isCorrect ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'}`}
                                                    >
                                                        <input
                                                            type={editFormData.questionType === QuestionType.MULTIPLE_CHOICE ? 'checkbox' : 'radio'}
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
                                                        {isCorrect && <span className="ml-2 text-green-600 font-semibold">✓</span>}
                                                    </label>
                                                );
                                            })}
                                        </div>
                                    )}

                                    {editFormData.questionType === QuestionType.TRUE_FALSE && (
                                        <div className="space-y-2">
                                            <label className={`flex items-start p-3 border-2 rounded-lg cursor-pointer transition-colors ${editFormData.correctAnswer?.includes('true') ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-gray-300'}`}>
                                                <input type="radio" checked={editFormData.correctAnswer?.includes('true') || false} readOnly className="mt-1 mr-3" />
                                                <div className="flex">
                                                    <span className="font-medium text-gray-900 mr-2">Đúng</span>
                                                    {editFormData.correctAnswer?.includes('true') && <span className="ml-2 text-green-600 font-semibold">✓</span>}
                                                </div>
                                            </label>
                                            <label className={`flex items-start p-3 border-2 rounded-lg cursor-pointer transition-colors ${editFormData.correctAnswer?.includes('false') ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-gray-300'}`}>
                                                <input type="radio" checked={editFormData.correctAnswer?.includes('false') || false} readOnly className="mt-1 mr-3" />
                                                <div className="flex">
                                                    <span className="font-medium text-gray-900 mr-2">Sai</span>
                                                    {editFormData.correctAnswer?.includes('false') && <span className="ml-2 text-green-600 font-semibold">✓</span>}
                                                </div>
                                            </label>
                                        </div>
                                    )}

                                    {editFormData.questionType === QuestionType.SHORT_ANSWER && (
                                        <div className="space-y-2">
                                            <div className="p-4 border-2 bg-gray-100 border-gray-200 rounded-lg">
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Đáp án:</label>
                                                <div className="w-full text-black px-3 py-2 border font-bold bg-white border-gray-300 rounded-md">
                                                    {editFormData.correctAnswer?.[0] || ''}
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {editFormData.explanation && (
                                        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                            <p className="text-sm text-blue-800">
                                                <span className="font-semibold">Giải thích: </span>
                                                <RichRenderer content={editFormData.explanation} />
                                            </p>
                                        </div>
                                    )}
                                </div>
                            ) : selectedQuestion ? (
                                /* View Mode - Show selectedQuestion */
                                <div className="space-y-6">
                                    {/* Question Header */}
                                    <div className="mb-4">
                                        <div className="flex items-center justify-between mb-3">
                                            <div className="flex items-center space-x-2">
                                                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                                                    {selectedQuestionPath ? getQuestionLabel(selectedQuestionPath) : 'Câu hỏi'}
                                                </span>
                                                <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                                                    {selectedQuestion.question.question_type}
                                                </span>
                                                {!selectedQuestion.isSubQuestion && examSetDetail && (() => {
                                                    const mainIndex = parseInt(selectedQuestionPath?.split('_')[0] || '0');
                                                    const mainQuestion = examSetDetail.examQuestions[mainIndex];
                                                    return mainQuestion?.points ? (
                                                        <span className="px-2 py-1 bg-green-100 text-green-600 rounded text-xs">
                                                            {mainQuestion.points} điểm
                                                        </span>
                                                    ) : null;
                                                })()}
                                            </div>
                                            <button
                                                onClick={() => handleStartEdit(selectedQuestion.question)}
                                                className="px-3 py-1 text-orange-600 hover:text-orange-800 text-sm font-medium flex items-center space-x-1"
                                                title="Chỉnh sửa câu hỏi"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                </svg>
                                                <span>Sửa</span>
                                            </button>
                                        </div>
                                    </div>

                                    {/* Question Content with Images */}
                                    <div className="mb-4">
                                        {isImageAnswer(selectedQuestion.question.content) ? (
                                            <div className="mb-6">
                                                <img src={selectedQuestion.question.content} alt={selectedQuestionPath ? getQuestionLabel(selectedQuestionPath) : 'Câu hỏi'} className="max-w-full rounded" />
                                            </div>
                                        ) : (
                                            <div className="mb-6">
                                                {renderContentWithImages(selectedQuestion.question.id, selectedQuestion.question.content, undefined, selectedQuestion.question.images)}
                                            </div>
                                        )}
                                    </div>

                                    {/* Answer Options */}
                                    {(selectedQuestion.question.question_type === QuestionType.MULTIPLE_CHOICE || selectedQuestion.question.question_type === QuestionType.SINGLE_CHOICE) && selectedQuestion.question.options && (
                                        <div className="space-y-2">
                                            {Object.entries(selectedQuestion.question.options).map(([option, text]) => {
                                                const textValue = String(text);
                                                const isImage = isImageAnswer(textValue);
                                                const correctAnswerArray = Array.isArray(selectedQuestion.question.correct_answer)
                                                    ? selectedQuestion.question.correct_answer
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
                                                            type={selectedQuestion.question.question_type === QuestionType.MULTIPLE_CHOICE ? 'checkbox' : 'radio'}
                                                            name={`question-${selectedQuestion.question.id}`}
                                                            value={option}
                                                            checked={isCorrect}
                                                            readOnly
                                                            className="mr-3"
                                                        />
                                                        <span className="font-semibold text-gray-700 mr-3">{option}.</span>
                                                        <div className="flex-1">
                                                            {isImage ? (
                                                                <img src={textValue} alt={`Đáp án ${option}`} className="max-w-full rounded" />
                                                            ) : (
                                                                <span className="text-gray-700">
                                                                    <RichRenderer content={textValue} />
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

                                    {selectedQuestion.question.question_type === QuestionType.TRUE_FALSE && (() => {
                                        const correctAnswerArray = Array.isArray(selectedQuestion.question.correct_answer)
                                            ? selectedQuestion.question.correct_answer
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
                                                        name={`question-${selectedQuestion.question.id}`}
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
                                                        name={`question-${selectedQuestion.question.id}`}
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

                                    {selectedQuestion.question.question_type === QuestionType.SHORT_ANSWER && (
                                        <div className="space-y-2">
                                            <div className="p-4 border-2 bg-gray-100 border-gray-200 rounded-lg">
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Đáp án:
                                                </label>
                                                <div className="w-full text-black px-3 py-2 border font-bold bg-white border-gray-300 rounded-md">
                                                    {Array.isArray(selectedQuestion.question.correct_answer)
                                                        ? selectedQuestion.question.correct_answer.join(', ')
                                                        : selectedQuestion.question.correct_answer}
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Group Questions - Show note about nested editing */}
                                    {selectedQuestion.question.question_type === QuestionType.GROUP_QUESTION && (
                                        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                                            <p className="text-sm text-yellow-800">
                                                <span className="font-semibold">Lưu ý:</span> Câu hỏi nhóm chứa {selectedQuestion.question.subQuestions?.length || 0} câu hỏi con.
                                                Chỉnh sửa câu hỏi nhóm cần thực hiện qua API hoặc import lại từ JSON.
                                            </p>
                                        </div>
                                    )}

                                    {/* Explanation */}
                                    {selectedQuestion.question.explanation && (
                                        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                            <p className="text-sm text-blue-800">
                                                <span className="font-semibold">Giải thích: </span>
                                                <RichRenderer content={selectedQuestion.question.explanation} />
                                            </p>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="flex items-center justify-center h-full text-gray-500">
                                    <div className="text-center">
                                        <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                        <p>Chọn một câu hỏi để xem chi tiết</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

