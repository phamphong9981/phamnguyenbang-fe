# Thời gian hoàn thành từng câu (`completedInSeconds`)

## Tóm tắt

Bảng `user_answers` có thêm cột optional **`completed_in_seconds`** (integer, nullable): thời gian học sinh dành cho **một câu** (đơn vị: **giây**), do client gửi khi nộp bài.

- **`totalTime`** trên `profile_exams` / `SubmitExamDto`: tổng thời gian cả bài.
- **`completedInSeconds`** trên từng `answers[]` / `user_answers`: thời gian từng câu (tùy chọn).

## Migration

Chạy migration:

`src/database/migrations/20250604000001_add_completed_in_seconds_to_user_answers.sql`

```sql
ALTER TABLE user_answers
ADD COLUMN IF NOT EXISTS completed_in_seconds INTEGER NULL;
```

## API nộp bài (`POST` submit exam)

Trong mỗi phần tử `answers`, có thể thêm field optional:

```json
{
  "examId": "uuid",
  "totalTime": 3600,
  "answers": [
    {
      "questionId": "uuid-câu-gốc-hoặc-id-câu-con",
      "selectedAnswer": ["A"],
      "completedInSeconds": 45
    }
  ]
}
```

- Không gửi `completedInSeconds` → lưu `NULL` trong DB, response không có field (hoặc `undefined`).
- Giá trị phải là số nguyên ≥ 0 (`@Min(0)`).

### Câu nhóm (sub-questions)

Mỗi **câu con** (leaf) nên gửi một entry trong `answers` với `questionId` tương ứng (format hiện tại: id có chứa id câu con). `completedInSeconds` gắn với entry đó; mỗi bản ghi `user_answers` cho câu con lưu riêng thời gian.

## API xem kết quả

`ExamResultService.getExamResult` trả `questionDetails` kèm `completedInSeconds` khi có trong DB:

- Câu đơn: `completedInSeconds` ở object câu chính.
- Câu nhóm: `completedInSeconds` trong từng phần tử `subQuestions[]`.

Response ngay sau nộp bài (`ExamSubmissionService.submitExam`) cũng có cùng cấu trúc qua `questionDetails`.

## Entity

`UserAnswer.completedInSeconds` ↔ cột `completed_in_seconds`.

## File đã chỉnh

| File | Thay đổi |
|------|----------|
| `entities/user-answer.entity.ts` | Cột `completedInSeconds` |
| `dto/submit-exam.dto.ts` | `QuestionAnswerDto`, `QuestionDetailDto`, `subQuestions` |
| `services/exam-submission.service.ts` | Lưu & trả về khi chấm điểm |
| `services/exam-result.service.ts` | Đọc kết quả đã lưu |
| `database/migrations/20250604000001_...sql` | DDL |

## Tương thích ngược

Client cũ không gửi `completedInSeconds` → hành vi như trước; cột DB `NULL`. Không breaking change cho contract hiện tại.
