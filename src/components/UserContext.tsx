'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
    id: string;
    name: string;
    email: string;
}

interface UserContextType {
    currentUser: User | null;
    setCurrentUser: (user: User) => void;
    mockUsers: User[];
}

const mockUsers: User[] = [
    { id: 'user_001', name: 'Juan del Pueblo', email: 'juan@test.com' },
    { id: 'user_002', name: 'Maria Rodriguez', email: 'maria@test.com' },
    { id: 'user_003', name: 'Carlos Rivera', email: 'carlos@test.com' },
    { id: 'user_004', name: 'Ana García', email: 'ana@test.com' },
    { id: 'user_005', name: 'Roberto Mejia', email: 'roberto@test.com' },
    { id: 'user_006', name: 'Elena Santos', email: 'elena@test.com' },
];

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
    const [currentUser, setCurrentUser] = useState<User | null>(null);

    useEffect(() => {
        // Default to user_001 if none selected
        const saved = localStorage.getItem('vivemas_user');
        if (saved) {
            setCurrentUser(JSON.parse(saved));
        } else {
            setCurrentUser(mockUsers[0]);
        }
    }, []);

    const handleSetUser = (user: User) => {
        setCurrentUser(user);
        localStorage.setItem('vivemas_user', JSON.stringify(user));
    };

    return (
        <UserContext.Provider value={{ currentUser, setCurrentUser: handleSetUser, mockUsers }}>
            {children}
        </UserContext.Provider>
    );
}

export function useUser() {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
}
