import { AccountInfo } from "@azure/msal-browser";
import { Role } from "./Types/Role";
import { User } from "./Types/User";
import { getSocket } from "./socketService";
import { Modal, Checkbox } from "antd";

export const createRoom = (user: AccountInfo) => {
  const socket = getSocket();
  socket && socket.emit("create", { userId: user.homeAccountId, username: user.name });
};

export const joinRoom = (user: AccountInfo, roomCode: string) => {
  const socket = getSocket();
  socket && socket.emit("join", { userId: user.homeAccountId, username: user.name, roomCode });
};

export const startGame = (roomCode: string) => {
  const socket = getSocket();
  socket && socket.emit("startGame", { roomCode });
};

export const leaveRoom = (user: AccountInfo, roomCode: string) => {
  const socket = getSocket();
  socket && socket.emit("leaveRoom", { userId: user.homeAccountId, username: user.name, roomCode });
};

export const revealRole = (user: AccountInfo, roomCode: string) => {
  const socket = getSocket();
  socket && socket.emit("revealRole", { userId: user.homeAccountId, roomCode });
};

export const selectRoles = (selectedRoles: Role[], roomCode: string) => {
  const socket = getSocket();
  socket && socket.emit("selectRoles", { roles: selectedRoles, roomCode });
};

export const endGame = (users: User[] = [], roomCode: string) => {
  const socket = getSocket();
  let currentWinnersIds: string[] = [];

  const handleCheckChange = (checkedValues: any[]) => {
    currentWinnersIds = checkedValues;
    console.log(checkedValues);
  };
  
  Modal.confirm({
    title: 'Select winners',
    content: (
      <Checkbox.Group style={{ width: '100%' }} onChange={handleCheckChange}>
        {users.map((user) => (
          <div key={user.userId}>
            <Checkbox value={user.userId}>{user.username}</Checkbox>
          </div>
        ))}
      </Checkbox.Group>
    ),
    onOk() {
      socket && socket.emit("endGame", { roomCode, winnersIds: currentWinnersIds });
    },
  });
};
