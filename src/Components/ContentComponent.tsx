import { useAppContext } from '../AppContext';
import { GameRoom } from '../Pages/GameRoom';
import { Landing } from '../Pages/Landing';
import { IfElse, OnTrue, OnFalse } from "conditional-jsx";
import { 
    createRoom, 
    joinRoom, 
  } from "../gameService";

export const ContentComponent = () => {
  const { isLoggedIn, isInRoom, isConnected, user, socket, roomCode, setRoomCode, loginHandler } = useAppContext();

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
  );
};