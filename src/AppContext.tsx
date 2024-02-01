import { createContext, useState, ReactNode } from 'react';
import { AccountInfo } from '@azure/msal-browser';
import { Socket } from 'socket.io-client';

import { useSocket } from './useSocket';
import { useAuth } from './useAuth';

import { Role } from "./Types/Role";
import { User } from "./Types/User";
import { UserData } from "./Types/UserData";

const SERVER = process.env.REACT_APP_SERVER as string;

interface AppProviderProps {
  children: ReactNode;
}

export interface AppContextType {
  isConnected: boolean;
  setIsConnected: React.Dispatch<React.SetStateAction<boolean>>;
  isInRoom: boolean;
  setIsInRoom: React.Dispatch<React.SetStateAction<boolean>>;
  socket: any; // replace with the actual type
  isLoggedIn: boolean;
  user: any; // replace with the actual type
  loginHandler: () => void; // replace with the actual type
  logoutHandler: (user: AccountInfo | null, socket: Socket, roomCode: string) => Promise<void>;
  userData: UserData | null;
  setUserData: React.Dispatch<React.SetStateAction<UserData | null>>;
  usersInRoom: User[];
  setUsersInRoom: React.Dispatch<React.SetStateAction<User[]>>;
  roles: Role[];
  setRoles: React.Dispatch<React.SetStateAction<Role[]>>;
  potentialRoles: Role[];
  setPotentialRoles: React.Dispatch<React.SetStateAction<Role[]>>;
  selectedRolesPool: Role[];
  setSelectedRolesPool: React.Dispatch<React.SetStateAction<Role[]>>;
  roomCode: string;
  setRoomCode: React.Dispatch<React.SetStateAction<string>>;
  showRoles: boolean;
  setShowRoles: React.Dispatch<React.SetStateAction<boolean>>;
  profile: boolean;
  setProfile: React.Dispatch<React.SetStateAction<boolean>>;
  team: User[];
  setTeam: React.Dispatch<React.SetStateAction<User[]>>;
  nobles: Role[];
  setNobles: React.Dispatch<React.SetStateAction<Role[]>>;
  gameStarted: boolean;
  setGameStarted: React.Dispatch<React.SetStateAction<boolean>>;
  isRevealed: boolean;
  setIsRevealed: React.Dispatch<React.SetStateAction<boolean>>;
  selectedRole: Role | null;
  setSelectedRole: React.Dispatch<React.SetStateAction<Role | null>>;
  selectingRole: boolean;
  setSelectingRole: React.Dispatch<React.SetStateAction<boolean>>;
}

export const AppContext = createContext<AppContextType | null>(null);

export const AppProvider = ({ children }: AppProviderProps) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isInRoom, setIsInRoom] = useState(false);
  const { socket } = useSocket(SERVER, setIsConnected, setIsInRoom);
  const { isLoggedIn, user, loginHandler, logoutHandler } = useAuth();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [usersInRoom, setUsersInRoom] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [potentialRoles, setPotentialRoles] = useState<Role[]>([]);
    const [selectedRolesPool, setSelectedRolesPool] = useState<Role[]>([]);
    const [roomCode, setRoomCode] = useState("");
    const [showRoles, setShowRoles] = useState(false);
    const [profile, setProfile] = useState(false);
    const [team, setTeam] = useState<User[]>([]);
    const [nobles, setNobles] = useState<Role[]>([]);
    const [gameStarted, setGameStarted] = useState<boolean>(false);
    const [isRevealed, setIsRevealed] = useState<boolean>(false);
    const [selectedRole, setSelectedRole] = useState<Role | null>(null);
    const [selectingRole, setSelectingRole] = useState<boolean>(false);

    return (
      <AppContext.Provider value={{
        isConnected,
        setIsConnected,
        isInRoom,
        setIsInRoom,
        socket,
        isLoggedIn,
        user,
        loginHandler,
        logoutHandler,
        userData,
        setUserData,
        usersInRoom,
        setUsersInRoom,
        roles,
        setRoles,
        potentialRoles,
        setPotentialRoles,
        selectedRolesPool,
        setSelectedRolesPool,
        roomCode,
        setRoomCode,
        showRoles,
        setShowRoles,
        profile,
        setProfile,
        team,
        setTeam,
        nobles,
        setNobles,
        gameStarted,
        setGameStarted,
        isRevealed,
        setIsRevealed,
        selectedRole,
        setSelectedRole,
        selectingRole,
        setSelectingRole
      }}>
        {children}
      </AppContext.Provider>
    );
};