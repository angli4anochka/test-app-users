import Modal from "../Modal/Modal.jsx";
import EditUserForm from "../EditModal/EditUserForm.jsx";

export default function EditUserModal({ open, user, mode, onCancel, onSave }) {
    if (!open) return null;

    return (
        <Modal onClose={onCancel}>
            <EditUserForm
                key={user?.id ? `edit-${user.id}` : "create"} // сбрасывает форму при смене режима
                user={user || { name: "", avatar: "" }}
                mode={mode}
                onCancel={onCancel}
                onSave={onSave}
            />
        </Modal>
    );
}
