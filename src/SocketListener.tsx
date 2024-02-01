import { useEffect } from "react";

import { useAppContext } from './AppContext';

import { Role } from "./Types/Role";
import { User } from "./Types/User";
import { RoomCreatedEvent, JoinedRoomEvent, UserRoomEvent, GameStartedEvent, GameUpdatedEvent, ReconnectedToRoomEvent, RolesPoolUpdatedEvent, SelectRoleEvent, ErrorEvent } from './Types/SocketEvents';

export const SocketListener = () => {
    const { socket, roles, roomCode, setGameStarted, user, isRevealed, setIsRevealed, setSelectingRole, setPotentialRoles, setSelectedRole, setIsInRoom, setNobles, setRoles, setRoomCode, setSelectedRolesPool, setTeam, setUsersInRoom } = useAppContext();

    useEffect(() => {
        if (socket) {
    
          if (roles.length===0){
            socket && socket.emit("getRoles");
          }
    
          socket.on("rolesData", (data: Role[]) => {
            setRoles(data);
            setSelectedRolesPool(data);
          });
    
          socket.on("roomCreated", ({ roomCode, users }: RoomCreatedEvent) => {
            console.log(`Room created with code: ${roomCode}`);
            setRoomCode(roomCode);
            setIsInRoom(true);
            setUsersInRoom(users);
          });
    
          socket.on("joinedRoom", ({ roomCode, users, selectedRoles }: JoinedRoomEvent) => {
            console.log(`Joined room with code: ${roomCode}`);
            setRoomCode(roomCode);
            setIsInRoom(true);
            setUsersInRoom(users);
            setSelectedRolesPool(selectedRoles);
          });
    
          socket.on("leftRoom", () => {
            console.log(`Left room: ${roomCode}`);
            setIsInRoom(false);
            setRoomCode("");
          });
    
          socket.on("userJoinedRoom", ({ users }: UserRoomEvent) => {
            console.log(`A user joined the room. Updated users: ${users}`);
            setUsersInRoom(users);
          });
    
          socket.on("userLeftRoom", ({ users }: UserRoomEvent) => {
            console.log(`A user left the room. Updated users: ${users}`);
            setUsersInRoom(users);
          });
    
          socket.on("gameStarted", ({ team, nobles }: GameStartedEvent) => {
            console.log("Game started. Role assigned.");
            setTeam(team);
            if (nobles.length > 0){
              setNobles(nobles)
            }
            setGameStarted(true);
          });
    
          socket.on("gameUpdated", ({ usersInRoom }: GameUpdatedEvent) => {
            console.log("Game Updated.");
            setUsersInRoom(usersInRoom);
            if(user){
              const myUser: User | undefined = usersInRoom.find((u: User) => u.userId === user.localAccountId);
              if (myUser) {
                if (myUser.isRevealed !== isRevealed){
                  setIsRevealed(myUser.isRevealed);
                }
              } else {
                console.log("User not found in usersInRoom")
              }
            }
          });
    
          socket.on("reconnectedToRoom", ({ team, usersInRoom, activeGame, roomCode }: ReconnectedToRoomEvent) => {
            if(user){
              console.log("Reconnected to room");
              setRoomCode(roomCode);
              setIsInRoom(true);
              setUsersInRoom(usersInRoom);
              setGameStarted(activeGame);
              setTeam(team);
              const myUser: User | undefined = usersInRoom.find((u: User) => u.userId === user.localAccountId);
              if (myUser) {
                setIsRevealed(myUser.isRevealed);
                setSelectingRole(!myUser.hasSelectedRole)
                setPotentialRoles(myUser.potentialRoles);
              } else {
                console.log("User not found in usersInRoom")
              }
            }
          });
    
          socket.on("gameEnded", ({ users }: UserRoomEvent) => {
            console.log("Game Ended");
            setUsersInRoom(users);
            setNobles([]);
            setGameStarted(false);
            setPotentialRoles([]);
            setSelectedRole(null);
          });
    
          socket.on("rolesPoolUpdated", ({ roles }: RolesPoolUpdatedEvent) => {
            setSelectedRolesPool(roles);
          });
    
          socket.on("selectRole", ({ potentialRoles }: SelectRoleEvent) =>{
            console.log("Selecting role")
            setSelectingRole(true);
            setPotentialRoles(potentialRoles);
          })
    
          socket.on("error", (message: ErrorEvent) => {
            alert(message)
          });
    
          return () => {
            socket.off("rolesData");
            socket.off("roomCreated");
            socket.off("joinedRoom");
            socket.off("leftRoom");
            socket.off("userJoinedRoom");
            socket.off("userLeftRoom");
            socket.off("gameStarted");
            socket.off("gameUpdated");
            socket.off("reconnectedToRoom");
            socket.off("gameEnded");
            socket.off("selectCharacter")
            socket.off("error");
          };
        }
      }, [isRevealed, roomCode, socket, user, roles.length, setGameStarted, 
        setIsInRoom, setIsRevealed, setNobles, setPotentialRoles, setRoles, 
        setRoomCode, setSelectedRole, setSelectedRolesPool, setSelectingRole, setTeam, setUsersInRoom]);

    return null;
}