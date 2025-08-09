import Button from "../Button/Button.jsx";
import styles from "./PageHeader.module.css";

export default function PageHeader({ title, onAdd }) {
    return (
        <div className={styles.header}>
            <h2 className={styles.title}>{title}</h2>
            <Button onClick={onAdd}>Добавить пользователя</Button>
        </div>
    );
}
