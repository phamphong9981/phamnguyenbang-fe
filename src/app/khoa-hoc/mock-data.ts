export interface Comment {
    id: string
    user_name: string
    user_avatar: string
    content: string
    created_at: string
    likes: number
    replies?: Comment[]
}

export interface Video {
    id: string
    s3_video: string
    s3_thumbnail: string
    title: string
    created_at: string
    description?: string
    views?: number
    likes?: number
    comments?: Comment[]
}

export interface Chapter {
    id: string
    name: string
    theoryVideos: Video[]
    exerciseVideos: Video[]
}

export interface Grade {
    id: string
    name: string
    chapters: Chapter[]
}

export interface Subject {
    id: string
    name: string
    grades?: Grade[]
    videos?: Video[]
}

// Mock data cho comments
export const mockComments: Comment[] = [
    {
        id: '1',
        user_name: 'Nguyễn Văn A',
        user_avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face',
        content: 'Bài giảng rất hay và dễ hiểu! Cảm ơn thầy đã chia sẻ kiến thức.',
        created_at: '2 giờ trước',
        likes: 12,
        replies: [
            {
                id: '1-1',
                user_name: 'Trần Thị B',
                user_avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face',
                content: 'Đồng ý với bạn! Thầy giảng rất chi tiết.',
                created_at: '1 giờ trước',
                likes: 5
            }
        ]
    },
    {
        id: '2',
        user_name: 'Lê Văn C',
        user_avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face',
        content: 'Có ai giải thích thêm về phần cực trị không? Mình vẫn chưa hiểu rõ lắm.',
        created_at: '3 giờ trước',
        likes: 8
    },
    {
        id: '3',
        user_name: 'Phạm Thị D',
        user_avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face',
        content: 'Thầy có thể làm thêm video về bài tập ứng dụng không ạ?',
        created_at: '5 giờ trước',
        likes: 15
    },
    {
        id: '4',
        user_name: 'Hoàng Văn E',
        user_avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40&h=40&fit=crop&crop=face',
        content: 'Phần này khó quá, mình phải xem lại nhiều lần mới hiểu được.',
        created_at: '6 giờ trước',
        likes: 7
    },
    {
        id: '5',
        user_name: 'Vũ Thị F',
        user_avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=40&h=40&fit=crop&crop=face',
        content: 'Thầy giảng rất rõ ràng, mình đã hiểu được cách làm bài tập rồi!',
        created_at: '7 giờ trước',
        likes: 9
    },
    {
        id: '6',
        user_name: 'Đặng Văn G',
        user_avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face',
        content: 'Có bạn nào có thể chia sẻ thêm tài liệu tham khảo không?',
        created_at: '8 giờ trước',
        likes: 3
    },
    {
        id: '7',
        user_name: 'Lý Thị H',
        user_avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face',
        content: 'Bài giảng này rất hữu ích cho kỳ thi sắp tới!',
        created_at: '9 giờ trước',
        likes: 11
    },
    {
        id: '8',
        user_name: 'Trịnh Văn I',
        user_avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face',
        content: 'Thầy có thể giải thích thêm về phần ứng dụng thực tế không?',
        created_at: '10 giờ trước',
        likes: 6
    }
]

