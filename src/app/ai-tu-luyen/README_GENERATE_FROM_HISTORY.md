# Generate Questions From User History API

## Tổng quan

API này tạo **đề luyện tập cá nhân hoá** cho học sinh bằng AI (OpenAI **gpt-5-mini**) dựa trên **các câu trả lời SAI** mà học sinh đã từng làm.

Hệ thống tổng hợp lỗi từ **hai nguồn**:

1. **Câu hỏi AI sinh ra** mà học sinh trả lời sai (`user_generated_ai_question.is_correct = false`).
2. **Câu hỏi đề thi truyền thống** mà học sinh trả lời sai (`user_answers.is_correct = false` qua `profile_exam`).

Sau đó AI sinh ra 10 câu hỏi mới theo chiến lược **luyện điểm yếu + thử thách**:

- **5 câu đầu (level 1-5)** – Luyện điểm yếu: tương tự kiểu câu học sinh hay sai, các đáp án nhiễu (distractor) bám sát lỗi học sinh từng mắc trong lịch sử.
- **5 câu sau (level 6-10)** – Thử thách: mở rộng và nâng cao trên cùng KC để kiểm tra mức độ nắm vững.

Các câu mới được lưu vào bảng `generated_ai_question` để học sinh có thể tiếp tục submit qua endpoint `/kc/submit-ai-questions`.

## Base URL

```
/kc
```

## Authentication

Bắt buộc gửi `Authorization: Bearer <JWT>`. `userId` được lấy từ token, không nhận từ body.

## Endpoint

### POST `/kc/generate-questions-from-history`

Tạo 10 câu hỏi luyện tập dựa trên các câu trả lời SAI cũ của user.

#### Request Headers

| Header          | Required | Mô tả                              |
| --------------- | -------- | ---------------------------------- |
| `Authorization` | Yes      | `Bearer <JWT>`                     |
| `Content-Type`  | Yes      | `application/json`                 |

#### Request Body

```json
{
  "kc_tag": "KC001.001"
}
```

| Field    | Type   | Required | Mô tả                                                                                              |
| -------- | ------ | -------- | -------------------------------------------------------------------------------------------------- |
| `kc_tag` | string | No       | Nếu có: chỉ lấy câu sai trong KC này. Nếu không: tự suy KC từ câu sai gần nhất của học sinh.       |

#### Response — 201 Created

```json
{
  "questions": [
    {
      "id": "uuid",
      "level": 1,
      "question": "Tính giới hạn $\\lim_{x \\to 0} \\frac{\\sin x}{x}$",
      "choices": {
        "A": "0",
        "B": "1",
        "C": "$\\infty$",
        "D": "Không tồn tại"
      }
    }
  ],
  "kc_tag": "KC001.001",
  "kc_description": "Giới hạn của hàm số tại một điểm",
  "total_questions": 10
}
```

> **Lưu ý:** Response **không trả về** `answer` và `explanation` để tránh lộ đáp án. Đáp án và giải thích chỉ được trả về sau khi học sinh submit qua `POST /kc/submit-ai-questions`.

| Field             | Type                          | Mô tả                                        |
| ----------------- | ----------------------------- | -------------------------------------------- |
| `questions`       | `GeneratedQuestionResponse[]` | 10 câu hỏi đã sinh và lưu vào DB             |
| `questions[].id`  | string (UUID)                 | ID của câu hỏi trong `generated_ai_question` |
| `questions[].level` | number (1-10)               | Độ khó (1-5 luyện yếu, 6-10 thử thách)       |
| `questions[].question` | string                   | Nội dung câu hỏi (hỗ trợ KaTeX)              |
| `questions[].choices` | object                    | 4 lựa chọn `{A, B, C, D}` (hỗ trợ KaTeX)     |
| `kc_tag`          | string                        | KC mục tiêu của bộ đề                        |
| `kc_description`  | string                        | Mô tả KC (Tiếng Việt)                        |
| `total_questions` | number                        | Tổng số câu (luôn 10)                        |

