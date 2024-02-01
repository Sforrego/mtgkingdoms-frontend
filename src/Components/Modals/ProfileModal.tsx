// ProfileModal.tsx
import { Modal } from "antd";
import { useCallback } from "react";
import Profile from "../../Components/Profile";
import { UserData } from "../../Types/UserData";
import { useAppContext } from '../../AppContext';



export const ProfileModal = () => {
    const { profile, user, userData, socket, setUserData, setProfile } = useAppContext();
    
    const getUserData = useCallback(() => {
        if (socket && user) {
          console.log("RequestingUserData");
          socket.emit("requestUserData", { userId: user.localAccountId });
      
          socket.on("receiveUserData", (updatedUserData: UserData) => {
            setUserData(updatedUserData);
            socket.off("receiveUserData");
          });
        }
      }, [socket, user, setUserData]);
    
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
            <Profile username={user?.name} userData={userData} getUserData={getUserData} />
        </Modal>
    );
};