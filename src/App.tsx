import { ConfigProvider, theme } from "antd";
import { useCallback, useEffect } from "react";

import { AppMenu } from "./Components/AppMenu";
import { ModalsComponent } from './Components/ModalsComponent';
import { ContentComponent } from './Components/ContentComponent';
import { SocketListener } from './Services/SocketListener';

import "./App.css";
import { UserData } from "./Types/UserData";
import { useAppContext } from "./Context/AppContext";

function App() {
  const { isConnected, user, socket, setUserData } = useAppContext();

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

  useEffect(() => {
    if (isConnected && user && socket) {
      socket.emit("login", { userId: user.localAccountId, username: user.name });
      getUserData();
    }
  }, [isConnected, user, socket, getUserData]);

  return (
    <div className="App">
      <ConfigProvider
        theme={{
          algorithm: theme.darkAlgorithm,
          token: { colorBgMask: "#000000" },
        }}
        >
        <SocketListener/>
        <AppMenu/>
        <ModalsComponent/>
        <ContentComponent/>
      </ConfigProvider>
    </div>
  );
}

export default App;