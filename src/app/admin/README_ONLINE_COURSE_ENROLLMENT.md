# Online Course Enrollment

Chức năng cho phép admin tạo các **khóa học online**, gắn **bộ đề (ExamSet)** vào từng khóa học, và **đăng ký quyền truy cập** cho từng học sinh. Học sinh chỉ nhìn thấy và làm được các bộ đề thuộc khóa học mà mình đã đăng ký và còn hạn.

---

## Mô hình dữ liệu

```
OnlineCourse (khóa học)
    ├── CourseExamAccess[] ──► ExamSet (bộ đề nào thuộc khóa này)
    └── CourseEnrollment[] ──► Profile (học sinh nào đã đăng ký)
```

### Bảng `online_courses`
| Cột | Kiểu | Mô tả |
|---|---|---|
| `id` | uuid | PK |
| `name` | varchar(255) | Tên khóa học |
| `description` | text (nullable) | Mô tả |
| `grade` | int | Lớp (mặc định 12) |
| `subject` | int (nullable) | ID môn học (null = tất cả môn) |
| `is_active` | boolean | Có đang kích hoạt không |
| `created_at` / `updated_at` | timestamptz | Timestamps |

### Bảng `course_exam_accesses`
| Cột | Kiểu | Mô tả |
|---|---|---|
| `id` | uuid | PK |
| `course_id` | uuid FK | → `online_courses.id` (CASCADE DELETE) |
| `exam_set_id` | uuid FK | → `exam_sets.id` (CASCADE DELETE) |
| `created_at` | timestamptz | |

Unique constraint: `(course_id, exam_set_id)`

### Bảng `course_enrollments`
| Cột | Kiểu | Mô tả |
|---|---|---|
| `id` | uuid | PK |
| `profile_id` | uuid FK | → `profiles.id` (CASCADE DELETE) |
| `course_id` | uuid FK | → `online_courses.id` (CASCADE DELETE) |
| `expires_at` | timestamptz (nullable) | Hạn truy cập (null = không giới hạn) |
| `note` | text (nullable) | Ghi chú của admin |
| `created_at` / `updated_at` | timestamptz | |

Unique constraint: `(profile_id, course_id)`

### Thay đổi bảng `exam_sets`
Thêm 2 cột boolean độc lập — một bộ đề có thể bật cả hai cùng lúc:

| Cột | Kiểu | Default | Ý nghĩa |
|---|---|---|---|
| `is_premium_accessible` | boolean | `true` | Học sinh trung tâm (đã đăng nhập) có thể truy cập |
| `is_course_accessible` | boolean | `false` | Học sinh online có enrollment hợp lệ chứa bộ đề này mới được truy cập |

Quyền truy cập là **hợp (OR)** giữa các flag:

| Loại đề | `isFree` | `isPremiumAccessible` | `isCourseAccessible` |
|---|---|---|---|
| Đề miễn phí | `true` | - | - |
| Đề trung tâm | `false` | `true` | `false` |
| Đề online riêng | `false` | `false` | `true` |
| Đề dùng chung (trung tâm + online) | `false` | `true` | `true` |

---

## Admin APIs

Tất cả endpoint admin đều yêu cầu `Authorization: Bearer <admin-jwt>`.

### Quản lý khóa học

#### `GET /admin/online-courses`
Lấy danh sách khóa học kèm bộ đề gắn vào.

Query params:
- `grade` (number) – lọc theo lớp
- `subject` (number) – lọc theo môn
- `isActive` (boolean) – lọc theo trạng thái

Response `200`:
```json
[
  {
    "id": "uuid",
    "name": "Toán 12 Online",
    "grade": 12,
    "subject": 1,
    "isActive": true,
    "courseExamAccesses": [
      {
        "id": "uuid",
        "examSetId": "uuid",
        "examSet": { "id": "uuid", "name": "...", "type": "CHAPTER" }
      }
    ]
  }
]
```

