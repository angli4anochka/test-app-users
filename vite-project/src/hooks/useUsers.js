import { useState, useEffect } from 'react';
import {getUsersPage} from "../api/users.js";

export default function useUsers(initialPage = 1, limit = 10) {
    const [users, setUsers] = useState([]);
    const [page, setPage] = useState(initialPage);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [total, setTotal] = useState(null);

    const totalPages = total ? Math.ceil(total / limit) :
        (users.length === limit ? page + 1 : page);

    const fetchUsers = async (p = page) => {
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