'use client';

import { useRouter } from 'next/navigation';
import Header from '@/components/Header'
import { BookOpen, User, Calendar, CheckCircle2, Clock } from 'lucide-react';

export default function TSAHomePage() {
	const router = useRouter();
	const sets = [
		{
			id: 'dot1',
			title: '(AECK) Thi thử Đánh giá Tư duy - Đợt 1',
			tag: 'TSA',
			mode: 'Tự do',
			reg: '21/08/2025 - 24/08/2025',
			exam: '21/08/2025 - 24/08/2025',
			price: 'Miễn phí',
		},
		{
			id: 'dot2',
			title: '(AECK) Thi thử Đánh giá Tư duy - Đợt 2',
			tag: 'TSA',
			mode: 'Tự do',
			reg: '28/08/2025 - 31/08/2025',
			exam: '28/08/2025 - 31/08/2025',
			price: 'Miễn phí',
		},
		{
			id: 'dot3',
			title: '(AECK) Thi thử Đánh giá Tư duy - Đợt 3',
			tag: 'TSA',
			mode: 'Tự do',
			reg: '04/09/2025 - 07/09/2025',
			exam: '04/09/2025 - 07/09/2025',
			price: 'Miễn phí',
		},
	];

	return (
		<div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Header/>
			<div className="mx-auto max-w-5xl p-6">
				<div className="flex items-center gap-4">
					<div className="flex items-center gap-3">
						<div className="h-10 w-10 rounded-full bg-gradient-to-br from-green-50 to-green-100 text-green-600 flex items-center justify-center ring-1 ring-green-200 shadow-sm transition-transform duration-300 transform-gpu origin-bottom-left hover:rotate-[-8deg]">
							<BookOpen className="h-6 w-6" />
						</div>
						<h1 className="text-xl font-semibold text-gray-900">2. Tổng ôn - Luyện đề TSA</h1>
					</div>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
					{sets.map((item) => (
						<div
							key={item.id}
							className="group rounded-xl border border-gray-200 bg-white overflow-hidden shadow-sm transition-all duration-300 hover:shadow-xl hover:border-green-200 hover:-translate-y-0.5"
						>
							<div className="p-6 flex items-start gap-4 transition-colors duration-300 group-hover:bg-green-50/40">
								<div className="h-12 w-12 rounded-lg bg-gradient-to-br from-green-50 to-green-100 text-green-600 flex items-center justify-center ring-1 ring-green-200 shadow-sm transition-transform duration-300 transform-gpu origin-bottom-left group-hover:scale-105 group-hover:rotate-[-8deg]">
									<BookOpen className="h-7 w-7" />
								</div>
								<div className="flex-1">
									<div className="text-lg font-semibold text-gray-900 transition-colors duration-300 group-hover:text-green-700">{item.title}</div>
									<div className="mt-1 text-sm text-gray-500">{item.tag}</div>
								</div>
							</div>

							<div className="px-6 pb-2">
								<div className="grid gap-4">
									<div className="flex items-center justify-between border-t border-gray-100 pt-4">
										<div className="flex items-center gap-3">
											<div className="h-9 w-9 rounded-full bg-gray-100 flex items-center justify-center transition-colors duration-300 group-hover:bg-green-50">
												<User className="h-5 w-5 text-gray-700 transition-colors duration-300 group-hover:text-green-600" />
											</div>
											<div className="text-sm text-gray-600">Hình thức thi:</div>
										</div>
										<span className="rounded-full bg-green-100 text-green-700 text-sm px-3 py-1 ring-1 ring-green-200 transition-colors duration-300 group-hover:bg-green-200/70">{item.mode}</span>
									</div>

									<div className="flex items-center justify-between border-t border-gray-100 pt-4">
										<div className="flex items-center gap-3">
											<div className="h-9 w-9 rounded-full bg-gray-100 flex items-center justify-center transition-colors duration-300 group-hover:bg-green-50">
												<Calendar className="h-5 w-5 text-gray-700 transition-colors duration-300 group-hover:text-green-600" />
											</div>
											<div className="text-sm text-gray-600">Thời gian đăng kí:</div>
										</div>
										<div className="text-sm text-gray-900">{item.reg}</div>
									</div>

									<div className="flex items-center justify-between border-t border-gray-100 pt-4">
										<div className="flex items-center gap-3">
											<div className="h-9 w-9 rounded-full bg-gray-100 flex items-center justify-center transition-colors duration-300 group-hover:bg-green-50">
												<CheckCircle2 className="h-5 w-5 text-gray-700 transition-colors duration-300 group-hover:text-green-600" />
											</div>
											<div className="text-sm text-gray-600">Trạng thái:</div>
										</div>
										<span className="rounded-full bg-green-100 text-green-700 text-sm px-3 py-1 ring-1 ring-green-200 transition-colors duration-300 group-hover:bg-green-200/70">{item.price}</span>
									</div>

									<div className="flex items-center justify-between border-t border-gray-100 pt-4">
										<div className="flex items-center gap-3">
											<div className="h-9 w-9 rounded-full bg-gray-100 flex items-center justify-center transition-colors duration-300 group-hover:bg-green-50">
												<Clock className="h-5 w-5 text-gray-700 transition-colors duration-300 group-hover:text-green-600" />
											</div>
											<div className="text-sm text-gray-600">Thời gian thi:</div>
										</div>
										<div className="text-sm text-gray-900">{item.exam}</div>
									</div>
								</div>
							</div>

							<div className="flex items-center justify-between border-t border-gray-100 px-6 py-4">
								<button 
                  className="inline-flex items-center text-sm font-medium text-green-700 hover:text-green-800 transition-all duration-300 hover:underline hover:underline-offset-4 hover:translate-x-0.5"
                  onClick={() => router.push(`/new-ket-qua-tsa`)}
                >
                    Xem kết quả
                </button>
								<button className="px-5 py-2.5 rounded-lg bg-green-600 text-white text-sm font-medium shadow-sm transition-all duration-300 hover:bg-green-700 active:bg-green-800 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-400 active:scale-[0.98]">Bắt đầu</button>
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
