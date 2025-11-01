import React from 'react'

const mockExamDataBe =  {
    "examId": "EX2025-001",
    "title": "Bài thi đánh giá năng lực tổng hợp",
    "duration": 45,
    "questions": [
        {
        "id": 1,
        "type": "single_choice",
        "questionText": "Thủ đô của Việt Nam là gì?",
        "imageUrl": null,
        "options": [
            { "id": "A", "text": "TP. Hồ Chí Minh" },
            { "id": "B", "text": "Hà Nội" },
            { "id": "C", "text": "Đà Nẵng" },
            { "id": "D", "text": "Huế" }
        ]
        },
        {
        "id": 2,
        "type": "multiple_choice",
        "questionText": "Chọn các nguyên tố là kim loại.",
        "imageUrl": "https://cdn.myexam.com/images/periodic_table.png",
        "options": [
            { "id": "A", "text": "Fe" },
            { "id": "B", "text": "O" },
            { "id": "C", "text": "Na" },
            { "id": "D", "text": "Cl" }
        ]
        },
        {
        "id": 3,
        "type": "true_false_group",
        "questionText": "Xác định đúng/sai cho các phát biểu sau:",
        "subQuestions": [
            {
            "id": "3.1",
            "text": "Ánh sáng truyền đi theo đường thẳng trong môi trường đồng tính.",
            "options": [
                { "id": "T", "text": "Đúng" },
                { "id": "F", "text": "Sai" }
            ]
            },
            {
            "id": "3.2",
            "text": "Âm thanh truyền nhanh hơn ánh sáng.",
            "options": [
                { "id": "T", "text": "Đúng" },
                { "id": "F", "text": "Sai" }
            ]
            },
            {
            "id": "3.3",
            "text": "Tia sáng có thể bị phản xạ.",
            "options": [
                { "id": "T", "text": "Đúng" },
                { "id": "F", "text": "Sai" }
            ]
            }
        ]
        },
        {
        "id": 4,
        "type": "fill_in_blank",
        "questionText": "Điền từ thích hợp vào chỗ trống: 'Nước sôi ở ___ °C (ở điều kiện tiêu chuẩn)'.",
        "imageUrl": null,
        "blanks": [
            { "id": "blank1", "placeholder": "Điền số..." }
        ]
        }
    ]
}
