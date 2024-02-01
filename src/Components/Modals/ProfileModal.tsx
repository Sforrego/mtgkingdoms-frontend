// ProfileModal.tsx
import { Modal } from "antd";
import Profile from "../../Components/Profile";
import { UserData } from "../../Types/UserData";
import { AccountInfo } from "@azure/msal-browser";

interface ProfileModalProps {
    user: AccountInfo | null;
    userData: UserData | null;
    profile: boolean;
    handleCancel: () => void;
    getUserData: () => void;
}

const ProfileModal: React.FC<ProfileModalProps> = ({ user, userData, profile, handleCancel, getUserData }) => {
    return (
        <Modal
            title="Profile"
            open={profile}
            onCancel={handleCancel}
            footer={null}
            centered
        >
            <Profile username={user?.name} userData={userData} getUserData={getUserData} />
        </Modal>
    );
};

export default ProfileModal;