import styles from './UserCard.module.css';
import Button from "../Button/Button.jsx";

export default function UserCard({ user, onClick, onEdit }) {
    return (
        <div className={styles.card}>
            <div className={styles.info} onClick={onClick}>
                <img src={user.avatar} alt={user.name} className={styles.avatar} />
                <span className={styles.name}>{user.name}</span>
            </div>
            <Button onClick={(e) => {
                e.stopPropagation();
                onEdit(user);
            }}>
                Редактировать
            </Button>
        </div>
    );
}
