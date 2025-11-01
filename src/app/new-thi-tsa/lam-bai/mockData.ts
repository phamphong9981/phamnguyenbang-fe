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
