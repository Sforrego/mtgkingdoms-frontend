import { useEffect } from "react";

import { useAppContext } from '../Context/AppContext';

import { Role } from "../Types/Role";
import { User } from "../Types/User";
import { RoomCreatedEvent, JoinedRoomEvent, UserRoomEvent, GameStartedEvent, 
  GameUpdatedEvent, RolesPoolUpdatedEvent, WithRevealedRolesUpdatedEvent,
  SelectRoleEvent, ErrorEvent } from '../Types/SocketEvents';
  import { preloadImage } from "../Utils/preloadImages";
import { AccountInfo } from "@azure/msal-browser";

export const SocketListener = () => {
    const { socket, roles, roomCode, gameStarted, isLoggedIn, accountUser, isRevealed,setGameStarted, setIsRevealed, setWithRevealedRoles,
      setSelectingRole, setPotentialRoles, setSelectedRole, setIsInRoom, setNobles, setIsLoggedIn, setAccountUser,
      setRoles, setRoomCode, setSelectedRolesPool, setTeam, setUsersInRoom, setPreviousRoomCode } = useAppContext();

    useEffect(() => {
        if (socket) {
    
          if (roles.length===0){
            socket && socket.emit("getRoles");
          }

          socket.on("rolesData", (data: Role[]) => {
            setRoles(data);
            data.forEach(role => {
            if (role.image) preloadImage(role.image);
            });
          });

          socket.on("loginStatus", (event) => {
            console.log(`Received login status update`);
            console.log(event);
            const { userId, username, roomCode, usersInRoom, team, activeGame, selectedRolesPool, 
              selectingRole, potentialRoles, isRevealed, withRevealedRoles } = event;
            if (!isLoggedIn){
              setIsLoggedIn(true);
              // Set the user data in the context if no user data
              if (!accountUser) {
                const guestAccountUser: AccountInfo = {
                  homeAccountId: userId,
                  localAccountId: userId,
                  name: username,
                  username: username,
                  environment: "",
                  tenantId: "",
                  idToken: "",
                  idTokenClaims: {},
                };
                setAccountUser(guestAccountUser);
                localStorage.setItem('accountUser', JSON.stringify(guestAccountUser));
              }
            }

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
            setPotentialRoles(potentialRoles);
            setIsRevealed(isRevealed);
            setSelectedRolesPool(selectedRolesPool);
            setWithRevealedRoles(withRevealedRoles);
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
          
          socket.on("joinedRoom", ({ roomCode, users, selectedRoles, withRevealedRoles }: JoinedRoomEvent) => {
            console.log(`Joined room with code: ${roomCode}`);
            setRoomCode(roomCode);
            setIsInRoom(true);
            setUsersInRoom(users);
            setSelectedRolesPool(selectedRoles);
            setPreviousRoomCode(roomCode);
            setWithRevealedRoles(withRevealedRoles);
            localStorage.setItem('previousRoomCode', roomCode);
          });
    
          socket.on("leftRoom", () => {
            console.log(`Left room: ${roomCode}`);
            setIsInRoom(false);
            setUsersInRoom([]);
            setSelectingRole(false);
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
    
          socket.on("updateRevealedRolesSetting", ({ withRevealedRoles }: WithRevealedRolesUpdatedEvent) => {
            setWithRevealedRoles(withRevealedRoles);
          });

          socket.on("selectRole", ({ potentialRoles }: SelectRoleEvent) =>{
            console.log("Selecting role");
            setGameStarted(true);
            setSelectingRole(true);
            setPotentialRoles(potentialRoles);
          })
    
          socket.on("gameStarted", ({ team, nobles }: GameStartedEvent) => {
            console.log("Game started.");
            setTeam(team);
            if (nobles.length > 0){
              setNobles(nobles)
            }
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
      }, [isRevealed, roomCode, socket, accountUser, roles.length, gameStarted, isLoggedIn, setGameStarted, setAccountUser,
        setIsInRoom, setIsRevealed, setNobles, setPotentialRoles, setRoles, setIsLoggedIn, setWithRevealedRoles,
        setRoomCode, setSelectedRole, setSelectedRolesPool, setSelectingRole, setTeam, setUsersInRoom, setPreviousRoomCode]);

    return null;
}