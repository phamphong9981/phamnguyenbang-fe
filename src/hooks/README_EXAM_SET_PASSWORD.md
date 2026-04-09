# Exam Set Password Protection

## Overview

This update adds optional password protection for exam detail retrieval via `GET /exams/sets/:id`.

- New DB column: `exam_sets.password`
- If `password` is `NULL` or empty, exam behaves as public
- If `password` is set, caller must provide query param `password`
- `GET /exams/sets` now returns `hasPassword` so clients know when to prompt for password

## Migration

Run migration: `20241109000016_add_password_to_exam_sets.sql`

```sql
ALTER TABLE exam_sets ADD COLUMN IF NOT EXISTS password VARCHAR(255) NULL;
```

## API Behavior

### Admin vs non-admin

Admin is determined the same way as `AdminGuard`: JWT user’s `username` must appear in `ADMIN_USERNAMES` (comma-separated; default `admin`).

### Endpoint: `GET /exams/sets`

- Each item includes `hasPassword: boolean`.
- **Non-admin:** raw `password` is **not** returned.
- **Admin** (valid JWT, admin username): each item also includes `password` (string or `null`) — the stored value for that exam set.

### Chapter / subchapter trees

- `GET /chapter-exam-sets`, `GET /chapter-exam-sets/:id`: JWT required; if the user is admin, nested `examSets[]` include `password` as above.
- `GET /chapter-exam-sets/sub-chapter-exam-sets`, `GET /chapter-exam-sets/sub-chapter-exam-sets/:id`: optional JWT (`OptionalJwtAuthGuard`). If the request carries a valid admin JWT, nested `examSets[]` include `password`.

Endpoint: `GET /exams/sets/:id`

### Public exam (password null/empty)

Request:

```http
GET /exams/sets/<examId>
```

Response: `200 OK` with full exam detail.

### Protected exam (password is set)

Request with password:

```http
GET /exams/sets/<examId>?password=my-secret
```

Response: `200 OK` with full exam detail.

Missing password:

- Response: `401 Unauthorized`
- Message: `Password is required to access this exam set`

Wrong password:

- Response: `403 Forbidden`
- Message: `Invalid exam password`

## Create/Update exam set

Password can be set through these DTO fields:

- `CreateExamSetDto.password?: string`
- `UploadExamSetDto.password?: string`
- `UpdateExamSetDto.password?: string`

Normalization rules in service:

- Input is trimmed before storing
- Empty string is saved as `NULL` (disable protection)

## Security note

Entity `ExamSet.password` uses `select: false`. APIs load it only when needed; raw `password` is included **only** for admin callers as described above.
