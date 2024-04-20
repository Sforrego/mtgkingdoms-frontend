import { useEffect } from "react";

import { useAppContext } from '../Context/AppContext';

import { Role } from "../Types/Role";
import { User } from "../Types/User";
import { RoomCreatedEvent, JoinedRoomEvent, UserRoomEvent, GameStartedEvent, 
  GameUpdatedEvent, RolesPoolUpdatedEvent, 
  SelectRoleEvent, ReviewTeamEvent, ErrorEvent } from '../Types/SocketEvents';

export const SocketListener = () => {
    const { socket, roles, roomCode, gameStarted, setGameStarted, accountUser, isRevealed, setIsRevealed, 
      setSelectingRole, setPotentialRoles, setSelectedRole, setIsInRoom, setNobles, 
      setRoles, setRoomCode, setSelectedRolesPool, setTeam, setUsersInRoom, setReviewingTeam, setPreviousRoomCode } = useAppContext();

    useEffect(() => {
        if (socket) {
    
          if (roles.length===0){
            socket && socket.emit("getRoles");
          }

          socket.on("rolesData", (data: Role[]) => {
            setRoles(data);
          });

          socket.on("loginStatus", (event) => {
            console.log(`Received login status update`);
            console.log(event);
            const { roomCode, usersInRoom, team, activeGame, selectedRolesPool, selectingRole, reviewingTeam, potentialRoles, isRevealed } = event;
            if (roomCode) {
              setRoomCode(roomCode);
              setIsInRoom(true);
            } else {
              setIsInRoom(false);
              setRoomCode("");
            }

            setUsersInRoom(usersInRoom || []);
            setTeam(team || []);
            setGameStarted(activeGame);
            setSelectingRole(selectingRole);
            setReviewingTeam(reviewingTeam);
            setPotentialRoles(potentialRoles);
            setIsRevealed(isRevealed);
            setSelectedRolesPool(selectedRolesPool);
          });

          socket.on("roomCreated", ({ roomCode, users, selectedRoles }: RoomCreatedEvent) => {
            console.log(`Room created with code: ${roomCode}`);
            setRoomCode(roomCode);
            setIsInRoom(true);
            setUsersInRoom(users);
            setSelectedRolesPool(selectedRoles)
            setPreviousRoomCode(roomCode);
            localStorage.setItem('previousRoomCode', roomCode);
          });
          
          socket.on("joinedRoom", ({ roomCode, users, selectedRoles }: JoinedRoomEvent) => {
            console.log(`Joined room with code: ${roomCode}`);
            setRoomCode(roomCode);
            setIsInRoom(true);
            setUsersInRoom(users);
            setSelectedRolesPool(selectedRoles);
            setPreviousRoomCode(roomCode);
            localStorage.setItem('previousRoomCode', roomCode);
          });
    
          socket.on("leftRoom", () => {
            console.log(`Left room: ${roomCode}`);
            setIsInRoom(false);
            setUsersInRoom([]);
            setSelectingRole(false);
            setReviewingTeam(false);
            setGameStarted(false);
            setRoomCode("");
          });
    
          socket.on("userJoinedRoom", ({ usersInRoom }: UserRoomEvent) => {
            console.log("A user joined the room. Updated users:", usersInRoom);
            setUsersInRoom(usersInRoom);
          });
    
          socket.on("userLeftRoom", ({ usersInRoom }: UserRoomEvent) => {
            console.log("A user left the room. Updated users:", usersInRoom);
            setUsersInRoom(usersInRoom);
          });

              
          socket.on("rolesPoolUpdated", ({ roles }: RolesPoolUpdatedEvent) => {
            setSelectedRolesPool(roles);
          });
    
          socket.on("selectRole", ({ potentialRoles }: SelectRoleEvent) =>{
            console.log("Selecting role");
            setGameStarted(true);
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
            if(!gameStarted){
              setGameStarted(true);
            }
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
    
          socket.on("gameEnded", ({ usersInRoom }: UserRoomEvent) => {
            console.log("Game Ended");
            setUsersInRoom(usersInRoom);
            setNobles([]);
            setGameStarted(false);
            setReviewingTeam(false);
            setSelectingRole(false);
            setPotentialRoles([]);
            setSelectedRole(null);
          });

          socket.on("error", (message: ErrorEvent) => {
            alert(message)
          });
    
          return () => {
            socket.off("rolesData");
            socket.off("loginStatus");
            socket.off("joinedRoom");
            socket.off("roomCreated");
            socket.off("leftRoom");
            socket.off("userJoinedRoom");
            socket.off("userLeftRoom");
            socket.off("gameStarted");
            socket.off("gameUpdated");
            socket.off("gameEnded");
            socket.off("selectRole")
            socket.off("reviewTeam")
            socket.off("error");
          };
        }
      }, [isRevealed, roomCode, socket, accountUser, roles.length, gameStarted, setGameStarted, 
        setIsInRoom, setIsRevealed, setNobles, setPotentialRoles, setRoles, setReviewingTeam,
        setRoomCode, setSelectedRole, setSelectedRolesPool, setSelectingRole, setTeam, setUsersInRoom, setPreviousRoomCode]);

    return null;
}