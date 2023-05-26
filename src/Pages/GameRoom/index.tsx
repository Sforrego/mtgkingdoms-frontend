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
  const [isRevealRoleModalOpen, setIsRevealRoleModalOpen] = useState(false);

  const openConfirmModal = () => {
    setIsRevealRoleModalOpen(true);
  };

  const closeConfirmModal = () => {
    setIsRevealRoleModalOpen(false);
  };

  const confirmRevealRole = () => {
    // Move the contents of the onOk method here...
    revealRole()
    closeConfirmModal();
  };

  const revealRoleModal = () => {
    openConfirmModal();
  };

  const handleEndGame = () => {
    endGame(users); // Call endGame with usersInRoom
  };
  const showRole = () => {
    setIsModalOpen(true);
  };
  
  return (
    <div className="game-room">
      <p style={{color: "white", marginBottom:"5vmin"}}>Room: {roomCode}</p>
      <div className="PlayersIconsHolder">
        {users.map((user, index) => (
          <PlayerInGame key={index} user={user} />
          ))}
      </div>
      {gameStarted ? (
        <>
        <div style={{marginBottom:"2vmin", marginTop:"4vmin"}}>
          <Button onClick={showRole}>See My Role</Button>
          <Button onClick={revealRoleModal}>Reveal Role</Button>
        </div>
          <Button onClick={handleEndGame}>End Game</Button>
          <Modal
            title="Do you want to reveal your role?"
            open={isRevealRoleModalOpen}
            onOk={confirmRevealRole}
            onCancel={closeConfirmModal}
          >
            <p>Once you reveal your role, all players in the room will see it.</p>
          </Modal>
        </>
      ) : (
        <>
        <div style={{marginBottom:"2vmin", marginTop:"4vmin"}}>
          <Button onClick={startGame} style={{marginRight:"1.5vmin"}}>Start Game</Button>
          <Button onClick={leaveRoom} style={{marginLeft:"1.5vmin"}}>Leave Room</Button>
        </div>
        </>
      )}

      <Modal
        title="Known Roles"
        open={isModalOpen}
        onOk={() => setIsModalOpen(false)}
        onCancel={() => setIsModalOpen(false)}
                    style={{ 
              position: 'absolute',
              top: '48%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              margin: '0',
            }}
        >
          <Carousel
        autoplay
        arrows
        nextArrow={<ArrowRightOutlined/>}
        prevArrow={<ArrowLeftOutlined/>}
      >
        {team.map((user: User, index: number) => (
          <div key={index}>
          <h1 style={{ marginBottom: '10px', marginTop: '0', color: "white", textAlign: "center" }}> {user.username}</h1>
          <RoleCard key={user.role?.name} role={user.role} />
          </div>
        ))}
      </Carousel>
      </Modal>
    </div>
  );
};
  