// RolesModal.tsx
import { Modal } from "antd";
import ShowRoles from "../../Components/ShowRoles";
import { Role } from "../../Types/Role";

interface RolesModalProps {
    roles: Role[];
    showRoles: boolean;
    handleOk: () => void;
    handleCancel: () => void;
}

const RolesModal: React.FC<RolesModalProps> = ({ roles, showRoles, handleOk, handleCancel }) => {
    return (
        <Modal
            title="Roles"
            open={showRoles}
            onOk={handleOk}
            onCancel={handleCancel}
            footer={null}
            centered
        >
            <ShowRoles roles={roles} />
        </Modal>
    );
};

export default RolesModal;