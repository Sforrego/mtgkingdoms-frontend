import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { AccountInfo } from "@azure/msal-browser";
import {
  Modal,
  ConfigProvider,
  theme,
} from "antd";
import { Role } from "./Types/Role";
import { User } from "./Types/User";
import { GameRoom } from "./Pages/GameRoom";
import { Landing } from "./Pages/Landing";
import "./App.css";
import { If, IfElse, OnFalse, OnTrue } from "conditional-jsx";
import { AppMenu } from "./Components/AppMenu";
import ShowRoles from "./Components/ShowRoles";
import { 
  handleRedirectEffect,
  handleAADB2C90091ErrorEffect,
  handleLogin,
  handleLogout} from "./authService";
import { 
    createRoom, 
    joinRoom, 
    startGame, 
    leaveRoom, 
    revealRole, 
    selectRoles,
    endGame,
    chosenOneDecision,
    selectCultists
  } from "./gameService";

const SERVER = process.env.REACT_APP_SERVER as string;

console.log(SERVER);

function App() {
  const [isConnected, setIsConnected] = useState(false);
  const [isInRoom, setIsInRoom] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<AccountInfo | null>(null);
  const [usersInRoom, setUsersInRoom] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [selectedRoles, setSelectedRoles] = useState<Role[]>([]);
  const [roomCode, setRoomCode] = useState("");
  const [socket, setSocket] = useState<Socket | null>(null);
  const [showRoles, setShowRoles] = useState(false);
  const [team, setTeam] = useState<User[]>([]);
  const [gameStarted, setGameStarted] = useState<boolean>(false);
  const [isRevealed, setIsRevealed] = useState<boolean>(false);

  useEffect(() => {
    const newSocket = io(SERVER);
    setSocket(newSocket);

    newSocket.on("connect", () => {
      setIsConnected(true);
    });

    newSocket.on("disconnect", () => {
      setIsConnected(false);
      setIsInRoom(false);
    });

    newSocket.on("connect_error", (error) => {
      console.log("Connection error:", error);
      setTimeout(() => {
        newSocket.connect();
      }, 1000);
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (isConnected && user && socket) {
      socket.emit("login", { userId: user.homeAccountId, username: user.name });
    }
  }, [isConnected, user, socket]);

  useEffect(() => {
    handleAADB2C90091ErrorEffect();
  }, []);

  useEffect(() => {
    handleRedirectEffect(setUser, setIsLoggedIn)
  }, [setIsLoggedIn]);

  const loginHandler = async () => {
    await handleLogin(setUser, setIsLoggedIn)
  };

  // Finally, you can use the leaveRoom() function when handling logout
  const logoutHandler = async () => {
    await handleLogout(setIsLoggedIn, () => leaveRoom(user, socket, roomCode))
  };

  const handleShowRoles = () => {
    setShowRoles(true);
  };

  useEffect(() => {
    if (socket) {

      if (roles.length===0){
        socket && socket.emit("getRoles");
      }

      socket.on("rolesData", (data) => {
        setRoles(data);
        setSelectedRoles(data);
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
        setSelectedRoles(selectedRoles);
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

      socket.on("gameStarted", ({ team }) => {
        console.log("Game started. Role assigned.");
        setTeam(team);
        setGameStarted(true);
      });

      socket.on("gameUpdated", ({ users }) => {
        console.log("Game Updated.");
        setUsersInRoom(users);
        if(user){
          const myUser: User = users.find((u: User) => u.userId === user.homeAccountId);
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
          setIsRevealed(team[0].isRevealed);
          setTeam(team);
        }
      });

      socket.on("gameEnded", ({ users }) => {
        console.log("Game Ended");
        setUsersInRoom(users);
        setGameStarted(false);
      });

      socket.on("rolesSelected", ({ roles }) => {
        setSelectedRoles(roles);
      });

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
        socket.off("error");
      };
    }
  }, [isRevealed, roomCode, socket, user, roles.length]);

  const handleOk = () => {
    setShowRoles(false);
  };

  const handleCancel = () => {
    setShowRoles(false);
  };

  return (
    <div className="App">
      <ConfigProvider
        theme={{
          algorithm: theme.darkAlgorithm,
          token: { colorBgBase: "#000000" },
        }}
      >
        <AppMenu handleLogout={logoutHandler} handleShowRoles={handleShowRoles}/>
        <IfElse condition={isConnected}>
          <OnTrue key="Connected">
            <div className="greenCircle" title="Connected to the server."/>
          </OnTrue>
          <OnFalse key="notConnected">
            <div className="redCircle" title="Disconnected from the server."/>
          </OnFalse>
        </IfElse>

        {/* Show the roles in a modal, should be its own component */}
        <If condition={showRoles}>
          <Modal
            title="Roles"
            open={showRoles}
            onOk={handleOk}
            onCancel={handleCancel}
            footer={null}
            centered
          >
          <ShowRoles roles={roles}></ShowRoles>
          </Modal>
        </If>
        <IfElse condition={isLoggedIn}>
          <OnTrue key="loggedIn">
            {/* Connected in a room */}
            <IfElse condition={isInRoom}>
              <OnTrue key="inRoom">
                <GameRoom
                  roomCode={roomCode}
                  users={usersInRoom}
                  gameStarted={gameStarted}
                  team={team}
                  isRevealed={isRevealed}
                  roles={roles}
                  selectedRoles={selectedRoles}
                  startGame={() => startGame(socket, roomCode)}
                  leaveRoom={() => leaveRoom(user, socket, roomCode)}
                  revealRole={() => revealRole(user, socket, roomCode)}
                  selectRoles={(selectedRoles) => selectRoles(selectedRoles, socket, roomCode)}
                  endGame={() => endGame(socket, usersInRoom, roomCode)}
                  setSelectedRoles={setSelectedRoles}
                  chosenOneDecision={() => chosenOneDecision(socket, user?.homeAccountId, roomCode)}
                  selectCultists={() => selectCultists(socket, user?.homeAccountId, usersInRoom, roomCode)}
                />
              </OnTrue>
              <OnFalse key="notInRoom">
              <p>Welcome {user?.name}!</p>
                <Landing
                  createRoom={() => createRoom(user, socket)}
                  joinRoom={() => joinRoom(user, socket, roomCode)}
                  roomCode={roomCode}
                  setRoomCode={setRoomCode}
                />
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
