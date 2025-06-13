import { useState } from 'react';
import { Modal, Button, Checkbox } from 'antd';
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