#### Error Responses

| Status | Mô tả                                                                                  |
| ------ | -------------------------------------------------------------------------------------- |
| 401    | JWT không hợp lệ hoặc thiếu                                                            |
| 404    | Không tìm thấy câu trả lời sai nào của user (hoặc `kc_tag` truyền vào không tồn tại)   |
| 500    | OpenAI API lỗi / trả về JSON không hợp lệ                                              |

## Cách hoạt động (Flow)

```
Client ──POST /kc/generate-questions-from-history (kc_tag?)──► KCController
                                                                    │
                                                                    ▼
                                       UserKCProgressService.generateQuestionsFromUserHistory
                                                                    │
                          ┌─────────────────────────────────────────┼──────────────────────────────────────┐
                          ▼                                         ▼                                      ▼
        Query wrong UserGeneratedAIQuestion         Query wrong UserAnswer (qua Profile)    Suy ra targetKCTag
        (is_correct = false, filter kc_tag)         (is_correct = false, filter kc_tag      (từ kcTag hoặc câu sai)
                                                     qua question_kc / sub_question_kc)
                          │                                         │                                      │
                          └─────────────────────────┬───────────────┘                                      │
                                                    ▼                                                      │
                                  Build prompt context (tối đa 8 + 8 câu sai)                              │
                                                    │                                                      │
                                                    ▼                                                      │
                            OpenAIService.generateQuestions(prompt, 'gpt-5-mini')                          │
                                                    │                                                      │
                                                    ▼                                                      │
                              Normalize KaTeX + Validate JSON schema (10 câu)                              │
                                                    │                                                      │
                                                    ▼                                                      │
                              INSERT vào generated_ai_question (10 rows)                                   │
                                                    │                                                      │
                                                    ▼                                                      ▼
                                         Return GenerateQuestionsResponseDto (bỏ answer/explanation)
```

### Chi tiết bước truy vấn câu sai

**Câu AI sai** (`UserGeneratedAIQuestion`):

```sql
SELECT uaq.*, gaq.*
FROM user_generated_ai_question uaq
INNER JOIN generated_ai_question gaq ON uaq.generated_ai_question_id = gaq.id
WHERE uaq.user_id = :userId
  AND uaq.is_correct = false
  [AND gaq.kc_tag = :kcTag]
ORDER BY uaq.created_at DESC
LIMIT 15;
```

**Câu đề thi sai** (`UserAnswer` → qua `ProfileExam.profile_id` → `Profile.user_id`):

```sql
SELECT ua.*, q.*, sq.*
FROM user_answers ua
INNER JOIN profile_exam pe ON ua.profile_exam_id = pe.id
LEFT JOIN questions q ON ua.question_id = q.id
LEFT JOIN sub_questions sq ON ua.sub_question_id = sq.id
WHERE pe.profile_id = :profileId
  AND ua.is_correct = false
  [AND (
        EXISTS (SELECT 1 FROM question_kc qkc
                WHERE qkc.question_id = ua.question_id
                  AND qkc.kc_tag = :kcTag)
     OR EXISTS (SELECT 1 FROM sub_question_kc sqkc
                WHERE sqkc.sub_question_id = ua.sub_question_id
                  AND sqkc.kc_tag = :kcTag)
      )]
ORDER BY ua.created_at DESC
LIMIT 15;
```

Tối đa **8 câu AI sai gần nhất** + **8 câu đề thi sai gần nhất** được đưa vào prompt làm context.

### Prompt template (Vietnamese)

