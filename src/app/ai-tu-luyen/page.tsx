'use client';

import Header from '@/components/Header';
import { useUserKcProgress, UserKCProgress } from '@/hooks/useAiSelftPracice';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const kcCategories = {
    algebra: {
        name: 'Đại số', short: 'ĐS', icon: '🔢',
        accent: 'bg-sky-500', strip: 'from-sky-400 to-sky-600',
        chipBg: 'bg-sky-50', chipText: 'text-sky-700', chipBorder: 'border-sky-200',
        hover: 'hover:border-sky-400', activeBg: 'bg-sky-600',
    },
    geometry: {
        name: 'Hình học', short: 'HH', icon: '📐',
        accent: 'bg-violet-500', strip: 'from-violet-400 to-violet-600',
        chipBg: 'bg-violet-50', chipText: 'text-violet-700', chipBorder: 'border-violet-200',
        hover: 'hover:border-violet-400', activeBg: 'bg-violet-600',
    },
    trigonometry: {
        name: 'Lượng giác', short: 'LG', icon: '📊',
        accent: 'bg-emerald-500', strip: 'from-emerald-400 to-emerald-600',
        chipBg: 'bg-emerald-50', chipText: 'text-emerald-700', chipBorder: 'border-emerald-200',
        hover: 'hover:border-emerald-400', activeBg: 'bg-emerald-600',
    },
    calculus: {
        name: 'Giải tích', short: 'GT', icon: '∫',
        accent: 'bg-rose-500', strip: 'from-rose-400 to-rose-600',
        chipBg: 'bg-rose-50', chipText: 'text-rose-700', chipBorder: 'border-rose-200',
        hover: 'hover:border-rose-400', activeBg: 'bg-rose-600',
    },
    statistics: {
        name: 'Xác suất – Thống kê', short: 'TK', icon: '📈',
        accent: 'bg-amber-500', strip: 'from-amber-400 to-amber-600',
        chipBg: 'bg-amber-50', chipText: 'text-amber-700', chipBorder: 'border-amber-200',
        hover: 'hover:border-amber-400', activeBg: 'bg-amber-600',
    },
    default: {
        name: 'Chủ đề khác', short: 'K', icon: '📚',
        accent: 'bg-slate-500', strip: 'from-slate-400 to-slate-600',
        chipBg: 'bg-slate-50', chipText: 'text-slate-700', chipBorder: 'border-slate-200',
        hover: 'hover:border-slate-400', activeBg: 'bg-slate-700',
    },
};

type CategoryKey = keyof typeof kcCategories;

const getCategoryFromTag = (tag: string): CategoryKey => {
    const lowerTag = tag.toLowerCase();
    if (lowerTag.includes('algebra') || lowerTag.includes('đại số')) return 'algebra';
    if (lowerTag.includes('geometry') || lowerTag.includes('hình học')) return 'geometry';
    if (lowerTag.includes('trigonometry') || lowerTag.includes('lượng giác')) return 'trigonometry';
    if (lowerTag.includes('calculus') || lowerTag.includes('giải tích')) return 'calculus';
    if (lowerTag.includes('statistics') || lowerTag.includes('xác suất') || lowerTag.includes('probability')) return 'statistics';
    return 'default';
};

type MasteryTier = {
    label: string;
    text: string;
    bar: string;
    bg: string;
    border: string;
};

const getMasteryTier = (level: number): MasteryTier => {
    const pct = Math.min(Math.max(level * 100, 0), 100);
    if (pct >= 80) return { label: 'Vững', text: 'text-emerald-700', bar: 'bg-emerald-500', bg: 'bg-emerald-50', border: 'border-emerald-200' };
    if (pct >= 60) return { label: 'Khá', text: 'text-sky-700', bar: 'bg-sky-500', bg: 'bg-sky-50', border: 'border-sky-200' };
    if (pct >= 40) return { label: 'Trung bình', text: 'text-amber-700', bar: 'bg-amber-500', bg: 'bg-amber-50', border: 'border-amber-200' };
    if (pct >= 20) return { label: 'Yếu', text: 'text-orange-700', bar: 'bg-orange-500', bg: 'bg-orange-50', border: 'border-orange-200' };
    return { label: 'Cần ôn lại', text: 'text-rose-700', bar: 'bg-rose-500', bg: 'bg-rose-50', border: 'border-rose-200' };
};

