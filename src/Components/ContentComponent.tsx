import { useAppContext } from '../Context/AppContext';
import { GameRoom } from '../Pages/GameRoom';
import { Landing } from '../Pages/Landing';
import { IfElse, OnTrue, OnFalse } from "conditional-jsx";
import { 
    createRoom, 
    joinRoom, 
  } from "../Services/gameService";

export const ContentComponent = () => {
  const { isLoggedIn, isInRoom, isConnected, accountUser, socket, roomCode, setRoomCode, loginHandler } = useAppContext();

  return (
    <IfElse condition={isLoggedIn}>
      <OnTrue key="loggedIn">
        <IfElse condition={isInRoom}>
          <OnTrue key="inRoom">
            <GameRoom/>
          </OnTrue>
          <OnFalse key="notInRoom">
            <IfElse condition={isConnected}>
              <OnTrue key="Connected">
                <p>Welcome {accountUser?.name}!</p>
                <Landing
                  createRoom={() => createRoom(accountUser, socket)}
                  joinRoom={() => joinRoom(accountUser, socket, roomCode)}
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
        <Landing handleLogin={() => socket && loginHandler(socket)} />
      </OnFalse>
    </IfElse>
  );
};