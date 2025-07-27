// Question interface
export interface SubQuestion {
    id: string; // a, b, c, d
    content: string;
    correctAnswer: string | boolean | number;
    explanation?: string;
}

export interface Question {
    id: number;
    section: 'Toán học' | 'Suy luận logic' | 'Đọc hiểu';
    content: string;
    image?: string; // Optional image path
    questionType: 'multiple_choice' | 'true_false' | 'short_answer' | 'group_question';
    options?: {
        A: string;
        B: string;
        C: string;
        D: string;
    } | null;
    correctAnswer?: string | boolean | number; // For single questions
    explanation?: string;
    subQuestions?: SubQuestion[]; // For group questions
}


// Đề thi HSA mock
export interface HsaExam {
    year: number;
    title: string;
    durationMinutes: number;
    questions: Question[];
}

// Đề thi HSA mock
export const hsaMockExam: HsaExam = {
    year: 2025,
    title: 'Đề KSCL Lớp toán phân hóa lớp 12 tháng 8 - Đề 01',
    durationMinutes: 90,
    questions: [
        // PHẦN I: CÂU TRẮC NGHIỆM NHIỀU PHƯƠNG ÁN LỰA CHỌN
        {
            id: 1,
            section: "Toán học",
            content: "Cho hàm số bậc ba $y = f(x)$ có đồ thị là đường cong như trong hình bên. Hàm số đã cho nghịch biến trên khoảng nào dưới đây?",
            options: {
                A: "$(0, 2)$",
                B: "$(-\\infty, 0)$",
                C: "$(1, 2)$",
                D: "$(-1, 1)$"
            },
            questionType: "multiple_choice",
            image: "/questions/1.png",
            correctAnswer: "D",
            explanation: "Từ đồ thị hàm số, ta thấy trong khoảng $(-1, 1)$, khi $x$ tăng thì $y$ giảm, do đó hàm số nghịch biến trên khoảng này. Vậy đáp án đúng là $D$."
        },
        {
            id: 2,
            section: "Toán học",
            content: "Đồ thị hàm số nào dưới đây có dạng như đường cong trong hình bên?",
            options: {
                A: "$y = x^3 - x$",
                B: "$y = x^3 + x$",
                C: "$y = -x^3 + x$",
                D: "$y = -x^3 - x$"
            },
            questionType: "multiple_choice",
            image: "/questions/2.png",
            correctAnswer: "C",
            explanation: "Đồ thị hàm bậc ba có dạng đi xuống khi $x \\to \\infty$, nghĩa là hệ số $a < 0$. Hàm $y = -x^3 + x$ có $a = -1 < 0$, phù hợp với đồ thị. Vậy đáp án đúng là $C$."
        },
        {
            id: 3,
            section: "Toán học",
            content: "Cho hàm số $y = f(x)$ có bảng biến thiên như sau. Tổng số đường tiệm cận đứng và tiệm cận ngang của đồ thị hàm số đã cho là bao nhiêu?",
            options: {
                A: "3",
                B: "2",
                C: "4",
                D: "1"
            },
            questionType: "multiple_choice",
            image: "/questions/3.png",
            correctAnswer: "A",
            explanation: "Từ bảng biến thiên: khi $x \\to -\\infty$, $y \\to 1$ (tiệm cận ngang $y = 1$); khi $x \\to +\\infty$, $y \\to -2$ (tiệm cận ngang $y = -2$); khi $x \\to 2$, $y \\to +\\infty$ (tiệm cận đứng $x = 2$). Tổng số tiệm cận là $2 + 1 = 3$. Vậy đáp án đúng là $A$."
        },
        {
            id: 4,
            section: "Toán học",
            content: "Cho hàm số $y = f(x)$ có đồ thị như hình vẽ. Số đường tiệm cận của đồ thị hàm số là bao nhiêu?",
            options: {
                A: "1",
                B: "2",
                C: "0",
                D: "3"
            },
            questionType: "multiple_choice",
            image: "/questions/4.png",
            correctAnswer: "B",
            explanation: "Dựa vào đồ thị, khi $x \\to -\\infty$, $y \\to 1$ và khi $x \\to +\\infty$, $y \\to -1$, nên có hai tiệm cận ngang. Không có tiệm cận đứng hay xiên. Vậy số tiệm cận là $2$, đáp án đúng là $B$."
        },
        {
            id: 5,
            section: "Toán học",
            content: "Tiệm cận đứng của đồ thị hàm số $y = \\frac{2x - 1}{x + 3}$ là đường thẳng nào trong các đường thẳng sau?",
            options: {
                A: "$y = -3$",
                B: "$y = -1$",
                C: "$x = -3$",
                D: "$x = 2$"
            },
            questionType: "multiple_choice",
            image: "/questions/5.png",
            correctAnswer: "C",
            explanation: "Tập xác định: $x \\neq -3$. Tính giới hạn: $\\lim_{x \\to -3^+} \\frac{2x - 1}{x + 3} = +\\infty$, $\\lim_{x \\to -3^-} \\frac{2x - 1}{x + 3} = -\\infty$. Vậy $x = -3$ là tiệm cận đứng. Đáp án đúng là $C$."
        },
        {
            id: 6,
            section: "Toán học",
            content: "Khẳng định nào sau đây đúng về tính đơn điệu của hàm số $y = \\frac{2x + 4}{1 - x}$?",
            options: {
                A: "Hàm số đồng biến trên các khoảng $(-\\infty, 1]$ và $[1, +\\infty)$",
                B: "Hàm số nghịch biến trên các khoảng $(-\\infty, 1] \\text{ và } (1, +\\infty)$",
                C: "Hàm số nghịch biến trên các khoảng $(-\\infty, 1]$ và $[1, +\\infty)$",
                D: "Hàm số đồng biến trên các khoảng $(-\\infty, -1]$ và $(-1, +\\infty)$"
            },
            questionType: "multiple_choice",
            image: "/questions/6.png",
            correctAnswer: "A",
            explanation: "Tập xác định: $x \\neq 1$. Đạo hàm $y' = \\frac{6}{(1 - x)^2} > 0$ với mọi $x \\neq 1$, nên hàm số đồng biến trên $(-\\infty, 1)$ và $(1, +\\infty)$. Không có lựa chọn nào khớp hoàn toàn với kết quả này, có thể tài liệu có lỗi in."
        },
        {
            id: 7,
            section: "Toán học",
            content: "Tiệm cận xiên của đồ thị hàm số $y = \\frac{x^2 - 3x - 7}{x + 2}$ là gì?",
            options: {
                A: "$y = x + 2$",
                B: "$y = x + 4$",
                C: "$y = x - 3$",
                D: "$y = x - 5$"
            },
            questionType: "multiple_choice",
            image: "/questions/7.png",
            correctAnswer: "D",
            explanation: "Thực hiện phép chia: $y = x - 5 - \\frac{17}{x + 2}$. Khi $x \\to \\pm\\infty$, $\\frac{-17}{x + 2} \\to 0$, nên tiệm cận xiên là $y = x - 5$. Đáp án đúng là $D$."
        },
        {
            id: 8,
            section: "Toán học",
            content: "Giá trị cực tiểu của hàm số $y = \\frac{x^2 + x + 4}{x + 1}$ là bao nhiêu?",
            options: {
                A: "$y_{CT} = -5$",
                B: "$y_{CT} = 3$",
                C: "$y_{CT} = 1$",
                D: "$y_{CT} = -3$"
            },
            questionType: "multiple_choice",
            image: "/questions/8.png",
            correctAnswer: "B",
            explanation: "Tập xác định: $x \\neq -1$. Biến đổi: $y = x + \\frac{4}{x + 1}$. Đạo hàm: $y' = 1 - \\frac{4}{(x + 1)^2} = 0$ khi $x = 1$ hoặc $x = -3$. Tại $x = 1$, $y = 3$ (cực tiểu); tại $x = -3$, $y = -5$ (cực đại). Vậy $y_{CT} = 3$, đáp án $B$."
        },
        {
            id: 9,
            section: "Toán học",
            content: "Cho hàm số $f(x)$ có đạo hàm $f'(x) = x(x - 1)(x + 4)^3$, $x \\neq j$. Số điểm cực tiểu của hàm số đã cho là bao nhiêu?",
            options: {
                A: "2",
                B: "3",
                C: "4",
                D: "1"
            },
            questionType: "multiple_choice",
            image: "/questions/9.png",
            correctAnswer: "A",
            explanation: "$f'(x) = 0$ tại $x = 0$, $x = 1$, $x = -4$. Bảng biến thiên cho thấy $f'(x)$ đổi dấu từ âm sang dương tại $x = 0$ và $x = 1$, nên có 2 điểm cực tiểu. Đáp án đúng là $A$."
        },
        {
            id: 10,
            section: "Toán học",
            content: "Cho hàm số $y = \\sqrt{2x^2 + 1}$. Mệnh đề nào dưới đây đúng?",
            options: {
                A: "Hàm số đồng biến trên khoảng $(0, +\\infty)$",
                B: "Hàm số đồng biến trên khoảng $(-\\infty, 0)$",
                C: "Hàm số nghịch biến trên khoảng $(0, +\\infty)$",
                D: "Hàm số nghịch biến trên khoảng $(-1, 1)$"
            },
            questionType: "multiple_choice",
            image: "/questions/10.png",
            correctAnswer: "A",
            explanation: "Đạo hàm: $y' = \\frac{4x}{2\\sqrt{2x^2 + 1}} = \\frac{2x}{\\sqrt{2x^2 + 1}}$. Khi $x > 0$, $y' > 0$, nên hàm đồng biến trên $(0, +\\infty)$. Đáp án đúng là $A$."
        },
        {
            id: 11,
            section: "Toán học",
            content: "Từ một tấm bìa hình vuông có độ dài cạnh bằng 60 cm, người ta cắt bốn hình vuông bằng nhau cạnh $x$ ở bốn góc rồi gập thành một chiếc hộp có dạng hình hộp chữ nhật không có nắp. Cạnh hình vuông bị cắt có giá trị bao nhiêu thì thể tích của chiếc hộp là lớn nhất?",
            options: {
                A: "$x = 10 \\text{ cm}$",
                B: "$x = 12 \\text{ cm}$",
                C: "$x = 15 \\text{ cm}$",
                D: "$x = 20 \\text{ cm}$"
            },
            questionType: "multiple_choice",
            image: "/questions/11.png",
            correctAnswer: "A",
            explanation: "Thể tích: $V(x) = x(60 - 2x)^2$, $0 < x < 30$. Đạo hàm: $V' = (60 - 2x)^2 - 4x(60 - 2x) = 0$ tại $x = 10$. Bảng biến thiên xác nhận $x = 10$ là cực đại. Đáp án đúng là $A$."
        },
        {
            id: 12,
            section: "Toán học",
            content: "Trong một nhà hàng, mỗi tuần để chế biến $x$ phần ăn ($30 \\leq x \\leq 120$) thì chi phí trung bình (đơn vị nghìn đồng) của một phần ăn được cho bởi công thức: $\\bar{C}(x) = 2x - 230 + \\frac{7200}{x}$. Số phần ăn $x$ là bao nhiêu thì chi phí trung bình của mỗi phần ăn là thấp nhất?",
            options: {
                A: "$x = 40$",
                B: "$x = 50$",
                C: "$x = 60$",
                D: "$x = 70$"
            },
            questionType: "multiple_choice",
            image: "/questions/12.png",
            correctAnswer: "C",
            explanation: "Đạo hàm: $\\bar{C}'(x) = 2 - \\frac{7200}{x^2} = 0$ khi $x = 60$. Bảng biến thiên xác nhận $x = 60$ là cực tiểu trong $[30, 120]$. Đáp án đúng là $C$."
        },
        // PHẦN II: CÂU TRẮC NGHIỆM ĐÚNG SAI
        {
            id: 13,
            section: "Toán học",
            content: "Cho hàm số $y = \\frac{1}{3}x^3 - 2x^2 + m x + 1$. Xét tính đúng sai của các mệnh đề sau:",
            questionType: "group_question",
            image: "/questions/13.png",
            subQuestions: [
                {
                    id: "a",
                    content: "a) Hàm số đồng biến trên $\\mathbb{R}$ khi $m = 5$.",
                    correctAnswer: true,
                    explanation: "Khi $m = 5$, $y' = x^2 - 4x + 5 = (x - 2)^2 + 1 > 0$ với mọi $x$, nên hàm đồng biến trên $\\mathbb{R}$. Mệnh đề đúng."
                },
                {
                    id: "b",
                    content: "b) Hàm số có cực trị khi $m = 5$.",
                    correctAnswer: false,
                    explanation: "Khi $m = 5$, $y' > 0$ với mọi $x$, không có nghiệm $y' = 0$, nên hàm không có cực trị. Mệnh đề sai."
                },
                {
                    id: "c",
                    content: "c) Để hàm số có 2 cực trị thì $m < 4$.",
                    correctAnswer: true,
                    explanation: "$y' = x^2 - 4x + m = 0$ có 2 nghiệm khi $\\Delta = 16 - 4m > 0$, tức $m < 4$. Mệnh đề đúng."
                },
                {
                    id: "d",
                    content: "d) Khi $m > 4$ thì hàm số đồng biến trên $(1, 4)$.",
                    correctAnswer: true,
                    explanation: "Khi $m > 4$, $y' = x^2 - 4x + m > 0$ trên $(1, 4)$ (vì giá trị nhỏ nhất tại $x = 2$ là $m - 4 > 0$). Hàm đồng biến trên $(1, 4)$. Mệnh đề đúng."
                }
            ]
        },
        {
            id: 14,
            section: "Toán học",
            content: "Cho hàm số $y = \\frac{x + 1}{x - 3}$. Xét tính đúng sai của các mệnh đề sau:",
            questionType: "group_question",
            image: "/questions/17.png",
            subQuestions: [
                {
                    id: "a",
                    content: "a) Hàm số đồng biến trên $(-\\frac{1}{2}, 3)$.",
                    correctAnswer: false,
                    explanation: "Đạo hàm: $y' = \\frac{-4}{(x - 3)^2} < 0$ với $x \\neq 3$, nên hàm nghịch biến trên $(-\\frac{1}{2}, 3)$. Mệnh đề sai."
                },
                {
                    id: "b",
                    content: "b) Hàm số có tiệm cận ngang $y = 1$.",
                    correctAnswer: true,
                    explanation: "Khi $x \\to \\pm\\infty$, $y \\to 1$, nên hàm có tiệm cận ngang $y = 1$. Mệnh đề đúng."
                },
                {
                    id: "c",
                    content: "c) Tỉ số giữa GTLN và GTNN của hàm số trên $[4, 7]$ là $\\frac{5}{4}$.",
                    correctAnswer: false,
                    explanation: "Hàm nghịch biến trên $[4, 7]$. GTLN tại $x = 4$ là $y = 5$, GTNN tại $x = 7$ là $y = 2$. Tỉ số $5/2 = 2.5 \\neq 5/4$. Mệnh đề sai."
                },
                {
                    id: "d",
                    content: "d) Đường thẳng $y = x - m$ cắt đồ thị tại 2 điểm phân biệt.",
                    correctAnswer: true,
                    explanation: "Phương trình $x - m = \\frac{x + 1}{x - 3}$ có 2 nghiệm khi $m \\neq 1$. Vậy mệnh đề đúng với $m \\neq 1$."
                }
            ]
        },
        {
            id: 15,
            section: "Toán học",
            content: "Cho hàm số $y = \\frac{a x^2 + b x + c}{m x + n}$ có đồ thị như hình vẽ bên dưới. Xét tính đúng sai của các mệnh đề sau:",
            questionType: "group_question",
            image: "/questions/21.png",
            subQuestions: [
                {
                    id: "a",
                    content: "a) Hàm số đã cho nghịch biến trên khoảng $(-2, 0)$.",
                    correctAnswer: true,
                    explanation: "Từ đồ thị, trên $(-2, 0)$, khi $x$ tăng thì $y$ giảm, nên hàm nghịch biến. Mệnh đề đúng."
                },
                {
                    id: "b",
                    content: "b) Đồ thị của hàm số đã cho có tiệm cận đứng $x = -1$.",
                    correctAnswer: true,
                    explanation: "Từ đồ thị, khi $x \\to -1$, $y \\to \\pm\\infty$, nên $x = -1$ là tiệm cận đứng. Mệnh đề đúng."
                },
                {
                    id: "c",
                    content: "c) Đồ thị của hàm số đã cho có tiệm cận xiên $y = x + 1$.",
                    correctAnswer: true,
                    explanation: "Từ đồ thị, khi $x \\to \\pm\\infty$, đồ thị tiến gần đường thẳng $y = x + 1$, nên đây là tiệm cận xiên. Mệnh đề đúng."
                },
                {
                    id: "d",
                    content: "d) Gọi $A, B$ là 2 điểm cực trị của hàm số đã cho, diện tích tam giác $OAB$ bằng $\\sqrt{5}$.",
                    correctAnswer: false,
                    explanation: "Giả sử $A(-2, -2)$ (cực đại), $B(0, 2)$ (cực tiểu). Diện tích $S_{OAB} = 2 \\neq \\sqrt{5}$. Mệnh đề sai."
                }
            ]
        },
        {
            id: 16,
            section: "Toán học",
            content: "Cho hàm số $y = \\frac{x^2 + x - 3}{x + 2}$ có đồ thị $(C)$. Xét tính đúng sai của các mệnh đề sau:",
            questionType: "group_question",
            image: "/questions/25.png",
            subQuestions: [
                {
                    id: "a",
                    content: "a) Hàm số luôn đồng biến trên các khoảng $(-\\infty, -2)$ và $(-2, +\\infty)$.",
                    correctAnswer: true,
                    explanation: "Đạo hàm: $y' = 1 + \\frac{1}{(x + 2)^2} > 0$ với $x \\neq -2$, nên hàm đồng biến trên $(-\\infty, -2)$ và $(-2, +\\infty)$. Mệnh đề đúng."
                },
                {
                    id: "b",
                    content: "b) Đồ thị $(C)$ của hàm số đã cho có tiệm cận đứng $x = -2$.",
                    correctAnswer: true,
                    explanation: "Khi $x \\to -2$, mẫu số bằng 0, $\\lim_{x \\to -2^-} y = -\\infty$, $\\lim_{x \\to -2^+} y = +\\infty$. Vậy $x = -2$ là tiệm cận đứng. Mệnh đề đúng."
                },
                {
                    id: "c",
                    content: "c) Đồ thị $(C)$ của hàm số đã cho có tiệm cận xiên $y = x - 3$.",
                    correctAnswer: false,
                    explanation: "Biến đổi: $y = x - 1 - \\frac{1}{x + 2}$. Tiệm cận xiên là $y = x - 1$, không phải $y = x - 3$. Mệnh đề sai."
                },
                {
                    id: "d",
                    content: "d) Gọi $S$ là tập hợp tất cả các điểm có tọa độ nguyên thuộc đồ thị $(C)$. Khi đó, số phần tử của $S$ là 3.",
                    correctAnswer: false,
                    explanation: "Kiểm tra: $y(x + 2) = x^2 + x - 3$. Tại $x = -1$, $y = -3$; tại $x = -3$, $y = -3$. Chỉ tìm được 2 điểm nguyên $(-1, -3)$, $(-3, -3)$. Vậy $|S| = 2$, mệnh đề sai."
                }
            ]
        },
        // PHẦN III: CÂU TRẮC NGHIỆM TRẢ LỜI NGẮN
        {
            id: 17,
            section: "Toán học",
            content: "Khoảng cách từ điểm cực tiểu của đồ thị hàm số $y = x^3 - 2x^2 + x - 1$ đến trục hoành là bao nhiêu?",
            options: null,
            questionType: "short_answer",
            image: "/questions/29.png",
            correctAnswer: "1",
            explanation: "$y' = 3x^2 - 4x + 1 = 0$ tại $x = 1$ và $x = \\frac{1}{3}$. Tại $x = 1$, $y = -1$ (cực tiểu). Khoảng cách đến trục hoành là $|y| = 1$."
        },
        {
            id: 18,
            section: "Toán học",
            content: "Xác định giá trị của $a$ để đường tiệm cận xiên của đồ thị hàm số $f(x) = \\frac{x^2 + a x + 5}{x - 1}$ đi qua điểm $M(3, -2)$.",
            options: null,
            questionType: "short_answer",
            image: "/questions/30.png",
            correctAnswer: "-6",
            explanation: "$f(x) = x + 1 + a + \\frac{6 + a}{x - 1}$. Tiệm cận xiên: $y = x + 1 + a$. Qua $M(3, -2)$: $-2 = 3 + 1 + a \\Rightarrow a = -6$."
        },
        {
            id: 19,
            section: "Toán học",
            content: "Có bao nhiêu giá trị $m$ để đồ thị hàm số $y = \\frac{x - 2}{x^2 - 3m x + m}$ có đúng một tiệm cận đứng?",
            options: null,
            questionType: "short_answer",
            image: "/questions/31.png",
            correctAnswer: "3",
            explanation: "Mẫu số $x^2 - 3m x + m = 0$ có 1 nghiệm khi $\\Delta = 9m^2 - 4m = 0$ ($m = 0$, $m = \\frac{4}{9}$) hoặc nghiệm không phải $x = 2$. Có 3 giá trị $m$."
        },
        {
            id: 20,
            section: "Toán học",
            content: "Một cơ quan xuất bản tạp chí toán học, chi phí xuất bản $x$ cuốn tạp chí được tính theo công thức $C(x) = 0.0001x^2 + 0.2x + 10000$ (vạn đồng) với $0 < x \\leq 30000$. Chi phí phát hành cho mỗi cuốn là 4 nghìn đồng. Hỏi cần xuất bản bao nhiêu cuốn tạp chí để chi phí trung bình cho một cuốn là thấp nhất và chi phí trung bình thấp nhất đó là bao nhiêu?",
            options: null,
            questionType: "short_answer",
            image: "/questions/32.png",
            correctAnswer: "10000 cuốn, 2.2 vạn đồng",
            explanation: "$T(x) = 0.0001x^2 + 0.6x + 10000$, $M(x) = \\frac{T(x)}{x} = 0.0001x + 0.6 + \\frac{10000}{x}$. $M'(x) = 0$ tại $x = 10000$, $M(10000) = 2.2$."
        },
        {
            id: 21,
            section: "Toán học",
            content: "Con đường $XY$ xuyên qua hẻm núi được mô hình hóa bằng phương trình: $y = \\frac{x^3}{25600} - \\frac{3x}{16} + 35$. Tính tổng độ dài đoạn $MN$ và $PQ$ biết rằng $N$ và $Q$ là hai điểm đối xứng qua $Oy$, $MN$ là đoạn có độ dài lớn nhất (làm tròn đến hàng phần chục).",
            options: null,
            questionType: "short_answer",
            image: "/questions/33.png",
            correctAnswer: "49.5",
            explanation: "Parabol: $y = 60 - \\frac{3}{80}x^2$. Độ dài: $D(x) = 60 - \\frac{3}{80}x^2 - (\\frac{x^3}{25600} - \\frac{3x}{16} + 35)$. Cực đại tại $x \\approx 2.49$, $MN = 25.23$, $PQ = 24.3$. Tổng $49.5$."
        },
        {
            id: 22,
            section: "Toán học",
            content: "Tính nồng độ chất độc trong máu thấp nhất khi Bạn Hậu về đến trại để Thầy Bàng cấp cứu (làm tròn đến hàng phần chục).",
            options: null,
            questionType: "short_answer",
            image: "/questions/34.png",
            correctAnswer: "32.6",
            explanation: "Thời gian: $T(x) = \\frac{2\\sqrt{9 + x^2}}{5} + \\frac{18 - 2x}{13}$. Cực tiểu tại $x = \\frac{5}{4}$, $T = \\frac{162}{65}$. Nồng độ: $y = 50\\log(\\frac{227}{65}) \\approx 32.6$."
        }
    ]
};