const MasteryBar = ({ level }: { level: number }) => {
    const pct = Math.min(Math.max(level * 100, 0), 100);
    const tier = getMasteryTier(level);

    return (
        <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500 font-medium">Độ thành thạo</span>
                <span className={`font-semibold ${tier.text}`}>{pct.toFixed(0)}% · {tier.label}</span>
            </div>
            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                    className={`h-full ${tier.bar} rounded-full transition-all duration-700 ease-out`}
                    style={{ width: `${pct}%` }}
                />
            </div>
        </div>
    );
};

const KCCard = ({ kc, onSelect }: { kc: UserKCProgress; onSelect: () => void }) => {
    const category = getCategoryFromTag(kc.kc_tag);
    const categoryInfo = kcCategories[category];
    const tier = getMasteryTier(kc.mastery_level);
    const title = kc.kcNode?.name_vi || kc.kc_tag;
    const desc = kc.kcNode?.desc_vi;

    return (
        <article
            onClick={onSelect}
            className={`group relative flex flex-col bg-white rounded-xl border border-slate-200 ${categoryInfo.hover} hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 cursor-pointer overflow-hidden`}
        >
            <div className={`h-1.5 bg-gradient-to-r ${categoryInfo.strip}`}></div>

            <div className="px-5 pt-4 pb-3 flex-1">
                <div className="flex items-start justify-between gap-3 mb-3">
                    <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-md ${categoryInfo.chipBg} ${categoryInfo.chipText} ${categoryInfo.chipBorder} border text-xs font-semibold`}>
                        <span className="text-base leading-none">{categoryInfo.icon}</span>
                        {categoryInfo.name}
                    </span>
                    <span className={`text-[11px] px-2 py-0.5 rounded-full ${tier.bg} ${tier.text} ${tier.border} border font-semibold whitespace-nowrap`}>
                        {tier.label}
                    </span>
                </div>

                <h3 className="text-base font-semibold text-slate-900 leading-snug mb-1.5 line-clamp-2">
                    {title}
                </h3>
                {desc && (
                    <p className="text-sm text-slate-500 line-clamp-2 mb-4 leading-relaxed">
                        {desc}
                    </p>
                )}

                <MasteryBar level={kc.mastery_level} />
            </div>

            <div className="px-5 py-3 border-t border-slate-100 bg-gradient-to-br from-slate-50 to-white flex items-center justify-between">
                <span className="text-xs text-slate-500">
                    Cập nhật {new Date(kc.last_updated).toLocaleDateString('vi-VN')}
                </span>
                <span className={`text-sm font-semibold ${categoryInfo.chipText} inline-flex items-center gap-1`}>
                    Luyện điểm yếu
                    <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
                </span>
            </div>
        </article>
    );
};

export default function AiSelfPracticePage() {
    const { data: kcProgress, isLoading, error } = useUserKcProgress();
    const [selectedCategory, setSelectedCategory] = useState<CategoryKey | 'all'>('all');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 9;
    const router = useRouter();

    const filteredKcProgress = kcProgress?.filter(kc => {
        if (selectedCategory === 'all') return true;
        return getCategoryFromTag(kc.kc_tag) === selectedCategory;
    }) || [];

    const totalPages = Math.ceil(filteredKcProgress.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedKcProgress = filteredKcProgress.slice(startIndex, startIndex + itemsPerPage);

    const handleCategoryChange = (category: CategoryKey | 'all') => {
        setSelectedCategory(category);
        setCurrentPage(1);
    };

    const getCategoryCount = (category: CategoryKey | 'all') => {
        if (category === 'all') return kcProgress?.length || 0;
        return kcProgress?.filter(kc => getCategoryFromTag(kc.kc_tag) === category).length || 0;
    };

    const totalKc = kcProgress?.length || 0;
    const avgMastery = totalKc > 0
        ? Math.round(kcProgress!.reduce((acc, kc) => acc + kc.mastery_level, 0) / totalKc * 100)
        : 0;
    const weakKcCount = kcProgress?.filter(kc => kc.mastery_level < 0.6).length || 0;

    return (
        <div className="min-h-screen bg-slate-50">
            <Header />

            <section className="relative bg-gradient-to-br from-indigo-600 via-violet-600 to-fuchsia-600 overflow-hidden">
                <div className="absolute inset-0 opacity-20 pointer-events-none">
                    <div className="absolute -top-24 -left-24 w-80 h-80 bg-white rounded-full blur-3xl"></div>
                    <div className="absolute -bottom-32 -right-16 w-96 h-96 bg-fuchsia-300 rounded-full blur-3xl"></div>
                </div>
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
                        <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-sm border border-white/30 text-white text-xs font-semibold mb-4">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse"></span>
                                AI Cá nhân hoá · Học sinh THPT
                            </div>
                            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight leading-tight">
                                Luyện điểm yếu cùng AI
                            </h1>
                            <p className="mt-4 text-white/85 max-w-2xl leading-relaxed">
                                Hệ thống phân tích những câu em đã làm sai và sinh đề bám sát điểm yếu của từng chủ đề.
                                Mỗi lượt luyện gồm <span className="font-bold text-white">10 câu</span>: 5 câu rèn nền tảng và 5 câu nâng cao thử thách.
                            </p>
                        </div>

                        <div className="grid grid-cols-3 gap-3 lg:gap-4 w-full lg:w-auto">
                            <div className="bg-white/15 backdrop-blur-md border border-white/30 rounded-xl px-4 py-3 min-w-[120px]">
                                <div className="text-3xl font-bold text-white">{totalKc}</div>
                                <div className="text-xs text-white/80 mt-0.5 font-medium">Chủ đề</div>
                            </div>
                            <div className="bg-emerald-400/20 backdrop-blur-md border border-emerald-300/40 rounded-xl px-4 py-3 min-w-[120px]">
                                <div className="text-3xl font-bold text-emerald-50">{avgMastery}%</div>
                                <div className="text-xs text-emerald-100/90 mt-0.5 font-medium">Thành thạo TB</div>
                            </div>
                            <div className="bg-amber-400/20 backdrop-blur-md border border-amber-300/40 rounded-xl px-4 py-3 min-w-[120px]">
                                <div className="text-3xl font-bold text-amber-50">{weakKcCount}</div>
                                <div className="text-xs text-amber-100/90 mt-0.5 font-medium">Cần ôn lại</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {isLoading && (
                        <div className="flex flex-col items-center justify-center py-20">
                            <div className="relative w-12 h-12 mb-4">
                                <div className="absolute inset-0 border-2 border-slate-200 rounded-full"></div>
                                <div className="absolute inset-0 border-2 border-emerald-600 rounded-full border-t-transparent animate-spin"></div>
                            </div>
                            <p className="text-slate-600 text-sm font-medium">Đang tải dữ liệu học tập…</p>
                        </div>
                    )}

                    {error && (
                        <div className="bg-rose-50 border border-rose-200 rounded-lg p-6 text-center">
                            <h3 className="text-base font-semibold text-rose-800 mb-1">Không tải được dữ liệu</h3>
                            <p className="text-sm text-rose-600">{error.message}</p>
                        </div>
                    )}

                    {!isLoading && !error && kcProgress && (
                        <>
                            {kcProgress.length > 0 && (
                                <div className="mb-6">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <button
                                            onClick={() => handleCategoryChange('all')}
                                            className={`px-3.5 py-1.5 rounded-full text-sm font-semibold border transition-all ${selectedCategory === 'all'
                                                ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white border-transparent shadow-sm'
                                                : 'bg-white text-slate-700 border-slate-200 hover:border-slate-400 hover:shadow-sm'
                                                }`}
                                        >
                                            <span className="mr-1">📚</span>
                                            Tất cả
                                            <span className={`ml-1.5 text-xs px-1.5 py-0.5 rounded-full ${selectedCategory === 'all' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'}`}>
                                                {getCategoryCount('all')}
                                            </span>
                                        </button>
                                        {(Object.keys(kcCategories) as CategoryKey[])
                                            .filter(key => key !== 'default' && getCategoryCount(key) > 0)
                                            .map((categoryKey) => {
                                                const count = getCategoryCount(categoryKey);
                                                const active = selectedCategory === categoryKey;
                                                const cat = kcCategories[categoryKey];
                                                return (
                                                    <button
                                                        key={categoryKey}
                                                        onClick={() => handleCategoryChange(categoryKey)}
                                                        className={`px-3.5 py-1.5 rounded-full text-sm font-semibold border transition-all ${active
                                                            ? `${cat.activeBg} text-white border-transparent shadow-sm`
                                                            : `${cat.chipBg} ${cat.chipText} ${cat.chipBorder} ${cat.hover} hover:shadow-sm`
                                                            }`}
                                                    >
                                                        <span className="mr-1">{cat.icon}</span>
                                                        {cat.name}
                                                        <span className={`ml-1.5 text-xs px-1.5 py-0.5 rounded-full ${active ? 'bg-white/20 text-white' : 'bg-white/70'}`}>
                                                            {count}
                                                        </span>
                                                    </button>
                                                );
                                            })}
                                    </div>

                                    <div className="mt-3 text-sm text-slate-500">
                                        Hiển thị <span className="font-semibold text-slate-900">{paginatedKcProgress.length}</span> / <span className="font-semibold text-slate-900">{filteredKcProgress.length}</span> chủ đề
                                    </div>
                                </div>
                            )}

                            {kcProgress.length === 0 ? (
                                <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
                                    <h3 className="text-lg font-semibold text-slate-900 mb-2">
                                        Chưa có dữ liệu học tập
                                    </h3>
                                    <p className="text-sm text-slate-600 max-w-md mx-auto">
                                        Em hãy hoàn thành ít nhất một đề thi để hệ thống ghi nhận tiến độ và đề xuất bài luyện tập phù hợp.
                                    </p>
                                </div>
                            ) : filteredKcProgress.length === 0 ? (
                                <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
                                    <h3 className="text-lg font-semibold text-slate-900 mb-2">
                                        Không có chủ đề nào trong danh mục này
                                    </h3>
                                    <button
                                        onClick={() => handleCategoryChange('all')}
                                        className="mt-4 inline-flex items-center text-sm font-semibold text-emerald-700 hover:text-emerald-800"
                                    >
                                        ← Xem tất cả chủ đề
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {paginatedKcProgress.map((kc) => (
                                            <KCCard
                                                key={kc.progress_id}
                                                kc={kc}
                                                onSelect={() => {
                                                    router.push(`/ai-tu-luyen/practice?kc=${encodeURIComponent(kc.kc_tag)}`);
                                                }}
                                            />
                                        ))}
                                    </div>

                                    {totalPages > 1 && (
                                        <div className="mt-8 flex items-center justify-center gap-1.5">
                                            <button
                                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                                disabled={currentPage === 1}
                                                className="px-3 py-1.5 rounded-md text-sm font-medium border border-slate-200 bg-white text-slate-700 hover:border-slate-400 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:border-slate-200"
                                            >
                                                ← Trước
                                            </button>

                                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                                                const showPage =
                                                    page === 1 ||
                                                    page === totalPages ||
                                                    (page >= currentPage - 1 && page <= currentPage + 1);

                                                const showEllipsis =
                                                    (page === currentPage - 2 && currentPage > 3) ||
                                                    (page === currentPage + 2 && currentPage < totalPages - 2);

                                                if (showEllipsis) {
                                                    return <span key={page} className="px-1 text-slate-400">…</span>;
                                                }
                                                if (!showPage) return null;

                                                return (
                                                    <button
                                                        key={page}
                                                        onClick={() => setCurrentPage(page)}
                                                        className={`w-9 h-9 rounded-md text-sm font-semibold transition-all ${currentPage === page
                                                            ? 'bg-slate-900 text-white'
                                                            : 'bg-white text-slate-700 border border-slate-200 hover:border-slate-400'
                                                            }`}
                                                    >
                                                        {page}
                                                    </button>
                                                );
                                            })}

                                            <button
                                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                                disabled={currentPage === totalPages}
                                                className="px-3 py-1.5 rounded-md text-sm font-medium border border-slate-200 bg-white text-slate-700 hover:border-slate-400 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:border-slate-200"
                                            >
                                                Sau →
                                            </button>
                                        </div>
                                    )}
                                </>
                            )}
                        </>
                    )}
                </div>
            </section>
        </div>
    );
}
