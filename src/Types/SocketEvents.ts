import { Role } from "../Types/Role";
import { User } from "../Types/User";

export interface RoleDataEvent {
    data: Role[];
  }
  
  export interface RoomCreatedEvent {
    roomCode: string;
    users: User[];
  }
  
  export interface JoinedRoomEvent extends RoomCreatedEvent {
    selectedRoles: Role[];
  }
  
  export interface UserRoomEvent {
    users: User[];
  }
  
  export interface GameStartedEvent {
    team: User[];
    nobles: Role[];
  }
  
  export interface GameUpdatedEvent {
    usersInRoom: User[];
  }
  
  export interface ReconnectedToRoomEvent {
    team: User[];
    usersInRoom: User[];
    roomCode: string;
    activeGame: boolean;
    selectingRole: boolean;
    reviewingTeam: boolean;
  }
  
  export interface GameEndedEvent {
    users: User[];
  }
  
  export interface RolesPoolUpdatedEvent {
    roles: Role[];
  }
  
  export interface SelectRoleEvent {
    potentialRoles: Role[];
  }

  export interface ReviewTeamEvent {
    team: User[];
  }
  
  export interface ErrorEvent {
    message: string;
  }