import { Clock, Users, Star, BookOpen, TrendingUp, Award, Zap } from 'lucide-react';
import Header from '@/components/Header';
import Link from 'next/link';


export interface Course {
  id: number;
  title: string;
  description: string;
  level: string;
  duration: string;
  students: number;
  rating: number;
  image?: string;
}


export default function CoursesPage() {
  const courses: Course[] = [
    {
      id: 1,
      title: 'Toán lớp 10 - Nâng cao',
      description: 'Chương trình toán lớp 10 nâng cao, tập trung vào hình học và đại số, phát triển tư duy logic',
      level: 'Nâng cao',
      duration: '6 tháng',
      students: 124,
      rating: 4.9,
    },
    {
      id: 2,
      title: 'Toán lớp 11 - Chuyên sâu',
      description: 'Luyện tập chuyên sâu các dạng bài tập nâng cao, chuẩn bị cho các kỳ thi học sinh giỏi',
      level: 'Chuyên sâu',
      duration: '8 tháng',
      students: 98,
      rating: 5.0,
    },
    {
      id: 3,
      title: 'Toán lớp 12 - Luyện thi THPT',
      description: 'Ôn tập toàn diện, luyện đề thi THPT Quốc gia, tăng cường kỹ năng làm bài nhanh',
      level: 'Luyện thi',
      duration: '10 tháng',
      students: 156,
      rating: 4.8,
    },
    {
      id: 4,
      title: 'Toán HSG - Cấp Tỉnh',
      description: 'Chuyên đề học sinh giỏi cấp tỉnh, bài tập nâng cao, đề thi thử từ các năm trước',
      level: 'HSG',
      duration: '12 tháng',
      students: 67,
      rating: 5.0,
    },
    {
      id: 5,
      title: 'Toán Cơ bản - Nền tảng',
      description: 'Củng cố kiến thức nền tảng, phù hợp cho học sinh cần xây dựng lại từ đầu',
      level: 'Cơ bản',
      duration: '5 tháng',
      students: 89,
      rating: 4.7,
    },
    {
      id: 6,
      title: 'Toán TSA/HSA - Luyện thi',
      description: 'Chương trình đặc biệt dành cho học sinh luyện thi TSA, HSA vào các trường chuyên',
      level: 'Thi vào 10',
      duration: '6 tháng',
      students: 142,
      rating: 4.9,
    },
  ];

  const getLevelColor = (level: string) => {
    const colors: Record<string, string> = {
      'Cơ bản': 'from-blue-500 to-cyan-600',
      'Nâng cao': 'from-green-500 to-emerald-600',
      'Chuyên sâu': 'from-purple-500 to-pink-600',
      'HSG': 'from-orange-500 to-red-600',
      'Luyện thi': 'from-yellow-500 to-orange-600',
      'Thi vào 10': 'from-teal-500 to-green-600',
    };
    return colors[level] || 'from-gray-500 to-gray-600';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      <Header/>
      <div className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-green-500 via-emerald-600 to-teal-700 opacity-10"></div>
        <div className="absolute top-20 left-10 w-72 h-72 bg-green-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-emerald-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-teal-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center space-x-2 bg-white/80 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg mb-6">
            <Zap className="h-5 w-5 text-green-600" />
            <span className="text-sm font-semibold text-gray-700">Khóa học chất lượng cao</span>
          </div>

          <h1 className="text-6xl md:text-7xl font-bold text-gray-900 mb-6">
            Khám phá
            <span className="block bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent">
              Khóa học toán học
            </span>
          </h1>

          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Chương trình học phân hóa theo năng lực, từ cơ bản đến nâng cao, giúp học sinh tự tin chinh phục mọi kỳ thi
          </p>

          <div className="flex flex-wrap justify-center gap-4 text-sm">
            {[
              { icon: Award, text: '500+ Học viên' },
              { icon: Star, text: '4.9/5 Đánh giá' },
              { icon: TrendingUp, text: '95% Đỗ đại học' },
            ].map((stat, index) => (
              <div
                key={index}
                className="flex items-center space-x-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-md hover:shadow-xl hover:scale-105 transition-all duration-300"
              >
                <stat.icon className="h-4 w-4 text-green-600" />
                <span className="font-medium text-gray-700">{stat.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map((course, index) => (
            <div
              key={course.id}
              className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden animate-fade-in-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ background: `linear-gradient(to right, var(--tw-gradient-stops))` }}></div>

              <div className={`h-48 bg-gradient-to-br ${getLevelColor(course.level)} relative overflow-hidden`}>
                <div className="absolute inset-0 bg-black/10"></div>
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnptMCAxMmMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnoiIHN0cm9rZT0iI2ZmZiIgc3Ryb2tlLW9wYWNpdHk9Ii4xIi8+PC9nPjwvc3ZnPg==')] opacity-20"></div>

                <div className="absolute top-4 right-4">
                  <div className={`px-4 py-2 bg-white/90 backdrop-blur-sm rounded-full font-semibold text-sm shadow-lg`}>
                    {course.level}
                  </div>
                </div>

                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-white/20 backdrop-blur-sm p-6 rounded-2xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                    <BookOpen className="h-16 w-16 text-white" />
                  </div>
                </div>

                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>

              <div className="p-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-green-600 transition-colors">
                  {course.title}
                </h3>

                <p className="text-gray-600 mb-6 leading-relaxed">
                  {course.description}
                </p>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center text-gray-700 group/item">
                    <Clock className="h-5 w-5 text-green-600 mr-3 group-hover/item:scale-110 transition-transform" />
                    <span className="text-sm font-medium">Thời lượng: {course.duration}</span>
                  </div>

                  <div className="flex items-center text-gray-700 group/item">
                    <Users className="h-5 w-5 text-green-600 mr-3 group-hover/item:scale-110 transition-transform" />
                    <span className="text-sm font-medium">{course.students} học viên</span>
                  </div>

                  <div className="flex items-center text-gray-700 group/item">
                    <Star className="h-5 w-5 text-yellow-500 mr-3 group-hover/item:scale-110 transition-transform fill-yellow-500" />
                    <span className="text-sm font-medium">{course.rating}/5.0</span>
                  </div>
                </div>

                <button 
                  className="w-full py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-xl hover:from-green-600 hover:to-emerald-700 hover:shadow-xl hover:scale-105 transition-all duration-300 group/button">
                  <Link className="flex items-center justify-center space-x-2"
                    href={'/new-video-khoa-hoc/'}>
                    <span>Học ngay</span>
                    <BookOpen className="h-5 w-5 group-hover/button:rotate-12 transition-transform" />
                  </Link>
                </button>
              </div>

              <div className="absolute top-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < Math.floor(course.rating)
                          ? 'text-yellow-400 fill-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
