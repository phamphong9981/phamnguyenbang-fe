# User Avatar API

API upload ảnh đại diện cho user hiện tại (JWT user).

## Endpoint

- Method: `POST`
- Path: `/profile/avatar`
- Auth: `Bearer <access_token>` (bắt buộc)
- Content-Type: `multipart/form-data`
- File field name: `file`

## Validation

- Chỉ chấp nhận mime type: `image/jpeg`, `image/png`, `image/webp`, `image/gif`
- Kích thước tối đa: `5MB`

## Response

- `200 OK`: trả về user object mới nhất (bao gồm `profile.avatarUrl`, `profile.avatarKey`)

## Error cases

- `400 Bad Request`
  - Không gửi file
  - File không đúng định dạng image hợp lệ
- `401 Unauthorized`
  - Thiếu token hoặc token không hợp lệ
- `404 Not Found`
  - User không tồn tại

## Behavior

- Ảnh mới được upload lên R2 trong folder `avatars/`
- Nếu user đã có avatar cũ, hệ thống sẽ lưu avatar mới và xóa file avatar cũ ở R2 (best effort)
- Nếu lưu DB thất bại sau khi upload, hệ thống sẽ cleanup file vừa upload

## cURL example

```bash
curl -X POST http://localhost:8000/profile/avatar \
  -H "Authorization: Bearer <access_token>" \
  -F "file=@/path/to/avatar.png"
```

## Database notes

Cần đảm bảo bảng `profiles` có thêm 2 cột nullable:

- `avatar_url` (`varchar`/`text`)
- `avatar_key` (`varchar`/`text`)

Ví dụ SQL:

```sql
ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS avatar_url text,
  ADD COLUMN IF NOT EXISTS avatar_key text;
```
