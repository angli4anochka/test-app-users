import { useState, FormEvent } from "react";
import { updateUser, createUser } from "../../api/users";
import Button from "../Button/Button";
import styles from "./EditUserForm.module.css";
import { User } from "../../types";

interface EditUserFormProps {
    user?: Partial<User>;
    onSave: (user: User) => void;
    onCancel: () => void;
    mode?: "edit" | "create";
}

interface FormErrors {
    [key: string]: string;
}

export default function EditUserForm({ user = {}, onSave, onCancel, mode = "edit" }: EditUserFormProps) {
    // Основные поля
    const [name, setName] = useState<string>(user.name ?? "");
    const [email, setEmail] = useState<string>(user.email ?? "");
    const [avatar, setAvatar] = useState<string>(user.avatar ?? "");
    const [country, setCountry] = useState<string>(user.country ?? "");
    const [city, setCity] = useState<string>(user.city ?? "");
    
    const [isSaving, setIsSaving] = useState<boolean>(false);
    const [errors, setErrors] = useState<FormErrors>({});

    const validateName = (v: string): string => {
        const val = v.trim();
        if (!val) return "Имя обязательно";
        if (val.length < 2) return "Минимум 2 символа";
        return "";
    };
    
    const validateEmail = (v: string): string => {
        const val = v.trim();
        if (!val) return "Email обязателен";
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(val)) return "Некорректный email";
        return "";
    };
    
    const validateAvatar = (v: string): string => {
        const val = v.trim();
        if (val && val.length > 0) {
            try {
                const url = new URL(val);
                if (!(url.protocol === "http:" || url.protocol === "https:")) return "URL должен начинаться с http/https";
            } catch {
                return "Введите корректный URL";
            }
        }
        return "";
    };

    const handleSubmit = async (e: FormEvent): Promise<void> => {
        e.preventDefault();
        
        // Валидация обязательных полей
        const newErrors: FormErrors = {
            name: validateName(name),
            email: validateEmail(email),
            avatar: validateAvatar(avatar),
        };
        
        setErrors(newErrors);
        
        // Проверяем есть ли ошибки
        const hasErrors = Object.values(newErrors).some(error => error !== "");
        if (hasErrors) return;

        setIsSaving(true);
        try {
            const payload: any = {
                name: name.trim(),
                email: email.trim(),
                avatar: avatar.trim(),
                country: country.trim(),
                city: city.trim(),
            };
            
            const result = mode === "create"
                ? await createUser(payload)
                : await updateUser(user.id!, payload);

            onSave(result);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className={styles.form}>
            <h3 className={styles.title}>
                {mode === "create" ? "Создать пользователя" : "Редактировать пользователя"}
            </h3>

            <div className={styles.field}>
                <label className={styles.label} htmlFor="name">Имя *</label>
                <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={`${styles.input} ${errors.name ? styles.invalid : ""}`}
                    placeholder="Введите имя"
                />
                {errors.name && <span className={styles.error}>{errors.name}</span>}
            </div>

            <div className={styles.field}>
                <label className={styles.label} htmlFor="email">Email *</label>
                <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`${styles.input} ${errors.email ? styles.invalid : ""}`}
                    placeholder="user@example.com"
                />
                {errors.email && <span className={styles.error}>{errors.email}</span>}
            </div>

            <div className={styles.field}>
                <label className={styles.label} htmlFor="avatar">Аватар (URL)</label>
                <input
                    id="avatar"
                    type="text"
                    value={avatar}
                    onChange={(e) => setAvatar(e.target.value)}
                    className={`${styles.input} ${errors.avatar ? styles.invalid : ""}`}
                    placeholder="https://example.com/avatar.png"
                />
                {errors.avatar && <span className={styles.error}>{errors.avatar}</span>}
            </div>

            <div className={styles.field}>
                <label className={styles.label} htmlFor="country">Страна</label>
                <input
                    id="country"
                    type="text"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className={styles.input}
                    placeholder="Россия"
                />
            </div>

            <div className={styles.field}>
                <label className={styles.label} htmlFor="city">Город</label>
                <input
                    id="city"
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className={styles.input}
                    placeholder="Москва"
                />
            </div>

            <div className={styles.actions}>
                <Button onClick={onCancel} disabled={isSaving}>Отмена</Button>
                <Button disabled={isSaving}>
                    {isSaving ? "Сохраняю..." : (mode === "create" ? "Создать" : "Сохранить")}
                </Button>
            </div>
        </form>
    );
}