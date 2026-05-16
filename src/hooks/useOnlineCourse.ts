import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from './apiClient';
import { ExamSetType } from './useExam';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface CourseExamAccessExamSetSummary {
    id: string;
    name: string;
    type: ExamSetType;
    grade?: number;
    subject?: number;
    isFree?: boolean;
    isPremiumAccessible?: boolean;
    isCourseAccessible?: boolean;
}

export interface CourseExamAccess {
    id: string;
    examSetId: string;
    courseId?: string;
    createdAt?: string;
    examSet?: CourseExamAccessExamSetSummary;
}

export interface OnlineCourse {
    id: string;
    name: string;
    description?: string | null;
    grade: number;
    subject?: number | null;
    isActive: boolean;
    createdAt?: string;
    updatedAt?: string;
    courseExamAccesses?: CourseExamAccess[];
}

export interface OnlineCourseSummary {
    id: string;
    name: string;
    grade: number;
    subject?: number | null;
}

export interface CourseEnrollmentProfile {
    id: string;
    fullname?: string;
    username?: string;
    class?: string;
    yearOfBirth?: string;
}

export interface CourseEnrollment {
    id: string;
    profileId: string;
    courseId: string;
    expiresAt: string | null;
    note?: string | null;
    createdAt?: string;
    updatedAt?: string;
    profile?: CourseEnrollmentProfile;
    course?: OnlineCourseSummary;
}

export interface PaginatedEnrollmentsResponse {
    data: CourseEnrollment[];
    total: number;
}

// ---------------------------------------------------------------------------
// DTOs
// ---------------------------------------------------------------------------

export interface CreateOnlineCourseDto {
    name: string;
    description?: string;
    grade: number;
    subject?: number | null;
    isActive?: boolean;
}

export type UpdateOnlineCourseDto = Partial<CreateOnlineCourseDto>;

export interface CreateEnrollmentDto {
    profileId: string;
    courseId: string;
    expiresAt?: string | null;
    note?: string;
}

export interface UpdateEnrollmentDto {
    expiresAt?: string | null;
    note?: string | null;
}

export interface OnlineCourseListFilters {
    grade?: number;
    subject?: number;
    isActive?: boolean;
}

export interface EnrollmentListFilters {
    profileId?: string;
    courseId?: string;
    page?: number;
    limit?: number;
}

// ---------------------------------------------------------------------------
// API client
// ---------------------------------------------------------------------------

const api = {
    listOnlineCourses: async (filters: OnlineCourseListFilters = {}): Promise<OnlineCourse[]> => {
        const params = new URLSearchParams();
        if (filters.grade !== undefined) params.append('grade', filters.grade.toString());
        if (filters.subject !== undefined) params.append('subject', filters.subject.toString());
        if (filters.isActive !== undefined) params.append('isActive', filters.isActive.toString());
        const query = params.toString();
        const response = await apiClient.get(`/admin/online-courses${query ? `?${query}` : ''}`);
        return response.data;
    },
    getOnlineCourse: async (id: string): Promise<OnlineCourse> => {
        const response = await apiClient.get(`/admin/online-courses/${id}`);
        return response.data;
    },
    createOnlineCourse: async (data: CreateOnlineCourseDto): Promise<OnlineCourse> => {
        const response = await apiClient.post('/admin/online-courses', data);
        return response.data;
    },
    updateOnlineCourse: async (id: string, data: UpdateOnlineCourseDto): Promise<OnlineCourse> => {
        const response = await apiClient.patch(`/admin/online-courses/${id}`, data);
        return response.data;
    },
    deleteOnlineCourse: async (id: string): Promise<void> => {
        await apiClient.delete(`/admin/online-courses/${id}`);
    },

    attachExamToCourse: async (courseId: string, examSetId: string): Promise<CourseExamAccess> => {
        const response = await apiClient.post(`/admin/online-courses/${courseId}/exam-access`, {
            examSetId,
        });
        return response.data;
    },
    detachExamFromCourse: async (courseId: string, examSetId: string): Promise<void> => {
        await apiClient.delete(`/admin/online-courses/${courseId}/exam-access/${examSetId}`);
    },

    listEnrollments: async (filters: EnrollmentListFilters = {}): Promise<PaginatedEnrollmentsResponse> => {
        const params = new URLSearchParams();
        if (filters.profileId) params.append('profileId', filters.profileId);
        if (filters.courseId) params.append('courseId', filters.courseId);
        params.append('page', String(filters.page ?? 1));
        params.append('limit', String(filters.limit ?? 20));
        const response = await apiClient.get(`/admin/enrollments?${params.toString()}`);
        return response.data;
    },
    createEnrollment: async (data: CreateEnrollmentDto): Promise<CourseEnrollment> => {
        const response = await apiClient.post('/admin/enrollments', data);
        return response.data;
    },
    updateEnrollment: async (id: string, data: UpdateEnrollmentDto): Promise<CourseEnrollment> => {
        const response = await apiClient.patch(`/admin/enrollments/${id}`, data);
        return response.data;
    },
    deleteEnrollment: async (id: string): Promise<void> => {
        await apiClient.delete(`/admin/enrollments/${id}`);
    },
};

