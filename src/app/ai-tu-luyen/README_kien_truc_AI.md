# Hệ thống AI cho LMS luyện thi HSA / TSA — Tài liệu kiến trúc

> Tài liệu này ghi lại các quyết định thiết kế đã thống nhất và hướng dẫn xây dựng
> tầng AI cho LMS môn Toán (luyện thi Đánh giá năng lực ĐHQGHN — HSA và Đánh giá
> tư duy ĐHBK Hà Nội — TSA). Dùng làm nguồn tham chiếu chung cho cả đội.

---

## 1. Bối cảnh và mục tiêu

LMS hiện đã có: tạo đề, học sinh làm đề, lưu kết quả và trạng thái đúng/sai từng câu.
Mục tiêu là bổ sung ba năng lực AI xếp chồng lên nhau:

1. **Phân loại câu hỏi** — gắn mỗi câu vào cây kiến thức (KC) chuẩn.
2. **Đánh giá điểm yếu** — từ dữ liệu làm bài, chỉ ra học sinh hổng ở đâu.
3. **Luyện đề thích ứng** — sinh/chọn đề cá nhân hóa để lấp lỗ hổng.

Ngân hàng câu hỏi hiện dưới 1.000 câu, nội dung lưu dạng LaTeX/MathML (không phải ảnh),
nên dùng được model ngôn ngữ thuần, chi phí thấp.

**Stack:** NestJS / Node.js · PostgreSQL (có `ltree`, `pgvector`) · TypeORM.

---

## 2. Nguyên tắc cốt lõi

Đây là tư tưởng chi phối mọi quyết định kỹ thuật phía sau. Nắm được phần này thì
các lựa chọn còn lại tự sáng tỏ.

**Con người làm chủ danh mục, AI chỉ gán vào danh mục có sẵn.** Mọi taxonomy
(cây KC, sau này là danh mục dạng đề) đều do con người định nghĩa từ nguồn chuẩn.
AI không được tự sinh nhãn mới — nó bị khóa trong tập nhãn đóng (closed taxonomy).
Việc tách bạch hai thao tác này là cốt lõi:

- *Định nghĩa danh mục* (có những khái niệm nào): con người làm, một lần, từ văn bản chuẩn.
- *Gán câu vào danh mục* (câu này thuộc nhãn nào): AI làm, lặp cho mỗi câu, có giáo viên duyệt.

**Dữ liệu nền phải sạch trước khi xây tầng trên.** Module 2 và 3 chỉ đáng tin khi
phân loại ở Module 1 chính xác. Quy mô dưới 1.000 câu là một lợi thế: đủ nhỏ để
giáo viên duyệt gần như toàn bộ một lần, đạt chất lượng nền cao. Không vội tự động
hóa hoàn toàn ở giai đoạn nền.

**Giữ dữ liệu thô, đừng khóa cửa tương lai.** Luôn lưu đầy đủ nội dung câu hỏi,
đáp án, lời giải, và đặc biệt là **lịch sử làm bài chi tiết đến từng câu** (đúng/sai,
thời gian, đáp án học sinh chọn). Một trục phân tích bỏ đi hôm nay vẫn thêm lại được
sau — miễn dữ liệu nền còn nguyên. Cái không tái tạo được là hành vi học sinh đã mất.

**Thận trọng với AI sinh nội dung toán.** AI giỏi phân loại và diễn giải, nhưng
kém tin cậy khi tự tạo câu hỏi toán mới và tự khẳng định đáp án. Vì vậy Module 3
giai đoạn đầu chỉ *chọn lọc câu từ ngân hàng đã duyệt*, chưa sinh câu mới.

---

## 3. Ba module và thứ tự triển khai

Thứ tự bắt buộc, vì mỗi module là nền cho module sau:

| Thứ tự | Module | Bản chất | Vai trò của AI |
|--------|--------|----------|----------------|
| 1 | Phân loại câu hỏi | Gán KC + mức nhận thức | Đọc hiểu nội dung, gán vào cây đóng |
| 2 | Đánh giá điểm yếu | Thống kê trên cây KC | Diễn giải số liệu thành nhận xét |
| 3 | Luyện đề thích ứng | Chọn câu theo lỗ hổng | Truy đồ thị phụ thuộc, chọn câu phù hợp |

---

## 4. Hai trục phân loại: KC và dạng đề

Một câu hỏi có thể được mổ xẻ theo hai trục độc lập, trả lời hai câu hỏi khác nhau:

- **KC (Knowledge Component)** — "học sinh cần *hiểu* kiến thức gì". Là thứ nằm trong
  đầu học sinh. Có cấu trúc *cây phân cấp* và *quan hệ phụ thuộc* (KC này cần KC kia
  làm nền). Nguồn chuẩn: **Chương trình GDPT 2018**.

