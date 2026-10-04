# Mô tả chức năng màn HSA / TSA

Tài liệu này mô tả **toàn bộ chức năng hiện có** trong module `thi-hsa-tsa`, phục vụ redesign giao diện.  
Mỗi màn hình ghi rõ: mục đích, thành phần UI, hành vi người dùng, quy tắc nghiệp vụ và điểm khác biệt HSA vs TSA.

---

## 1. Tổng quan kiến trúc

### 1.1 Luồng chính

```
Danh sách đề (thi-hsa / thi-tsa)
    ├── Làm đề lẻ ──► lam-bai ──► ket-qua
    └── Làm bộ đề ──► lam-bai-group-hsa | lam-bai-group-tsa ──► ket-qua-group
```

### 1.2 Phân loại đề thi

| Loại | Enum / route | Ghi chú |
|------|--------------|---------|
| HSA đề lẻ | `ExamSetType.HSA` → `/lam-bai?examType=HSA` | Một môn, một đề |
| TSA đề lẻ | `ExamSetType.TSA` → `/lam-bai?examType=TSA` | Một môn, một đề |
| HSA bộ đề | Group → `/lam-bai-group-hsa` | Nhiều môn, làm tuần tự |
| TSA bộ đề | Group → `/lam-bai-group-tsa` | Nhiều môn, làm tuần tự |
| Bài tập chương | `ExamSetType.CHAPTER` → `/lam-bai` | Dùng chung màn làm bài |

### 1.3 Màu thương hiệu (hiện tại)

| | HSA | TSA |
|---|-----|-----|
| Màu chủ đạo | Xanh lá `#006b32` | Đỏ `#dc2626` |
| Logo khi làm bài | `PZB_Edu_HSA_green_transparent.png` | `PZB_Edu_TSA_red_transparent.png` |
| Nền trang danh sách | `#f4faff` (xanh nhạt) | Gradient đỏ–trắng |

---

## 2. Trang danh sách đề

### 2.1 `/thi-hsa-tsa/thi-hsa` — Danh sách đề HSA

**Mục đích:** Hub luyện thi HSA — duyệt, lọc, bắt đầu đề lẻ hoặc bộ đề.

#### Hero section
- Tiêu đề: "Luyện thi HSA Toàn diện"
- Thống kê (hardcoded + dynamic): số đề, câu hỏi, phút, tỷ lệ đỗ
- CTA chính: **"Làm bộ đề hoàn chỉnh"** → mở modal chọn bộ đề

#### Bộ lọc (sync URL query `?year=&difficulty=&subjects=`)
- **Môn học:** chip multi-select (Toán, Lý, Hóa, Văn, …) + "Tất cả"
- **Độ khó:** Tất cả / Dễ / Trung bình / Khó / Rất khó

#### Danh sách đề
- Nhóm theo **môn học**, header sticky khi scroll
- Mỗi **exam card** hiển thị:
  - Badge độ khó (Easy / Medium / Hard / Expert)
  - Trạng thái: Chưa làm / Đã xong (nếu đã đăng nhập)
  - Badge **Miễn phí** (`isFree`)
  - Badge **Khóa online** (cần đăng ký khóa học)
  - Tên đề, thời gian, số câu (hardcoded "100 câu" trên card)
  - Thanh màu trên cùng (xanh nếu đã hoàn thành)

#### Hành động trên card
| Trạng thái | Nút |
|------------|-----|
| Chưa làm | **Bắt đầu ngay** / **Làm thử miễn phí** (guest + free) |
| Đã xong | **Xem lại** → `/ket-qua?examId=…` (trừ khi `lockView`) |
| Đã xong | **Làm lại** |
| Mọi trạng thái | **🏆 Bảng xếp hạng** → modal leaderboard |

#### Sidebar phải (sticky)
- **Top Performers** — top 5 leaderboard HSA
- **Tài nguyên học tập** — tag placeholder (chưa link thật)
- **Cấu trúc đề HSA** — Định lượng 50 / Định tính 50 / Khoa học 50, tổng 195 phút

#### Modal & popup
- **ExamSetGroupModal** — chọn loại bộ đề (HSA: TO_HOP_1 / TO_HOP_2) và bộ đề cụ thể
- **ExamLeaderboardModal** — bảng xếp hạng theo đề
- **GuestProfileModal** — thu thập họ tên, trường, năm sinh, SĐT (guest làm đề free)
- **window.prompt** — nhập mật khẩu đề (`hasPassword`)

