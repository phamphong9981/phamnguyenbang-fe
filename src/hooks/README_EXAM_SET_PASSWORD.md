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

Endpoint: `GET /exams/sets`

- Returns each exam item with `hasPassword: boolean`
- Does **not** return raw `password` value

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

Entity `ExamSet.password` uses `select: false`. In list API, service only derives and returns `hasPassword`, never the raw password.