#### `POST /admin/online-courses`
Tạo khóa học mới.

Body:
```json
{
  "name": "Toán 12 Online",
  "description": "Khóa học toán lớp 12",
  "grade": 12,
  "subject": 1,
  "isActive": true
}
```

Response `201`: object OnlineCourse vừa tạo.

#### `GET /admin/online-courses/:id`
Chi tiết khóa học kèm toàn bộ bộ đề.

#### `PATCH /admin/online-courses/:id`
Cập nhật thông tin khóa học. Body là bất kỳ trường nào của `CreateOnlineCourseDto`.

#### `DELETE /admin/online-courses/:id`
Xóa khóa học (cascade xóa `course_exam_accesses` và `course_enrollments`).

Response `204 No Content`.

---

### Quản lý bộ đề trong khóa học

#### `POST /admin/online-courses/:courseId/exam-access`
Gắn một bộ đề vào khóa học.

Body:
```json
{ "examSetId": "uuid-of-exam-set" }
```

Response `201`: object CourseExamAccess.
Response `409`: Bộ đề đã được gắn vào khóa học này.

#### `DELETE /admin/online-courses/:courseId/exam-access/:examSetId`
Gỡ bộ đề khỏi khóa học.

Response `204 No Content`.

---

### Quản lý đăng ký

#### `GET /admin/enrollments`
Danh sách đăng ký có phân trang.

Query params:
- `profileId` (uuid) – lọc theo profile
- `courseId` (uuid) – lọc theo khóa học
- `page` (number, default 1)
- `limit` (number, default 20)

Response `200`:
```json
{
  "data": [
    {
      "id": "uuid",
      "profileId": "uuid",
      "courseId": "uuid",
      "expiresAt": "2027-01-01T00:00:00.000Z",
      "note": "Thanh toán qua Zalo Pay",
      "profile": { "id": "...", "fullname": "..." },
      "course": { "id": "...", "name": "Toán 12 Online" }
    }
  ],
  "total": 42
}
```

#### `POST /admin/enrollments`
Đăng ký khóa học cho một profile.

Body:
```json
{
  "profileId": "uuid-of-profile",
  "courseId": "uuid-of-course",
  "expiresAt": "2027-01-01T00:00:00Z",
  "note": "Thanh toán qua Zalo Pay"
}
```

- `expiresAt` không bắt buộc; nếu bỏ qua sẽ là `null` (không giới hạn thời gian).
- `note` không bắt buộc.

Response `201`: object CourseEnrollment.
Response `404`: Không tìm thấy khóa học.
Response `409`: Profile đã đăng ký khóa học này rồi.

#### `PATCH /admin/enrollments/:id`
Cập nhật hạn sử dụng hoặc ghi chú của một đăng ký.

Body:
```json
{
  "expiresAt": "2028-01-01T00:00:00Z",
  "note": "Gia hạn thêm 1 năm"
}
```

#### `DELETE /admin/enrollments/:id`
Thu hồi quyền truy cập (xóa enrollment).

Response `204 No Content`.

---

## User APIs

Yêu cầu `Authorization: Bearer <user-jwt>`.

#### `GET /online-courses/my-enrollments`
Lấy tất cả khóa học đã đăng ký cùng danh sách bộ đề được mở. Chỉ trả về enrollment còn hiệu lực dựa trên `expires_at`.

Response `200`:
```json
[
  {
    "id": "uuid",
    "courseId": "uuid",
    "expiresAt": "2027-01-01T00:00:00.000Z",
    "course": {
      "id": "uuid",
      "name": "Toán 12 Online",
      "courseExamAccesses": [
        {
          "examSetId": "uuid",
          "examSet": { "id": "uuid", "name": "Bài tập Chương 1", "type": "CHAPTER" }
        }
      ]
    }
  }
]
```

