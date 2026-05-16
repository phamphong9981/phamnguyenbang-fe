'use client';

import { useEffect, useState } from 'react';
import { useGetUsers, type GetUsersResponse } from '@/hooks/useAdmin';

interface UserSearchAutocompleteProps {
    selected: GetUsersResponse | null;
    onChange: (user: GetUsersResponse | null) => void;
    placeholder?: string;
    autoFocus?: boolean;
}

export default function UserSearchAutocomplete({
    selected,
    onChange,
    placeholder = 'Tìm theo họ tên hoặc username...',
    autoFocus = false,
}: UserSearchAutocompleteProps) {
    const [input, setInput] = useState(selected ? `${selected.fullname} (@${selected.username})` : '');
    const [committedQuery, setCommittedQuery] = useState<string>('');
    const [open, setOpen] = useState(false);

    const { data: users, isFetching } = useGetUsers(committedQuery || undefined);

    useEffect(() => {
        const id = window.setTimeout(() => setCommittedQuery(input.trim()), 300);
        return () => window.clearTimeout(id);
    }, [input]);

    useEffect(() => {
        if (selected) {
            setInput(`${selected.fullname} (@${selected.username})`);
        }
    }, [selected]);

    return (
        <div className="relative">
            <div className="flex items-center gap-2">
                <input
                    type="text"
                    value={input}
                    autoFocus={autoFocus}
                    onChange={(e) => {
                        setInput(e.target.value);
                        setOpen(true);
                        if (selected) onChange(null);
                    }}
                    onFocus={() => setOpen(true)}
                    onBlur={() => window.setTimeout(() => setOpen(false), 150)}
                    placeholder={placeholder}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                {selected && (
                    <button
                        type="button"
                        onClick={() => {
                            onChange(null);
                            setInput('');
                        }}
                        className="px-2 py-1 text-xs text-gray-500 hover:text-gray-700"
                    >
                        ✕
                    </button>
                )}
            </div>
            {open && input.trim().length > 0 && (
                <div className="absolute z-30 mt-1 w-full max-h-72 overflow-y-auto bg-white border border-gray-200 rounded-md shadow-lg">
                    {isFetching ? (
                        <div className="px-3 py-2 text-sm text-gray-500">Đang tìm...</div>
                    ) : !users || users.length === 0 ? (
                        <div className="px-3 py-2 text-sm text-gray-500">Không tìm thấy học sinh</div>
                    ) : (
                        users.slice(0, 20).map((u) => (
                            <button
                                key={u.id}
                                type="button"
                                onMouseDown={(e) => e.preventDefault()}
                                onClick={() => {
                                    onChange(u);
                                    setInput(`${u.fullname} (@${u.username})`);
                                    setOpen(false);
                                }}
                                className="w-full text-left px-3 py-2 text-sm hover:bg-indigo-50 border-b border-gray-100 last:border-b-0"
                            >
                                <div className="font-medium text-gray-900">{u.fullname}</div>
                                <div className="text-xs text-gray-500">
                                    @{u.username}
                                    {u.class && ` • ${u.class}`}
                                </div>
                            </button>
                        ))
                    )}
                </div>
            )}
        </div>
    );
}
