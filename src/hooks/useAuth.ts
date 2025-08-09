'use client';

import { useState, useEffect } from 'react';

interface User {
    username: string;
    token: string;
    isPremium: boolean;
}

export function useAuth() {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Check if user is logged in on mount
        const token = localStorage.getItem('token');
        const username = localStorage.getItem('username');
        const isPremium = localStorage.getItem('isPremium') === 'true';

        if (token && username) {
            setUser({
                username,
                token,
                isPremium
            });
        }
        setIsLoading(false);
    }, []);

    const login = (userData: User) => {
        setUser(userData);
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        localStorage.removeItem('isPremium');
        setUser(null);
        // Reload page to update UI
        window.location.reload();
    };

    return {
        user,
        isLoading,
        login,
        logout,
        isAuthenticated: !!user
    };
}