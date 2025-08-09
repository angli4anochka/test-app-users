import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import Button from "../components/Button/Button.jsx";
import Modal from "../components/Modal/Modal.jsx";
import styles from './DetailedPage.module.css';
import EditUserForm from "../components/EditModal/EditUserForm.jsx";
import { getUserById } from "../api/users.js";


export default function DetailedPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editedName, setEditedName] = useState("");
    const [editedAvatar, setEditedAvatar] = useState("");


    useEffect(() => {
        getUserById(id)
            .then((data) => setUser(data))
            .catch((error) => console.error("Ошибка при загрузке пользователя:", error));
    }, [id]);

    useEffect(() => {
        if (user) {
            setEditedName(user.name);
            setEditedAvatar(user.avatar);
        }
    }, [user]);
    if (!user) {
        return <p>Загрузка...</p>;
    }

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <img src={user.avatar} alt={user.name} className={styles.avatar} />

                <div className={styles.info}>
                    <h2 className={styles.name}>{user.name}</h2>
                    <p className={styles.text}>ID: {user.id}</p>
                    <p className={styles.text}>E-mail: {user.email}</p>
                    <p className={styles.text}>Country: {user.country}</p>
                    <p className={styles.text}>City: {user.city}</p>
                    <p className={styles.text}>Created: {new Date(user.createdAt).toLocaleString()}</p>

                    <div className={styles.buttons}>
                        <Button onClick={() => navigate(-1)}>Назад</Button>
                    </div>
                </div>
            </div>

            {isEditing && (
                <Modal onClose={() => setIsEditing(false)}>
                    <EditUserForm
                        user={user}
                        onSave={(updatedUser) => {
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
