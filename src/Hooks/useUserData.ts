// useUserData.ts
import { useCallback } from 'react';
import { UserData } from '../Types/UserData';
import { useAppContext } from '../Context/AppContext';

export const useUserData = () => {
    const { accountUser, socket, setUserData } = useAppContext();

    const getUserData = useCallback(() => {
        if (socket && accountUser) {
            console.log("RequestingUserData");
            socket.emit("requestUserData", { userId: accountUser.localAccountId });

            socket.on("receiveUserData", (updatedUserData: UserData) => {
                setUserData(updatedUserData);
                socket.off("receiveUserData");
            });
        }
    }, [socket, accountUser, setUserData]);

    return getUserData;
};