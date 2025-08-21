import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import Button from "../components/Button/Button";
import Modal from "../components/Modal/Modal";
import styles from './DetailedPage.module.css';
import EditUserForm from "../components/EditModal/EditUserForm";
import { getUserById } from "../api/users";
import { User } from "../types";

export default function DetailedPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const location = useLocation();
    const [user, setUser] = useState<User | null>(null);
    const [isEditing, setIsEditing] = useState<boolean>(false);
    // const [editedName, setEditedName] = useState<string>("");
    // const [editedAvatar, setEditedAvatar] = useState<string>("");

    useEffect(() => {
        if (id) {
            getUserById(id)
                .then((data) => setUser(data))
                .catch((error) => console.error("Ошибка при загрузке пользователя:", error));
        }
    }, [id]);

    // useEffect(() => {
    //     if (user) {
    //         setEditedName(user.name);
    //         setEditedAvatar(user.avatar || "");
    //     }
    // }, [user]);
    
    if (!user) {
        return <p>Загрузка...</p>;
    }

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                {user.avatar && <img src={user.avatar} alt={user.name} className={styles.avatar} />}

                <div className={styles.info}>
                    <h2 className={styles.name}>{user.name}</h2>
                    <p className={styles.text}>ID: {user.id}</p>
                    <p className={styles.text}>E-mail: {user.email}</p>
                    {user.country && <p className={styles.text}>Country: {user.country}</p>}
                    {user.city && <p className={styles.text}>City: {user.city}</p>}
                    {user.createdAt && <p className={styles.text}>Created: {new Date(user.createdAt).toLocaleString()}</p>}

                    <div className={styles.buttons}>
                        <Button onClick={() => {
                            // Если пришли со страницы списка, возвращаемся на ту же страницу
                            const fromPage = location.state?.fromPage;
                            if (fromPage) {
                                navigate(`/?page=${fromPage}`);
                            } else {
                                navigate(-1);
                            }
                        }}>Назад</Button>
                    </div>
                </div>
            </div>

            {isEditing && (
                <Modal onClose={() => setIsEditing(false)}>
                    <EditUserForm
                        user={user}
                        onSave={(updatedUser: User) => {
                            setUser(updatedUser);
                            setIsEditing(false);
                        }}
                        onCancel={() => setIsEditing(false)}
                    />
                </Modal>
            )}
        </div>
    );
}
