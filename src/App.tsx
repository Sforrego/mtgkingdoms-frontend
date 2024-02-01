import { useEffect, useContext, useCallback } from "react";
import { ConfigProvider, theme } from "antd";
import { If, IfElse, OnFalse, OnTrue } from "conditional-jsx";

import { AppMenu } from "./Components/AppMenu";
import RolesModal from './Components/Modals/RolesModal';
import ProfileModal from './Components/Modals/ProfileModal';
import { GameRoom } from "./Pages/GameRoom";
import { Landing } from "./Pages/Landing";
import { AppContext, AppContextType } from './AppContext';

import { Role } from "./Types/Role";
import { User } from "./Types/User";
import { UserData } from "./Types/UserData";
import { RoomCreatedEvent, JoinedRoomEvent, UserRoomEvent, GameStartedEvent, GameUpdatedEvent, ReconnectedToRoomEvent, RolesPoolUpdatedEvent, SelectRoleEvent, ErrorEvent } from './Types/SocketEvents';

import { 
  createRoom, 
  joinRoom, 
  startGame, 
  leaveRoom, 
  revealRole, 
  updateRolesPool,
  endGame,
  selectRole,
  chosenOneDecision,
  selectCultists
} from "./gameService";

import "./App.css";

function App() {

  const context = useContext(AppContext);

  if (!context) {
    throw new Error('App must be used within an AppProvider');
  }

  const {
    isConnected, isInRoom, setIsInRoom, isLoggedIn, user, loginHandler, logoutHandler,
    userData, setUserData, usersInRoom, setUsersInRoom, roles, setRoles, potentialRoles, setPotentialRoles,
    selectedRolesPool, setSelectedRolesPool, roomCode, setRoomCode, showRoles, setShowRoles, profile, setProfile,
    team, setTeam, nobles, setNobles, gameStarted, setGameStarted, isRevealed, setIsRevealed, selectedRole, setSelectedRole,
    selectingRole, setSelectingRole, socket
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

  useEffect(() => {
    if (socket) {

      if (roles.length===0){
        socket && socket.emit("getRoles");
      }

      socket.on("rolesData", (data: Role[]) => {
        setRoles(data);
        setSelectedRolesPool(data);
      });

      socket.on("roomCreated", ({ roomCode, users }: RoomCreatedEvent) => {
        console.log(`Room created with code: ${roomCode}`);
        setRoomCode(roomCode);
        setIsInRoom(true);
        setUsersInRoom(users);
      });

      socket.on("joinedRoom", ({ roomCode, users, selectedRoles }: JoinedRoomEvent) => {
        console.log(`Joined room with code: ${roomCode}`);
        setRoomCode(roomCode);
        setIsInRoom(true);
        setUsersInRoom(users);
        setSelectedRolesPool(selectedRoles);
      });

      socket.on("leftRoom", () => {
        console.log(`Left room: ${roomCode}`);
        setIsInRoom(false);
        setRoomCode("");
      });

      socket.on("userJoinedRoom", ({ users }: UserRoomEvent) => {
        console.log(`A user joined the room. Updated users: ${users}`);
        setUsersInRoom(users);
      });

      socket.on("userLeftRoom", ({ users }: UserRoomEvent) => {
        console.log(`A user left the room. Updated users: ${users}`);
        setUsersInRoom(users);
      });

      socket.on("gameStarted", ({ team, nobles }: GameStartedEvent) => {
        console.log("Game started. Role assigned.");
        setTeam(team);
        if (nobles.length > 0){
          setNobles(nobles)
        }
        setGameStarted(true);
      });

      socket.on("gameUpdated", ({ usersInRoom }: GameUpdatedEvent) => {
        console.log("Game Updated.");
        setUsersInRoom(usersInRoom);
        if(user){
          const myUser: User | undefined = usersInRoom.find((u: User) => u.userId === user.localAccountId);
          if (myUser) {
            if (myUser.isRevealed !== isRevealed){
              setIsRevealed(myUser.isRevealed);
            }
          } else {
            console.log("User not found in usersInRoom")
          }
        }
      });

      socket.on("reconnectedToRoom", ({ team, usersInRoom, activeGame, roomCode }: ReconnectedToRoomEvent) => {
        if(user){
          console.log("Reconnected to room");
          setRoomCode(roomCode);
          setIsInRoom(true);
          setUsersInRoom(usersInRoom);
          setGameStarted(activeGame);
          setTeam(team);
          const myUser: User | undefined = usersInRoom.find((u: User) => u.userId === user.localAccountId);
          if (myUser) {
            setIsRevealed(myUser.isRevealed);
            setSelectingRole(!myUser.hasSelectedRole)
            setPotentialRoles(myUser.potentialRoles);
          } else {
            console.log("User not found in usersInRoom")
          }
        }
      });

      socket.on("gameEnded", ({ users }: UserRoomEvent) => {
        console.log("Game Ended");
        setUsersInRoom(users);
        setNobles([]);
        setGameStarted(false);
        setPotentialRoles([]);
        setSelectedRole(null);
      });

      socket.on("rolesPoolUpdated", ({ roles }: RolesPoolUpdatedEvent) => {
        setSelectedRolesPool(roles);
      });

      socket.on("selectRole", ({ potentialRoles }: SelectRoleEvent) =>{
        console.log("Selecting role")
        setSelectingRole(true);
        setPotentialRoles(potentialRoles);
      })

      socket.on("error", (message: ErrorEvent) => {
        alert(message)
      });

      return () => {
        socket.off("rolesData");
        socket.off("roomCreated");
        socket.off("joinedRoom");
        socket.off("leftRoom");
        socket.off("userJoinedRoom");
        socket.off("userLeftRoom");
        socket.off("gameStarted");
        socket.off("gameUpdated");
        socket.off("reconnectedToRoom");
        socket.off("gameEnded");
        socket.off("selectCharacter")
        socket.off("error");
      };
    }
  }, [isRevealed, roomCode, socket, user, roles.length, setGameStarted, 
    setIsInRoom, setIsRevealed, setNobles, setPotentialRoles, setRoles, 
    setRoomCode, setSelectedRole, setSelectedRolesPool, setSelectingRole, setTeam, setUsersInRoom]);
    
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
                <GameRoom
                  roomCode={roomCode}
                  users={usersInRoom}
                  gameStarted={gameStarted}
                  team={team}
                  nobles={nobles}
                  isRevealed={isRevealed}
                  roles={roles}
                  selectedRolesPool={selectedRolesPool}
                  selectedRole={selectedRole}
                  selectingRole={selectingRole}
                  startGame={() => startGame(socket, roomCode)}
                  leaveRoom={() => leaveRoom(user, socket, roomCode)}
                  revealRole={() => revealRole(user, socket, roomCode)}
                  updateRolesPool={(updatedRolesPool) => updateRolesPool(updatedRolesPool, socket, roomCode)}
                  endGame={() => endGame(socket, usersInRoom, roomCode)}
                  setSelectingRole={setSelectingRole}
                  setSelectedRolesPool={setSelectedRolesPool}
                  setSelectedRole={setSelectedRole} 
                  selectRole={() => selectRole(socket, user?.localAccountId, roomCode, selectedRole)}
                  chosenOneDecision={() => chosenOneDecision(socket, user?.localAccountId, roomCode)}
                  selectCultists={() => selectCultists(socket, user?.localAccountId, usersInRoom, roomCode)}
                  potentialRoles={potentialRoles}
                />
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