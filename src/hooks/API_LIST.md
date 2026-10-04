# Danh sách API Frontend (src/hooks)

> Base URL: `process.env.NEXT_PUBLIC_API_URL` (mặc định `http://localhost:8000`)  
> Client: `apiClient` (`src/hooks/apiClient.ts`) — axios, header `Authorization: Bearer <token>` khi đã đăng nhập.

Cập nhật: 2026-07-03

---

## Auth & Profile — `userUser.ts`

| Method | Endpoint | Hook / Export | Ghi chú |
|--------|----------|---------------|---------|
| POST | `/login` | `useLogin` | Body: `{ username, password }` |
| GET | `/profile` | `useProfile` | |
| PATCH | `/profile` | `useUpdateProfile` | |
| POST | `/profile/avatar` | `useUploadAvatar` | `multipart/form-data`, field `file` |

---

## Exam (HSA / TSA / đề thi) — `useExam.ts`

| Method | Endpoint | Hook | Ghi chú |
|--------|----------|------|---------|
| GET | `/exams/sets` | `useExamSets` | Query: `type`, `sortBy`, `grade?`, `userId?`, `name?` (search) |
| GET | `/exams/sets/:id` | `useExamSet` | Query: `password?` |
| POST | `/exams/submit` | `useSubmitExam` | Nộp bài đơn |
| POST | `/exams/groups/submit` | `useSubmitGroupAnswer` | Nộp bài bộ đề group |
| GET | `/exams/result/:id` | `useExamResult` | Kết quả đề đơn |
| GET | `/exams/groups/:groupId/result` | `useExamGroupResult` | Kết quả bộ đề group |
| GET | `/exams/groups` | `useExamSetGroups` | Query: `type`, `groupType?` |
| GET | `/exams/groups/:id` | `useExamSetGroup` | Query: `type`, `groupType?` |
| POST | `/exams/sets/upload` | `useUploadExamSetWithImage` | `multipart/form-data` |
| POST | `/exams/sets` | `useCreateExamSet` | |
| DELETE | `/exams/sets/:id` | `useDeleteExamSet` | |
| PATCH | `/exams/sets/:id` | `useUpdateExamSet` | |
| PATCH | `/exams/questions/:id` | `useUpdateQuestion` | |
| PATCH | `/exams/questions/:id/upload` | `useUpdateQuestionWithImages` | `multipart/form-data` |
| POST | `/exams/groups` | `useCreateExamSetGroup` | |
| PATCH | `/exams/groups/:id` | `useUpdateExamSetGroup` | |
| DELETE | `/exams/groups/:id` | `useDeleteExamSetGroup` | |

### Chapter exam sets — `useExam.ts`

| Method | Endpoint | Hook | Ghi chú |
|--------|----------|------|---------|
| GET | `/chapter-exam-sets` | `useChapterExamSets` | Query: `grade?`, `class?` |
| GET | `/chapter-exam-sets/:id` | `useChapterExamSet` | |
| POST | `/chapter-exam-sets` | `useCreateChapterExamSet` | |
| PATCH | `/chapter-exam-sets/:id` | `useUpdateChapterExamSet` | |
| DELETE | `/chapter-exam-sets/:id` | `useDeleteChapterExamSet` | |
| POST | `/chapter-exam-sets/sub-chapter-exam-sets` | `useCreateSubChapterExamSet` | |
| PATCH | `/chapter-exam-sets/sub-chapter-exam-sets/:id` | `useUpdateSubChapterExamSet` | |
| DELETE | `/chapter-exam-sets/sub-chapter-exam-sets/:id` | `useDeleteSubChapterExamSet` | |

---

## Leaderboard — `useLeaderboard.ts`

| Method | Endpoint | Hook | Ghi chú |
|--------|----------|------|---------|
| GET | `/exams/leaderboard` | `useLeaderboard` | Query: `type` (12, 11, 10, hsa, tsa) |
| GET | `/exams/sets/:examId/leaderboard` | `useExamSetLeaderboard` | Query: `password?`, `limit` (default 20) |

---

## Khóa học (public) — `useCourse.ts`

| Method | Endpoint | Hook | Ghi chú |
|--------|----------|------|---------|
| GET | `/subjects/all` | `useSubjectsList` | Query: `userId?` |
| GET | `/chapters/:chapterId` | `useChapterById` | |

---

## Video & bình luận — `useVideo.ts`

| Method | Endpoint | Hook | Ghi chú |
|--------|----------|------|---------|
| GET | `/videos/:videoId` | `useVideoById` | |
| POST | `/comments` | `useCreateComment` | Body: `{ content, videoId, parentCommentId? }` |

---

## Đăng ký học thử — `useNotify.ts`

| Method | Endpoint | Export | Ghi chú |
|--------|----------|--------|---------|
| POST | `/register-trial` | default export `api.sendNotify` | Body: `{ name, phone, date, school }` |

---

## AI tự luyện (KC) — `useAiSelftPracice.ts`

| Method | Endpoint | Hook | Ghi chú |
|--------|----------|------|---------|
| GET | `/kc/progress` | `useUserKcProgress` | Query: `mock=true` |
| GET | `/kc/competency` | `useCompetency` | |
| POST | `/kc/generate-questions-from-history` | `useGenerateAiPractice`, `useGenerateAiPracticeMutation` | Body: `{ kc_tag }` |
| POST | `/kc/submit-ai-questions` | `useSubmitAiPracticeMutation` | |

