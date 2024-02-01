import { Modal, Checkbox, Radio } from 'antd';
import { User } from "./Types/User";
import { Socket } from 'socket.io-client';

export const endGame = (socket: Socket | null, users: User[] = [], roomCode: string) => {
    if(socket){
      let currentWinnersIds: string[] = [];
      const handleCheckChange = (checkedValues: any[]) => {
        currentWinnersIds = checkedValues;
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
          socket && socket.emit("chosenOneDecision", { userId, roomCode, decision: decision });
        },
      });
    }
  };