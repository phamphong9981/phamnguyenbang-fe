import { Prize } from '@/components/LuckyWheel';

// Cấu hình các phần thưởng với tỷ lệ trúng thưởng thực tế
export const PRIZE_CONFIG: Prize[] = [
    {
        id: 'kfc',
        name: 'Voucher KFC',
        image: '/vounchers/kfc.png',
        probability: 5, // 10% cơ hội trúng
        color: '#fee2e2' // bg-red-100
    },
    {
        id: 'drinks',
        name: 'Voucher Đồ uống',
        image: '/vounchers/drinks.jpg',
        probability: 5, // 20% cơ hội trúng
        color: '#dbeafe' // bg-blue-100
    },
    {
        id: 'snacks',
        name: 'Voucher Ăn vặt',
        image: '/vounchers/ăn-vat.jpg',
        probability: 5, // 15% cơ hội trúng
        color: '#dcfce7' // bg-green-100
    },
    {
        id: 'movie',
        name: 'Vé xem phim',
        image: '/vounchers/film.jpg',
        probability: 5, // 5% cơ hội trúng (hiếm nhất)
        color: '#fef3c7' // bg-yellow-100
    }
];

// Tổng tỷ lệ trúng thưởng: 50%
// Tỷ lệ "Chúc bạn may mắn lần sau": 50%

// Hàm để lấy cấu hình phần thưởng dựa trên điểm số
export function getPrizesBasedOnScore(score: number): Prize[] {
    if (score >= 80) {
        // Điểm cao: tăng tỷ lệ trúng thưởng
        return PRIZE_CONFIG.map(prize => ({
            ...prize,
            probability: prize.probability * 1 // Tăng 50% tỷ lệ
        }));
    } else if (score >= 60) {
        // Điểm trung bình: giữ nguyên tỷ lệ
        return PRIZE_CONFIG;
    } else {
        // Điểm thấp: giảm tỷ lệ trúng thưởng
        return PRIZE_CONFIG.map(prize => ({
            ...prize,
            probability: prize.probability * 1 // Giảm 30% tỷ lệ
        }));
    }
}

// Hàm để lấy thông tin chi tiết về voucher
export function getPrizeDetails(prizeId: string): {
    title: string;
    description: string;
    instructions: string;
} {
    const prizeDetails = {
        'kfc': {
            title: '🍗 Voucher KFC',
            description: 'Giảm giá 50.000đ cho đơn hàng từ 200.000đ',
            instructions: 'Áp dụng tại tất cả cửa hàng KFC trên toàn quốc. Hạn sử dụng: 30 ngày kể từ ngày nhận.'
        },
        'drinks': {
            title: '🥤 Voucher Đồ uống',
            description: 'Giảm giá 30.000đ cho đơn hàng từ 100.000đ',
            instructions: 'Áp dụng tại các cửa hàng đồ uống tham gia chương trình. Hạn sử dụng: 15 ngày kể từ ngày nhận.'
        },
        'snacks': {
            title: '🍿 Voucher Ăn vặt',
            description: 'Giảm giá 20.000đ cho đơn hàng từ 80.000đ',
            instructions: 'Áp dụng tại các cửa hàng ăn vặt, bánh kẹo. Hạn sử dụng: 20 ngày kể từ ngày nhận.'
        },
        'movie': {
            title: '🎬 Vé xem phim',
            description: 'Miễn phí 1 vé xem phim 2D',
            instructions: 'Áp dụng tại các rạp chiếu phim tham gia chương trình. Hạn sử dụng: 45 ngày kể từ ngày nhận.'
        }
    };

    return prizeDetails[prizeId as keyof typeof prizeDetails] || {
        title: 'Phần thưởng',
        description: 'Mô tả phần thưởng',
        instructions: 'Hướng dẫn sử dụng'
    };
}
