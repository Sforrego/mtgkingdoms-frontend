import { useState } from 'react';
import { Modal, Button, Checkbox, Radio } from 'antd';
import { User } from "../Types/User";
import { Socket } from 'socket.io-client';

export const EndGameModal = ({ socket, usersInRoom, roomCode }: { socket: Socket | null, usersInRoom: User[], roomCode: string }) => {
  const [open, setOpen] = useState(false);
  const [currentWinnersIds, setCurrentWinnersIds] = useState<string[]>([]);

  const handleOk = () => {
    socket && socket.emit("endGame", { roomCode, winnersIds: currentWinnersIds });
    setOpen(false);
  };

  const handleCancel = () => {
    setOpen(false);
  };

  const handleCheckChange = (checkedValues: any[]) => {
    setCurrentWinnersIds(checkedValues);
  };

  return (
    <>
      <Button onClick={() => setOpen(true)}>End Game</Button>
      <Modal
        title="Select winners"
        open={open}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Checkbox.Group style={{ width: '100%' }} onChange={handleCheckChange}>
          {usersInRoom.map((user) => (
            <div key={user.userId}>
              <Checkbox value={user.userId}>{user.username}</Checkbox>
            </div>
          ))}
        </Checkbox.Group>
      </Modal>
    </>
  );
};
  
  export const SelectCultistsModal = ({ socket, userId, usersInRoom, roomCode }: { socket: Socket | null, userId: string | undefined, usersInRoom: User[], roomCode: string }) => {
    const [open, setOpen] = useState(false);
    const [cultistsIds, setCultistsIds] = useState<string[]>([]);

    const handleOk = () => {
      socket && socket.emit("cultification", { userId, roomCode, cultistsIds });
      setOpen(false);
    };

    const handleCancel = () => {
      setOpen(false);
    };

    const handleCheckChange = (checkedValues: any[]) => {
      setCultistsIds(checkedValues);
    };

    return (
      <>
        <Button onClick={() => setOpen(true)}>Add members to the Cult</Button>
        <Modal
          title="Add members to the Cult"
          open={open}
          onOk={handleOk}
          onCancel={handleCancel}
        >
          <Checkbox.Group style={{ width: '100%' }} onChange={handleCheckChange}>
            {usersInRoom.map((user) => (
              <div key={user.userId}>
                <Checkbox value={user.userId}>{user.username}</Checkbox>
              </div>
            ))}
          </Checkbox.Group>
        </Modal>
      </>
    );
  };

  export const ChosenOneDecisionModal = ({ socket, userId, roomCode }: { socket: Socket | null, userId: string | undefined, roomCode: string }) => {
    const [open, setOpen] = useState(false);
    const [decision, setDecision] = useState("");

    const handleOk = () => {
      socket && socket.emit("chosenOneDecision", { userId, roomCode, decision });
      setOpen(false);
    };

    const handleCancel = () => {
      setOpen(false);
    };

    const handleCheckChange = (event: any) => {
      setDecision(event.target.value);
    };

    return (
      <>
        <Button onClick={() => setOpen(true)}>Choose your path</Button>
        <Modal
          title="Choose your path"
          open={open}
          onOk={handleOk}
          onCancel={handleCancel}
        >
          <Radio.Group style={{ width: '100%' }} onChange={handleCheckChange}>
            <Radio value="Demon">Demon</Radio>
            <Radio value="Angel">Angel</Radio>
          </Radio.Group>
        </Modal>
      </>
    );
  };