```
Dựa trên kiến thức (KC): "<kc.desc_vi>"

## Lịch sử câu trả lời SAI của học sinh (để phân tích lỗi):

1. [AI lv3] <nội dung câu hỏi>
   Đáp án đúng: B. <nội dung lựa chọn B>
   Học sinh chọn: A
   Giải thích: <explanation>

2. [Đề thi] <nội dung câu hỏi>
   Đáp án đúng: B
   Học sinh chọn: D
   Giải thích: <explanation>
...

Hãy tạo 10 câu hỏi trắc nghiệm cá nhân hoá để học sinh luyện tập, dựa trên các lỗi đã mắc ở trên:
- 5 câu đầu (level 1-5) LUYỆN ĐIỂM YẾU: tương tự kiểu câu học sinh sai...
- 5 câu sau (level 6-10) THỬ THÁCH: mở rộng và nâng cao...
```

## Ví dụ sử dụng

### Trường hợp 1: Luyện tập theo KC cụ thể

```bash
curl -X POST http://localhost:3000/kc/generate-questions-from-history \
  -H "Authorization: Bearer <JWT>" \
  -H "Content-Type: application/json" \
  -d '{"kc_tag": "KC001.001"}'
```

→ Lọc câu sai trong KC `KC001.001`. Nếu không có câu sai nào trong KC này → `404`.

### Trường hợp 2: Để hệ thống tự chọn KC

```bash
curl -X POST http://localhost:3000/kc/generate-questions-from-history \
  -H "Authorization: Bearer <JWT>" \
  -H "Content-Type: application/json" \
  -d '{}'
```

→ Lấy toàn bộ câu sai gần nhất, hệ thống tự suy `targetKCTag` từ câu sai đầu tiên (AI ưu tiên, fallback sang đề thi).

### Bước tiếp theo – submit để biết đáp án

Sau khi nhận response, client lưu các `questions[].id` và gửi lên endpoint submit:

```bash
curl -X POST http://localhost:3000/kc/submit-ai-questions \
  -H "Authorization: Bearer <JWT>" \
  -H "Content-Type: application/json" \
  -d '{
    "answers": [
      { "generatedQuestionId": "<uuid>", "userAnswer": ["B"] }
    ]
  }'
```

Lúc này mới nhận được đáp án đúng, giải thích và cập nhật mastery cho KC.

## Phụ thuộc / Side effects

- **OpenAI**: gọi model `gpt-5-mini`, timeout mặc định 120s (cấu hình qua biến môi trường `OPENAI_TIMEOUT_MS`).
- **DB writes**: INSERT 10 dòng vào `generated_ai_question` mỗi lần gọi thành công.
- **Không** cập nhật `user_kc_progress` ở bước này – mastery chỉ thay đổi khi học sinh submit câu trả lời sau đó.

## So sánh với `/kc/generate-questions`

| Tiêu chí          | `/kc/generate-questions`           | `/kc/generate-questions-from-history` (mới) |
| ----------------- | ---------------------------------- | ------------------------------------------- |
| Auth              | Public                             | Yêu cầu JWT                                 |
| Đầu vào           | `kc_tag` bắt buộc                  | `kc_tag` tuỳ chọn                           |
| Nguồn context     | Các câu hỏi mẫu trong KC (chung)   | Câu trả lời SAI của chính user (cá nhân)    |
| Model OpenAI      | `gpt-4o-mini`                      | `gpt-5-mini`                                |
| Mục đích          | Tạo đề tổng quát cho KC            | Cá nhân hoá – luyện điểm yếu của user       |

## Files liên quan

- Controller: [`src/exams/kc.controller.ts`](./kc.controller.ts) — handler `generateQuestionsFromHistory`
- Service: [`src/exams/services/user-kc-progress.service.ts`](./services/user-kc-progress.service.ts) — method `generateQuestionsFromUserHistory`
- DTO: [`src/exams/dto/generate-questions-from-history.dto.ts`](./dto/generate-questions-from-history.dto.ts)
- OpenAI client: [`src/exams/services/openai.service.ts`](./services/openai.service.ts) — `generateQuestions(prompt, model)`
- Entities: `UserGeneratedAIQuestion`, `UserAnswer`, `GeneratedAIQuestion`, `KCNode`, `Profile`
