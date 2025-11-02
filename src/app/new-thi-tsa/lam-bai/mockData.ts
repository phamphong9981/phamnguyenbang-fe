export interface TsaExam {
    year: number;
    title: string;
    durationMinutes: number;
    questions: Question[];
}
export interface Question {
    id: number;
    section: 'Toán học' | 'Khoa học' | 'Đọc hiểu';
    content: string;
    image?: string; 
    questionType: 'one_correct' | 'mul_correct' | 'true_false' | 'short_answer' | 'group_question' | 'drag';
    options?: {
        A: string;
        B: string;
        C: string;
        D: string;
    } | null;
    correctAnswer?: string | boolean | number; 
    explanation?: string;
    subQuestions?: SubQuestion[];
    drag?:{
      numberOfItems: number;
      items: string[];
      targets: string[][];
      //Ở đây quy ước ô trống sẽ là ký hiệu "_" là một phần tử riêng trong mảng
    }
}
export interface SubQuestion {
    id: string; // a, b, c, d
    content: string;
    correctAnswer: string | boolean | number;
    explanation?: string;
}

export const sampleExamFromHust: TsaExam = {
  year: 2023,
  title: "ĐỀ THI ĐÁNH GIÁ TƯ DUY - MÔN TOÁN (minh họa)",
  durationMinutes: 0,
  questions: [
    {
      id: 1,
      section: "Toán học",
      content:
        "Bạn Hải lấy một cặp số tự nhiên phân biệt rồi tính số dư khi chia tổng lập phương của hai số cho tổng các chữ số của số lớn trong hai số đó. Nếu làm theo đúng quy tắc của bạn Hải với cặp số $(31, 175)$ ta thu được kết quả bằng:",
      questionType: "one_correct",
      options: { A: "2", B: "5", C: "0", D: "3" },
      correctAnswer: "D"
    },
    {
      id: 2,
      section: "Toán học",
      content:
        "Cho đồ thị của một hàm bậc ba. Hoàn thành các phát biểu sau bằng các ô chọn: (1) Số điểm cực trị của hàm số là $\\_$. (2) Giá trị cực đại của hàm số là $\\_$. (3) Số giao điểm giữa đồ thị và trục hoành là $\\_$.",
      questionType: "group_question",
      image:"/questions/newtsa/dothi.png",
      options: null,
      subQuestions: [
        { id: "a", content: "Số điểm cực trị của hàm số là $\\_$", correctAnswer: 'A' },
        { id: "b", content: "Giá trị cực đại của hàm số là $\\_$", correctAnswer: 'A' },
        { id: "c", content: "Số giao điểm của đồ thị (C) và trục hoành là $\\_$", correctAnswer: 'A' }
      ]
    },
    {
      id: 3,
      section: "Toán học",
      content:
        "Từ một tam giác đều cạnh $10\\,\\text{cm}$ dựng tứ diện đều (như hình). Các phát biểu sau là Đúng/Sai? (1) Độ dài cạnh tứ diện đều bằng $10\\,\\text{cm}$. (2) Diện tích toàn phần = $\\_$. (3) Thể tích = $\\_$.",
      questionType: "group_question",
      options: null,
      image:"/questions/newtsa/mockcau3.png",
      subQuestions: [
        { id: "a", content: "Độ dài cạnh tứ diện đều là $10\\,\\text{cm}$.", correctAnswer: 'A' },
        { id: "b", content: "Diện tích toàn phần của tứ diện đều = (công thức trong đề).", correctAnswer: 'A' },
        { id: "c", content: "Thể tích của tứ diện đều = (công thức trong đề).", correctAnswer:'A'}
      ]
    },
    {
      id: 4,
      section: "Toán học",
      content:
        "Cho một hàm $f$ (bậc ba) và định nghĩa $P(x)=x f'(x)-f(x)-f'(1)$ (như mô tả trong đề). Hỏi: (a) Giá trị $P\\left(\\tfrac{1}{27}\\right)$ là bao nhiêu? (b) Số nghiệm nguyên trong $[1,5]$ của bất phương trình $P(x)<-1$ là bao nhiêu? (c) Số nghiệm thực của phương trình $P(x)=-2$ là bao nhiêu?",
      questionType: "group_question",
      options: null,
      subQuestions: [
        { id: "a", content: "Giá trị $P\\left(\\tfrac{1}{27}\\right)$", correctAnswer: 'A' },
        { id: "b", content: "Số nghiệm nguyên của $P(x)<-1$ trên $[1,5]$", correctAnswer: 'A' },
        { id: "c", content: "Số nghiệm thực của $P(x)=-2$", correctAnswer: 'A' }
      ]
    },
    {
      id: 5,
      section: "Toán học",
      content:
        "Một mã kiểm tra gồm $5$ chữ số (mỗi chữ số chọn ngẫu nhiên từ $0$ đến $9$). Xác suất để mã có ít nhất hai chữ số $0$ là (làm tròn đến 4 chữ số thập phân).",
      questionType: "one_correct",
      options: { A: "0,0729", B: "0,0815", C: "0,9185", D: "0,1000" },
      correctAnswer: "B"
    },
    {
      id: 6,
      section: "Toán học",
      image:"/questions/newtsa/mockcau6.png",
      content:
        "Xét tờ giấy ca-rô $m\\times n$ ô. Một phân chia 'tốt' là chia bằng các đường kẻ sao cho mỗi phần là hình vuông $p\\times p$ ô. Hỏi: số cách phân chia 'tốt' cho tờ $120\\times 300$ là bao nhiêu?",
      questionType: "one_correct",
      options: { A: "12 cách", B: "60 cách", C: "30 cách", D: "36000 cách" },
      correctAnswer: "A"
    },
    {
      id: 7,
      section: "Toán học",
      content:
        "Tổng tất cả các nghiệm thuộc đoạn $[a,b]$ của phương trình $\\sin^3 x + \\cos^2 x = 0$ là ... (làm tròn đến 2 chữ số thập phân, lấy $\\pi\\approx 3{,}14$).",
      questionType: "short_answer",
      options: null,
      correctAnswer: 4.71
    },
    {
      id: 8,
      section: "Toán học",
      content:
        "Cho $f(x)=x^3-3x^2-3x+m$. Nếu giá trị nhỏ nhất của $f$ trên đoạn $[-1,1]$ bằng $1$, thì $m$ thuộc khoảng nào?",
      questionType: "mul_correct",
      options: { A: "(0;4)", B: "(1;5)", C: "(2;6)", D: "(3;7)" },
    },
    {
      id: 9,
      section: "Toán học",
      content:
        "Trong không gian $Oxyz$, cho chóp đều $S.ABCD$ (toạ độ như đề). Gọi $E$ là trung điểm $BD$. Gọi $I$ là tâm mặt cầu ngoại tiếp tam giác $SAC$. Các phát biểu sau là Đúng/Sai: (1) $I$ cách đều $S,A,C$. (2) $I$ thuộc đường thẳng $SE$. (3) $I$ cách đều mặt đáy và mặt bên của hình chóp.",
      questionType: "group_question",
      options: null,
      subQuestions: [
        { id: "a", content: "$I$ cách đều $S,A,C$.", correctAnswer: 'A' },
        { id: "b", content: "$I$ nằm trên đường thẳng $SE$.", correctAnswer: 'A' },
        { id: "c", content: "$I$ cách đều mặt đáy và mặt bên.", correctAnswer: 'A' }
      ]
    },
    {
      id: 10,
      section: "Toán học",
      image:"/questions/newtsa/mockcau10.png",
      content:
        "Mẫu đồ chơi gồm một khối nón và một khối trụ cùng bán kính, chồng lên nhau. Chiều cao khối trụ và khối nón đều là $2\\,\\text{cm}$ (bằng đường kính đáy). Hỏi: (a) Thể tích gỗ cần dùng (cm$^3$)? (b) Diện tích bề mặt cần sơn (cm$^2$)? (c) Diện tích bìa cứng làm hộp (cm$^2$)? (làm tròn đến 2 chữ số thập phân).",
      questionType: "group_question",
      options: null,
      subQuestions: [
        { id: "a", content: "Thể tích (cm$^3$)", correctAnswer: 'A' },
        { id: "b", content: "Diện tích bề mặt cần sơn (cm$^2$)", correctAnswer: 'A'},
        { id: "c", content: "Diện tích bìa cứng (cm$^2$)", correctAnswer: 'A'}
      ]
    },
    {
      id: 11,
      section: "Toán học",
      content:
        "Một bể cá hình hộp chữ nhật không nắp có thể tích $3{,}2\\,\\text{m}^3$ và chiều cao gấp $2$ lần chiều rộng đáy. Biết giá $1\\,\\text{m}^2$ kính = $1$ triệu đồng. Hỏi số tiền tối thiểu mua kính (triệu đồng) là bao nhiêu?",
      questionType: "short_answer",
      options: null,
      correctAnswer: 12
    },
    {
      id: 12,
      section: "Toán học",
      content:
        "Gọi $S$ là tập các giá trị nguyên dương của $m$ sao cho phương trình (theo đề) có đúng $11$ nghiệm phân biệt. Tổng các phần tử của $S$ là: (A) $11$ (B) $9$ (C) $6$ (D) $5$",
      questionType: "one_correct",
      options: { A: "11", B: "9", C: "6", D: "5" },
      correctAnswer: "A"
    }
  ]
};
