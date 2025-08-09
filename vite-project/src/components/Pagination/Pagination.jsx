
import Button from "../Button/Button.jsx";
import styles from "./Pagination.module.css";


export default function Pagination({ page, totalPages, onPageChange }) {
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
