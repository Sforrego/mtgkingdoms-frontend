import { useEffect, useContext, useCallback } from "react";
import { ConfigProvider, theme } from "antd";
import { If, IfElse, OnFalse, OnTrue } from "conditional-jsx";

import { AppMenu } from "./Components/AppMenu";
import RolesModal from './Components/Modals/RolesModal';
import ProfileModal from './Components/Modals/ProfileModal';
import { GameRoom } from "./Pages/GameRoom";
import { Landing } from "./Pages/Landing";
import { AppContext, AppContextType } from './AppContext';
import { SocketListener } from './SocketListener';

import { UserData } from "./Types/UserData";

import { 
  createRoom, 
  joinRoom, 
} from "./gameService";

import "./App.css";

function App() {

  const context = useContext(AppContext);

  if (!context) {
    throw new Error('App must be used within an AppProvider');
  }

  const {
    isConnected, isInRoom, isLoggedIn, user, loginHandler, logoutHandler,
    userData, setUserData, roles, roomCode, setRoomCode, showRoles, 
    setShowRoles, profile, setProfile, socket
  } = context as AppContextType;

  const handleLogout = () => {
    if (socket && user) {
      logoutHandler(user, socket, roomCode);
    }
  };

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

  const handleShowRoles = () => {
    setShowRoles(true);
  };

  const handleProfile = () => {
    setProfile(true);
  };

  const handleOkRoles = () => {
    setShowRoles(false);
  };

  const handleCancelRoles = () => {
    setShowRoles(false);
  };

  const handleCancelProfile = () => {
    setProfile(false);
  };

  return (
    <div className="App">
      <SocketListener/>
      <ConfigProvider
        theme={{
          algorithm: theme.darkAlgorithm,
          token: { colorBgMask: "#000000" },
        }}
      >
        <AppMenu handleLogout={handleLogout} handleShowRoles={handleShowRoles} handleProfile={handleProfile} isLoggedIn={isLoggedIn}/>
        <IfElse condition={isConnected}>
          <OnTrue key="Connected">
            <div className="greenCircle" title="Connected to the server."/>
          </OnTrue>
          <OnFalse key="notConnected">
            <div className="redCircle" title="Disconnected from the server."/>
          </OnFalse>
        </IfElse>

        <If condition={showRoles}>
          <RolesModal roles={roles} showRoles={showRoles} handleOk={handleOkRoles} handleCancel={handleCancelRoles} />
        </If>
        <If condition={profile}>
          {user && <ProfileModal user={user} userData={userData} profile={profile} handleCancel={handleCancelProfile} getUserData={getUserData} />}
        </If>
        <IfElse condition={isLoggedIn}>
          <OnTrue key="loggedIn">
            <IfElse condition={isInRoom}>
              <OnTrue key="inRoom">
                <GameRoom/>
              </OnTrue>
              <OnFalse key="notInRoom">
                <IfElse condition={isConnected}>
                  <OnTrue key="Connected">
                    <p>Welcome {user?.name}!</p>
                    <Landing
                      createRoom={() => createRoom(user, socket)}
                      joinRoom={() => joinRoom(user, socket, roomCode)}
                      roomCode={roomCode}
                      setRoomCode={setRoomCode}
                    />
                  </OnTrue>
                  <OnFalse key="notConnected">
                  <p> Connecting to server... </p>
                  </OnFalse>
                </IfElse>
              </OnFalse>
            </IfElse>
          </OnTrue>
          <OnFalse key="notLoggedIn">
            <Landing handleLogin={loginHandler} />
          </OnFalse>
        </IfElse>
      </ConfigProvider>
    </div>
  );
}

export default App;