#### Quyền truy cập
- Chưa đăng nhập: chỉ làm được đề **miễn phí** (`isFree`)
- `canUserStartExam()` — kiểm tra quyền + khóa khóa online
- Đề có mật khẩu: bắt buộc nhập trước khi vào `lam-bai`

---

### 2.2 `/thi-hsa-tsa/thi-tsa` — Danh sách đề TSA

**Cấu trúc tương tự HSA**, khác biệt chính:

| Khác biệt | Chi tiết |
|-----------|----------|
| Màu | Palette đỏ (`#dc2626`, `#991b1b`) |
| Hero | "Kỳ thi Tư duy TSA", stats 120 câu / 150 phút |
| CTA đề | "Thử thách ngay" thay vì "Bắt đầu ngay" |
| Expand/collapse | Mỗi môn chỉ hiện **6 đề đầu**, nút "Xem tất cả (N đề thi)" |
| Bộ đề group | TSA cố định `TO_HOP_1` (Toán – Văn – Khoa học), không chọn loại |
| Sidebar cấu trúc | Tư duy Toán 40 / Đọc hiểu 40 / GVP 40, tổng 150 phút |
| Redirect group | `/lam-bai-group-tsa?groupId=…` |

---

## 3. Modal bộ đề hoàn chỉnh (`ExamSetGroupModal`)

**Kích hoạt từ:** Hero CTA trên trang danh sách HSA/TSA.

### HSA — 2 bước chọn
1. **Loại bài thi**
   - **TO_HOP_1:** Toán + Văn + Anh (mỗi môn một tab)
   - **TO_HOP_2:** Toán + Văn + Lý-Hóa-Sinh (Lý/Hóa/Sinh gộp 1 tab)
2. **Chọn bộ đề** trong danh sách API → xem preview môn, độ khó → **Bắt đầu**

### TSA — 1 bước
- Tự động `TO_HOP_1`: Toán + Văn + Khoa học
- Chọn bộ đề → **Bắt đầu**

### Sau khi bắt đầu
- Lưu `examSetGroup` + `examType` vào `sessionStorage`
- Navigate: HSA → `lam-bai-group-hsa`, TSA → `lam-bai-group-tsa`

---

## 4. Màn làm bài đề lẻ — `/thi-hsa-tsa/lam-bai`

**Query params:** `examId`, `examType` (HSA|TSA|CHAPTER), `isFree`, `password`

### 4.1 Các trạng thái màn hình

```
Loading → (Lỗi quyền / mật khẩu / not found) → Intro → Đang làm bài → Kết quả tóm tắt
```

| Trạng thái | UI |
|------------|-----|
| Loading | Spinner toàn màn |
| Chưa đăng nhập (đề trả phí) | Card yêu cầu đăng nhập |
| Sai mật khẩu / không có quyền | Card lỗi + nút quay danh sách |
| Intro (`ExamIntroScreen`) | Tên đề, thời gian, số câu, loại đề, lưu ý, **Bắt đầu làm bài** |
| Đang làm | `HSAExamLayout` hoặc `TSAExamLayout` |
| Sau nộp | `ExamResults` — % điểm, link chi tiết |

### 4.2 Màn intro (`ExamIntroScreen`)

- Hiển thị: tên đề, thời gian (phút), tổng câu, loại đề (HSA/TSA)
- Lưu ý: tự nộp khi hết giờ, có thể sửa đáp án, cần internet, không refresh
- **Bắt đầu:** request fullscreen (nếu được)

### 4.3 Chế độ HSA (`HSAExamLayout`)

**Layout:** full viewport `h-dvh`, không Header site.

```
┌─────────────────────────────────────────────┐
│ Header: logo HSA | tên đề | timer | (slot)  │
├─────────────────────────────────────────────┤
│ HSAQuestionStatusBars                       │
│  • Câu chưa làm [chip xám]                  │
│  • Câu đã làm   [chip xanh]                 │
├─────────────────────────────────────────────┤
│ HSAExamPlayer — scroll toàn bộ câu hỏi      │
│  (QuestionCard / GroupQuestionSplitView)    │
├─────────────────────────────────────────────┤
│ Footer: [Nộp bài]                           │
└─────────────────────────────────────────────┘
```

**Đặc điểm:**
- **Tất cả câu hiển thị cùng lúc** (scroll dọc), không phân trang
- Thanh trạng thái 2 hàng: chưa làm / đã làm — click chip → scroll tới câu
- Một môn duy nhất → footer luôn **Nộp bài** (`isLastSubject=true`)

### 4.4 Chế độ TSA (`TSAExamLayout`)

