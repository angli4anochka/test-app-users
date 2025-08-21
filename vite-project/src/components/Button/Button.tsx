import { ReactNode, MouseEventHandler } from 'react';
import styles from './Button.module.css';

interface ButtonProps {
    children: ReactNode;
    onClick?: MouseEventHandler<HTMLButtonElement>;
    disabled?: boolean;
}

export default function Button({ children, onClick, disabled = false }: ButtonProps) {
    return (
        <button
            className={styles.button}
            onClick={onClick}
            disabled={disabled}
        >
            {children}
        </button>
    );
}
