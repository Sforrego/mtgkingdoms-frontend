import { Modal } from "antd";
import Profile from "../../Components/Profile";
import { useAppContext } from '../../Context/AppContext';

export const ProfileModal = () => {
    const { profile, user, userData, setProfile } = useAppContext();
    
      const handleCancelProfile = () => {
        setProfile(false);
      };

    return (
        <Modal
            title="Profile"
            open={profile}
            onCancel={handleCancelProfile}
            footer={null}
            centered
        >
            <Profile username={user?.name} userData={userData}/>
        </Modal>
    );
};