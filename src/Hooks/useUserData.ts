// useUserData.ts
import { useCallback } from 'react';
import { UserData } from '../Types/UserData';
import { useAppContext } from '../Context/AppContext';

export const useUserData = () => {
    const { user, socket, setUserData } = useAppContext();

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

    return getUserData;
};