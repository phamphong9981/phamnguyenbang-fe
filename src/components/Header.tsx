'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import LoginButton from './LoginButton';
import UserMenu from './UserMenu';
import { useAuth } from '@/hooks/useAuth';
import { getStoredAccessibleExamTypes } from '@/utils/examAccess';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated, isLoading, user, logout } = useAuth();
  const isAdmin = user?.username.includes('admin');
  const pathname = usePathname();
  const accessibleExamTypes = getStoredAccessibleExamTypes();
  const canAccessHsa = accessibleExamTypes.includes('HSA');
  const canAccessTsa = accessibleExamTypes.includes('TSA');
  const canAccessChapter = accessibleExamTypes.includes('chapter');

  const showHsaTsa =
    (user?.yearOfBirth === '2009' ||
    user?.yearOfBirth === 'null' ||
    !user?.yearOfBirth) &&
    (canAccessHsa || canAccessTsa);

  const isChapterActive = pathname?.startsWith('/thi-hsa-tsa/bai-tap-chuong');

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const isActive = (href: string) => pathname === href || pathname?.startsWith(href + '/');

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

            {canAccessChapter && (
            <Link href="/thi-hsa-tsa/bai-tap-chuong" className={navLinkClass('/thi-hsa-tsa/bai-tap-chuong')}>
              Bài tập chương
              <span className={`absolute bottom-0 left-0 right-0 h-[2px] rounded-full bg-emerald-600 transition-all duration-200 ${isChapterActive ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-0 group-hover:opacity-60 group-hover:scale-x-100'}`} />
            </Link>
            )}

            {showHsaTsa && (
              <>
                {canAccessHsa && (
                <Link href="/thi-hsa-tsa/thi-hsa" className={navLinkClass('/thi-hsa-tsa/thi-hsa')}>
                  Thi HSA
                  <span className={`absolute bottom-0 left-0 right-0 h-[2px] rounded-full bg-emerald-600 transition-all duration-200 ${isActive('/thi-hsa-tsa/thi-hsa') ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-0 group-hover:opacity-60 group-hover:scale-x-100'}`} />
                </Link>
                )}
                {canAccessTsa && (
                <Link href="/thi-hsa-tsa/thi-tsa" className={navLinkClass('/thi-hsa-tsa/thi-tsa')}>
                  Thi TSA
                  <span className={`absolute bottom-0 left-0 right-0 h-[2px] rounded-full bg-emerald-600 transition-all duration-200 ${isActive('/thi-hsa-tsa/thi-tsa') ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-0 group-hover:opacity-60 group-hover:scale-x-100'}`} />
                </Link>
                )}
              </>
            )}

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
            {canAccessChapter && (
            <Link
              href="/thi-hsa-tsa/bai-tap-chuong"
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Bài tập chương
            </Link>
            )}
            {showHsaTsa && (
              <>
                {canAccessHsa && (
                <Link
                  href="/thi-hsa-tsa/thi-hsa"
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Thi HSA
                </Link>
                )}
                {canAccessTsa && (
                <Link
                  href="/thi-hsa-tsa/thi-tsa"
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Thi TSA
                </Link>
                )}
              </>
            )}
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
