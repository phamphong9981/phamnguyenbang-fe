import React from 'react'
import Header from '@/components/Header';
function NewVideoCourse() {
  return (
    <div>
      <Header/>
      <section className="bg-gradient-to-br from-green-600 via-green-700 to-emerald-800 py-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">
                📚 Thư viện Video Học tập
            </h1>
            <p className="text-lg text-green-100 max-w-2xl mx-auto">
                Lộ trình học có hệ thống cho Toán THPT, HSA, TSA
            </p>
          </div>
        </div>
      </section>
      
    </div>
  )
}

export default NewVideoCourse;