---

## Admin — Users — `useAdmin.ts`

| Method | Endpoint | Hook | Ghi chú |
|--------|----------|------|---------|
| GET | `/admin/users` | `useGetUsers` | Query: `searchKey?`, `yearOfBirth?`, `className?` |
| POST | `/admin/users` | `useRegister` | Tạo user |
| DELETE | `/admin/users` | `useDelete` | Body: `{ userId }` |
| PATCH | `/admin/users/:userId` | `useUpdate` | |
| GET | `/admin/exam-set-groups/:groupId/export-excel` | `useExportExamSetGroupExcel` | Response: blob (download file) |

---

## Admin — Exam history & submissions — `useAdminExam.ts`

| Method | Endpoint | Hook | Ghi chú |
|--------|----------|------|---------|
| GET | `/admin/exam-history` | `useGetExamHistory` | Query: `userId?`, `class?`, `examSetId?`, `yearOfBirth?`, `examType?` |
| DELETE | `/exams/sets/:examSetId/questions/:questionId` | `useDeleteQuestionFromExamSet` | |
| DELETE | `/admin/exam-submissions/:submissionId` | `useDeleteExamSubmission` | |
| PATCH | `/admin/exam-submissions/:submissionId` | `useUpdateExamSubmission` | Body: `{ totalPoints?, totalTime? }` |

---

## Admin — Course content — `useAdminCourse.ts`

| Method | Endpoint | Hook | Ghi chú |
|--------|----------|------|---------|
| GET | `/subjects/all` | `useGetSubjects` | |
| POST | `/admin/subjects` | `useCreateSubject` | |
| PUT | `/admin/subjects/:id` | `useUpdateSubject` | |
| DELETE | `/admin/subjects/:subjectId` | `useDeleteSubject` | |
| GET | `/grades` | `useGetGrades` | Query: `subjectId` |
| POST | `/admin/grades` | `useCreateGrade` | |
| PUT | `/admin/grades/:id` | `useUpdateGrade` | |
| DELETE | `/admin/grades/:gradeId` | `useDeleteGrade` | |
| GET | `/chapters/by-grade/:gradeId` | `useGetChapters` | |
| POST | `/admin/chapters` | `useCreateChapter` | |
| PUT | `/admin/chapters/:id` | `useUpdateChapter` | |
| DELETE | `/admin/chapters/:chapterId` | `useDeleteChapter` | |
| GET | `/videos/chapter/:chapterId` | `useGetVideos` | |
| POST | `/admin/videos` | `useCreateVideo` | Metadata video (không upload file) |
| POST | `/videos/upload` | `useUploadVideo` | `multipart/form-data`, field `files` |
| PUT | `/admin/videos` | `useUpdateVideo` | |
| DELETE | `/admin/videos` | `useDeleteVideo` | Body: `{ videoId }` |

---

## Admin — Online courses & enrollments — `useOnlineCourse.ts`

| Method | Endpoint | Hook | Ghi chú |
|--------|----------|------|---------|
| GET | `/admin/online-courses` | `useOnlineCourses` | Query: `grade?`, `subject?`, `isActive?` |
| GET | `/admin/online-courses/:id` | `useOnlineCourse` | |
| POST | `/admin/online-courses` | `useCreateOnlineCourse` | |
| PATCH | `/admin/online-courses/:id` | `useUpdateOnlineCourse` | |
| DELETE | `/admin/online-courses/:id` | `useDeleteOnlineCourse` | |
| POST | `/admin/online-courses/:courseId/exam-access` | `useAttachExamToCourse` | Body: `{ examSetId }` |
| DELETE | `/admin/online-courses/:courseId/exam-access/:examSetId` | `useDetachExamFromCourse` | |
| GET | `/admin/enrollments` | `useEnrollments` | Query: `profileId?`, `courseId?`, `page`, `limit` |
| POST | `/admin/enrollments` | `useCreateEnrollment` | |
| PATCH | `/admin/enrollments/:id` | `useUpdateEnrollment` | |
| DELETE | `/admin/enrollments/:id` | `useDeleteEnrollment` | |

---

## Hooks không gọi API

| File | Mô tả |
|------|--------|
| `apiClient.ts` | Axios instance + interceptors |
| `useAuth.ts` | Đọc/ghi localStorage, không gọi API |
| `useQuestionSlideTimer.ts` | Timer client-side cho TSA |

---

## Tổng hợp theo method

| Method | Số endpoint |
|--------|-------------|
| GET | 24 |
| POST | 22 |
| PATCH | 11 |
| PUT | 4 |
| DELETE | 15 |
| **Tổng** | **76** (endpoint path riêng biệt) |

---

## Ghi chú

1. Một số endpoint dùng chung path với method khác nhau (ví dụ `GET/POST /exams/sets`).
2. `useCourse.getSubjectsList` và `useAdminCourse.getSubjects` cùng gọi `GET /subjects/all`.
3. `useVideo.createComment` gọi `POST comments` (thiếu `/` đầu — axios vẫn resolve relative to baseURL).
4. API ngoài `src/hooks` (gọi trực tiếp trong component/page) **không** nằm trong file này.
