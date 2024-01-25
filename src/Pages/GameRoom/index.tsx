import { PlayerInGame } from "../../Components/PlayerInGame";
import { User } from "../../Types/User";
import { Modal, Button, Carousel, Checkbox, Radio } from "antd";
import { ArrowLeftOutlined, ArrowRightOutlined } from '@ant-design/icons';
import { useState } from "react";
import { RoleCard } from "../../Components/RoleCard";
import { Role } from "../../Types/Role";
import "./index.css";

type GameRoomProps = {
  roomCode: string;
  users: User[];
  roles: Role[];
  selectedRolesPool: Role[];
  gameStarted: boolean;
  selectedRole: Role | null;
  team: User[];
  nobles: Role[];
  isRevealed: boolean;
  potentialRoles: Role[];
  selectingRole: boolean;
  setSelectingRole: (selectingRole: boolean) => void;
  startGame: () => void;
  leaveRoom: () => void;
  revealRole: () => void;
  selectRolesPool: (selectedRoles: Role[]) => void;
  selectRole: () => void;
  endGame: () => void; 
  setSelectedRole: (roles: Role) => void; 
  setSelectedRolesPool: (roles: Role[]) => void; 
  selectCultists: () => void;
  chosenOneDecision: () => void;
};

export const GameRoom = ({ roomCode, users, roles, selectedRolesPool, selectedRole, selectingRole, gameStarted, isRevealed, team, nobles, potentialRoles, setSelectingRole, startGame, leaveRoom, revealRole, selectRolesPool, selectRole, endGame, setSelectedRole, setSelectedRolesPool, selectCultists, chosenOneDecision }: GameRoomProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isNoblesModalOpen, setIsNoblesModalOpen] = useState(false);
  const [isRevealRoleModalOpen, setIsRevealRoleModalOpen] = useState(false);
  const [isRoleChoiceModalOpen, setIsRoleChoiceModalOpen] = useState(false);
  const [isRolesPoolSelectionModalOpen, setIsRolesPoolSelectionModalOpen] = useState(false);
  const userRoleName = team.length > 0 ? users.find(u => u.userId === team[0].userId)?.role?.name || "" : "";
  const isCultLeader = ["Cult Leader", "Cultist"].includes(userRoleName) && isRevealed;
  const isChosenOne = userRoleName === "Chosen One" && isRevealed;

  const openRoleChoiceModal = () => {
    setIsRoleChoiceModalOpen(true);
  };

  const closeRoleChoiceModal = () => {
    setIsRoleChoiceModalOpen(false);
  };

  const handleRoleChoice = () => {
    setSelectingRole(false);
    setIsRoleChoiceModalOpen(false);
    selectRole();
  };

  const openRolesPoolSelectionModal = () => {
    setIsRolesPoolSelectionModalOpen(true);
  };
  
  const closeRoleSelectionModal = () => {
    setIsRolesPoolSelectionModalOpen(false);
  };

  const validateRolesBeforeStart = () => {
    const monarchCount = selectedRolesPool.filter(role => role.type === "Monarch").length;
    const knightCount = selectedRolesPool.filter(role => role.type === "Knight").length;
    const banditCount = selectedRolesPool.filter(role => role.type === "Bandit").length;
    const renegadeCount = selectedRolesPool.filter(role => role.type === "Renegade").length;
    const nobleCount = selectedRolesPool.filter(role => role.type === "Noble").length;

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
      selectRolesPool(selectedRolesPool);
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
    revealRole()
    closeConfirmModal();
  };

  const revealRoleModal = () => {
    openConfirmModal();
  };

  const showRole = () => {
    setIsModalOpen(true);
  };

  const showNobles = () => {
    setIsNoblesModalOpen(true);
  };

  return (
    <div className="game-room">
      <p style={{color: "white", marginBottom:"5vmin"}}>Room: {roomCode}</p>
      <div className="PlayersIconsHolder">
        {users.map((user, index) => (
          <PlayerInGame key={index} user={user} />
          ))}
      </div>
      {!gameStarted && users.some(user => !user.hasSelectedRole) && potentialRoles.length > 0? (
        <>
        {selectingRole && (
          <Button onClick={openRoleChoiceModal} style={{ marginLeft: "1.5vmin", marginTop: "2.5vmin"}}>Select Role</Button>
        )}        
        <p style={{color: "white"}}>Players selecting role:</p>
        <ul style={{ paddingLeft: '20px' }}> {/* Adjust padding as needed */}
          {users.filter(user => !user.hasSelectedRole).map((user, index) => (
            <li key={index} style={{ color: "white", listStylePosition: 'inside' }}>
              {user.username}
            </li>
          ))}
        </ul>
      </>
      ) 
      : gameStarted ? (
        <>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2vmin", marginTop: "4vmin" }}>
          <div style={{ flex: 1 }}> {/* Empty div for spacing */} </div>

          <div style={{ flex: 1, display: "flex", justifyContent: "center" }}>
            <Button onClick={showRole}>See My Role</Button>
            {!isRevealed && <Button onClick={revealRoleModal}>Reveal Role</Button>}
          </div>
          {nobles.length > 0 && (
            <div style={{ flex: 1, display: "flex", justifyContent: "flex-end" }}>
              <Button onClick={showNobles}>See Nobles</Button>
            </div>
          )}
          {nobles.length === 0 && (
            <div style={{ flex: 1 }}> {/* Empty div for spacing if nobles is null */} </div>
          )}
        </div>
        <div style={{marginBottom:"2vmin", marginTop:"4vmin"}}>
          {isCultLeader && (
            <Button onClick={() => selectCultists()}>Cultification</Button>
            )}
          {isChosenOne && (
            <Button onClick={() => chosenOneDecision()}>Decision</Button>
            )}
        </div>
            <Button onClick={() => endGame()}>End Game</Button>
        </>
      ) : (
        <>
        <div style={{marginBottom:"2vmin", marginTop:"4vmin"}}>
          <Button onClick={openRolesPoolSelectionModal} style={{marginRight:"1.5vmin"}}>Select Roles</Button>
          <Button onClick={startGame} style={{marginRight:"1.5vmin"}}>Start Game</Button>
          <Button onClick={leaveRoom} style={{marginLeft:"1.5vmin"}}>Leave Room</Button>
        </div>
        </>
      )}
      
    <Modal
      title="Do you want to reveal your role?"
      open={isRevealRoleModalOpen}
      onOk={confirmRevealRole}
      onCancel={closeConfirmModal}
      centered
    >
      <p style={{color:"white"}}>Once you reveal your role, all players in the room will see it.</p>
    </Modal>

    <Modal
      title="Select Roles Pool"
      open={isRolesPoolSelectionModalOpen}
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
              checked={selectedRolesPool.find((r) => r.name === role.name) !== undefined}
              onChange={(e) => {
                if (e.target.checked) {
                  setSelectedRolesPool([...selectedRolesPool, role]);
                } else {
                  setSelectedRolesPool(selectedRolesPool.filter((r) => r.name !== role.name));
                }
              }}
            >
              {role.name}
            </Checkbox>
        ))}
      </div>
    </Modal>

    <Modal
      title="Starting Roles"
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

    <Modal
      title="Choose Your Role"
      open={isRoleChoiceModalOpen}
      closable={false}
      onOk={handleRoleChoice}
      onCancel={closeRoleChoiceModal}
      centered
    >
      <Carousel
        autoplay={false}
        arrows
        dots={false}
        nextArrow={<ArrowRightOutlined />}
        prevArrow={<ArrowLeftOutlined />}
      >
        {potentialRoles.map((role, index) => (
          <div key={index} className="carousel-item">
            <RoleCard key={role.name} role={role}/>
            <Radio
              className="radio-button"
              checked={selectedRole === role}
              onChange={() => setSelectedRole(role)}
            />
          </div>
        ))}
      </Carousel>
    </Modal>

    <Modal
      title="Nobles Roles"
      open={isNoblesModalOpen}
      onOk={() => setIsNoblesModalOpen(false)}
      onCancel={() => setIsNoblesModalOpen(false)}
      centered
      >
        <Carousel
      autoplay
      arrows
      nextArrow={<ArrowRightOutlined/>}
      prevArrow={<ArrowLeftOutlined/>}
    >
      {nobles.map((noble: Role, index: number) => (
        <div key={index}>
        <RoleCard key={noble.name} role={noble} />
        </div>
      ))}
    </Carousel>
    </Modal>
    </div>
  );
};
  