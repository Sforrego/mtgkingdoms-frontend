import { PlayerInGame } from "../../Components/PlayerInGame";
import { sampleRoles } from "../../Types/Role";
import "./index.css";

type gameRoomProps = {
  roomCode: string;
  users: string[];
  leaveRoom: () => void;
};
export const GameRoom = ({ roomCode, users, leaveRoom }: gameRoomProps) => (
  <div>
    <div className="PlayersIconsHolder">
      {sampleRoles.map((role) => (
        <PlayerInGame key={role.Name} role={role} />
      ))}
      <PlayerInGame />
    </div>
    <p>Room: {roomCode}</p>
    <p>Users in this room:</p>
    <ul>
      {users.map((user) => (
        <li key={user}>{user}</li>
      ))}
    </ul>
    <button className="button" onClick={leaveRoom}>
      Leave Room
    </button>
  </div>
);
