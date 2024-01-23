import { AccountInfo } from "@azure/msal-browser";
import { Role } from "./Types/Role";
import { User } from "./Types/User";
import { Modal, Checkbox, Radio } from "antd";
import { Socket } from "socket.io-client";

export const createRoom = (user: AccountInfo | null, socket: Socket | null) => {
  if (user && socket) {
    socket.emit("create", { userId: user.localAccountId, username: user.name });
  } else {
    console.log("User is not logged in or Connection not established");
  }
};

export const joinRoom = (user: AccountInfo | null, socket: Socket | null, roomCode: string) => {
  if (user && socket) {
    socket.emit("join", { userId: user.localAccountId, username: user.name, roomCode });
  } else {
    console.log("User is not logged in or Connection not established");
  }
};

export const startGame = (socket: Socket | null, roomCode: string) => {
  if (socket) {
    socket.emit("startGame", { roomCode });
  } else {
    console.log("Connection not established");
  }
};

export const leaveRoom = (user: AccountInfo | null, socket: Socket | null, roomCode: string) => {
  if (user && socket) {
    socket.emit("leaveRoom", { userId: user.localAccountId, username: user.name, roomCode });
  } else {
    console.log("User is not logged in or Connection not established");
  }
};

export const revealRole = (user: AccountInfo | null, socket: Socket | null, roomCode: string) => {
  if (user && socket) {
    socket.emit("revealRole", { userId: user.localAccountId, roomCode });
  } else {
    console.log("User is not logged in or Connection not established");
  }
};

export const selectRoles = (selectedRoles: Role[], socket: Socket | null, roomCode: string) => {
  if (socket) {
    socket.emit("selectRoles", { roles: selectedRoles, roomCode });
  } else {
    console.log("Connection not established");
  }
};

export const endGame = (socket: Socket | null, users: User[] = [], roomCode: string) => {
  if(socket){
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
  }
};

export const selectCultists = (socket: Socket | null, userId: string | undefined, users: User[] = [], roomCode: string) => {
  if(socket){
    let cultistsIds: string[] = [];
    const handleCheckChange = (checkedValues: any[]) => {
      cultistsIds = checkedValues;
      console.log(cultistsIds);
    };
    
    Modal.confirm({
      title: 'Add members to the Cult',
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
        socket && socket.emit("cultification", { userId, roomCode, cultistsIds: cultistsIds });
      },
    });
  }
};

export const chosenOneDecision = (socket: Socket | null, userId: string | undefined, roomCode: string) => {
  if(socket){
    let decision: string = "";
    const handleCheckChange = (event: any) => {
      decision = event.target.value;
    };
    
    Modal.confirm({
      title: 'Choose your path',
      content: (
        <Radio.Group style={{ width: '100%' }} onChange={handleCheckChange}>
          <Radio value="Demon">Demon</Radio>
          <Radio value="Angel">Angel</Radio>
        </Radio.Group>
      ),
      onOk() {
        console.log(decision);
        socket && socket.emit("chosenOneDecision", { userId, roomCode, decision: decision });
      },
    });
  }
};
