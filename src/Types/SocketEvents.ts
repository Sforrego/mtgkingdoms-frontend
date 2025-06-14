import { Role } from "../Types/Role";
import { User } from "../Types/User";

export interface RoleDataEvent {
    data: Role[];
  }
  
  export interface RoomCreatedEvent {
    roomCode: string;
    users: User[];
    selectedRoles: Role[];
  }
  
  export interface JoinedRoomEvent extends RoomCreatedEvent {
    selectedRoles: Role[];
    withRevealedRoles: boolean;
  }
  
  export interface UserRoomEvent {
    usersInRoom: User[];
  }
  
  export interface GameStartedEvent {
    team: User[];
    nobles: Role[];
  }
  
  export interface GameUpdatedEvent {
    usersInRoom: User[];
  }
  
  export interface GameEndedEvent {
    users: User[];
  }
  
  export interface RolesPoolUpdatedEvent {
    roles: Role[];
  }
  
  export interface WithRevealedRolesUpdatedEvent {
    withRevealedRoles: boolean;
  }

  export interface SelectRoleEvent {
    potentialRoles: Role[];
  }
  
  export interface ErrorEvent {
    message: string;
  }