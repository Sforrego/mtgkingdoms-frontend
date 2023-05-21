import { ConfigProvider, theme } from "antd";
import { PlayerInGame } from "../../Components/PlayerInGame";
import { sampleRoles } from "../../Types/Role";

type gameRoomProps = {
  roomCode: string;
  users: string[];
  leaveRoom: () => void;
};
export const GameRoom = ({ roomCode, users, leaveRoom }: gameRoomProps) => (
  <div>
    <ConfigProvider
      theme={{
        algorithm: theme.darkAlgorithm,
        // token: {
        //   colorPrimary: "#fff",
        //   backgroundColor: "#aaa",
        // },
      }}
    >
      <div>
        {sampleRoles.map((role) => (
          <PlayerInGame key={role.Name} role={role} />
        ))}
        <PlayerInGame />
      </div>
    </ConfigProvider>
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
