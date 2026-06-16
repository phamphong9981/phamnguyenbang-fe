import { MasteryBand } from './types';

/** Phân dải màu/nhãn theo mức thành thạo (0-100). null = chưa đủ dữ liệu. */
export function masteryBand(m: number | null): MasteryBand {
    if (m == null) return { key: 'nodata', label: 'Chưa đủ dữ liệu', color: '#9ca3af', bg: '#f3f4f6' };
    if (m >= 80) return { key: 'high', label: 'Vững', color: '#16a34a', bg: '#f0fdf4' };
    if (m >= 60) return { key: 'good', label: 'Khá', color: '#65a30d', bg: '#f7fee7' };
    if (m >= 40) return { key: 'mid', label: 'Trung bình', color: '#d97706', bg: '#fffbeb' };
    return { key: 'low', label: 'Cần cải thiện', color: '#dc2626', bg: '#fef2f2' };
}
