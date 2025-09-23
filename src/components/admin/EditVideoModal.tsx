'use client';

import { useState, useEffect } from 'react';
import { useUpdateVideo } from '@/hooks/useAdminCourse';

interface EditVideoModalProps {
    isOpen: boolean;
    video: any;
    onClose: () => void;
    onSuccess: () => void;
}

export default function EditVideoModal({ isOpen, video, onClose, onSuccess }: EditVideoModalProps) {
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

    const updateMutation = useUpdateVideo();

    useEffect(() => {
        if (video) {
            setFormData({
                title: video.title,
                description: video.description || '',
                s3Video: video.s3Video,
                s3Thumbnail: video.s3Thumbnail,
                videoType: video.videoType,
                duration: video.duration || 0,
                sortOrder: video.sortOrder,
                isFree: video.isFree
            });
        }
    }, [video]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!video || !formData.title.trim() || !formData.s3Video.trim() || !formData.s3Thumbnail.trim()) {
            return;
        }

        try {
            await updateMutation.mutateAsync({
                id: video.id,
                ...formData
            });
            onSuccess();
        } catch (error) {
            console.error('Error updating video:', error);
        }
    };

    const handleClose = () => {
        onClose();
    };

    if (!isOpen || !video) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-hidden">
                <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-6 text-white">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-white bg-opacity-30 rounded-xl flex items-center justify-center">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="text-xl font-bold">Chỉnh sửa video</h3>
                                <p className="text-orange-100 text-sm">Cập nhật thông tin video</p>
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

                    {updateMutation.isError && (
                        <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-3">
                            <div className="flex items-center">
                                <div className="text-red-400 mr-2">⚠️</div>
                                <p className="text-red-700 text-sm">
                                    Có lỗi xảy ra khi cập nhật video. Vui lòng thử lại.
                                </p>
                            </div>
                        </div>
                    )}

                    <div className="flex justify-end space-x-3 mt-6">
                        <button
                            type="button"
                            onClick={handleClose}
                            disabled={updateMutation.isPending}
                            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors font-medium disabled:opacity-50"
                        >
                            Hủy
                        </button>
                        <button
                            type="submit"
                            disabled={updateMutation.isPending || !formData.title.trim() || !formData.s3Video.trim() || !formData.s3Thumbnail.trim()}
                            className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {updateMutation.isPending ? (
                                <div className="flex items-center">
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                    Đang cập nhật...
                                </div>
                            ) : (
                                'Cập nhật video'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

