import { useEffect, useState, useCallback } from "react";
import { getUsersPage } from "../api/users";
import { User } from "../types";

interface UseUsersPageReturn {
    users: User[];
    setUsers: React.Dispatch<React.SetStateAction<User[]>>;
    page: number;
    setPage: React.Dispatch<React.SetStateAction<number>>;
    isLoading: boolean;
    error: string | null;
    total: number | null;
    totalPages: number;
    limit: number;
    refetch: (p?: number) => Promise<void>;
}

export default function useUsersPage(initialPage: number = 1, limit: number = 10): UseUsersPageReturn {
    const [users, setUsers] = useState<User[]>([]);
    const [page, setPage] = useState<number>(initialPage);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [total, setTotal] = useState<number | null>(null);
    const [cache, setCache] = useState<{ [key: number]: { data: User[], total: number | null } }>({});

    const fetchPage = useCallback(async (p: number = page): Promise<void> => {
        // Проверяем кеш
        if (cache[p]) {
            setUsers(cache[p].data);
            setTotal(cache[p].total);
            return;
        }

        setIsLoading(true);
        setError(null);
        try {
            const { data, total } = await getUsersPage(p, limit);
            setUsers(data);
            setTotal(total);
            // Сохраняем в кеш
            setCache(prev => ({ ...prev, [p]: { data, total } }));
            
            // Предзагружаем следующую страницу
            if (data.length === limit) {
                getUsersPage(p + 1, limit).then(result => {
                    setCache(prev => ({ ...prev, [p + 1]: result }));
                }).catch(() => {});
            }
        } catch (e) {
            setError("Не удалось загрузить пользователей");
        } finally {
            setIsLoading(false);
        }
    }, [limit, cache]); // Добавляем cache в зависимости

    // первичная и последующие загрузки при смене page/limit
    useEffect(() => {
        fetchPage(page);
    }, [page, limit]); // Убираем fetchPage из зависимостей

    // публичный refetch (для обновления после создания и т.п.)
    const refetch = useCallback((p: number = page) => fetchPage(p), [fetchPage, page]);

    // вычисления для пагинации
    const computedTotalPages = total
        ? Math.ceil(total / limit)
        : (users.length === limit ? page + 1 : page);

    return {
        users,
        setUsers,
        page,
        setPage,
        isLoading,
        error,
        total,
        totalPages: computedTotalPages,
        limit,
        refetch,
    };
}
