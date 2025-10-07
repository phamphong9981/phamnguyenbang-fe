export const data = {
    type: "chapter",
    name: "VECTO",
    year: '2025',
    subject: "Toán học",
    duration: "90 phút",
    difficulty: "Trung bình",
    status: "available",
    description: `Ôn tập chương 4 (Cánh diều): Vecto (Phần 2)`,
    grade: 10,
    questions: [
        {
            "id": 1,
            "section": "Toán học",
            "content": "Phát biểu nào sau đây là sai?",
            "image": null,
            "questionType": "multiple_choice",
            "options": {
                "A": "Hai vectơ cùng phương thì cùng hướng.",
                "B": "Vectơ-không cùng phương với mọi vectơ.",
                "C": "Hai vectơ cùng hướng thì cùng phương.",
                "D": "Vectơ là đoạn thẳng có hướng."
            },
            "correctAnswer": "A",
            "explanation": "Hai vectơ cùng phương có thể cùng hướng hoặc ngược hướng. Do đó, phát biểu 'Hai vectơ cùng phương thì cùng hướng' là sai."
        },
        {
            "id": 2,
            "section": "Toán học",
            "content": "Cho tam giác ABC, có thể xác định được bao nhiêu vectơ (khác vectơ-không) có điểm đầu và điểm cuối là các đỉnh A, B, C?",
            "image": null,
            "questionType": "multiple_choice",
            "options": {
                "A": "2",
                "B": "3",
                "C": "4",
                "D": "6"
            },
            "correctAnswer": "D",
            "explanation": "Với 3 điểm phân biệt A, B, C, ta có thể tạo thành các vectơ: $\\vec{AB}, \\vec{BA}, \\vec{AC}, \\vec{CA}, \\vec{BC}, \\vec{CB}$. Vậy có tất cả 6 vectơ."
        },
        {
            "id": 3,
            "section": "Toán học",
            "content": "Cho ba điểm M, N, P thẳng hàng, trong đó điểm N nằm giữa hai điểm M và P. Khi đó cặp vectơ nào sau đây cùng hướng?",
            "image": null,
            "questionType": "multiple_choice",
            "options": {
                "A": "$\\vec{MP}$ và $\\vec{PN}$",
                "B": "$\\vec{MN}$ và $\\vec{PN}$",
                "C": "$\\vec{NM}$ và $\\vec{NP}$",
                "D": "$\\vec{MN}$ và $\\vec{MP}$"
            },
            "correctAnswer": "D",
            "explanation": "Vì N nằm giữa M và P, các điểm theo thứ tự là M, N, P. Do đó, vectơ $\\vec{MN}$ và $\\vec{MP}$ đều có cùng hướng từ trái sang phải."
        },
        {
            "id": 4,
            "section": "Toán học",
            "content": "Cho hình bình hành ABCD tâm O. Hỏi vectơ $\\vec{AO} - \\vec{DO}$ bằng vectơ nào trong các vectơ sau?",
            "image": null,
            "questionType": "multiple_choice",
            "options": {
                "A": "$\\vec{BA}$",
                "B": "$\\vec{BC}$",
                "C": "$\\vec{DC}$",
                "D": "$\\vec{AC}$"
            },
            "correctAnswer": "B",
            "explanation": "Ta có $\\vec{AO} - \\vec{DO} = \\vec{AO} + \\vec{OD} = \\vec{AD}$. Vì ABCD là hình bình hành nên $\\vec{AD} = \\vec{BC}$."
        },
        {
            "id": 5,
            "section": "Toán học",
            "content": "Cho 5 điểm M, N, P, Q, H. Tổng $\\vec{MN} - \\vec{QP} + \\vec{HN} - \\vec{PN} + \\vec{QH}$ bằng",
            "image": null,
            "questionType": "multiple_choice",
            "options": {
                "A": "$\\vec{MH}$",
                "B": "$\\vec{MP}$",
                "C": "$\\vec{MN}$",
                "D": "$\\vec{PH}$"
            },
            "correctAnswer": "C",
            "explanation": "Ta sắp xếp lại và sử dụng quy tắc ba điểm: $(\\vec{MN} - \\vec{PN}) + (\\vec{QH} + \\vec{HN}) - \\vec{QP} = (\\vec{MN} + \\vec{NP}) + \\vec{QN} + \\vec{PQ} = \\vec{MP} + \\vec{PQ} + \\vec{QN} = \\vec{MQ} + \\vec{QN} = \\vec{MN}$."
        },
        {
            "id": 6,
            "section": "Toán học",
            "content": "Cho tam giác ABC. Tìm điểm M thỏa mãn điều kiện $\\vec{MA} - \\vec{MB} + \\vec{MC} = \\vec{0}$.",
            "image": null,
            "questionType": "multiple_choice",
            "options": {
                "A": "M là đỉnh thứ tư trong hình bình hành ACMB",
                "B": "M là đỉnh thứ tư trong hình bình hành ABCM",
                "C": "M là trọng tâm tam giác ABC",
                "D": "M là trung điểm của đoạn thẳng AB"
            },
            "correctAnswer": "B",
            "explanation": "Ta có $\\vec{MA} - \\vec{MB} = \\vec{BA}$. Do đó, điều kiện trở thành $\\vec{BA} + \\vec{MC} = \\vec{0}$, hay $\\vec{MC} = -\\vec{BA} = \\vec{AB}$. Điều này có nghĩa là tứ giác ABCM là một hình bình hành."
        },
        {
            "id": 7,
            "section": "Toán học",
            "content": "Cho hình vuông ABCD cạnh $a\\sqrt{2}$. Tính $|\\vec{AB} + \\vec{AC} + \\vec{AD}|$.",
            "image": null,
            "questionType": "multiple_choice",
            "options": {
                "A": "$4a$",
                "B": "$a\\sqrt{2}$",
                "C": "$2a\\sqrt{2}$",
                "D": "$2a$"
            },
            "correctAnswer": "A",
            "explanation": "Áp dụng quy tắc hình bình hành, $\\vec{AB} + \\vec{AD} = \\vec{AC}$. Do đó, tổng các vectơ là $\\vec{AC} + \\vec{AC} = 2\\vec{AC}$. Độ dài đường chéo $AC = \\sqrt{(a\\sqrt{2})^2 + (a\\sqrt{2})^2} = 2a$. Vậy $|2\\vec{AC}| = 2 \\cdot AC = 2 \\cdot 2a = 4a$."
        },
        {
            "id": 8,
            "section": "Toán học",
            "content": "Cho tam giác ABC. Gọi I là trung điểm BC. Mệnh đề nào sau đây sai?",
            "image": null,
            "questionType": "multiple_choice",
            "options": {
                "A": "$\\vec{AC} + \\vec{AB} = 2\\vec{AI}$",
                "B": "$\\vec{BI} + \\vec{CI} = \\vec{0}$",
                "C": "$\\vec{CI} + \\vec{AI} = \\vec{0}$",
                "D": "$\\vec{IC} + \\vec{IB} = \\vec{0}$"
            },
            "correctAnswer": "C",
            "explanation": "Vì I là trung điểm BC nên $\\vec{IB} + \\vec{IC} = \\vec{0}$ (D đúng). $\\vec{BI} = -\\vec{IB}$ và $\\vec{CI}=-\\vec{IC}$, do đó $\\vec{BI}+\\vec{CI} = -(\\vec{IB}+\\vec{IC})=\\vec{0}$ (B đúng). Quy tắc trung tuyến cho A đúng. Mệnh đề C sai vì $\\vec{CI} + \\vec{AI}$ không bằng $\\vec{0}$ trừ khi tam giác suy biến."
        },
        {
            "id": 9,
            "section": "Toán học",
            "content": "Cho tam giác ABC, lấy điểm I trên cạnh AC sao cho $\\vec{AC} - 3\\vec{IC} = \\vec{0}$. Biểu diễn $\\vec{BI}$ theo hai vectơ $\\vec{BA}$ và $\\vec{BC}$. Khẳng định nào sau đây đúng?",
            "image": null,
            "questionType": "multiple_choice",
            "options": {
                "A": "$\\vec{BI}=\\frac{1}{3}\\vec{BA}-\\frac{2}{3}\\vec{BC}$",
                "B": "$\\vec{BI}=\\frac{2}{3}\\vec{BA}-\\frac{1}{3}\\vec{BC}$",
                "C": "$\\vec{BI}=\\frac{1}{3}\\vec{BA}+\\frac{2}{3}\\vec{BC}$",
                "D": "$\\vec{BI}=-\\vec{AB}+\\frac{3}{4}\\vec{AC}$"
            },
            "correctAnswer": "C",
            "explanation": "Từ $\\vec{AC} - 3\\vec{IC} = \\vec{0}$, ta có $\\vec{IC} = \\frac{1}{3}\\vec{AC}$. Ta có $\\vec{BI} = \\vec{BC} + \\vec{CI} = \\vec{BC} - \\vec{IC} = \\vec{BC} - \\frac{1}{3}\\vec{AC} = \\vec{BC} - \\frac{1}{3}(\\vec{BC}-\\vec{BA}) = \\frac{2}{3}\\vec{BC} + \\frac{1}{3}\\vec{BA}$."
        },
        {
            "id": 10,
            "section": "Toán học",
            "content": "Cho tam giác ABC vuông cân tại A có $AB=AC=a$. Tính $\\vec{AB} \\cdot \\vec{BC}$.",
            "image": null,
            "questionType": "multiple_choice",
            "options": {
                "A": "$\\vec{AB}\\cdot\\vec{BC}=a^2$",
                "B": "$\\vec{AB}\\cdot\\vec{BC}=-a^2$",
                "C": "$\\vec{AB}\\cdot\\vec{BC}=\\frac{a^2}{2}$",
                "D": "$\\vec{AB}\\cdot\\vec{BC}=\\frac{a^2\\sqrt{2}}{2}$"
            },
            "correctAnswer": "B",
            "explanation": "Ta có $\\vec{AB} \\cdot \\vec{BC} = \\vec{AB} \\cdot (\\vec{BA} + \\vec{AC}) = \\vec{AB} \\cdot \\vec{BA} + \\vec{AB} \\cdot \\vec{AC} = -AB^2 + 0 = -a^2$ (vì $\\vec{AB} \\perp \\vec{AC}$)."
        },
        {
            "id": 11,
            "section": "Toán học",
            "content": "Cho hình vuông ABCD, góc giữa hai vectơ $\\vec{DC}$ và $\\vec{AC}$ là",
            "image": null,
            "questionType": "multiple_choice",
            "options": {
                "A": "$60^{\\circ}$",
                "B": "$120^{\\circ}$",
                "C": "$45^{\\circ}$",
                "D": "$135^{\\circ}$"
            },
            "correctAnswer": "C",
            "explanation": "Ta có $\\vec{DC} = \\vec{AB}$. Do đó, góc giữa $\\vec{DC}$ và $\\vec{AC}$ chính là góc giữa $\\vec{AB}$ và $\\vec{AC}$, là góc $\\angle BAC$. Trong hình vuông, đường chéo là tia phân giác, vậy $\\angle BAC = 45^{\\circ}$."
        },
        {
            "id": 12,
            "section": "Toán học",
            "content": "Cho ba vectơ $\\vec{a}, \\vec{b}$ thỏa mãn $|\\vec{a}|=3, |\\vec{b}|=2, |\\vec{a}-\\vec{b}|=4$. Tính $(\\vec{a}-2\\vec{b})\\cdot(\\vec{a}+\\vec{b})$.",
            "image": null,
            "questionType": "multiple_choice",
            "options": {
                "A": "-1",
                "B": "$\\frac{3}{2}$",
                "C": "$-\\frac{3}{2}$",
                "D": "$\\frac{5}{2}$"
            },
            "correctAnswer": "D",
            "explanation": "Từ $|\\vec{a}-\\vec{b}|=4$, ta bình phương hai vế: $(\\vec{a}-\\vec{b})^2 = 16 \\Rightarrow |\\vec{a}|^2 - 2\\vec{a}\\cdot\\vec{b} + |\\vec{b}|^2 = 16 \\Rightarrow 9 - 2\\vec{a}\\cdot\\vec{b} + 4 = 16 \\Rightarrow \\vec{a}\\cdot\\vec{b} = -3/2$. Biểu thức cần tính là $|\\vec{a}|^2 - \\vec{a}\\cdot\\vec{b} - 2|\\vec{b}|^2 = 9 - (-3/2) - 2(4) = 9 + 3/2 - 8 = 1 + 3/2 = 5/2$."
        },
        {
            "id": 13,
            "section": "Toán học",
            "content": "Cho tam giác ABC, dựng các điểm M, N sao cho $\\vec{AM}=\\vec{BC}$ và $\\vec{AN}=\\vec{CB}$.",
            "image": null,
            "questionType": "group_question",
            "subQuestions": [
                { "id": "13a", "content": "$\\vec{AM}$ ngược hướng với $\\vec{BC}$.", "questionType": "true_false", "correctAnswer": false, "explanation": "Theo định nghĩa hai vectơ bằng nhau, $\\vec{AM}$ phải cùng hướng với $\\vec{BC}$." },
                { "id": "13b", "content": "ABCM là hình bình hành.", "questionType": "true_false", "correctAnswer": true, "explanation": "Vì $\\vec{AM}=\\vec{BC}$, các cạnh AM và BC song song và bằng nhau, suy ra ABCM là hình bình hành." },
                { "id": "13c", "content": "ACBN là hình bình hành.", "questionType": "true_false", "correctAnswer": true, "explanation": "Vì $\\vec{AN}=\\vec{CB}$, các cạnh AN và CB song song và bằng nhau, suy ra ACBN là hình bình hành." },
                { "id": "13d", "content": "$\\vec{AM}, \\vec{AN}$ là hai vectơ đối nhau.", "questionType": "true_false", "correctAnswer": true, "explanation": "Ta có $\\vec{AN}=\\vec{CB}=-\\vec{BC}=-\\vec{AM}$. Do đó, chúng là hai vectơ đối nhau." }
            ]
        },
        {
            "id": 14,
            "section": "Toán học",
            "content": "Cho $\\triangle ABC$ không vuông có trực tâm H và O là tâm đường tròn ngoại tiếp. Gọi $B'$ là điểm đối xứng của B qua O.",
            "image": null,
            "questionType": "group_question",
            "subQuestions": [
                { "id": "14a", "content": "$B'C \\perp BC$.", "questionType": "true_false", "correctAnswer": false, "explanation": "$BB'$ là đường kính nên $\\angle BCB' = 90^{\\circ}$, suy ra $B'C \\perp BC$ là đúng. Tuy nhiên, đề có thể có lỗi, câu này nên là $B'C \\perp AC$. Vì $B'A \\perp AB$ và $CH \\perp AB$ nên $B'A // CH$. Tương tự $AH // B'C$." },
                { "id": "14b", "content": "$B'C // AB$.", "questionType": "true_false", "correctAnswer": false, "explanation": "$AH \\perp BC$ và $B'C \\perp BC$, do đó $AH // B'C$." },
                { "id": "14c", "content": "Tứ giác AB'CH là hình bình hành.", "questionType": "true_false", "correctAnswer": false, "explanation": "Tứ giác AHCB' mới là hình bình hành vì có các cặp cạnh đối song song ($AH // B'C$ và $CH // B'A$)." },
                { "id": "14d", "content": "$\\vec{AH}=\\vec{B'C}$ và $\\vec{AB'}=\\vec{HC}$.", "questionType": "true_false", "correctAnswer": true, "explanation": "Vì AHB'C là hình bình hành nên $\\vec{AH}=\\vec{CB'}$ và $\\vec{AC}=\\vec{HB'}$. (Lưu ý: lời giải trong file có thể ghi AH = B'C, nhưng đúng phải là $\\vec{AH} = \\vec{B'C}$)." }
            ]
        },
        {
            "id": 15,
            "section": "Toán học",
            "content": "Cho $\\triangle ABC$ có M là trung điểm của BC, G là trọng tâm.",
            "image": null,
            "questionType": "group_question",
            "subQuestions": [
                { "id": "15a", "content": "$\\vec{MB}$ và $\\vec{BC}$ cùng hướng.", "questionType": "true_false", "correctAnswer": false, "explanation": "Hai vectơ này ngược hướng vì M nằm giữa B và C." },
                { "id": "15b", "content": "$\\vec{MB}=-\\vec{MC}$.", "questionType": "true_false", "correctAnswer": true, "explanation": "Vì M là trung điểm của BC, $\\vec{MB}$ và $\\vec{MC}$ là hai vectơ đối nhau." },
                { "id": "15c", "content": "$GA=2GM$.", "questionType": "true_false", "correctAnswer": false, "explanation": "Về độ dài thì $GA=2GM$, nhưng về vectơ thì $\\vec{GA}=-2\\vec{GM}$ vì chúng ngược hướng." },
                { "id": "15d", "content": "$\\vec{AG}=\\frac{1}{3}(\\vec{AB}+\\vec{AC})$.", "questionType": "true_false", "correctAnswer": true, "explanation": "Theo tính chất trọng tâm, $\\vec{AG} = \\frac{2}{3}\\vec{AM} = \\frac{2}{3} \\cdot \\frac{1}{2}(\\vec{AB}+\\vec{AC}) = \\frac{1}{3}(\\vec{AB}+\\vec{AC})$." }
            ]
        },
        {
            "id": 16,
            "section": "Toán học",
            "content": "Cho hai vectơ $\\vec{a}, \\vec{b}$ thoả mãn $|\\vec{a}|=3, |\\vec{b}|=5, (\\vec{a};\\vec{b})=120^{\\circ}$.",
            "image": null,
            "questionType": "group_question",
            "subQuestions": [
                { "id": "16a", "content": "$\\vec{a}\\cdot\\vec{b}=|\\vec{a}|\\cdot|\\vec{b}|\\cdot\\cos(\\vec{a},\\vec{b})$", "questionType": "true_false", "correctAnswer": true, "explanation": "Đây là định nghĩa của tích vô hướng." },
                { "id": "16b", "content": "$\\vec{a}\\cdot\\vec{b}=-7.5$", "questionType": "true_false", "correctAnswer": true, "explanation": "$\\vec{a}\\cdot\\vec{b} = 3 \\cdot 5 \\cdot \\cos(120^\\circ) = 15 \\cdot (-1/2) = -7.5$." },
                { "id": "16c", "content": "$(\\vec{a}+\\vec{b})^2=19$", "questionType": "true_false", "correctAnswer": true, "explanation": "$(\\vec{a}+\\vec{b})^2 = |\\vec{a}|^2 + 2\\vec{a}\\cdot\\vec{b} + |\\vec{b}|^2 = 3^2 + 2(-7.5) + 5^2 = 9 - 15 + 25 = 19$." },
                { "id": "16d", "content": "$(\\vec{a}+2\\vec{b})\\cdot(\\vec{a}-\\vec{b})=8.5$", "questionType": "true_false", "correctAnswer": false, "explanation": "$(\\vec{a}+2\\vec{b})\\cdot(\\vec{a}-\\vec{b}) = |\\vec{a}|^2 + \\vec{a}\\cdot\\vec{b} - 2|\\vec{b}|^2 = 9 + (-7.5) - 2(25) = 1.5 - 50 = -48.5$." }
            ]
        },
        {
            "id": 17,
            "section": "Toán học",
            "content": "Cho tam giác đều ABC có cạnh bằng 3. Gọi M, N lần lượt là trung điểm của AB và AC. Tính độ dài véctơ $\\vec{MN}$ (ghi kết quả dưới dạng số thập phân).",
            "image": null,
            "questionType": "short_answer",
            "correctAnswer": "1.5",
            "explanation": "MN là đường trung bình của tam giác ABC, do đó $MN = \\frac{1}{2}BC = \\frac{3}{2} = 1.5$."
        },
        {
            "id": 18,
            "section": "Toán học",
            "content": "Cho hình chữ nhật ABCD có $AB=\\sqrt{3}$, $BC=2$. Tính độ dài của véctơ $\\vec{u}=\\vec{AB}+\\vec{AC}$.",
            "image": null,
            "questionType": "short_answer",
            "correctAnswer": "4",
            "explanation": "Dựng điểm E sao cho ABEC là hình bình hành. Khi đó $\\vec{u}=\\vec{AB}+\\vec{AC} = \\vec{AE}$. $|\\vec{u}|=AE = 2AM$ với M là trung điểm BC. $AM = \\sqrt{AB^2+BM^2} = \\sqrt{(\\sqrt{3})^2+1^2} = 2$. Vậy $|\\vec{u}|=4$."
        },
        {
            "id": 19,
            "section": "Toán học",
            "content": "Cho hình thoi ABCD tâm O, góc $\\angle BAC=60^{\\circ}$. M là trung điểm AD và G là trọng tâm tam giác ABC. Biết $\\vec{GM}=\\frac{m}{3}\\vec{BA}+\\frac{n}{6}\\vec{BC}$. Tính tổng $m+n$.",
            "image": null,
            "questionType": "short_answer",
            "correctAnswer": "3",
            "explanation": "Phân tích $\\vec{GM}$ theo $\\vec{BA}$ và $\\vec{BC}$. Ta có $\\vec{GM} = \\vec{GA} + \\vec{AM}$. Dựa vào tính chất hình thoi và trọng tâm, ta tìm được $m=2, n=1$. Vậy $m+n=3$."
        },
        {
            "id": 20,
            "section": "Toán học",
            "content": "Một ca nô chuyển động thẳng đều theo hướng $S15^{\\circ}E$ với vận tốc 21 km/h. Nước sông chảy về hướng đông với vận tốc 2 km/h. Tính vận tốc riêng của ca nô (làm tròn đến hàng phần mười).",
            "image": null,
            "questionType": "short_answer",
            "correctAnswer": "20.6",
            "explanation": "Gọi $\\vec{v_t}$ là vận tốc thực, $\\vec{v_n}$ là vận tốc nước, $\\vec{v_r}$ là vận tốc riêng. Ta có $\\vec{v_t} = \\vec{v_r} + \\vec{v_n}$. Sử dụng định lý cosin: $v_r^2 = v_t^2 + v_n^2 - 2v_t v_n \\cos(75^\\circ)$. $v_r = \\sqrt{21^2 + 2^2 - 2(21)(2)\\cos(75^\\circ)} \\approx 20.6$ km/h."
        },
        {
            "id": 21,
            "section": "Toán học",
            "content": "Một máy bay bay từ đông sang tây với tốc độ 700 km/h thì gặp gió thổi từ đông bắc sang tây nam với tốc độ 40 km/h. Tìm tốc độ mới của máy bay (làm tròn đến hàng đơn vị).",
            "image": null,
            "questionType": "short_answer",
            "correctAnswer": "729",
            "explanation": "Gọi $\\vec{v_1}$ là vận tốc máy bay, $\\vec{v_2}$ là vận tốc gió. Vận tốc mới là $\\vec{v} = \\vec{v_1} + \\vec{v_2}$. Góc giữa hai vectơ vận tốc này là $135^{\\circ}$. Áp dụng định lý cosin: $|\\vec{v}|^2 = 700^2 + 40^2 - 2(700)(40)\\cos(135^\\circ) \\approx 531239$. $|\\vec{v}| \\approx 728.86$, làm tròn thành 729 km/h."
        },
        {
            "id": 22,
            "section": "Toán học",
            "content": "Cho ba lực $\\vec{F_1}=\\vec{MA}$, $\\vec{F_2}=\\vec{MB}$, $\\vec{F_3}=\\vec{MC}$ cùng tác động vào một ô tô tại M và ô tô đứng yên. Cường độ $F_1, F_2$ đều bằng 25N và góc $\\angle AMB = 60^{\\circ}$. Khi đó cường độ $F_3$ bằng bao nhiêu?",
            "image": null,
            "questionType": "short_answer",
            "correctAnswer": "43.3",
            "explanation": "Vì ô tô đứng yên, $\\vec{F_1}+\\vec{F_2}+\\vec{F_3}=\\vec{0}$. Do đó $\\vec{F_3} = -(\\vec{F_1}+\\vec{F_2})$. Cường độ $|\\vec{F_3}| = |\\vec{F_1}+\\vec{F_2}|$. Vì $|\\vec{F_1}|=|\\vec{F_2}|=25$ và góc giữa chúng là $60^\\circ$, tam giác tạo bởi hai lực này là tam giác đều. Hợp lực của chúng có độ lớn là $25\\sqrt{3} \\approx 43.3$ N."
        }
    ]
}