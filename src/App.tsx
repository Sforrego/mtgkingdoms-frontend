import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { AccountInfo, PublicClientApplication } from "@azure/msal-browser";
import { RoleCard } from "./Components/RoleCard";
import {
  Modal,
  Carousel,
  ConfigProvider,
  theme,
} from "antd";
import { ArrowLeftOutlined, ArrowRightOutlined } from "@ant-design/icons";
import { Role } from "./Types/Role";
import { User } from "./Types/User";
import { GameRoom } from "./Pages/GameRoom";
import { Landing } from "./Pages/Landing";

import "./App.css";
import { If, IfElse, OnFalse, OnTrue } from "conditional-jsx";
import { AppMenu } from "./Components/AppMenu";

const SERVER = process.env.REACT_APP_SERVER as string;
const clientId = process.env.REACT_APP_MTGKINGDOMS_CLIENT_ID as string;

console.log(SERVER);

// Initialize the MSAL application object
const msalConfig = {
  auth: {
    clientId: clientId,
    authority:
      "https://MTGKingdoms.b2clogin.com/MTGKingdoms.onmicrosoft.com/B2C_1_signupsignin",
    knownAuthorities: ["MTGKingdoms.b2clogin.com"],
    postLogoutRedirectUri: window.location.origin,
  },
};

const myMSALObj = new PublicClientApplication(msalConfig);

// Login request
const loginRequest = {
  scopes: ["openid", "profile"],
};

