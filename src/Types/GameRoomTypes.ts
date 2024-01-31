import { Role } from "../Types/Role";
import { User } from "../Types/User";


export type GameRoomProps = {
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
    updateRolesPool: (selectedRoles: Role[]) => void;
    selectRole: () => void;
    endGame: () => void; 
    setSelectedRole: (roles: Role) => void; 
    setSelectedRolesPool: (roles: Role[]) => void; 
    selectCultists: () => void;
    chosenOneDecision: () => void;
  };