// Mock data cho 3 môn học
export const mockSubjects: Subject[] = [
    {
        id: 'toan',
        name: 'Toán THPT',
        grades: [
            {
                id: 'lop10',
                name: 'Lớp 10',
                chapters: [
                    {
                        id: 'chuong1',
                        name: 'Chương 1: Mệnh đề - Tập hợp',
                        theoryVideos: [],
                        exerciseVideos: []
                    },
                    {
                        id: 'chuong2',
                        name: 'Chương 2: Hàm số bậc nhất và bậc hai',
                        theoryVideos: [],
                        exerciseVideos: []
                    },
                    {
                        id: 'chuong3',
                        name: 'Chương 3: Phương trình - Hệ phương trình',
                        theoryVideos: [],
                        exerciseVideos: []
                    },
                    {
                        id: 'chuong4',
                        name: 'Chương 4: Bất đẳng thức - Bất phương trình',
                        theoryVideos: [],
                        exerciseVideos: []
                    }
                ]
            },
            {
                id: 'lop11',
                name: 'Lớp 11',
                chapters: [
                    {
                        id: 'chuong1',
                        name: 'Chương 1: Hàm số lượng giác và phương trình lượng giác',
                        theoryVideos: [],
                        exerciseVideos: []
                    },
                    {
                        id: 'chuong2',
                        name: 'Chương 2: Tổ hợp - Xác suất',
                        theoryVideos: [],
                        exerciseVideos: []
                    },
                    {
                        id: 'chuong3',
                        name: 'Chương 3: Dãy số - Cấp số cộng và cấp số nhân',
                        theoryVideos: [],
                        exerciseVideos: []
                    },
                    {
                        id: 'chuong4',
                        name: 'Chương 4: Giới hạn',
                        theoryVideos: [],
                        exerciseVideos: []
                    },
                    {
                        id: 'chuong5',
                        name: 'Chương 5: Đạo hàm',
                        theoryVideos: [],
                        exerciseVideos: []
                    }
                ]
            },
            {
                id: 'lop12',
                name: 'Lớp 12',
                chapters: [
                    {
                        id: 'chuong1',
                        name: 'Tính đơn điệu của hàm số',
                        theoryVideos: [
                            {
                                id: 'toan-1',
                                s3_video: 'https://tt-phamnguyenbang.s3.ap-southeast-2.amazonaws.com/video/L%C3%BD+thuy%E1%BA%BFt+%C4%91%C6%A1n+%C4%91i%E1%BB%87u+P1.mp4',
                                s3_thumbnail: 'https://tt-phamnguyenbang.s3.ap-southeast-2.amazonaws.com/video/L%C3%BD+thuy%E1%BA%BFt+%C4%91%C6%A1n+%C4%91i%E1%BB%87u+P1.png',
                                title: 'Lý thuyết đơn điệu Buổi 1',
                                created_at: '18/07/2025',
                                description: 'Bài giảng về tính đơn điệu của hàm số, bao gồm các khái niệm cơ bản và phương pháp xác định tính đơn điệu.',
                                views: 1250,
                                likes: 89,
                                comments: mockComments
                            },
                            {
                                id: 'toan-2',
                                s3_video: 'https://tt-phamnguyenbang.s3.ap-southeast-2.amazonaws.com/video/L%C3%BD+thuy%E1%BA%BFt+%C4%91%C6%A1n+%C4%91i%E1%BB%87u+P2.mp4',
                                s3_thumbnail: 'https://tt-phamnguyenbang.s3.ap-southeast-2.amazonaws.com/video/L%C3%BD+thuy%E1%BA%BFt+%C4%91%C6%A1n+%C4%91i%E1%BB%87u+P2.png',
                                title: 'Lý thuyết đơn điệu Buổi 2',
                                created_at: '15/07/2025',
                                description: 'Tiếp tục bài giảng về tính đơn điệu với các ví dụ thực tế và bài tập ứng dụng.',
                                views: 980,
                                likes: 67,
                                comments: mockComments
                            },
                        ],
                        exerciseVideos: [
                            {
                                id: 'toan-5',
                                s3_video: 'https://tt-phamnguyenbang.s3.ap-southeast-2.amazonaws.com/video/X%C3%A9t+%C4%91%C6%A1n+%C4%91i%E1%BB%87u+c%E1%BB%A7a+h%C3%A0m+s%E1%BB%91+cho+tr%C6%B0%E1%BB%9Bc.mp4',
                                s3_thumbnail: 'https://tt-phamnguyenbang.s3.ap-southeast-2.amazonaws.com/video/X%C3%A9t+%C4%91%C6%A1n+%C4%91i%E1%BB%87u+c%E1%BB%A7a+h%C3%A0m+s%E1%BB%91+cho+tr%C6%B0%E1%BB%9Bc.png',
                                title: 'Xét đơn điệu của hàm số cho trước',
                                created_at: '12/07/2025',
                                description: 'Tìm hiểu về giá trị lớn nhất và nhỏ nhất của hàm số trên một khoảng hoặc đoạn.',
                                views: 890,
                                likes: 45,
                                comments: mockComments
                            },
                            {
                                id: 'toan-6',
                                s3_video: 'https://tt-phamnguyenbang.s3.ap-southeast-2.amazonaws.com/video/X%C3%A9t+t%C3%ADnh+%C4%91%C6%A1n+%C4%91i%E1%BB%87u+d%E1%BB%B1a+v%C3%A0o+BBT+v%C3%A0+%C4%91%E1%BB%93+th%E1%BB%8B.mp4',
                                s3_thumbnail: 'https://tt-phamnguyenbang.s3.ap-southeast-2.amazonaws.com/video/X%C3%A9t+t%C3%ADnh+%C4%91%C6%A1n+%C4%91i%E1%BB%87u+d%E1%BB%B1a+v%C3%A0o+BBT+v%C3%A0+%C4%91%E1%BB%93+th%E1%BB%8B.png',
                                title: 'Xét tính đơn điệu dựa vào BBT và đồ thị',
                                created_at: '12/07/2025',
                                description: 'Tìm hiểu về giá trị lớn nhất và nhỏ nhất của hàm số trên một khoảng hoặc đoạn.',
                                views: 890,
                                likes: 45,
                                comments: mockComments
                            },
                            {
                                id: 'toan-7',
                                s3_video: 'https://tt-phamnguyenbang.s3.ap-southeast-2.amazonaws.com/video/T%C3%ACm+tham+s%E1%BB%91+m+%C4%91%E1%BB%83+h%C3%A0m+%C4%91%C6%A1n+%C4%91i%E1%BB%87u+tr%C3%AAn+t%E1%BA%ADp+x%C3%A1c+%C4%91%E1%BB%8Bnh.mp4',
                                s3_thumbnail: 'https://tt-phamnguyenbang.s3.ap-southeast-2.amazonaws.com/video/T%C3%ACm+tham+s%E1%BB%91+m+%C4%91%E1%BB%83+h%C3%A0m+%C4%91%C6%A1n+%C4%91i%E1%BB%87u+tr%C3%AAn+t%E1%BA%ADp+x%C3%A1c+%C4%91%E1%BB%8Bnh.png',
                                title: 'Tìm tham số m để hàm đơn điệu trên tập xác định',
                                created_at: '12/07/2025',
                                description: 'Tìm hiểu về giá trị lớn nhất và nhỏ nhất của hàm số trên một khoảng hoặc đoạn.',
                                views: 890,
                                likes: 45,
                                comments: mockComments
                            },
                            {
                                id: 'toan-8',
                                s3_video: 'https://tt-phamnguyenbang.s3.ap-southeast-2.amazonaws.com/video/T%C3%ACm+tham+s%E1%BB%91+m+%C4%91%E1%BB%83+h%C3%A0m+%C4%91%C6%A1n+%C4%91i%E1%BB%87u+tr%C3%AAn+t%E1%BA%ADp+con+c%E1%BB%A7a+R.mp4',
                                s3_thumbnail: 'https://tt-phamnguyenbang.s3.ap-southeast-2.amazonaws.com/video/T%C3%ACm+tham+s%E1%BB%91+m+%C4%91%E1%BB%83+h%C3%A0m+%C4%91%C6%A1n+%C4%91i%E1%BB%87u+tr%C3%AAn+t%E1%BA%ADp+con+c%E1%BB%A7a+R.png',
                                title: 'Tìm tham số m để hàm đơn điệu trên tập con của R',
                                created_at: '12/07/2025',
                                description: 'Tìm hiểu về giá trị lớn nhất và nhỏ nhất của hàm số trên một khoảng hoặc đoạn.',
                                views: 890,
                                likes: 45,
                                comments: mockComments
                            },
                            {
                                id: 'toan-9',
                                s3_video: 'https://tt-phamnguyenbang.s3.ap-southeast-2.amazonaws.com/video/%E1%BB%A8ng+d%E1%BB%A5ng+%C4%91%C6%A1n+%C4%91i%E1%BB%87u+%C4%91%E1%BB%83+ch%E1%BB%A9ng+minh+b%E1%BA%A5t+%C4%91%E1%BA%B3ng+th%E1%BB%A9c%2C+gi%E1%BA%A3i+ph%C6%B0%C6%A1ng+trinh%2C+h%E1%BB%87+ph%C6%B0%C6%A1ng+tr%C3%ACnh.mp4',
                                s3_thumbnail: 'https://tt-phamnguyenbang.s3.ap-southeast-2.amazonaws.com/video/%E1%BB%A8ng+d%E1%BB%A5ng+%C4%91%C6%A1n+%C4%91i%E1%BB%87u+%C4%91%E1%BB%83+ch%E1%BB%A9ng+minh+b%E1%BA%A5t+%C4%91%E1%BA%B3ng+th%E1%BB%A9c%2C+gi%E1%BA%A3i+ph%C6%B0%C6%A1ng+trinh%2C+h%E1%BB%87+ph%C6%B0%C6%A1ng+tr%C3%ACnh.png',
                                title: 'Ứng dụng đơn điệu để chứng minh bất đẳng thức, giải phương trinh, hệ phương trình',
                                created_at: '12/07/2025',
                                description: 'Tìm hiểu về giá trị lớn nhất và nhỏ nhất của hàm số trên một khoảng hoặc đoạn.',
                                views: 890,
                                likes: 45,
                                comments: mockComments
                            }
                        ]
                    },
                    {
                        id: 'chuong2',
                        name: 'Cực trị hàm số',
                        theoryVideos: [{
                            id: 'toan-3',
                            s3_video: 'https://tt-phamnguyenbang.s3.ap-southeast-2.amazonaws.com/video/C%E1%BB%B1c+tr%E1%BB%8B+h%C3%A0m+s%E1%BB%91.mp4',
                            s3_thumbnail: 'https://tt-phamnguyenbang.s3.ap-southeast-2.amazonaws.com/video/C%E1%BB%B1c+tr%E1%BB%8B+h%C3%A0m+s%E1%BB%91.png',
                            title: 'Lý thuyết cực trị hàm số',
                            created_at: '12/07/2025',
                            description: 'Bài giảng về cực trị của hàm số, bao gồm cực đại, cực tiểu và các phương pháp tìm cực trị.',
                            views: 1560,
                            likes: 112,
                            comments: mockComments
                        }],
                        exerciseVideos: []
                    },
                    {
                        id: 'chuong3',
                        name: 'Giá trị lớn nhất và nhỏ nhất',
                        theoryVideos: [
                            {
                                id: 'toan-4',
                                s3_video: 'https://tt-phamnguyenbang.s3.ap-southeast-2.amazonaws.com/video/Gi%C3%A1+tr%E1%BB%8B+l%E1%BB%9Bn+nh%E1%BA%A5t+v%C3%A0+nh%E1%BB%8F+nh%E1%BA%A5t.mp4',
                                s3_thumbnail: 'https://tt-phamnguyenbang.s3.ap-southeast-2.amazonaws.com/video/Gi%C3%A1+tr%E1%BB%8B+l%E1%BB%9Bn+nh%E1%BA%A5t+v%C3%A0+nh%E1%BB%8F+nh%E1%BA%A5t.png',
                                title: 'Lý thuyết giá trị lớn nhất và nhỏ nhất',
                                created_at: '12/07/2025',
                                description: 'Tìm hiểu về giá trị lớn nhất và nhỏ nhất của hàm số trên một khoảng hoặc đoạn.',
                                views: 890,
                                likes: 45,
                                comments: mockComments
                            }
                        ],
                        exerciseVideos: []
                    },
                ]
            }
        ]
    },
    {
        id: 'tsa',
        name: 'TSA',
        grades: [
            {
                id: 'toan',
                name: 'Toán',
                chapters: [
                    {
                        id: 'chuong1',
                        name: 'Chương 1: Kiến thức cơ bản',
                        theoryVideos: [
                            {
                                id: 'tsa-toan-1',
                                s3_video: 'https://tt-phamnguyenbang.s3.ap-southeast-2.amazonaws.com/video/TSA+P1.mp4',
                                s3_thumbnail: 'https://tt-phamnguyenbang.s3.ap-southeast-2.amazonaws.com/video/TSA+P1.png',
                                title: 'TSA Toán Buổi 1',
                                created_at: '18/07/2025',
                                description: 'Bài giảng TSA Toán cơ bản, giúp học sinh nắm vững kiến thức nền tảng.',
                                views: 750,
                                likes: 34,
                                comments: mockComments
                            }
                        ],
                        exerciseVideos: []
                    },
                    {
                        id: 'chuong2',
                        name: 'Chương 2: Bài tập nâng cao',
                        theoryVideos: [],
                        exerciseVideos: []
                    }
                ]
            },
            {
                id: 'van',
                name: 'Văn',
                chapters: [
                    {
                        id: 'chuong1',
                        name: 'Chương 1: Đọc hiểu văn bản',
                        theoryVideos: [],
                        exerciseVideos: []
                    },
                    {
                        id: 'chuong2',
                        name: 'Chương 2: Viết văn bản',
                        theoryVideos: [],
                        exerciseVideos: []
                    }
                ]
            }
        ]
    },
    {
        id: 'hsa',
        name: 'HSA',
        grades: [
            {
                id: 'toan',
                name: 'Toán',
                chapters: [
                    {
                        id: 'chuong1',
                        name: 'Chương 1: Kiến thức cơ bản',
                        theoryVideos: [
                            {
                                id: 'hsa-toan-1',
                                s3_video: 'https://tt-phamnguyenbang.s3.ap-southeast-2.amazonaws.com/video/HSA+P1.mp4',
                                s3_thumbnail: 'https://tt-phamnguyenbang.s3.ap-southeast-2.amazonaws.com/video/HSA+P1.png',
                                title: 'HSA Toán buổi 1',
                                created_at: '18/07/2025',
                                description: 'Bài giảng HSA Toán buổi 1, tập trung vào các kiến thức cơ bản và phương pháp học hiệu quả.',
                                views: 920,
                                likes: 56,
                                comments: mockComments
                            },
                            {
                                id: 'hsa-toan-2',
                                s3_video: 'https://tt-phamnguyenbang.s3.ap-southeast-2.amazonaws.com/video/HSA+P2.mp4',
                                s3_thumbnail: 'https://tt-phamnguyenbang.s3.ap-southeast-2.amazonaws.com/video/HSA+P2.png',
                                title: 'HSA Toán buổi 2',
                                created_at: '15/07/2025',
                                description: 'Tiếp tục bài giảng HSA Toán với các chủ đề nâng cao và bài tập thực hành.',
                                views: 680,
                                likes: 42,
                                comments: mockComments
                            }
                        ],
                        exerciseVideos: []
                    },
                    {
                        id: 'chuong2',
                        name: 'Chương 2: Bài tập nâng cao',
                        theoryVideos: [],
                        exerciseVideos: []
                    }
                ]
            },
            {
                id: 'van',
                name: 'Văn',
                chapters: [
                    {
                        id: 'chuong1',
                        name: 'Chương 1: Đọc hiểu văn bản',
                        theoryVideos: [],
                        exerciseVideos: []
                    },
                    {
                        id: 'chuong2',
                        name: 'Chương 2: Viết văn bản',
                        theoryVideos: [],
                        exerciseVideos: []
                    }
                ]
            }
        ]
    }
]