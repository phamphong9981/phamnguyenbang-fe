'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import LoginButton from './LoginButton';
import UserMenu from './UserMenu';
import { useAuth } from '@/hooks/useAuth';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isExamDropdownOpen, setIsExamDropdownOpen] = useState(false);
  const [dropdownTimeout, setDropdownTimeout] = useState<NodeJS.Timeout | null>(null);
  const { isAuthenticated, isLoading, user, logout } = useAuth();
  const isAdmin = user?.username.includes('admin');
  const pathname = usePathname();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const isActive = (href: string) => pathname === href || pathname?.startsWith(href + '/');

  // Cleanup timeout on unmount
  React.useEffect(() => {
    return () => {
      if (dropdownTimeout) {
        clearTimeout(dropdownTimeout);
      }
    };
  }, [dropdownTimeout]);

  const navLinkClass = (href: string) =>
    `relative text-sm font-medium transition-colors duration-200 px-1 py-2 group ${isActive(href)
      ? 'text-emerald-700'
      : 'text-gray-600 hover:text-gray-900'
    }`;

  return (
    <header className="bg-white/95 backdrop-blur-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">
        <div className="flex justify-between items-center h-[62px]">

          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/home" className="flex items-center gap-2.5 group">
              <div className="relative">
                <Image
                  src="/logo.jpg"
                  alt="Logo"
                  width={38}
                  height={38}
                  className="rounded-xl object-cover ring-1 ring-gray-200 transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <div className="leading-tight">
                <div className="text-[15px] font-bold text-gray-800 tracking-tight">
                  Toán Phân Hoá
                </div>
                <div className="text-[10px] text-gray-400 font-medium tracking-widest uppercase">
                  Hạ Long
                </div>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            <Link href="/home" className={navLinkClass('/home')}>
              Trang chủ
              <span className={`absolute bottom-0 left-0 right-0 h-[2px] rounded-full bg-emerald-600 transition-all duration-200 ${isActive('/home') ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-0 group-hover:opacity-60 group-hover:scale-x-100'}`} />
            </Link>

            <Link href="/khoa-hoc" className={navLinkClass('/khoa-hoc')}>
              Khóa học
              <span className={`absolute bottom-0 left-0 right-0 h-[2px] rounded-full bg-emerald-600 transition-all duration-200 ${isActive('/khoa-hoc') ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-0 group-hover:opacity-60 group-hover:scale-x-100'}`} />
            </Link>

            {/* Exam Dropdown */}
            <div
              className="relative"
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
                }, 150);
                setDropdownTimeout(timeout);
              }}
            >
              <button
                className={`relative text-sm font-medium transition-colors duration-200 px-1 py-2 flex items-center gap-1 group ${isActive('/thi-hsa-tsa')
                    ? 'text-emerald-700'
                    : 'text-gray-600 hover:text-gray-900'
                  }`}
              >
                {user?.yearOfBirth === '2008' ? 'Thi HSA/TSA' : 'Bài tập chương'}
                <svg
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${isExamDropdownOpen ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                </svg>
                <span className={`absolute bottom-0 left-0 right-0 h-[2px] rounded-full bg-emerald-600 transition-all duration-200 ${isActive('/thi-hsa-tsa') ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-0 group-hover:opacity-60 group-hover:scale-x-100'}`} />
              </button>

              {isExamDropdownOpen && (
                <div
                  className="absolute left-1/2 -translate-x-1/2 top-full mt-1.5 w-52 bg-white rounded-2xl shadow-xl shadow-gray-200/80 border border-gray-100/80 z-50 overflow-hidden"
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
                    }, 150);
                    setDropdownTimeout(timeout);
                  }}
                >
                  {/* Invisible bridge to prevent gap */}
                  <div className="absolute -top-2 left-0 right-0 h-2 bg-transparent" />

                  <div className="p-1.5">
                    <Link
                      href="/thi-hsa-tsa/bai-tap-chuong"
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 transition-colors group/item"
                      onClick={() => setIsExamDropdownOpen(false)}
                    >
                      <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0 group-hover/item:bg-emerald-50 transition-colors">
                        <svg className="w-4 h-4 text-gray-500 group-hover/item:text-emerald-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-800">Bài tập chương</div>
                        <div className="text-xs text-gray-400">Luyện đề theo chương</div>
                      </div>
                    </Link>
                    {(user?.yearOfBirth === '2008' || user?.yearOfBirth === 'null' || !user?.yearOfBirth) && (
                      <>
                        <Link
                          href="/thi-hsa-tsa/thi-hsa"
                          className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 transition-colors group/item"
                          onClick={() => setIsExamDropdownOpen(false)}
                        >
                          <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0 group-hover/item:bg-emerald-50 transition-colors">
                            <svg className="w-4 h-4 text-gray-500 group-hover/item:text-emerald-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                            </svg>
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-800">Thi HSA</div>
                            <div className="text-xs text-gray-400">Đề thi thử Học sinh Ưu tú</div>
                          </div>
                        </Link>
                        <Link
                          href="/thi-hsa-tsa/thi-tsa"
                          className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 transition-colors group/item"
                          onClick={() => setIsExamDropdownOpen(false)}
                        >
                          <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0 group-hover/item:bg-emerald-50 transition-colors">
                            <svg className="w-4 h-4 text-gray-500 group-hover/item:text-emerald-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                            </svg>
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-800">Thi TSA</div>
                            <div className="text-xs text-gray-400">Đề thi thử Tư duy BKHN</div>
                          </div>
                        </Link>
                      </>
                    )}
                    <div className="mx-3 my-1 border-t border-gray-100" />
                    <Link
                      href="/thi-hsa-tsa/game"
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 transition-colors group/item"
                      onClick={() => setIsExamDropdownOpen(false)}
                    >
                      <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0 group-hover/item:bg-emerald-50 transition-colors">
                        <svg className="w-4 h-4 text-gray-500 group-hover/item:text-emerald-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-800">Phi thuyền toán học</div>
                        <div className="text-xs text-gray-400">Luyện phản xạ vui</div>
                      </div>
                    </Link>
                  </div>
                </div>
              )}
            </div>

            <Link href="/ai-tu-luyen" className={navLinkClass('/ai-tu-luyen')}>
              AI Tự Luyện
              <span className={`absolute bottom-0 left-0 right-0 h-[2px] rounded-full bg-emerald-600 transition-all duration-200 ${isActive('/ai-tu-luyen') ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-0 group-hover:opacity-60 group-hover:scale-x-100'}`} />
            </Link>

            {isAdmin && (
              <Link href="/admin" className={navLinkClass('/admin')}>
                Admin
                <span className={`absolute bottom-0 left-0 right-0 h-[2px] rounded-full bg-emerald-600 transition-all duration-200 ${isActive('/admin') ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-0 group-hover:opacity-60 group-hover:scale-x-100'}`} />
              </Link>
            )}
          </nav>

          {/* Right side — Desktop */}
          <div className="hidden md:flex items-center">
            {!isLoading && (
              isAuthenticated ? (
                <UserMenu />
              ) : (
                <LoginButton />
              )
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center gap-2">
            {!isLoading && isAuthenticated && <UserMenu />}
            <button
              onClick={toggleMenu}
              aria-label="Toggle menu"
              className="p-2 rounded-xl text-gray-500 hover:text-gray-800 hover:bg-gray-100 transition-colors"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-gray-100">
          <div className="px-4 py-3 space-y-0.5">
            <Link
              href="/home"
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Trang chủ
            </Link>
            <Link
              href="/khoa-hoc"
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Khóa học
            </Link>
            <Link
              href="/ai-tu-luyen"
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              AI Tự Luyện
            </Link>
            {isAdmin && (
              <Link
                href="/admin"
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Admin
              </Link>
            )}

            {/* Mobile Exam Section */}
            <div className="pt-1">
              <div className="px-3 pb-1 text-[10px] font-semibold text-gray-400 tracking-widest uppercase">
                {user?.yearOfBirth === '2008' ? 'Thi HSA/TSA' : 'Bài tập chương'}
              </div>
              <Link
                href="/thi-hsa-tsa/bai-tap-chuong"
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors group/m"
                onClick={() => setIsMenuOpen(false)}
              >
                <div className="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0 group-hover/m:bg-emerald-50 transition-colors">
                  <svg className="w-3.5 h-3.5 text-gray-500 group-hover/m:text-emerald-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                Bài tập chương
              </Link>
              {(user?.yearOfBirth === '2008' || user?.yearOfBirth === 'null' || !user?.yearOfBirth) && (
                <>
                  <Link
                    href="/thi-hsa-tsa/thi-hsa"
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors group/m"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <div className="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0 group-hover/m:bg-emerald-50 transition-colors">
                      <svg className="w-3.5 h-3.5 text-gray-500 group-hover/m:text-emerald-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                      </svg>
                    </div>
                    Thi HSA
                  </Link>
                  <Link
                    href="/thi-hsa-tsa/thi-tsa"
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors group/m"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <div className="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0 group-hover/m:bg-emerald-50 transition-colors">
                      <svg className="w-3.5 h-3.5 text-gray-500 group-hover/m:text-emerald-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                      </svg>
                    </div>
                    Thi TSA
                  </Link>
                </>
              )}
              <Link
                href="/thi-hsa-tsa/game"
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors group/m"
                onClick={() => setIsMenuOpen(false)}
              >
                <div className="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0 group-hover/m:bg-emerald-50 transition-colors">
                  <svg className="w-3.5 h-3.5 text-gray-500 group-hover/m:text-emerald-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                Phi thuyền toán học
              </Link>
            </div>

            {/* Mobile Login */}
            {!isLoading && !isAuthenticated && (
              <div className="pt-2 pb-1 border-t border-gray-100 mt-2">
                <LoginButton
                  className="w-full text-center"
                  onLoginSuccess={() => setIsMenuOpen(false)}
                />
              </div>
            )}

            {/* Mobile Logout */}
            {!isLoading && isAuthenticated && (
              <div className="pt-2 pb-1 border-t border-gray-100 mt-2">
                <button
                  onClick={() => {
                    logout();
                    setIsMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm text-red-500 hover:bg-red-50 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Đăng xuất
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}