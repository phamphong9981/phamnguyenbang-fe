'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/userUser';
import ProfileModal from './ProfileModal';

// ── AvatarCircle ──────────────────────────────────────────────────────────────

interface AvatarCircleProps {
    avatarUrl?: string | null;
    username?: string;
    isPremium: boolean;
    size: 'sm' | 'md';
}

function AvatarCircle({ avatarUrl, username, isPremium, size }: AvatarCircleProps) {
    const dim = size === 'sm' ? 'w-9 h-9' : 'w-10 h-10';
    const iconSize = size === 'sm' ? 'w-5 h-5' : 'w-6 h-6';
    const initial = (username ?? '?').charAt(0).toUpperCase();

    if (avatarUrl) {
        return (
            <div className={`${dim} relative rounded-full overflow-hidden shadow-sm flex-shrink-0`}>
                <Image
                    src={avatarUrl}
                    alt="Ảnh đại diện"
                    fill
                    sizes={size === 'sm' ? '36px' : '40px'}
                    className="object-cover"
                />
            </div>
        );
    }

    if (isPremium) {
        return (
            <div className={`${dim} bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center shadow-sm flex-shrink-0`}>
                <svg className={`${iconSize} text-white drop-shadow-sm`} fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
            </div>
        );
    }

    // No avatar, not premium → initial letter
    return (
        <div className={`${dim} bg-gradient-to-br from-green-500 to-green-700 rounded-full flex items-center justify-center shadow-sm flex-shrink-0 select-none`}>
            <span className={`text-white font-bold ${size === 'sm' ? 'text-sm' : 'text-base'}`}>
                {initial}
            </span>
        </div>
    );
}

// ── UserMenu ──────────────────────────────────────────────────────────────────

export default function UserMenu() {
    const { user, logout } = useAuth();
    const { data: profile } = useProfile(!!user);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const avatarUrl = profile?.profile?.avatarUrl ?? null;

    const handleLogout = () => {
        logout();
        setIsDropdownOpen(false);
    };

    const toggleDropdown = () => {
        if (!isAnimating) {
            setIsAnimating(true);
            setIsDropdownOpen(!isDropdownOpen);
            setTimeout(() => setIsAnimating(false), 200);
        }
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    if (!user) return null;

    return (
        <>
            <div className="relative" ref={dropdownRef}>
                {/* Trigger button */}
                <button
                    onClick={toggleDropdown}
                    className={`flex items-center space-x-3 text-gray-700 hover:text-green-600 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 ${isDropdownOpen ? 'bg-gray-50 text-green-600' : ''}`}
                >
                    <AvatarCircle
                        avatarUrl={avatarUrl}
                        username={user.username}
                        isPremium={user.isPremium}
                        size="sm"
                    />
                    <div className="flex flex-col items-start">
                        <span className="font-semibold text-gray-900 truncate max-w-28 sm:max-w-32">{user.username}</span>
                        <span className={`text-xs ${user.isPremium ? 'text-yellow-600 font-medium' : 'text-gray-500'}`}>
                            {user.isPremium ? '⭐ Premium' : 'Free User'}
                        </span>
                    </div>
                    <svg
                        className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </button>

                {/* Dropdown */}
                {isDropdownOpen && (
                    <div className="absolute right-0 mt-3 w-64 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50 transition-all duration-200 ease-out opacity-100 scale-100">
                        {/* User info header */}
                        <div className="px-4 py-3 border-b border-gray-100">
                            <div className="flex items-center space-x-3">
                                <AvatarCircle
                                    avatarUrl={avatarUrl}
                                    username={user.username}
                                    isPremium={user.isPremium}
                                    size="md"
                                />
                                <div className="flex-1 min-w-0">
                                    <div className="font-semibold text-gray-900 truncate">{user.username}</div>
                                    <div className={`text-sm ${user.isPremium ? 'text-yellow-600 font-medium' : 'text-gray-500'}`}>
                                        {user.isPremium ? '⭐ Premium User' : 'Free User'}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="py-1">
                            <button
                                onClick={() => {
                                    setIsDropdownOpen(false);
                                    setIsProfileOpen(true);
                                }}
                                className="w-full flex items-center space-x-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-green-600 transition-all duration-200 group"
                            >
                                <svg className="w-4 h-4 text-gray-400 group-hover:text-green-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                                <span>Cập nhật thông tin</span>
                            </button>
                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center space-x-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 transition-all duration-200 group"
                            >
                                <svg className="w-4 h-4 text-gray-400 group-hover:text-red-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                </svg>
                                <span>Đăng xuất</span>
                            </button>
                        </div>
                    </div>
                )}
            </div>

            <ProfileModal
                isOpen={isProfileOpen}
                onClose={() => setIsProfileOpen(false)}
                username={user.username}
            />
        </>
    );
}
