
import Button from "../Button/Button";
import styles from "./Pagination.module.css";

interface PaginationProps {
    page: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

export default function Pagination({ page, totalPages, onPageChange }: PaginationProps) {
    const canPrev = page > 1;
    const canNext = page < totalPages;

    return (
        <div className={styles.pagination}>
            <Button onClick={() => onPageChange(page - 1)} disabled={!canPrev}>
                Предыдущая
            </Button>

            <span className={styles.pageInfo}>
                Страница {page}{totalPages ? ` / ${totalPages}` : ""}
            </span>

            <Button onClick={() => onPageChange(page + 1)} disabled={!canNext}>
                Следующая
            </Button>
        </div>
    );
}
