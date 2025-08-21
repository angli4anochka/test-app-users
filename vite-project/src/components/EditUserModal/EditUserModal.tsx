import Modal from "../Modal/Modal";
import EditUserForm from "../EditModal/EditUserForm";
import { User } from "../../types";

interface EditUserModalProps {
    open: boolean;
    user?: Partial<User>;
    mode: "edit" | "create";
    onCancel: () => void;
    onSave: (user: User) => void;
}

export default function EditUserModal({ open, user, mode, onCancel, onSave }: EditUserModalProps) {
    if (!open) return null;

    return (
        <Modal onClose={onCancel}>
            <EditUserForm
                key={user?.id ? `edit-${user.id}` : "create"} // сбрасывает форму при смене режима
                user={user}
                mode={mode}
                onCancel={onCancel}
                onSave={onSave}
            />
        </Modal>
    );
}
