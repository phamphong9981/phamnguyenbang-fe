import { SUBJECT_ID } from '@/hooks/useExam';

export const SUBJECT_LABELS: Record<number, string> = {
    [SUBJECT_ID.MATH]: 'Toán học',
    [SUBJECT_ID.GEOGRAPHY]: 'Địa lý',
    [SUBJECT_ID.LITERATURE]: 'Ngữ văn',
    [SUBJECT_ID.HISTORY]: 'Lịch sử',
    [SUBJECT_ID.ENGLISH]: 'Tiếng Anh',
    [SUBJECT_ID.PHYSICS]: 'Vật lý',
    [SUBJECT_ID.CHEMISTRY]: 'Hóa học',
    [SUBJECT_ID.BIOLOGY]: 'Sinh học',
    [SUBJECT_ID.SCIENCE]: 'Khoa học tự nhiên',
};

export const getSubjectLabel = (subjectId?: number | null): string => {
    if (subjectId === null || subjectId === undefined) return 'Tất cả môn';
    return SUBJECT_LABELS[subjectId] ?? `Môn #${subjectId}`;
};

export const formatDate = (value: string | Date | null | undefined): string => {
    if (!value) return '—';
    const d = typeof value === 'string' ? new Date(value) : value;
    if (Number.isNaN(d.getTime())) return '—';
    return d.toLocaleString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
};

export const formatDateOnly = (value: string | Date | null | undefined): string => {
    if (!value) return '—';
    const d = typeof value === 'string' ? new Date(value) : value;
    if (Number.isNaN(d.getTime())) return '—';
    return d.toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    });
};

export const daysUntil = (value: string | Date): number => {
    const d = typeof value === 'string' ? new Date(value) : value;
    const diff = d.getTime() - Date.now();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
};

export const toDatetimeLocalValue = (value: string | Date | null | undefined): string => {
    if (!value) return '';
    const d = typeof value === 'string' ? new Date(value) : value;
    if (Number.isNaN(d.getTime())) return '';
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
};
