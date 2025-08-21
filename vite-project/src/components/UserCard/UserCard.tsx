import { MouseEvent } from 'react';
import styles from './UserCard.module.css';
import Button from "../Button/Button";
import { User } from "../../types";

interface UserCardProps {
    user: User;
    onClick: () => void;
    onEdit: (user: User) => void;
}

export default function UserCard({ user, onClick, onEdit }: UserCardProps) {
    return (
        <div className={styles.card}>
            <div className={styles.info} onClick={onClick}>
                <img src={user.avatar} alt={user.name} className={styles.avatar} />
                <span className={styles.name}>{user.name}</span>
            </div>
            <Button onClick={(e: MouseEvent) => {
                e.stopPropagation();
                onEdit(user);
            }}>
                Редактировать
            </Button>
        </div>
    );
}
