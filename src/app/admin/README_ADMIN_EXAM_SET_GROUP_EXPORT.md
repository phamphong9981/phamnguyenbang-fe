# Admin — Xuất Excel bài nộp đề gộp

## Endpoint

**GET** `/admin/exam-set-groups/:groupId/export-excel`

- **Auth:** JWT + `AdminGuard`
- **Response:** file `.xlsx` (download)

### Ví dụ

```bash
curl -o ket-qua.xlsx \
  -H "Authorization: Bearer <ADMIN_TOKEN>" \
  "http://localhost:3000/admin/exam-set-groups/<GROUP_UUID>/export-excel"
```

## Cấu trúc file Excel

Một workbook gồm **3 sheet** (môn TSA đề gộp):

| Sheet | `subject` (exam_sets) |
|-------|------------------------|
| Toán | `1` (MATH) |
| Văn | `3` (LITERATURE) |
| Khoa học | `9` (SCIENCE) |

Mỗi sheet: **một dòng cho mỗi câu đã nộp** của mỗi học sinh trong nhóm đề đó.

| Cột | Mô tả |
|-----|--------|
| STT | Thứ tự dòng trong sheet |
| Họ tên | `profile.fullname` |
| SĐT | `profile.phone` |
| Lớp | `profile.class` |
| Ngày nộp | Thời điểm tạo `user_exam_set_group` |
| Thứ tự câu | `question_order` trong đề môn tương ứng |
| Phần | `section` câu hỏi |
| Nội dung câu | Text (đã bỏ HTML) |
| Đáp án học sinh | Mảng đáp án, nối bằng `, ` |
| Đúng/Sai | `Đúng` / `Sai` |
| Thời gian (giây) | `completed_in_seconds` (nếu client gửi khi nộp) |
| Điểm | `points_earned` |

Câu trong **câu nhóm** (sub-question): mỗi câu con một dòng; thời gian và đúng/sai theo từng câu con.

## Thời gian từng câu khi nộp đề gộp

Khi học sinh nộp **POST** `/exams/groups/submit`, trong mỗi `exams[].answers[]` có thể gửi thêm (giống nộp đề lẻ):

```json
{
  "groupId": "...",
  "exams": [
    {
      "examId": "...",
      "totalTime": 3600,
      "answers": [
        {
          "questionId": "...",
          "selectedAnswer": ["A"],
          "completedInSeconds": 42
        }
      ]
    }
  ]
}
```

Lưu vào `user_exam_set_group_answer.completed_in_seconds`.

## Migration

```bash
yarn migration
```

File: `20250604000002_add_completed_in_seconds_to_user_exam_set_group_answer.sql`

## Phụ thuộc

- `exceljs` — tạo workbook trong `ExamSetGroupService.exportGroupSubmissionsExcel`

## Lưu ý

- Chỉ xuất câu thuộc đề trong group có `subject` là Toán / Văn / Khoa học.
- Nếu chưa có bài nộp, file vẫn có 3 sheet chỉ với hàng tiêu đề.
- Bài nộp cũ (trước khi client gửi `completedInSeconds`) để trống cột thời gian.
