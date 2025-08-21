import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import useUsersPage from "../hooks/useUsersPage";

import Button from "../components/Button/Button";
import EditUserModal from "../components/EditUserModal/EditUserModal";
import Pagination from "../components/Pagination/Pagination";
import UserTable from "../components/UserTable/UserTable";
import styles from "./MainPage.module.css";
import { User } from "../types";
import { deleteUser } from "../api/users";

export default function MainPage() {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    
    // Получаем текущую страницу из URL или используем 1 по умолчанию
    const pageFromUrl = parseInt(searchParams.get('page') || '1', 10);

    const {
        users, setUsers,
        page, setPage,
        isLoading, error,
        total, totalPages,
        limit, refetch,
    } = useUsersPage(pageFromUrl, 10);

    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');

    // Синхронизируем URL с текущей страницей только если страница изменилась программно
    useEffect(() => {
        if (page !== pageFromUrl && page > 0) {
            setSearchParams({ page: page.toString() }, { replace: true });
        }
    }, [page]); // Убираем лишние зависимости

    const handleUserClick = (id: number) => {
        // Сохраняем текущую страницу в state при переходе на детальную страницу
        navigate(`/users/${id}`, { state: { fromPage: page } });
    };
    
    const openCreate = () => { 
        setSelectedUser(null); 
        setIsEditing(true); 
    };

    const handlePageChange = (next: number) => {
        if (next < 1) return;
        if (!total && next > page && users.length < limit) return;
        setPage(next);
        setSearchParams({ page: next.toString() });
    };

    const handleDelete = async (id: number) => {
        try {
            await deleteUser(id);
            await refetch(page);
        } catch (error) {
            console.error("Ошибка при удалении пользователя:", error);
            alert("Не удалось удалить пользователя");
        }
    };

    return (
        <div className={styles.container}>
            {error && <p className={styles.error}>{error}</p>}

            <div className={styles.headerWrapper}>
                <div className={styles.headerTop}>
                    <h2 className={styles.pageTitle}>Список пользователей</h2>
                    <div className={styles.headerActions}>
                        <div className={styles.viewToggle}>
                            <button
                                className={`${styles.viewButton} ${viewMode === 'table' ? styles.active : ''}`}
                                onClick={() => setViewMode('table')}
                                title="Табличный вид"
                            >
                                📊
                            </button>
                            <button
                                className={`${styles.viewButton} ${viewMode === 'cards' ? styles.active : ''}`}
                                onClick={() => setViewMode('cards')}
                                title="Карточки"
                            >
                                🗂️
                            </button>
                        </div>
                        <Button onClick={openCreate}>
                            <span style={{ fontSize: '16px' }}>+</span>
                            Добавить пользователя
                        </Button>
                    </div>
                </div>
            </div>

            <div style={{ opacity: isLoading ? 0.5 : 1, transition: 'opacity 0.2s' }}>
            {viewMode === 'table' ? (
                <UserTable
                    users={users}
                    onUserClick={handleUserClick}
                    onEdit={(u: User) => { 
                        setSelectedUser(u); 
                        setIsEditing(true); 
                    }}
                    onDelete={handleDelete}
                />
            ) : (
                <div className={styles.list}>
                    {users.map((user) => (
                        <div key={user.id} className={styles.card}>
                            <div className={styles.cardHeader}>
                                {user.avatar && (
                                    <img src={user.avatar} alt={user.name} className={styles.cardAvatar} />
                                )}
                                <div className={styles.cardInfo}>
                                    <h3 className={styles.cardName}>{user.name}</h3>
                                    <p className={styles.cardEmail}>{user.email}</p>
                                </div>
                            </div>
                            <div className={styles.cardDetails}>
                                {user.country && <p>🌍 {user.country}</p>}
                                {user.city && <p>🏙️ {user.city}</p>}
                            </div>
                            <div className={styles.cardActions}>
                                <button
                                    className={styles.cardButton}
                                    onClick={() => handleUserClick(user.id)}
                                >
                                    Подробнее
                                </button>
                                <button
                                    className={styles.cardButton}
                                    onClick={() => {
                                        setSelectedUser(user);
                                        setIsEditing(true);
                                    }}
                                >
                                    Редактировать
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            </div>

            <Pagination
                page={page}
                totalPages={totalPages}
                onPageChange={handlePageChange}
            />

            <EditUserModal
                open={isEditing}
                user={selectedUser || undefined}
                mode={selectedUser ? "edit" : "create"}
                onCancel={() => setIsEditing(false)}
                onSave={async (saved: User) => {
                    if (selectedUser) {
                        // При редактировании обновляем пользователя в текущем списке
                        setUsers(prev => prev.map(u => (u.id === saved.id ? saved : u)));
                    } else {
                        // При создании нового пользователя обновляем текущую страницу
                        await refetch(page);
                    }
                    setIsEditing(false);
                }}
            />
        </div>
    );
}