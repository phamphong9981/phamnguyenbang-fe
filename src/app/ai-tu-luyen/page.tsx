'use client';

import Header from '@/components/Header';
import { useUserKcProgress, UserKCProgress } from '@/hooks/useAiSelftPracice';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

// Knowledge Component Categories với icons và màu sắc
const kcCategories = {
    algebra: { name: 'Đại số', icon: '🔢', color: 'from-blue-500 to-blue-600', bgColor: 'bg-blue-50', borderColor: 'border-blue-200' },
    geometry: { name: 'Hình học', icon: '📐', color: 'from-purple-500 to-purple-600', bgColor: 'bg-purple-50', borderColor: 'border-purple-200' },
    trigonometry: { name: 'Lượng giác', icon: '📊', color: 'from-green-500 to-green-600', bgColor: 'bg-green-50', borderColor: 'border-green-200' },
    calculus: { name: 'Giải tích', icon: '∫', color: 'from-red-500 to-red-600', bgColor: 'bg-red-50', borderColor: 'border-red-200' },
    statistics: { name: 'Xác suất', icon: '📈', color: 'from-yellow-500 to-yellow-600', bgColor: 'bg-yellow-50', borderColor: 'border-yellow-200' },
    default: { name: 'Khác', icon: '📚', color: 'from-gray-500 to-gray-600', bgColor: 'bg-gray-50', borderColor: 'border-gray-200' }
};

// Hàm lấy category từ tag
const getCategoryFromTag = (tag: string): keyof typeof kcCategories => {
    const lowerTag = tag.toLowerCase();
    if (lowerTag.includes('algebra') || lowerTag.includes('đại số')) return 'algebra';
    if (lowerTag.includes('geometry') || lowerTag.includes('hình học')) return 'geometry';
    if (lowerTag.includes('trigonometry') || lowerTag.includes('lượng giác')) return 'trigonometry';
    if (lowerTag.includes('calculus') || lowerTag.includes('giải tích')) return 'calculus';
    if (lowerTag.includes('statistics') || lowerTag.includes('xác suất') || lowerTag.includes('probability')) return 'statistics';
    return 'default';
};

// Component hiển thị progress bar
const MasteryProgressBar = ({ level }: { level: number }) => {
    const percentage = Math.min(Math.max(level * 100, 0), 100);
    let colorClass = 'bg-red-500';
    let textColor = 'text-red-600';
    let bgColor = 'bg-red-100';

    if (percentage >= 80) {
        colorClass = 'bg-green-500';
        textColor = 'text-green-600';
        bgColor = 'bg-green-100';
    } else if (percentage >= 60) {
        colorClass = 'bg-blue-500';
        textColor = 'text-blue-600';
        bgColor = 'bg-blue-100';
    } else if (percentage >= 40) {
        colorClass = 'bg-yellow-500';
        textColor = 'text-yellow-600';
        bgColor = 'bg-yellow-100';
    } else if (percentage >= 20) {
        colorClass = 'bg-orange-500';
        textColor = 'text-orange-600';
        bgColor = 'bg-orange-100';
    }

    return (
        <div className="space-y-2">
            <div className="flex items-center justify-between">
                <span className={`text-sm font-semibold ${textColor}`}>
                    Độ thành thạo
                </span>
                <span className={`text-sm font-bold ${textColor}`}>
                    {percentage.toFixed(0)}%
                </span>
            </div>
            <div className={`w-full h-3 ${bgColor} rounded-full overflow-hidden shadow-inner`}>
                <div
                    className={`h-full ${colorClass} rounded-full transition-all duration-1000 ease-out shadow-sm`}
                    style={{ width: `${percentage}%` }}
                >
                    <div className="w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
                </div>
            </div>
        </div>
    );
};

