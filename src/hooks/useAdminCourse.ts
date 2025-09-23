import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "./apiClient";
import { SubjectDetailResponseDto, GradeResponseDto, ChapterResponseDto, VideoResponseDto, useChapterById } from "./useCourse";

// Admin Course Management Interfaces
export interface CreateSubjectData {
    name: string;
    description?: string;
    sortOrder: number;
}

export interface CreateGradeData {
    subjectId: string;
    name: string;
    description?: string;
    sortOrder: number;
    grade: number
}

export interface CreateChapterData {
    gradeId: string;
    name: string;
    description?: string;
    sortOrder: number;
}

export interface CreateVideoData {
    chapterId: string;
    title: string;
    description?: string;
    videoType: 'theory' | 'exercise';
    duration?: number;
    sortOrder: number;
    isFree: boolean;
}

export interface UploadVideoData {
    chapterId: string;
    title: string;
    description?: string;
    videoType: 'theory' | 'exercise';
    duration?: number;
    sortOrder: number;
    isFree: boolean;
    videoFile: File;
    thumbnailFile?: File;
}

export interface UpdateSubjectData extends Partial<CreateSubjectData> {
    id: string;
}

export interface UpdateGradeData extends Partial<CreateGradeData> {
    id: string;
}

export interface UpdateChapterData extends Partial<CreateChapterData> {
    id: string;
}

export interface UpdateVideoData extends Partial<CreateVideoData> {
    id: string;
}

const api = {
    // Subjects
    getSubjects: async () => {
        const response = await apiClient.get('/subjects/all');
        return response.data;
    },
    createSubject: async (data: CreateSubjectData) => {
        const response = await apiClient.post('/admin/subjects', data);
        return response.data;
    },
    updateSubject: async (data: UpdateSubjectData) => {
        const response = await apiClient.put(`/admin/subjects/${data.id}`, data);
        return response.data;
    },
    deleteSubject: async (subjectId: string) => {
        const response = await apiClient.delete(`/admin/subjects/${subjectId}`);
        return response.data;
    },

    // Grades
    getGrades: async (subjectId: string) => {
        const response = await apiClient.get(`/grades?subjectId=${subjectId}`);
        return response.data;
    },
    createGrade: async (data: CreateGradeData) => {
        const response = await apiClient.post('/grades', data);
        return response.data;
    },
    updateGrade: async (data: UpdateGradeData) => {
        const response = await apiClient.put(`/admin/grades/${data.id}`, data);
        return response.data;
    },
    deleteGrade: async (gradeId: string) => {
        const response = await apiClient.delete(`/admin/grades/${gradeId}`);
        return response.data;
    },

    // Chapters
    getChapters: async (gradeId: string) => {
        const response = await apiClient.get(`/chapters/by-grade/${gradeId}`);
        return response.data;
    },
    createChapter: async (data: CreateChapterData) => {
        const response = await apiClient.post('/admin/chapters', data);
        return response.data;
    },
    updateChapter: async (data: UpdateChapterData) => {
        const response = await apiClient.put(`/admin/chapters/${data.id}`, data);
        return response.data;
    },
    deleteChapter: async (chapterId: string) => {
        const response = await apiClient.delete(`/admin/chapters/${chapterId}`);
        return response.data;
    },

    // Videos
    getVideos: async (chapterId: string) => {
        const response = await apiClient.get(`/videos/by-chapter/${chapterId}`);
        return response.data;
    },
    createVideo: async (data: CreateVideoData) => {
        const response = await apiClient.post('/admin/videos', data);
        return response.data;
    },
    uploadVideo: async (data: UploadVideoData) => {
        const formData = new FormData();
        formData.append('chapterId', data.chapterId);
        formData.append('title', data.title);
        formData.append('description', data.description || '');
        formData.append('videoType', data.videoType);
        formData.append('duration', data.duration?.toString() || '0');
        formData.append('sortOrder', data.sortOrder.toString());
        formData.append('isFree', data.isFree.toString());
        formData.append('files', data.videoFile);
        if (data.thumbnailFile) {
            formData.append('files', data.thumbnailFile);
        }

        const response = await apiClient.post('/videos/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },
    updateVideo: async (data: UpdateVideoData) => {
        const response = await apiClient.put(`/admin/videos/${data.id}`, data);
        return response.data;
    },
    deleteVideo: async (videoId: string) => {
        const response = await apiClient.delete(`/admin/videos/${videoId}`);
        return response.data;
    }
};

// Subjects Hooks
export const useGetSubjects = () => {
    return useQuery<SubjectDetailResponseDto[], Error>({
        queryKey: ['admin-subjects'],
        queryFn: () => api.getSubjects(),
        retry: 1,
        staleTime: 60 * 1000,
    });
};

export const useCreateSubject = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: CreateSubjectData) => api.createSubject(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-subjects'] });
        },
    });
};

