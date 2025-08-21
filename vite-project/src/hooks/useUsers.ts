import { useState, useEffect } from 'react';
import { getUsersPage } from "../api/users";
import { User } from "../types";

interface UseUsersReturn {
    users: User[];
    page: number;
    setPage: React.Dispatch<React.SetStateAction<number>>;
    isLoading: boolean;
    error: string | null;
    total: number | null;
    totalPages: number;
    fetchUsers: (p?: number) => Promise<User[]>;
}

export default function useUsers(initialPage: number = 1, limit: number = 10): UseUsersReturn {
    const [users, setUsers] = useState<User[]>([]);
    const [page, setPage] = useState<number>(initialPage);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [total, setTotal] = useState<number | null>(null);

    const totalPages = total ? Math.ceil(total / limit) :
        (users.length === limit ? page + 1 : page);

    const fetchUsers = async (p: number = page): Promise<User[]> => {
        setIsLoading(true);
        setError(null);
        try {
            const { data, total } = await getUsersPage(p, limit);
            setUsers(data);
            setTotal(total);
            return data;
        } catch (err) {
            setError("Не удалось загрузить пользователей");
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, [page, limit]);

    return {
        users,
        page,
        setPage,
        isLoading,
        error,
        total,
        totalPages,
        fetchUsers,
    };
}