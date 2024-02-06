import { ConfigProvider, theme } from "antd";
import { useEffect } from "react";

import { AppMenu } from "./Components/AppMenu";
import { ModalsComponent } from './Components/ModalsComponent';
import { ContentComponent } from './Components/ContentComponent';
import { SocketListener } from './Services/SocketListener';

import "./App.css";
import { useAppContext } from "./Context/AppContext";
import { useUserData } from './Hooks/useUserData';

function App() {
  const { isConnected, accountUser, socket } = useAppContext();

  const getUserData = useUserData();

  useEffect(() => {
    if (isConnected && accountUser && socket) {
      getUserData();
    }
  }, [isConnected, accountUser, socket, getUserData]);

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