import "./App.css";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { PublicClientApplication } from "@azure/msal-browser";
import { MagicCard } from "./Components/MtgCard/MagicCard";
import { RoleCard } from "./Components/RoleCard";
import { Carousel, Row } from "antd";
import { sampleRoles } from "./Types/Role";

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
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [roomCode, setRoomCode] = useState("");
  const [isInRoom, setIsInRoom] = useState(false);
  const [usersInRoom, setUsersInRoom] = useState(false);

  useEffect(() => {
    const handleRedirect = async () => {
      await myMSALObj.handleRedirectPromise();
      const accounts = myMSALObj.getAllAccounts();
      if (accounts.length !== 0) {
        setUser(accounts[0]);
        setIsLoggedIn(true);
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

  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

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

  const createRoom = () => {
    socket.emit("create", { userId: user.name }); // Send the 'create' event to the server
  };

  const joinRoom = () => {
    socket.emit("join", { userId: user.name, roomCode }); // Send the room code to the server
  };

  const leaveRoom = () => {
    socket.emit("leave", { userId: user.name, roomCode }); // Send the 'leave' event to the server
  };

  useEffect(() => {
    if (socket) {
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
        socket.off("roomCreated");
        socket.off("joinedRoom");
        socket.off("leftRoom");
        socket.off("userJoinedRoom");
        socket.off("userLeftRoom");
        socket.off("error");
      };
    }
  }, [socket]);

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

  return (
    <div className="App" style={styles.app}>
      {isConnected ? (
        <p style={styles.connectionStatus}>Connected to the server.</p>
      ) : (
        <p style={styles.connectionStatus}>Disconnected from the server.</p>
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
              <Row>
                {sampleRoles.map((role) => (
                  <RoleCard key={role.RoleName} role={role} />
                ))}
                <MagicCard
                  cardColor="blue"
                  cardFrame="blue"
                  cardBackground="blue"
                  name="The King"
                  manaCost="{2}{G}{U}{W}{R}{B}"
                  descriptions={[
                    "{tap}: When Oath of Nissa enters the battlefield, look at the top three cards of your library. You may reveal a creature, land, or planeswalker card from among them and put it into your hand. Put the rest on the bottom of your library in any order.",
                    "You may spend mana as though it were mana of any color to cast planeswalker spells.",
                  ]}
                  expansionSymbol="https://image.ibb.co/kzaLjn/OGW_R.png"
                  artUrl="https://image.ibb.co/fqdLEn/nissa.jpg"
                  type="Role - Monarch"
                  flavorText={[
                    '"For the life of every plane, I will keep watch."',
                  ]}
                  fotterLeftText={["140/184 R", "OGW &#x2022; EN Wesley Burt"]}
                  fotterRightText={[
                    "&#x99; &amp; &#169; 2016 Wizards of the Coast",
                  ]}
                />
              </Row>
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