export const useUpdateSubject = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: UpdateSubjectData) => api.updateSubject(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-subjects'] });
        },
    });
};

export const useDeleteSubject = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (subjectId: string) => api.deleteSubject(subjectId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-subjects'] });
        },
    });
};

// Grades Hooks
export const useGetGrades = (subjectId: string) => {
    return useQuery<GradeResponseDto[], Error>({
        queryKey: ['admin-grades', subjectId],
        queryFn: () => api.getGrades(subjectId),
        enabled: !!subjectId,
        retry: 1,
    });
};

export const useCreateGrade = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: CreateGradeData) => api.createGrade(data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['admin-grades', variables.subjectId] });
            queryClient.invalidateQueries({ queryKey: ['admin-subjects'] });
        },
    });
};

export const useUpdateGrade = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: UpdateGradeData) => api.updateGrade(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-grades'] });
            queryClient.invalidateQueries({ queryKey: ['admin-subjects'] });
        },
    });
};

export const useDeleteGrade = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (gradeId: string) => api.deleteGrade(gradeId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-grades'] });
            queryClient.invalidateQueries({ queryKey: ['admin-subjects'] });
        },
    });
};

// Chapters Hooks
export const useGetChapters = (gradeId: string) => {
    return useQuery<ChapterResponseDto[], Error>({
        queryKey: ['admin-chapters', gradeId],
        queryFn: () => api.getChapters(gradeId),
        enabled: !!gradeId,
        retry: 1,
    });
};

export const useCreateChapter = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: CreateChapterData) => api.createChapter(data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['admin-chapters', variables.gradeId] });
            queryClient.invalidateQueries({ queryKey: ['admin-grades'] });
            queryClient.invalidateQueries({ queryKey: ['admin-subjects'] });
        },
    });
};

export const useUpdateChapter = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: UpdateChapterData) => api.updateChapter(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-chapters'] });
            queryClient.invalidateQueries({ queryKey: ['admin-grades'] });
            queryClient.invalidateQueries({ queryKey: ['admin-subjects'] });
        },
    });
};

export const useDeleteChapter = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (chapterId: string) => api.deleteChapter(chapterId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-chapters'] });
            queryClient.invalidateQueries({ queryKey: ['admin-grades'] });
            queryClient.invalidateQueries({ queryKey: ['admin-subjects'] });
        },
    });
};

// Videos Hooks
export const useGetVideos = (chapterId: string) => {
    return useQuery<VideoResponseDto[], Error>({
        queryKey: ['admin-videos', chapterId],
        queryFn: () => api.getVideos(chapterId),
        enabled: !!chapterId,
        retry: 1,
        staleTime: 60 * 1000,
    });
};

export const useCreateVideo = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: CreateVideoData) => api.createVideo(data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['admin-videos', variables.chapterId] });
            queryClient.invalidateQueries({ queryKey: ['admin-chapters'] });
            queryClient.invalidateQueries({ queryKey: ['admin-grades'] });
            queryClient.invalidateQueries({ queryKey: ['admin-subjects'] });
        },
    });
};

export const useUploadVideo = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: UploadVideoData) => api.uploadVideo(data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['admin-videos', variables.chapterId] });
            queryClient.invalidateQueries({ queryKey: ['admin-chapters'] });
            queryClient.invalidateQueries({ queryKey: ['admin-grades'] });
            queryClient.invalidateQueries({ queryKey: ['admin-subjects'] });
        },
    });
};

export const useUpdateVideo = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: UpdateVideoData) => api.updateVideo(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-videos'] });
            queryClient.invalidateQueries({ queryKey: ['admin-chapters'] });
            queryClient.invalidateQueries({ queryKey: ['admin-grades'] });
            queryClient.invalidateQueries({ queryKey: ['admin-subjects'] });
        },
    });
};

export const useDeleteVideo = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (videoId: string) => api.deleteVideo(videoId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-videos'] });
            queryClient.invalidateQueries({ queryKey: ['admin-chapters'] });
            queryClient.invalidateQueries({ queryKey: ['admin-grades'] });
            queryClient.invalidateQueries({ queryKey: ['admin-subjects'] });
        },
    });
};