```
┌──────────────────────────────────┬──────────┐
│ Header: logo TSA | timer | slot  │          │
├──────────────────────────────────┤ Question │
│ TSAExamPlayer                    │ Navigator│
│  • 1 câu / slide                 │ (sidebar)│
│  • Câu trước | timer câu | Sau   │          │
├──────────────────────────────────┤          │
│ Footer: [Nộp bài]                │          │
└──────────────────────────────────┴──────────┘
```

**Đặc điểm:**
- **Một câu một màn** (slide), nút Câu trước / Câu tiếp
- **Timer riêng từng câu** hiển thị trên thanh nav ("Thời gian câu này: HH:MM:SS")
- Sidebar **Danh sách câu hỏi** (`QuestionNavigator`):
  - Grid số câu, màu: xám (chưa), xanh (đã), xanh đậm (đang xem), viền cam (đánh dấu)
  - Counter `X/Y đã trả lời`
- **Ẩn sidebar** với môn Văn, Khoa học, hoặc tab Lý-Hóa-Sinh (split view full width)

### 4.5 Chức năng chung khi làm bài

#### Timer tổng
- Đếm ngược từ `duration × 60` giây
- Hết giờ → tự động nộp bài
- Format `HH:MM:SS`

#### Trả lời câu hỏi
- Lưu trong state `userAnswers[]`: `{ questionId, selectedAnswer[], subAnswers?, isMarked? }`
- Hỗ trợ toggle multiple choice, thay thế single choice, mảng cho drag-drop

#### Đánh dấu câu (mark for review)
- Toggle `isMarked` — hiển thị chấm cam trên navigator / chip

#### Trạng thái "đã trả lời"
- Câu thường: có `selectedAnswer` hợp lệ
- Câu group: **tất cả câu con** phải trả lời mới tính "đã làm"
- Hỗ trợ `short_answer`, `drag_drop_cloze`

#### Nộp bài
- Nút **Nộp bài** ở footer (TSA) hoặc footer HSA layout
- **Giới hạn tối thiểu 60 phút** (đề course-accessible hoặc free): nút disabled + alert nếu nộp sớm
- Submit gửi: `answers[]`, `totalTime`, `profileId` hoặc `guestProfile`
- TSA: kèm `completedInSeconds` theo câu (câu con group dùng chung thời gian câu cha)

#### Chống gian lận (anti-cheat)
- Bắt buộc fullscreen khi bắt đầu
- Theo dõi: chuyển tab / ẩn trình duyệt, thoát fullscreen
- Tối đa **2 cảnh báo**, lần thứ 3 → tự nộp bài
- Chặn: chuột phải, F12, Ctrl+Shift+I/J/C, Ctrl+U
- Modal cảnh báo với nút quay lại fullscreen

#### Guest (đề miễn phí)
- Profile thu trước ở trang danh sách (`GuestProfileModal`)
- Kết quả lưu `sessionStorage` (`guest-exam-result:{examId}`)

---

## 5. Màn làm bài bộ đề — Group Exam

Hai route song song, **logic gần giống nhau**, khác layout làm bài (HSA vs TSA).

| | HSA Group | TSA Group |
|---|-----------|-----------|
| Route | `/lam-bai-group-hsa` | `/lam-bai-group-tsa` |
| Layout | `HSAExamLayout` | `TSAExamLayout` |
| Query | `groupId`, `type?` | `groupId`, `type?` |

### 5.1 Cấu trúc tab (môn)

**TO_HOP_1 (HSA):** mỗi exam = 1 tab (Toán, Văn, Anh, …)

**TO_HOP_2 (HSA):**
1. Toán
2. Văn
3. Lý – Hóa – Sinh (3 đề gộp 1 tab, hiện badge môn trên từng câu)

**TSA TO_HOP_1:**
1. Toán (60 phút)
2. Văn (30 phút)
3. Khoa học (60 phút)

### 5.2 Thời gian theo tab

| Tab / Môn | HSA | TSA |
|-----------|-----|-----|
| Toán | 75 phút | 60 phút |
| Văn | 60 phút | 30 phút |
| Anh | 60 phút | — |
| Lý-Hóa-Sinh / Khoa học | 60 phút (chung) | 60 phút |

- Timer **riêng từng tab**, lưu thời gian đã dùng khi chuyển môn
- Hết giờ tab → **tự chuyển môn tiếp theo** (tab cuối → nộp bài)

### 5.3 Điều hướng giữa các môn

