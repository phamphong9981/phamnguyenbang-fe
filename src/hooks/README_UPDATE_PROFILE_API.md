# User Update Profile API

API này dùng để cập nhật thông tin chung của user đăng nhập, và có thể đổi mật khẩu trong cùng request.

## Endpoint

- Method: `PATCH`
- Path: `/profile`
- Auth: `Bearer <access_token>` (bắt buộc)
- Content-Type: `application/json`

## Request body

Tất cả field đều optional. Nếu gửi đổi mật khẩu thì phải gửi đủ cặp `currentPassword` + `newPassword`.

```json
{
  "fullname": "Nguyen Van A",
  "phone": "0988123456",
  "school": "THPT ABC",
  "class": "12A1",
  "yearOfBirth": 2008,
  "currentPassword": "old-secret",
  "newPassword": "new-secret12"
}
```

### Validation rules

- `newPassword`: từ 8 đến 24 ký tự
- `currentPassword` và `newPassword` phải đi cùng nhau:
  - Có `currentPassword` mà không có `newPassword` -> lỗi `400`
  - Có `newPassword` mà không có `currentPassword` -> lỗi `400`
- `newPassword` phải khác `currentPassword`

## Response

- `200 OK`: trả về thông tin user mới nhất (bao gồm `profile`, không bao gồm `passwordHash` do đã `@Exclude`).

## Error cases

- `401 Unauthorized`: thiếu token hoặc token không hợp lệ
- `404 Not Found`: user không tồn tại
- `400 Bad Request`:
  - Mật khẩu hiện tại sai
  - Thiếu 1 trong 2 field `currentPassword` / `newPassword`
  - `newPassword` trùng `currentPassword`
  - Sai format dữ liệu theo validation

## cURL example

```bash
curl -X PATCH http://localhost:8000/profile \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <access_token>" \
  -d '{
    "fullname":"Nguyen Van A",
    "school":"THPT ABC",
    "currentPassword":"old-secret",
    "newPassword":"new-secret12"
  }'
```
