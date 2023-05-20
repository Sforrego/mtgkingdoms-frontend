import './App.css';
import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { PublicClientApplication } from '@azure/msal-browser';

const SERVER = 'http://localhost:9998';

const clientId = process.env.REACT_APP_MTGKINGDOMS_CLIENT_ID;

// Initialize the MSAL application object
const msalConfig = {
  auth: {
    clientId: clientId,
    authority: 'https://MTGKingdoms.b2clogin.com/MTGKingdoms.onmicrosoft.com/B2C_1_signupsignin',
    knownAuthorities: ['MTGKingdoms.b2clogin.com'],
    postLogoutRedirectUri: window.location.origin,
  },
};

const myMSALObj = new PublicClientApplication(msalConfig);

// Login request
const loginRequest = {
  scopes: ['openid', 'profile'],
};

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [roomCode, setRoomCode] = useState('');
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

  const handleLogout = async () => {
    if (window.confirm("Do you really want to sign out?")) {
    await myMSALObj.logoutRedirect();
    setIsLoggedIn(false);
    }
  };

  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const newSocket = io(SERVER);
    setSocket(newSocket);

    newSocket.on('connect', () => {
      setIsConnected(true);
    });

    newSocket.on('disconnect', () => {
      setIsConnected(false);
    });

    newSocket.on('connect_error', (error) => {
      console.log('Connection error:', error);
      setTimeout(() => {
        newSocket.connect();
      }, 1000);
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  const joinRoom = () => {
    socket.emit('join', { userId: user.name, roomCode }); // Send the room code to the server
  };

  const createRoom = () => {
    socket.emit('create', { userId: user.name }); // Send the 'create' event to the server
  };

  useEffect(() => {
    if (socket) {
      // Listen for 'roomCreated' event from the server
      socket.on('roomCreated', ({ roomCode, users}) => {
        console.log(`Room created with code: ${roomCode}`);
        setRoomCode(roomCode);
        setIsInRoom(true);
        setUsersInRoom(users);
      });

      // Listen for 'joinedRoom' event from the server
      socket.on('joinedRoom', ({ roomCode, users}) => {
        console.log(`Joined room with code: ${roomCode}`);
        setRoomCode(roomCode);
        setIsInRoom(true);
        setUsersInRoom(users);
      });

      // Listen for 'error' event from the server
      socket.on('error', (message) => {
        console.error(message);
        setIsInRoom(false);
        setRoomCode('');
      });

      // Cleanup when component unmounts
      return () => {
        socket.off('roomCreated');
        socket.off('joinedRoom');
        socket.off('error');
      };
    }
  }, [socket]);


// Add your styling
const styles = {
  app: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: '#282c34',
    color: 'white',
    fontFamily: '"Lucida Console", Monaco, monospace',
  },
  
  connectionStatus: {
    position: 'absolute',
    top: '10px',
    right: '10px',
    color: '#61dafb',
  },

  footer: {
    width: '100%',
    position: 'fixed',
    bottom: '0',
    backgroundColor: '#282c34',
    padding: '10px',
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },

  logoutButton: {
    backgroundColor: '#61dafb',
    border: 'none',
    color: '#282c34',
    padding: '10px 20px',
    textAlign: 'center',
    textDecoration: 'none',
    display: 'inline-block',
    fontSize: '16px',
    margin: '4px 2px',
    cursor: 'pointer',
    borderRadius: '5px',
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
          {isInRoom && roomCode && 
            <div>
            <p>Room: {roomCode}</p>
            <p>Users in this room:</p> 
            <ul>
              {usersInRoom.map(user => <li key={user}>{user}</li>)}
            </ul>
            </div>
          }
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
