import "./App.css";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { PublicClientApplication } from "@azure/msal-browser";
import { RoleCard } from "./Components/RoleCard";
import { Button, Modal, Carousel } from "antd";
import { ArrowLeftOutlined, ArrowRightOutlined } from "@ant-design/icons";

const SERVER = "http://localhost:9998";

const clientId = process.env.REACT_APP_MTGKINGDOMS_CLIENT_ID;

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
  const [user, setUser] = useState(null);
  const [usersInRoom, setUsersInRoom] = useState(false);
  const [roles, setRoles] = useState([]);
  const [roomCode, setRoomCode] = useState("");
  const [socket, setSocket] = useState(null);
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
    if (urlParams.has('error')) {
      const errorCode = urlParams.get('error');
      const errorDescription = urlParams.get('error_description');
      // Handle "AADB2C90091: The user has cancelled entering self-asserted information"
      if (errorCode === 'access_denied' && errorDescription.includes('AADB2C90091')) {
        // User cancelled the sign-in or sign-up process.
        // Redirect the user, show a message, or perform any other action you deem appropriate.
        window.location.href = '/'; // Redirect to home page as an example
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
        if (error.errorCode === 'access_denied' && error.errorMessage.includes('AADB2C90091')) {
          // User cancelled the sign-in or sign-up process.
          window.location.href = '/'; // Redirect to home page as an example
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
        console.log(err)
        if (err.errorCode === 'access_denied' && err.errorMessage.includes('AADB2C90091')) {
          // User cancelled the sign-in or sign-up process.
          window.location.href = '/'; // Redirect to home page as an example
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
  socket.emit("getRoles"); // Send the 'getRoles' event to the server
};

const createRoom = () => {
  socket.emit("create", { userId: user.name }); // Send the 'create' event to the server
};

const joinRoom = () => {
  socket.emit("join", { userId: user.name, roomCode }); // Send the room code to the server
};

const leaveRoom = () => {
  socket.emit("leave", { userId: user.name, roomCode }); // Send the 'leave' event to the server
};

const handleShowRoles = () => {
  setShowRoles(true);
  getRoles();
};

  useEffect(() => {
    if (socket) {
      socket.on('rolesData', (data) => {
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

  // Add your styling
  const styles = {
    app: {
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
      backgroundColor: "#282c34",
      color: "white",
      fontFamily: '"Lucida Console", Monaco, monospace',
    },

    connectionStatus: {
      position: "absolute",
      top: "10px",
      right: "10px",
      color: "#61dafb",
    },

    footer: {
      width: "100%",
      position: "fixed",
      bottom: "0",
      backgroundColor: "#282c34",
      padding: "10px",
      display: "flex",
      justifyContent: "flex-end",
      alignItems: "center",
    },

    logoutButton: {
      backgroundColor: "#61dafb",
      border: "none",
      color: "#282c34",
      padding: "10px 20px",
      textAlign: "center",
      textDecoration: "none",
      display: "inline-block",
      fontSize: "16px",
      margin: "4px 2px",
      cursor: "pointer",
      borderRadius: "5px",
    },
  };

  const handleOk = () => {
    setShowRoles(false);
  };

  const handleCancel = () => {
    setShowRoles(false);
  };

  return (
    <div className="App" style={styles.app}>
      {isConnected ? (
        <p style={styles.connectionStatus}>Connected to the server.</p>
      ) : (
        <p style={styles.connectionStatus}>Disconnected from the server.</p>
      )}
      <Button onClick={handleShowRoles} style={{ position: 'absolute', left: 100, top: 100 }}>Show Roles</Button>
      {showRoles && (
        <div style={{ height: '700px', overflow: 'auto' }}>
        <Modal title="Roles" open={showRoles} onOk={handleOk} onCancel={handleCancel} width={550}>
        <Carousel autoplay arrows nextArrow={<ArrowRightOutlined />} prevArrow={<ArrowLeftOutlined/>}>
          {roles.map((role) => (
            <RoleCard key={role.Name} role={role} />
          ))}
        </Carousel>
      </Modal>
      </div>
      )}
      {isLoggedIn ? (
        <>
          <p>Hello, {user.name}!</p>
          {isInRoom && roomCode && (
            <div>
              <p>Room: {roomCode}</p>
              <p>Users in this room:</p>
              <ul>
                {usersInRoom.map((user) => (
                  <li key={user}>{user}</li>
                ))}
              </ul>
              <button className="button" onClick={leaveRoom}>
                Leave Room
              </button>
            </div>
          )}
          {!isInRoom && (
            <div className="form-container">
              <input
                className="input-field"
                type="text"
                value={roomCode}
                onChange={(e) => setRoomCode(e.target.value)}
                placeholder="Enter room code"
              />
              <button className="button" onClick={joinRoom}>
                Join Room
              </button>
              <button className="button" onClick={createRoom}>
                Create Room
              </button>
            </div>
          )}
        </>
      ) : (
        <button className="button" onClick={handleLogin}>
          Get Started
        </button>
      )}

      <footer style={styles.footer}>
        {isLoggedIn && (
          <button style={styles.logoutButton} onClick={handleLogout}>
            Sign Out
          </button>
        )}
      </footer>
    </div>
  );
}

export default App;