// ---------------------------------------------------------------------------
// Query keys
// ---------------------------------------------------------------------------

const COURSES_KEY = 'online-courses';
const COURSE_KEY = 'online-course';
const ENROLLMENTS_KEY = 'enrollments';

// ---------------------------------------------------------------------------
// Hooks – Online Courses
// ---------------------------------------------------------------------------

export const useOnlineCourses = (filters: OnlineCourseListFilters = {}) => {
    return useQuery<OnlineCourse[], Error>({
        queryKey: [COURSES_KEY, filters],
        queryFn: () => api.listOnlineCourses(filters),
        retry: 1,
        staleTime: 30 * 1000,
    });
};

export const useOnlineCourse = (id: string | undefined, enabled = true) => {
    return useQuery<OnlineCourse, Error>({
        queryKey: [COURSE_KEY, id],
        queryFn: () => api.getOnlineCourse(id as string),
        enabled: enabled && !!id,
        retry: 1,
    });
};

export const useCreateOnlineCourse = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: CreateOnlineCourseDto) => api.createOnlineCourse(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [COURSES_KEY] });
        },
    });
};

export const useUpdateOnlineCourse = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdateOnlineCourseDto }) =>
            api.updateOnlineCourse(id, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: [COURSES_KEY] });
            queryClient.invalidateQueries({ queryKey: [COURSE_KEY, variables.id] });
        },
    });
};

export const useDeleteOnlineCourse = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => api.deleteOnlineCourse(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [COURSES_KEY] });
            queryClient.invalidateQueries({ queryKey: [ENROLLMENTS_KEY] });
        },
    });
};

// ---------------------------------------------------------------------------
// Hooks – Course Exam Access
// ---------------------------------------------------------------------------

export const useAttachExamToCourse = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ courseId, examSetId }: { courseId: string; examSetId: string }) =>
            api.attachExamToCourse(courseId, examSetId),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: [COURSES_KEY] });
            queryClient.invalidateQueries({ queryKey: [COURSE_KEY, variables.courseId] });
        },
    });
};

export const useDetachExamFromCourse = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ courseId, examSetId }: { courseId: string; examSetId: string }) =>
            api.detachExamFromCourse(courseId, examSetId),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: [COURSES_KEY] });
            queryClient.invalidateQueries({ queryKey: [COURSE_KEY, variables.courseId] });
        },
    });
};

// ---------------------------------------------------------------------------
// Hooks – Enrollments
// ---------------------------------------------------------------------------

export const useEnrollments = (filters: EnrollmentListFilters = {}) => {
    return useQuery<PaginatedEnrollmentsResponse, Error>({
        queryKey: [ENROLLMENTS_KEY, filters],
        queryFn: () => api.listEnrollments(filters),
        retry: 1,
        staleTime: 30 * 1000,
    });
};

export const useCreateEnrollment = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: CreateEnrollmentDto) => api.createEnrollment(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [ENROLLMENTS_KEY] });
        },
    });
};

export const useUpdateEnrollment = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdateEnrollmentDto }) =>
            api.updateEnrollment(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [ENROLLMENTS_KEY] });
        },
    });
};

export const useDeleteEnrollment = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => api.deleteEnrollment(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [ENROLLMENTS_KEY] });
        },
    });
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

export const getEnrollmentStatus = (
    expiresAt: string | null,
): 'permanent' | 'active' | 'expired' => {
    if (!expiresAt) return 'permanent';
    return new Date(expiresAt).getTime() > Date.now() ? 'active' : 'expired';
};
