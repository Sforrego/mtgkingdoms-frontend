import { PlayerInGame } from "../../Components/PlayerInGame";
import { RolesPoolSelectionModal } from "../../Components/Modals/RolesPoolSelectionModal";
import { RoleSelectionModal } from "../../Components/Modals/RoleSelectionModal";
import { TeamOverviewModal } from "../../Components/Modals/TeamOverviewModal";
import { NoblesModal } from "../../Components/Modals/NoblesModal";
import { GameRoomProps } from "../../Types/GameRoomTypes";
import { ValidateRolesBeforeStart } from "../../Utils/ValidateRoles";
import { Button, Modal } from "antd";
import { UseModal } from '../../Hooks/UseModal';
import "./index.css";

export const GameRoom = ({ roomCode, users, roles, selectedRolesPool, selectedRole, selectingRole, gameStarted, isRevealed, team, nobles, potentialRoles, setSelectingRole, startGame, leaveRoom, revealRole, updateRolesPool, selectRole, endGame, setSelectedRole, setSelectedRolesPool, selectCultists, chosenOneDecision }: GameRoomProps) => {
  const revealRoleModal = UseModal();
  const rolesPoolSelectionModal = UseModal();
  const roleSelectionModal = UseModal();
  const noblesModal = UseModal();
  const teamOverviewModal = UseModal();
  const userRoleName = team.length > 0 ? users.find(u => u.userId === team[0].userId)?.role?.name || "" : "";
  const isCultLeader = ["Cult Leader", "Cultist"].includes(userRoleName) && isRevealed;
  const isChosenOne = userRoleName === "Chosen One" && isRevealed;

  const confirmRoleSelection = () => {
    setSelectingRole(false);
    roleSelectionModal.close();
    selectRole();
  };

  const confirmRolesPoolSelection = () => {
    if(ValidateRolesBeforeStart(selectedRolesPool)){
      updateRolesPool(selectedRolesPool);
      rolesPoolSelectionModal.close();
    }
  };

  const confirmRevealRole = () => {
    revealRole()
    revealRoleModal.close();
  };

  return (
<div className="game-room">
  <div style={{ display: "flex", justifyContent: "center", alignItems: "center", marginBottom: "5vmin" }}>
    <p style={{ color: "white", margin: "0", flex: 1, textAlign: "center" }}>Room: {roomCode}</p>
  </div>
      <div className="PlayersIconsHolder">
        {users.map((user, index) => (
          <PlayerInGame key={index} user={user} />
          ))}
      </div>
      {!gameStarted && users.some(user => !user.hasSelectedRole) && potentialRoles.length > 0? (
        <>
        {selectingRole && (
          <Button onClick={roleSelectionModal.open} style={{ marginLeft: "1.5vmin", marginTop: "2.5vmin"}}>Select Role</Button>
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
          <div style={{ flex: 1, display: "flex", justifyContent: "center" }}>
            <Button onClick={teamOverviewModal.open}>See My Role</Button>
            {!isRevealed && <Button onClick={revealRoleModal.open}>Reveal Role</Button>}
          </div>
        </div>
        <div style={{marginBottom:"2vmin", marginTop:"4vmin"}}>
          {isCultLeader && (
            <Button onClick={() => selectCultists()}>Cultification</Button>
            )}
          {isChosenOne && (
            <Button onClick={() => chosenOneDecision()}>Decision</Button>
            )}
        </div>
        <div style={{marginBottom:"4vmin"}}>
          {nobles.length > 0 && gameStarted && (
            <Button onClick={noblesModal.open}>See Nobles</Button>
          )}
        </div>
        <div>
          <Button onClick={() => endGame()}>End Game</Button>
        </div>
        </>
      ) : (
        <>
        <div style={{marginBottom:"2vmin", marginTop:"4vmin"}}>
          <Button onClick={rolesPoolSelectionModal.open} style={{marginRight:"1.5vmin"}}>Select Roles</Button>
          <Button onClick={startGame} style={{marginRight:"1.5vmin"}}>Start Game</Button>
        </div>
        <div style={{ marginTop: 'auto', width: '100%', textAlign: 'center' }}>
          <Button onClick={leaveRoom}>Leave Room</Button>
        </div>
        </>
      )}
      
    <RolesPoolSelectionModal
      isOpen={rolesPoolSelectionModal.isOpen}
      roles={roles}
      selectedRolesPool={selectedRolesPool}
      setSelectedRolesPool={setSelectedRolesPool}
      onOk={confirmRolesPoolSelection}
      onCancel={rolesPoolSelectionModal.close}
    />

    <RoleSelectionModal
      isOpen={roleSelectionModal.isOpen}
      potentialRoles={potentialRoles}
      selectedRole={selectedRole}
      setSelectedRole={setSelectedRole} 
      onOk={confirmRoleSelection}
      onCancel={roleSelectionModal.close}
    />

    <TeamOverviewModal
      isOpen={teamOverviewModal.isOpen}
      team={team}
      onOk={teamOverviewModal.close}
      onCancel={teamOverviewModal.close}
    />

    <NoblesModal
      isOpen={noblesModal.isOpen}
      nobles={nobles}
      onOk={noblesModal.close}
      onCancel={noblesModal.close}
    />

    <Modal
      title="Do you want to reveal your role?"
      open={revealRoleModal.isOpen}
      onOk={confirmRevealRole}
      onCancel={revealRoleModal.close}
      centered
    >
      <p style={{color:"white"}}>Once you reveal your role, all players in the room will see it.</p>
    </Modal>
    </div>
  );
};
  