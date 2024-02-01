import { useEffect, useState, useCallback } from "react";
import { Modal, ConfigProvider, theme } from "antd";
import { If, IfElse, OnFalse, OnTrue } from "conditional-jsx";

import { AppMenu } from "./Components/AppMenu";
import ShowRoles from "./Components/ShowRoles";
import Profile from "./Components/Profile";
import { GameRoom } from "./Pages/GameRoom";
import { Landing } from "./Pages/Landing";
import { useSocket } from './useSocket';
import { useAuth } from './useAuth';

import { Role } from "./Types/Role";
import { User } from "./Types/User";
import { UserData } from "./Types/UserData";

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

const SERVER = process.env.REACT_APP_SERVER as string;

function App() {
  const [isConnected, setIsConnected] = useState(false);
  const [isInRoom, setIsInRoom] = useState(false);
  const { socket } = useSocket(SERVER, setIsConnected, setIsInRoom);
  const { isLoggedIn, user, loginHandler, logoutHandler } = useAuth();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [usersInRoom, setUsersInRoom] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [potentialRoles, setPotentialRoles] = useState<Role[]>([]);
  const [selectedRolesPool, setSelectedRolesPool] = useState<Role[]>([]);
  const [roomCode, setRoomCode] = useState("");
  const [showRoles, setShowRoles] = useState(false);
  const [profile, setProfile] = useState(false);
  const [team, setTeam] = useState<User[]>([]);
  const [nobles, setNobles] = useState<Role[]>([]);
  const [gameStarted, setGameStarted] = useState<boolean>(false);
  const [isRevealed, setIsRevealed] = useState<boolean>(false);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [selectingRole, setSelectingRole] = useState<boolean>(false);

  const handleLogout = () => {
    if (socket) {
      const logout = logoutHandler();
      logout(user, socket, roomCode);
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
  }, [socket, user]);

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

      socket.on("rolesData", (data) => {
        setRoles(data);
        setSelectedRolesPool(data);
      });

      // Listen for 'roomCreated' event from the server
      socket.on("roomCreated", ({ roomCode, users }) => {
        console.log(`Room created with code: ${roomCode}`);
        setRoomCode(roomCode);
        setIsInRoom(true);
        setUsersInRoom(users);
      });

      // Listen for 'joinedRoom' event from the server
      socket.on("joinedRoom", ({ roomCode, users, selectedRoles }) => {
        console.log(`Joined room with code: ${roomCode}`);
        setRoomCode(roomCode);
        setIsInRoom(true);
        setUsersInRoom(users);
        setSelectedRolesPool(selectedRoles);
      });

      // Listen for 'leftRoom' event from the server
      socket.on("leftRoom", () => {
        console.log(`Left room: ${roomCode}`);
        setIsInRoom(false);
        setRoomCode("");
      });

      socket.on("userJoinedRoom", ({ users }) => {
        console.log(`A user joined the room. Updated users: ${users}`);
        setUsersInRoom(users);
      });

      socket.on("userLeftRoom", ({ users }) => {
        console.log(`A user left the room. Updated users: ${users}`);
        setUsersInRoom(users);
      });

      socket.on("gameStarted", ({ team, nobles }) => {
        console.log("Game started. Role assigned.");
        setTeam(team);
        if (nobles.length > 0){
          setNobles(nobles)
        }
        setGameStarted(true);
      });

      socket.on("gameUpdated", ({ usersInRoom }) => {
        console.log("Game Updated.");
        setUsersInRoom(usersInRoom);
        if(user){
          const myUser: User = usersInRoom.find((u: User) => u.userId === user.localAccountId);
          if (myUser && myUser.isRevealed !== isRevealed){
            setIsRevealed(myUser.isRevealed);
          }
        }

      });

      socket.on("reconnectedToRoom", ({ team, usersInRoom, activeGame, roomCode }) => {
        if(user){
          console.log("Reconnected to room");
          setRoomCode(roomCode);
          setIsInRoom(true);
          setUsersInRoom(usersInRoom);
          setGameStarted(activeGame);
          setTeam(team);
          const myUser: User = usersInRoom.find((u: User) => u.userId === user.localAccountId);
          setIsRevealed(myUser.isRevealed);
          setSelectingRole(!myUser.hasSelectedRole)
          setPotentialRoles(myUser.potentialRoles);
        }
      });

      socket.on("gameEnded", ({ users }) => {
        console.log("Game Ended");
        setUsersInRoom(users);
        setNobles([]);
        setGameStarted(false);
        setPotentialRoles([]);
        setSelectedRole(null);
      });

      socket.on("rolesPoolUpdated", ({ roles }) => {
        setSelectedRolesPool(roles);
      });

      socket.on("selectRole", ({ potentialRoles }) =>{
        console.log("Selecting role")
        setSelectingRole(true);
        setPotentialRoles(potentialRoles);
      })

      // Listen for 'error' event from the server
      socket.on("error", (message) => {
        alert(message)
      });


      // Cleanup when component unmounts
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
  }, [isRevealed, roomCode, socket, user, roles.length]);

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
          <Modal
            title="Roles"
            open={showRoles}
            onOk={handleOkRoles}
            onCancel={handleCancelRoles}
            footer={null}
            centered
          >
          <ShowRoles roles={roles}></ShowRoles>
          </Modal>
        </If>
        <If condition={profile}>
          <Modal
            title="Profile"
            open={profile}
            onCancel={handleCancelProfile}
            footer={null}
            centered
          >
          <Profile username={user?.name} userData={userData} getUserData={getUserData}></Profile>
          </Modal>
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
