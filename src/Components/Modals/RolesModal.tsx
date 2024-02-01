import { Modal } from "antd";
import ShowRoles from "../../Components/ShowRoles";
import { useAppContext } from "../../AppContext";


export const RolesModal = () => {
    const { showRoles, roles, setShowRoles } = useAppContext();

    return (
        <Modal
            title="Roles"
            open={showRoles}
            onOk={() => setShowRoles(false)}
            onCancel={() => setShowRoles(false)}
            footer={null}
            centered
        >
            <ShowRoles roles={roles} />
        </Modal>
    );
};