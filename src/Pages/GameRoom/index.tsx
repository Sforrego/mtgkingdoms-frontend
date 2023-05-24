import { PlayerInGame } from "../../Components/PlayerInGame";
import { User } from "../../Types/User";
import { Role } from "../../Types/Role";
import { Modal, Button } from "antd";
import { useState } from "react";
import { RoleCard } from "../../Components/RoleCard";

import "./index.css";

type GameRoomProps = {
  roomCode: string;
  users: User[];
  gameStarted: boolean;
  myRole: Role | null;
  teammates: User[];
  startGame: () => void;
  leaveRoom: () => void;
  revealRole: () => void;
};

export const GameRoom = ({ roomCode, users, gameStarted, myRole, teammates, startGame, leaveRoom, revealRole }: GameRoomProps) => {
  console.log(myRole);
  const [isModalOpen, setIsModalOpen] = useState(false);
  console.log(users);

  const showRole = () => {
    setIsModalOpen(true);
  };
  
  return (
    <div className="game-room">
      <p style={{color: "white"}}>Room: {roomCode}</p>
      <div className="PlayersIconsHolder">
        {users.map((user, index) => (
          <PlayerInGame key={index} user={user} />
          ))}
      </div>
      {gameStarted ? (
        <>
          <Button onClick={showRole}>Show Role</Button>
          {/* Assume you will implement revealRole function */}
          <Button onClick={revealRole}>Reveal Role</Button>
        </>
      ) : (
        <>
          <Button onClick={startGame}>Start Game</Button>
          <Button onClick={leaveRoom}>Leave Room</Button>
        </>
      )}

      <Modal
        title="Your Role"
        open={isModalOpen}
        onOk={() => setIsModalOpen(false)}
        onCancel={() => setIsModalOpen(false)}
        >
        {myRole && <RoleCard role={myRole} />}
      </Modal>
    </div>
  );
};
  