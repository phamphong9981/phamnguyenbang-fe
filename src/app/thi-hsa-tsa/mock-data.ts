// Question interface

export interface Question {

    id: number;

    section: 'Toán học' | 'Suy luận logic' | 'Đọc hiểu';

    content: string;

    options: {

        A: string;

        B: string;

        C: string;

        D: string;

    };

    correctAnswer: keyof Question['options'];

    explanation?: string;

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
    title: 'Đề Thi Thử Đánh Giá Năng Lực & Tư Duy - Đề 01',
    durationMinutes: 90,
    questions: [
        // Phần 1: Toán học
        {
            id: 1,
            section: 'Toán học',
            content: 'Cho $a = \\log_2 3$ và $b = \\log_2 5$. Tính giá trị của biểu thức $P = \\log_2 180$ theo $a$ và $b$.',
            options: {
                A: '$2a + b + 2$',
                B: '$a + 2b + 2$',
                C: '$2a + b + 1$',
                D: '$a + b + 4$',
            },
            correctAnswer: 'A',
            explanation: 'Ta có: $P = \\log_2 180 = \\log_2(36 \\cdot 5) = \\log_2(2^2 \\cdot 3^2 \\cdot 5) = \\log_2(2^2) + \\log_2(3^2) + \\log_2 5 = 2 + 2\\log_2 3 + \\log_2 5 = 2 + 2a + b$.'
        },
        {
            id: 2,
            section: 'Toán học',
            content: 'Một hình nón có bán kính đáy $r = 5$ cm và độ dài đường sinh $l = 13$ cm. Tính thể tích của khối nón đó.',
            options: {
                A: '$100\\pi \\text{ cm}^3$',
                B: '$300\\pi \\text{ cm}^3$',
                C: '$120\\pi \\text{ cm}^3$',
                D: '$144\\pi \\text{ cm}^3$',
            },
            correctAnswer: 'A',
            explanation: 'Tính chiều cao của nón: $h = \\sqrt{l^2 - r^2} = \\sqrt{13^2 - 5^2} = \\sqrt{169 - 25} = \\sqrt{144} = 12$ cm. Thể tích khối nón là: $V = \\frac{1}{3}\\pi r^2 h = \\frac{1}{3}\\pi \\cdot 5^2 \\cdot 12 = 100\\pi \\text{ cm}^3$.'
        },
        {
            id: 3,
            section: 'Toán học',
            content: 'Tìm tập nghiệm của bất phương trình $x^2 - 8x + 12 \\le 0$.',
            options: {
                A: '$(-\\infty, 2] \\cup [6, +\\infty)$',
                B: '$(2, 6)$',
                C: '$[2, 6]$',
                D: '$(-\\infty, 2) \\cup (6, +\\infty)$',
            },
            correctAnswer: 'C',
            explanation: 'Xét tam thức $f(x) = x^2 - 8x + 12$. Tam thức có hai nghiệm là $x=2$ và $x=6$. Vì hệ số $a=1 > 0$, nên $f(x) \\le 0$ khi $x$ nằm trong khoảng giữa hai nghiệm, tức là $2 \\le x \\le 6$.'
        },
        {
            id: 4,
            section: 'Toán học',
            content: 'Gieo ngẫu nhiên một con súc sắc cân đối, đồng chất hai lần. Tính xác suất để tổng số chấm trong hai lần gieo bằng 8.',
            options: {
                A: '$\\frac{1}{6}$',
                B: '$\\frac{5}{36}$',
                C: '$\\frac{1}{9}$',
                D: '$\\frac{7}{36}$',
            },
            correctAnswer: 'B',
            explanation: 'Không gian mẫu có $6 \\times 6 = 36$ phần tử. Các cặp có tổng bằng 8 là: (2, 6), (3, 5), (4, 4), (5, 3), (6, 2). Có 5 cặp thuận lợi. Vậy xác suất là $5/36$.'
        },
        {
            id: 5,
            section: 'Toán học',
            content: 'Tính tích phân $I = \\int_{0}^{1} (4x^3 - e^x) dx$.',
            options: {
                A: '$e$',
                B: '$2 - e$',
                C: '$e - 1$',
                D: '$1 - e$',
            },
            correctAnswer: 'B',
            explanation: '$I = [x^4 - e^x]_0^1 = (1^4 - e^1) - (0^4 - e^0) = (1 - e) - (0 - 1) = 1 - e + 1 = 2 - e$.'
        },
        // Phần 2: Suy luận logic
        {
            id: 6,
            section: 'Suy luận logic',
            content: 'Tìm số tiếp theo trong dãy số sau: 3, 7, 16, 35, 74, ...',
            options: {
                A: '153',
                B: '148',
                C: '150',
                D: '155',
            },
            correctAnswer: 'A',
            explanation: 'Quy luật của dãy số là: số tiếp theo = số trước đó * 2 + n, với n lần lượt là 1, 2, 3, 4, 5... Cụ thể: 7 = 3*2+1; 16 = 7*2+2; 35 = 16*2+3; 74 = 35*2+4. Vậy số tiếp theo là 74*2+5 = 153.'
        },
        {
            id: 7,
            section: 'Suy luận logic',
            content: 'Bốn người bạn An, Bình, Cường, Dũng có các chiều cao khác nhau. Biết rằng: (1) An cao hơn Cường. (2) Bình thấp hơn Dũng. (3) Cường cao hơn Dũng. Ai là người cao nhất?',
            options: {
                A: 'An',
                B: 'Bình',
                C: 'Cường',
                D: 'Dũng',
            },
            correctAnswer: 'A',
            explanation: 'Từ (1) ta có: An > Cường. Từ (3) ta có: Cường > Dũng. Từ (2) ta có: Dũng > Bình. Kết hợp lại ta có chuỗi: An > Cường > Dũng > Bình. Vậy An là người cao nhất.'
        },
        {
            id: 8,
            section: 'Suy luận logic',
            content: 'Cho mệnh đề: "Nếu trời mưa thì đường trơn". Mệnh đề nào sau đây là tương đương logic với mệnh đề đã cho?',
            options: {
                A: 'Nếu trời không mưa thì đường không trơn.',
                B: 'Nếu đường trơn thì trời mưa.',
                C: 'Trời mưa và đường không trơn.',
                D: 'Nếu đường không trơn thì trời không mưa.',
            },
            correctAnswer: 'D',
            explanation: 'Mệnh đề "Nếu P thì Q" ($P \\Rightarrow Q$) tương đương logic với mệnh đề đảo ngược phủ định (contrapositive) là "Nếu không Q thì không P" ($\\neg Q \\Rightarrow \\neg P$).'
        },
        // Phần 3: Đọc hiểu
        {
            id: 9,
            section: 'Đọc hiểu',
            content: 'Đọc đoạn văn sau và trả lời câu hỏi:\n"Trí tuệ nhân tạo (AI) là một lĩnh vực của khoa học máy tính nhằm tạo ra các máy móc thông minh có khả năng thực hiện các nhiệm vụ thường đòi hỏi trí thông minh của con người. Các ứng dụng của AI rất đa dạng, từ các trợ lý ảo trên điện thoại thông minh, hệ thống gợi ý sản phẩm trên các trang thương mại điện tử, đến xe tự lái và chẩn đoán y khoa. Mặc dù AI mang lại nhiều lợi ích to lớn, nó cũng đặt ra những thách thức về đạo đức và xã hội, bao gồm các vấn đề về quyền riêng tư, sự mất mát việc làm do tự động hóa, và nguy cơ thiên vị trong các thuật toán."\n\nĐoạn văn chủ yếu thảo luận về vấn đề gì?',
            options: {
                A: 'Lịch sử phát triển của trợ lý ảo.',
                B: 'Những rủi ro duy nhất của xe tự lái.',
                C: 'Tổng quan về định nghĩa, ứng dụng và thách thức của Trí tuệ nhân tạo.',
                D: 'Cách các thuật toán AI bị thiên vị.',
            },
            correctAnswer: 'C',
            explanation: 'Đoạn văn giới thiệu định nghĩa của AI, liệt kê các ứng dụng và sau đó đề cập đến các thách thức liên quan. Do đó, nó mang tính tổng quan về nhiều khía cạnh của AI.'
        },
        {
            id: 10,
            section: 'Đọc hiểu',
            content: 'Đọc đoạn văn sau và trả lời câu hỏi:\n"Trí tuệ nhân tạo (AI) là một lĩnh vực của khoa học máy tính nhằm tạo ra các máy móc thông minh có khả năng thực hiện các nhiệm vụ thường đòi hỏi trí thông minh của con người. Các ứng dụng của AI rất đa dạng, từ các trợ lý ảo trên điện thoại thông minh, hệ thống gợi ý sản phẩm trên các trang thương mại điện tử, đến xe tự lái và chẩn đoán y khoa. Mặc dù AI mang lại nhiều lợi ích to lớn, nó cũng đặt ra những thách thức về đạo đức và xã hội, bao gồm các vấn đề về quyền riêng tư, sự mất mát việc làm do tự động hóa, và nguy cơ thiên vị trong các thuật toán."\n\nTheo đoạn văn, điều nào sau đây KHÔNG phải là một thách thức do AI đặt ra?',
            options: {
                A: 'Quyền riêng tư của người dùng.',
                B: 'Sự gia tăng chi phí cho phần cứng máy tính.',
                C: 'Sự thiên vị trong các quyết định của thuật toán.',
                D: 'Mất việc làm ở một số ngành nghề.',
            },
            correctAnswer: 'B',
            explanation: 'Đoạn văn liệt kê các thách thức bao gồm "quyền riêng tư, sự mất mát việc làm do tự động hóa, và nguy cơ thiên vị trong các thuật toán". Chi phí phần cứng không được đề cập đến như một thách thức.'
        },
        {
            id: 11,
            section: 'Đọc hiểu',
            content: 'Đọc đoạn văn sau và trả lời câu hỏi:\n"Kinh tế tuần hoàn là một mô hình kinh tế trong đó các hoạt động thiết kế, sản xuất và dịch vụ đều nhắm đến việc kéo dài tuổi thọ của vật chất, và loại bỏ tác động tiêu cực đến môi trường. Thay vì mô hình "sản xuất, sử dụng, vứt bỏ" truyền thống, kinh tế tuần hoàn khuyến khích việc tái sử dụng, sửa chữa, tái sản xuất và tái chế để tạo ra một chu trình khép kín. Điều này không chỉ giúp giảm thiểu rác thải và ô nhiễm mà còn tiết kiệm tài nguyên và năng lượng, mở ra những cơ hội kinh doanh mới."\n\nMô hình kinh tế truyền thống được mô tả trong đoạn văn là gì?',
            options: {
                A: 'Tái sử dụng, sửa chữa, tái chế',
                B: 'Sản xuất, sử dụng, vứt bỏ',
                C: 'Thiết kế, sản xuất, dịch vụ',
                D: 'Tiết kiệm tài nguyên và năng lượng',
            },
            correctAnswer: 'B',
            explanation: 'Đoạn văn nêu rõ: "Thay vì mô hình \'sản xuất, sử dụng, vứt bỏ\' truyền thống, kinh tế tuần hoàn khuyến khích..."'
        },
        {
            id: 12,
            section: 'Đọc hiểu',
            content: 'Đọc đoạn văn sau và trả lời câu hỏi:\n"Kinh tế tuần hoàn là một mô hình kinh tế trong đó các hoạt động thiết kế, sản xuất và dịch vụ đều nhắm đến việc kéo dài tuổi thọ của vật chất, và loại bỏ tác động tiêu cực đến môi trường. Thay vì mô hình "sản xuất, sử dụng, vứt bỏ" truyền thống, kinh tế tuần hoàn khuyến khích việc tái sử dụng, sửa chữa, tái sản xuất và tái chế để tạo ra một chu trình khép kín. Điều này không chỉ giúp giảm thiểu rác thải và ô nhiễm mà còn tiết kiệm tài nguyên và năng lượng, mở ra những cơ hội kinh doanh mới."\n\nLợi ích nào của kinh tế tuần hoàn KHÔNG được đề cập trực tiếp trong đoạn văn?',
            options: {
                A: 'Giảm thiểu rác thải và ô nhiễm.',
                B: 'Tiết kiệm tài nguyên thiên nhiên.',
                C: 'Tạo ra các cơ hội kinh doanh mới.',
                D: 'Cải thiện sức khỏe cộng đồng.',
            },
            correctAnswer: 'D',
            explanation: 'Các lợi ích được đề cập là giảm rác thải, tiết kiệm tài nguyên, tiết kiệm năng lượng và tạo cơ hội kinh doanh. Cải thiện sức khỏe cộng đồng có thể là một hệ quả gián tiếp, nhưng không được đề cập trực tiếp.'
        },
    ]
};