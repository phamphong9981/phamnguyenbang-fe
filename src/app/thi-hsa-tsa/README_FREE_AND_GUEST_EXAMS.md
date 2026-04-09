# Free exam & guest (khách vãng lai) — hướng dẫn tích hợp FE

Tài liệu mô tả hành vi API liên quan tới **đề free** (`isFree` / cột DB `is_free`) và **nộp bài không đăng nhập**. Phần migration tham chiếu: `src/database/migrations/20241109000017_add_is_free_to_exam_sets.sql`, `src/database/migrations/20241109000018_profiles_nullable_user_id.sql`.

## Mô hình dữ liệu (ý nghĩa nghiệp vụ)

| Khái niệm | Ý nghĩa |
|-----------|---------|
| **`exam_sets.is_free = true`** | Đề được **xem danh sách**, **mở chi tiết** và **nộp bài** mà không cần JWT. Đề `is_free = false` vẫn yêu cầu đăng nhập cho các thao tác đó (theo từng endpoint). |
| **Profile khách (`profiles.user_id IS NULL`)** | Khi khách nộp bài free, BE tạo hoặc cập nhật một bản ghi profile **không gắn user**, dựa trên `guestProfile.phone` (cùng SĐT + `user_id` null → gộp một profile; cập nhật họ tên, trường, năm sinh nếu gửi lại). |

JSON từ API dùng **camelCase** (ví dụ `isFree`, không phải `is_free`).

---

## 1. Danh sách đề — `GET /exams/sets`

- **Không gửi JWT:** response chỉ gồm các đề có **`isFree === true`** (kèm filter query hiện có của BE).
- **Có JWT:** trả về đề theo quyền/lớp của user (như trước), không giới hạn chỉ free.

FE có thể dựa vào field **`isFree`** trên từng item (xem DTO `ExamSetResponseDto`) để badge “Miễn phí” / luồng khách.

---

## 2. Chi tiết đề — `GET /exams/sets/:id`

- **Không JWT:** chỉ cho phép nếu đề đó **`isFree === true`**. Nếu không → **401** (thiếu quyền truy cập).
- **Có JWT:** có thể mở đề không free (vẫn áp dụng filter lớp / logic BE).
- Nếu đề có **mật khẩu**, kể cả khách vẫn phải gửi đúng query `?password=...` (xem thêm `README_EXAM_SET_PASSWORD.md` nếu có).

---

## 3. Nộp bài — `POST /exams/submit`

Guard: **JWT tùy chọn** (`OptionalJwtAuthGuard`). Có thể gọi **có hoặc không** header `Authorization: Bearer ...`.

### Body chung (đã có từ trước)

| Field | Kiểu | Mô tả |
|-------|------|--------|
| `examId` | UUID | ID của exam set |
| `answers` | mảng | `{ questionId, selectedAnswer: string[] }[]` |
| `totalTime` | số nguyên ≥ 0 | Thời gian làm bài (giây) |

### Thêm cho khách: `guestProfile` (object, optional khi đã login)

Bắt buộc khi **không có JWT** và đề đang nộp là **free** (`isFree` trên exam đó).

| Field | Ràng buộc | Mô tả |
|-------|-----------|--------|
| `fullname` | string non-empty | Họ tên |
| `school` | string non-empty | Trường |
| `yearOfBirth` | integer | 1900–2100 |
| `phone` | string non-empty | SĐT — **khóa ghép** profile khách (cùng SĐT → cùng profile nếu vẫn là guest) |

**User đã đăng nhập:** gửi JWT như bình thường; **`guestProfile` không cần** (nếu gửi, BE dùng profile theo tài khoản, không dựa vào guest).

### Ví dụ JSON — khách nộp bài free

```json
{
  "examId": "550e8400-e29b-41d4-a716-446655440000",
  "answers": [
    { "questionId": "6ba7b810-9dad-11d1-80b4-00c04fd430c8", "selectedAnswer": ["A"] }
  ],
  "totalTime": 1200,
  "guestProfile": {
    "fullname": "Nguyễn Văn A",
    "school": "THPT X",
    "yearOfBirth": 2007,
    "phone": "0909123456"
  }
}
```

### Lỗi thường gặp

| HTTP | Tình huống |
|------|------------|
| **401** | Không JWT nhưng đề **không** free → cần đăng nhập để nộp. |
| **400** | Không JWT + đề free nhưng **thiếu `guestProfile`** hoặc validate nested fail. |
| **404** | Không tìm thấy exam (hoặc với user đã login: không có profile,... — theo message BE). |

### Response

Giống user đăng nhập: **`ExamResultDto`** (điểm, chi tiết câu, `lockView` / `canViewAnswerKey`, v.v.). FE nên **lưu toàn bộ response sau submit** để hiển thị kết quả cho khách.

---

## 4. Xem lại kết quả sau — `GET /exams/result/:examId`

Endpoint này vẫn dùng **`JwtAuthGuard`** (bắt buộc JWT, gắn với profile theo user).

- **Khách (không tài khoản):** không gọi được endpoint này; hãy dùng dữ liệu trả về ngay từ **`POST /exams/submit`** hoặc sau này nếu BE bổ sung API riêng (hiện chưa có trong tài liệu này).

---

## 5. Gợi ý luồng UI

1. Trang đề free cho khách: gọi list/detail **không cần** login (nhớ `password` query nếu đề có khóa).
2. Màn hình nộp bài: nếu không có session → hiện form **Họ tên, Trường, Năm sinh, SĐT** và gửi trong `guestProfile`.
3. Sau submit: render kết quả từ response; không phụ thuộc `GET /exams/result/:examId` cho khách.
4. Nếu user **đăng ký / đăng nhập sau**, việc gộp lịch sử khách với tài khoản là **ngoài phạm vi** API hiện tại (profile khách `user_id` vẫn null cho đến khi có luồng migrate/ghép tay).

---

## 6. Kiểm tra môi trường

Trên database cần đã chạy:

- `20241109000017_add_is_free_to_exam_sets.sql` — cột `is_free`.
- `20241109000018_profiles_nullable_user_id.sql` — `profiles.user_id` cho phép NULL và FK mới.

Nếu thiếu migration, nộp bài khách có thể lỗi ở tầng DB khi insert profile với `user_id` null.