function App() {
  const [isConnected, setIsConnected] = useState(false);
  const [isInRoom, setIsInRoom] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<AccountInfo | null>(null);
  const [usersInRoom, setUsersInRoom] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [roomCode, setRoomCode] = useState("");
  const [socket, setSocket] = useState<Socket | null>(null);
  const [showRoles, setShowRoles] = useState(false);
  const [myRole, setMyRole] = useState<Role | null>(null);
  const [teammates, setTeammates] = useState<User[]>([]);
  const [gameStarted, setGameStarted] = useState<boolean>(false);

  useEffect(() => {
    const newSocket = io(SERVER);
    setSocket(newSocket);

    newSocket.on("connect", () => {
      setIsConnected(true);
    });

    newSocket.on("disconnect", () => {
      setIsConnected(false);
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
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has("error")) {
      const errorCode = urlParams.get("error");
      const errorDescription = urlParams.get("error_description");
      // Handle "AADB2C90091: The user has cancelled entering self-asserted information"
      if (
        errorCode === "access_denied" &&
        errorDescription?.includes("AADB2C90091")
      ) {
        // User cancelled the sign-in or sign-up process.
        // Redirect the user, show a message, or perform any other action you deem appropriate.
        window.location.href = "/"; // Redirect to home page as an example
      }
    }
  }, []);

  useEffect(() => {
    const handleRedirect = async () => {
      try {
        await myMSALObj.handleRedirectPromise();
        const accounts = myMSALObj.getAllAccounts();
        if (accounts.length !== 0) {
          setUser(accounts[0]);
          setIsLoggedIn(true);
        }
      } catch (error) {
        if (
          // @ts-ignore
          error?.errorCode === "access_denied" &&
          // @ts-ignore
          error?.errorMessage?.includes("AADB2C90091")
        ) {
          // User cancelled the sign-in or sign-up process.
          window.location.href = "/"; // Redirect to home page as an example
        }
      }
    };
    handleRedirect();
  }, [setIsLoggedIn]);

  const handleLogin = async () => {
    try {
      await myMSALObj.handleRedirectPromise();
      const accounts = myMSALObj.getAllAccounts();
      if (accounts.length === 0) {
        await myMSALObj.loginRedirect(loginRequest);
      }
    } catch (err) {
      console.log(err);
      if (
        // @ts-ignore
        err.errorCode === "access_denied" &&
        // @ts-ignore
        err.errorMessage.includes("AADB2C90091")
      ) {
        // User cancelled the sign-in or sign-up process.
        window.location.href = "/"; // Redirect to home page as an example
      }
    }
  };

  // Finally, you can use the leaveRoom() function when handling logout
  const handleLogout = async () => {
    if (window.confirm("Do you really want to sign out?")) {
      leaveRoom(); // Leave the room before logging out
      await myMSALObj.logoutRedirect();
      setIsLoggedIn(false);
    }
  };

  const getRoles = () => {
    socket && socket.emit("getRoles"); // Send the 'getRoles' event to the server
  };


  const createRoom = () => {
    if (user) {
      socket && socket.emit("create", { userId: user.homeAccountId, username: user.name});
    } else {
      console.log("User is not logged in yet");
    }
  };

  const joinRoom = () => {
    if (user) {
      socket && socket.emit("join", { userId: user.homeAccountId, username: user.name, roomCode }); // Send the room code to the server
    } else {
      console.log("User is not logged in yet");
    }
  };
  
  const startGame = () => {
    if (socket) {
      socket.emit("startGame", { roomCode }); // Send the 'leave' event to the server
    } else {
      console.log("Connection not established");
    }
  };

  const leaveRoom = () => {
    if (user) {
      socket && socket.emit("leaveRoom", { userId: user.homeAccountId, username: user.name, roomCode }); // Send the 'leave' event to the server
    } else {
      console.log("User is not logged in yet");
    }
  };

  const revealRole = () => {
      Modal.confirm({
        title: 'Do you want to reveal your role?',
        content: 'Once you reveal your role, all players in the room will see it.',
        onOk() {
          if (user) {
            socket && socket.emit("revealRole", { userId: user.homeAccountId, roomCode }); // Send the 'leave' event to the server
          } else {
            console.log("User is not logged in yet");
          }
        },
      });
  };

  const endGame = () => {
      Modal.confirm({
        title: 'Select winners',
        content: 'select winners',
        onOk() {
          if (user) {
            socket && socket.emit("endGame", { roomCode }); // Send the 'leave' event to the server
          } else {
            console.log("User is not logged in yet");
          }
        },
      });
  };

  const handleShowRoles = () => {
    setShowRoles(true);
    getRoles();
  };

  useEffect(() => {
    if (socket) {
      socket.on("rolesData", (data) => {
        setRoles(data);
      });

      // Listen for 'roomCreated' event from the server
      socket.on("roomCreated", ({ roomCode, users }) => {
        console.log(`Room created with code: ${roomCode}`);
        console.log(users);
        setRoomCode(roomCode);
        setIsInRoom(true);
        setUsersInRoom(users);
      });

      // Listen for 'joinedRoom' event from the server
      socket.on("joinedRoom", ({ roomCode, users }) => {
        console.log(`Joined room with code: ${roomCode}`);
        setRoomCode(roomCode);
        setIsInRoom(true);
        setUsersInRoom(users);
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

      socket.on("gameStarted", ({ userRole, teammates }) => {
        console.log("Game started. Role assigned.");
        setMyRole(userRole);
        setTeammates(teammates);
        setGameStarted(true);
      });

      socket.on("gameUpdated", ({ users }) => {
        console.log("Game Updated.");
        setUsersInRoom(users);
      });

      socket.on("reconnectedToRoom", ({ user, usersInRoom, activeGame, roomCode }) => {
        if(user){
          console.log("Reconnected to room");
          setRoomCode(roomCode);
          setIsInRoom(true);
          setUsersInRoom(usersInRoom);
          setGameStarted(activeGame);
          setMyRole(user.role);
        }
      });

      socket.on("gameEnded", ({ users }) => {
        console.log("Game Ended");
        setUsersInRoom(users);
        setGameStarted(false);
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
        socket.off("startGame");
        socket.off("error");
      };
    }
  }, [user, roomCode, myRole, socket, gameStarted]);

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
        <AppMenu handleLogout={handleLogout} handleShowRoles={handleShowRoles}/>
        <IfElse condition={isConnected}>
          <OnTrue key="Connected">
            <p className="connectionStatus">Connected to the server.</p>
          </OnTrue>
          <OnFalse key="notConnected">
            <p className="connectionStatus">
              Disconnected from the server.
            </p>
          </OnFalse>
        </IfElse>

        {/* Show the roles in a modal, should be its own component */}
        <If condition={showRoles}>
          <div style={{ height: "700px", overflow: "auto" }}>
            <Modal
              title="Roles"
              open={showRoles}
              onOk={handleOk}
              onCancel={handleCancel}
              width={550}
            >
              <Carousel
                autoplay
                arrows
                nextArrow={<ArrowRightOutlined/>}
                prevArrow={<ArrowLeftOutlined />}
              >
                {roles.map((role) => (
                  <RoleCard key={role.name} role={role} />
                ))}
              </Carousel>
            </Modal>
          </div>
        </If>
        <IfElse condition={isLoggedIn}>
          <OnTrue key="loggedIn">
            <p>Hello, {user?.name}!</p>
            {/* Connected in a room */}
            <IfElse condition={isInRoom}>
              <OnTrue key="inRoom">
                <GameRoom
                  roomCode={roomCode}
                  users={usersInRoom}
                  gameStarted={gameStarted}
                  myRole={myRole}
                  teammates={teammates}
                  startGame={startGame}
                  leaveRoom={leaveRoom}
                  revealRole={revealRole}
                  endGame={endGame}
                />
              </OnTrue>
              <OnFalse key="notInRoom">
                <Landing
                  createRoom={createRoom}
                  joinRoom={joinRoom}
                  roomCode={roomCode}
                  setRoomCode={setRoomCode}
                />
              </OnFalse>
            </IfElse>
          </OnTrue>
          <OnFalse key="notLoggedIn">
            <Landing handleLogin={handleLogin} />
          </OnFalse>
        </IfElse>
      </ConfigProvider>
    </div>
  );
}

export default App;
