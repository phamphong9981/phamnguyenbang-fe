'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import RegisterButton from './RegisterButton';
import LoginButton from './LoginButton';
import UserMenu from './UserMenu';
import { useAuth } from '@/hooks/useAuth';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isExamDropdownOpen, setIsExamDropdownOpen] = useState(false);
  const [dropdownTimeout, setDropdownTimeout] = useState<NodeJS.Timeout | null>(null);
  const { isAuthenticated, isLoading, user, logout } = useAuth();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Cleanup timeout on unmount
  React.useEffect(() => {
    return () => {
      if (dropdownTimeout) {
        clearTimeout(dropdownTimeout);
      }
    };
  }, [dropdownTimeout]);

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/home" className="flex items-center">
              <Image
                src="/logo.jpg"
                alt="Logo Trung tâm Giáo dục"
                width={50}
                height={50}
                className="rounded-lg"
              />
              <span className="ml-3 text-xl font-bold text-gray-800">
                Lớp Toán Phân Hoá Hạ Long
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link
              href="/home"
              className="text-gray-700 hover:text-green-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Trang chủ
            </Link>
            <Link
              href="/khoa-hoc"
              className="text-gray-700 hover:text-green-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Khóa học
            </Link>
            <Link
              href="/game"
              className="text-gray-700 hover:text-green-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              🎮 Game
            </Link>
            {/* Thi HSA/TSA Dropdown */}
            <div
              className="relative group"
              onMouseEnter={() => {
                if (dropdownTimeout) {
                  clearTimeout(dropdownTimeout);
                  setDropdownTimeout(null);
                }
                setIsExamDropdownOpen(true);
              }}
              onMouseLeave={() => {
                const timeout = setTimeout(() => {
                  setIsExamDropdownOpen(false);
                }, 150); // 150ms delay
                setDropdownTimeout(timeout);
              }}
            >
              <button
                className="text-gray-700 hover:text-green-600 px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center"
              >
                Thi HSA/TSA
                <svg className="ml-1 w-4 h-4 transition-transform duration-200 group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Dropdown Menu with extended hover area */}
              {isExamDropdownOpen && (
                <div
                  className="absolute left-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50"
                  onMouseEnter={() => {
                    if (dropdownTimeout) {
                      clearTimeout(dropdownTimeout);
                      setDropdownTimeout(null);
                    }
                    setIsExamDropdownOpen(true);
                  }}
                  onMouseLeave={() => {
                    const timeout = setTimeout(() => {
                      setIsExamDropdownOpen(false);
                    }, 150); // 150ms delay
                    setDropdownTimeout(timeout);
                  }}
                >
                  {/* Invisible extension to prevent gap */}
                  <div className="absolute -top-2 left-0 right-0 h-2 bg-transparent"></div>

                  <div className="py-2">
                    <Link
                      href="/thi-hsa-tsa/bai-tap-chuong"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-600 transition-colors"
                      onClick={() => setIsExamDropdownOpen(false)}
                    >
                      📚 Bài tập chương
                    </Link>
                    <Link
                      href="/thi-hsa-tsa/thi-hsa"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-600 transition-colors"
                      onClick={() => setIsExamDropdownOpen(false)}
                    >
                      🎯 Thi HSA
                    </Link>
                    <Link
                      href="/thi-hsa-tsa/thi-tsa"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-600 transition-colors"
                      onClick={() => setIsExamDropdownOpen(false)}
                    >
                      🏆 Thi TSA
                    </Link>
                  </div>
                </div>
              )}
            </div>
            {/* <Link
              href="/giao-vien"
              className="text-gray-700 hover:text-green-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Giáo viên
            </Link> */}
            {/* <Link
              href="/ve-chung-toi"
              className="text-gray-700 hover:text-green-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Về chúng tôi
            </Link> */}
          </nav>

          {/* Login Button */}
          <div className="hidden md:flex items-center space-x-4">
            {!isLoading && (
              isAuthenticated ? (
                <UserMenu />
              ) : (
                <>
                  <LoginButton />
                  <RegisterButton className="border border-green-600 text-green-600 hover:bg-green-50 px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                    Đăng ký
                  </RegisterButton>
                </>
              )
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="text-gray-700 hover:text-green-600 focus:outline-none focus:text-green-600"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t">
              <Link
                href="/home"
                className="text-gray-700 hover:text-green-600 block px-3 py-2 rounded-md text-base font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Trang chủ
              </Link>
              <Link
                href="/khoa-hoc"
                className="text-gray-700 hover:text-green-600 block px-3 py-2 rounded-md text-base font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Khóa học
              </Link>
              <Link
                href="/game"
                className="text-gray-700 hover:text-green-600 block px-3 py-2 rounded-md text-base font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                🎮 Game
              </Link>
              <Link
                href="/giao-vien"
                className="text-gray-700 hover:text-green-600 block px-3 py-2 rounded-md text-base font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Giáo viên
              </Link>
              {/* Mobile Exam Menu */}
              <div className="space-y-1">
                <div className="px-3 py-2 text-xs font-medium text-gray-500 uppercase tracking-wide">
                  Thi HSA/TSA
                </div>
                <Link
                  href="/thi-hsa-tsa/bai-tap-chuong"
                  className="text-gray-700 hover:text-green-600 block px-6 py-2 rounded-md text-base font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  📚 Bài tập chương
                </Link>
                <Link
                  href="/thi-hsa-tsa"
                  className="text-gray-700 hover:text-green-600 block px-6 py-2 rounded-md text-base font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  🎯 Thi HSA
                </Link>
                <Link
                  href="/thi-hsa-tsa/thi-tsa"
                  className="text-gray-700 hover:text-green-600 block px-6 py-2 rounded-md text-base font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  🏆 Thi TSA
                </Link>
              </div>
              <div className="pt-4 pb-3 border-t border-gray-200">
                {!isLoading && (
                  isAuthenticated ? (
                    <>
                      <div className="flex items-center space-x-2 px-3 py-2">
                        <div className={`w-8 h-8 ${user?.isPremium ? 'bg-yellow-500' : 'bg-green-600'} rounded-full flex items-center justify-center`}>
                          {user?.isPremium ? (
                            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                            </svg>
                          ) : (
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                          )}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-gray-700 font-medium">Xin chào, {user?.username}</span>
                          <span className={`text-xs ${user?.isPremium ? 'text-yellow-600 font-medium' : 'text-gray-500'}`}>
                            {user?.isPremium ? '⭐ Premium User' : 'Free User'}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          logout();
                          setIsMenuOpen(false);
                        }}
                        className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                      >
                        Đăng xuất
                      </button>
                    </>
                  ) : (
                    <>
                      <div className="mb-2">
                        <LoginButton
                          className="w-full text-center"
                          onLoginSuccess={() => setIsMenuOpen(false)}
                        />
                      </div>
                      <RegisterButton className="border border-green-600 text-green-600 hover:bg-green-50 px-4 py-2 rounded-lg text-sm font-medium block text-center w-full">
                        Đăng ký
                      </RegisterButton>
                    </>
                  )
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
} 