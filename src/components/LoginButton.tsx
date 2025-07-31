'use client';

import { useState } from 'react';
import LoginPopup from './LoginPopup';

interface LoginButtonProps {
    className?: string;
    onLoginSuccess?: () => void;
}

export default function LoginButton({ className = "", onLoginSuccess }: LoginButtonProps) {
    const [isLoginPopupOpen, setIsLoginPopupOpen] = useState(false);

    const handleLoginSuccess = () => {
        if (onLoginSuccess) {
            onLoginSuccess();
        }
        // Reload page to update UI after login
        window.location.reload();
    };

    return (
        <>
            <button
                onClick={() => setIsLoginPopupOpen(true)}
                className={`bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md transition-colors duration-200 font-medium ${className}`}
            >
                Đăng nhập
            </button>

            <LoginPopup
                isOpen={isLoginPopupOpen}
                onClose={() => setIsLoginPopupOpen(false)}
                onLoginSuccess={handleLoginSuccess}
            />
        </>
    );
} 