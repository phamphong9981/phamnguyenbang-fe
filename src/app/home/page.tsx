// export const runtime = 'nodejs';

import Header from '@/components/Header';
import Link from 'next/link';
import TrialRegistrationForm from '@/components/TrialRegistrationForm';
import FloatingSocialIcons from '@/components/FloatingSocialIcons';
import OutstandingStudents from '@/components/OutstandingStudents';

export default function Home() {
  return (
    <div className="min-h-screen">
      <Header />

      {/* Split Banner Section */}
      <section className="min-h-[500px]">
        {/* Right side - Video */}
        <div className="relative bg-gradient-to-br from-green-600 via-green-700 to-green-800 p-4 sm:p-6 lg:p-8 flex items-center justify-center">
          <div className="w-full max-w-2xl">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4 text-center">
              Khám phá Tiềm năng
              <span className="block text-yellow-300">Của Bạn</span>
            </h1>

            <div className="relative aspect-video bg-black rounded-lg overflow-hidden shadow-2xl">
              <video
                className="w-full h-full object-cover"
                controls
                poster="/banner.jpg"
              >
                <source
                  src="https://tt-phamnguyenbang.s3.ap-southeast-2.amazonaws.com/intro.mp4"
                  type="video/mp4"
                />
                Trình duyệt của bạn không hỗ trợ video.
              </video>
            </div>

            <p className="text-base sm:text-lg text-gray-100 mt-4 text-center leading-relaxed">
              Chúng tôi cam kết mang đến những khóa học chất lượng cao,
              giúp bạn phát triển kỹ năng và đạt được mục tiêu trong sự nghiệp
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center mt-6">
              <Link href="/khoa-hoc" className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 px-6 py-3 rounded-lg text-base font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg">
                Khám phá khóa học
              </Link>

              <Link href="/giao-vien" className="border-2 border-white text-white hover:bg-white hover:text-green-700 px-6 py-3 rounded-lg text-base font-semibold transition-all duration-300 transform hover:scale-105">
                Tìm hiểu thêm
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Main content section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-gray-100">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
            Chào mừng đến với Lớp Toán Phân Hoá Theo Năng Lực
          </h2>
          <p className="text-base text-gray-600 max-w-3xl mx-auto">
            Là trung tâm luyện thi có bề dày lịch sử, chúng tôi tự hào là bệ phóng vững chắc cho hàng nghìn học sinh trên hành trình chinh phục đỉnh cao tri thức môn Toán. Thành tích của rất nhiều thế hệ thủ khoa, á khoa và các giải thưởng cao trong nhiều năm là minh chứng cho chất lượng giảng dạy và uy tín của chúng tôi. Trước những đổi mới của kỳ thi, trung tâm đã nhanh chóng chuyển đổi, cập nhật phương pháp để bám sát xu hướng thi Đánh giá năng lực (HSA/TSA), cam kết mang lại lộ trình ôn luyện hiệu quả nhất.
          </p>
        </div>

        {/* Features section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="text-center p-5 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
            <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Chương trình đa dạng</h3>
            <p className="text-sm text-gray-600">
              Nhiều khóa học phù hợp với mọi nhu cầu và trình độ của học viên
            </p>
          </div>

          <div className="text-center p-5 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
            <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Giảng viên chất lượng</h3>
            <p className="text-sm text-gray-600">
              Đội ngũ giảng viên giàu kinh nghiệm và tận tâm với nghề
            </p>
          </div>

          <div className="text-center p-5 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
            <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Chuyển đổi số</h3>
            <p className="text-sm text-gray-600">
              Chuyển đổi số để đảm bảo chất lượng và hiệu quả giảng dạy
            </p>
          </div>
        </div>

      </main>

      {/* Outstanding Students Section */}
      <OutstandingStudents />

      {/* Trial Registration Form Section */}
      <section className="bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
              Đăng ký học thử miễn phí
            </h2>
            <p className="text-base text-gray-600 max-w-2xl mx-auto">
              Trải nghiệm phương pháp giảng dạy hiện đại của chúng tôi ngay hôm nay.
              Điền thông tin bên dưới để được tư vấn và sắp xếp lịch học thử.
            </p>
          </div>

          <TrialRegistrationForm />
        </div>
      </section>

      <FloatingSocialIcons />
    </div>
  );
}
