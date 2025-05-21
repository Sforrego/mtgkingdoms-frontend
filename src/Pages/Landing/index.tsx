import { Button, Input, Modal, Space, Typography } from "antd";
import React, { useState } from "react";

const { Text } = Typography;

type LandingProps =
  | {
      roomCode: string;
      setRoomCode: (roomCode: string) => void;
      joinRoom: (roomCode: string) => void;
      createRoom: () => void;
      handleLogin?: never;
      handleGuestLogin?: never;
    }
  | {
      handleLogin: () => void;
      handleGuestLogin: (username: string) => void;
      roomCode?: never;
      setRoomCode?: never;
      joinRoom?: never;
      createRoom?: never;
    };

export const Landing = (props: LandingProps) => {
  const [isGuestModalVisible, setGuestModalVisible] = useState(false);
  const [guestUsername, setGuestUsername] = useState("");
  const [error, setError] = useState("");

  const showGuestModal = () => {
    setGuestModalVisible(true);
    setError("");
    setGuestUsername("");
  };

  const handleGuestOk = () => {
    const trimmed = guestUsername.trim();
    if (trimmed.length < 3) {
      setError("Username must be at least 3 characters.");
      return;
    }
    props.handleGuestLogin?.(trimmed);
    setGuestModalVisible(false);
    setGuestUsername("");
    setError("");
  };

  const handleGuestCancel = () => {
    setGuestModalVisible(false);
    setGuestUsername("");
    setError("");
  };

  return "handleLogin" in props ? (
    <>
      <Space direction="vertical">
        <Button onClick={props.handleLogin} type="primary">
          Login / Create Account
        </Button>
        <Button onClick={showGuestModal}>Continue as Guest</Button>
      </Space>

      <Modal
        title="Enter a Username"
        open={isGuestModalVisible}
        onOk={handleGuestOk}
        onCancel={handleGuestCancel}
        okText="Continue"
      >
        <Input
          value={guestUsername}
          onChange={(e) => {
            setGuestUsername(e.target.value);
            if (error && e.target.value.trim().length >= 3) {
              setError("");
            }
          }}
          placeholder="Guest username"
          onPressEnter={handleGuestOk}
        />
        {error && <Text type="danger">{error}</Text>}
      </Modal>
    </>
  ) : (
    <div key="formContainer" className="form-container">
      <input
        className="input-field"
        type="text"
        value={props.roomCode}
        onChange={(e) => props.setRoomCode(e.target.value)}
        placeholder="Enter room code"
      />
      <Button onClick={() => props.joinRoom(props.roomCode)}>Join Room</Button>
      <Button onClick={props.createRoom}>Create Room</Button>
    </div>
  );
};