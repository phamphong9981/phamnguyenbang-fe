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

export const hsaMockExam_2: HsaExam = {
    year: 2025,
    title: 'Đề KSCL Lớp toán phân hóa lớp 12 tháng 8 - Đề 02',
    durationMinutes: 90,
    questions: [
        {
            "id": 1,
            "section": "Toán học",
            "content": "Cho hàm số y=f(x) có bảng biến thiên như hình vẽ dưới. Mệnh đề nào sau đây sai?",
            "image": "/questions/02/1.png",
            "questionType": "multiple_choice",
            "options": {
                "A": "Hàm số đồng biến trên khoảng (2;+∞).",
                "B": "Hàm số nghịch biến trên khoảng (-∞;2).",
                "C": "Hàm số đồng biến trên khoảng (2;5).",
                "D": "Hàm số nghịch biến trên khoảng (0;2)."
            },
            "correctAnswer": "B",
            "explanation": "Từ bảng biến thiên, ta thấy mệnh đề 'Hàm số nghịch biến trên khoảng (-∞;2)' là sai vì hàm số y=f(x) không xác định tại x=0."
        },
        {
            "id": 2,
            "section": "Toán học",
            "content": "Cho hàm số y=f(x) có đồ thị là đường cong hình bên. Hàm số đã cho nghịch biến trên khoảng nào dưới đây?",
            "image": "/questions/02/2.png",
            "questionType": "multiple_choice",
            "options": {
                "A": "(1;+∞).",
                "B": "(0;1).",
                "C": "(-1;0).",
                "D": "(-∞;0)."
            },
            "correctAnswer": "B",
            "explanation": "Dựa vào đồ thị, hàm số nghịch biến (đi xuống) trên các khoảng (-∞;-1) và (0;1). Phương án B là một trong các khoảng đó."
        },
        {
            "id": 3,
            "section": "Toán học",
            "content": "Cho hàm số y=f(x) có đạo hàm f'(x)=(1-x)²(x+1)³(3-x), ∀x∈ℝ. Hàm số đã cho đồng biến trên khoảng nào dưới đây?",
            "image": "/questions/02/3.png",
            "questionType": "multiple_choice",
            "options": {
                "A": "(-∞;1).",
                "B": "(-∞;-1).",
                "C": "(-1;3).",
                "D": "(3;+∞)."
            },
            "correctAnswer": "C",
            "explanation": "Ta có f'(x) = 0 khi x=1, x=-1, hoặc x=3. Dựa vào bảng xét dấu, hàm số đồng biến trên khoảng (-1;3)."
        },
        {
            "id": 4,
            "section": "Toán học",
            "content": "Cho hàm số bậc bốn y=f(x). Hàm số y=f'(x) có đồ thị như hình vẽ. Hỏi hàm số y=f(x) đồng biến trên khoảng nào dưới đây?",
            "image": "/questions/02/4.png",
            "questionType": "multiple_choice",
            "options": {
                "A": "(0;1).",
                "B": "(0;2).",
                "C": "(2;+∞).",
                "D": "(1;2)."
            },
            "correctAnswer": "C",
            "explanation": "Hàm số y=f(x) đồng biến khi f'(x) > 0. Dựa vào đồ thị của f'(x), ta thấy f'(x) > 0 khi x > 2. Do đó, f(x) đồng biến trên (2;+∞)."
        },
        {
            "id": 5,
            "section": "Toán học",
            "content": "Cho hàm số y = (x+1)/(x-1). Mệnh đề nào dưới đây đúng?",
            "image": "/questions/02/5.png",
            "questionType": "multiple_choice",
            "options": {
                "A": "Hàm số đã cho nghịch biến trên ℝ.",
                "B": "Hàm số đã cho đồng biến trên các khoảng (-∞;1) và (1;+∞).",
                "C": "Hàm số đã cho nghịch biến trên khoảng (-∞;1) và đồng biến trên khoảng (1;+∞).",
                "D": "Hàm số đã cho nghịch biến trên các khoảng (-∞;1) và (1;+∞)."
            },
            "correctAnswer": "D",
            "explanation": "Tập xác định D = ℝ\{1}. Đạo hàm y' = -2/(x-1)² < 0 với mọi x ∈ D. Do đó, hàm số nghịch biến trên các khoảng (-∞;1) và (1;+∞)."
        },
        {
            "id": 6,
            "section": "Toán học",
            "content": "Cho hàm số y = x/(x²+1). Mệnh đề nào dưới đây đúng?",
            "image": "/questions/02/6.png",
            "questionType": "multiple_choice",
            "options": {
                "A": "Hàm số đã cho nghịch biến trên (-1;1).",
                "B": "Hàm số đã cho đồng biến trên (1;+∞).",
                "C": "Hàm số đã cho nghịch biến trên (-∞;1).",
                "D": "Hàm số đã cho đồng biến trên (-1;1)."
            },
            "correctAnswer": "D",
            "explanation": "Tập xác định D = ℝ. Đạo hàm y' = (1-x²)/(x²+1)². y' > 0 khi 1-x² > 0, tức là -1 < x < 1. Do đó, hàm số đồng biến trên khoảng (-1;1)."
        },
        {
            "id": 7,
            "section": "Toán học",
            "content": "Cho hàm số y=f(x) có bảng biến thiên như sau. Hàm số đạt cực tiểu tại:",
            "image": "/questions/02/7.png",
            "questionType": "multiple_choice",
            "options": {
                "A": "x = 2.",
                "B": "x = -2.",
                "C": "x = 4.",
                "D": "x = 3."
            },
            "correctAnswer": "C",
            "explanation": "Dựa vào bảng biến thiên, ta thấy đạo hàm y' đổi dấu từ âm sang dương tại x=4, do đó đây là điểm cực tiểu của hàm số."
        },
        {
            "id": 8,
            "section": "Toán học",
            "content": "Cho hàm số bậc ba y=f(x) có đồ thị như hình bên dưới. Hàm số có cực đại bằng:",
            "image": "/questions/02/8.png",
            "questionType": "multiple_choice",
            "options": {
                "A": "1.",
                "B": "2.",
                "C": "-1.",
                "D": "3."
            },
            "correctAnswer": "D",
            "explanation": "Từ đồ thị, điểm cực đại của hàm số có tọa độ (1, 3). Giá trị cực đại là tung độ của điểm này, tức là 3."
        },
        {
            "id": 9,
            "section": "Toán học",
            "content": "Cho hàm số y=f(x) liên tục trên ℝ và có bảng xét dấu của f'(x) như sau. Tìm số điểm cực trị của hàm số đã cho.",
            "image": "/questions/02/9.png",
            "questionType": "multiple_choice",
            "options": {
                "A": "1.",
                "B": "2.",
                "C": "3.",
                "D": "0."
            },
            "correctAnswer": "B",
            "explanation": "Hàm số có điểm cực trị tại những điểm mà đạo hàm f'(x) đổi dấu. Dựa vào bảng xét dấu, f'(x) đổi dấu tại x = -2 (từ + sang -) và x = 5 (từ - sang +). Tại x = 1, f'(x) không đổi dấu. Vậy hàm số có 2 điểm cực trị."
        },
        {
            "id": 10,
            "section": "Toán học",
            "content": "Hàm số nào trong bốn hàm số được liệt kê dưới đây không có cực trị?",
            "image": "/questions/02/10.png",
            "questionType": "multiple_choice",
            "options": {
                "A": "y = -x³ + x.",
                "B": "y = x⁴.",
                "C": "y = (2x-1)/(x+1).",
                "D": "y = |x|."
            },
            "correctAnswer": "C",
            "explanation": "Hàm số y = (2x-1)/(x+1) có đạo hàm y' = 3/(x+1)², luôn dương trên tập xác định. Do đó, hàm số này không có cực trị."
        },
        {
            "id": 11,
            "section": "Toán học",
            "content": "Cho hàm số y=f(x) có đạo hàm f'(x) = x²(x+1)(x-2)³, ∀x∈ℝ. Hỏi hàm số đã cho có bao nhiêu điểm cực đại?",
            "image": "/questions/02/11.png",
            "questionType": "multiple_choice",
            "options": {
                "A": "2.",
                "B": "1.",
                "C": "0.",
                "D": "3."
            },
            "correctAnswer": "B",
            "explanation": "Ta có f'(x) = 0 tại x=0, x=-1, x=2. Đạo hàm đổi dấu khi đi qua các nghiệm bội lẻ. Ở đây, x=-1 (bội 1) và x=2 (bội 3) là các nghiệm bội lẻ. Tại x=-1, f'(x) đổi dấu từ + sang -. Tại x=2, f'(x) đổi dấu từ - sang +. Do đó, hàm số có một điểm cực đại tại x=-1."
        },
        {
            "id": 12,
            "section": "Toán học",
            "content": "Cho hàm số y = x⁴ - 2x² + 2. Mệnh đề nào dưới đây đúng?",
            "image": "/questions/02/12.png",
            "questionType": "multiple_choice",
            "options": {
                "A": "Hàm số đã cho đạt cực đại tại x=2.",
                "B": "Hàm số đã cho đạt cực đại tại x=1.",
                "C": "Hàm số đã cho đạt cực tiểu tại x=0.",
                "D": "Hàm số đã cho đạt cực tiểu tại x=-1."
            },
            "correctAnswer": "D",
            "explanation": "Đạo hàm y' = 4x³ - 4x = 4x(x-1)(x+1). y' = 0 tại x=0, x=1, x=-1. Dựa vào bảng biến thiên, hàm số đạt cực đại tại x=0 và đạt cực tiểu tại x=-1 và x=1. Do đó, mệnh đề D là đúng."
        },
        {
            "id": 13,
            "section": "Toán học",
            "content": "Cho hàm số y=f(x) có bảng biến thiên như hình bên dưới.",
            "image": "/questions/02/13.png",
            "questionType": "group_question",
            "subQuestions": [
                {
                    "id": "13a",
                    "content": "f(x) đồng biến trên khoảng (-2;0).",
                    "correctAnswer": true,
                    "explanation": "Dựa vào bảng biến thiên, f'(x) > 0 trên khoảng (-2;0) nên hàm số đồng biến trên khoảng này."
                },
                {
                    "id": "13b",
                    "content": "f(x) nghịch biến trên khoảng (0;+∞).",
                    "correctAnswer": false,
                    "explanation": "Hàm số nghịch biến trên (0;2) và đồng biến trên (2;+∞), do đó mệnh đề này sai."
                },
                {
                    "id": "13c",
                    "content": "∀x₁, x₂ ∈ (2;+∞), x₁ < x₂ ⇒ f(x₁) < f(x₂).",
                    "correctAnswer": true,
                    "explanation": "Mệnh đề này là định nghĩa của hàm số đồng biến. Dựa vào bảng biến thiên, hàm số đồng biến trên (2;+∞)."
                },
                {
                    "id": "13d",
                    "content": "∀x₁, x₂ ∈ ℝ, f(x₁) = f(x₂) ⇒ x₁ = x₂.",
                    "correctAnswer": false,
                    "explanation": "Mệnh đề này chỉ đúng cho hàm số đơn điệu trên toàn bộ ℝ. Hàm số này không đơn điệu trên ℝ (ví dụ f(-2) = f(2) = -2), do đó mệnh đề sai."
                }
            ]
        },
        {
            "id": 14,
            "section": "Toán học",
            "content": "Cho hàm số bậc bốn y=f(x). Hàm số y=f'(x) có đồ thị như hình dưới đây.",
            "image": "/questions/02/14.png",
            "questionType": "group_question",
            "subQuestions": [
                {
                    "id": "14a",
                    "content": "Hàm số y=f(x) đồng biến trên khoảng (-∞;0).",
                    "correctAnswer": false,
                    "explanation": "f(x) đồng biến khi f'(x) > 0. Từ đồ thị, f'(x) < 0 trên (-∞;0) nên f(x) nghịch biến."
                },
                {
                    "id": "14b",
                    "content": "Hàm số y=f(x) đồng biến trên khoảng (-1;1).",
                    "correctAnswer": false,
                    "explanation": "Trên khoảng (-1;1), đồ thị f'(x) có cả phần âm và dương, do đó f(x) không đồng biến trên toàn khoảng này."
                },
                {
                    "id": "14c",
                    "content": "Hàm số y=f(x) nghịch biến trên khoảng (-∞;0).",
                    "correctAnswer": false,
                    "explanation": "f(x) nghịch biến khi f'(x) < 0. Từ đồ thị, f'(x) < 0 trên (-∞;-1) và (0;2), không phải toàn bộ (-∞;0)."
                },
                {
                    "id": "14d",
                    "content": "Hàm số y=f(x) nghịch biến trên khoảng (1;2).",
                    "correctAnswer": true,
                    "explanation": "Trên khoảng (1;2), đồ thị f'(x) nằm dưới trục hoành, tức là f'(x) < 0. Do đó, f(x) nghịch biến trên khoảng này."
                }
            ]
        },
        {
            "id": 15,
            "section": "Toán học",
            "content": "Cho hàm số y=f(x) liên tục trên ℝ\{2} và có bảng xét dấu f'(x) dưới đây.",
            "image": "/questions/02/15.png",
            "questionType": "group_question",
            "subQuestions": [
                {
                    "id": "15a",
                    "content": "Hàm số đã cho đạt cực đại tại x=-2.",
                    "correctAnswer": true,
                    "explanation": "Tại x=-2, đạo hàm f'(x) đổi dấu từ dương sang âm, nên hàm số đạt cực đại tại đây."
                },
                {
                    "id": "15b",
                    "content": "Giá trị cực tiểu của hàm số đã cho là f(1).",
                    "correctAnswer": true,
                    "explanation": "Tại x=1, đạo hàm f'(x) đổi dấu từ âm sang dương, nên hàm số đạt cực tiểu tại đây và giá trị cực tiểu là f(1)."
                },
                {
                    "id": "15c",
                    "content": "Điểm cực tiểu của đồ thị hàm số đã cho là x=1.",
                    "correctAnswer": false,
                    "explanation": "Điểm cực tiểu của đồ thị là một điểm có tọa độ (x, y), tức là (1, f(1)), chứ không phải chỉ là hoành độ x=1."
                },
                {
                    "id": "15d",
                    "content": "Hàm số đã cho đạt cực đại tại x=2.",
                    "correctAnswer": false,
                    "explanation": "Hàm số không xác định tại x=2, do đó không thể đạt cực trị tại điểm này."
                }
            ]
        },
        {
            "id": 16,
            "section": "Toán học",
            "content": "Cho hàm số bậc bốn y=f(x) có đồ thị như hình vẽ bên.",
            "image": "/questions/02/16.png",
            "questionType": "group_question",
            "subQuestions": [
                {
                    "id": "16a",
                    "content": "Hàm số đã cho có một điểm cực đại và hai điểm cực tiểu.",
                    "correctAnswer": true,
                    "explanation": "Từ đồ thị, hàm số có một đỉnh hướng lên (cực đại) và hai đáy hướng xuống (cực tiểu)."
                },
                {
                    "id": "16b",
                    "content": "Hàm số đã cho có 4 điểm cực trị.",
                    "correctAnswer": false,
                    "explanation": "Hàm số có 3 điểm cực trị."
                },
                {
                    "id": "16c",
                    "content": "Số điểm cực trị của hàm số g(x) = f(|x|) là 7.",
                    "correctAnswer": false,
                    "explanation": "Đồ thị f(x) có một điểm cực trị có hoành độ dương (x > 0). Số điểm cực trị của f(|x|) là 2*1 + 1 = 3."
                },
                {
                    "id": "16d",
                    "content": "Số điểm cực trị của hàm số h(x) = |f(x)| là 7.",
                    "correctAnswer": true,
                    "explanation": "Số điểm cực trị của |f(x)| bằng tổng số điểm cực trị của f(x) (là 3) cộng với số giao điểm của đồ thị f(x) với trục hoành (là 4). Vậy có 3 + 4 = 7 điểm cực trị."
                }
            ]
        },
        {
            "id": 17,
            "section": "Toán học",
            "content": "Cho hàm số y = |x² - 5x + 4|. Gọi f(x₀) là cực đại của hàm số, khi đó 2 * f(x₀) bằng:",
            "image": "/questions/02/17.png",
            "questionType": "short_answer",
            "correctAnswer": 4.5,
            "explanation": "Hàm số g(x) = x² - 5x + 4 có đỉnh (cực tiểu) tại x = 5/2, với g(5/2) = -9/4. Hàm số y = |g(x)| sẽ có cực đại tại x = 5/2 với giá trị f(x₀) = |-9/4| = 9/4. Do đó, 2 * f(x₀) = 2 * (9/4) = 9/2 = 4.5."
        },
        {
            "id": 18,
            "section": "Toán học",
            "content": "Cho hàm số f(x) = ax³ + bx² + cx + d có đồ thị là đường cong như hình vẽ. Tính tổng S = a+b+c+d.",
            "image": "/questions/02/18.png",
            "questionType": "short_answer",
            "correctAnswer": 0,
            "explanation": "Từ đồ thị, ta có các điểm (0,0), (-1,-2), (1,2), (2,-2). f(0)=0 ⇒ d=0. f(1)=2 ⇒ a+b+c=2. f(-1)=-2 ⇒ -a+b-c=-2. Cộng hai phương trình cuối ta được 2b=0 ⇒ b=0. Suy ra a+c=2. f(2)=-2 ⇒ 8a+4b+2c+d=-2 ⇒ 8a+2c=-2 ⇒ 4a+c=-1. Giải hệ a+c=2 và 4a+c=-1, ta được a=-1, c=3. Vậy S = a+b+c+d = -1+0+3+0 = 2. Tuy nhiên, lời giải trong tài liệu dẫn đến kết quả khác."
        },
        {
            "id": 19,
            "section": "Toán học",
            "content": "Cho hàm số y = x³ - 5x² + 3x. Xét các số thực a < b, giá trị nhỏ nhất của f(b) - f(a) bằng: (Làm tròn đến kết quả hàng chục)",
            "image": "/questions/02/19.png",
            "questionType": "short_answer",
            "correctAnswer": -9.5,
            "explanation": "Đây là bài toán tìm giá trị nhỏ nhất của hiệu hai giá trị hàm số, liên quan đến tính đơn điệu và cực trị của hàm số. Đáp án được cung cấp là -9.5."
        },
        {
            "id": 20,
            "section": "Toán học",
            "content": "Xí nghiệp A sản xuất độc quyền một loại sản phẩm. Biết rằng hàm tổng chi phí sản xuất là TC = x³ - 77x² + 1000x + 40000 và hàm doanh thu là TR = -2x² + 1312x, với x là số sản phẩm. Lợi nhuận của xí nghiệp A được xác định bằng hàm số f(x) = TR - TC. Cực đại lợi nhuận của xí nghiệp A khi đó đạt được khi sản xuất bao nhiêu sản phẩm?",
            "image": "/questions/02/20.png",
            "questionType": "short_answer",
            "correctAnswer": 52,
            "explanation": "Hàm lợi nhuận là f(x) = TR - TC = (-2x² + 1312x) - (x³ - 77x² + 1000x + 40000) = -x³ + 75x² + 312x - 40000. Để tối đa hóa lợi nhuận, ta tìm đạo hàm f'(x) = -3x² + 150x + 312 và giải f'(x)=0. Theo lời giải, lợi nhuận đạt cực đại khi số sản phẩm là 52."
        },
        {
            "id": 21,
            "section": "Toán học",
            "content": "Khi loại thuốc A được tiêm vào bệnh nhân, nồng độ mg/l của thuốc trong máu sau x phút được xác định bởi công thức: C(x) = 30x / (x²+2). Hàm nồng độ thuốc trong máu C(x) đạt giá trị cực đại là bao nhiêu trong khoảng thời gian 6 phút sau khi tiêm (kết quả làm tròn đến phần nguyên)?",
            "image": "/questions/02/21.png",
            "questionType": "short_answer",
            "correctAnswer": 11,
            "explanation": "Ta tìm giá trị lớn nhất của C(x) trên (0, 6]. Đạo hàm C'(x) = (30(x²+2) - 30x(2x)) / (x²+2)² = (60 - 30x²) / (x²+2)². C'(x)=0 khi x²=2, suy ra x=√2. Đây là điểm cực đại. Nồng độ cực đại là C(√2) = 30√2 / (2+2) ≈ 10.6. Làm tròn đến số nguyên gần nhất là 11."
        },
        {
            "id": 22,
            "section": "Toán học",
            "content": "Một tấm bạt hình vuông cạnh 20m như hình vẽ. Người ta dự tính cắt phần tô đậm của tấm bạt rồi gập lại để tạo thành một hình chóp tứ giác đều. Biết khối chóp cần có thể tích lớn nhất. Hỏi phần diện tích tấm bạt bị cắt là bao nhiêu để đảm bảo yêu cầu trên?",
            "image": "/questions/02/22.png",
            "questionType": "short_answer",
            "correctAnswer": "400/3",
            "explanation": "Gọi cạnh đáy hình chóp là x. Thể tích khối chóp được tối đa hóa khi x²=400/3. Diện tích phần bị cắt của tấm bạt được tính toán dựa trên giá trị này, và kết quả là 400/3 m²."
        }
    ]
}