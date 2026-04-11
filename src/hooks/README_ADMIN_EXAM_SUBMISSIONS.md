# Admin: sửa và xóa bài nộp học sinh (`profile_exams`)

Các API **chỉ dành cho admin** (`JwtAuthGuard` + `AdminGuard`). Thao tác trên bản ghi **`profile_exams`** (một lần nộp bài của một profile cho một đề).

**Lưu ý:** Sửa **`totalPoints`** chỉ cập nhật điểm tổng trên bản ghi; **không** chỉnh từng câu trong `user_answers`. Nếu cần đồng bộ chi tiết từng câu, phải dùng luồng/API khác (hiện chưa có trong endpoint này).

Để xóa **đề thi** (exam set), dùng `DELETE /exams/sets/:id` (admin).

---

## 1. Sửa bài nộp

`PATCH /admin/exam-submissions/:submissionId`

| Thành phần | Mô tả |
|------------|--------|
| **`:submissionId`** | UUID của `profile_exams.id` — trùng **`submissionId`** trong `GET /admin/exam-history`. |

### Header

`Authorization: Bearer <token>` — JWT **admin**.

### Body (JSON)

Ít nhất **một** trong các field sau (toàn bộ optional nhưng không được gửi body rỗng):

| Field | Kiểu | Mô tả |
|-------|------|--------|
| `totalPoints` | number | Tổng điểm (≥ 0, tối đa 2 chữ thập phân). |
| `totalTime` | integer | Thời gian làm bài (giây, ≥ 0). |
| `giveAway` | string \| null | ID giải thưởng; gửi **`null`** để xóa giải. |

### Response `200` (`ExamSubmissionAdminResponseDto`)

| Field | Mô tả |
|-------|--------|
| `submissionId` | UUID bản ghi |
| `examId` | UUID đề |
| `profileId` | UUID profile học sinh |
| `totalPoints` | Điểm sau cập nhật |
| `totalTime` | Thời gian sau cập nhật |
| `giveAway` | Giải hoặc `null` |
| `updatedAt` | Thời điểm cập nhật |

### Lỗi

| Mã | Tình huống |
|----|------------|
| **400** | Body không có field nào để cập nhật |
| **404** | Không có `submissionId` |
| **401** / **403** | Không đăng nhập / không phải admin |

### Ví dụ

```http
PATCH /admin/exam-submissions/550e8400-e29b-41d4-a716-446655440000
Authorization: Bearer <admin_access_token>
Content-Type: application/json

{
  "totalPoints": 8.5,
  "totalTime": 2400
}
```

---

## 2. Xóa bài nộp

`DELETE /admin/exam-submissions/:submissionId`

Xóa bản ghi `profile_exams` và các `user_answers` liên quan (cascade).

- **204:** thành công, không body  
- **404:** không tìm thấy bản ghi  

Chi tiết cũ nằm trong cùng luồng: dùng cùng `submissionId` như `GET /admin/exam-history`.

```http
DELETE /admin/exam-submissions/550e8400-e29b-41d4-a716-446655440000
Authorization: Bearer <admin_access_token>
```

---

## Liên quan

| API | Vai trò |
|-----|---------|
| `GET /admin/exam-history` | Danh sách bài nộp (có `submissionId`) |
| `DELETE /exams/sets/:id` | Xóa **đề**, không phải một lần nộp |
