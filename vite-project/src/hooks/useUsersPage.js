import { useEffect, useState, useCallback } from "react";
import { getUsersPage } from "../api/users";

export default function useUsersPage(initialPage = 1, limit = 10) {
    const [users, setUsers] = useState([]);
    const [page, setPage] = useState(initialPage);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [total, setTotal] = useState(null);

    const [cache, setCache] = useState({}); // { [page]: users[] }
    const [isFetching, setIsFetching] = useState(false); // в фоне обновляем


    const fetchPage = useCallback(async (p = page) => {
        setIsLoading(true);
        setError(null);
        try {
            const { data, total } = await getUsersPage(p, limit);
            setUsers(data);
            setTotal(total);
        } catch (e) {
            setError("Не удалось загрузить пользователей");
            // console.error(e);
        } finally {
            setIsLoading(false);
        }
    }, [page, limit]);

    // первичная и последующие загрузки при смене page/limit
    useEffect(() => {
        fetchPage(page);
    }, [page, fetchPage]);

    // публичный refetch (для обновления после создания и т.п.)
    const refetch = useCallback((p = page) => fetchPage(p), [fetchPage, page]);

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
