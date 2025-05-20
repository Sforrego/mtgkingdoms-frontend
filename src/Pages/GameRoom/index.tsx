import { Button, Modal } from "antd";

import { PlayerInGame } from "../../Components/PlayerInGame";
import { RolesPoolSelectionModal } from "../../Components/Modals/RolesPoolSelectionModal";
import { RoleSelectionModal } from "../../Components/Modals/RoleSelectionModal";
import { TeamReviewModal } from "../../Components/Modals/TeamReviewModal";
import { TeamOverviewModal } from "../../Components/Modals/TeamOverviewModal";
import { NoblesModal } from "../../Components/Modals/NoblesModal";
import { validateRolesBeforeStart } from "../../Utils/validateRoles";
import { useModal } from '../../Hooks/useModal';
import { useAppContext } from '../../Context/AppContext';
import { EndGameModal, SelectCultistsModal } from "../../Services/gameServiceModals";
import { 
  startGame, 
  leaveRoom,
  revealRole,
  updateRolesPool,
  selectRole,
  confirmTeam,
} from "../../Services/gameService";
import "./index.css";


export const GameRoom = () => {
  const {
    roomCode,
    accountUser,
    socket,
    usersInRoom,
    roles,
    selectedRolesPool,
    selectedRole,
    selectingRole,
    gameStarted,
    isRevealed,
    team,
    nobles,
    potentialRoles,
    reviewingTeam,
    setSelectedRolesPool,
    setSelectedRole,
  } = useAppContext();
  const revealRoleModal = useModal();
  const rolesPoolSelectionModal = useModal();
  const roleSelectionModal = useModal();
  const teamReviewModal = useModal();
  const noblesModal = useModal();
  const teamOverviewModal = useModal();
  const gameUser = usersInRoom?.find(u => u.userId === accountUser?.localAccountId);
  const userRole = usersInRoom && usersInRoom.length > 0 ? usersInRoom.find(u => u.userId === accountUser?.localAccountId)?.role : undefined;
  const isCultLeader = userRole ? ["Cult Leader", "Cultist"].includes(userRole.name) && isRevealed : false;
  const canConceal = userRole?.ability?.toLowerCase().includes("conceal");

  const confirmRoleSelection = () => {
    roleSelectionModal.close();
    selectRole(socket, accountUser?.localAccountId, roomCode, selectedRole);
  };

  const confirmTeamReview = () => {
    teamReviewModal.close();
    confirmTeam(socket, accountUser?.localAccountId, roomCode);
  };

  const confirmRolesPoolSelection = () => {
    if(validateRolesBeforeStart(selectedRolesPool)){
      updateRolesPool(selectedRolesPool, socket, roomCode);
      rolesPoolSelectionModal.close();
    }
  };

  const confirmRevealRole = () => {
    revealRole(accountUser, socket, roomCode);
    revealRoleModal.close();
  };

  const concealRole = () => {
    if (socket) {
      console.log("Concealing role");
      socket.emit("conceal", { userId: accountUser?.localAccountId, roomCode });
    }
  };

  return (
<div className="game-room">
  <div style={{ display: "flex", justifyContent: "center", alignItems: "center", marginBottom: "5vmin" }}>
    <p style={{ color: "white", margin: "0", flex: 1, textAlign: "center" }}>Room: {roomCode}</p>
  </div>
      <div className="PlayersIconsHolder">
        {usersInRoom.map((user, index) => (
          <PlayerInGame key={index} user={user} />
          ))}
      </div>
      {selectingRole && (usersInRoom.some(user => !user.hasSelectedRole) && potentialRoles?.length > 0) ? (
        <>
          {!gameUser?.hasSelectedRole && (
            <Button onClick={roleSelectionModal.open} style={{ marginLeft: "1.5vmin", marginTop: "2.5vmin"}}>Select Role</Button>
          )}          
          <p style={{color: "white"}}>Players selecting role:</p>
          <ul style={{ paddingLeft: '20px' }}> {/* Adjust padding as needed */}
            {usersInRoom.filter(user => !user.hasSelectedRole).map((user, index) => (
              <li key={index} style={{ color: "white", listStylePosition: 'inside' }}>
                {user.username}
              </li>
            ))}
          </ul>
      </>
      ) : reviewingTeam && usersInRoom.some(user => !user.hasReviewedTeam) ? (
        <>
          {!gameUser?.hasReviewedTeam && (
            <Button onClick={teamReviewModal.open} style={{ marginLeft: "1.5vmin", marginTop: "2.5vmin"}}>Review Team</Button>
          )}  
          <p style={{color: "white"}}>Players reviewing team:</p>
          <ul style={{ paddingLeft: '20px' }}> {/* Adjust padding as needed */}
            {usersInRoom.filter(user => !user.hasReviewedTeam).map((user, index) => (
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
            <Button onClick={teamOverviewModal.open}>View Role(s)</Button>
            {!isRevealed && <Button onClick={revealRoleModal.open}>Reveal Role</Button>}
            {isRevealed && canConceal && <Button onClick={concealRole}>Conceal</Button>}
          </div>
        </div>
        <div style={{marginBottom:"2vmin", marginTop:"4vmin"}}>
          {isCultLeader && (
            <SelectCultistsModal socket={socket} userId={accountUser?.localAccountId} usersInRoom={usersInRoom} roomCode={roomCode} />
            )}
        </div>
        <div style={{marginBottom:"4vmin"}}>
          {nobles?.length > 0 && gameStarted && (
            <Button onClick={noblesModal.open}>See Nobles</Button>
          )}
        </div>
        </>
      ) : (
        <>
        <div style={{marginBottom:"2vmin", marginTop:"4vmin"}}>
          <Button onClick={rolesPoolSelectionModal.open} style={{marginRight:"1.5vmin"}}>Select Roles</Button>
          <Button onClick={() => startGame(socket, roomCode)} style={{marginRight:"1.5vmin"}}>Start Game</Button>
        </div>
        <div style={{ marginTop: 'auto', width: '100%', textAlign: 'center' }}>
          <Button onClick={() => leaveRoom(accountUser, socket, roomCode)}>Leave Room</Button>
        </div>
        </>
      )}
    
    {gameStarted && (
      <div className="end-game-button-container">
        <EndGameModal usersInRoom={usersInRoom} roomCode={roomCode} socket={socket} />
      </div>
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

    <TeamReviewModal
      isOpen={teamReviewModal.isOpen}
      team={team}
      onOk={confirmTeamReview}
      onCancel={teamReviewModal.close}
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
  