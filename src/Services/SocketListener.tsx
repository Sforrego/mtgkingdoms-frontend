import { useEffect } from "react";

import { useAppContext } from '../Context/AppContext';

import { Role } from "../Types/Role";
import { User } from "../Types/User";
import { RoomCreatedEvent, JoinedRoomEvent, UserRoomEvent, GameStartedEvent, 
  GameUpdatedEvent, ReconnectedToRoomEvent, RolesPoolUpdatedEvent, 
  SelectRoleEvent, ReviewTeamEvent, ErrorEvent } from '../Types/SocketEvents';

export const SocketListener = () => {
    const { socket, roles, roomCode, setGameStarted, accountUser, isRevealed, setIsRevealed, 
      setSelectingRole, setPotentialRoles, setSelectedRole, setIsInRoom, setNobles, 
      setRoles, setRoomCode, setSelectedRolesPool, setTeam, setUsersInRoom, setReviewingTeam } = useAppContext();

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

              
          socket.on("rolesPoolUpdated", ({ roles }: RolesPoolUpdatedEvent) => {
            setSelectedRolesPool(roles);
          });
    
          socket.on("selectRole", ({ potentialRoles }: SelectRoleEvent) =>{
            console.log("Selecting role");
            setSelectingRole(true);
            setPotentialRoles(potentialRoles);
          })

          socket.on("reviewTeam", ({ team }: ReviewTeamEvent) =>{
            console.log("Reviewing team");
            setSelectingRole(false);
            setReviewingTeam(true);
            setTeam(team);
            console.log(team);
          })
    
          socket.on("gameStarted", ({ nobles }: GameStartedEvent) => {
            console.log("Game started. Role assigned.");
            if (nobles.length > 0){
              setNobles(nobles)
            }
            setReviewingTeam(false);
            setGameStarted(true);
          });
    
          socket.on("gameUpdated", ({ usersInRoom }: GameUpdatedEvent) => {
            console.log("Game Updated.");
            setUsersInRoom(usersInRoom);
            if(accountUser){
              const myUser: User | undefined = usersInRoom.find((u: User) => u.userId === accountUser.localAccountId);
              if (myUser) {
                if (myUser.isRevealed !== isRevealed){
                  setIsRevealed(myUser.isRevealed);
                }
              } else {
                console.log("User not found in usersInRoom")
              }
            }
          });
    
          socket.on("reconnectedToRoom", ({ team, usersInRoom, roomCode, activeGame, selectingRole, reviewingTeam }: ReconnectedToRoomEvent) => {
            console.log(team);
            if(accountUser){
              console.log("Reconnected to room");
              setRoomCode(roomCode);
              setIsInRoom(true);
              setUsersInRoom(usersInRoom);
              setGameStarted(activeGame);
              setTeam(team);
              const myUser: User | undefined = usersInRoom.find((u: User) => u.userId === accountUser.localAccountId);
              if (myUser) {
                setIsRevealed(myUser.isRevealed);
                setPotentialRoles(myUser.potentialRoles);
                setSelectingRole(selectingRole);
                setReviewingTeam(reviewingTeam);
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
            socket.off("selectRole")
            socket.off("reviewTeam")
            socket.off("error");
          };
        }
      }, [isRevealed, roomCode, socket, accountUser, roles.length, setGameStarted, 
        setIsInRoom, setIsRevealed, setNobles, setPotentialRoles, setRoles, setReviewingTeam,
        setRoomCode, setSelectedRole, setSelectedRolesPool, setSelectingRole, setTeam, setUsersInRoom]);

    return null;
}