import { useState } from 'react';
import { User } from '../../types';
import styles from './UserTable.module.css';

interface UserTableProps {
    users: User[];
    onUserClick: (id: number) => void;
    onEdit: (user: User) => void;
    onDelete?: (id: number) => void;
}

type SortField = 'id' | 'name';
type SortDirection = 'asc' | 'desc';

export default function UserTable({ users, onUserClick, onEdit, onDelete }: UserTableProps) {
    const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
    const [sortField, setSortField] = useState<SortField>('id');
    const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
    const [hoveredRow, setHoveredRow] = useState<number | null>(null);

    const handleSelectAll = () => {
        if (selectedRows.size === users.length) {
            setSelectedRows(new Set());
        } else {
            setSelectedRows(new Set(users.map(u => u.id)));
        }
    };

    const handleSelectRow = (id: number, e: React.MouseEvent) => {
        e.stopPropagation();
        const newSelected = new Set(selectedRows);
        if (newSelected.has(id)) {
            newSelected.delete(id);
        } else {
            newSelected.add(id);
        }
        setSelectedRows(newSelected);
    };

    const handleSort = (field: SortField) => {
        if (sortField === field) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDirection('asc');
        }
    };

    const sortedUsers = [...users].sort((a, b) => {
        const aValue = a[sortField] || '';
        const bValue = b[sortField] || '';
        
        if (sortField === 'id') {
            return sortDirection === 'asc' 
                ? Number(aValue) - Number(bValue)
                : Number(bValue) - Number(aValue);
        }
        
        const comparison = String(aValue).localeCompare(String(bValue));
        return sortDirection === 'asc' ? comparison : -comparison;
    });

    const getSortIcon = (field: SortField) => {
        if (sortField !== field) return '↕';
        return sortDirection === 'asc' ? '↑' : '↓';
    };

    return (
        <div className={styles.tableContainer}>
            <table className={styles.table}>
                <thead>
                    <tr className={styles.headerRow}>
                        <th className={styles.checkboxCell}>
                            <input
                                type="checkbox"
                                checked={selectedRows.size === users.length && users.length > 0}
                                onChange={handleSelectAll}
                                className={styles.checkbox}
                            />
                        </th>
                        <th className={styles.headerCell} onClick={() => handleSort('id')}>
                            <div className={styles.headerContent}>
                                №
                                <span className={styles.sortIcon}>{getSortIcon('id')}</span>
                            </div>
                        </th>
                        <th className={styles.avatarHeader}>
                            Фото
                        </th>
                        <th className={styles.headerCell} onClick={() => handleSort('name')}>
                            <div className={styles.headerContent}>
                                Имя пользователя
                                <span className={styles.sortIcon}>{getSortIcon('name')}</span>
                            </div>
                        </th>
                        <th className={styles.actionsHeader}>
                            Действия
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {sortedUsers.map((user) => (
                        <tr
                            key={user.id}
                            className={`${styles.row} ${selectedRows.has(user.id) ? styles.selected : ''} ${hoveredRow === user.id ? styles.hovered : ''}`}
                            onClick={() => onUserClick(user.id)}
                            onMouseEnter={() => setHoveredRow(user.id)}
                            onMouseLeave={() => setHoveredRow(null)}
                        >
                            <td className={styles.checkboxCell} onClick={(e) => e.stopPropagation()}>
                                <input
                                    type="checkbox"
                                    checked={selectedRows.has(user.id)}
                                    onChange={(e) => handleSelectRow(user.id, e as any)}
                                    className={styles.checkbox}
                                />
                            </td>
                            <td className={styles.idCell}>
                                <span className={styles.idBadge}>{user.id}</span>
                            </td>
                            <td className={styles.avatarCell}>
                                {user.avatar ? (
                                    <img 
                                        src={user.avatar} 
                                        alt={user.name} 
                                        className={styles.avatar}
                                    />
                                ) : (
                                    <div className={styles.avatarPlaceholder}>
                                        {user.name.charAt(0).toUpperCase()}
                                    </div>
                                )}
                            </td>
                            <td className={styles.nameCell}>
                                <span className={styles.name}>{user.name}</span>
                            </td>
                            <td className={styles.actionsCell}>
                                <button
                                    className={styles.actionButton}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onUserClick(user.id);
                                    }}
                                    title="Подробнее"
                                >
                                    👁️
                                </button>
                                <button
                                    className={styles.actionButton}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onEdit(user);
                                    }}
                                    title="Редактировать"
                                >
                                    ✏️
                                </button>
                                {onDelete && (
                                    <button
                                        className={`${styles.actionButton} ${styles.deleteButton}`}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            if (window.confirm(`Удалить пользователя ${user.name}?`)) {
                                                onDelete(user.id);
                                            }
                                        }}
                                        title="Удалить"
                                    >
                                        🗑️
                                    </button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            
            {users.length === 0 && (
                <div className={styles.emptyState}>
                    Нет данных для отображения
                </div>
            )}

            {selectedRows.size > 0 && (
                <div className={styles.selectionInfo}>
                    Выбрано: {selectedRows.size} из {users.length}
                </div>
            )}
        </div>
    );
}