| Layout | Vị trí nút | Hành vi |
|--------|------------|---------|
| HSA | Footer: **Môn tiếp theo →** hoặc **Nộp bài** (môn cuối) | Không quay lại môn trước |
| TSA | Header slot: **Môn tiếp theo →** | Footer: **Nộp bài** |

- Chỉ tiến tới (`maxTabIndexReached`), **không cho quay lại môn cũ**
- Chuyển môn → reset `currentQuestionIndex = 0`

### 5.4 Intro & kết quả group

- Intro dùng chung `ExamIntroScreen` (tổng câu + tổng phút cả bộ)
- Nếu `groupData.userResult` đã tồn tại → redirect `/ket-qua-group?groupId=…`
- Sau nộp → `ExamResults` (tóm tắt) → link `/ket-qua-group`

### 5.5 Submit group

- Gom đáp án **theo từng exam** trong bộ
- Câu group: flatten câu con, `questionId = pathKey`, `completedInSeconds` (TSA)
- Lý/Hóa/Sinh TO_HOP_2: **dùng chung** thời gian tab khoa học

---

## 6. Loại câu hỏi & component hiển thị

| `question_type` | Component | Ghi chú UI |
|-----------------|-----------|------------|
| `single_choice` | `QuestionOptions` | Chọn 1 đáp án |
| `multiple_choice` | `QuestionOptions` | Toggle nhiều đáp án |
| `true_false` | `QuestionOptions` | Mặc định sub-question |
| `short_answer` | Input text | Trim khi check "đã trả lời" |
| `drag_drop_cloze` | `DragDropCloze` | Mảng đáp án theo chỗ trống |
| `group_question` | `GroupQuestionSplitView` (TSA slide / HSA scroll) | Đọc đề trái, câu con phải |

### Group question — split view
- Panel trái: đoạn văn / stem (scroll)
- Panel phải: danh sách câu con đánh số
- Sub-answer key: `{parentQuestionId}_{subQuestionId}` (hỗ trợ nested)
- Nút **đánh dấu** trên block câu group

### Đáp án dạng hình ảnh
- Path `/questions/*.png|jpg|…` → render `<img>` thay vì text

---

## 7. Trang kết quả

### 7.1 `/thi-hsa-tsa/ket-qua` — Kết quả đề lẻ

**Query:** `examId`

#### Phần tử UI
- Header site
- Hero: tiêu đề kết quả
- **Tóm tắt điểm:** % , điểm/tổng, message
- **Danh sách câu chi tiết** (phân trang 10 câu/trang):
  - Số thứ tự, badge Đúng/Sai/Bỏ qua
  - Điểm cộng, thời gian làm câu (nếu có)
  - Nội dung câu + hình (`image_placeholder`)
  - Options: highlight xanh (đúng), đỏ (user chọn sai)
  - Đáp án user vs đáp án đúng
  - Giải thích (`explanation`) nếu có
- **Jump navigation:** grid số câu, click → chuyển trang + scroll
- Phân trang prev/next

#### Quyền xem
- User đăng nhập: fetch API
- Guest free: đọc `sessionStorage`
- `lockView` trên đề: ẩn nút "Xem lại" ở danh sách (không chặn URL trực tiếp nếu có quyền)

---

### 7.2 `/thi-hsa-tsa/ket-qua-group` — Kết quả bộ đề

**Query:** `groupId`

- Hero tổng kết: % , điểm/tổng, message
- Chi tiết từng câu (flat list, không phân trang trong code hiện tại)
- Mỗi câu: đúng/sai, điểm, thời gian, nội dung, options tô màu
- Nút quay về trang đề HSA

---

### 7.3 `ExamResults` — Màn tóm tắt ngay sau nộp

- Hiển thị ngay trên `lam-bai` / group (trước khi vào trang chi tiết)
- 3 stat card: điểm đạt / thời gian / tổng điểm
- **Xem chi tiết kết quả** → `ket-qua` hoặc `ket-qua-group`
- **Về trang đề thi** → `/bai-tap-chuong` (link cố định hiện tại)

---

## 8. Modal & component dùng chung

| Component | Chức năng |
|-----------|-----------|
| `ExamHeader` | Logo, tên môn/đề, chấm màu môn, tổng câu, timer đỏ, slot phải (Môn tiếp / Nộp) |
| `ExamAlertModal` | Cảnh báo anti-cheat, lỗi nộp bài, chưa đủ 60 phút |
| `QuestionNavigator` | Grid câu TSA — compact/narrow mode |
| `HSAQuestionStatusBars` | 2 hàng chip câu chưa/đã làm |
| `GuestProfileModal` | Form guest: họ tên, trường, năm sinh, SĐT |
| `ExamLeaderboardModal` | BXH theo examId, có thể cần password |
| `ExamSetGroupModal` | Chọn bộ đề hoàn chỉnh |