// Component hiển thị KC card
const KCCard = ({ kc, onSelect }: { kc: UserKCProgress; onSelect: () => void }) => {
    const category = getCategoryFromTag(kc.kc_tag);
    const categoryInfo = kcCategories[category];
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className={`group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border-2 ${categoryInfo.borderColor} overflow-hidden cursor-pointer`}
            onClick={onSelect}
        >
            {/* Background decoration */}
            <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${categoryInfo.color} opacity-10 rounded-full -mr-16 -mt-16 transition-all duration-500 ${isHovered ? 'scale-150' : 'scale-100'}`}></div>

            {/* Header with icon */}
            <div className={`${categoryInfo.bgColor} px-6 py-5 border-b-2 ${categoryInfo.borderColor}`}>
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3 flex-1 min-w-0">
                        <div className={`text-4xl transform transition-transform duration-500 flex-shrink-0 ${isHovered ? 'scale-110 rotate-12' : 'scale-100'}`}>
                            {categoryInfo.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                                {categoryInfo.name}
                            </div>
                            <h3 className="text-lg font-bold text-gray-800 truncate mb-1">
                                {kc.kcNode?.name_vi || kc.kc_tag}
                            </h3>
                            {kc.kcNode?.desc_vi && (
                                <p className="text-sm text-gray-600 truncate leading-relaxed">
                                    {kc.kcNode.desc_vi}
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="px-6 py-5 space-y-4">
                <MasteryProgressBar level={kc.mastery_level} />

                {/* Stats */}
                <div className="grid grid-cols-2 gap-3 pt-2">
                    <div className={`${categoryInfo.bgColor} rounded-lg p-3 text-center border ${categoryInfo.borderColor}`}>
                        <div className="text-2xl font-bold text-gray-800">
                            {kc.progress_id}
                        </div>
                        <div className="text-xs text-gray-600 mt-1">Progress ID</div>
                    </div>
                    <div className={`${categoryInfo.bgColor} rounded-lg p-3 text-center border ${categoryInfo.borderColor}`}>
                        <div className="text-xs text-gray-600 mb-1">Cập nhật</div>
                        <div className="text-sm font-semibold text-gray-800">
                            {new Date(kc.last_updated).toLocaleDateString('vi-VN')}
                        </div>
                    </div>
                </div>

                {/* Action button */}
                <button className={`w-full bg-gradient-to-r ${categoryInfo.color} text-white py-3 rounded-lg font-semibold transition-all duration-300 transform ${isHovered ? 'scale-105' : 'scale-100'} hover:shadow-lg flex items-center justify-center space-x-2 group-hover:animate-pulse`}>
                    <span>🎯</span>
                    <span>Luyện tập ngay</span>
                    <span className="transition-transform duration-300 transform group-hover:translate-x-1">→</span>
                </button>
            </div>

            {/* Shine effect */}
            <div className={`absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 ${isHovered ? 'animate-shine' : ''}`}></div>
        </div>
    );
};

export default function AiSelfPracticePage() {
    const { data: kcProgress, isLoading, error } = useUserKcProgress();
    const [selectedKC, setSelectedKC] = useState<string | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<keyof typeof kcCategories | 'all'>('all');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;
    const router = useRouter();

    // Filter data by category
    const filteredKcProgress = kcProgress?.filter(kc => {
        if (selectedCategory === 'all') return true;
        return getCategoryFromTag(kc.kc_tag) === selectedCategory;
    }) || [];

    // Calculate pagination
    const totalPages = Math.ceil(filteredKcProgress.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedKcProgress = filteredKcProgress.slice(startIndex, endIndex);

    // Reset to page 1 when category changes
    const handleCategoryChange = (category: keyof typeof kcCategories | 'all') => {
        setSelectedCategory(category);
        setCurrentPage(1);
    };

    // Count items per category
    const getCategoryCount = (category: keyof typeof kcCategories | 'all') => {
        if (category === 'all') return kcProgress?.length || 0;
        return kcProgress?.filter(kc => getCategoryFromTag(kc.kc_tag) === category).length || 0;
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
            <Header />

            {/* Hero Section */}
            <section className="relative bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 py-20 overflow-hidden">
                {/* Animated background elements */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute w-96 h-96 bg-white/10 rounded-full -top-48 -left-48 animate-pulse"></div>
                    <div className="absolute w-96 h-96 bg-white/10 rounded-full -bottom-48 -right-48 animate-pulse delay-1000"></div>
                </div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="inline-block mb-4 animate-bounce">
                        <span className="text-7xl">🤖</span>
                    </div>
                    <h1 className="text-5xl sm:text-6xl font-bold text-white mb-6 animate-fade-in">
                        AI Tự Luyện
                    </h1>
                    <p className="text-xl text-white/90 max-w-3xl mx-auto leading-relaxed">
                        Khám phá các chủ đề học tập của bạn và luyện tập với AI.
                        Hệ thống sẽ theo dõi tiến độ và đề xuất các bài tập phù hợp với trình độ của bạn.
                    </p>

                    {/* Stats */}
                    <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
                        <div className="bg-white/20 backdrop-blur-lg rounded-2xl p-6 transform hover:scale-105 transition-transform duration-300">
                            <div className="text-4xl font-bold text-white">
                                {kcProgress?.length || 0}
                            </div>
                            <div className="text-white/90 mt-2">Chủ đề học tập</div>
                        </div>
                        <div className="bg-white/20 backdrop-blur-lg rounded-2xl p-6 transform hover:scale-105 transition-transform duration-300">
                            <div className="text-4xl font-bold text-white">
                                {kcProgress ? Math.round(kcProgress.reduce((acc, kc) => acc + kc.mastery_level, 0) / kcProgress.length * 100) : 0}%
                            </div>
                            <div className="text-white/90 mt-2">Độ thành thạo TB</div>
                        </div>
                        <div className="bg-white/20 backdrop-blur-lg rounded-2xl p-6 transform hover:scale-105 transition-transform duration-300">
                            <div className="text-4xl font-bold text-white">🎯</div>
                            <div className="text-white/90 mt-2">Luyện với AI</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Main Content */}
            <section className="py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Loading State */}
                    {isLoading && (
                        <div className="flex flex-col items-center justify-center py-20">
                            <div className="relative w-24 h-24">
                                <div className="absolute inset-0 border-4 border-blue-200 rounded-full"></div>
                                <div className="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
                            </div>
                            <p className="mt-6 text-gray-600 text-lg font-medium">Đang tải dữ liệu học tập...</p>
                        </div>
                    )}

                    {/* Error State */}
                    {error && (
                        <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-8 text-center">
                            <div className="text-6xl mb-4">⚠️</div>
                            <h3 className="text-2xl font-bold text-red-800 mb-2">Có lỗi xảy ra</h3>
                            <p className="text-red-600">{error.message}</p>
                        </div>
                    )}

                    {/* KC List */}
                    {!isLoading && !error && kcProgress && (
                        <div>
                            <div className="text-center mb-12">
                                <h2 className="text-4xl font-bold text-gray-900 mb-4">
                                    Các chủ đề của bạn
                                </h2>
                                <p className="text-gray-600 text-lg">
                                    Chọn một chủ đề để bắt đầu luyện tập với AI
                                </p>
                                <div className="w-24 h-1 bg-gradient-to-r from-green-500 via-blue-500 to-purple-500 mx-auto rounded-full mt-4"></div>
                            </div>

                            {/* Category Filter Tabs */}
                            {kcProgress.length > 0 && (
                                <div className="mb-8">
                                    <div className="bg-white rounded-2xl shadow-lg p-2 border-2 border-purple-200">
                                        <div className="flex flex-wrap gap-2">
                                            {/* All Categories */}
                                            <button
                                                onClick={() => handleCategoryChange('all')}
                                                className={`flex-1 min-w-[150px] px-6 py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 ${selectedCategory === 'all'
                                                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                    }`}
                                            >
                                                <div className="flex items-center justify-center space-x-2">
                                                    <span className="text-2xl">📚</span>
                                                    <div className="text-left">
                                                        <div className="font-bold">Tất cả</div>
                                                        <div className="text-sm opacity-80">{getCategoryCount('all')} chủ đề</div>
                                                    </div>
                                                </div>
                                            </button>

                                            {/* Individual Categories */}
                                            {(Object.keys(kcCategories) as Array<keyof typeof kcCategories>)
                                                .filter(key => key !== 'default' && getCategoryCount(key) > 0)
                                                .map((categoryKey) => {
                                                    const category = kcCategories[categoryKey];
                                                    const count = getCategoryCount(categoryKey);
                                                    return (
                                                        <button
                                                            key={categoryKey}
                                                            onClick={() => handleCategoryChange(categoryKey)}
                                                            className={`flex-1 min-w-[150px] px-6 py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 ${selectedCategory === categoryKey
                                                                ? `bg-gradient-to-r ${category.color} text-white shadow-lg`
                                                                : `${category.bgColor} text-gray-700 hover:shadow-md border-2 ${category.borderColor}`
                                                                }`}
                                                        >
                                                            <div className="flex items-center justify-center space-x-2">
                                                                <span className="text-2xl">{category.icon}</span>
                                                                <div className="text-left">
                                                                    <div className="font-bold">{category.name}</div>
                                                                    <div className="text-sm opacity-80">{count} chủ đề</div>
                                                                </div>
                                                            </div>
                                                        </button>
                                                    );
                                                })}
                                        </div>
                                    </div>

                                    {/* Filter Info */}
                                    <div className="mt-4 text-center">
                                        <p className="text-gray-600">
                                            Hiển thị <span className="font-bold text-blue-600">{paginatedKcProgress.length}</span> trong tổng số <span className="font-bold text-blue-600">{filteredKcProgress.length}</span> chủ đề
                                            {selectedCategory !== 'all' && (
                                                <span className="ml-2 text-purple-600 font-semibold">
                                                    ({kcCategories[selectedCategory as keyof typeof kcCategories].name})
                                                </span>
                                            )}
                                        </p>
                                    </div>
                                </div>
                            )}

                            {kcProgress.length === 0 ? (
                                <div className="bg-white rounded-2xl shadow-lg p-12 text-center border-2 border-gray-200">
                                    <div className="text-6xl mb-6">📚</div>
                                    <h3 className="text-2xl font-bold text-gray-800 mb-3">
                                        Chưa có dữ liệu học tập
                                    </h3>
                                    <p className="text-gray-600 text-lg">
                                        Bạn chưa có chủ đề nào để luyện tập. Hãy bắt đầu học và hoàn thành các bài kiểm tra!
                                    </p>
                                </div>
                            ) : filteredKcProgress.length === 0 ? (
                                <div className="bg-white rounded-2xl shadow-lg p-12 text-center border-2 border-gray-200">
                                    <div className="text-6xl mb-6">🔍</div>
                                    <h3 className="text-2xl font-bold text-gray-800 mb-3">
                                        Không tìm thấy chủ đề
                                    </h3>
                                    <p className="text-gray-600 text-lg mb-6">
                                        Không có chủ đề nào trong danh mục này.
                                    </p>
                                    <button
                                        onClick={() => handleCategoryChange('all')}
                                        className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all"
                                    >
                                        Xem tất cả chủ đề
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                                        {paginatedKcProgress.map((kc) => (
                                            <KCCard
                                                key={kc.progress_id}
                                                kc={kc}
                                                onSelect={() => {
                                                    setSelectedKC(kc.kc_tag);
                                                    router.push(`/ai-tu-luyen/practice?kc=${encodeURIComponent(kc.kc_tag)}`);
                                                }}
                                            />
                                        ))}
                                    </div>

                                    {/* Pagination */}
                                    {totalPages > 1 && (
                                        <div className="flex flex-col items-center space-y-4">
                                            <div className="flex items-center space-x-2">
                                                {/* Previous Button */}
                                                <button
                                                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                                    disabled={currentPage === 1}
                                                    className="px-4 py-2 rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed bg-white text-gray-700 hover:bg-gray-100 border-2 border-gray-300 hover:border-blue-500 disabled:hover:border-gray-300"
                                                >
                                                    ← Trước
                                                </button>

                                                {/* Page Numbers */}
                                                <div className="flex items-center space-x-2">
                                                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                                                        // Show first page, last page, current page, and pages around current
                                                        const showPage =
                                                            page === 1 ||
                                                            page === totalPages ||
                                                            (page >= currentPage - 1 && page <= currentPage + 1);

                                                        const showEllipsis =
                                                            (page === currentPage - 2 && currentPage > 3) ||
                                                            (page === currentPage + 2 && currentPage < totalPages - 2);

                                                        if (showEllipsis) {
                                                            return (
                                                                <span key={page} className="px-2 text-gray-400">
                                                                    ...
                                                                </span>
                                                            );
                                                        }

                                                        if (!showPage) return null;

                                                        return (
                                                            <button
                                                                key={page}
                                                                onClick={() => setCurrentPage(page)}
                                                                className={`w-10 h-10 rounded-lg font-bold transition-all transform hover:scale-110 ${currentPage === page
                                                                    ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                                                                    : 'bg-white text-gray-700 hover:bg-gray-100 border-2 border-gray-300 hover:border-blue-500'
                                                                    }`}
                                                            >
                                                                {page}
                                                            </button>
                                                        );
                                                    })}
                                                </div>

                                                {/* Next Button */}
                                                <button
                                                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                                    disabled={currentPage === totalPages}
                                                    className="px-4 py-2 rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed bg-white text-gray-700 hover:bg-gray-100 border-2 border-gray-300 hover:border-blue-500 disabled:hover:border-gray-300"
                                                >
                                                    Sau →
                                                </button>
                                            </div>

                                            {/* Page Info */}
                                            <div className="text-gray-600 text-sm">
                                                Trang <span className="font-bold text-blue-600">{currentPage}</span> / <span className="font-bold text-blue-600">{totalPages}</span>
                                            </div>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    )}
                </div>
            </section>

            {/* Call to Action */}
            <section className="bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 py-16">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-4xl font-bold text-white mb-4">
                        Sẵn sàng nâng cao kỹ năng? 🚀
                    </h2>
                    <p className="text-xl text-white/90 mb-8">
                        AI sẽ tạo ra các bài tập phù hợp với trình độ của bạn
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button className="bg-white text-blue-600 px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl">
                            Bắt đầu luyện tập
                        </button>
                        <button className="border-2 border-white text-white px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 hover:bg-white hover:text-blue-600">
                            Xem hướng dẫn
                        </button>
                    </div>
                </div>
            </section>

            <style jsx>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        
        @keyframes shine {
          0% { left: -100%; }
          100% { left: 200%; }
        }
        
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
        
        .animate-shine {
          animation: shine 1s ease-in-out;
        }
        
        .delay-1000 {
          animation-delay: 1s;
        }
      `}</style>
        </div>
    );
}

