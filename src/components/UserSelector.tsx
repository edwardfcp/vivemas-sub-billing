'use client';

import { useUser } from './UserContext';
import { ChevronDown, User } from 'lucide-react';
import { useState } from 'react';

export default function UserSelector() {
    const { currentUser, setCurrentUser, mockUsers } = useUser();
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="relative inline-block text-left">
            <div>
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="inline-flex items-center justify-center w-full rounded-full border border-zinc-200 bg-white px-4 py-2 text-sm font-semibold text-zinc-700 hover:bg-zinc-50 focus:outline-none transition-all duration-200"
                >
                    <div className="w-6 h-6 rounded-full bg-[#4C583E]/10 flex items-center justify-center mr-2">
                        <User className="h-3 w-3 text-[#4C583E]" />
                    </div>
                    {currentUser?.name || 'Seleccionar Usuario'}
                    <ChevronDown className="ml-2 h-4 w-4 text-zinc-400" />
                </button>
            </div>

            {isOpen && (
                <div className="absolute right-0 z-10 mt-2 w-64 origin-top-right rounded-2xl bg-white border border-zinc-100 shadow-xl ring-1 ring-black ring-opacity-5 focus:outline-none overflow-hidden animate-in fade-in zoom-in duration-200">
                    <div className="py-2">
                        <div className="px-4 py-2 text-[10px] font-bold text-zinc-400 uppercase tracking-widest border-b border-zinc-50 mb-1">
                            Cambiar de Perfil
                        </div>
                        {mockUsers.map((user) => (
                            <button
                                key={user.id}
                                onClick={() => {
                                    setCurrentUser(user);
                                    setIsOpen(false);
                                }}
                                className={`block w-full text-left px-4 py-3 text-sm transition-colors ${currentUser?.id === user.id
                                        ? 'bg-[#4C583E]/5 text-[#4C583E]'
                                        : 'text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900'
                                    }`}
                            >
                                <div className="font-bold">{user.name}</div>
                                <div className="text-xs opacity-60 font-medium">{user.email}</div>
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
