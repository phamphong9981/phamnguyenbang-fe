'use client';

import { useState } from 'react';
import RegisterPopup from './RegisterPopup';

interface RegisterButtonProps {
    children: React.ReactNode;
    className?: string;
}

export default function RegisterButton({ children, className }: RegisterButtonProps) {
    const [isRegisterPopupOpen, setIsRegisterPopupOpen] = useState(false);

    return (
        <>
            <button
                onClick={() => setIsRegisterPopupOpen(true)}
                className={className}
            >
                {children}
            </button>

            <RegisterPopup
                isOpen={isRegisterPopupOpen}
                onClose={() => setIsRegisterPopupOpen(false)}
            />
        </>
    );
} 