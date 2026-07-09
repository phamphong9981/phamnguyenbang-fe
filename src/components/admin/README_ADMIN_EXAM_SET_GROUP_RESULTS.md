# Admin — Quản lý kết quả bài thi bộ đề

Quản trị viên xem, sửa và xóa kết quả bài thi **bộ đề gộp** (`user_exam_set_group`) mà học sinh đã nộp.

- **Auth:** tất cả endpoint dùng `JwtAuthGuard` + `AdminGuard` (áp ở cấp `AdminController`, prefix `/admin`).
- **Model chính:** mỗi bản ghi `user_exam_set_group` = một lần học sinh nộp một bộ đề (`profileId` + `groupId` + `type`, unique). Các câu trả lời nằm ở `user_exam_set_group_answer`.

> Xuất Excel toàn bộ bài nộp của một bộ đề: xem [README_ADMIN_EXAM_SET_GROUP_EXPORT.md](./README_ADMIN_EXAM_SET_GROUP_EXPORT.md).

---

## 0. API tiền đề — Quản lý bộ đề (exam set group)

Các API kết quả bên dưới cần một `groupId`. Dùng những API sau (đã có sẵn, ở `ExamsController`, prefix `/exams`) để tạo / xem / sửa / xóa bộ đề trước.

> Chi tiết đầy đủ về bộ đề: xem [README_EXAM_SET_GROUP.md](./README_EXAM_SET_GROUP.md).

| Method | Route | Auth | Chức năng |
|--------|-------|------|-----------|
| GET | `/exams/groups` | `JwtAuthGuard` | Danh sách bộ đề (kèm exam sets). Query `type` = `TSA` \| `HSA` (tùy chọn) → lấy `groupId` |
| GET | `/exams/groups/:id` | `JwtAuthGuard` | Chi tiết một bộ đề + toàn bộ câu hỏi. Query `groupType` = `1` \| `2` (tùy chọn) để lọc môn |
| POST | `/exams/groups` | `JwtAuthGuard` + `AdminGuard` | Tạo bộ đề mới |
| PATCH | `/exams/groups/:id` | `JwtAuthGuard` + `AdminGuard` | Sửa bộ đề (tên, mô tả, type, danh sách exam set) |
| DELETE | `/exams/groups/:id` | `JwtAuthGuard` + `AdminGuard` | Xóa bộ đề (`204`) |

**Lấy danh sách bộ đề để chọn `groupId`:**

```bash
curl -H "Authorization: Bearer <ADMIN_TOKEN>" \
  "http://localhost:3000/exams/groups?type=TSA"
```

**Tạo bộ đề** — `POST /exams/groups`:

| Body | Kiểu | Bắt buộc | Mô tả |
|------|------|----------|-------|
| `name` | string | ✅ | Tên bộ đề |
| `type` | `TSA` \| `HSA` | ✅ | Loại bộ đề |
| `description` | string | — | Mô tả |
| `examSetIds` | UUID[] | — | Danh sách exam set thuộc bộ đề (đồng bộ `type` cho các exam set) |

```bash
curl -X POST \
  -H "Authorization: Bearer <ADMIN_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{ "name": "TSA Đề gộp số 1", "type": "TSA", "examSetIds": ["<EXAM_SET_UUID>"] }' \
  "http://localhost:3000/exams/groups"
```

`PATCH /exams/groups/:id` nhận các trường tương tự (`PartialType` của body tạo). Response của cả hai là `ExamSetGroupResponseDto` (có `id` = `groupId`).

**Xuất Excel toàn bộ bài nộp của bộ đề** (admin) — bổ trợ cho các API kết quả:

| Method | Route | Auth |
|--------|-------|------|
| GET | `/admin/exam-set-groups/:groupId/export-excel` | `JwtAuthGuard` + `AdminGuard` |

---

## 1. Danh sách kết quả

**GET** `/admin/exam-set-group-results`

Query (tất cả tùy chọn):

| Tham số | Kiểu | Mô tả |
|---------|------|-------|
| `groupId` | UUID | Lọc theo bộ đề |
| `type` | int (`1` \| `2`) | Lọc theo type đề gộp |
| `class` | string | Lọc theo lớp học sinh (`profile.class`) |
| `search` | string | Tìm theo họ tên hoặc SĐT (khớp một phần, không phân biệt hoa thường) |
| `page` | int (mặc định `1`) | Trang |
| `limit` | int (mặc định `20`, tối đa `100`) | Số bản ghi/trang |

Sắp xếp mặc định: mới nộp trước (`createdAt DESC`).

```bash
curl -H "Authorization: Bearer <ADMIN_TOKEN>" \
  "http://localhost:3000/admin/exam-set-group-results?groupId=<GROUP_UUID>&class=12A1&page=1&limit=20"
```

**Response:**

