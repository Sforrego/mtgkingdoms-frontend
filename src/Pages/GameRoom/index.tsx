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
  isRevealed: boolean;
  startGame: () => void;
  leaveRoom: () => void;
  revealRole: () => void;
  endGame: (users: User[]) => void; // update the type here
};

export const GameRoom = ({ roomCode, users, gameStarted, myRole, isRevealed, teammates, startGame, leaveRoom, revealRole, endGame }: GameRoomProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleEndGame = () => {
    endGame(users); // Call endGame with usersInRoom
  };
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
          <Button onClick={showRole}>See My Role</Button>
          {!isRevealed && <Button onClick={revealRole}>Reveal Role</Button>}
          <Button onClick={leaveRoom}>Leave Room</Button>
          <Button onClick={handleEndGame}>End Game</Button>
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
  