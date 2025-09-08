import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "./apiClient";

export interface CommentResponseDto {
    id: string
    videoId: string
    profileId: string
    fullname: string
    parentCommentId?: string
    content: string
    likesCount: number
    createdAt: Date
    updatedAt: Date
    replies: CommentResponseDto[]
}

export interface VideoResponseDto {
    id: string
    chapterId: string
    title: string
    description?: string
    s3Video: string
    s3Thumbnail: string
    videoType: 'theory' | 'exercise'
    duration?: number
    sortOrder: number
    createdAt: Date
    updatedAt: Date
    comments: CommentResponseDto[]
    isFree: boolean
}

const api = {
    getVideoById: async (videoId: string) => {
        const response = await apiClient.get(`/videos/${videoId}`);
        return response.data;
    },
    createComment: async (videoId: string, content: string, parentCommentId?: string) => {
        const payload = { content, ...(parentCommentId && { parentCommentId }), videoId };
        const response = await apiClient.post(`comments`, payload);
        return response.data;
    }
}

export const useVideoById = (videoId: string) => {
    return useQuery<VideoResponseDto, Error>({
        queryKey: ['videoById', videoId],
        queryFn: () => api.getVideoById(videoId),
        enabled: !!videoId,
        retry: 1,
        retryDelay: (attemptIndex) => Math.min(1000 * 1 ** attemptIndex, 30000),
    })
}

export const useCreateComment = (videoId: string) => {
    const queryClient = useQueryClient()
    return useMutation<CommentResponseDto, Error, { content: string, parentCommentId?: string }>({
        mutationFn: (data) => api.createComment(videoId, data.content, data.parentCommentId),
        onSuccess: (newComment) => {
            // Invalidate and refetch video data to get updated comments
            queryClient.invalidateQueries({ queryKey: ['videoById', videoId] })

            // Optimistically update the cache if needed
            queryClient.setQueryData(['videoById', videoId], (oldData: VideoResponseDto | undefined) => {
                if (!oldData) return oldData

                return {
                    ...oldData,
                    comments: [newComment, ...oldData.comments]
                }
            })
        },
        onError: (error) => {
            console.error('Error creating comment:', error)
        }
    })
}