#### `GET /online-courses/accessible-exam-ids`
Lấy danh sách UUID của tất cả bộ đề mà user có quyền truy cập qua khóa học (lọc enrollment còn hạn).

Response `200`:
```json
["uuid-exam-1", "uuid-exam-2", "uuid-exam-3"]
```

Dùng endpoint này ở frontend để ẩn/hiện nút làm bài trước khi gọi chi tiết bộ đề.

---

## Access control trong ExamSet

Khi user gọi các API liên quan đến bộ đề, backend áp dụng logic sau:

### Listing (`GET /exam-sets`)
- **Guest (không JWT):** chỉ thấy bộ đề có `isFree = true`
- **User đăng nhập:** thấy tất cả bộ đề (lọc theo class), mỗi bộ đề có thêm field:
  ```json
  { "hasCourseAccess": true | false }
  ```
  - `hasCourseAccess = true` nếu `isCourseAccessible = false` (không liên quan đến khóa online), hoặc user có enrollment còn hạn chứa bộ đề này
  - `hasCourseAccess = false` nếu `isCourseAccessible = true` nhưng user chưa/hết enrollment

### Mở bộ đề (`GET /exam-sets/:id`)
| `isFree` | `isPremiumAccessible` | `isCourseAccessible` | Kết quả với user đăng nhập |
|---|---|---|---|
| `true` | - | - | `200 OK` (kể cả guest) |
| `false` | `true` | `false` | `200 OK` |
| `false` | `false` | `true` | `200 OK` nếu có enrollment; `403` nếu không |
| `false` | `true` | `true` | `200 OK` (premium đủ điều kiện) |
| `false` | `false` | `false` | `403` (không ai được mở — admin không nên tạo case này) |
| `false` | bất kỳ | bất kỳ | `401` nếu chưa đăng nhập |

---

## Luồng sử dụng điển hình

### Admin setup
1. Tạo khóa học: `POST /admin/online-courses`
2. Gắn các bộ đề vào khóa học: `POST /admin/online-courses/:courseId/exam-access` (lặp lại cho từng bộ đề)
3. Cập nhật flag trên ExamSet qua `PATCH /exam-sets/:id`:
   - Đề **chỉ** dành cho online: `{ "isPremiumAccessible": false, "isCourseAccessible": true }`
   - Đề dùng **chung** trung tâm + online: `{ "isPremiumAccessible": true, "isCourseAccessible": true }`
4. Khi học sinh thanh toán: `POST /admin/enrollments` với `profileId`, `courseId`, `expiresAt`

### Học sinh trải nghiệm
1. Sau khi đăng nhập, gọi `GET /online-courses/my-enrollments` để biết mình đã mua khóa nào và các bộ đề được mở
2. Trong danh sách bộ đề, kiểm tra field `hasCourseAccess` để enable/disable nút làm bài ở frontend
3. Khi mở bộ đề `accessLevel = 'course'`, backend tự kiểm tra enrollment — trả `403` nếu không đủ điều kiện

---

## Lưu ý triển khai

- **Migration cần chạy theo thứ tự:**
  1. `20250516000000_create_online_courses_table.sql`
  2. `20250516000001_create_course_exam_accesses_table.sql`
  3. `20250516000002_create_course_enrollments_table.sql`
  4. `20250516000003_add_access_flags_to_exam_sets.sql`

- **`isFree` và `accessLevel` song song:** `isFree = true` vẫn hoạt động độc lập với `accessLevel`. Khi check quyền truy cập, ưu tiên `isFree = true` → cho qua ngay; sau đó mới check `accessLevel`.

- **Expiry check** được thực hiện trong service (`expires_at IS NULL OR expires_at > NOW()`), không có cronjob xóa enrollment tự động.

- **Không circular dependency:** `ExamsModule` inject trực tiếp `CourseEnrollment` repository thay vì import `OnlineCoursesModule`, tránh vòng lặp dependency.