- **Dạng đề (Question Type)** — "câu hỏi *hỏi theo khuôn* nào". Là thứ nằm trên tờ đề.
  Cấu trúc *phẳng*, không có quan hệ phụ thuộc. Nguồn: đúc kết từ đề minh họa HSA/TSA
  (không có văn bản nào của Bộ liệt kê sẵn).

Hai trục cần thiết vì cùng một KC có thể hỏi theo nhiều dạng (em hiểu "tính đơn điệu"
nhưng vẫn sai dạng "đọc bảng biến thiên"), và cùng một dạng có thể chạm nhiều KC.
Gộp một trục sẽ triệt tiêu khả năng phân tích chéo này.

### Quyết định: tạm gác trục dạng đề

Giai đoạn đầu **chỉ triển khai trục KC**, tạm gác trục dạng đề để giảm độ phức tạp.
Đây là quyết định *có thể đảo ngược* vì:

- Dạng đề suy được từ nội dung câu hỏi bất cứ lúc nào — chỉ cần nội dung, đáp án,
  lời giải còn nguyên.
- Bù lại phần nào: thêm ngay trường `cognitive_level` (NB/TH/VD/VDC) vào `QuestionKC`.
  Đây là trục nhẹ nhất của "dạng đề" (mức độ khó), gần như miễn phí khi AI đã đọc câu,
  và cho phép phân tích "em yếu *mức vận dụng cao* của KC này" thay vì chỉ "yếu KC này".

Khi cần phân tích sâu hơn về kiểu hỏi, dựng danh mục dạng đề (closed taxonomy, đúc kết
từ đề minh họa) và chạy AI gán lên nền dữ liệu cũ — không mất gì.

---

## 5. Cây KC — nguồn, cấu trúc, cách dùng

### Nguồn chuẩn
Cây KC được gieo từ **Chương trình GDPT 2018 (Thông tư 32/2018), phần "Yêu cầu cần đạt"**
môn Toán lớp 10-11-12. Mỗi yêu cầu cần đạt gần như là một KC lá. Đây là văn bản pháp quy,
ổn định nhiều năm — vững hơn cả cấu trúc đề HSA/TSA (vốn đổi theo năm).

### Cấu trúc
Cây 3 tầng, dùng PostgreSQL `ltree` cho cột `path`:

```
mạch kiến thức  →  chủ đề  →  KC lá
(4 nút)            (17 nút)   (56 nút)
```

Bốn mạch: Đại số (20 lá) · Giải tích (15 lá) · Hình học và đo lường (15 lá) ·
Thống kê - Xác suất (6 lá).

### Hiệu chuẩn độ chi tiết theo quy mô
Nguyên tắc: mỗi KC lá nên có **≥ 10-15 câu** để thống kê đáng tin. Với dưới 1.000 câu,
56 KC lá cho mật độ ~15-18 câu/KC — đạt ngưỡng.

Mẹo nhờ `ltree`: dựng cây chi tiết sẵn, nhưng **khi ngân hàng còn nhỏ thì phân tích
gộp ở tầng giữa** (vd `path <@ 'giai_tich.khao_sat_ham_so'` gom mọi câu dưới nhánh).
Khi ngân hàng phình to và mỗi lá đủ câu, tự động phân tích sâu xuống tầng lá — **không
phải dựng lại cây**.

### Dùng chung, đánh dấu riêng
Một cây thống nhất cho cả HSA và TSA (vì phần Toán trùng 80-90%), mỗi KC đánh dấu
`exam_type`. Tránh dựng hai cây rời (gây trùng lặp, xé dữ liệu điểm yếu của học sinh
luyện cả hai kỳ).

> Hiện toàn bộ KC tạm gán cả hai kỳ thi (BOTH). Giáo viên nên rà lại và hạ một số KC
> xuống chỉ-HSA hoặc chỉ-TSA dựa trên đề thật.

### Phạm vi lược bỏ có chủ đích
- Phần "Thực hành trong phòng máy tính" — không phải kiến thức kiểm tra được.
- Nội dung chuyên đề tự chọn (10.1-12.3) — HSA/TSA ít hỏi; nội dung tối ưu đã nằm
  trong KC `ung_dung_dao_ham_thuc_tien`. Dễ thêm sau nếu đề thật cho thấy cần.

Chi tiết đầy đủ xem file kèm `seed_kc_tree.sql`.

---

## 6. Lược đồ dữ liệu

### `kc_node` (đã có)
Cây KC. Các cột chính: `kc_tag` (PK, = chuỗi ltree), `code` (mã ngắn duy nhất),
`exam_type`, `path` (ltree), `name_vi`, `desc_vi`, `diff_suggest` (1-5, chỉ ở KC lá),
`prerequisites`, `tags` (lớp g10/g11/g12).