---

## 9. Quy tắc nghiệp vụ quan trọng (cho redesign)

### 9.1 Phân quyền & truy cập
- Đề trả phí: bắt buộc đăng nhập
- Đề free: guest được làm, cần profile
- Đề khóa khóa online: disable nút bắt đầu
- Đề mật khẩu: prompt trước khi vào
- Lọc đề theo lớp/user qua API (`useExamSets`)

### 9.2 Trạng thái đề trên card
- `userStatus.isCompleted` + `totalPoints` → đã xong
- `lockView` → không xem đáp án
- `isFree` → badge + luồng guest
- `hasPassword` → prompt

### 9.3 Timer & nộp bài
- Hết giờ → auto submit
- Group: hết giờ tab → next tab (không quay lại)
- Single exam course/free: min 60 phút mới nộp được
- TSA: track `completedInSeconds` per question

### 9.4 Anti-cheat
- Fullscreen + không chuyển tab
- 2 strikes → auto submit lần 3
- Áp dụng: `lam-bai`, group HSA, group TSA

### 9.5 Điều hướng không được phá vỡ khi redesign
- URL params: `examId`, `examType`, `groupId`, `isFree`, `password`
- `sessionStorage`: `examSetGroup`, `examType`, `guestProfile`, `exam-password:{id}`, `guest-exam-result:{id}`
- Group đã làm → auto redirect kết quả

---

## 10. Màn liên quan (ngoài core HSA/TSA exam UI)

| Route | Mô tả ngắn |
|-------|------------|
| `/thi-hsa-tsa/bai-tap-chuong` | Đề theo chương khóa học — sidebar chương, grid đề, dùng chung `lam-bai` |
| `/thi-hsa-tsa/game` | Mini game toán (PixiJS) — không liên quan flow thi |

---

## 11. Map file code (tham chiếu redesign)

| Chức năng | File chính |
|-----------|------------|
| Danh sách HSA | `thi-hsa/page.tsx` |
| Danh sách TSA | `thi-tsa/page.tsx` |
| Làm bài đề lẻ | `lam-bai/page.tsx` |
| Bộ đề HSA | `lam-bai-group-hsa/page.tsx` |
| Bộ đề TSA | `lam-bai-group-tsa/page.tsx` |
| Kết quả lẻ | `ket-qua/page.tsx` |
| Kết quả group | `ket-qua-group/page.tsx` |
| Layout HSA exam | `components/exam/HSAExamLayout.tsx` |
| Layout TSA exam | `components/exam/TSAExamLayout.tsx` |
| Player HSA (scroll all) | `components/exam/HSAExamPlayer.tsx` |
| Player TSA (1 câu/slide) | `components/exam/TSAExamPlayer.tsx` |
| Sidebar câu TSA | `components/exam/QuestionNavigator.tsx` |
| Thanh trạng thái HSA | `components/exam/HSAQuestionStatusBars.tsx` |
| Intro | `components/exam/ExamIntroScreen.tsx` |
| Kết quả tóm tắt | `components/exam/ExamResults.tsx` |
| Câu hỏi / group | `components/exam/QuestionCard.tsx`, `GroupQuestionSplitView.tsx` |
| Utils môn & trạng thái câu | `utils.ts` |

---

## 12. Gợi ý nhóm màn hình khi redesign

Để thiết kế hệ thống, có thể gom thành **5 template**:

1. **Discovery** — `thi-hsa`, `thi-tsa` (chung template, đổi theme + copy)
2. **Pre-exam** — `ExamIntroScreen` + password/guest gate
3. **Exam HSA mode** — scroll all + status bars + footer nộp/chuyển môn
4. **Exam TSA mode** — slide + sidebar navigator + per-question timer + split view
5. **Results** — summary card + review chi tiết + BXH

### Điểm cần quyết định khi redesign
- Có thống nhất HSA scroll-all vs TSA slide-one không, hay giữ dual mode?
- Group HSA vs TSA: có dùng chung shell header/footer không?
- Thanh trạng thái HSA (2 hàng chip) vs TSA sidebar — có merge pattern không?
- Guest flow & anti-cheat: modal vs inline step?
- `window.prompt` mật khẩu → nên thay bằng modal trong redesign

---

*Tài liệu generated từ codebase hiện tại — cập nhật khi có thay đổi logic nghiệp vụ.*
