import Button from "../Button/Button";
import styles from "./PageHeader.module.css";

interface PageHeaderProps {
    title: string;
    onAdd: () => void;
}

export default function PageHeader({ title, onAdd }: PageHeaderProps) {
    return (
        <div className={styles.header}>
            <h2 className={styles.title}>{title}</h2>
            <Button onClick={onAdd}>
                <span style={{ fontSize: '16px' }}>+</span>
                Добавить пользователя
            </Button>
        </div>
    );
}