### `question_kc` (bảng nối, đã bổ sung trường — migration `20250604000005`)
Quan hệ nhiều-nhiều giữa câu hỏi và KC — một câu chạm nhiều KC. Các trường (đã có):

- `weight` (0-1): KC này là chính hay phụ của câu. Khi tính điểm yếu, câu sai trừ
  điểm KC chính nhiều hơn KC phụ.
- `cognitive_level` (NB/TH/VD/VDC): mức nhận thức, đặt ở đây (không ở `Question`)
  để cùng câu có thể khác mức theo từng KC.
- `confidence` (0-1), `status` (pending/verified/rejected), `source` (ai/teacher),
  `model_version`, `raw_response` (JSONB): phục vụ human-in-the-loop và debug.

### `rag_docs` (đã có)
Kho tài liệu cho RAG, `embedding vector(1536)`, ba loại KC/RULE/EX. Dùng để retrieve
KC ứng viên khi phân loại (loại EX = câu ví dụ mẫu làm "mỏ neo").

### Hai migration phụ thuộc (ĐÃ hiện thực)
1. **`exam_type` → mảng** — migration `20250604000007_kc_node_exam_types_array.sql`: thêm
   cột `exam_types text[]` (song song, giữ `exam_type` cũ) + GIN index, để truy vấn
   `WHERE 'TSA' = ANY(exam_types)`.
2. **`prerequisites` → bảng nối** — migration `20250604000006_create_kc_prerequisites.sql`:
   tạo `kc_prerequisites(kc_tag, prereq_kc_tag)` + backfill từ chuỗi pipe, để duyệt đồ thị
   phụ thuộc bằng `WITH RECURSIVE`. Cột `prerequisites` cũ vẫn giữ (đảo ngược được).

---

## 6b. Cấu trúc mã nguồn (`src/exams/ai/`)

Toàn bộ code KC/AI/RAG được gom vào thư mục con `src/exams/ai/` (vẫn nằm trong
`ExamsModule`, không tách module mới) để dễ quản lý:

```
src/exams/ai/
  ai.constants.ts        # hằng số dùng chung (VECTOR_DIM, ngưỡng, stream, model mặc định)
  entities/              # kc-node, kc-prerequisite, question-kc, sub-question-kc,
                         #   user-kc-progress, generated-ai-question,
                         #   user-generated-ai-question, rag-doc, enums, index (barrel)
  dto/                   # generate-questions*, submit-ai-question
  llm/                   # openai, gemini, deepseek (nhà cung cấp LLM)
  rag/                   # rag-doc.service (pgvector retrieve/upsert)
  classification/        # tagging.worker + redis-stream.service (Module 1)
  progress/              # user-kc-progress.service (Module 2 + sinh đề theo KC)
  generation/            # ai-question-submission.service (chấm câu AI sinh)
  kc.controller.ts       # API /kc
  docs/                  # README_kien_truc_AI.md, README_GENERATE_FROM_HISTORY.md, seed_kc_tree.sql
```

Entity core của đề thi (`question`, `sub-question`, ...) vẫn ở `src/exams/entities/`;
chúng tham chiếu `QuestionKC`/`SubQuestionKC` qua `../ai/entities/...`.

---

## 7. Module 1 — Phân loại câu hỏi (kiến trúc chi tiết)

### Cách tiếp cận: RAG lai
Không nhồi cả cây KC vào prompt (tốn, dễ lạc). Quy trình:

```
Câu hỏi mới
  → embedding (vector 1536)
  → retrieve top-K KC ứng viên từ rag_docs (pgvector, similarity)
  → LLM chọn KC trong K ứng viên + gán cognitive_level
  → output có cấu trúc: KC, mức, weight, confidence
  → confidence cao: lưu question_kc / thấp hoặc unmatched: hàng đợi giáo viên
```

Embedding lo phần "thu hẹp không gian"; LLM lo phần "hiểu ngữ nghĩa toán" (biết câu
"tìm m để hàm đồng biến" thuộc KC tính đơn điệu dù không có chữ "đơn điệu").

### Ba lớp ràng buộc AI vào cây đóng
1. **Enum đóng trong tool schema**: bơm danh sách `kc_tag` hợp lệ vào `enum` —
   AI chỉ chọn được KC có thật, không tạo mới.
2. **Lối thoát `unmatched`**: cho AI quyền báo "không khớp KC nào" để không gán bừa.
   Câu unmatched là tín hiệu cây thiếu nhánh (con người quyết định bổ sung).
3. **Đưa mô tả + câu mẫu vào context**: dùng `desc_vi` và câu ví dụ (RAG loại EX)
   để AI so khớp, không đoán mò từ tên KC.

Dùng `tool_choice` ép gọi tool để output luôn đúng cấu trúc JSON với enum hợp lệ.

