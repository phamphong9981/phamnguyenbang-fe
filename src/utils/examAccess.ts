import { ExamSetResponse } from '@/hooks/useExam';

export const ACCESSIBLE_EXAM_TYPE_OPTIONS = [
    { value: 'HSA', label: 'Đề HSA' },
    { value: 'TSA', label: 'Đề TSA' },
    { value: 'chapter', label: 'Đề chương' },
] as const;

export type AccessibleExamType = (typeof ACCESSIBLE_EXAM_TYPE_OPTIONS)[number]['value'];

export const DEFAULT_ACCESSIBLE_EXAM_TYPES: AccessibleExamType[] = ['HSA', 'TSA', 'chapter'];

const STORAGE_KEY = 'accessibleExamTypes';

export function normalizeAccessibleExamTypes(types?: string[] | null): AccessibleExamType[] {
    if (!types || types.length === 0) return [...DEFAULT_ACCESSIBLE_EXAM_TYPES];
    const normalized = types.filter((type): type is AccessibleExamType =>
        DEFAULT_ACCESSIBLE_EXAM_TYPES.includes(type as AccessibleExamType)
    );
    return normalized.length > 0 ? normalized : [...DEFAULT_ACCESSIBLE_EXAM_TYPES];
}

export function getStoredAccessibleExamTypes(): AccessibleExamType[] {
    if (typeof window === 'undefined') return [...DEFAULT_ACCESSIBLE_EXAM_TYPES];
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) return normalizeAccessibleExamTypes(JSON.parse(stored));
    } catch {
        // ignore invalid JSON
    }
    return [...DEFAULT_ACCESSIBLE_EXAM_TYPES];
}

export function setStoredAccessibleExamTypes(types: AccessibleExamType[]) {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(normalizeAccessibleExamTypes(types)));
}

export function clearStoredAccessibleExamTypes() {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(STORAGE_KEY);
}

export function isExamCourseLocked(exam: Pick<ExamSetResponse, 'isCourseAccessible' | 'hasCourseAccess'>): boolean {
    return exam.isCourseAccessible === true && exam.hasCourseAccess === false;
}

export function canUserStartExam(
    exam: Pick<ExamSetResponse, 'isFree' | 'isCourseAccessible' | 'hasCourseAccess'>,
    isAuthenticated: boolean
): boolean {
    if (exam.isFree) return true;
    if (!isAuthenticated) return false;
    return !isExamCourseLocked(exam);
}

export function getExamListRedirectPath(examType?: string | null): string {
    if (examType === 'TSA') return '/thi-hsa-tsa/thi-tsa';
    if (examType === 'chapter') return '/thi-hsa-tsa/bai-tap-chuong';
    return '/thi-hsa-tsa/thi-hsa';
}

export function getApiErrorStatus(error: unknown): number | undefined {
    return (error as { response?: { status?: number } })?.response?.status;
}

export function getApiErrorMessage(error: unknown): string {
    const message = (error as { response?: { data?: { message?: string } } })?.response?.data?.message;
    return typeof message === 'string' ? message : '';
}

export function isExamPasswordError(error: unknown): boolean {
    const status = getApiErrorStatus(error);
    const message = getApiErrorMessage(error).toLowerCase();
    if (!message.includes('password') && !message.includes('mật khẩu')) return false;
    return status === 400 || status === 401 || status === 403;
}

export function isExamAccessDeniedError(error: unknown): boolean {
    const status = getApiErrorStatus(error);
    const message = getApiErrorMessage(error).toLowerCase();
    if (status === 403) {
        return (
            message.includes('quyền') ||
            message.includes('truy cập') ||
            message.includes('gói') ||
            message.includes('access')
        );
    }
    if (status === 401) {
        return message.includes('quyền') || message.includes('truy cập') || message.includes('đăng nhập');
    }
    return false;
}

export function isExamNotFoundError(error: unknown): boolean {
    return getApiErrorStatus(error) === 404;
}
