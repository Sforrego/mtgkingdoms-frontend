import { PlayerInGame } from "../../Components/PlayerInGame";
import { User } from "../../Types/User";
import { Button } from "antd";
import "./index.css";

type GameRoomProps = {
  roomCode: string;
  users: User[];
  leaveRoom: () => void;
};

export const GameRoom = ({ roomCode, users, leaveRoom }: GameRoomProps) => (
  <div>
    <p style={{color: "white"}}>Room: {roomCode}</p>
    <div className="PlayersIconsHolder">
      {Object.values(users).map((user, index) => (
        <PlayerInGame key={index} user={user} />
      ))}
    </div>
    <Button onClick={leaveRoom}>
      Leave Room
    </Button>
  </div>
);