### Quy trình vận hành
- Chạy **batch theo lô** qua queue (`@nestjs/bull`), không phân loại realtime từng câu.
- Với dưới 1.000 câu: **giáo viên duyệt gần như toàn bộ** (mỗi câu vài giây vì AI đã
  gợi ý sẵn) để có nền chất lượng cao. Auto-verify chỉ bật khi ngân hàng phình to.
- Lưu `raw_response` để debug và re-map khi cần.

---

## 8. Module 2 — Đánh giá điểm yếu (phác thảo)

Phần lớn là **truy vấn SQL thống kê** trên cây KC, AI chỉ *diễn giải* — không bịa số.

- Với mỗi học sinh, nhóm câu đã làm theo KC (và theo `cognitive_level`), tính tỉ lệ
  đúng, thời gian trung bình, so với mặt bằng lớp.
- Tận dụng `ltree`: gộp theo nhánh (`path <@ ...`) khi dữ liệu mỏng, sâu xuống lá khi đủ.
- `weight` của `question_kc` giúp câu sai trừ điểm KC chính nhiều hơn KC phụ.
- Sản phẩm: "thẻ điểm năng lực" — học sinh yếu KC nào, ở mức nhận thức nào.
- LLM nhận số liệu đã tính, viết nhận xét dễ hiểu và gợi ý hành động.

---

## 9. Module 3 — Luyện đề thích ứng (phác thảo)

- **Giai đoạn đầu**: chỉ *chọn lọc câu từ ngân hàng đã duyệt* theo lỗ hổng. Chưa sinh
  câu mới (rủi ro sai đáp án toán).
- **Truy đồ thị phụ thuộc**: khi học sinh yếu KC X, dùng `kc_prerequisites` +
  `WITH RECURSIVE` truy ngược về các KC nền (X cần Y, Y cần Z). Cho ôn nền trước khi
  luyện KC khó — đây là lý do `prerequisites` phải là quan hệ thật, không phải chuỗi.
- **Sinh câu mới (về sau)**: bắt buộc vòng kiểm duyệt — giải lại bằng công cụ tính
  toán độc lập hoặc giáo viên duyệt trước khi đưa vào ngân hàng.

---

## 10. Quyết định đã chốt và việc còn mở

### Đã chốt
- Taxonomy đóng: con người định nghĩa, AI gán. Dùng cho mọi trục.
- Cây KC từ GDPT 2018, 3 tầng, 56 lá, dùng chung + đánh dấu `exam_type`.
- Tạm gác trục dạng đề; thêm `cognitive_level` vào `question_kc` để bù.
- Phân loại bằng RAG lai (embedding + LLM), enum đóng, có lối thoát unmatched,
  human-in-the-loop.
- Giữ đầy đủ nội dung, đáp án, lời giải, lịch sử làm bài chi tiết từng câu.

### Còn mở (cần quyết khi tới)
- Tinh chỉnh `exam_type` từng KC theo đề thật (hiện để BOTH hết).
- Đối chiếu cây KC với nhãn AI cũ để phát hiện KC rỗng / nhãn không map được.
- Thời điểm chạy hai migration (exam_type mảng, prerequisites bảng nối).
- Thời điểm và cách dựng trục dạng đề.
- Kiểm tra bảng lưu kết quả làm bài có đủ chi tiết cho Module 2 không.

---

## 11. Lộ trình triển khai

1. **Khóa cây KC**: chạy `seed_kc_tree.sql`; giáo viên rà coverage và `exam_type`.
   Nếu có nhãn AI cũ, đối chiếu để phát hiện lỗ hổng cây.
2. **Bổ sung schema** (ĐÃ làm — migration `20250604000005`): thêm các trường vào
   `question_kc` (`weight`, `cognitive_level`, `confidence`, `status`, `source`,
   `model_version`, `raw_response`).
3. **Chuẩn bị RAG**: tạo `rag_docs` loại KC (mô tả mỗi KC) và EX (câu ví dụ mẫu),
   sinh embedding.
4. **Xây `ClassificationService`** (Module 1): retrieve top-K + LLM gán + ràng buộc enum.
   Chạy batch re-classify toàn ngân hàng vào cây KC mới. Giáo viên duyệt.
5. **Migration phụ thuộc** (ĐÃ làm — `20250604000006`, `20250604000007`): bảng
   `kc_prerequisites` + cột mảng `exam_types`.
6. **Module 2**: truy vấn thống kê + thẻ điểm năng lực + LLM diễn giải.
7. **Module 3**: chọn câu theo lỗ hổng + truy đồ thị phụ thuộc. Sinh câu mới (về sau,
   có kiểm duyệt).

---

## 12. File kèm theo

- `seed_kc_tree.sql` — seed cây KC hoàn chỉnh (4 mạch · 17 chủ đề · 56 KC lá) dựng từ
  GDPT 2018, kèm `diff_suggest`, `prerequisites`, và hai migration khuyến nghị.
