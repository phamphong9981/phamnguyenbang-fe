'use client';

import { useState, useEffect } from 'react';

interface User {
    id: string;
    username: string;
    token: string;
    isPremium: boolean;
    classname: string;
    yearOfBirth: string;
}

export function useAuth() {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Check if user is logged in on mount
        const token = localStorage.getItem('token');
        const username = localStorage.getItem('username');
        const isPremium = localStorage.getItem('isPremium') === 'true';
        const userId = localStorage.getItem('userId');
        const classname = localStorage.getItem('classname');
        const yearOfBirth = localStorage.getItem('yearOfBirth');

        if (token && username && classname && yearOfBirth && userId) {
            setUser({
                id: userId || username, // Use stored userId if available, otherwise use username
                username,
                token,
                isPremium,
                classname,
                yearOfBirth
            });
        }
        setIsLoading(false);
    }, []);

    const login = (userData: User) => {
        setUser(userData);
    };

    // const loginWithCredentials = (username: string, token: string, isPremium: boolean = false, userId: string, classname: string, grade: string) => {
    //     const user: User = {
    //         id: userId || username, // Use provided userId or fallback to username
    //         username,
    //         token,
    //         isPremium,
    //         classname,
    //         yearOfBirth
    //     };
    //     setUser(user);
    //     localStorage.setItem('token', token);
    //     localStorage.setItem('username', username);
    //     localStorage.setItem('isPremium', isPremium.toString());
    //     localStorage.setItem('classname', classname);
    //     localStorage.setItem('yearOfBirth', yearOfBirth);
    //     if (userId) {
    //         localStorage.setItem('userId', userId);
    //     }
    // };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        localStorage.removeItem('isPremium');
        localStorage.removeItem('userId');
        localStorage.removeItem('classname');
        localStorage.removeItem('yearOfBirth');
        setUser(null);
        // Reload page to update UI
        window.location.reload();
    };

    return {
        user,
        isLoading,
        login,
        // loginWithCredentials,
        logout,
        isAuthenticated: !!user
    };
}