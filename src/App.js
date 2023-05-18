import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { PublicClientApplication } from '@azure/msal-browser';

const SERVER = 'http://localhost:9998';

const clientId = process.env.REACT_APP_MTGKINGDOMS_CLIENT_ID;

// Initialize the MSAL application object
const msalConfig = {
  auth: {
    clientId: clientId, // Application (client) ID of your registered application
    authority: 'https://MTGKingdoms.b2clogin.com/MTGKingdoms.onmicrosoft.com/B2C_1_signupsignin', // Azure AD B2C endpoint
    knownAuthorities: ['MTGKingdoms.b2clogin.com'], // Azure AD B2C domain
  },
};

const myMSALObj = new PublicClientApplication(msalConfig);

// Login request
const loginRequest = {
  scopes: ['openid', 'profile'],
};

function App() {
  const handleLogin = async () => {
    try {
      const loginResponse = await myMSALObj.loginPopup(loginRequest);
      if (loginResponse) {
        const accountInfo = myMSALObj.getAccountByHomeId(loginResponse.account.homeAccountId);
        alert(`Hello, ${accountInfo.name}`);
      }
    } catch (err) {
      console.log(err);
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
      }, 1000); // attempting reconnection every 1 second
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  return (
    <div className="App">
      {isConnected ? <p>Connected to the server.</p> : <p>Disconnected from the server.</p>}
      <button onClick={handleLogin}>Login</button>
    </div>
  );
}

export default App;
