import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { AccountInfo, PublicClientApplication } from "@azure/msal-browser";
import { RoleCard } from "./Components/RoleCard";
import {
  Button,
  Modal,
  Carousel,
  ConfigProvider,
  theme,
} from "antd";
import { ArrowLeftOutlined, ArrowRightOutlined } from "@ant-design/icons";
import { Role } from "./Types/Role";
import { GameRoom } from "./Pages/GameRoom";
import { Landing } from "./Pages/Landing";

import "./App.css";
import styles from "./App.module.css";
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
    postLogoutRedirectUri: "https://agreeable-river-08f60e510.3.azurestaticapps.net/",
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
  const [usersInRoom, setUsersInRoom] = useState<string[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [roomCode, setRoomCode] = useState("");
  const [socket, setSocket] = useState<Socket | null>(null);
  const [showRoles, setShowRoles] = useState(false);

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
  }, []);

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
    socket && socket.emit("create", { userId: user?.name ?? "" }); // Send the 'create' event to the server
  };

  const joinRoom = () => {
    socket && socket.emit("join", { userId: user?.name ?? "", roomCode }); // Send the room code to the server
  };

  const leaveRoom = () => {
    socket && socket.emit("leave", { userId: user?.name ?? "", roomCode }); // Send the 'leave' event to the server
  };

  const handleShowRoles = () => {
    setShowRoles(true);
    getRoles();
  };

  useEffect(() => {
    if (socket) {
      socket.on("rolesData", (data) => {
        setRoles(data); // get the first two roles
      });

      // Listen for 'roomCreated' event from the server
      socket.on("roomCreated", ({ roomCode, users }) => {
        console.log(`Room created with code: ${roomCode}`);
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

      // Listen for 'error' event from the server
      socket.on("error", (message) => {
        console.error(message);
        setIsInRoom(false);
        setRoomCode("");
      });

      // Cleanup when component unmounts
      return () => {
        socket.off("rolesData");
        socket.off("roomCreated");
        socket.off("joinedRoom");
        socket.off("leftRoom");
        socket.off("userJoinedRoom");
        socket.off("userLeftRoom");
        socket.off("error");
      };
    }
  }, [roomCode, socket]);

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
        <AppMenu />
        <IfElse condition={isConnected}>
          <OnTrue>
            <p className={styles.connectionStatus}>Connected to the server.</p>
          </OnTrue>
          <OnFalse>
            <p className={styles.connectionStatus}>
              Disconnected from the ust Yserver.
            </p>
          </OnFalse>
        </IfElse>

        <Button
          onClick={handleShowRoles}
          style={{ position: "absolute", left: 100, top: 100 }}
        >
          Show Roles
        </Button>
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
                nextArrow={<ArrowRightOutlined />}
                prevArrow={<ArrowLeftOutlined />}
              >
                {roles.map((role) => (
                  <RoleCard key={role.Name} role={role} />
                ))}
              </Carousel>
            </Modal>
          </div>
        </If>

        <IfElse condition={isLoggedIn}>
          <OnTrue>
            <p>Hello, {user?.name}!</p>
            {/* Connected in a room */}
            <IfElse condition={isInRoom}>
              <OnTrue>
                <GameRoom
                  roomCode={roomCode}
                  users={usersInRoom}
                  leaveRoom={leaveRoom}
                />
              </OnTrue>
              <OnFalse>
                <Landing
                  createRoom={createRoom}
                  joinRoom={joinRoom}
                  roomCode={roomCode}
                  setRoomCode={setRoomCode}
                />
              </OnFalse>
            </IfElse>
          </OnTrue>
          <OnFalse>
            <Landing handleLogin={handleLogin} />
          </OnFalse>
        </IfElse>

        <footer className={styles.footer}>
          <If condition={isLoggedIn}>
            <button className={styles.logoutButton} onClick={handleLogout}>
              Sign Out
            </button>
          </If>
        </footer>
      </ConfigProvider>
    </div>
  );
}

export default App;
