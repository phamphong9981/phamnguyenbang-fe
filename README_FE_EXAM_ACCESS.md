# Hướng dẫn FE — Quyền truy cập bộ đề (cập nhật mới)

Tài liệu này mô tả logic **mới** khi học sinh xem danh sách / mở bộ đề. FE nên đọc trước khi tích hợp màn hình danh sách đề, chi tiết đề và admin quản lý user.

---

## Tóm tắt nhanh

| Đối tượng | Hành vi mới |
|-----------|-------------|
| **Guest** (không JWT) | Chỉ thấy đề `isFree = true` (không đổi) |
| **Học sinh đăng nhập** | Chỉ thấy đề thỏa **lớp** + **loại đề được phép** + **quyền truy cập bộ đề** |
| **Admin** | Thấy mọi đề (bỏ lọc loại đề & quyền; vẫn có thể lọc bằng query) |

**Breaking change tiềm ẩn:** Danh sách `GET /exams/sets` với JWT có thể **ít item hơn** trước đây — BE đã **ẩn** đề không đủ quyền thay vì trả hết rồi để FE tự lọc.

---

## 1. Loại đề (`ExamSetType`)

Mỗi bộ đề có field `type`:

| Giá trị API | Ý nghĩa |
|-------------|---------|
| `"HSA"` | Đề HSA |
| `"TSA"` | Đề TSA |
| `"chapter"` | Đề chương (chú ý: **chữ thường**, không phải `"CHAPTER"`) |

Query lọc danh sách: `GET /exams/sets?type=HSA` (hoặc `TSA`, `chapter`).

---

## 2. Cấu hình trên User — `accessibleExamTypes`

Mỗi tài khoản học sinh có danh sách **loại đề được phép truy cập**.

- **Cột DB:** `users.accessible_exam_types` (`text[]`)
- **Mặc định:** `["HSA", "TSA", "chapter"]` — cả 3 loại
- **Admin chỉnh:** `PATCH /admin/users/:id`

```json
{
  "accessibleExamTypes": ["HSA", "chapter"]
}
```

`GET /admin/users` trả thêm field `accessibleExamTypes`.

### FE cần biết

- Học sinh **mới / chưa chỉnh** → coi như được cả 3 loại.
- Nếu user chỉ có `["HSA"]` → **không** thấy đề `TSA` hoặc `chapter` trong danh sách, và **không** mở được chi tiết (`403`).
- JWT login **chưa** chứa `accessibleExamTypes` — muốn hiển thị tab HSA/TSA/Chapter theo quyền, FE lấy từ:
  - Admin API (màn admin), hoặc
  - Suy ra từ danh sách `GET /exams/sets` (chỉ còn loại được phép), hoặc
  - Yêu cầu BE bổ sung endpoint profile sau này.

---

## 3. Cấu hình trên ExamSet — cờ truy cập

Mỗi bộ đề có 3 cờ (ngoài `type`):

| Field | Default | Ý nghĩa |
|-------|---------|---------|
| `isFree` | `false` | Guest + mọi user đều được (nếu còn thỏa loại đề & lớp) |
| `isPremiumAccessible` | `true` | Học sinh **đã đăng nhập** (trung tâm) có thể truy cập |
| `isCourseAccessible` | `false` | Học sinh có **enrollment khóa online** chứa đề này mới được |

Admin cập nhật qua `PATCH /exams/sets/:id`:

```json
{
  "isPremiumAccessible": true,
  "isCourseAccessible": false
}
```

### Ma trận ý nghĩa (ví dụ)

| Loại đề | `isFree` | `isPremiumAccessible` | `isCourseAccessible` | Ai thấy được (học sinh thường) |
|---------|----------|------------------------|----------------------|--------------------------------|
| Đề free | `true` | - | - | Mọi người (kể cả guest) |
| Đề trung tâm | `false` | `true` | `false` | User đăng nhập + đúng `accessibleExamTypes` + đúng lớp |
| Đề online | `false` | `false` | `true` | User có enrollment + đúng loại đề + lớp |
| Đề chung | `false` | `true` | `true` | Premium **hoặc** có enrollment |

Quyền là **OR**: chỉ cần **một** kênh (`isFree` / premium / course) là đủ.

---

## 4. `GET /exams/sets` — Danh sách bộ đề

**Endpoint:** `GET /exams/sets`  
**Auth:** `OptionalJwtAuthGuard` (JWT tùy chọn)

### Guest (không gửi `Authorization`)

- Chỉ đề `isFree = true`
- Không lọc lớp
- `hasCourseAccess: false`
- `userStatus` rỗng (chưa làm bài)

### User đăng nhập (có JWT)

BE lọc **server-side**. Một đề chỉ có trong response khi **đồng thời**:

1. **Lớp**
   - User không có `class` → chỉ đề có `class = null`
   - User có `class` → đề `class = null` **hoặc** `exam.class` chứa class user (không phân biệt hoa thường)
2. **Loại đề** — `exam.type` ∈ `user.accessibleExamTypes` (mặc định cả 3)
3. **Quyền bộ đề** — ít nhất một:
   - `isFree === true`
   - `isPremiumAccessible === true` (đã login)
   - `isCourseAccessible === true` **và** user có enrollment còn hạn gắn đề đó

