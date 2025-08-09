import { useState } from "react";
import { updateUser, createUser } from "../../api/users";
import Button from "../Button/Button.jsx";
import styles from "./EditUserForm.module.css";

export default function EditUserForm({ user = {}, onSave, onCancel, mode = "edit" }) {
    const [name, setName] = useState(user.name ?? "");
    const [avatar, setAvatar] = useState(user.avatar ?? "");
    const [isSaving, setIsSaving] = useState(false);
    const [errors, setErrors] = useState({ name: "", avatar: "" });
    const [touched, setTouched] = useState({ name: false, avatar: false });

    const validateName = (v) => {
        const val = v.trim();
        if (!val) return "Поле не должно быть пустым";
        if (val.length < 3) return "Минимум 3 символа";
        return "";
    };
    const validateAvatar = (v) => {
        const val = v.trim();
        if (!val) return "Поле не должно быть пустым";
        try {
            const url = new URL(val);
            if (!(url.protocol === "http:" || url.protocol === "https:")) return "URL должен начинаться с http/https";
        } catch {
            return "Введите корректный URL";
        }
        return "";
    };

    const handleBlur = (field) => {
        setTouched((t) => ({ ...t, [field]: true }));
        setErrors((e) => ({
            ...e,
            [field]: field === "name" ? validateName(name) : validateAvatar(avatar),
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const nextErrors = { name: validateName(name), avatar: validateAvatar(avatar) };
        setTouched({ name: true, avatar: true });
        setErrors(nextErrors);
        if (nextErrors.name || nextErrors.avatar) return;

        setIsSaving(true);
        try {
            const payload = { name: name.trim(), avatar: avatar.trim() };
            const result =
                mode === "create"
                    ? await createUser(payload)
                    : await updateUser(user.id, payload);

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
                <label className={styles.label} htmlFor="name">Имя</label>
                <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    onBlur={() => handleBlur("name")}
                    className={`${styles.input} ${errors.name ? styles.invalid : ""}`}
                    placeholder="Введите имя (мин. 3 символа)"
                />
                {errors.name && <span className={styles.error}>{errors.name}</span>}
            </div>

            <div className={styles.field}>
                <label className={styles.label} htmlFor="avatar">Аватар (URL)</label>
                <input
                    id="avatar"
                    type="text"
                    value={avatar}
                    onChange={(e) => setAvatar(e.target.value)}
                    onBlur={() => handleBlur("avatar")}
                    className={`${styles.input} ${errors.avatar ? styles.invalid : ""}`}
                    placeholder="https://example.com/avatar.png"
                />
                {errors.avatar && <span className={styles.error}>{errors.avatar}</span>}
            </div>

            <div className={styles.actions}>
                <Button type="button" onClick={onCancel} disabled={isSaving}>Отмена</Button>
                <Button type="submit" disabled={isSaving}>
                    {isSaving ? "Сохраняю..." : (mode === "create" ? "Создать" : "Сохранить")}
                </Button>
            </div>
        </form>
    );
}
