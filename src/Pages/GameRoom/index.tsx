import { PlayerInGame } from "../../Components/PlayerInGame";
import { User } from "../../Types/User";
import { Modal, Button, Carousel, Checkbox } from "antd";
import { ArrowLeftOutlined, ArrowRightOutlined } from '@ant-design/icons';
import { useState } from "react";
import { RoleCard } from "../../Components/RoleCard";
import { Role } from "../../Types/Role";

import "./index.css";

type GameRoomProps = {
  roomCode: string;
  users: User[];
  roles: Role[];
  selectedRoles: Role[];
  gameStarted: boolean;
  team: User[];
  isRevealed: boolean;
  startGame: () => void;
  leaveRoom: () => void;
  revealRole: () => void;
  selectRoles: (selectedRoles: Role[]) => void;
  endGame: (users: User[]) => void; // update the type here
  setSelectedRoles: (roles: Role[]) => void; // update the type here
};

export const GameRoom = ({ roomCode, users, roles, selectedRoles, gameStarted, isRevealed, team, startGame, leaveRoom, revealRole, selectRoles, endGame, setSelectedRoles }: GameRoomProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRevealRoleModalOpen, setIsRevealRoleModalOpen] = useState(false);
  const [isRoleSelectionModalOpen, setIsRoleSelectionModalOpen] = useState(false);

  const openRoleSelectionModal = () => {
    setIsRoleSelectionModalOpen(true);
  };
  
  const closeRoleSelectionModal = () => {
    setIsRoleSelectionModalOpen(false);
  };

  const validateRolesBeforeStart = () => {
    const monarchCount = selectedRoles.filter(role => role.type === "Monarch").length;
    const knightCount = selectedRoles.filter(role => role.type === "Knight").length;
    const banditCount = selectedRoles.filter(role => role.type === "Bandit").length;
    const renegadeCount = selectedRoles.filter(role => role.type === "Renegade").length;
    const nobleCount = selectedRoles.filter(role => role.type === "Noble").length;

    if(monarchCount < 2) {
        alert('You must have at least 2 Monarchs');
        return false;
    } else if(knightCount < 2) {
        alert('You must have at least 2 Knights');
        return false;
    } else if(banditCount < 4) {
        alert('You must have at least 4 Bandits');
        return false;
    } else if(renegadeCount < 2) {
        alert('You must have at least 2 Renegades');
        return false;
    } else if(nobleCount < 2) {
        alert('You must have at least 2 Nobles');
        return false;
    }

    return true;
}
  const handleRoleSelection = () => {
    if(validateRolesBeforeStart()){
      selectRoles(selectedRoles);
      closeRoleSelectionModal();
    }
  };

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
          { !isRevealed && <Button onClick={revealRoleModal}>Reveal Role</Button> }
        </div>
          <Button onClick={handleEndGame}>End Game</Button>
          <Modal
            title="Do you want to reveal your role?"
            open={isRevealRoleModalOpen}
            onOk={confirmRevealRole}
            onCancel={closeConfirmModal}
            centered
          >
            <p style={{color:"white"}}>Once you reveal your role, all players in the room will see it.</p>
          </Modal>
        </>
      ) : (
        <>
        <div style={{marginBottom:"2vmin", marginTop:"4vmin"}}>
          <Button onClick={openRoleSelectionModal} style={{marginRight:"1.5vmin"}}>Select Roles</Button>
          <Button onClick={startGame} style={{marginRight:"1.5vmin"}}>Start Game</Button>
          <Button onClick={leaveRoom} style={{marginLeft:"1.5vmin"}}>Leave Room</Button>
        </div>
        </>
      )}
      <Modal
        title="Select Roles"
        open={isRoleSelectionModalOpen}
        onOk={handleRoleSelection}
        onCancel={closeRoleSelectionModal}
        centered
      >
        <div className="role-selection-container" style={{ maxHeight: '50vh', overflowY: 'auto' }}>
          {
          roles
            .filter(role => role.type !== "SubRole")
            .map((role, index) => (
              <Checkbox
                key={index}
                checked={selectedRoles.find((r) => r.name === role.name) !== undefined}
                onChange={(e) => {
                  if (e.target.checked) {
                    setSelectedRoles([...selectedRoles, role]);
                  } else {
                    setSelectedRoles(selectedRoles.filter((r) => r.name !== role.name));
                  }
                }}
              >
                {role.name}
              </Checkbox>
          ))}
        </div>
      </Modal>

      <Modal
        title="Known Roles"
        open={isModalOpen}
        onOk={() => setIsModalOpen(false)}
        onCancel={() => setIsModalOpen(false)}
        centered
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
  