### Admin

- Bỏ qua bước 2 và 3 → thấy tất cả đề (theo query filter)
- Có thể nhận `password` plaintext nếu là admin username

### Response mỗi item (bổ sung / quan trọng)

```json
{
  "id": "uuid",
  "type": "HSA",
  "name": "...",
  "isFree": false,
  "isPremiumAccessible": true,
  "isCourseAccessible": false,
  "class": null,
  "status": "available",
  "hasPassword": false,
  "hasCourseAccess": true,
  "userStatus": {
    "isCompleted": false,
    "submittedAt": null,
    "totalPoints": 0,
    "totalTime": 0,
    "score": 0
  }
}
```

#### `hasCourseAccess` — FE vẫn cần đọc

| `isCourseAccessible` | User có enrollment? | `hasCourseAccess` |
|----------------------|---------------------|-------------------|
| `false` | - | `true` (không áp dụng khóa online) |
| `true` | Có | `true` |
| `true` | Không | `false` |

**Lưu ý:** Sau bản cập nhật, đề **course-only** mà user không enrollment sẽ **không còn** trong list → `hasCourseAccess: false` chủ yếu cho đề **vừa premium vừa course** (user vào list qua premium nhưng chưa mua khóa).

FE **không cần** tự lọc lại toàn bộ danh sách theo quyền — BE đã ẩn. Vẫn dùng `hasCourseAccess` cho UX chi tiết (badge, tooltip).

### `subQuestions` trong list

Câu con được sort theo `sort_order` ASC (xem `README_QUESTION_SORT_ORDER.md`).

---

## 5. `GET /exams/sets/:id` — Mở chi tiết đề

Cùng quy tắc quyền như danh sách.

| Tình huống | HTTP |
|------------|------|
| Guest, đề không free | `401` |
| User không đủ loại đề / quyền | `403` — *"Bạn không có quyền truy cập bộ đề này (loại đề hoặc gói truy cập không phù hợp)"* |
| Đề có password, sai / thiếu password | `400` |
| Hết `deadline` | `404` |

FE: không nên deep-link thẳng vào đề mà không kiểm tra list trước; nếu `403` → redirect về danh sách + thông báo.

---

## 6. Khóa học online (liên quan)

- `GET /online-courses/my-enrollments` — khóa đã mua + đề gắn khóa
- `GET /online-courses/accessible-exam-ids` — danh sách UUID đề mở qua enrollment

Dùng kết hợp với list đề để hiển thị “Đề khóa online” / “Đã mua khóa”.

---

## 7. Checklist tích hợp FE

### Màn danh sách đề

- [ ] Gửi JWT nếu user đã login (để nhận đủ đề premium / đúng lớp)
- [ ] Không giả định “login là thấy hết đề”
- [ ] Tab/filter `type=HSA|TSA|chapter` — ẩn tab nếu admin đã thu hẹp `accessibleExamTypes` (lấy từ admin hoặc thử gọi API)
- [ ] Guest: chỉ hiện flow đề `isFree`

### Màn chi tiết / làm bài

- [ ] Xử lý `401`, `403`, `404` khi mở đề
- [ ] Password đề: query `?password=` như hiện tại

### Admin user

- [ ] Form sửa user: multi-select `accessibleExamTypes` với 3 option `HSA`, `TSA`, `chapter`
- [ ] Mặc định chọn cả 3 khi tạo user mới

### Admin exam set

- [ ] Form sửa đề: toggle `isFree`, `isPremiumAccessible`, `isCourseAccessible`

---

## 8. Migration & deploy

Chạy migration trước khi FE test trên môi trường mới:

```
20250604000004_add_accessible_exam_types_to_users.sql
```

User cũ tự có default `['HSA','TSA','chapter']` — không cần migrate tay từng user.

---

## 9. Tài liệu liên quan

| File | Nội dung |
|------|----------|
| `README_FREE_AND_GUEST_EXAMS.md` | Guest & đề free |
| `src/online-courses/README_ONLINE_COURSE_ENROLLMENT.md` | Khóa online & enrollment |
| `README_QUESTION_SORT_ORDER.md` | Thứ tự câu con `sort_order` |
| `README_USER_ANSWER_COMPLETED_TIME.md` | `completedInSeconds` khi nộp bài |

---

## 10. Ví dụ flow

**Học sinh A:** `accessibleExamTypes: ["HSA", "TSA"]`, `class: "12A1"`, đã login.

- Thấy đề HSA/TSA, `class` null hoặc chứa `12A1`, và (`isFree` hoặc `isPremiumAccessible` hoặc có enrollment với đề course).
- **Không** thấy đề `type: "chapter"` dù có quyền premium.

**Học sinh B:** chỉ mua khóa online, `accessibleExamTypes` mặc định cả 3.

- Thấy đề `isCourseAccessible: true` nằm trong khóa đã đăng ký.
- Thấy đề `isPremiumAccessible: true` (đã login) kể cả không mua khóa.
- Không thấy đề chỉ `isPremiumAccessible: false` + `isCourseAccessible: true` mà **không** có trong enrollment.
