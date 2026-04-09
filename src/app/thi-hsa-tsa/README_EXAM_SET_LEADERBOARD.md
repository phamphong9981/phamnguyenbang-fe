# Leaderboard theo từng đề thi (`exam set`)

API trả về **bảng xếp hạng trên một đề cụ thể** (điểm và thời gian lấy từ bài nộp hiện tại trong `profile_exams`).

## Endpoint

`GET /exams/sets/:id/leaderboard`

- **`:id`**: UUID của exam set (cùng `id` với `GET /exams/sets/:id` và `examId` khi submit).

### Query

| Tham số     | Bắt buộc | Mô tả |
|------------|----------|--------|
| `password` | Không    | Giống chi tiết đề: nếu đề có mật khẩu, phải gửi đúng giá trị. |
| `limit`    | Không    | Số hạng trả về. Mặc định **10**, tối thiểu 1, tối đa **100**. |

### Header

- **`Authorization: Bearer <token>`** (tùy chọn):  
  - **Không gửi JWT**: chỉ được gọi với đề **`isFree === true`** (giống luồng khách).  
  - **Có JWT**: được xem leaderboard của mọi đề (vẫn phải thỏa `password` nếu đề có khóa).

---

## Quy tắc xếp hạng

1. **`totalPoints` giảm dần** (điểm cao hơn đứng trên).
2. Cùng điểm: **`totalTime` tăng dần** (làm bài **ít giây hơn** → xếp trên).
3. Vẫn hòa: **`submittedAt` (`updatedAt`)** sớm hơn đứng trên.

Mỗi **profile** chỉ có **một bản ghi** nộp bài cho mỗi đề; **nộp lại** cập nhật cùng bản ghi → leaderboard phản ánh **lần chấm điểm mới nhất**.

---

## Response (`ExamLeaderboardResponseDto`)

JSON dùng **camelCase**.

| Field | Kiểu | Mô tả |
|-------|------|--------|
| `examId` | string (UUID) | ID đề |
| `examName` | string | Tên đề |
| `totalParticipants` | number | Số profile đã có bài nộp cho đề này (không chỉ `entries.length`) |
| `entries` | mảng | Danh sách xếp hạng (tối đa `limit` phần tử) |

### Một phần tử `entries` (`ExamLeaderboardEntryDto`)

| Field | Mô tả |
|-------|--------|
| `rank` | 1 = cao nhất trong tập trả về |
| `profileId` | UUID profile (tài khoản hoặc guest) |
| `fullname` | Họ tên hiển thị |
| `school` | Trường |
| `class` | Lớp; có thể `null` (thường với profile khách) |
| `totalPoints` | Điểm trên đề này |
| `totalTime` | Thời gian làm (giây) |
| `submittedAt` | ISO datetime — lần cập nhật sau submit/resubmit |

---

## Lỗi HTTP (tóm tắt)

| Mã | Tình huống |
|----|------------|
| **404** | Sai ID, đề không tồn tại, hoặc đã quá `deadline`. |
| **401** | Không JWT và đề **không** `isFree`. |
| **400** | Đề có password nhưng thiếu/sai `?password=`. |

---

## Ví dụ

```http
GET /exams/sets/550e8400-e29b-41d4-a716-446655440000/leaderboard?limit=20
```

```http
GET /exams/sets/550e8400-e29b-41d4-a716-446655440000/leaderboard?password=secret&limit=10
Authorization: Bearer <optional>
```

---

## So sánh nhanh với `GET /exams/leaderboard?type=…`

- **`GET /exams/leaderboard`**: xếp hạng theo **lớp (10/11/12)** hoặc **nhóm HSA/TSA** — tổng hợp nhiều bài, metric khác (`totalExams`, `averageScore`, …).
- **`GET /exams/sets/:id/leaderboard`**: chỉ **một đề**, xếp theo **điểm + thời gian** trên đề đó.

FE có thể dùng API mới cho màn “Top đề X”; dùng API cũ cho màn “Top khối / top HSA-TSA”.
