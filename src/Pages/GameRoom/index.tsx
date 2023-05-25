import { PlayerInGame } from "../../Components/PlayerInGame";
import { User } from "../../Types/User";
import { Modal, Button, Carousel } from "antd";
import { ArrowLeftOutlined, ArrowRightOutlined } from '@ant-design/icons';
import { useState } from "react";
import { RoleCard } from "../../Components/RoleCard";

import "./index.css";

type GameRoomProps = {
  roomCode: string;
  users: User[];
  gameStarted: boolean;
  team: User[];
  isRevealed: boolean;
  startGame: () => void;
  leaveRoom: () => void;
  revealRole: () => void;
  endGame: (users: User[]) => void; // update the type here
};

export const GameRoom = ({ roomCode, users, gameStarted, isRevealed, team, startGame, leaveRoom, revealRole, endGame }: GameRoomProps) => {
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
          <Button onClick={handleEndGame}>End Game</Button>
        </>
      ) : (
        <>
          <Button onClick={startGame}>Start Game</Button>
          <Button onClick={leaveRoom}>Leave Room</Button>
        </>
      )}

      <Modal
        title="Known Roles"
        open={isModalOpen}
        onOk={() => setIsModalOpen(false)}
        onCancel={() => setIsModalOpen(false)}
        >
          <Carousel
        autoplay
        arrows
        nextArrow={<ArrowRightOutlined/>}
        prevArrow={<ArrowLeftOutlined/>}
      >
        {team.map((user: User) => (
          <div>
          <h1> {user.username}</h1>
          <RoleCard key={user.role?.name} role={user.role} />
          </div>
        ))}
      </Carousel>
      </Modal>
    </div>
  );
};
  