'use client';

import RichRenderer from './RichRenderer';

interface ContentWithImagesProps {
    content: string;
    images?: string[];
    className?: string;
}

/**
 * Component to render content with image_placeholder replaced by actual images
 * @param content - The content string that may contain "image_placeholder" markers
 * @param images - Array of image URLs to replace placeholders with
 * @param className - Optional className for styling
 */
export default function ContentWithImages({ content, images = [], className = '' }: ContentWithImagesProps) {
    // If no images or no placeholders, just render content
    if (!images || images.length === 0 || !content.includes('image_placeholder')) {
        return (
            <div className={className}>
                <RichRenderer content={content} />
            </div>
        );
    }

    // Split content by image_placeholder and interleave with images
    const parts = content.split('image_placeholder');
    
    return (
        <div className={className}>
            {parts.map((part, index) => (
                <div key={index}>
                    {part && <RichRenderer content={part} />}
                    {index < parts.length - 1 && images[index] && (
                        <div className="my-4">
                            <img
                                src={images[index]}
                                alt={`Hình ảnh ${index + 1}`}
                                className="max-w-full h-auto rounded-lg border border-gray-200"
                            />
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}