```json
{
  "data": [
    {
      "id": "b1f...",
      "groupId": "a20...",
      "groupName": "TSA Đề gộp số 1",
      "profileId": "c33...",
      "fullname": "Nguyễn Văn A",
      "phone": "0900000000",
      "class": "12A1",
      "type": 1,
      "totalPoint": 78.5,
      "maxPoints": 100,
      "percentage": 79,
      "createdAt": "2026-07-01T10:00:00.000Z",
      "updatedAt": "2026-07-01T10:00:00.000Z"
    }
  ],
  "total": 42,
  "page": 1,
  "limit": 20
}
```

`percentage` trong danh sách được tính từ `totalPoint` / `maxPoints` đã lưu (làm tròn).

---

## 2. Chi tiết một kết quả

**GET** `/admin/exam-set-group-results/:resultId`

`:resultId` là `user_exam_set_group.id`.

```bash
curl -H "Authorization: Bearer <ADMIN_TOKEN>" \
  "http://localhost:3000/admin/exam-set-group-results/<RESULT_UUID>"
```

**Response:** thông tin học sinh + điểm + chi tiết **từng câu hỏi** (giống API học sinh xem kết quả nhưng tra cứu theo `resultId`):

```json
{
  "id": "b1f...",
  "groupId": "a20...",
  "groupName": "TSA Đề gộp số 1",
  "profileId": "c33...",
  "fullname": "Nguyễn Văn A",
  "phone": "0900000000",
  "class": "12A1",
  "type": 1,
  "totalPoint": 78.5,
  "maxPoints": 100,
  "percentage": 79,
  "message": "Tốt! Bạn đã hoàn thành bài thi.",
  "questionDetails": [
    {
      "questionId": "q1...",
      "content": "...",
      "section": "...",
      "questionType": "...",
      "correctAnswer": ["A"],
      "userAnswer": ["A"],
      "isCorrect": true,
      "pointsEarned": 1,
      "subQuestions": [ /* nếu là câu nhóm */ ]
    }
  ]
}
```

**Lưu ý:** `maxPoints` và `percentage` ở endpoint chi tiết được **tính lại** từ cấu trúc đề hiện tại (đồng bộ với API kết quả của học sinh), có thể khác giá trị đã lưu nếu đề bị chỉnh sau khi nộp.

---

## 3. Sửa điểm (chỉnh tay)

**PATCH** `/admin/exam-set-group-results/:resultId`

Cập nhật điểm đã lưu **mà không** đổi các câu trả lời (`user_exam_set_group_answer`). Cần ít nhất một trong hai trường.

| Body | Kiểu | Mô tả |
|------|------|-------|
| `totalPoint` | number ≥ 0 | Tổng điểm đạt được |
| `maxPoints` | number ≥ 0 | Điểm tối đa |

```bash
curl -X PATCH \
  -H "Authorization: Bearer <ADMIN_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{ "totalPoint": 82 }' \
  "http://localhost:3000/admin/exam-set-group-results/<RESULT_UUID>"
```

**Response:** một dòng kết quả (giống item ở mục 1) sau khi cập nhật.

- Không gửi trường nào → `400 Bad Request` (`At least one of totalPoint, maxPoints is required`).

---

## 4. Xóa kết quả

**DELETE** `/admin/exam-set-group-results/:resultId`

Xóa bản ghi kết quả. Các câu trả lời liên quan bị xóa theo nhờ `onDelete: CASCADE`, nên **học sinh có thể nộp lại** bộ đề đó (vì ràng buộc unique `profileId + groupId + type` được giải phóng).

```bash
curl -X DELETE \
  -H "Authorization: Bearer <ADMIN_TOKEN>" \
  "http://localhost:3000/admin/exam-set-group-results/<RESULT_UUID>"
```

**Response:** `204 No Content`.

---

## Mã lỗi chung

| Mã | Khi nào |
|----|---------|
| `401 / 403` | Thiếu token hoặc không phải admin |
| `404` | Không tìm thấy `resultId` |
| `400` | PATCH không có trường nào để cập nhật |

## Vị trí code

| Thành phần | File |
|------------|------|
| Endpoint kết quả (admin) | [src/admin/admin.controller.ts](./../admin/admin.controller.ts) |
| Endpoint bộ đề tiền đề | `ExamsController` — [src/exams/exams.controller.ts](./exams.controller.ts) (`/exams/groups*`) |
| Nghiệp vụ | `ExamSetGroupService` — [src/exams/services/exam-set-group.service.ts](./services/exam-set-group.service.ts) (`findGroupResultsForAdmin`, `getGroupResultByIdForAdmin`, `updateGroupResultForAdmin`, `deleteGroupResultForAdmin`) |
| DTO | `find-exam-set-group-results.dto.ts`, `update-exam-set-group-result-admin.dto.ts`, `exam-set-group-result-admin-response.dto.ts` (trong [src/exams/dto/](./dto/)) |
| Entity | `user_exam_set_group` — [src/exams/entities/user-exam-set-group.entity.ts](./entities/user-exam-set-group.entity.ts) |
