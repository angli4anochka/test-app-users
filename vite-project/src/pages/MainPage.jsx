import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useUsersPage from "../hooks/useUsersPage";

import PageHeader from "../components/PageHeader/PageHeader.jsx";
import EditUserModal from "../components/EditUserModal/EditUserModal.jsx";
import Pagination from "../components/Pagination/Pagination.jsx";
import UserCard from "../components/UserCard/UserCard.jsx";
import styles from "./MainPage.module.css";

export default function MainPage() {
    const navigate = useNavigate();

    const {
        users, setUsers,
        page, setPage,
        isLoading, error,
        total, totalPages,
        limit, refetch,
    } = useUsersPage(1, 10);

    const [isEditing, setIsEditing] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

    const handleUserClick = (id) => navigate(`/users/${id}`);
    const openCreate = () => { setSelectedUser(null); setIsEditing(true); };

    return (
        <div className={styles.container}>
            {isLoading && <p>Загрузка...</p>}
            {error && <p className={styles.error}>{error}</p>}

            <PageHeader title="Список пользователей" onAdd={openCreate} />

            <div className={styles.list}>
                {users.map((user) => (
                    <UserCard
                        key={user.id}
                        user={user}
                        onClick={() => handleUserClick(user.id)}
                        onEdit={(u) => { setSelectedUser(u); setIsEditing(true); }}
                    />
                ))}
            </div>

            <Pagination
                page={page}
                totalPages={totalPages}
                onPageChange={(next) => {
                    if (next < 1) return;
                    if (!total && next > page && users.length < limit) return;
                    setPage(next);
                }}
            />

            <EditUserModal
                open={isEditing}
                user={selectedUser}
                mode={selectedUser ? "edit" : "create"}
                onCancel={() => setIsEditing(false)}
                onSave={async (saved) => {
                    if (selectedUser) {
                        setUsers(prev => prev.map(u => (u.id === saved.id ? saved : u)));
                    } else {
                        await refetch(1);
                    }
                    setIsEditing(false);
                }}
            />
        </div>
    );
}
