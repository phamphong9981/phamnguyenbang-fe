'use client';

import { useState } from 'react';

interface ImageAnswerProps {
    src: string;
    alt: string;
    className?: string;
    onClick?: () => void;
    isSelected?: boolean;
}

export default function ImageAnswer({
    src,
    alt,
    className = '',
    onClick,
    isSelected = false
}: ImageAnswerProps) {
    const [imageError, setImageError] = useState(false);
    const [imageLoading, setImageLoading] = useState(true);

    const handleImageError = () => {
        setImageError(true);
        setImageLoading(false);
    };

    const handleImageLoad = () => {
        setImageLoading(false);
    };

    if (imageError) {
        return (
            <div className={`flex items-center justify-center p-4 border-2 border-gray-200 rounded-lg bg-gray-50 ${className}`}>
                <div className="text-center">
                    <div className="text-4xl mb-2">🖼️</div>
                    <p className="text-sm text-gray-500">Không thể tải hình ảnh</p>
                </div>
            </div>
        );
    }

    return (
        <div
            className={`relative cursor-pointer transition-all duration-200 ${isSelected ? 'ring-2 ring-green-500 ring-offset-2' : ''} ${className}`}
            onClick={onClick}
        >
            {imageLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                </div>
            )}
            <img
                src={src}
                alt={alt}
                className={`rounded-lg border-2 transition-colors ${isSelected
                    ? 'border-green-500 shadow-lg'
                    : 'border-gray-200 hover:border-gray-300'
                    }`}
                onError={handleImageError}
                onLoad={handleImageLoad}
                style={{
                    display: imageLoading ? 'none' : 'block',
                    maxWidth: '100%',
                    height: 'auto'
                }}
            />
            {isSelected && (
                <div className="absolute top-2 right-2 bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                    ✓
                </div>
            )}
        </div>
    );
}
