'use client';

import { useState } from 'react';
import { useCreateExamSet, useUploadExamSetWithImage, CreateExamSetDto, CreateQuestionDto, CreateSubQuestionDto, ExamSetType, QuestionType, SUBJECT_ID } from '@/hooks/useExam';
import RichRenderer from '@/components/RichRenderer';
import DragDropCloze from '@/components/exam/DragDropCloze';

interface ImportExamSetModalProps {
    isOpen: boolean;
    onClose: () => void;
}

interface ImportedSubQuestion {
    id: string;
    content: string;
    images?: string[]; // Support images for subquestions
    correctAnswer: string | string[]; // Support both string and array
    explanation: string;
    question_type?: string;
    questionType?: string; // Support both formats
    options?: Record<string, string>;
    subQuestions?: ImportedSubQuestion[]; // Support nested subquestions (group_question within group_question)
}

interface ImportedQuestion {
    id: string;
    section: string;
    content: string;
    images?: string[]; // Changed from image?: string to images?: string[]
    questionType: string;
    options?: Record<string, string>;
    correctAnswer: string | string[]; // Support both string and array
    explanation: string;
    subQuestions?: ImportedSubQuestion[];
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
        deadline: undefined,
        password: '',
    });

    const [jsonInput, setJsonInput] = useState('');
    const [parsedQuestions, setParsedQuestions] = useState<ImportedQuestion[]>([]);
    const [parseError, setParseError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [previewMode, setPreviewMode] = useState(false);
    const [showBasicInfo, setShowBasicInfo] = useState(false);
    const [questionImages, setQuestionImages] = useState<{ questionId: string; image: File; imageIndex: number }[]>([]);

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
            // parsed.forEach((q, index) => {
            //     if (!q.content || !q.questionType) {
            //         throw new Error(`Câu hỏi ${index + 1} thiếu các trường bắt buộc: content, questionType`);
            //     }
            // });

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

    const handleImageUpload = (questionId: string, files: FileList | null, subQuestionId?: string) => {
        if (!files || files.length === 0) return;

        // Create unique identifier: questionId for main question, questionId_subQuestionId for subquestion
        const uniqueId = subQuestionId ? `${questionId}_${subQuestionId}` : questionId;

        const newImages: { questionId: string; image: File; imageIndex: number }[] = [];

        // Get existing images for this question/subquestion to determine next index
        const existingImages = questionImages.filter(img => img.questionId === uniqueId);
        const maxIndex = existingImages.length > 0
            ? Math.max(...existingImages.map(img => img.imageIndex))
            : -1;
        let nextIndex = maxIndex + 1;

        // Validate and add each file
        for (let i = 0; i < files.length; i++) {
            const file = files[i];

            // Validate file
            if (!file.type.startsWith('image/')) {
                alert(`File ${file.name} không phải là file ảnh`);
                continue;
            }

            if (file.size > 10 * 1024 * 1024) {
                alert(`File ${file.name} có kích thước vượt quá 10MB`);
                continue;
            }

            newImages.push({ questionId: uniqueId, image: file, imageIndex: nextIndex++ });
        }

        if (newImages.length > 0) {
            setQuestionImages([...questionImages, ...newImages]);
        }
    };

    const handleRemoveImage = (questionId: string, imageIndex: number, subQuestionId?: string) => {
        const uniqueId = subQuestionId ? `${questionId}_${subQuestionId}` : questionId;
        setQuestionImages(questionImages.filter(
            img => !(img.questionId === uniqueId && img.imageIndex === imageIndex)
        ));
    };

    const getQuestionImages = (questionId: string, subQuestionId?: string): { questionId: string; image: File; imageIndex: number }[] => {
        const uniqueId = subQuestionId ? `${questionId}_${subQuestionId}` : questionId;
        return questionImages.filter(img => img.questionId === uniqueId)
            .sort((a, b) => a.imageIndex - b.imageIndex);
    };

    const getQuestionImageCount = (questionId: string, subQuestionId?: string): number => {
        const uniqueId = subQuestionId ? `${questionId}_${subQuestionId}` : questionId;
        return questionImages.filter(img => img.questionId === uniqueId).length;
    };

    // Count image_placeholder in content
    const countImagePlaceholders = (content: string): number => {
        const regex = /image_placeholder/gi;
        const matches = content.match(regex);
        return matches ? matches.length : 0;
    };

    // Render content with images replacing placeholders
    const renderContentWithImages = (questionId: string, content: string) => {
        const uploadedImages = getQuestionImages(questionId);
        const placeholders = content.match(/image_placeholder/gi) || [];

        if (placeholders.length === 0) {
            return <RichRenderer content={content} />;
        }

        // Split content by placeholders and insert images
        const parts = content.split(/(image_placeholder)/gi);
        const elements: React.ReactNode[] = [];
        let imageIndex = 0;

        parts.forEach((part, index) => {
            if (part.toLowerCase() === 'image_placeholder') {
                if (imageIndex < uploadedImages.length) {
                    const imgItem = uploadedImages[imageIndex];
                    elements.push(
                        <div key={`img-${index}`} className="my-4 relative group">
                            <img
                                src={URL.createObjectURL(imgItem.image)}
                                alt={`Image ${imageIndex + 1} for question ${questionId}`}
                                className="max-w-full rounded border border-green-300"
                            />
                            <button
                                onClick={() => {
                                    // Parse questionId to handle subquestion format: "questionId_subQuestionId"
                                    const parts = questionId.split('_');
                                    if (parts.length === 2) {
                                        handleRemoveImage(parts[0], imgItem.imageIndex, parts[1]);
                                    } else {
                                        handleRemoveImage(questionId, imgItem.imageIndex);
                                    }
                                }}
                                className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                                title="Xóa ảnh"
                            >
                                ✕
                            </button>
                            <div className="absolute bottom-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                                Ảnh {imageIndex + 1}
                            </div>
                        </div>
                    );
                    imageIndex++;
                } else {
                    // Placeholder without image - show warning
                    elements.push(
                        <span key={`placeholder-${index}`} className="inline-block px-3 py-2 my-2 bg-yellow-100 text-yellow-800 rounded text-sm border-2 border-yellow-300 font-medium">
                            [Cần upload ảnh {imageIndex + 1}]
                        </span>
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

        return <div className="text-xl font-bold text-gray-900 leading-relaxed">{elements}</div>;
    };

    // Replace placeholders with image file names in content for submission
    const replacePlaceholdersWithImageNames = (questionId: string, content: string): string => {
        const uploadedImages = getQuestionImages(questionId);
        const placeholders = content.match(/image_placeholder/gi) || [];

        if (placeholders.length === 0) {
            return content;
        }

        let result = content;
        uploadedImages.forEach((imgItem, index) => {
            // Replace first occurrence of image_placeholder with image markdown syntax
            const imageMarkdown = `![Image ${index + 1}](${imgItem.image.name})`;
            result = result.replace(/image_placeholder/i, imageMarkdown);
        });

        // Replace remaining placeholders with warning
        result = result.replace(/image_placeholder/gi, '[Ảnh chưa được upload]');

        return result;
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
                const uploadedImages = getQuestionImages(q.id);

                // Keep image_placeholder in content - don't replace with markdown
                // The rendering logic in QuestionCard and GroupQuestionSplitView will handle replacing placeholders with actual images
                // This ensures consistency between import and display
                const content = q.content;

                // Use uploaded image names or original images from JSON
                // Priority: uploaded images > images from JSON
                const imageNames = uploadedImages.length > 0
                    ? uploadedImages.map(img => img.image.name)
                    : (q.images || []);

                // Convert correctAnswer to array format
                const correctAnswerArray = Array.isArray(q.correctAnswer)
                    ? q.correctAnswer
                    : q.correctAnswer
                        ? [q.correctAnswer]
                        : [];

                return {
                    id: q.id,
                    section: q.section || 'Tổng hợp',
                    content: content, // Keep original content with image_placeholder intact
                    images: imageNames.length > 0 ? imageNames : undefined, // Use array of image names
                    questionType: q.questionType as QuestionType,
                    options: q.options,
                    correctAnswer: correctAnswerArray,
                    explanation: q.explanation,
                    subQuestions: q.subQuestions?.map(sq => {
                        // Recursive function to handle nested subquestions
                        const processSubQuestion = (subQ: ImportedSubQuestion, parentQuestionId: string, parentSubQuestionId?: string): CreateSubQuestionDto => {
                            // Create unique ID for nested subquestions: questionId_subQuestionId or questionId_subQuestionId_nestedId
                            const uniqueSubQuestionId = parentSubQuestionId
                                ? `${parentSubQuestionId}_${subQ.id}`
                                : subQ.id;

                            // Get uploaded images for this subquestion
                            // For nested subquestions, use the full path: questionId_parentSubQuestionId_nestedId
                            const imagePath = parentSubQuestionId
                                ? `${parentQuestionId}_${parentSubQuestionId}_${subQ.id}`
                                : `${parentQuestionId}_${subQ.id}`;
                            const subQuestionUploadedImages = getQuestionImages(parentQuestionId, uniqueSubQuestionId);

                            // Convert subquestion correctAnswer to array format
                            const subCorrectAnswerArray = Array.isArray(subQ.correctAnswer)
                                ? subQ.correctAnswer
                                : subQ.correctAnswer
                                    ? [subQ.correctAnswer]
                                    : [];

                            // Use uploaded image names or original images from JSON
                            const subQuestionImageNames = subQuestionUploadedImages.length > 0
                                ? subQuestionUploadedImages.map(img => img.image.name)
                                : (subQ.images || []);

                            return {
                                id: subQ.id,
                                content: subQ.content,
                                images: subQuestionImageNames.length > 0 ? subQuestionImageNames : undefined,
                                correctAnswer: subCorrectAnswerArray,
                                explanation: subQ.explanation,
                                questionType: (subQ.question_type || subQ.questionType) as QuestionType,
                                options: subQ.options,
                                // Recursively process nested subquestions
                                subQuestions: subQ.subQuestions?.map(nestedSubQ =>
                                    processSubQuestion(nestedSubQ, parentQuestionId, uniqueSubQuestionId)
                                )
                            };
                        };

                        return processSubQuestion(sq, q.id);
                    })
                };
            });

            const examSetData: CreateExamSetDto = {
                ...formData,
                questions
            };

            // Use upload mutation if there are images, otherwise use create mutation
            if (questionImages.length > 0) {
                // Group images by questionId and sort by imageIndex to maintain order
                const questionImagesMap = new Map<string, { image: File; imageIndex: number }[]>();
                questionImages.forEach(item => {
                    if (!questionImagesMap.has(item.questionId)) {
                        questionImagesMap.set(item.questionId, []);
                    }
                    questionImagesMap.get(item.questionId)!.push({ image: item.image, imageIndex: item.imageIndex });
                });

                // Convert to array format: { questionId: string; images: File[] }[]
                // Sort by imageIndex to maintain upload order
                const questionImagesArray = Array.from(questionImagesMap.entries()).map(([questionId, imageItems]) => ({
                    questionId,
                    images: imageItems
                        .sort((a, b) => a.imageIndex - b.imageIndex)
                        .map(item => item.image)
                }));

                await uploadExamSetMutation.mutateAsync({
                    data: examSetData,
                    questionImages: questionImagesArray
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
            deadline: undefined,
            password: ''
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
            case SUBJECT_ID.SCIENCE: return 'Khoa học tự nhiên';
            default: return 'Môn học';
        }
    };

    // Recursive function to render nested subquestions
    const renderSubQuestion = (subQ: ImportedSubQuestion, questionId: string, parentSubQuestionId?: string, depth: number = 0): React.ReactNode => {
        const subQuestionType = subQ.question_type || subQ.questionType || 'true_false';
        const isSubQuestionImage = isImageAnswer(subQ.content);

        // Create unique ID for nested subquestions
        const uniqueSubQuestionId = parentSubQuestionId
            ? `${parentSubQuestionId}_${subQ.id}`
            : subQ.id;

        const subQuestionUploadedImages = getQuestionImages(questionId, uniqueSubQuestionId);
        const subQuestionPlaceholderCount = countImagePlaceholders(subQ.content);
        const indentClass = depth > 0 ? `ml-${depth * 4}` : '';

        return (
            <div key={subQ.id} className={`border border-gray-200 rounded-lg p-4 bg-gray-50 ${indentClass}`}>
                {/* SubQuestion Header with Upload Button */}
                <div className="mb-4">
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-2">
                            {depth > 0 && (
                                <span className="text-xs text-gray-400">└─</span>
                            )}
                            <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                                {subQuestionType}
                            </span>
                            {subQuestionType === 'group_question' && (
                                <span className="px-2 py-1 bg-blue-100 text-blue-600 rounded text-xs">
                                    Nested Group ({subQ.subQuestions?.length || 0} subquestions)
                                </span>
                            )}
                        </div>
                        <div className="flex items-center space-x-2">
                            {subQuestionPlaceholderCount > 0 && (
                                <span className="text-xs text-blue-600 font-medium">
                                    📍 {subQuestionPlaceholderCount} placeholder
                                </span>
                            )}
                            {getQuestionImageCount(questionId, uniqueSubQuestionId) > 0 && (
                                <span className={`text-xs font-medium ${getQuestionImageCount(questionId, uniqueSubQuestionId) >= subQuestionPlaceholderCount
                                    ? 'text-green-600'
                                    : 'text-orange-600'
                                    }`}>
                                    ✓ {getQuestionImageCount(questionId, uniqueSubQuestionId)}/{subQuestionPlaceholderCount} ảnh
                                </span>
                            )}
                            <input
                                type="file"
                                id={`sub-image-upload-${questionId}-${uniqueSubQuestionId}`}
                                accept="image/*"
                                multiple
                                onChange={(e) => {
                                    handleImageUpload(questionId, e.target.files, uniqueSubQuestionId);
                                    e.target.value = '';
                                }}
                                className="hidden"
                            />
                            <label
                                htmlFor={`sub-image-upload-${questionId}-${uniqueSubQuestionId}`}
                                className="px-3 py-1 rounded text-xs font-medium transition-colors bg-purple-100 text-purple-700 cursor-pointer hover:bg-purple-200"
                            >
                                📷 Upload ảnh {getQuestionImageCount(questionId, uniqueSubQuestionId) > 0 ? `(${getQuestionImageCount(questionId, uniqueSubQuestionId)})` : ''}
                            </label>
                        </div>
                    </div>
                </div>

                {/* SubQuestion Content */}
                <div className="mb-4">
                    {isSubQuestionImage ? (
                        <div className="mb-4">
                            <img src={subQ.content} alt={`Câu hỏi ${subQ.id}`} className="max-w-full rounded" />
                        </div>
                    ) : subQuestionPlaceholderCount > 0 ? (
                        <div className="mb-4">
                            {renderContentWithImages(`${questionId}_${uniqueSubQuestionId}`, subQ.content)}
                        </div>
                    ) : (
                        <h5 className="font-medium text-gray-900 mb-2">
                            <RichRenderer content={subQ.content} />
                        </h5>
                    )}

                    {/* Show warning if placeholders exist but not enough images */}
                    {subQuestionPlaceholderCount > 0 && getQuestionImageCount(questionId, uniqueSubQuestionId) < subQuestionPlaceholderCount && (
                        <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                            <p className="text-sm text-yellow-800 font-medium">
                                ⚠️ Cần upload thêm {subQuestionPlaceholderCount - getQuestionImageCount(questionId, uniqueSubQuestionId)} ảnh để thay thế các placeholder
                            </p>
                        </div>
                    )}
                </div>

                {/* Multiple choice and single choice subquestion */}
                {(subQuestionType === 'multiple_choice' || subQuestionType === 'single_choice') && subQ.options && (
                    <div className="space-y-3">
                        {Object.entries(subQ.options).map(([option, text]) => {
                            const isImage = isImageAnswer(text);
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
                                        name={`sub-question-${questionId}-${uniqueSubQuestionId}`}
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
                                    name={`sub-question-${questionId}-${uniqueSubQuestionId}`}
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
                                    name={`sub-question-${questionId}-${uniqueSubQuestionId}`}
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

                {/* Drag Drop Cloze subquestion */}
                {subQuestionType === 'drag_drop_cloze' && (
                    <div className="space-y-4 pointer-events-none opacity-90">
                        <DragDropCloze
                            content={subQ.content}
                            options={subQ.options || {}}
                            selectedAnswer={(Array.isArray(subQ.correctAnswer) ? subQ.correctAnswer : [subQ.correctAnswer]).filter((a): a is string => Boolean(a))}
                            onAnswerSelect={() => { }}
                            isImageAnswer={isImageAnswer}
                        />
                    </div>
                )}

                {/* Nested subquestions (recursive) */}
                {subQuestionType === 'group_question' && subQ.subQuestions && subQ.subQuestions.length > 0 && (
                    <div className="mt-4 space-y-4 border-t border-gray-300 pt-4">
                        <div className="text-xs font-semibold text-gray-600 mb-2">Nested Subquestions:</div>
                        {subQ.subQuestions.map(nestedSubQ =>
                            renderSubQuestion(nestedSubQ, questionId, uniqueSubQuestionId, depth + 1)
                        )}
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
                                                <option value={SUBJECT_ID.SCIENCE}>Khoa học tự nhiên</option>
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

                                        <div>
                                            <label className="block text-xs font-medium text-gray-700 mb-1">
                                                Mật khẩu đề thi (tùy chọn)
                                            </label>
                                            <input
                                                type="text"
                                                value={formData.password}
                                                onChange={(e) => handleInputChange('password', e.target.value)}
                                                className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                                                placeholder="Mật khẩu"
                                            />
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
                                        📷 {questionImages.length} ảnh đã upload
                                        {(() => {
                                            const uniqueQuestions = new Set(questionImages.map(img => img.questionId));
                                            return uniqueQuestions.size > 0 ? ` (${uniqueQuestions.size} câu hỏi)` : '';
                                        })()}
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
                                                    <div className="flex items-center space-x-2 flex-wrap gap-2">
                                                        {(() => {
                                                            const placeholderCount = countImagePlaceholders(question.content);
                                                            const uploadedCount = getQuestionImageCount(question.id);
                                                            return (
                                                                <>
                                                                    {placeholderCount > 0 && (
                                                                        <span className="text-xs text-blue-600 font-medium">
                                                                            📍 {placeholderCount} placeholder
                                                                        </span>
                                                                    )}
                                                                    {uploadedCount > 0 && (
                                                                        <span className={`text-xs font-medium ${uploadedCount >= placeholderCount
                                                                            ? 'text-green-600'
                                                                            : 'text-orange-600'
                                                                            }`}>
                                                                            ✓ {uploadedCount}/{placeholderCount} ảnh
                                                                        </span>
                                                                    )}
                                                                </>
                                                            );
                                                        })()}
                                                        <input
                                                            type="file"
                                                            id={`image-upload-${question.id}`}
                                                            accept="image/*"
                                                            multiple
                                                            onChange={(e) => {
                                                                handleImageUpload(question.id, e.target.files);
                                                                // Reset input to allow selecting same files again
                                                                e.target.value = '';
                                                            }}
                                                            className="hidden"
                                                        />
                                                        <label
                                                            htmlFor={`image-upload-${question.id}`}
                                                            className="px-3 py-1 rounded text-xs font-medium transition-colors bg-purple-100 text-purple-700 cursor-pointer hover:bg-purple-200"
                                                        >
                                                            📷 Upload ảnh {getQuestionImageCount(question.id) > 0 ? `(${getQuestionImageCount(question.id)})` : ''}
                                                        </label>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Question Content */}
                                            <div className="mb-4">
                                                {isImageAnswer(question.content) ? (
                                                    <div className="mb-6">
                                                        <img src={question.content} alt={`Câu ${index + 1}`} className="max-w-full rounded" />
                                                    </div>
                                                ) : countImagePlaceholders(question.content) > 0 ? (
                                                    // Render content with images replacing placeholders
                                                    <div className="mb-6">
                                                        {renderContentWithImages(question.id, question.content)}
                                                    </div>
                                                ) : (
                                                    <div className="text-xl text-gray-900 leading-relaxed mb-6">
                                                        <RichRenderer content={question.content} />
                                                    </div>
                                                )}

                                                {/* Show warning if placeholders exist but not enough images */}
                                                {(() => {
                                                    const placeholderCount = countImagePlaceholders(question.content);
                                                    const uploadedCount = getQuestionImageCount(question.id);
                                                    if (placeholderCount > 0 && uploadedCount < placeholderCount) {
                                                        return (
                                                            <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                                                                <p className="text-sm text-yellow-800 font-medium">
                                                                    ⚠️ Cần upload thêm {placeholderCount - uploadedCount} ảnh để thay thế các placeholder
                                                                </p>
                                                            </div>
                                                        );
                                                    }
                                                    return null;
                                                })()}
                                            </div>

                                            {/* Question Images from JSON */}
                                            {question.images && question.images.length > 0 && (
                                                <div className="mb-4 space-y-2">
                                                    {question.images.map((imgUrl, imgIdx) => (
                                                        <div key={imgIdx} className="mb-2">
                                                            <img
                                                                src={imgUrl}
                                                                alt={`Hình ảnh ${imgIdx + 1} câu ${index + 1}`}
                                                                className="w-full h-auto rounded-lg border border-gray-200"
                                                            />
                                                        </div>
                                                    ))}
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

                                            {/* Drag Drop Cloze */}
                                            {question.questionType === 'drag_drop_cloze' && (
                                                <div className="space-y-4 pointer-events-none opacity-90">
                                                    <DragDropCloze
                                                        content={question.content}
                                                        options={question.options || {}}
                                                        selectedAnswer={(Array.isArray(question.correctAnswer) ? question.correctAnswer : [question.correctAnswer]).filter((a): a is string => Boolean(a))}
                                                        onAnswerSelect={() => { }}
                                                        isImageAnswer={isImageAnswer}
                                                    />
                                                </div>
                                            )}

                                            {/* Group Questions */}
                                            {question.questionType === 'group_question' && question.subQuestions && (
                                                <div className="space-y-4 mt-4">
                                                    {question.subQuestions.map((subQ) =>
                                                        renderSubQuestion(subQ, question.id)
                                                    )}
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

