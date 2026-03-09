# Exam Set Group API Documentation

## Tổng quan

API này cung cấp các chức năng quản lý **Exam Set Group** - các nhóm đề thi (ví dụ: một đợt thi đánh giá năng lực HSA đợt 1, TSA kỳ 1).
Bạn có thể tạo một group mới và gán các Exam Sets (đề thi) sẵn có vào group đó chỉ trong một request.

## Base URL

```
/exams/groups
```

## API Endpoints

### 1. Tạo Exam Set Group mới

**POST** `/exams/groups`

Tạo một group mới và gán danh sách các đề thi vào group này.

#### Request Body

```json
{
  "name": "Đề thi đánh giá năng lực ĐHQGHN đợt 1",
  "description": "Nhóm các môn Toán, Văn, Anh, Khoa học cho đợt thi tháng 3/2026",
  "type": "HSA",
  "examSetIds": [
    "550e8400-e29b-41d4-a716-446655440000",
    "770e8400-e29b-41d4-a716-446655440002"
  ]
}
```

#### Request Parameters

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| name | string | Yes | Tên của nhóm đề thi |
| description | string | No | Mô tả chi tiết về nhóm |
| type | enum | Yes | Loại group (`HSA` hoặc `TSA`) |
| examSetIds | string[] | No | Danh sách các UUID của Exam Set muốn gán vào group này |

#### Lưu ý logic nghiệp vụ:
- Khi gán `examSetIds` vào group, hệ thống sẽ tự động cập nhật trường `type` của từng Exam Set đó khớp với `type` của group.
- Mỗi Exam Set chỉ có thể thuộc về 1 Group duy nhất tại một thời điểm (vì `group_id` nằm trong bảng `exam_sets`).

#### Response

**Status Code:** `201 Created`

```json
{
  "id": "uuid-cua-group-vua-tao",
  "name": "Đề thi đánh giá năng lực ĐHQGHN đợt 1",
  "description": "Nhóm các môn Toán, Văn, Anh, Khoa học cho đợt thi tháng 3/2026",
  "type": "HSA",
  "created_at": "2026-03-09T15:45:00.000Z",
  "updated_at": "2026-03-09T15:45:00.000Z",
  "examSets": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "name": "Toán học - HSA Đợt 1",
      "type": "HSA",
      "subject": 1,
      // ... các trường khác của exam set
    }
  ],
  "userResult": null
}
```

#### Example (cURL)

```bash
curl -X POST http://localhost:3000/exams/groups \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <YOUR_JWT_TOKEN>" \
  -d '{
    "name": "Đề thi HSA 2026",
    "type": "HSA",
    "examSetIds": ["uuid-1", "uuid-2"]
  }'
```

---

---

### 2. Cập nhật Exam Set Group

**PATCH** `/exams/groups/:id`

Cập nhật thông tin của một group và thay đổi danh sách đề thi thành viên.

#### Request Body (All fields optional)

```json
{
  "name": "Tên mới",
  "type": "TSA",
  "examSetIds": ["uuid-moi-1", "uuid-moi-2"]
}
```

- Nếu gửi `type`, hệ thống sẽ cập nhật `type` của group và tất cả đề thi đang thuộc group đó.
- Nếu gửi `examSetIds`, danh sách đề thi hiện tại của group sẽ được ghi đè bằng danh sách mới.

---

### 3. Xóa Exam Set Group

**DELETE** `/exams/groups/:id`

Xóa một group.

- **Lưu ý**: Khi xóa group, các đề thi bên trong **không bị xóa** mà chỉ được trả về trạng thái tự do (`group_id` set về `NULL`).

---

### 4. Lấy danh sách Exam Set Group

**GET** `/exams/groups`

Lấy tất cả các nhóm đề thi hiện có.

#### Query Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| type | string | Lọc theo loại group (`HSA` hoặc `TSA`) |

---

### 5. Lấy chi tiết Exam Set Group theo ID

**GET** `/exams/groups/:id`

Lấy thông tin chi tiết của một nhóm bao gồm tất cả các đề thi con bên trong.

#### Query Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| groupType | number | Lọc các đề thi bên trong theo tổ hợp môn (1: Khoa học/Tự nhiên, 2: Xã hội) |

---

## Authentication

Tất cả các API liên quan đến Group đều yêu cầu JWT Token qua Header:
`Authorization: Bearer <access_token>`
