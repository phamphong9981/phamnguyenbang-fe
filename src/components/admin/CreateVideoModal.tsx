'use client';

import { useState } from 'react';
import { useCreateVideo } from '@/hooks/useAdminCourse';

interface CreateVideoModalProps {
    isOpen: boolean;
    chapterId: string;
    onClose: () => void;
    onSuccess: () => void;
}

export default function CreateVideoModal({ isOpen, chapterId, onClose, onSuccess }: CreateVideoModalProps) {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        s3Video: '',
        s3Thumbnail: '',
        videoType: 'theory' as 'theory' | 'exercise',
        duration: 0,
        sortOrder: 1,
        isFree: true
    });

    const createMutation = useCreateVideo();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.title.trim() || !formData.s3Video.trim() || !formData.s3Thumbnail.trim()) {
            return;
        }

        try {
            await createMutation.mutateAsync({
                chapterId,
                ...formData
            });
            onSuccess();
            setFormData({
                title: '',
                description: '',
                s3Video: '',
                s3Thumbnail: '',
                videoType: 'theory',
                duration: 0,
                sortOrder: 1,
                isFree: true
            });
        } catch (error) {
            console.error('Error creating video:', error);
        }
    };

    const handleClose = () => {
        setFormData({
            title: '',
            description: '',
            s3Video: '',
            s3Thumbnail: '',
            videoType: 'theory',
            duration: 0,
            sortOrder: 1,
            isFree: true
        });
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-hidden">
                <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-6 text-black">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-white bg-opacity-30 rounded-xl flex items-center justify-center">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="text-xl font-bold">Thêm video mới</h3>
                                <p className="text-orange-100 text-sm">Tạo video mới trong chương học</p>
                            </div>
                        </div>
                        <button
                            onClick={handleClose}
                            className="w-8 h-8 bg-white bg-opacity-30 rounded-lg flex items-center justify-center hover:bg-opacity-40 transition-colors"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="p-6 max-h-[70vh] overflow-y-auto">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Tiêu đề video *
                            </label>
                            <input
                                type="text"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                placeholder="Ví dụ: Giới thiệu về hàm số"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Mô tả
                            </label>
                            <textarea
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                placeholder="Mô tả ngắn về video"
                                rows={3}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Loại video *
                                </label>
                                <select
                                    value={formData.videoType}
                                    onChange={(e) => setFormData({ ...formData, videoType: e.target.value as 'theory' | 'exercise' })}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                >
                                    <option value="theory">Lý thuyết</option>
                                    <option value="exercise">Bài tập</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Thứ tự sắp xếp
                                </label>
                                <input
                                    type="number"
                                    value={formData.sortOrder}
                                    onChange={(e) => setFormData({ ...formData, sortOrder: parseInt(e.target.value) || 1 })}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                    min="1"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                URL Video S3 *
                            </label>
                            <input
                                type="url"
                                value={formData.s3Video}
                                onChange={(e) => setFormData({ ...formData, s3Video: e.target.value })}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                placeholder="https://s3.amazonaws.com/bucket/video.mp4"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                URL Thumbnail S3 *
                            </label>
                            <input
                                type="url"
                                value={formData.s3Thumbnail}
                                onChange={(e) => setFormData({ ...formData, s3Thumbnail: e.target.value })}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                placeholder="https://s3.amazonaws.com/bucket/thumbnail.jpg"
                                required
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Thời lượng (giây)
                                </label>
                                <input
                                    type="number"
                                    value={formData.duration}
                                    onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) || 0 })}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                    min="0"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Trạng thái
                                </label>
                                <select
                                    value={formData.isFree ? 'free' : 'premium'}
                                    onChange={(e) => setFormData({ ...formData, isFree: e.target.value === 'free' })}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                >
                                    <option value="free">Miễn phí</option>
                                    <option value="premium">Premium</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {createMutation.isError && (
                        <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-3">
                            <div className="flex items-center">
                                <div className="text-red-400 mr-2">⚠️</div>
                                <p className="text-red-700 text-sm">
                                    Có lỗi xảy ra khi tạo video. Vui lòng thử lại.
                                </p>
                            </div>
                        </div>
                    )}

                    <div className="flex justify-end space-x-3 mt-6">
                        <button
                            type="button"
                            onClick={handleClose}
                            disabled={createMutation.isPending}
                            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors font-medium disabled:opacity-50"
                        >
                            Hủy
                        </button>
                        <button
                            type="submit"
                            disabled={createMutation.isPending || !formData.title.trim() || !formData.s3Video.trim() || !formData.s3Thumbnail.trim()}
                            className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {createMutation.isPending ? (
                                <div className="flex items-center">
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                    Đang tạo...
                                </div>
                            ) : (
                                'Tạo video'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

